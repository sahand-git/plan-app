import React, { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, CalendarClock } from 'lucide-react';
import type { Task } from '../db';
import { TaskItem } from './TaskItem';

interface OverdueSectionProps {
  overdueTasks: Task[];
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onMoveToToday: (task: Task) => void;
  onRescheduleAll: () => void;
}

export const OverdueSection: React.FC<OverdueSectionProps> = ({
  overdueTasks,
  onToggle,
  onEdit,
  onDelete,
  onMoveToToday,
  onRescheduleAll,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (overdueTasks.length === 0) return null;

  return (
    <div className="mb-6 rounded-2xl border border-rose-200/80 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 p-4 transition-all">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-rose-900 dark:text-rose-200">
                Overdue Tasks
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-rose-200/80 dark:bg-rose-900 text-rose-800 dark:text-rose-200">
                {overdueTasks.length}
              </span>
            </div>
            <p className="text-[11px] text-rose-700/80 dark:text-rose-400">
              Rolled over from previous days
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onRescheduleAll}
            title="Reschedule all overdue tasks to today"
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-rose-800 dark:text-rose-200 bg-rose-100 dark:bg-rose-900/50 hover:bg-rose-200/80 dark:hover:bg-rose-900/80 rounded-lg transition"
          >
            <CalendarClock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Move all to Today</span>
            <span className="sm:hidden">Move all</span>
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-lg transition"
            aria-label={isExpanded ? 'Collapse overdue section' : 'Expand overdue section'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-3.5 space-y-2">
          {overdueTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
              onMoveToToday={onMoveToToday}
              isOverdueView={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};
