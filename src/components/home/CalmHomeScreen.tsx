import React, { useState } from 'react';
import { Plus, Moon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { TreeCanvas } from '../tree/TreeCanvas';
import { TreeStatsModal } from '../tree/TreeStatsModal';
import { DayEndTransitionModal } from '../tree/DayEndTransitionModal';
import { OneGestureAdd } from '../tasks/OneGestureAdd';
import { CalmTaskItem } from '../tasks/CalmTaskItem';
import { CalmHabitRow } from '../tasks/CalmHabitRow';
import type { Task, Habit, TreeState, TreeDayLog, Priority, DailyNote, TreeLifecycleStage } from '../../db';
import { translations, type AppLanguage } from '../../utils/i18n';

interface CalmHomeScreenProps {
  currentDate: string; // YYYY-MM-DD
  tasks: Task[];
  habits: Habit[];
  habitLogs: Record<number, Record<string, boolean>>; // habitId -> date -> boolean
  treeState?: TreeState;
  onSetTreeState?: (state: TreeState) => void;
  onAddTask: (title: string, priority?: Priority, time?: string) => Promise<void>;
  onToggleTask: (task: Task) => void;
  onDeleteTask: (id: number) => void;
  onAddHabit: (title: string) => Promise<void>;
  onToggleHabit: (habitId: number) => void;
  noPressureMode: boolean;
  recentTreeLogs: TreeDayLog[];
  journalCount?: number;
  recentNotes?: DailyNote[];
  totalWeeksAccumulated?: number;
  speciesId?: string;
  lifecycleStage?: TreeLifecycleStage;
  isDimmed?: boolean;
  lang?: AppLanguage;
  onOpenGarden?: () => void;
}

export const CalmHomeScreen: React.FC<CalmHomeScreenProps> = ({
  currentDate,
  tasks,
  habits,
  habitLogs,
  treeState = 'foliage',
  onSetTreeState,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onAddHabit,
  onToggleHabit,
  noPressureMode,
  recentTreeLogs,
  journalCount = 4,
  recentNotes = [],
  totalWeeksAccumulated = 12,
  speciesId = 'noble_pine',
  lifecycleStage = 'mature',
  isDimmed = false,
  lang = 'en',
  onOpenGarden,
}) => {
  const t = translations[lang] || translations.en;
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showDayEndModal, setShowDayEndModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // 7-day week calculation
  const weekDates = [0, 1, 2, 3, 4, 5, 6].map((offset) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - offset));
    return d.toISOString().split('T')[0];
  });

  const tasksCompleted = tasks.filter((t) => t.completed).length;
  const tasksTotal = tasks.length;

  const todayHabitsCompleted = habits.filter(
    (h) => h.id && habitLogs[h.id]?.[currentDate]
  ).length;
  const habitsTotal = habits.length;

  const totalActions = tasksTotal + habitsTotal;
  const totalCompleted = tasksCompleted + todayHabitsCompleted;
  const completionRate = totalActions > 0 ? (totalCompleted / totalActions) * 100 : 100;

  const formattedDate = format(parseISO(currentDate), 'EEEE, MMMM d');

  return (
    <div className="flex-1 flex flex-col px-4 sm:px-6 space-y-6 pb-20">
      {/* Top Serene Date Header & Evening Reflection Trigger */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[11px] font-medium tracking-wider uppercase text-sage-600 dark:text-sage-400">
            {t.headers.todaysMirror}
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-medium text-stone-800 dark:text-stone-100">
            {formattedDate}
          </h2>
        </div>

        {/* Evening Reflection Trigger Button */}
        <button
          onClick={() => setShowDayEndModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-earth-100/80 dark:bg-night-card hover:bg-earth-200/70 border border-earth-200/60 dark:border-night-border text-earth-800 dark:text-stone-300 text-xs font-medium transition-all shadow-xs active:scale-95"
          title="Simulate Day's End (The once-daily update moment)"
        >
          <Moon className="w-3.5 h-3.5 text-earth-600 dark:text-stone-400" />
          <span>{t.tree.daysEndReflect}</span>
        </button>
      </div>

      {/* The Botanical Tree Stage (Core Plant Mirror) */}
      <div className="flex flex-col items-center justify-center py-2 relative">
        <TreeCanvas
          lifecycleStage={lifecycleStage}
          isDimmed={isDimmed}
          state={treeState}
          onTapTree={() => setShowStatsModal(true)}
          size="md"
          journalCount={journalCount}
          recentNotes={recentNotes}
          totalWeeksAccumulated={totalWeeksAccumulated}
          speciesId={speciesId}
          onOpenGarden={onOpenGarden}
          lang={lang}
        />
      </div>

      {/* One-Gesture Quick Task Add (Serene Whisper Bar) */}
      <div
        onClick={() => setShowAddModal(true)}
        role="button"
        tabIndex={0}
        className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/80 dark:bg-night-surface/90 border border-stone-200/70 dark:border-night-border shadow-xs hover:border-sage-400 dark:hover:border-sage-500 cursor-pointer transition-all active:scale-[0.99] group"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-xl bg-sage-50 dark:bg-night-card text-sage-600 dark:text-sage-400 flex items-center justify-center group-hover:bg-sage-600 group-hover:text-white transition-all">
            <Plus className="w-4 h-4" />
          </div>
          <span className="text-xs sm:text-sm text-stone-400 font-serif italic">
            {t.tasks.addPlaceholder}
          </span>
        </div>
        <span className="text-[11px] text-stone-400 bg-stone-100 dark:bg-night-card px-2 py-0.5 rounded-md">
          {t.tasks.pullOrTap}
        </span>
      </div>

      {/* Daily Habits Section */}
      {habits.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-serif font-medium text-stone-600 dark:text-stone-300 tracking-wide">
              Daily Habits (Gentle Rhythm)
            </span>
            <span className="text-[11px] text-stone-400">
              {noPressureMode ? 'flowing' : `${todayHabitsCompleted} of ${habits.length} tended`}
            </span>
          </div>

          <div className="space-y-2">
            {habits.map((habit) => {
              const habitLogRecord = habit.id ? habitLogs[habit.id] || {} : {};
              const isDone = habit.id ? !!habitLogRecord[currentDate] : false;
              return (
                <CalmHabitRow
                  key={habit.id}
                  habit={habit}
                  weekLogs={habitLogRecord}
                  weekDates={weekDates}
                  isCompletedToday={isDone}
                  onToggleToday={onToggleHabit}
                  noPressureMode={noPressureMode}
                  streakCount={3}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Today's Tasks Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-serif font-medium text-stone-600 dark:text-stone-300 tracking-wide">
            Today's Quiet Tasks
          </span>
          <span className="text-[11px] text-stone-400">
            {noPressureMode
              ? tasksCompleted > 0
                ? 'in rhythm'
                : 'open'
              : `${tasksCompleted} of ${tasksTotal} checked`}
          </span>
        </div>

        {tasks.length === 0 ? (
          <div className="py-8 text-center rounded-2xl bg-white/40 dark:bg-night-surface/40 border border-dashed border-stone-200 dark:border-night-border/70 p-4">
            <p className="font-serif text-sm text-stone-400 dark:text-stone-500 italic">
              A clear horizon. Tap above to add a calm task.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <CalmTaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleTask}
                onDelete={onDeleteTask}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <TreeStatsModal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        currentState={treeState}
        noPressureMode={noPressureMode}
        weekDaysTended={5}
        completionRate={completionRate}
        recentLogs={recentTreeLogs}
        onTriggerEveningReflection={() => setShowDayEndModal(true)}
      />

      <DayEndTransitionModal
        isOpen={showDayEndModal}
        onClose={() => setShowDayEndModal(false)}
        tasksCompleted={tasksCompleted}
        tasksTotal={tasksTotal}
        habitsCompleted={todayHabitsCompleted}
        habitsTotal={habitsTotal}
        onApplyTransition={(nextState) => onSetTreeState?.(nextState)}
      />

      <OneGestureAdd
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddTask={onAddTask}
        onAddHabit={onAddHabit}
      />
    </div>
  );
};
