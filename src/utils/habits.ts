import { parseISO, subDays, format, differenceInCalendarDays } from 'date-fns';
import { db } from '../db';
import { formatDateString } from './date';

export interface HabitStreakInfo {
  currentStreak: number;
  bestStreak: number;
  totalCompleted: number;
  completedToday: boolean;
  recentWeek: { date: string; dayName: string; completed: boolean }[];
  weekCompletedCount: number;
}

/**
 * Calculates current streak, best historical streak, and recent 7-day history for a habit
 */
export async function calculateHabitStreak(
  habitId: number,
  targetDateStr: string = formatDateString(new Date())
): Promise<HabitStreakInfo> {
  const logs = await db.habitLogs
    .where('habitId')
    .equals(habitId)
    .and((l) => l.completed)
    .toArray();

  const completedDatesSet = new Set(logs.map((l) => l.date));
  const totalCompleted = completedDatesSet.size;

  const today = new Date();
  const todayStr = formatDateString(today);
  const completedToday = completedDatesSet.has(todayStr);

  // Calculate current streak
  let currentStreak = 0;
  let checkDate = parseISO(todayStr);

  if (!completedDatesSet.has(todayStr)) {
    // If not completed today, check yesterday. If yesterday was completed, streak is still active.
    checkDate = subDays(checkDate, 1);
  }

  while (completedDatesSet.has(formatDateString(checkDate))) {
    currentStreak++;
    checkDate = subDays(checkDate, 1);
  }

  // Calculate best historical streak
  const sortedDates = Array.from(completedDatesSet)
    .map((d) => parseISO(d))
    .sort((a, b) => a.getTime() - b.getTime());

  let bestStreak = 0;
  let runningStreak = 0;
  let prevDate: Date | null = null;

  for (const date of sortedDates) {
    if (!prevDate) {
      runningStreak = 1;
    } else {
      const diff = differenceInCalendarDays(date, prevDate);
      if (diff === 1) {
        runningStreak++;
      } else if (diff > 1) {
        runningStreak = 1;
      }
    }
    if (runningStreak > bestStreak) {
      bestStreak = runningStreak;
    }
    prevDate = date;
  }

  // Generate recent 7 days (including targetDateStr)
  const targetDateObj = parseISO(targetDateStr);
  const recentWeek = [];
  let weekCompletedCount = 0;
  for (let i = 6; i >= 0; i--) {
    const d = subDays(targetDateObj, i);
    const dStr = formatDateString(d);
    const isCompleted = completedDatesSet.has(dStr);
    if (isCompleted) {
      weekCompletedCount++;
    }
    recentWeek.push({
      date: dStr,
      dayName: format(d, 'EE'),
      completed: isCompleted,
    });
  }

  return {
    currentStreak,
    bestStreak: Math.max(bestStreak, currentStreak),
    totalCompleted,
    completedToday,
    recentWeek,
    weekCompletedCount,
  };
}

/**
 * Toggles a habit's completion on a specific date
 */
export async function toggleHabitDate(habitId: number, dateStr: string): Promise<boolean> {
  const existing = await db.habitLogs
    .where('[habitId+date]')
    .equals([habitId, dateStr])
    .first();

  if (existing && existing.id) {
    const nextState = !existing.completed;
    await db.habitLogs.update(existing.id, { completed: nextState });
    return nextState;
  } else {
    await db.habitLogs.add({
      habitId,
      date: dateStr,
      completed: true,
    });
    return true;
  }
}
