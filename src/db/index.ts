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

