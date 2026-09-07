import React from 'react';
import { Sprout, BookOpen, Calendar, Settings, Flower2 } from 'lucide-react';
import type { AppView } from './Navbar';
import { translations, type AppLanguage } from '../utils/i18n';

interface BottomNavbarProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  platformMode?: 'ios' | 'android' | 'responsive';
  hasJournalLock?: boolean;
  lang?: AppLanguage;
}

export const BottomNavbar: React.FC<BottomNavbarProps> = ({
  currentView,
  onSelectView,
  platformMode,
  hasJournalLock = false,
  lang = 'en',
}) => {
  const t = translations[lang] || translations.en;

  const navTabs: { id: AppView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'tasks', label: t.tabs.mirror, icon: Sprout },
    { id: 'garden', label: t.tabs.garden, icon: Flower2 },
    { id: 'notes', label: t.tabs.journal, icon: BookOpen },
    { id: 'calendar', label: t.tabs.calendar, icon: Calendar },
    { id: 'data', label: t.tabs.vault, icon: Settings },
  ];

  if (platformMode === 'android') {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-night-surface/95 border-t border-stone-200/60 dark:border-night-border safe-pb shadow-m3">
        <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-around">
          {navTabs.map((tab) => {
            const isActive = currentView === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectView(tab.id)}
                className="flex flex-col items-center justify-center group focus:outline-none"
              >
                <div
                  className={`w-14 h-8 rounded-full flex items-center justify-center transition-all m3-transition ${
                    isActive
                      ? 'bg-sage-200 dark:bg-sage-800/80 text-sage-900 dark:text-sage-100 scale-105'
                      : 'text-stone-500 dark:text-stone-400 group-hover:bg-stone-100 dark:group-hover:bg-night-card'
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[1.8]" />
                </div>
                <span
                  className={`text-[11px] font-sans mt-1 transition-colors ${
                    isActive
                      ? 'text-stone-900 dark:text-stone-100 font-medium'
                      : 'text-stone-500 dark:text-stone-400 font-normal'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-parchment/85 dark:bg-night-bg/85 backdrop-blur-xl border-t border-stone-200/50 dark:border-night-border/80 safe-pb">
      <div className="max-w-md mx-auto px-3 py-1.5 flex items-center justify-around">
        {navTabs.map((tab) => {
          const isActive = currentView === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectView(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl ios-spring active:scale-90 ${
                isActive
                  ? 'text-sage-700 dark:text-sage-300 font-medium'
                  : 'text-stone-400 dark:text-stone-400 hover:text-stone-600'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.6]'
                  }`}
                />
                {tab.id === 'notes' && hasJournalLock && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-earth-500" />
                )}
              </div>

              <span className="text-[10px] tracking-tight mt-0.5 font-sans">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
