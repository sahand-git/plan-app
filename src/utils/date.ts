import {
  format,
  parseISO,
  isToday,
  isYesterday,
  isTomorrow,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isBefore,
  startOfDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks
} from 'date-fns';

export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function formatDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function parseDateString(dateStr: string): Date {
  return parseISO(dateStr);
}

export function formatFriendlyDate(dateStr: string): string {
  try {
    const d = parseISO(dateStr);
    if (isToday(d)) {
      return `Today, ${format(d, 'MMM d')}`;
    }
    if (isYesterday(d)) {
      return `Yesterday, ${format(d, 'MMM d')}`;
    }
    if (isTomorrow(d)) {
      return `Tomorrow, ${format(d, 'MMM d')}`;
    }
    return format(d, 'EEEE, MMM d, yyyy');
  } catch {
    return dateStr;
  }
}

export function formatShortDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'MMM d');
  } catch {
    return dateStr;
  }
}

export function isPastDay(dateStr: string): boolean {
  try {
    const d = startOfDay(parseISO(dateStr));
    const today = startOfDay(new Date());
    return isBefore(d, today);
  } catch {
    return false;
  }
}

export {
  format,
  parseISO,
  isToday,
  isYesterday,
  isTomorrow,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isBefore,
  startOfDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks
};
