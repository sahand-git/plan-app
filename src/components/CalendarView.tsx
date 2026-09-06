import React, { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { db, type Task } from '../db';
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  formatDateString
} from '../utils/date';

interface CalendarViewProps {
  currentDate: string;
  onSelectDate: (date: string) => void;
  onJumpToDayTasks: (date: string) => void;
}

type CalendarMode = 'month' | 'week';

export const CalendarView: React.FC<CalendarViewProps> = ({
  currentDate,
  onSelectDate,
  onJumpToDayTasks,
}) => {
  const [mode, setMode] = useState<CalendarMode>('month');
  const [viewDate, setViewDate] = useState<Date>(() => parseISO(currentDate));

  // Query all tasks reactively from Dexie
  const allTasks = useLiveQuery(() => db.tasks.toArray()) || [];

  // Group tasks by date for density calculations
  const tasksByDate = useMemo(() => {
    const map = new Map<string, { total: number; completed: number; pending: number; hasHigh: boolean; tasks: Task[] }>();
    for (const task of allTasks) {
      const existing = map.get(task.date) || { total: 0, completed: 0, pending: 0, hasHigh: false, tasks: [] };
      existing.total++;
      if (task.completed) {
        existing.completed++;
      } else {
        existing.pending++;
        if (task.priority === 'high') {
          existing.hasHigh = true;
        }
      }
      existing.tasks.push(task);
      map.set(task.date, existing);
    }
    return map;
  }, [allTasks]);

  // Navigation handlers
  const handlePrev = () => {
    if (mode === 'month') {
      setViewDate((d) => subMonths(d, 1));
    } else {
      setViewDate((d) => subWeeks(d, 1));
    }
  };

  const handleNext = () => {
    if (mode === 'month') {
      setViewDate((d) => addMonths(d, 1));
    } else {
      setViewDate((d) => addWeeks(d, 1));
    }
  };

  const handleToday = () => {
    const today = new Date();
    setViewDate(today);
    onSelectDate(formatDateString(today));
  };

  // Month grid calculation
  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [viewDate]);

  // Week grid calculation
  const weekDays = useMemo(() => {
    const startDate = startOfWeek(viewDate);
    const endDate = endOfWeek(viewDate);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [viewDate]);

  const selectedDateObj = parseISO(currentDate);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 sm:py-6 animate-in fade-in duration-200">
      {/* Calendar Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-3.5 rounded-2xl shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800/80 p-0.5 border border-slate-200/60 dark:border-slate-700/50">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white dark:hover:bg-slate-900 transition"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white dark:hover:bg-slate-900 transition"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-indigo-500" />
            {mode === 'month'
              ? format(viewDate, 'MMMM yyyy')
              : `Week of ${format(startOfWeek(viewDate), 'MMM d')} - ${format(endOfWeek(viewDate), 'MMM d, yyyy')}`}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/50 text-xs">
            <button
              type="button"
              onClick={() => setMode('month')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                mode === 'month'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-semibold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Month
            </button>
            <button
              type="button"
              onClick={() => setMode('week')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                mode === 'week'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-semibold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Week
            </button>
          </div>

          {/* Jump to Today button */}
          <button
            type="button"
            onClick={handleToday}
            className="px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 rounded-xl transition"
          >
            Today
          </button>
        </div>
      </div>

      {/* MONTH VIEW */}
      {mode === 'month' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-2xs overflow-hidden">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 text-center border-b border-slate-100 dark:border-slate-800/80 py-2.5 bg-slate-50/50 dark:bg-slate-900/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Month day grid */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 dark:divide-slate-800/60">
            {monthDays.map((day) => {
              const dateStr = formatDateString(day);
              const isCurrMonth = isSameMonth(day, viewDate);
              const isTodayDate = isToday(day);
              const isSelected = isSameDay(day, selectedDateObj);
              const data = tasksByDate.get(dateStr);

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => onJumpToDayTasks(dateStr)}
                  className={`min-h-[82px] sm:min-h-[96px] p-2 flex flex-col justify-between text-left transition relative group hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 ${
                    !isCurrMonth ? 'bg-slate-50/40 dark:bg-slate-950/40 opacity-40' : ''
                  } ${isSelected ? 'ring-2 ring-indigo-500 ring-inset bg-indigo-50/20 dark:bg-indigo-950/20' : ''}`}
                >
                  {/* Day number header */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full transition ${
                        isTodayDate
                          ? 'bg-indigo-600 text-white font-bold shadow-xs'
                          : isSelected
                          ? 'font-bold text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-700 dark:text-slate-300 group-hover:text-indigo-600'
                      }`}
                    >
                      {format(day, 'd')}
                    </span>

                    {/* Task count pill */}
                    {data && data.total > 0 && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {data.completed}/{data.total}
                      </span>
                    )}
                  </div>

                  {/* Task density indicators */}
                  <div className="mt-1 flex flex-col gap-1 w-full overflow-hidden">
                    {data && data.total > 0 ? (
                      <div className="space-y-0.5">
                        {/* Dot indicators */}
                        <div className="flex items-center gap-1 flex-wrap">
                          {data.pending > 0 && (
                            <span
                              className={`w-2 h-2 rounded-full ${
                                data.hasHigh ? 'bg-rose-500' : 'bg-amber-500'
                              }`}
                              title={`${data.pending} pending tasks`}
                            />
                          )}
                          {data.completed > 0 && (
                            <span
                              className="w-2 h-2 rounded-full bg-emerald-500"
                              title={`${data.completed} completed tasks`}
                            />
                          )}
                        </div>

                        {/* Title snippets on larger screens */}
                        <div className="hidden sm:block">
                          {data.tasks.slice(0, 2).map((t, idx) => (
                            <p
                              key={idx}
                              className={`truncate text-[10px] leading-tight ${
                                t.completed
                                  ? 'line-through text-slate-400'
                                  : 'text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              • {t.title}
                            </p>
                          ))}
                          {data.tasks.length > 2 && (
                            <span className="text-[9px] text-slate-400 font-medium">
                              +{data.tasks.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="h-4" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEK VIEW */}
      {mode === 'week' && (
        <div className="space-y-3">
          {weekDays.map((day) => {
            const dateStr = formatDateString(day);
            const isTodayDate = isToday(day);
            const isSelected = isSameDay(day, selectedDateObj);
            const data = tasksByDate.get(dateStr);
            const tasks = data?.tasks || [];

            return (
              <div
                key={dateStr}
                className={`p-4 rounded-2xl border transition-all ${
                  isTodayDate
                    ? 'bg-indigo-50/30 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/50 shadow-xs'
                    : isSelected
                    ? 'bg-white dark:bg-slate-900 border-indigo-400 dark:border-indigo-600'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                        isTodayDate
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {format(day, 'EEE, MMM d')}
                    </span>
                    {isTodayDate && (
                      <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                        Today
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onJumpToDayTasks(dateStr)}
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition"
                  >
                    <span>View Day</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Day tasks in week view */}
                <div className="mt-3">
                  {tasks.length > 0 ? (
                    <div className="space-y-1.5">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                task.completed
                                  ? 'bg-emerald-500'
                                  : task.priority === 'high'
                                  ? 'bg-rose-500'
                                  : task.priority === 'med'
                                  ? 'bg-amber-500'
                                  : 'bg-indigo-400'
                              }`}
                            />
                            <span
                              className={`truncate ${
                                task.completed
                                  ? 'line-through text-slate-400'
                                  : 'font-medium text-slate-800 dark:text-slate-200'
                              }`}
                            >
                              {task.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 text-[11px] text-slate-500">
                            {task.time && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {task.time}
                              </span>
                            )}
                            {task.completed && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic py-1">
                      No tasks scheduled for this day
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
