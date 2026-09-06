import React from 'react';
import {
  CheckSquare,
  Calendar,
  BookOpen,
  Flame,
  Settings,
  Sun,
  Moon,
  Plus
} from 'lucide-react';
import type { Theme } from '../hooks/useTheme';

export type AppView = 'tasks' | 'calendar' | 'notes' | 'habits' | 'data';

interface NavbarProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  onOpenNewTask: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  onOpenNewTask,
  theme,
  onToggleTheme,
}) => {
  const navItems: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
    { id: 'notes', label: 'Journal', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'habits', label: 'Habits', icon: <Flame className="w-4 h-4" /> },
    { id: 'data', label: 'Data', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-3xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand & Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20">
            D
          </div>
          <span className="font-bold text-base tracking-tight hidden xs:inline text-slate-900 dark:text-white">
            DayFlow
          </span>
        </div>

        {/* Navigation Tabs (Desktop & Mobile Pills) */}
        <nav className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/50 overflow-x-auto max-w-[280px] sm:max-w-none">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Theme Toggle & Quick Add Task */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 transition"
            title={`Current: ${theme}. Click to switch theme.`}
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          <button
            type="button"
            onClick={onOpenNewTask}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition shadow-indigo-600/20"
            title="Add Task (Press 'n')"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Task</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.2 rounded bg-indigo-700/60 text-[10px] text-indigo-200">
              N
            </kbd>
          </button>
        </div>
      </div>
    </header>
  );
};
