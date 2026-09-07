import React, { useState, useRef, useEffect } from 'react';
import { Plus, Clock, X } from 'lucide-react';
import type { Priority } from '../../db';

interface OneGestureAddProps {
  onAddTask: (title: string, priority?: Priority, time?: string) => Promise<void>;
  onAddHabit?: (title: string) => Promise<void>;
  isOpen: boolean;
  onClose: () => void;
}

export const OneGestureAdd: React.FC<OneGestureAddProps> = ({
  onAddTask,
  onAddHabit,
  isOpen,
  onClose,
}) => {
  const [entryType, setEntryType] = useState<'task' | 'habit'>('task');
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('med');
  const [time, setTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setTitle('');
      setTime('');
      setPriority('med');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (entryType === 'task') {
        await onAddTask(title.trim(), priority, time || undefined);
      } else if (onAddHabit) {
        await onAddHabit(title.trim());
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/30 dark:bg-black/60 backdrop-blur-xs animate-soft-fade-up">
      <div
        className="w-full max-w-lg bg-white dark:bg-night-surface rounded-t-3xl sm:rounded-3xl shadow-calm-lg border border-stone-200/80 dark:border-night-border p-5 sm:p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* iOS Pull Handle */}
        <div className="w-10 h-1 bg-stone-300 dark:bg-stone-600 rounded-full mx-auto sm:hidden" />

        {/* Top Type Selector: Task vs Daily Habit */}
        <div className="flex items-center justify-between">
          <div className="flex p-1 bg-stone-100 dark:bg-night-card rounded-2xl border border-stone-200/60 dark:border-night-border">
            <button
              type="button"
              onClick={() => setEntryType('task')}
              className={`px-3.5 py-1 text-xs font-medium rounded-xl transition-all ${
                entryType === 'task'
                  ? 'bg-white dark:bg-night-surface text-stone-800 dark:text-stone-100 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              Today's Task
            </button>
            <button
              type="button"
              onClick={() => setEntryType('habit')}
              className={`px-3.5 py-1 text-xs font-medium rounded-xl transition-all ${
                entryType === 'habit'
                  ? 'bg-white dark:bg-night-surface text-stone-800 dark:text-stone-100 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              Recurring Habit
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Calm Input Field */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                entryType === 'task'
                  ? 'What quietly needs your attention?'
                  : 'A gentle rhythm (e.g., Morning herbal tea, 10 min walk)...'
              }
              className="w-full text-base sm:text-lg bg-transparent border-0 border-b border-stone-200 dark:border-night-border focus:border-sage-500 dark:focus:border-sage-400 focus:ring-0 px-0 py-2.5 text-stone-800 dark:text-stone-100 placeholder:text-stone-400 font-serif focus:outline-none transition-colors"
            />
          </div>

          {/* Gentle Options (Only for task) */}
          {entryType === 'task' && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400">Pace:</span>
                {(['low', 'med', 'high'] as Priority[]).map((p) => {
                  const labels = { low: 'Gentle', med: 'Balanced', high: 'Deep Focus' };
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`text-xs px-2.5 py-1 rounded-xl transition-all font-medium ${
                        priority === p
                          ? 'bg-stone-200/80 dark:bg-night-card text-stone-800 dark:text-stone-100 border border-stone-300 dark:border-night-border'
                          : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
                      }`}
                    >
                      {labels[p]}
                    </button>
                  );
                })}
              </div>

              {/* Time whisper (optional) */}
              <div className="flex items-center gap-1.5 text-xs text-stone-400 bg-stone-50 dark:bg-night-card px-2.5 py-1 rounded-xl border border-stone-200/50 dark:border-night-border">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="bg-transparent border-0 p-0 text-xs text-stone-700 dark:text-stone-300 focus:ring-0 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Footer Submit */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-stone-400 italic">
              Press Enter or tap plant
            </span>
            <button
              type="submit"
              disabled={!title.trim() || isSubmitting}
              className="px-5 py-2.5 rounded-2xl bg-sage-600 hover:bg-sage-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium tracking-wide transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{entryType === 'task' ? 'Add to Today' : 'Plant Habit'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
