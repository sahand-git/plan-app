import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Task, type TreeState, type Priority } from './db';
import { Navbar, type AppView } from './components/Navbar';
import { BottomNavbar } from './components/BottomNavbar';
import { CalmHomeScreen } from './components/home/CalmHomeScreen';
import { LockedJournalView } from './components/journal/LockedJournalView';
import { CalendarView } from './components/CalendarView';
import { DataManagementView } from './components/DataManagementView';
import { CalmOnboardingModal } from './components/onboarding/CalmOnboardingModal';
import { PlatformShell, type PlatformMode } from './components/mockups/PlatformShell';
import { OneGestureAdd } from './components/tasks/OneGestureAdd';
import { useTheme } from './hooks/useTheme';
import { getTodayString } from './utils/date';

export function App() {
  const { theme, setTheme, toggleTheme } = useTheme();
  const [currentView, setCurrentView] = useState<AppView>('tasks');
  const [currentDate, setCurrentDate] = useState<string>(getTodayString());
  const [platformMode, setPlatformMode] = useState<PlatformMode>('ios');
  const [noPressureMode, setNoPressureMode] = useState<boolean>(() => {
    return localStorage.getItem('treeplanner_nopressure') === 'true';
  });

  // Botanical Tree State: 'seedling' | 'sapling' | 'foliage' | 'flourishing' | 'gentle_wilt'
  const [treeState, setTreeState] = useState<TreeState>(() => {
    return (localStorage.getItem('treeplanner_tree_state') as TreeState) || 'foliage';
  });

  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('treeplanner_onboarded') !== 'true';
  });

  // Global Add Modal state
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // Queries
  const tasks = useLiveQuery(
    () => db.tasks.where('date').equals(currentDate).toArray(),
    [currentDate]
  ) || [];

  const habits = useLiveQuery(() => db.habits.where('archived').notEqual(1).toArray()) || [];
  const habitLogsList = useLiveQuery(() => db.habitLogs.toArray()) || [];
  const recentTreeLogs = useLiveQuery(() => db.treeLogs.toArray()) || [];

  // Map habit logs into { [habitId]: { [date]: boolean } }
  const habitLogsMap: Record<number, Record<string, boolean>> = {};
  for (const log of habitLogsList) {
    if (!habitLogsMap[log.habitId]) {
      habitLogsMap[log.habitId] = {};
    }
    habitLogsMap[log.habitId][log.date] = log.completed;
  }

  // Handle Tree State changes
  const handleSetTreeState = (state: TreeState) => {
    setTreeState(state);
    localStorage.setItem('treeplanner_tree_state', state);
  };

  // Toggle No-Pressure Mode
  const handleToggleNoPressure = () => {
    setNoPressureMode((prev) => {
      const next = !prev;
      localStorage.setItem('treeplanner_nopressure', String(next));
      return next;
    });
  };

  // Task Operations
  const handleAddTask = async (title: string, priority?: Priority, time?: string) => {
    await db.tasks.add({
      title,
      date: currentDate,
      completed: false,
      priority: priority || 'med',
      time,
      createdAt: new Date().toISOString(),
    });
  };

  const handleToggleTask = async (task: Task) => {
    if (!task.id) return;
    await db.tasks.update(task.id, {
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : undefined,
    });
  };

  const handleDeleteTask = async (id: number) => {
    await db.tasks.delete(id);
  };

  // Habit Operations
  const handleAddHabit = async (title: string) => {
    await db.habits.add({
      title,
      createdAt: new Date().toISOString(),
      targetDays: [],
    });
  };

  const handleToggleHabit = async (habitId: number) => {
    const existing = await db.habitLogs
      .where('[habitId+date]')
      .equals([habitId, currentDate])
      .first();

    if (existing && existing.id) {
      await db.habitLogs.update(existing.id, {
        completed: !existing.completed,
      });
    } else {
      await db.habitLogs.add({
        habitId,
        date: currentDate,
        completed: true,
      });
    }
  };

  const hasJournalLock = !!localStorage.getItem('treeplanner_journal_pin');

  return (
    <PlatformShell
      platformMode={platformMode}
      onSelectPlatform={setPlatformMode}
      isDark={theme === 'dark'}
      onToggleTheme={toggleTheme}
      noPressureMode={noPressureMode}
      onToggleNoPressure={handleToggleNoPressure}
    >
      {/* Platform Header */}
      <Navbar
        currentView={currentView}
        onOpenNewTask={() => setIsQuickAddOpen(true)}
      />

      {/* Main Viewport */}
      <main className="flex-1 flex flex-col pt-4">
        {currentView === 'tasks' && (
          <CalmHomeScreen
            currentDate={currentDate}
            tasks={tasks}
            habits={habits}
            habitLogs={habitLogsMap}
            treeState={treeState}
            onSetTreeState={handleSetTreeState}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onAddHabit={handleAddHabit}
            onToggleHabit={handleToggleHabit}
            noPressureMode={noPressureMode}
            recentTreeLogs={recentTreeLogs}
          />
        )}

        {currentView === 'notes' && (
          <LockedJournalView
            currentDate={currentDate}
            onSelectDate={setCurrentDate}
          />
        )}

        {currentView === 'calendar' && (
          <div className="px-3 pb-24">
            <CalendarView
              currentDate={currentDate}
              onSelectDate={setCurrentDate}
              onJumpToDayTasks={(date) => {
                setCurrentDate(date);
                setCurrentView('tasks');
              }}
            />
          </div>
        )}

        {currentView === 'data' && (
          <DataManagementView
            theme={theme}
            onSetTheme={setTheme}
            noPressureMode={noPressureMode}
            onToggleNoPressure={handleToggleNoPressure}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavbar
        currentView={currentView}
        onSelectView={setCurrentView}
        platformMode={platformMode}
        hasJournalLock={hasJournalLock}
      />

      {/* Global Quick Add Modal */}
      <OneGestureAdd
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddTask={handleAddTask}
        onAddHabit={handleAddHabit}
      />

      {/* Onboarding for first run */}
      <CalmOnboardingModal
        isOpen={showOnboarding}
        onComplete={() => setShowOnboarding(false)}
      />
    </PlatformShell>
  );
}

export default App;
