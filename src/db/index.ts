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

export class PlannerDatabase extends Dexie {
  tasks!: Table<Task, number>;
  notes!: Table<DailyNote, number>;
  habits!: Table<Habit, number>;
  habitLogs!: Table<HabitLog, number>;

  constructor() {
    super('DayFlowPlannerDB');
    this.version(1).stores({
      tasks: '++id, date, completed, priority, createdAt',
      notes: '++id, &date, updatedAt',
      habits: '++id, createdAt, archived',
      habitLogs: '++id, habitId, date, [habitId+date]',
    });
  }
}

export const db = new PlannerDatabase();
