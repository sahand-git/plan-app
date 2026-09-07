import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Flame,
  Plus,
  Check,
  Trash2,
  Trophy,
  X,
  Sparkles,
  Calendar as CalendarIcon
} from 'lucide-react';
import { db } from '../db';
import { DateNavigator } from './DateNavigator';
import { calculateHabitStreak, toggleHabitDate, type HabitStreakInfo } from '../utils/habits';

interface HabitTrackerViewProps {
  currentDate: string;
  onSelectDate: (date: string) => void;
}

const COLOR_OPTIONS = [
  { name: 'Indigo', bg: 'bg-indigo-500', text: 'text-indigo-500', light: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/40' },
  { name: 'Emerald', bg: 'bg-emerald-500', text: 'text-emerald-500', light: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/40' },
  { name: 'Amber', bg: 'bg-amber-500', text: 'text-amber-500', light: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/40' },
  { name: 'Rose', bg: 'bg-rose-500', text: 'text-rose-500', light: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/40' },
  { name: 'Sky', bg: 'bg-sky-500', text: 'text-sky-500', light: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-900/40' },
  { name: 'Purple', bg: 'bg-purple-500', text: 'text-purple-500', light: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900/40' },
];

export const HabitTrackerView: React.FC<HabitTrackerViewProps> = ({
  currentDate,
  onSelectDate,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0].name);

  // Reactively query habits and logs
  const habits = useLiveQuery(() => db.habits.toArray()) || [];
  const logs = useLiveQuery(() => db.habitLogs.toArray()) || [];

  // Track streaks per habit in local state
  const [streakMap, setStreakMap] = useState<Record<number, HabitStreakInfo>>({});

  useEffect(() => {
    async function updateStreaks() {
      const results: Record<number, HabitStreakInfo> = {};
      for (const h of habits) {
        if (h.id) {
          results[h.id] = await calculateHabitStreak(h.id, currentDate);
        }
      }
      setStreakMap(results);
    }
    updateStreaks();
  }, [habits, logs, currentDate]);

  const handleCreateHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await db.habits.add({
      title: newTitle.trim(),
      color: selectedColor,
      createdAt: new Date().toISOString(),
      archived: false,
    });

    setNewTitle('');
    setIsAddModalOpen(false);
  };

  const handleToggle = async (habitId: number, dateStr: string) => {
    await toggleHabitDate(habitId, dateStr);
  };

  const handleDeleteHabit = async (id: number) => {
    if (window.confirm('Delete this habit and its historical logs?')) {
      await db.transaction('rw', db.habits, db.habitLogs, async () => {
        await db.habits.delete(id);
        await db.habitLogs.where('habitId').equals(id).delete();
      });
    }
  };

  const handleAddPresetHabit = async (title: string, color: string) => {
    await db.habits.add({
      title,
      color,
      createdAt: new Date().toISOString(),
      archived: false,
    });
  };

  // Completion stats for current viewed date
  const completedOnCurrentDateCount = habits.filter((h) => {
    const log = logs.find((l) => l.habitId === h.id && l.date === currentDate && l.completed);
    return Boolean(log);
  }).length;

  return (
    <div className="w-full max-w-md mx-auto px-3.5 py-3 sm:py-4 animate-in fade-in duration-200">
      {/* Date Navigation */}
      <DateNavigator currentDate={currentDate} onSelectDate={onSelectDate} />

      {/* Header & Stats Banner */}
      <div className="my-4 p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Habit Tracker & Daily Streaks
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {habits.length > 0
                ? `${completedOnCurrentDateCount} of ${habits.length} habits logged for this day`
                : 'Form consistent daily habits'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-xl shadow-xs transition shadow-indigo-600/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Habit</span>
        </button>
      </div>

      {/* Habits List */}
      <div className="space-y-3">
        {habits.map((habit) => {
          if (!habit.id) return null;
          const streakInfo = streakMap[habit.id] || {
            currentStreak: 0,
            bestStreak: 0,
            totalCompleted: 0,
            completedToday: false,
            recentWeek: [],
          };

          const isCompletedThisDate = Boolean(
            logs.find((l) => l.habitId === habit.id && l.date === currentDate && l.completed)
          );

          const colorObj =
            COLOR_OPTIONS.find((c) => c.name === habit.color) || COLOR_OPTIONS[0];

          return (
            <div
              key={habit.id}
              className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Big Checkbox for selected day */}
                  <button
                    type="button"
                    onClick={() => habit.id && handleToggle(habit.id, currentDate)}
                    className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
                      isCompletedThisDate
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs scale-105'
                        : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 hover:border-indigo-500 text-transparent'
                    }`}
                    aria-label={isCompletedThisDate ? 'Mark habit uncompleted' : 'Mark habit completed'}
                  >
                    <Check className="w-5 h-5 stroke-[3]" />
                  </button>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${colorObj.bg} shrink-0`} />
                      <h3
                        className={`text-sm font-semibold transition ${
                          isCompletedThisDate
                            ? 'text-slate-900 dark:text-white'
                            : 'text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {habit.title}
                      </h3>
                    </div>

                    {/* Weekly Completed Days Fire Badge & Streaks */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                      {/* Fire Badge: Total days selected in the week */}
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md border transition-all ${
                          (streakInfo.weekCompletedCount ?? 0) > 0
                            ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-900/40 shadow-2xs'
                            : 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                        }`}
                        title={`${streakInfo.weekCompletedCount ?? 0} days completed out of 7 this week`}
                      >
                        <Flame
                          className={`w-3.5 h-3.5 ${
                            (streakInfo.weekCompletedCount ?? 0) > 0 ? 'text-amber-500 fill-amber-500' : 'text-slate-400'
                          }`}
                        />
                        <span>{(streakInfo.weekCompletedCount ?? 0)} of 7 this week</span>
                      </span>

                      {/* Consecutive streak badge if active */}
                      {streakInfo.currentStreak > 1 && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 px-1.5 py-0.5 rounded-md border border-orange-200/50 dark:border-orange-900/40">
                          <span>⚡ {streakInfo.currentStreak}d streak</span>
                        </span>
                      )}

                      {/* Best historical streak badge */}
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                        <Trophy className="w-3 h-3 text-amber-500/80" />
                        Best: {streakInfo.bestStreak}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => habit.id && handleDeleteHabit(habit.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                  title="Delete habit"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* 7-Day History Track */}
              {streakInfo.recentWeek.length > 0 && (
                <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3" /> Recent 7 Days
                  </span>

                  <div className="flex items-center gap-1.5">
                    {streakInfo.recentWeek.map((item) => (
                      <button
                        key={item.date}
                        type="button"
                        onClick={() => habit.id && handleToggle(habit.id, item.date)}
                        title={`${item.date}: ${item.completed ? 'Completed' : 'Missed'} (Click to toggle)`}
                        className={`flex flex-col items-center gap-0.5 p-1 rounded-md transition ${
                          item.date === currentDate
                            ? 'ring-1 ring-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/40'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="text-[9px] text-slate-400 uppercase font-semibold">
                          {item.dayName[0]}
                        </span>
                        <span
                          className={`w-3 h-3 rounded-full transition ${
                            item.completed ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Empty State */}
        {habits.length === 0 && (
          <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              No habits tracked yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
              Small actions repeated daily create big transformations. Form your first habit or choose a popular starter:
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 max-w-md mx-auto">
              {[
                { title: 'Morning Workout', color: 'Emerald' },
                { title: 'Read 20 Pages', color: 'Indigo' },
                { title: 'Meditate 10 Mins', color: 'Purple' },
                { title: 'Drink 2L Water', color: 'Sky' },
              ].map((preset) => (
                <button
                  key={preset.title}
                  type="button"
                  onClick={() => handleAddPresetHabit(preset.title, preset.color)}
                  className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 rounded-xl shadow-2xs text-slate-700 dark:text-slate-300 transition"
                >
                  + {preset.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Habit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-semibold">New Habit</h2>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHabit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                  Habit Title *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Daily Workout, Read 15 mins..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                  Color Tag
                </label>
                <div className="flex items-center gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-7 h-7 rounded-full ${c.bg} flex items-center justify-center text-white transition ${
                        selectedColor === c.name ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                      title={c.name}
                    >
                      {selectedColor === c.name && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl shadow-xs"
                >
                  Create Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
