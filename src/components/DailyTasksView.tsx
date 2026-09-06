import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  CheckCircle2,
  Plus,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ListTodo
} from 'lucide-react';
import { db, type Task } from '../db';
import { DateNavigator } from './DateNavigator';
import { TaskItem } from './TaskItem';
import { OverdueSection } from './OverdueSection';
import { NotificationBanner } from './NotificationBanner';
import { useNotificationScheduler } from '../hooks/useNotificationScheduler';
import { getTodayString, isPastDay } from '../utils/date';

interface DailyTasksViewProps {
  currentDate: string;
  onSelectDate: (date: string) => void;
  onOpenNewTask: () => void;
  onEditTask: (task: Task) => void;
}

export const DailyTasksView: React.FC<DailyTasksViewProps> = ({
  currentDate,
  onSelectDate,
  onOpenNewTask,
  onEditTask,
}) => {
  const [showCompleted, setShowCompleted] = useState(true);
  const { permission, requestPermission, sendTestNotification } = useNotificationScheduler();
  const todayStr = getTodayString();
  const isViewingToday = currentDate === todayStr;

  // Reactively query tasks for the current selected date
  const dayTasks = useLiveQuery(
    () => db.tasks.where('date').equals(currentDate).toArray(),
    [currentDate]
  ) || [];

  // Reactively query overdue tasks (incomplete tasks strictly before today)
  // Displayed prominently when viewing today
  const overdueTasks = useLiveQuery(async () => {
    if (!isViewingToday) return [];
    const allIncomplete = await db.tasks.filter(t => !t.completed && isPastDay(t.date)).toArray();
    // Sort oldest first
    return allIncomplete.sort((a, b) => a.date.localeCompare(b.date));
  }, [isViewingToday, todayStr]) || [];

  // Toggle complete
  const handleToggleTask = async (task: Task) => {
    if (!task.id) return;
    const nextCompleted = !task.completed;
    await db.tasks.update(task.id, {
      completed: nextCompleted,
      completedAt: nextCompleted ? new Date().toISOString() : undefined,
    });
  };

  // Delete task
  const handleDeleteTask = async (id: number) => {
    await db.tasks.delete(id);
  };

  // Move single task to today
  const handleMoveToToday = async (task: Task) => {
    if (!task.id) return;
    await db.tasks.update(task.id, {
      date: todayStr,
    });
  };

  // Batch reschedule all overdue tasks to today
  const handleRescheduleAllOverdue = async () => {
    await db.transaction('rw', db.tasks, async () => {
      for (const t of overdueTasks) {
        if (t.id) {
          await db.tasks.update(t.id, { date: todayStr });
        }
      }
    });
  };

  // Sort day tasks: incomplete first (by time or priority), completed last
  const incompleteTasks = dayTasks
    .filter((t) => !t.completed)
    .sort((a, b) => {
      // Priority weights
      const priorityWeight = { high: 3, med: 2, low: 1 };
      const weightA = a.priority ? priorityWeight[a.priority] : 0;
      const weightB = b.priority ? priorityWeight[b.priority] : 0;

      // If both have times, sort by time
      if (a.time && b.time) {
        return a.time.localeCompare(b.time);
      }
      if (a.time) return -1;
      if (b.time) return 1;

      // Otherwise sort by priority descending
      if (weightA !== weightB) {
        return weightB - weightA;
      }
      return a.createdAt.localeCompare(b.createdAt);
    });

  const completedTasks = dayTasks.filter((t) => t.completed);
  const totalDayTasks = dayTasks.length;
  const completionPercentage = totalDayTasks > 0 ? Math.round((completedTasks.length / totalDayTasks) * 100) : 0;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 sm:py-6">
      {/* Date Navigation Strip */}
      <DateNavigator currentDate={currentDate} onSelectDate={onSelectDate} />

      {/* Notification status and permission banner */}
      <NotificationBanner
        permission={permission}
        onRequestPermission={requestPermission}
        onSendTestNotification={sendTestNotification}
      />

      {/* Progress Bar (if there are tasks for the day) */}
      {totalDayTasks > 0 && (
        <div className="my-4 p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Daily Progress
            </span>
            <span className="font-medium text-slate-500 dark:text-slate-400">
              {completedTasks.length} of {totalDayTasks} completed ({completionPercentage}%)
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Overdue Rollover Section (when viewing today) */}
      {isViewingToday && overdueTasks.length > 0 && (
        <OverdueSection
          overdueTasks={overdueTasks}
          onToggle={handleToggleTask}
          onEdit={onEditTask}
          onDelete={handleDeleteTask}
          onMoveToToday={handleMoveToToday}
          onRescheduleAll={handleRescheduleAllOverdue}
        />
      )}

      {/* Tasks List */}
      <div className="space-y-4">
        {/* Incomplete Tasks */}
        <div className="space-y-2.5">
          {incompleteTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggleTask}
              onEdit={onEditTask}
              onDelete={handleDeleteTask}
              onMoveToToday={handleMoveToToday}
            />
          ))}
        </div>

        {/* Empty States */}
        {totalDayTasks === 0 && (
          <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center mb-3">
              <ListTodo className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              No tasks scheduled for this day
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
              Plan your day with focus. Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-mono border border-slate-200 dark:border-slate-700">N</kbd> or tap below to add your first task.
            </p>
            <button
              type="button"
              onClick={onOpenNewTask}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 shadow-sm transition"
            >
              <Plus className="w-4 h-4" /> Add Task
            </button>
          </div>
        )}

        {totalDayTasks > 0 && incompleteTasks.length === 0 && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300">
            <Sparkles className="w-5 h-5 shrink-0 text-emerald-500" />
            <div className="text-xs">
              <p className="font-semibold">All tasks completed for this day!</p>
              <p className="text-emerald-700/80 dark:text-emerald-400/80">
                You've cleared your task list. Take a breather or plan ahead.
              </p>
            </div>
          </div>
        )}

        {/* Completed Tasks Accordion */}
        {completedTasks.length > 0 && (
          <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
            <button
              type="button"
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition py-1"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Completed ({completedTasks.length})</span>
              {showCompleted ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showCompleted && (
              <div className="mt-2.5 space-y-2">
                {completedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={handleToggleTask}
                    onEdit={onEditTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
