import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  db,
  seedInitialGardenTreesIfEmpty,
  calculateIsDimmedNeglect,
  type Task,
  type Priority,
  type GardenTree,
} from './db';
import { Navbar, type AppView } from './components/Navbar';
import { BottomNavbar } from './components/BottomNavbar';
import { CalmHomeScreen } from './components/home/CalmHomeScreen';
import { LockedJournalView } from './components/journal/LockedJournalView';
import { CalendarView } from './components/CalendarView';
import { DataManagementView } from './components/DataManagementView';
import { GardenGroveView } from './components/garden/GardenGroveView';
import { ShareSnapshotModal } from './components/share/ShareSnapshotModal';
import { YearlyRecapModal } from './components/recap/YearlyRecapModal';
import { ContextualNotificationModal } from './components/notifications/ContextualNotificationModal';
import { CalmOnboardingModal } from './components/onboarding/CalmOnboardingModal';
import { PlatformShell, type PlatformMode } from './components/mockups/PlatformShell';
import { OneGestureAdd } from './components/tasks/OneGestureAdd';
import { useTheme } from './hooks/useTheme';
import { getTodayString } from './utils/date';
import { getInitialLanguage, saveLanguage, isRtl, type AppLanguage } from './utils/i18n';
import { Languages, Sparkles, Sun, Moon } from 'lucide-react';

export function App() {
  const { theme, setTheme, toggleTheme } = useTheme();
  const [currentView, setCurrentView] = useState<AppView>('tasks');
  const [currentDate, setCurrentDate] = useState<string>(getTodayString());
  const [previewPlatform, setPreviewPlatform] = useState<PlatformMode>('ios');
  const [noPressureMode, setNoPressureMode] = useState<boolean>(() => {
    return localStorage.getItem('treeplanner_nopressure') === 'true';
  });

  // Language state: 'en' | 'ckb' (Sorani Kurdish RTL)
  const [lang, setLang] = useState<AppLanguage>(getInitialLanguage);

  // Modals state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isRecapModalOpen, setIsRecapModalOpen] = useState(false);
  const [isContextualNotifOpen, setIsContextualNotifOpen] = useState(false);

  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('treeplanner_onboarded') !== 'true';
  });

  // Global Add Modal state
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // Optional desktop preview mode via URL parameter (e.g. ?preview=true)
  const isPreview = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('preview') === 'true';

  // Seed sample grove data on first visit
  useEffect(() => {
    seedInitialGardenTreesIfEmpty();
  }, []);

  // Queries
  const tasks = useLiveQuery(
    () => db.tasks.where('date').equals(currentDate).toArray(),
    [currentDate]
  ) || [];

  const habits = useLiveQuery(() => db.habits.where('archived').notEqual(1).toArray()) || [];
  const habitLogsList = useLiveQuery(() => db.habitLogs.toArray()) || [];
  const recentTreeLogs = useLiveQuery(() => db.treeLogs.toArray()) || [];
  const notes = useLiveQuery(() => db.notes.toArray()) || [];
  const gardenTrees = useLiveQuery(() => db.gardenTrees.toArray()) || [];
  const activeTree: GardenTree | undefined =
    gardenTrees.find((t) => t.isActive === 1 || t.status === 'growing') || gardenTrees[0];

  // Map habit logs into { [habitId]: { [date]: boolean } }
  const habitLogsMap: Record<number, Record<string, boolean>> = {};
  for (const log of habitLogsList) {
    if (!habitLogsMap[log.habitId]) {
      habitLogsMap[log.habitId] = {};
    }
    habitLogsMap[log.habitId][log.date] = log.completed;
  }

  // Automatic Inactivity / Neglect calculation from database records
  const isDimmed = calculateIsDimmedNeglect(tasks, habits, habitLogsMap, currentDate, recentTreeLogs);

  // Contextual notification prompt: triggered strictly upon tree neglect (gentle rest), never on onboarding
  useEffect(() => {
    if (isDimmed) {
      const alreadyAsked = localStorage.getItem('treeplanner_contextual_notif_asked') === 'true';
      if (!alreadyAsked) {
        setIsContextualNotifOpen(true);
      }
    }
  }, [isDimmed]);

  // Toggle No-Pressure Mode
  const handleToggleNoPressure = () => {
    setNoPressureMode((prev) => {
      const next = !prev;
      localStorage.setItem('treeplanner_nopressure', String(next));
      return next;
    });
  };

  // Language Toggle (English <-> Sorani Kurdish RTL)
  const handleToggleLang = () => {
    const nextLang: AppLanguage = lang === 'en' ? 'ckb' : 'en';
    setLang(nextLang);
    saveLanguage(nextLang);
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
  const rtl = isRtl(lang);

  const appContent = (
    <div
      dir={rtl ? 'rtl' : 'ltr'}
      className={`w-full min-h-dvh flex flex-col bg-parchment text-stone-800 dark:bg-night-bg dark:text-stone-100 safe-pt safe-pb safe-pl safe-pr transition-colors duration-500 overflow-x-hidden ${
        rtl ? 'font-sans text-right' : ''
      }`}
    >
      {/* Top Serene Header with Language, Zen Mode & Theme Controls */}
      <header className="sticky top-0 z-30 w-full max-w-md mx-auto px-4 py-2 flex items-center justify-between text-xs bg-parchment/85 dark:bg-night-bg/85 backdrop-blur-xl border-b border-stone-200/50 dark:border-night-border/70">
        <div className="flex items-center gap-2">
          <span className="font-serif font-medium text-stone-800 dark:text-stone-100 text-sm tracking-wide">
            The Tree Planner
          </span>
          <span className="px-2 py-0.5 rounded-full bg-sage-100/80 dark:bg-night-card text-sage-700 dark:text-sage-300 text-[10px] font-medium">
            v1.0
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleLang}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-medium border border-stone-200/70 dark:border-night-border bg-stone-100/70 dark:bg-night-card text-stone-700 dark:text-stone-300 hover:bg-stone-200/60 transition-all shadow-xs"
            title="Toggle Language: English / کوردی سۆرانی"
          >
            <Languages className="w-3.5 h-3.5 text-sage-600" />
            <span>{lang === 'ckb' ? 'کوردی' : 'English'}</span>
          </button>

          <button
            onClick={handleToggleNoPressure}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] transition-all border ${
              noPressureMode
                ? 'bg-sage-100 dark:bg-sage-950/60 border-sage-300 dark:border-sage-800 text-sage-800 dark:text-sage-200 font-medium'
                : 'bg-transparent border-transparent text-stone-500 hover:bg-stone-200/50 dark:hover:bg-night-card'
            }`}
            title="Toggle No-Pressure Mode"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{noPressureMode ? 'Zen' : 'Calm'}</span>
          </button>

          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-xl text-stone-500 hover:bg-stone-200/60 dark:hover:bg-night-card transition-colors"
            title="Toggle Dark / Light Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Platform Sub-Header */}
      <Navbar
        currentView={currentView}
        onOpenNewTask={() => setIsQuickAddOpen(true)}
        lang={lang}
      />

      {/* Main Viewport */}
      <main className="flex-1 flex flex-col pt-2 pb-24 w-full max-w-md mx-auto">
        {currentView === 'tasks' && (
          <CalmHomeScreen
            currentDate={currentDate}
            tasks={tasks}
            habits={habits}
            habitLogs={habitLogsMap}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onAddHabit={handleAddHabit}
            onToggleHabit={handleToggleHabit}
            noPressureMode={noPressureMode}
            recentTreeLogs={recentTreeLogs}
            journalCount={notes.length}
            recentNotes={notes}
            speciesId={activeTree?.speciesId || 'noble_pine'}
            lifecycleStage={activeTree?.lifecycleStage || 'mature'}
            isDimmed={isDimmed}
            lang={lang}
            onOpenGarden={() => setCurrentView('garden')}
          />
        )}

        {currentView === 'garden' && (
          <GardenGroveView
            gardenTrees={gardenTrees}
            activeTree={activeTree}
            onOpenShareModal={() => setIsShareModalOpen(true)}
            onOpenRecapModal={() => setIsRecapModalOpen(true)}
            lang={lang}
            onBackToMirror={() => setCurrentView('tasks')}
          />
        )}

        {currentView === 'notes' && (
          <LockedJournalView
            currentDate={currentDate}
            onSelectDate={setCurrentDate}
          />
        )}

        {currentView === 'calendar' && (
          <div className="px-1 pb-24">
            <CalendarView
              currentDate={currentDate}
              onSelectDate={setCurrentDate}
              onJumpToDayTasks={(date) => {
                setCurrentDate(date);
                setCurrentView('tasks');
              }}
              onJumpToJournal={(date) => {
                setCurrentDate(date);
                setCurrentView('notes');
              }}
              lang={lang}
            />
          </div>
        )}

        {currentView === 'data' && (
          <DataManagementView
            theme={theme}
            onSetTheme={setTheme}
            noPressureMode={noPressureMode}
            onToggleNoPressure={handleToggleNoPressure}
            speciesId={activeTree?.speciesId || 'noble_pine'}
            lifecycleStage={activeTree?.lifecycleStage || 'mature'}
            journalCount={notes.length}
            onQuickAddTask={() => setIsQuickAddOpen(true)}
            lang={lang}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavbar
        currentView={currentView}
        onSelectView={setCurrentView}
        hasJournalLock={hasJournalLock}
        lang={lang}
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

      {/* 9:16 Shareable Story Snapshot Modal */}
      <ShareSnapshotModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        speciesId={activeTree?.speciesId || 'noble_pine'}
        lifecycleStage={activeTree?.lifecycleStage || 'mature'}
        daysTended={activeTree?.daysTended || 14}
        journalCount={notes.length}
        ringsCount={activeTree?.ringsCount || 2}
        lang={lang}
      />

      {/* Spotify-Wrapped Style Yearly Botanical Recap Modal */}
      <YearlyRecapModal
        isOpen={isRecapModalOpen}
        onClose={() => setIsRecapModalOpen(false)}
        gardenTrees={gardenTrees}
        totalJournalCount={notes.length}
        totalWeeksAccumulated={16}
        lang={lang}
        onOpenShareModal={() => {
          setIsRecapModalOpen(false);
          setIsShareModalOpen(true);
        }}
      />

      {/* Contextual Notification Permission Modal (Gentle Rest only) */}
      <ContextualNotificationModal
        isOpen={isContextualNotifOpen}
        onClose={() => setIsContextualNotifOpen(false)}
        lang={lang}
      />
    </div>
  );

  // If preview mode is requested via URL parameter (?preview=true), wrap in PlatformShell
  if (isPreview) {
    return (
      <PlatformShell
        platformMode={previewPlatform}
        onSelectPlatform={setPreviewPlatform}
        isDark={theme === 'dark'}
        onToggleTheme={toggleTheme}
        noPressureMode={noPressureMode}
        onToggleNoPressure={handleToggleNoPressure}
        lang={lang}
        onToggleLang={handleToggleLang}
      >
        {appContent}
      </PlatformShell>
    );
  }

  // Shipped Full-Bleed Edge-to-Edge Experience
  return appContent;
}

export default App;
