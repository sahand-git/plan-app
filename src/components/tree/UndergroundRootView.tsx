import { BookOpen, Anchor } from 'lucide-react';
import type { DailyNote } from '../../db';

interface UndergroundRootViewProps {
  journalCount: number;
  recentNotes: DailyNote[];
  onSelectNote?: (date: string) => void;
  onClose: () => void;
}

export const UndergroundRootView: React.FC<UndergroundRootViewProps> = ({
  journalCount,
  recentNotes,
  onSelectNote,
  onClose,
}) => {
  // Root depth tier based on journal entries written
  // Tier 1: 0-2 entries (Tender Taproot)
  // Tier 2: 3-7 entries (Branching Tendrils)
  // Tier 3: 8-19 entries (Anchored Subterranean System)
  // Tier 4: 20+ entries (Ancient Deep Root Network)
  const depthLevel = journalCount === 0 ? 1 : Math.min(4, Math.ceil(journalCount / 6) + 1);

  const tierNames = [
    '',
    'Nascent Taproot (Shallow Strata)',
    'Branching Lateral Roots (Subsoil Layer)',
    'Anchored Root System (Deep Mineral Layer)',
    'Ancient Foundation (Bedrock Network)',
  ];

  return (
    <div className="w-full flex flex-col items-center animate-soft-fade-up">
      {/* Subterranean Header Banner */}
      <div className="w-full max-w-sm flex items-center justify-between mb-3 px-2 text-xs">
        <div className="flex items-center gap-1.5 text-earth-700 dark:text-stone-300">
          <Anchor className="w-3.5 h-3.5 text-earth-600 dark:text-stone-400" />
          <span className="font-serif font-medium">Underground Strata</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-stone-400">
          <BookOpen className="w-3 h-3 text-earth-500" />
          <span>{journalCount} reflections rooted</span>
        </div>
      </div>

      {/* Subterranean Soil Cross-Section SVG */}
      <div className="relative w-72 h-80 sm:w-80 sm:h-88 rounded-3xl overflow-hidden border border-earth-200/70 dark:border-night-border shadow-calm bg-gradient-to-b from-[#EFE8DF] via-[#DECDBE] to-[#C8B39F] dark:from-[#1E2520] dark:via-[#1B211C] dark:to-[#141815]">
        {/* Soil Horizon Strata Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="h-1/4 border-b border-earth-400/30 dark:border-stone-700/40" />
          <div className="h-1/4 border-b border-earth-500/30 dark:border-stone-700/40" />
          <div className="h-1/4 border-b border-earth-600/30 dark:border-stone-700/40" />
        </div>

        {/* Soil Strata Labels */}
        <div className="absolute left-2.5 inset-y-0 flex flex-col justify-around text-[9px] font-mono text-earth-700/60 dark:text-stone-500 pointer-events-none">
          <span>O: Topsoil</span>
          <span>A: Humus</span>
          <span>B: Deep Clay</span>
          <span>C: Bedrock</span>
        </div>

        {/* SVG Root Network */}
        <svg viewBox="0 0 280 320" className="w-full h-full overflow-visible" fill="none">
          <defs>
            <linearGradient id="rootMainGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6C5849" />
              <stop offset="50%" stopColor="#8A7363" />
              <stop offset="100%" stopColor="#A87C64" />
            </linearGradient>
            <linearGradient id="rootFiberGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#A87C64" />
              <stop offset="100%" stopColor="#C4AFA0" />
            </linearGradient>
          </defs>

          {/* Tree Base Stump at top */}
          <path d="M110 0 L170 0 L155 35 L125 35 Z" fill="#5B4A3E" opacity="0.9" />

          {/* Central Taproot (Always Present, Extends With Journal Entries) */}
          <path
            d={
              depthLevel === 1
                ? 'M140 35 Q142 80 138 130'
                : depthLevel === 2
                ? 'M140 35 Q143 100 137 190'
                : depthLevel === 3
                ? 'M140 35 Q144 130 136 250'
                : 'M140 35 Q145 150 140 295'
            }
            stroke="url(#rootMainGrad)"
            strokeWidth={depthLevel >= 3 ? '7' : '5'}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />

          {/* Lateral Roots Tier 1+ */}
          <path
            d="M138 60 Q105 85 75 110"
            stroke="url(#rootFiberGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M142 70 Q175 90 205 115"
            stroke="url(#rootFiberGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Lateral Roots Tier 2+ */}
          {depthLevel >= 2 && (
            <>
              <path d="M137 110 Q95 135 65 170" stroke="url(#rootFiberGrad)" strokeWidth="3" strokeLinecap="round" />
              <path d="M139 125 Q180 150 215 180" stroke="url(#rootFiberGrad)" strokeWidth="3" strokeLinecap="round" />
              <path d="M75 110 Q60 130 45 145" stroke="url(#rootFiberGrad)" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              <path d="M205 115 Q225 135 240 155" stroke="url(#rootFiberGrad)" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            </>
          )}

          {/* Deep Roots Tier 3+ */}
          {depthLevel >= 3 && (
            <>
              <path d="M136 170 Q100 200 80 240" stroke="url(#rootFiberGrad)" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M138 185 Q175 210 200 245" stroke="url(#rootFiberGrad)" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M80 240 Q65 260 50 275" stroke="url(#rootFiberGrad)" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
              <path d="M200 245 Q220 265 235 280" stroke="url(#rootFiberGrad)" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
            </>
          )}

          {/* Ancient Deep Roots Tier 4 */}
          {depthLevel >= 4 && (
            <>
              <path d="M138 230 Q115 260 95 295" stroke="url(#rootFiberGrad)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M139 245 Q165 270 185 305" stroke="url(#rootFiberGrad)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M140 295 Q132 308 125 315" stroke="url(#rootFiberGrad)" strokeWidth="2" strokeLinecap="round" />
              <path d="M140 295 Q148 308 155 315" stroke="url(#rootFiberGrad)" strokeWidth="2" strokeLinecap="round" />
            </>
          )}

          {/* Memory Nodules (Representing Individual Journal Entries) */}
          {recentNotes.slice(0, 7).map((note, idx) => {
            const noduleCoords = [
              { cx: 75, cy: 110 },
              { cx: 205, cy: 115 },
              { cx: 65, cy: 170 },
              { cx: 215, cy: 180 },
              { cx: 80, cy: 240 },
              { cx: 200, cy: 245 },
              { cx: 140, cy: 280 },
            ][idx] || { cx: 140, cy: 100 + idx * 25 };

            return (
              <g
                key={note.id || idx}
                onClick={() => onSelectNote && onSelectNote(note.date)}
                className="cursor-pointer group/nodule"
              >
                <circle
                  cx={noduleCoords.cx}
                  cy={noduleCoords.cy}
                  r="6"
                  fill="#A87C64"
                  className="transition-transform group-hover/nodule:scale-125"
                />
                <circle cx={noduleCoords.cx} cy={noduleCoords.cy} r="3" fill="#FAF6F2" />
              </g>
            );
          })}
        </svg>

        {/* Floating Depth Measurement Indicator */}
        <div className="absolute bottom-2.5 right-3 bg-white/85 dark:bg-night-surface/90 px-2.5 py-1 rounded-xl border border-stone-200/70 dark:border-night-border text-[10px] text-stone-600 dark:text-stone-300 font-mono shadow-xs">
          Depth: {Math.max(12, journalCount * 4)} cm
        </div>
      </div>

      {/* Philosophy Subtitle */}
      <div className="mt-3 text-center max-w-xs space-y-1">
        <p className="text-xs font-serif font-medium text-stone-700 dark:text-stone-200">
          {tierNames[depthLevel]}
        </p>
        <p className="text-[11px] text-stone-400 dark:text-stone-400 leading-relaxed font-light">
          Roots grow permanently with every saved journal entry. They never shrink or reset, even on untended days.
        </p>
      </div>

      {/* Close/Return Button */}
      <button
        onClick={onClose}
        className="mt-3 text-xs text-sage-700 dark:text-sage-400 hover:text-sage-800 underline underline-offset-4"
      >
        Return to Surface Canopy
      </button>
    </div>
  );
};
