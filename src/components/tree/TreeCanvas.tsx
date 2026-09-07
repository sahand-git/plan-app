import React, { useState } from 'react';
import type { TreeState, DailyNote, TreeLifecycleStage } from '../../db';
import { UndergroundRootView } from './UndergroundRootView';
import { YearlyRingScrubber } from './YearlyRingScrubber';
import { ProceduralTreeRenderer } from './ProceduralTreeRenderer';
import { SPECIES_CATALOG } from './speciesData';
import { translations, type AppLanguage } from '../../utils/i18n';
import { Anchor, Disc, Eye, Flower2 } from 'lucide-react';

export type TreeViewPerspective = 'canopy' | 'roots' | 'rings';

interface TreeCanvasProps {
  lifecycleStage?: TreeLifecycleStage;
  isDimmed?: boolean;
  state?: TreeState;
  onTapTree?: () => void;
  size?: 'sm' | 'md' | 'lg';
  journalCount?: number;
  recentNotes?: DailyNote[];
  totalWeeksAccumulated?: number;
  speciesId?: string;
  tasksTotal?: number;
  tasksCompleted?: number;
  onOpenGarden?: () => void;
  lang?: AppLanguage;
}

export const TreeCanvas: React.FC<TreeCanvasProps> = ({
  lifecycleStage = 'mature',
  isDimmed = false,
  state,
  onTapTree,
  size = 'md',
  journalCount = 4,
  recentNotes = [],
  totalWeeksAccumulated = 12,
  speciesId = 'noble_pine',
  tasksTotal,
  tasksCompleted,
  onOpenGarden,
  lang = 'en',
}) => {
  const [perspective, setPerspective] = useState<TreeViewPerspective>('canopy');
  const t = translations[lang] || translations.en;

  const sizeClasses = {
    sm: 'w-48 h-48',
    md: 'w-64 h-64 sm:w-72 sm:h-72',
    lg: 'w-80 h-80 sm:w-96 sm:h-96',
  }[size];

  const species = SPECIES_CATALOG[speciesId] || SPECIES_CATALOG.noble_pine;
  const effectiveDimmed = isDimmed || state === 'gentle_wilt';
  const effectiveStage: TreeLifecycleStage =
    lifecycleStage || (state === 'seedling' ? 'seed' : state === 'sapling' ? 'sapling' : 'mature');

  const localizedSpeciesName = lang === 'ckb' ? species.kurdishName : species.name;

  let title = localizedSpeciesName;
  let subtitle = 'Full, vibrant presence';

  if (effectiveDimmed) {
    title = t.tree.dimmedNeglectTitle;
    subtitle = t.tree.dimmedNeglectSubtitle;
  } else if (effectiveStage === 'seed') {
    title = t.tree.seed;
    subtitle = 'Tender sprout • Nurtured by daily habits';
  } else if (effectiveStage === 'sapling') {
    title = t.tree.sapling;
    subtitle = 'Young sapling • Reaching with steady habit rhythm';
  } else {
    subtitle = 'Majestic mature botanical tree';
  }

  // If user selected Underground View
  if (perspective === 'roots') {
    return (
      <UndergroundRootView
        journalCount={journalCount}
        recentNotes={recentNotes}
        onClose={() => setPerspective('canopy')}
      />
    );
  }

  // If user selected Yearly Rings View
  if (perspective === 'rings') {
    return (
      <YearlyRingScrubber
        currentWeek={36}
        totalWeeksAccumulated={totalWeeksAccumulated}
        onClose={() => setPerspective('canopy')}
      />
    );
  }

  // Default: Surface Canopy View
  return (
    <div className="flex flex-col items-center justify-center relative select-none animate-soft-fade-up">
      {/* Botanical Container with Gentle Breeze & Roots beneath */}
      <div
        onClick={onTapTree}
        role="button"
        tabIndex={0}
        aria-label={`Botanical Tree: ${title}. Tap for weekly reflection.`}
        className={`relative ${sizeClasses} cursor-pointer group flex items-center justify-center transition-transform duration-700 ease-out active:scale-95`}
      >
        {/* Soft Organic Aura */}
        <div className="absolute inset-4 rounded-full bg-sage-50/60 dark:bg-night-card/40 blur-2xl pointer-events-none transition-all duration-1000" />

        {/* Procedural Botanical Tree Rendering (Canopy + Permanent Roots System + 14 Species + Tasks Blossoms & Fruits) */}
        <div className="w-full h-full animate-tree-breeze">
          <ProceduralTreeRenderer
            speciesId={speciesId}
            stage={effectiveStage}
            isDimmed={effectiveDimmed}
            journalCount={journalCount}
            tasksTotal={tasksTotal}
            tasksCompleted={tasksCompleted}
          />
        </div>

        {/* Tap Whisper Hint */}
        <div className="absolute bottom-2 inset-x-0 text-center opacity-0 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none">
          <span className="text-[11px] font-serif italic text-stone-500 dark:text-stone-400 bg-parchment-deep/80 dark:bg-night-surface/80 px-2.5 py-0.5 rounded-full backdrop-blur-sm border border-stone-200/50 dark:border-night-border">
            {t.tree.tapToReflect}
          </span>
        </div>
      </div>

      {/* Glanceable Botanical State Subtitle & Blossom Indicators */}
      <div className="mt-1 text-center space-y-0.5">
        <p className="text-sm font-serif font-medium text-stone-800 dark:text-stone-200 tracking-wide">
          {title}
        </p>
        <p className="text-xs text-stone-400 dark:text-stone-400 font-light">
          {subtitle}
        </p>
        {tasksCompleted !== undefined && tasksCompleted > 0 && (
          <div className="pt-1 flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-rose-50/80 dark:bg-night-card border border-rose-200/60 dark:border-night-border text-rose-800 dark:text-rose-300 font-medium animate-soft-fade-up">
              🌸 {Math.ceil(tasksCompleted / 2)} Blossoms & 🍎 {Math.floor(tasksCompleted / 2)} Fruits
            </span>
          </div>
        )}
      </div>

      {/* 4-Part Root, Ring, and Garden Perspective Switcher */}
      <div className="mt-3 flex items-center gap-1.5 p-1 bg-stone-100/90 dark:bg-night-surface/90 rounded-2xl border border-stone-200/70 dark:border-night-border shadow-xs flex-wrap justify-center">
        <button
          onClick={() => setPerspective('canopy')}
          className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs transition-all font-medium ${
            perspective === 'canopy'
              ? 'bg-white dark:bg-night-card text-stone-800 dark:text-stone-100 shadow-xs'
              : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-sage-600" />
          <span>{t.tree.canopy}</span>
        </button>

        <button
          onClick={() => setPerspective('roots')}
          className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 transition-all font-medium"
          title="Inspect permanent root system grown through journal writing"
        >
          <Anchor className="w-3.5 h-3.5 text-earth-600" />
          <span>{t.tree.roots} ({journalCount})</span>
        </button>

        <button
          onClick={() => setPerspective('rings')}
          className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 transition-all font-medium"
          title="Scrub yearly weekly trunk rings"
        >
          <Disc className="w-3.5 h-3.5 text-sage-600" />
          <span>{t.tree.rings} ({totalWeeksAccumulated}w)</span>
        </button>

        {onOpenGarden && (
          <button
            onClick={onOpenGarden}
            className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 transition-all font-medium"
            title="View Garden grove timeline"
          >
            <Flower2 className="w-3.5 h-3.5 text-amber-600" />
            <span>{t.tree.garden}</span>
          </button>
        )}
      </div>
    </div>
  );
};
