import React, { useState } from 'react';
import { ProceduralTreeRenderer } from '../tree/ProceduralTreeRenderer';
import { SPECIES_CATALOG } from '../tree/speciesData';
import { translations, type AppLanguage } from '../../utils/i18n';
import { Plus, Smartphone, Apple, CheckCircle2 } from 'lucide-react';
import type { TreeState, TreeLifecycleStage } from '../../db';

interface HomeScreenWidgetPreviewProps {
  treeState: TreeState;
  speciesId?: string;
  lifecycleStage?: TreeLifecycleStage;
  journalCount?: number;
  onQuickAddTask: () => void;
  lang?: AppLanguage;
}

export const HomeScreenWidgetPreview: React.FC<HomeScreenWidgetPreviewProps> = ({
  treeState,
  speciesId = 'noble_pine',
  lifecycleStage = 'mature',
  journalCount = 4,
  onQuickAddTask,
  lang = 'en',
}) => {
  const t = translations[lang] || translations.en;
  const [widgetFormat, setWidgetFormat] = useState<'ios_medium' | 'android_card'>('ios_medium');

  const species = SPECIES_CATALOG[speciesId] || SPECIES_CATALOG.noble_pine;
  const speciesTitle = lang === 'ckb' ? species.kurdishName : species.name;

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-white/80 dark:bg-night-card/80 border border-stone-200/70 dark:border-night-border space-y-4 shadow-xs select-none">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-medium tracking-wider text-sage-600 dark:text-sage-400">
            System Extension
          </span>
          <h4 className="font-serif text-base font-medium text-stone-800 dark:text-stone-100">
            Home Screen Widget Preview
          </h4>
        </div>

        {/* Format Switcher */}
        <div className="flex items-center p-0.5 bg-stone-100 dark:bg-night-surface rounded-xl border border-stone-200/60 dark:border-night-border text-xs">
          <button
            onClick={() => setWidgetFormat('ios_medium')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              widgetFormat === 'ios_medium'
                ? 'bg-white dark:bg-night-card text-stone-800 dark:text-stone-100 shadow-xs font-medium'
                : 'text-stone-500'
            }`}
          >
            <Apple className="w-3 h-3" />
            <span>iOS</span>
          </button>
          <button
            onClick={() => setWidgetFormat('android_card')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              widgetFormat === 'android_card'
                ? 'bg-white dark:bg-night-card text-stone-800 dark:text-stone-100 shadow-xs font-medium'
                : 'text-stone-500'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span>Android M3</span>
          </button>
        </div>
      </div>

      {/* Simulated Live Widget Canvas */}
      <div className="flex items-center justify-center p-4 bg-stone-100/70 dark:bg-stone-900/60 rounded-2xl border border-dashed border-stone-300/80 dark:border-night-border">
        {widgetFormat === 'ios_medium' ? (
          // iOS Medium Widget (approx 2:1 rounded rect)
          <div className="w-72 h-36 rounded-3xl bg-parchment-subtle dark:bg-night-surface p-3.5 shadow-calm border border-stone-200/80 dark:border-night-border flex items-center justify-between relative overflow-hidden">
            <div className="space-y-1 z-10 max-w-[130px]">
              <div className="flex items-center gap-1 text-[10px] text-sage-700 dark:text-sage-400 font-medium uppercase tracking-wider">
                <CheckCircle2 className="w-3 h-3" />
                <span>The Tree</span>
              </div>
              <h5 className="font-serif text-sm font-medium text-stone-800 dark:text-stone-100 leading-tight">
                {speciesTitle}
              </h5>
              <p className="text-[10px] text-stone-400 font-light">
                {treeState === 'gentle_wilt' ? t.tree.dimmedNeglectTitle : 'In serene rhythm'}
              </p>

              {/* One-tap Add Task Button */}
              <button
                onClick={onQuickAddTask}
                className="mt-1.5 flex items-center gap-1 px-2.5 py-1 bg-sage-600 hover:bg-sage-700 text-white rounded-xl text-[10px] font-medium shadow-xs transition-transform active:scale-95"
              >
                <Plus className="w-3 h-3" />
                <span>Add Task</span>
              </button>
            </div>

            {/* Live Tree Preview */}
            <div className="w-28 h-28 relative flex items-center justify-center">
              <ProceduralTreeRenderer
                speciesId={speciesId}
                stage={lifecycleStage}
                isDimmed={treeState === 'gentle_wilt'}
                journalCount={journalCount}
              />
            </div>
          </div>
        ) : (
          // Android Material 3 Dynamic Tonal Widget
          <div className="w-72 h-36 rounded-3xl bg-sage-100/70 dark:bg-night-card p-3.5 shadow-m3 border border-sage-200/60 dark:border-night-border flex items-center justify-between relative">
            <div className="space-y-1.5">
              <span className="text-[10px] font-serif text-sage-800 dark:text-sage-300 font-medium">
                Today’s Gentle Plant
              </span>
              <h5 className="font-serif text-sm font-medium text-stone-800 dark:text-stone-100 leading-tight">
                {speciesTitle}
              </h5>
              <p className="text-[10px] text-stone-500 font-light">
                {journalCount} {t.tree.roots.toLowerCase()} rooted
              </p>

              <button
                onClick={onQuickAddTask}
                className="flex items-center gap-1 px-3 py-1 bg-white dark:bg-night-surface text-stone-800 dark:text-stone-100 rounded-full text-[10px] font-medium shadow-xs hover:bg-stone-50"
              >
                <Plus className="w-3 h-3 text-sage-600" />
                <span>+ Task</span>
              </button>
            </div>

            <div className="w-28 h-28 relative flex items-center justify-center">
              <ProceduralTreeRenderer
                speciesId={speciesId}
                stage={lifecycleStage}
                isDimmed={treeState === 'gentle_wilt'}
                journalCount={journalCount}
              />
            </div>
          </div>
        )}
      </div>

      <p className="text-[11px] text-stone-400 dark:text-stone-400 font-light text-center">
        Shows today's live tree state with a one-tap quick-add trigger right from your home screen.
      </p>
    </div>
  );
};
