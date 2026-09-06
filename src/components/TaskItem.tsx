import React from 'react';
import {
  Check,
  Clock,
  Pencil,
  Trash2,
  CalendarClock,
  AlertTriangle,
  Bell,
  Repeat
} from 'lucide-react';
import type { Task } from '../db';
import { formatShortDate, isPastDay } from '../utils/date';

interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onMoveToToday?: (task: Task) => void;
  isOverdueView?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onEdit,
  onDelete,
  onMoveToToday,
  isOverdueView = false,
}) => {
  const isPast = isPastDay(task.date) && !task.completed;

  return (
    <div
      className={`group relative flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border transition-all duration-150 ${
        task.completed
          ? 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/50 opacity-65'
          : isPast || isOverdueView
          ? 'bg-amber-50/30 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-900/40 shadow-xs hover:border-amber-300 dark:hover:border-amber-800'
          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Checkbox */}
      <button
        type="button"
        onClick={() => onToggle(task)}
        className={`mt-0.5 shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
          task.completed
            ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
            : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 bg-white dark:bg-slate-800'
        }`}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </button>

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <h3
            className={`text-sm font-medium leading-snug break-words ${
              task.completed
                ? 'line-through text-slate-400 dark:text-slate-500'
                : 'text-slate-800 dark:text-slate-100'
            }`}
          >
            {task.title}
          </h3>
        </div>

        {task.description && (
          <p
            className={`mt-1 text-xs leading-relaxed whitespace-pre-wrap ${
              task.completed
                ? 'text-slate-400/80 dark:text-slate-600'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {task.description}
          </p>
        )}

        {/* Metadata badges */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[11px]">
          {/* Overdue tag */}
          {(isPast || isOverdueView) && !task.completed && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50">
              <AlertTriangle className="w-3 h-3" />
              Overdue ({formatShortDate(task.date)})
            </span>
          )}

          {/* Time Badge */}
          {task.time && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80">
              <Clock className="w-3 h-3" />
              {task.time}
            </span>
          )}

          {/* Priority Badge */}
          {task.priority && (
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded-md font-medium uppercase tracking-wider text-[10px] ${
                task.priority === 'high'
                  ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/50'
                  : task.priority === 'med'
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/50'
                  : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/50'
              }`}
            >
              {task.priority}
            </span>
          )}

          {/* Reminder Indicator */}
          {task.reminder?.enabled && (
            <span
              title={`Reminder at ${task.reminder.time}${
                task.reminder.recurring !== 'none' ? ` (${task.reminder.recurring})` : ''
              }`}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/40"
            >
              <Bell className="w-3 h-3" />
              {task.reminder.time}
              {task.reminder.recurring && task.reminder.recurring !== 'none' && (
                <Repeat className="w-2.5 h-2.5 ml-0.5" />
              )}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 shrink-0 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
        {onMoveToToday && (isPast || isOverdueView) && !task.completed && (
          <button
            type="button"
            onClick={() => onMoveToToday(task)}
            title="Move to Today"
            className="p-1.5 text-xs text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-lg transition"
          >
            <CalendarClock className="w-4 h-4" />
          </button>
        )}
        <button
          type="button"
          onClick={() => onEdit(task)}
          title="Edit Task"
          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => task.id && onDelete(task.id)}
          title="Delete Task"
          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
