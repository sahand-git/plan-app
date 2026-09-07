import React, { useState } from 'react';
import type { TreeState, DailyNote } from '../../db';
import { UndergroundRootView } from './UndergroundRootView';
import { YearlyRingScrubber } from './YearlyRingScrubber';
import { Anchor, Disc, Eye } from 'lucide-react';

export type TreeViewPerspective = 'canopy' | 'roots' | 'rings';

interface TreeCanvasProps {
  state: TreeState;
  onTapTree?: () => void;
  showInspector?: boolean;
  onSelectState?: (state: TreeState) => void;
  size?: 'sm' | 'md' | 'lg';
  journalCount?: number;
  recentNotes?: DailyNote[];
  totalWeeksAccumulated?: number;
}

export const TreeCanvas: React.FC<TreeCanvasProps> = ({
  state,
  onTapTree,
  showInspector = false,
  onSelectState,
  size = 'md',
  journalCount = 4,
  recentNotes = [],
  totalWeeksAccumulated = 12,
}) => {
  const [perspective, setPerspective] = useState<TreeViewPerspective>('canopy');

  const sizeClasses = {
    sm: 'w-48 h-48',
    md: 'w-64 h-64 sm:w-72 sm:h-72',
    lg: 'w-80 h-80 sm:w-96 sm:h-96',
  }[size];

  const stateLabels: Record<TreeState, { title: string; subtitle: string }> = {
    seedling: { title: 'Quiet Sprout', subtitle: 'Rooted and beginning' },
    sapling: { title: 'Young Sapling', subtitle: 'Reaching with steady ease' },
    foliage: { title: 'Balanced Canopy', subtitle: 'Harmonious weekly rhythm' },
    flourishing: { title: 'Flourishing Tree', subtitle: 'Full, vibrant presence' },
    gentle_wilt: { title: 'Seasonal Rest', subtitle: 'Soft pause, recovers tomorrow' },
  };

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
        aria-label={`Botanical Tree: ${stateLabels[state].title}. Tap for weekly reflection.`}
        className={`relative ${sizeClasses} cursor-pointer group flex items-center justify-center transition-transform duration-700 ease-out active:scale-95`}
      >
        {/* Soft Organic Aura */}
        <div className="absolute inset-4 rounded-full bg-sage-50/60 dark:bg-night-card/40 blur-2xl pointer-events-none transition-all duration-1000" />

        {/* Procedural Botanical Tree Rendering (Canopy + Permanent Roots System) */}
        <div className="w-full h-full animate-tree-breeze">
          <LivingRootAndCanopyTree state={state} journalCount={journalCount} />
        </div>

        {/* Tap Whisper Hint */}
        <div className="absolute bottom-2 inset-x-0 text-center opacity-0 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none">
          <span className="text-[11px] font-serif italic text-stone-500 dark:text-stone-400 bg-parchment-deep/80 dark:bg-night-surface/80 px-2.5 py-0.5 rounded-full backdrop-blur-sm border border-stone-200/50 dark:border-night-border">
            tap to reflect
          </span>
        </div>
      </div>

      {/* Glanceable Botanical State Subtitle */}
      <div className="mt-1 text-center">
        <p className="text-sm font-serif font-medium text-stone-700 dark:text-stone-200 tracking-wide">
          {stateLabels[state].title}
        </p>
        <p className="text-xs text-stone-400 dark:text-stone-400 mt-0.5 font-light">
          {stateLabels[state].subtitle}
        </p>
      </div>

      {/* 3-Part Root & Ring Perspective Switcher */}
      <div className="mt-3 flex items-center gap-1.5 p-1 bg-stone-100/90 dark:bg-night-surface/90 rounded-2xl border border-stone-200/70 dark:border-night-border shadow-xs">
        <button
          onClick={() => setPerspective('canopy')}
          className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs transition-all font-medium ${
            perspective === 'canopy'
              ? 'bg-white dark:bg-night-card text-stone-800 dark:text-stone-100 shadow-xs'
              : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-sage-600" />
          <span>Canopy</span>
        </button>

        <button
          onClick={() => setPerspective('roots')}
          className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 transition-all font-medium"
          title="Inspect permanent root system grown through journal writing"
        >
          <Anchor className="w-3.5 h-3.5 text-earth-600" />
          <span>Roots ({journalCount})</span>
        </button>

        <button
          onClick={() => setPerspective('rings')}
          className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 transition-all font-medium"
          title="Scrub yearly weekly trunk rings"
        >
          <Disc className="w-3.5 h-3.5 text-sage-600" />
          <span>Rings ({totalWeeksAccumulated}w)</span>
        </button>
      </div>

      {/* State Inspector for manual QA */}
      {showInspector && onSelectState && (
        <div className="mt-3 flex flex-wrap justify-center gap-1 p-1 bg-stone-100/80 dark:bg-night-surface/80 rounded-2xl border border-stone-200/60 dark:border-night-border">
          {(['flourishing', 'foliage', 'sapling', 'seedling', 'gentle_wilt'] as TreeState[]).map((s) => (
            <button
              key={s}
              onClick={() => onSelectState(s)}
              className={`text-xs px-2.5 py-1 rounded-xl transition-all font-medium ${
                state === s
                  ? 'bg-sage-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-night-card'
              }`}
            >
              {s === 'gentle_wilt' ? 'Wilt (Rest)' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   Living Root & Canopy Botanical SVG Component
   - Roots beneath soil line grow permanently from journalCount
   - Canopy above soil line responds to daily task/habit completion
   ========================================================================= */
const LivingRootAndCanopyTree: React.FC<{ state: TreeState; journalCount: number }> = ({
  state,
  journalCount,
}) => {
  const isWilted = state === 'gentle_wilt';
  const isFlourishing = state === 'flourishing';
  const isSapling = state === 'sapling';
  const isSeedling = state === 'seedling';

  // Root depth tier (1 to 4) based on journal entries
  const rootDepth = Math.max(1, Math.min(4, Math.ceil(journalCount / 4)));

  return (
    <svg viewBox="0 0 240 260" className="w-full h-full overflow-visible" fill="none">
      <defs>
        <linearGradient id="trunkGradNew" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#4A3B31" />
          <stop offset="50%" stopColor="#6C5849" />
          <stop offset="100%" stopColor="#7A6555" />
        </linearGradient>

        {/* Healthy Sage Gradients */}
        <linearGradient id="healthyLeafA" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A5C3A8" />
          <stop offset="100%" stopColor="#5A735E" />
        </linearGradient>
        <linearGradient id="healthyLeafB" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7E9D83" />
          <stop offset="100%" stopColor="#3B4F3E" />
        </linearGradient>

        {/* Seasonal Rest / Wilt Warm Golden Ochre Gradients */}
        <linearGradient id="wiltLeafA" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#DECFA8" />
          <stop offset="100%" stopColor="#9B7F49" />
        </linearGradient>
        <linearGradient id="wiltLeafB" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#CDAF77" />
          <stop offset="100%" stopColor="#7D6433" />
        </linearGradient>
      </defs>

      {/* =========================================================================
          PERMANENT UNDERGROUND ROOT FOUNDATION (Derived from Journal Notes)
          Roots never shrink or reset.
          ========================================================================= */}
      <g className="transition-all duration-700">
        {/* Ground Soil Mound */}
        <ellipse cx="120" cy="195" rx="66" ry="12" fill="#7A6555" opacity="0.85" />
        <ellipse cx="120" cy="194" rx="52" ry="7" fill="#A87C64" opacity="0.4" />

        {/* Subterranean Taproot (Permanent) */}
        <path
          d={
            rootDepth === 1
              ? 'M120 195 Q118 215 116 230'
              : rootDepth === 2
              ? 'M120 195 Q119 220 115 245'
              : 'M120 195 Q121 225 118 258'
          }
          stroke="#5B4A3E"
          strokeWidth={rootDepth >= 3 ? '5' : '3.5'}
          strokeLinecap="round"
        />

        {/* Lateral Permanent Roots */}
        <path d="M116 198 Q96 210 78 220" stroke="#6C5849" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M124 198 Q144 211 162 222" stroke="#6C5849" strokeWidth="2.8" strokeLinecap="round" />

        {/* Deep Root Extensions if journalCount > 4 */}
        {rootDepth >= 2 && (
          <>
            <path d="M117 215 Q95 228 80 244" stroke="#8A7363" strokeWidth="2" strokeLinecap="round" />
            <path d="M122 220 Q145 232 158 248" stroke="#8A7363" strokeWidth="2" strokeLinecap="round" />
          </>
        )}
        {rootDepth >= 3 && (
          <>
            <path d="M118 240 Q105 252 95 258" stroke="#8A7363" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M120 245 Q132 254 142 258" stroke="#8A7363" strokeWidth="1.8" strokeLinecap="round" />
          </>
        )}
      </g>

      {/* =========================================================================
          TREE TRUNK & CONCENTRIC RING BARK TEXTURES
          ========================================================================= */}
      {isSeedling ? (
        /* Tender Sprout Stem */
        <path d="M120 195 C120 178 118 160 120 148" stroke="url(#trunkGradNew)" strokeWidth="4" strokeLinecap="round" />
      ) : (
        /* Full Trunk */
        <g>
          <path
            d="M120 195 C118 165 122 135 118 115"
            stroke="url(#trunkGradNew)"
            strokeWidth={isFlourishing ? '9' : '7'}
            strokeLinecap="round"
          />
          {/* Subtle Horizontal Trunk Growth Rings (Bark striations) */}
          <line x1="116" y1="175" x2="123" y2="175" stroke="#4A3B31" strokeWidth="1.2" opacity="0.6" />
          <line x1="117" y1="155" x2="122" y2="155" stroke="#4A3B31" strokeWidth="1.2" opacity="0.6" />
          <line x1="117" y1="135" x2="121" y2="135" stroke="#4A3B31" strokeWidth="1.2" opacity="0.6" />
        </g>
      )}

      {/* =========================================================================
          CANOPY SYSTEM (Responds to daily tasks & habits, updates once daily)
          Missed day = Gentle Wilt (soft 14° leaf droop in warm golden ochre).
          ========================================================================= */}
      {isSeedling && (
        /* Seedling Canopy */
        <g>
          <g transform="translate(120, 150) rotate(-32)">
            <path d="M0 0 C-15 -6 -25 -25 0 -36 C25 -25 15 -6 0 0Z" fill="url(#healthyLeafA)" />
          </g>
          <g transform="translate(120, 146) rotate(35)">
            <path d="M0 0 C-12 -5 -22 -22 0 -32 C22 -22 12 -5 0 0Z" fill="url(#healthyLeafB)" />
          </g>
        </g>
      )}

      {isSapling && (
        /* Sapling Canopy */
        <g>
          <path d="M119 155 C108 145 96 140 86 138" stroke="url(#trunkGradNew)" strokeWidth="3" strokeLinecap="round" />
          <path d="M120 140 C132 132 144 130 156 125" stroke="url(#trunkGradNew)" strokeWidth="3" strokeLinecap="round" />
          <path d="M118 115 C116 100 114 90 110 80" stroke="url(#trunkGradNew)" strokeWidth="2.5" strokeLinecap="round" />

          <g transform="translate(86, 138) rotate(-45)">
            <path d="M0 0 C-10 -4 -16 -18 0 -24 C16 -18 10 -4 0 0Z" fill="url(#healthyLeafA)" />
          </g>
          <g transform="translate(156, 125) rotate(48)">
            <path d="M0 0 C-11 -4 -18 -20 0 -26 C18 -20 11 -4 0 0Z" fill="url(#healthyLeafA)" />
          </g>
          <g transform="translate(110, 80) rotate(-20)">
            <path d="M0 0 C-12 -5 -20 -22 0 -28 C20 -22 12 -5 0 0Z" fill="url(#healthyLeafB)" />
          </g>
        </g>
      )}

      {(state === 'foliage' || isFlourishing) && (
        /* Balanced or Flourishing Canopy */
        <g>
          {/* Main Branches */}
          <path d="M118 145 C102 134 86 128 70 120" stroke="url(#trunkGradNew)" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M119 138 C135 128 152 124 168 116" stroke="url(#trunkGradNew)" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M118 115 C116 95 118 80 120 65" stroke="url(#trunkGradNew)" strokeWidth="3.5" strokeLinecap="round" />

          {/* Flourishing Extra Foliage Cluster Backdrop */}
          {isFlourishing && (
            <path
              d="M55 105 C45 85 70 68 90 76 C105 58 135 58 150 74 C170 65 195 82 185 105 C200 125 180 145 160 140 C140 150 100 150 80 140 C60 145 42 125 55 105Z"
              fill="url(#healthyLeafB)"
              opacity="0.85"
            />
          )}

          {/* Left Leaves */}
          <g transform="translate(70, 120) rotate(-45)">
            <path d="M0 0 C-13 -6 -22 -22 0 -30 C22 -22 13 -6 0 0Z" fill="url(#healthyLeafA)" />
          </g>
          <g transform="translate(86, 110) rotate(-25)">
            <path d="M0 0 C-12 -5 -20 -20 0 -26 C20 -20 12 -5 0 0Z" fill="url(#healthyLeafB)" />
          </g>

          {/* Center Leaves */}
          <g transform="translate(120, 65) rotate(0)">
            <path d="M0 0 C-16 -7 -26 -26 0 -36 C26 -26 16 -7 0 0Z" fill="url(#healthyLeafA)" />
          </g>
          <g transform="translate(108, 85) rotate(-20)">
            <path d="M0 0 C-12 -5 -20 -20 0 -28 C20 -20 12 -5 0 0Z" fill="url(#healthyLeafB)" />
          </g>
          <g transform="translate(132, 85) rotate(22)">
            <path d="M0 0 C-12 -5 -20 -20 0 -28 C20 -20 12 -5 0 0Z" fill="url(#healthyLeafB)" />
          </g>

          {/* Right Leaves */}
          <g transform="translate(168, 116) rotate(42)">
            <path d="M0 0 C-13 -6 -22 -22 0 -30 C22 -22 13 -6 0 0Z" fill="url(#healthyLeafA)" />
          </g>
          <g transform="translate(150, 106) rotate(20)">
            <path d="M0 0 C-12 -5 -20 -20 0 -26 C20 -20 12 -5 0 0Z" fill="url(#healthyLeafB)" />
          </g>

          {/* Flourishing Jasmine Blossom Florets */}
          {isFlourishing && (
            <>
              <circle cx="95" cy="85" r="2.8" fill="#FAF6F2" />
              <circle cx="145" cy="82" r="2.8" fill="#FAF6F2" />
              <circle cx="120" cy="56" r="3" fill="#FAF6F2" />
              <circle cx="75" cy="112" r="2.5" fill="#FAF6F2" />
              <circle cx="162" cy="110" r="2.5" fill="#FAF6F2" />
            </>
          )}
        </g>
      )}

      {isWilted && (
        /* Seasonal Rest / Gentle Wilt: Canopy leaves droop gently ~14°, warm golden ochre/amber */
        <g>
          {/* Branches gently relaxing */}
          <path d="M118 148 C104 140 90 138 74 136" stroke="url(#trunkGradNew)" strokeWidth="4" strokeLinecap="round" />
          <path d="M119 140 C135 135 150 134 164 132" stroke="url(#trunkGradNew)" strokeWidth="4" strokeLinecap="round" />
          <path d="M118 118 C117 104 115 94 113 84" stroke="url(#trunkGradNew)" strokeWidth="3" strokeLinecap="round" />

          {/* Drooping Foliage (Downward soft 14°-22° droop) */}
          <g transform="translate(74, 136) rotate(16)">
            <path d="M0 0 C-10 6 -18 20 0 28 C18 20 10 6 0 0Z" fill="url(#wiltLeafA)" />
          </g>
          <g transform="translate(86, 142) rotate(22)">
            <path d="M0 0 C-9 5 -16 18 0 24 C16 18 9 5 0 0Z" fill="url(#wiltLeafB)" />
          </g>
          <g transform="translate(113, 84) rotate(18)">
            <path d="M0 0 C-12 7 -22 24 0 32 C22 24 12 7 0 0Z" fill="url(#wiltLeafA)" />
          </g>
          <g transform="translate(164, 132) rotate(-16)">
            <path d="M0 0 C-10 6 -18 20 0 28 C18 20 10 6 0 0Z" fill="url(#wiltLeafA)" />
          </g>
          <g transform="translate(150, 138) rotate(-22)">
            <path d="M0 0 C-9 5 -16 18 0 24 C16 18 9 5 0 0Z" fill="url(#wiltLeafB)" />
          </g>

          {/* Resting fallen leaf on earth */}
          <ellipse cx="145" cy="198" rx="6" ry="2.5" fill="#CDAF77" opacity="0.8" transform="rotate(35 145 198)" />
        </g>
      )}
    </svg>
  );
};
