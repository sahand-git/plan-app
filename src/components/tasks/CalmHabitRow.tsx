import React from 'react';
import { Check } from 'lucide-react';
import type { Habit } from '../../db';

interface CalmHabitRowProps {
  habit: Habit;
  weekLogs: Record<string, boolean>; // date YYYY-MM-DD -> completed
  weekDates: string[]; // 7 days of current week
  isCompletedToday: boolean;
  onToggleToday: (habitId: number) => void;
  noPressureMode: boolean;
  streakCount: number;
}

export const CalmHabitRow: React.FC<CalmHabitRowProps> = ({
  habit,
  weekLogs,
  weekDates,
  isCompletedToday,
  onToggleToday,
  noPressureMode,
  streakCount,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-white/70 dark:bg-night-surface/70 border border-stone-200/50 dark:border-night-border/70 gap-3 shadow-xs">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => habit.id && onToggleToday(habit.id)}
          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
            isCompletedToday
              ? 'bg-sage-600 border-sage-600 text-white'
              : 'border-2 border-stone-300 dark:border-stone-600 hover:border-sage-500 bg-transparent'
          }`}
          aria-label={`Toggle habit ${habit.title}`}
        >
          {isCompletedToday && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
        </button>

        <div className="min-w-0">
          <span className="text-sm font-medium text-stone-800 dark:text-stone-100 truncate block">
            {habit.title}
          </span>
          {!noPressureMode && streakCount > 1 ? (
            <span className="text-[11px] text-sage-600 dark:text-sage-400 font-serif italic">
              {streakCount} days in rhythm
            </span>
          ) : (
            <span className="text-[11px] text-stone-400">Daily practice</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 self-end sm:self-center">
        {weekDates.map((dateStr, idx) => {
          const completed = !!weekLogs[dateStr];
          const isToday = idx === weekDates.length - 1;

          return (
            <div
              key={dateStr}
              title={`${dateStr}: ${completed ? 'Tended' : 'Untended'}`}
              className={`w-6 h-6 rounded-xl flex items-center justify-center transition-all ${
                completed
                  ? 'bg-sage-500/90 text-white'
                  : isToday
                  ? 'border border-dashed border-stone-400 dark:border-stone-600 bg-stone-50 dark:bg-night-card'
                  : 'bg-stone-100 dark:bg-night-card/50 border border-stone-200/60 dark:border-night-border'
              }`}
            >
              {completed ? (
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              ) : (
                <div className="w-1 h-1 rounded-full bg-stone-300 dark:bg-stone-600" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
