import React from 'react';
import { Check, Clock, Trash2 } from 'lucide-react';
import type { Task } from '../../db';

interface CalmTaskItemProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onDelete: (id: number) => void;
}

export const CalmTaskItem: React.FC<CalmTaskItemProps> = ({
  task,
  onToggleComplete,
  onDelete,
}) => {
  const isCompleted = task.completed;

  return (
    <div className="group relative flex items-center justify-between py-3 px-3.5 rounded-2xl transition-all duration-300 bg-white/70 dark:bg-night-surface/70 hover:bg-white dark:hover:bg-night-surface border border-stone-200/50 dark:border-night-border/70 shadow-xs">
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <button
          onClick={() => onToggleComplete(task)}
          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-400 shrink-0 ${
            isCompleted
              ? 'bg-sage-600 border-sage-600 text-white'
              : 'border-2 border-stone-300 dark:border-stone-600 hover:border-sage-500 dark:hover:border-sage-400 bg-transparent'
          }`}
          aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
        >
          {isCompleted && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
        </button>

        <div className="min-w-0 flex-1">
          <p
            className={`text-sm tracking-wide font-normal transition-all duration-300 truncate ${
              isCompleted
                ? 'line-through text-stone-400 dark:text-stone-400 font-light'
                : 'text-stone-800 dark:text-stone-100'
            }`}
          >
            {task.title}
          </p>

          {task.time && (
            <div className="flex items-center gap-1 mt-0.5 text-[11px] text-stone-400">
              <Clock className="w-3 h-3" />
              <span>{task.time}</span>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => task.id && onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-opacity"
        aria-label="Remove item"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
