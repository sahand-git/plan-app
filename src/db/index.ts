import Dexie, { type Table } from 'dexie';

export type Priority = 'low' | 'med' | 'high';

export interface TaskReminder {
  enabled: boolean;
  time: string; // 'HH:mm'
  recurring?: 'none' | 'daily' | 'weekdays' | 'weekly';
  recurringDays?: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  lastNotified?: string; // ISO date string
}

export interface Task {
  id?: number;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  completedAt?: string; // ISO timestamp
  priority?: Priority;
  time?: string; // HH:mm
  reminder?: TaskReminder;
  createdAt: string; // ISO timestamp
}

export interface DailyNote {
  id?: number;
  date: string; // YYYY-MM-DD (unique key)
  content: string;
  updatedAt: string; // ISO timestamp
}

export interface Habit {
  id?: number;
  title: string;
  color?: string; // Tailwind color or hex
  targetDays?: number[]; // 0-6 days of week, or empty for all days
  createdAt: string; // ISO timestamp
  archived?: boolean;
}

export interface HabitLog {
  id?: number;
  habitId: number;
  date: string; // YYYY-MM-DD
  completed: boolean;
}

export type TreeState = 'seedling' | 'sapling' | 'foliage' | 'flourishing' | 'gentle_wilt';

export interface TreeDayLog {
  id?: number;
  date: string; // YYYY-MM-DD
  tasksTotal: number;
  tasksCompleted: number;
  habitsTotal: number;
  habitsCompleted: number;
  completionRate: number; // 0.0 - 1.0
  state: TreeState;
  recordedAt: string; // ISO timestamp
}

export type TreeLifecycleStage = 'seed' | 'sapling' | 'mature';

export interface GardenTree {
  id?: number;
  speciesId: string;
  speciesName: string;
  cycleStart: string; // YYYY-MM-DD
  cycleEnd: string; // YYYY-MM-DD
  status: 'mature' | 'growing';
  isActive?: number; // 1 = currently active growing tree, 0 = past matured tree
  lifecycleStage: TreeLifecycleStage;
  daysTended: number;
  journalCount: number;
  totalTasks: number;
  ringsCount: number;
  earnedReason: string;
  completedAt?: string; // ISO timestamp
}

export interface AppSetting {
  key: string;
  value: any;
}

export class PlannerDatabase extends Dexie {
  tasks!: Table<Task, number>;
  notes!: Table<DailyNote, number>;
  habits!: Table<Habit, number>;
  habitLogs!: Table<HabitLog, number>;
  treeLogs!: Table<TreeDayLog, number>;
  gardenTrees!: Table<GardenTree, number>;
  settings!: Table<AppSetting, string>;

  constructor() {
    super('TheTreePlannerDB');
    this.version(1).stores({
      tasks: '++id, date, completed, priority, createdAt',
      notes: '++id, &date, updatedAt',
      habits: '++id, createdAt, archived',
      habitLogs: '++id, habitId, date, [habitId+date]',
      treeLogs: '++id, &date, state, recordedAt',
      settings: 'key',
    });
    this.version(2).stores({
      tasks: '++id, date, completed, priority, createdAt',
      notes: '++id, &date, updatedAt',
      habits: '++id, createdAt, archived',
      habitLogs: '++id, habitId, date, [habitId+date]',
      treeLogs: '++id, &date, state, recordedAt',
      gardenTrees: '++id, speciesId, cycleStart, status, isActive, completedAt',
      settings: 'key',
    });
  }
}

export const db = new PlannerDatabase();

/**
 * Safely upserts a daily note by date, preventing ConstraintError with Dexie unique &date index.
 */
export async function saveDailyNote(date: string, content: string): Promise<DailyNote> {
  const existing = await db.notes.where('date').equals(date).first();
  const timestamp = new Date().toISOString();
  if (existing && existing.id) {
    await db.notes.update(existing.id, {
      content,
      updatedAt: timestamp,
    });
    return { ...existing, content, updatedAt: timestamp };
  } else {
    const id = await db.notes.add({
      date,
      content,
      updatedAt: timestamp,
    });
    return { id, date, content, updatedAt: timestamp };
  }
}

/**
 * Record a day-end evaluation for the tree.
 */
export async function recordDayEndTreeLog(
  date: string,
  stats: { tasksTotal: number; tasksCompleted: number; habitsTotal: number; habitsCompleted: number }
): Promise<TreeDayLog> {
  const total = stats.tasksTotal + stats.habitsTotal;
  const completed = stats.tasksCompleted + stats.habitsCompleted;
  const rate = total > 0 ? completed / total : 1.0; // If nothing scheduled, gentle rest

  let state: TreeState = 'foliage';
  if (total > 0 && completed === 0) {
    state = 'gentle_wilt';
  } else if (rate >= 0.8) {
    state = 'flourishing';
  } else if (rate >= 0.5) {
    state = 'foliage';
  } else if (rate >= 0.25) {
    state = 'sapling';
  } else {
    state = 'seedling';
  }

  const existing = await db.treeLogs.where('date').equals(date).first();
  const record: TreeDayLog = {
    date,
    tasksTotal: stats.tasksTotal,
    tasksCompleted: stats.tasksCompleted,
    habitsTotal: stats.habitsTotal,
    habitsCompleted: stats.habitsCompleted,
    completionRate: rate,
    state,
    recordedAt: new Date().toISOString(),
  };

  if (existing && existing.id) {
    await db.treeLogs.update(existing.id, record);
    return { ...record, id: existing.id };
  } else {
    const id = await db.treeLogs.add(record);
    return { ...record, id };
  }
}

/**
 * Get setting with default fallback
 */
export async function getSetting<T>(key: string, defaultValue: T): Promise<T> {
  const item = await db.settings.get(key);
  if (!item) return defaultValue;
  return item.value as T;
}

/**
 * Set setting value
 */
export async function setSetting<T>(key: string, value: T): Promise<void> {
  await db.settings.put({ key, value });
}

/**
 * Calculates tree lifecycle stage automatically from cumulative completion data:
 * - Starts as 'seed' on day 1 / initial stage
 * - Advances to 'sapling' once 3+ actions completed or 2+ days tended
 * - Advances to 'mature' once 12+ actions completed or 5+ days tended
 */
export function calculateLifecycleStage(
  daysTended: number,
  totalActions: number
): TreeLifecycleStage {
  if (totalActions >= 12 || daysTended >= 5) {
    return 'mature';
  }
  if (totalActions >= 3 || daysTended >= 2) {
    return 'sapling';
  }
  return 'seed';
}

/**
 * Determines whether the active tree enters dimmed rest due to 2+ days of inactivity.
 * Checks the last 2 consecutive calendar days (e.g. today and yesterday).
 * If both days had zero completed tasks and zero completed habits, tree enters gentle dimmed rest.
 */
export function calculateIsDimmedNeglect(
  tasks: Task[],
  habits: Habit[],
  habitLogsMap: Record<number, Record<string, boolean>>,
  currentDateStr: string,
  treeLogs: TreeDayLog[]
): boolean {
  // Check today's completions
  const todayTasksCompleted = tasks.filter((t) => t.completed).length;
  const todayHabitsCompleted = habits.filter(
    (h) => h.id && habitLogsMap[h.id]?.[currentDateStr]
  ).length;
  const todayTotalCompleted = todayTasksCompleted + todayHabitsCompleted;

  if (todayTotalCompleted > 0) {
    return false; // Actively tended today, so not dimmed
  }

  // Today has 0 completions. Check yesterday:
  const cur = new Date(currentDateStr);
  cur.setDate(cur.getDate() - 1);
  const yesterdayStr = cur.toISOString().split('T')[0];

  const yesterdayLog = treeLogs.find((l) => l.date === yesterdayStr);
  let yesterdayCompleted = 0;
  if (yesterdayLog) {
    yesterdayCompleted = yesterdayLog.tasksCompleted + yesterdayLog.habitsCompleted;
  } else {
    yesterdayCompleted = habits.filter(
      (h) => h.id && habitLogsMap[h.id]?.[yesterdayStr]
    ).length;
  }

  return yesterdayCompleted === 0;
}

/**
 * Get or initialize current active growing tree
 */
export async function getActiveTree(): Promise<GardenTree> {
  const active = await db.gardenTrees
    .filter((t) => t.isActive === 1 || t.status === 'growing')
    .first();
  if (active) return active;

  // Initialize fresh seedling tree
  const today = new Date().toISOString().split('T')[0];
  const newTree: GardenTree = {
    speciesId: 'noble_pine',
    speciesName: 'Noble Pine',
    cycleStart: today,
    cycleEnd: today,
    status: 'growing',
    isActive: 1,
    lifecycleStage: 'seed',
    daysTended: 1,
    journalCount: 0,
    totalTasks: 0,
    ringsCount: 1,
    earnedReason: 'Fresh beginning rooted in unhurried daily presence.',
  };
  const id = await db.gardenTrees.add(newTree);
  return { ...newTree, id };
}

/**
 * Mature current tree and plant into permanent garden, then sprout fresh seed
 */
export async function matureCurrentTree(
  treeId: number,
  speciesId: string,
  speciesName: string,
  earnedReason: string
): Promise<{ maturedTree: GardenTree; newSeed: GardenTree }> {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  const existing = await db.gardenTrees.get(treeId);
  const matured: GardenTree = {
    ...(existing || {}),
    speciesId,
    speciesName,
    cycleStart: existing?.cycleStart || today,
    cycleEnd: today,
    status: 'mature',
    isActive: 0,
    lifecycleStage: 'mature',
    earnedReason,
    completedAt: now.toISOString(),
    daysTended: existing?.daysTended || 14,
    journalCount: existing?.journalCount || 6,
    totalTasks: existing?.totalTasks || 24,
    ringsCount: existing?.ringsCount || 2,
  };
  await db.gardenTrees.put(matured, treeId);

  // Sprout new seed
  const newSeed: GardenTree = {
    speciesId: 'noble_pine',
    speciesName: 'Noble Pine',
    cycleStart: today,
    cycleEnd: today,
    status: 'growing',
    isActive: 1,
    lifecycleStage: 'seed',
    daysTended: 1,
    journalCount: 0,
    totalTasks: 0,
    ringsCount: 1,
    earnedReason: 'New seedling awaiting gentle care.',
  };
  const newId = await db.gardenTrees.add(newSeed);
  return { maturedTree: matured, newSeed: { ...newSeed, id: newId } };
}

/**
 * Seeds initial matured grove and active cycle if table is empty
 */
export async function seedInitialGardenTreesIfEmpty(): Promise<void> {
  const count = await db.gardenTrees.count();
  if (count > 0) return;

  const initialTrees: GardenTree[] = [
    {
      speciesId: 'noble_pine',
      speciesName: 'Noble Pine',
      cycleStart: '2026-07-01',
      cycleEnd: '2026-07-21',
      status: 'growing',
      isActive: 1,
      lifecycleStage: 'mature',
      daysTended: 14,
      journalCount: 6,
      totalTasks: 28,
      ringsCount: 2,
      earnedReason: 'Earned through unwavering habit practice and steady daily rhythm.',
    },
    {
      speciesId: 'cherry_blossom',
      speciesName: 'Cherry Blossom',
      cycleStart: '2026-06-01',
      cycleEnd: '2026-06-21',
      status: 'mature',
      isActive: 0,
      lifecycleStage: 'mature',
      daysTended: 21,
      journalCount: 9,
      totalTasks: 42,
      ringsCount: 3,
      earnedReason: 'Unbroken quiet attention through spring bloom.',
      completedAt: '2026-06-21T20:00:00.000Z',
    },
    {
      speciesId: 'ancient_ginkgo',
      speciesName: 'Ancient Ginkgo',
      cycleStart: '2026-05-01',
      cycleEnd: '2026-05-28',
      status: 'mature',
      isActive: 0,
      lifecycleStage: 'mature',
      daysTended: 28,
      journalCount: 14,
      totalTasks: 50,
      ringsCount: 4,
      earnedReason: 'Harmonious mastery across tasks, habits, and daily reflection.',
      completedAt: '2026-05-28T20:00:00.000Z',
    },
    {
      speciesId: 'stone_bonsai',
      speciesName: 'Stone Bonsai',
      cycleStart: '2026-04-05',
      cycleEnd: '2026-04-26',
      status: 'mature',
      isActive: 0,
      lifecycleStage: 'mature',
      daysTended: 21,
      journalCount: 5,
      totalTasks: 35,
      ringsCount: 3,
      earnedReason: 'Earned through disciplined task completion and quiet attention.',
      completedAt: '2026-04-26T20:00:00.000Z',
    },
    {
      speciesId: 'silver_wisteria',
      speciesName: 'Silver Wisteria',
      cycleStart: '2026-03-01',
      cycleEnd: '2026-03-21',
      status: 'mature',
      isActive: 0,
      lifecycleStage: 'mature',
      daysTended: 21,
      journalCount: 12,
      totalTasks: 26,
      ringsCount: 3,
      earnedReason: 'Deep introspective journaling and emotional release.',
      completedAt: '2026-03-21T20:00:00.000Z',
    },
    {
      speciesId: 'weeping_willow',
      speciesName: 'Weeping Willow',
      cycleStart: '2026-02-01',
      cycleEnd: '2026-02-22',
      status: 'mature',
      isActive: 0,
      lifecycleStage: 'mature',
      daysTended: 18,
      journalCount: 8,
      totalTasks: 28,
      ringsCount: 3,
      earnedReason: 'Gentle resilience and forgiveness after missed days.',
      completedAt: '2026-02-22T20:00:00.000Z',
    },
  ];

  await db.gardenTrees.bulkAdd(initialTrees);
}

