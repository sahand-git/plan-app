import React, { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
  ArrowRight,
  Anchor,
  BookOpen,
} from 'lucide-react';
import { db, type Task, type DailyNote, type TreeState } from '../db';
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  formatDateString,
} from '../utils/date';

interface CalendarViewProps {
  currentDate: string;
  onSelectDate: (date: string) => void;
  onJumpToDayTasks: (date: string) => void;
  onJumpToJournal?: (date: string) => void;
}

interface DayData {
  dateStr: string;
  date: Date;
  isCurrentMonth: boolean;
  isTodayDate: boolean;
  tasksTotal: number;
  tasksCompleted: number;
  habitsTotal: number;
  habitsCompleted: number;
  hasJournal: boolean;
  journalSnippet?: string;
  intensity: 0 | 1 | 2 | 3;
  canopyState: TreeState;
  tasksList: Task[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  currentDate,
  onSelectDate,
  onJumpToDayTasks,
  onJumpToJournal,
}) => {
  const [viewDate, setViewDate] = useState<Date>(() => parseISO(currentDate));
  const [selectedDayData, setSelectedDayData] = useState<DayData | null>(null);

  // Reactive queries from Dexie
  const allTasks = useLiveQuery(() => db.tasks.toArray()) || [];
  const allHabits = useLiveQuery(() => db.habits.where('archived').notEqual(1).toArray()) || [];
  const allHabitLogs = useLiveQuery(() => db.habitLogs.toArray()) || [];
  const allNotes = useLiveQuery(() => db.notes.toArray()) || [];
  const allTreeLogs = useLiveQuery(() => db.treeLogs.toArray()) || [];

  // Group maps
  const notesByDate = useMemo(() => {
    const map = new Map<string, DailyNote>();
    for (const note of allNotes) {
      map.set(note.date, note);
    }
    return map;
  }, [allNotes]);

  const treeLogsByDate = useMemo(() => {
    const map = new Map<string, TreeState>();
    for (const log of allTreeLogs) {
      map.set(log.date, log.state);
    }
    return map;
  }, [allTreeLogs]);

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const task of allTasks) {
      const list = map.get(task.date) || [];
      list.push(task);
      map.set(task.date, list);
    }
    return map;
  }, [allTasks]);

  const habitLogsByDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const log of allHabitLogs) {
      if (log.completed) {
        map.set(log.date, (map.get(log.date) || 0) + 1);
      }
    }
    return map;
  }, [allHabitLogs]);

  // Compute month days interval
  const monthInterval = useMemo(() => {
    const start = startOfWeek(startOfMonth(viewDate), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(viewDate), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [viewDate]);

  // Transform month days into DayData
  const daysDataList = useMemo<DayData[]>(() => {
    return monthInterval.map((d) => {
      const dateStr = formatDateString(d);
      const isCurMonth = isSameMonth(d, viewDate);
      const isTod = isToday(d);

      const dayTasks = tasksByDate.get(dateStr) || [];
      const tasksCompleted = dayTasks.filter((t) => t.completed).length;
      const tasksTotal = dayTasks.length;

      const habitsCompleted = habitLogsByDate.get(dateStr) || 0;
      const habitsTotal = allHabits.length;

      const note = notesByDate.get(dateStr);
      const hasJournal = !!(note && note.content.trim().length > 0);
      const journalSnippet = note?.content.slice(0, 140);

      // Total activity calculation
      const totalItems = tasksTotal + habitsTotal;
      const totalDone = tasksCompleted + habitsCompleted;
      const rate = totalItems > 0 ? totalDone / totalItems : 0;

      let intensity: 0 | 1 | 2 | 3 = 0;
      if (totalDone === 0 && !hasJournal) {
        intensity = 0;
      } else if (rate >= 0.75 || totalDone >= 4) {
        intensity = 3;
      } else if (rate >= 0.4 || totalDone >= 2) {
        intensity = 2;
      } else {
        intensity = 1;
      }

      // Canopy state
      let canopyState: TreeState = treeLogsByDate.get(dateStr) || 'foliage';
      if (!treeLogsByDate.has(dateStr)) {
        if (totalItems > 0 && totalDone === 0) {
          canopyState = 'gentle_wilt';
        } else if (rate >= 0.8) {
          canopyState = 'flourishing';
        } else if (rate >= 0.4) {
          canopyState = 'foliage';
        } else {
          canopyState = 'sapling';
        }
      }

      return {
        dateStr,
        date: d,
        isCurrentMonth: isCurMonth,
        isTodayDate: isTod,
        tasksTotal,
        tasksCompleted,
        habitsTotal,
        habitsCompleted,
        hasJournal,
        journalSnippet,
        intensity,
        canopyState,
        tasksList: dayTasks,
      };
    });
  }, [
    monthInterval,
    viewDate,
    tasksByDate,
    habitLogsByDate,
    allHabits.length,
    notesByDate,
    treeLogsByDate,
  ]);

  // Partition days into weeks for soft clustered row rendering
  const weeksList = useMemo(() => {
    const weeks: DayData[][] = [];
    for (let i = 0; i < daysDataList.length; i += 7) {
      weeks.push(daysDataList.slice(i, i + 7));
    }
    return weeks;
  }, [daysDataList]);

  const monthTitle = format(viewDate, 'MMMM yyyy');
  const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 space-y-5 animate-soft-fade-up select-none">
      {/* Top Calming Month Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <span className="text-[11px] font-medium tracking-wider uppercase text-sage-600 dark:text-sage-400">
            Botanical Heatmap Horizon
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-medium text-stone-800 dark:text-stone-100">
            {monthTitle}
          </h2>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-1 bg-white/70 dark:bg-night-card/70 p-1 rounded-2xl border border-stone-200/60 dark:border-night-border shadow-xs">
          <button
            onClick={() => setViewDate((d) => subMonths(d, 1))}
            className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-night-surface text-stone-500 transition-colors"
            title="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              const now = new Date();
              setViewDate(now);
              onSelectDate(formatDateString(now));
            }}
            className="px-2.5 py-1 text-xs font-serif text-stone-700 dark:text-stone-300 hover:text-stone-900"
          >
            Today
          </button>
          <button
            onClick={() => setViewDate((d) => addMonths(d, 1))}
            className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-night-surface text-stone-500 transition-colors"
            title="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Week Initials Header (Muted, no borders) */}
      <div className="grid grid-cols-7 gap-2 px-2 text-center text-xs font-medium text-stone-400 dark:text-stone-500">
        {dayNames.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      {/* Organic Clustered Heatmap Rows (No rigid grid, no cell borders) */}
      <div className="space-y-2.5">
        {weeksList.map((week, wIdx) => (
          <div
            key={wIdx}
            className="p-2 rounded-2xl bg-white/40 dark:bg-night-surface/40 hover:bg-white/70 dark:hover:bg-night-surface/70 transition-colors border border-stone-200/40 dark:border-night-border/40 grid grid-cols-7 gap-2 items-center"
          >
            {week.map((day) => {
              const dayNum = format(day.date, 'd');

              // Color intensity classes (Soft Muted Palette)
              const intensityStyles = {
                0: 'bg-stone-200/50 dark:bg-night-card text-stone-400 dark:text-stone-500',
                1: 'bg-sage-200/80 dark:bg-sage-900/60 text-sage-800 dark:text-sage-200',
                2: 'bg-sage-400 dark:bg-sage-700 text-white shadow-xs',
                3: 'bg-sage-600 dark:bg-sage-500 text-white shadow-sm',
              }[day.intensity];

              const isDimmed = !day.isCurrentMonth;

              return (
                <button
                  key={day.dateStr}
                  onClick={() => {
                    setSelectedDayData(day);
                    onSelectDate(day.dateStr);
                  }}
                  className={`group relative aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 active:scale-90 ${
                    intensityStyles
                  } ${isDimmed ? 'opacity-35 scale-90' : 'opacity-100'} ${
                    day.isTodayDate
                      ? 'ring-2 ring-sage-500 dark:ring-sage-400 ring-offset-2 ring-offset-parchment dark:ring-offset-night-bg font-semibold'
                      : ''
                  }`}
                  title={`${day.dateStr}: ${day.tasksCompleted} tasks, ${day.habitsCompleted} habits`}
                >
                  {/* Day Number */}
                  <span className="text-xs font-serif">{dayNum}</span>

                  {/* Journal Root Indicator pip (Warm Terracotta/Clay pip) */}
                  {day.hasJournal && (
                    <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-earth-600 dark:bg-earth-400" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Heatmap Legend (Clean, Minimal) */}
      <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 px-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-earth-500" />
          <span>Journal rooted</span>
        </div>

        <div className="flex items-center gap-1">
          <span>Rest</span>
          <div className="w-3 h-3 rounded-md bg-stone-200 dark:bg-night-card" />
          <div className="w-3 h-3 rounded-md bg-sage-200 dark:bg-sage-900" />
          <div className="w-3 h-3 rounded-md bg-sage-400 dark:bg-sage-700" />
          <div className="w-3 h-3 rounded-md bg-sage-600 dark:bg-sage-500" />
          <span>Flourish</span>
        </div>
      </div>

      {/* =========================================================================
          SLIDE-UP DAY DETAIL SHEET (Expanded View on Dot Tap)
          ========================================================================= */}
      {selectedDayData && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/40 dark:bg-black/60 backdrop-blur-xs animate-soft-fade-up">
          <div
            className="w-full max-w-md bg-white dark:bg-night-surface rounded-t-3xl sm:rounded-3xl shadow-calm-lg border border-stone-200/80 dark:border-night-border p-6 space-y-5 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* iOS Pull Bar */}
            <div className="w-10 h-1 bg-stone-300 dark:bg-stone-600 rounded-full mx-auto sm:hidden -mt-1 mb-1" />

            {/* Sheet Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-night-border">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-sage-600 dark:text-sage-400 font-medium">
                  Botanical Day Archive
                </span>
                <h3 className="font-serif text-lg font-medium text-stone-800 dark:text-stone-100">
                  {format(selectedDayData.date, 'EEEE, MMMM d, yyyy')}
                </h3>
              </div>

              <button
                onClick={() => setSelectedDayData(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Day Details */}
            <div className="overflow-y-auto space-y-4 pr-1">
              {/* Canopy State Summary Card */}
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-night-card border border-stone-200/50 dark:border-night-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 block">Canopy Posture</span>
                  <span className="font-serif text-sm font-medium text-stone-800 dark:text-stone-200 capitalize">
                    {selectedDayData.canopyState === 'gentle_wilt'
                      ? 'Seasonal Rest (Gentle Wilt)'
                      : selectedDayData.canopyState}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 block">Activity Level</span>
                  <span className="text-xs font-serif font-medium text-sage-600 dark:text-sage-400">
                    {selectedDayData.intensity === 3
                      ? 'Flourishing'
                      : selectedDayData.intensity === 2
                      ? 'Balanced'
                      : selectedDayData.intensity === 1
                      ? 'Gentle steps'
                      : 'Quiet rest'}
                  </span>
                </div>
              </div>

              {/* Journal Status */}
              <div className="p-4 rounded-2xl bg-earth-50/60 dark:bg-night-card/50 border border-earth-200/40 dark:border-night-border space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-earth-800 dark:text-stone-200">
                    <Anchor className="w-3.5 h-3.5 text-earth-600" />
                    <span>Journal Root Record</span>
                  </div>
                  {selectedDayData.hasJournal && (
                    <span className="text-[10px] text-earth-600 dark:text-stone-400">
                      Rooted permanently
                    </span>
                  )}
                </div>

                {selectedDayData.hasJournal ? (
                  <p className="text-xs text-stone-600 dark:text-stone-300 font-serif italic leading-relaxed pt-1">
                    "{selectedDayData.journalSnippet}..."
                  </p>
                ) : (
                  <p className="text-xs text-stone-400 font-serif italic">
                    No reflections recorded on this day.
                  </p>
                )}
              </div>

              {/* Tasks Summary */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="font-medium">
                    Tasks ({selectedDayData.tasksCompleted} of {selectedDayData.tasksTotal} completed)
                  </span>
                </div>

                {selectedDayData.tasksList.length === 0 ? (
                  <p className="text-xs text-stone-400 italic">No tasks scheduled for this day.</p>
                ) : (
                  <div className="space-y-1.5">
                    {selectedDayData.tasksList.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center gap-2 text-xs py-1.5 px-2.5 rounded-xl bg-stone-50 dark:bg-night-card text-stone-700 dark:text-stone-300"
                      >
                        <CheckCircle2
                          className={`w-3.5 h-3.5 shrink-0 ${
                            t.completed
                              ? 'text-sage-600 dark:text-sage-400'
                              : 'text-stone-300 dark:text-stone-600'
                          }`}
                        />
                        <span className={t.completed ? 'line-through text-stone-400' : ''}>
                          {t.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Action Footer */}
            <div className="flex items-center gap-2 pt-2 border-t border-stone-100 dark:border-night-border">
              <button
                onClick={() => {
                  onJumpToDayTasks(selectedDayData.dateStr);
                  setSelectedDayData(null);
                }}
                className="flex-1 py-2.5 px-3 rounded-2xl bg-sage-600 hover:bg-sage-700 text-white text-xs font-medium transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>View Tasks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  if (onJumpToJournal) {
                    onJumpToJournal(selectedDayData.dateStr);
                  } else {
                    onJumpToDayTasks(selectedDayData.dateStr);
                  }
                  setSelectedDayData(null);
                }}
                className="flex-1 py-2.5 px-3 rounded-2xl bg-stone-100 dark:bg-night-card hover:bg-stone-200/60 text-stone-700 dark:text-stone-300 text-xs font-medium transition-colors border border-stone-200/60 dark:border-night-border flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-stone-500" />
                <span>Journal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
