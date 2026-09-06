import React, { useState, useEffect } from 'react';
import { X, Clock, AlertCircle, Calendar as CalendarIcon, Bell, Repeat } from 'lucide-react';
import type { Task, Priority, TaskReminder } from '../db';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  initialTask?: Task | null;
  defaultDate: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTask,
  defaultDate,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState<Priority | undefined>(undefined);
  
  // Reminder state
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('');
  const [recurring, setRecurring] = useState<TaskReminder['recurring']>('none');
  const [recurringDays, setRecurringDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setDate(initialTask.date);
      setTime(initialTask.time || '');
      setPriority(initialTask.priority);
      if (initialTask.reminder) {
        setReminderEnabled(initialTask.reminder.enabled);
        setReminderTime(initialTask.reminder.time);
        setRecurring(initialTask.reminder.recurring || 'none');
        setRecurringDays(initialTask.reminder.recurringDays || [1, 2, 3, 4, 5]);
      } else {
        setReminderEnabled(false);
        setReminderTime(initialTask.time || '09:00');
        setRecurring('none');
        setRecurringDays([1, 2, 3, 4, 5]);
      }
    } else {
      setTitle('');
      setDescription('');
      setDate(defaultDate);
      setTime('');
      setPriority(undefined);
      setReminderEnabled(false);
      setReminderTime('09:00');
      setRecurring('none');
      setRecurringDays([1, 2, 3, 4, 5]);
    }
  }, [initialTask, defaultDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const taskData: Omit<Task, 'id' | 'createdAt'> = {
        title: title.trim(),
        description: description.trim() || undefined,
        date,
        completed: initialTask ? initialTask.completed : false,
        completedAt: initialTask?.completedAt,
        priority,
        time: time || undefined,
        reminder: reminderEnabled
          ? {
              enabled: true,
              time: reminderTime || time || '09:00',
              recurring: recurring || 'none',
              recurringDays: recurring === 'weekly' ? recurringDays : undefined,
              lastNotified: initialTask?.reminder?.lastNotified,
            }
          : undefined,
      };

      await onSave(taskData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden transition-all text-slate-900 dark:text-slate-100"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <h2 className="text-lg font-semibold tracking-tight">
            {initialTask ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Task Title */}
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Review project deliverables"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Description / Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details, links, or context..."
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm transition resize-none"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                <CalendarIcon className="w-3.5 h-3.5" /> Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm transition"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                <Clock className="w-3.5 h-3.5" /> Time (Optional)
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                  if (!reminderTime) setReminderTime(e.target.value);
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm transition"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Priority
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'None', val: undefined, activeClass: 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600' },
                { label: 'Low', val: 'low' as Priority, activeClass: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700' },
                { label: 'Med', val: 'med' as Priority, activeClass: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700' },
                { label: 'High', val: 'high' as Priority, activeClass: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-700' },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setPriority(opt.val)}
                  className={`py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    priority === opt.val
                      ? `${opt.activeClass} font-semibold ring-1 ring-offset-1 dark:ring-offset-slate-900`
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reminder Section */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <Bell className="w-4 h-4 text-indigo-500" />
                <span>Enable Reminder Notification</span>
              </label>
              <input
                type="checkbox"
                checked={reminderEnabled}
                onChange={(e) => {
                  setReminderEnabled(e.target.checked);
                  if (e.target.checked && !reminderTime) {
                    setReminderTime(time || '09:00');
                  }
                }}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-600 dark:bg-slate-800"
              />
            </div>

            {reminderEnabled && (
              <div className="mt-3 p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-xl space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
                      Reminder Time
                    </span>
                    <input
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1 flex items-center gap-1">
                      <Repeat className="w-3 h-3" /> Repeat
                    </span>
                    <select
                      value={recurring}
                      onChange={(e) => setRecurring(e.target.value as TaskReminder['recurring'])}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                    >
                      <option value="none">One-time</option>
                      <option value="daily">Daily</option>
                      <option value="weekdays">Weekdays (Mon-Fri)</option>
                      <option value="weekly">Weekly (Select days)</option>
                    </select>
                  </div>
                </div>

                {/* Day-of-week picker when recurring is weekly */}
                {recurring === 'weekly' && (
                  <div>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1.5">
                      Select Days
                    </span>
                    <div className="grid grid-cols-7 gap-1">
                      {[
                        { day: 0, label: 'Su' },
                        { day: 1, label: 'Mo' },
                        { day: 2, label: 'Tu' },
                        { day: 3, label: 'We' },
                        { day: 4, label: 'Th' },
                        { day: 5, label: 'Fr' },
                        { day: 6, label: 'Sa' },
                      ].map(({ day, label }) => {
                        const isSelected = recurringDays.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                if (recurringDays.length > 1) {
                                  setRecurringDays(recurringDays.filter((d) => d !== day));
                                }
                              } else {
                                setRecurringDays([...recurringDays, day].sort());
                              }
                            }}
                            className={`py-1 text-xs rounded font-medium transition ${
                              isSelected
                                ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Honest disclaimer notice */}
                <div className="flex items-start gap-1.5 text-[11px] text-amber-700 dark:text-amber-400/90 leading-tight">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>
                    <strong>Best-effort:</strong> Notifications fire while the app is open or running in the background. They cannot fire if the browser is force-quit.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none rounded-xl shadow-sm transition-colors"
            >
              {initialTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
