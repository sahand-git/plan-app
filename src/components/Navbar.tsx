import React from 'react';
import { Plus, Sprout, Flower2 } from 'lucide-react';
import { translations, type AppLanguage } from '../utils/i18n';

export type AppView = 'tasks' | 'garden' | 'calendar' | 'notes' | 'habits' | 'data';

interface NavbarProps {
  currentView: AppView;
  onOpenNewTask: () => void;
  lang?: AppLanguage;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onOpenNewTask,
  lang = 'en',
}) => {
  const t = translations[lang] || translations.en;

  const viewInfo: Record<AppView, { title: string; subtitle: string; icon: React.ComponentType<{ className?: string }> }> = {
    tasks: { title: t.appName, subtitle: t.headers.todaysMirror, icon: Sprout },
    garden: { title: t.garden.title, subtitle: t.garden.subtitle, icon: Flower2 },
    calendar: { title: t.calendar.title, subtitle: t.calendar.subtitle, icon: Sprout },
    notes: { title: t.headers.dailyJournal, subtitle: t.tabs.journal, icon: Sprout },
    habits: { title: t.tasks.habitsPractice, subtitle: t.tree.maturity, icon: Sprout },
    data: { title: t.headers.vaultPrivacy, subtitle: t.paidBadge, icon: Sprout },
  };

  const current = viewInfo[currentView] || viewInfo.tasks;
  const Icon = current.icon;

  return (
    <header className="sticky top-0 z-30 w-full bg-parchment/90 dark:bg-night-surface/90 backdrop-blur-md border-b border-stone-200/60 dark:border-night-border transition-colors">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between gap-2">
        {/* Brand / View Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sage-100 dark:bg-night-card flex items-center justify-center text-sage-600 dark:text-sage-400">
            <Icon className="w-4 h-4" />
          </div>

          <div>
            <h1 className="font-serif text-base font-medium text-stone-800 dark:text-stone-100 leading-tight">
              {current.title}
            </h1>
            <span className="text-[10px] text-stone-400 dark:text-stone-400 font-light block leading-none">
              {current.subtitle}
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenNewTask}
            className="flex items-center gap-1 px-3 py-1.5 bg-sage-600 hover:bg-sage-700 active:scale-95 text-white text-xs font-medium rounded-xl shadow-xs transition-all"
            title="Add gentle task or habit"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{lang === 'ckb' ? 'زیادکردن' : 'Add'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
