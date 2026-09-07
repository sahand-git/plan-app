import React from 'react';
import type { TreeState } from '../../db';

interface TreeCanvasProps {
  state: TreeState;
  onTapTree?: () => void;
  showInspector?: boolean;
  onSelectState?: (state: TreeState) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const TreeCanvas: React.FC<TreeCanvasProps> = ({
  state,
  onTapTree,
  showInspector = false,
  onSelectState,
  size = 'md',
}) => {
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

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      {/* Botanical Container with Gentle Breeze & Breathe */}
      <div
        onClick={onTapTree}
        role="button"
        tabIndex={0}
        aria-label={`Botanical Tree: ${stateLabels[state].title}. Tap for weekly reflection.`}
        className={`relative ${sizeClasses} cursor-pointer group flex items-center justify-center transition-transform duration-700 ease-out active:scale-95`}
      >
        {/* Soft Organic Aura */}
        <div className="absolute inset-4 rounded-full bg-sage-50/60 dark:bg-night-card/40 blur-2xl pointer-events-none transition-all duration-1000" />

        {/* Procedural Botanical Tree Rendering */}
        <div className="w-full h-full animate-tree-breeze">
          {state === 'seedling' && <SeedlingTree />}
          {state === 'sapling' && <SaplingTree />}
          {state === 'foliage' && <FoliageTree />}
          {state === 'flourishing' && <FlourishingTree />}
          {state === 'gentle_wilt' && <GentleWiltTree />}
        </div>

        {/* Tap Whisper Hint (Appears subtly on hover or focus) */}
        <div className="absolute bottom-2 inset-x-0 text-center opacity-0 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none">
          <span className="text-[11px] font-serif italic text-stone-500 dark:text-stone-400 bg-parchment-deep/80 dark:bg-night-surface/80 px-2.5 py-0.5 rounded-full backdrop-blur-sm border border-stone-200/50 dark:border-night-border">
            tap to reflect
          </span>
        </div>
      </div>

      {/* Glanceable Botanical State Subtitle (Minimal, no numbers) */}
      <div className="mt-1 text-center">
        <p className="text-sm font-serif font-medium text-stone-700 dark:text-stone-200 tracking-wide">
          {stateLabels[state].title}
        </p>
        <p className="text-xs text-stone-400 dark:text-stone-400 mt-0.5 font-light">
          {stateLabels[state].subtitle}
        </p>
      </div>

      {/* State Inspector / Showcase Switcher for Reviews & Demos */}
      {showInspector && onSelectState && (
        <div className="mt-4 flex flex-wrap justify-center gap-1.5 p-1.5 bg-stone-100/80 dark:bg-night-surface/80 rounded-2xl border border-stone-200/60 dark:border-night-border backdrop-blur-sm">
          {(['seedling', 'sapling', 'foliage', 'flourishing', 'gentle_wilt'] as TreeState[]).map((s) => (
            <button
              key={s}
              onClick={() => onSelectState(s)}
              className={`text-xs px-2.5 py-1 rounded-xl transition-all font-medium ${
                state === s
                  ? 'bg-sage-600 text-white shadow-sm'
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
   State 1: Rooted Seedling / Quiet Sprout
   Minimal, grounded, early beginning
   ========================================================================= */
const SeedlingTree: React.FC = () => (
  <svg viewBox="0 0 240 240" className="w-full h-full overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="soilGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8A7363" />
        <stop offset="100%" stopColor="#6C5849" />
      </linearGradient>
      <linearGradient id="stemGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7E9D83" />
        <stop offset="100%" stopColor="#5A735E" />
      </linearGradient>
      <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#A5C3A8" />
        <stop offset="100%" stopColor="#5A735E" />
      </linearGradient>
    </defs>

    {/* Earth Soil Mound */}
    <ellipse cx="120" cy="205" rx="46" ry="10" fill="url(#soilGrad)" opacity="0.85" />
    <ellipse cx="120" cy="204" rx="38" ry="6" fill="#A87C64" opacity="0.4" />

    {/* Quiet Root Tendril */}
    <path d="M120 205 Q118 215 114 220" stroke="#6C5849" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    <path d="M120 205 Q123 214 126 218" stroke="#6C5849" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

    {/* Tender Stem */}
    <path
      d="M120 205 C120 185 118 165 120 148"
      stroke="url(#stemGrad)"
      strokeWidth="4"
      strokeLinecap="round"
    />

    {/* Left Emerging Leaf */}
    <g transform="translate(120, 154) rotate(-32)">
      <path
        d="M0 0 C-15 -6 -25 -25 0 -36 C25 -25 15 -6 0 0Z"
        fill="url(#leafGrad)"
        className="animate-leaf-rustle"
      />
      <path d="M0 0 L0 -30" stroke="#485D4B" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
    </g>

    {/* Right Emerging Leaf */}
    <g transform="translate(120, 150) rotate(35)">
      <path
        d="M0 0 C-12 -5 -22 -22 0 -32 C22 -22 12 -5 0 0Z"
        fill="url(#leafGrad)"
        className="animate-leaf-rustle"
      />
      <path d="M0 0 L0 -26" stroke="#485D4B" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
    </g>

    {/* Small Morning Dew Drop */}
    <circle cx="110" cy="126" r="2.2" fill="#E4EDE5" opacity="0.9" />
  </svg>
);

/* =========================================================================
   State 2: Young Branching Sapling
   Reaching outward, slender trunk, 5 leaves
   ========================================================================= */
const SaplingTree: React.FC = () => (
  <svg viewBox="0 0 240 240" className="w-full h-full overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="trunkGrad2" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#6C5849" />
        <stop offset="100%" stopColor="#8A7363" />
      </linearGradient>
      <linearGradient id="leafGrad2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#A5C3A8" />
        <stop offset="100%" stopColor="#5A735E" />
      </linearGradient>
    </defs>

    {/* Ground Soil */}
    <ellipse cx="120" cy="210" rx="55" ry="10" fill="#8A7363" opacity="0.8" />
    <ellipse cx="120" cy="209" rx="44" ry="6" fill="#A87C64" opacity="0.4" />

    {/* Root anchor */}
    <path d="M116 210 Q106 218 96 220" stroke="#6C5849" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
    <path d="M124 210 Q134 217 142 219" stroke="#6C5849" strokeWidth="2" strokeLinecap="round" opacity="0.5" />

    {/* Slender Graceful Trunk */}
    <path
      d="M120 210 C119 180 122 150 120 115"
      stroke="url(#trunkGrad2)"
      strokeWidth="5"
      strokeLinecap="round"
    />

    {/* Lower Left Branch */}
    <path d="M120 165 C110 155 98 150 86 148" stroke="url(#trunkGrad2)" strokeWidth="3" strokeLinecap="round" />
    {/* Leaves on Lower Left */}
    <g transform="translate(86, 148) rotate(-45)">
      <path d="M0 0 C-10 -4 -16 -18 0 -24 C16 -18 10 -4 0 0Z" fill="url(#leafGrad2)" />
    </g>
    <g transform="translate(98, 154) rotate(-20)">
      <path d="M0 0 C-8 -3 -14 -14 0 -20 C14 -14 8 -3 0 0Z" fill="#7E9D83" />
    </g>

    {/* Mid Right Branch */}
    <path d="M120 145 C132 138 144 135 156 130" stroke="url(#trunkGrad2)" strokeWidth="3" strokeLinecap="round" />
    {/* Leaves on Mid Right */}
    <g transform="translate(156, 130) rotate(50)">
      <path d="M0 0 C-11 -4 -18 -20 0 -26 C18 -20 11 -4 0 0Z" fill="url(#leafGrad2)" />
    </g>
    <g transform="translate(142, 137) rotate(28)">
      <path d="M0 0 C-8 -3 -14 -15 0 -20 C14 -15 8 -3 0 0Z" fill="#7E9D83" />
    </g>

    {/* Apical Top Branch & Leaves */}
    <path d="M120 115 C118 100 114 90 110 80" stroke="url(#trunkGrad2)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M120 115 C124 100 128 92 132 84" stroke="url(#trunkGrad2)" strokeWidth="2" strokeLinecap="round" />
    <g transform="translate(110, 80) rotate(-25)">
      <path d="M0 0 C-12 -5 -20 -22 0 -28 C20 -22 12 -5 0 0Z" fill="url(#leafGrad2)" />
    </g>
    <g transform="translate(132, 84) rotate(32)">
      <path d="M0 0 C-10 -4 -18 -20 0 -25 C18 -20 10 -4 0 0Z" fill="url(#leafGrad2)" />
    </g>
  </svg>
);

/* =========================================================================
   State 3: Balanced Foliage
   Balanced canopy, 10-12 leaves, soft harmonious wind sway
   ========================================================================= */
const FoliageTree: React.FC = () => (
  <svg viewBox="0 0 240 240" className="w-full h-full overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="foliageTrunk" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#5B4A3E" />
        <stop offset="100%" stopColor="#7A6555" />
      </linearGradient>
      <linearGradient id="foliageLeafA" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#9AB89D" />
        <stop offset="100%" stopColor="#485D4B" />
      </linearGradient>
      <linearGradient id="foliageLeafB" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#B3CCB5" />
        <stop offset="100%" stopColor="#5A735E" />
      </linearGradient>
    </defs>

    {/* Ground Soil */}
    <ellipse cx="120" cy="214" rx="64" ry="12" fill="#7A6555" opacity="0.8" />
    <ellipse cx="120" cy="213" rx="50" ry="7" fill="#BD9E8C" opacity="0.35" />

    {/* Strong Roots */}
    <path d="M114 214 Q98 220 86 224" stroke="#5B4A3E" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
    <path d="M126 214 Q142 221 154 223" stroke="#5B4A3E" strokeWidth="2.8" strokeLinecap="round" opacity="0.7" />

    {/* Trunk with Organic Forking */}
    <path
      d="M120 214 C118 180 121 150 116 128"
      stroke="url(#foliageTrunk)"
      strokeWidth="7"
      strokeLinecap="round"
    />
    {/* Left Main Arm */}
    <path d="M118 152 C104 140 88 134 72 126" stroke="url(#foliageTrunk)" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M88 134 C82 120 76 112 68 104" stroke="url(#foliageTrunk)" strokeWidth="3" strokeLinecap="round" />

    {/* Right Main Arm */}
    <path d="M117 142 C134 132 152 128 168 120" stroke="url(#foliageTrunk)" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M148 128 C158 114 166 106 174 98" stroke="url(#foliageTrunk)" strokeWidth="3" strokeLinecap="round" />

    {/* Center Top Spire */}
    <path d="M116 128 C115 106 118 90 120 74" stroke="url(#foliageTrunk)" strokeWidth="3.5" strokeLinecap="round" />

    {/* Leaf Canopy Elements */}
    {/* Left Cluster */}
    <g transform="translate(68, 104) rotate(-55)">
      <path d="M0 0 C-14 -6 -24 -24 0 -32 C24 -24 14 -6 0 0Z" fill="url(#foliageLeafA)" />
    </g>
    <g transform="translate(72, 126) rotate(-35)">
      <path d="M0 0 C-12 -5 -20 -20 0 -28 C20 -20 12 -5 0 0Z" fill="url(#foliageLeafB)" />
    </g>
    <g transform="translate(86, 114) rotate(-15)">
      <path d="M0 0 C-11 -4 -18 -18 0 -24 C18 -18 11 -4 0 0Z" fill="url(#foliageLeafA)" />
    </g>

    {/* Center Spire Canopy */}
    <g transform="translate(120, 74) rotate(0)">
      <path d="M0 0 C-16 -7 -28 -28 0 -38 C28 -28 16 -7 0 0Z" fill="url(#foliageLeafB)" />
    </g>
    <g transform="translate(108, 92) rotate(-22)">
      <path d="M0 0 C-12 -5 -20 -22 0 -30 C20 -22 12 -5 0 0Z" fill="url(#foliageLeafA)" />
    </g>
    <g transform="translate(132, 90) rotate(25)">
      <path d="M0 0 C-12 -5 -20 -22 0 -30 C20 -22 12 -5 0 0Z" fill="url(#foliageLeafB)" />
    </g>

    {/* Right Cluster */}
    <g transform="translate(174, 98) rotate(48)">
      <path d="M0 0 C-14 -6 -24 -24 0 -32 C24 -24 14 -6 0 0Z" fill="url(#foliageLeafA)" />
    </g>
    <g transform="translate(168, 120) rotate(32)">
      <path d="M0 0 C-12 -5 -20 -20 0 -28 C20 -20 12 -5 0 0Z" fill="url(#foliageLeafB)" />
    </g>
    <g transform="translate(150, 110) rotate(15)">
      <path d="M0 0 C-11 -4 -18 -18 0 -24 C18 -18 11 -4 0 0Z" fill="url(#foliageLeafA)" />
    </g>
  </svg>
);

/* =========================================================================
   State 4: Flourishing Canopy
   Lush, deep sage layers, grounded spreading roots, subtle floral accents
   ========================================================================= */
const FlourishingTree: React.FC = () => (
  <svg viewBox="0 0 240 240" className="w-full h-full overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="flourishTrunk" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#4A3B31" />
        <stop offset="100%" stopColor="#6C5849" />
      </linearGradient>
      <radialGradient id="canopyBackdrop" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#3B4F3E" stopOpacity="0.4" />
        <stop offset="80%" stopColor="#5A735E" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#5A735E" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="deepCanopy" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#5A735E" />
        <stop offset="100%" stopColor="#2C3B2F" />
      </linearGradient>
      <linearGradient id="brightCanopy" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#A5C3A8" />
        <stop offset="100%" stopColor="#485D4B" />
      </linearGradient>
    </defs>

    {/* Generous Earth Mound */}
    <ellipse cx="120" cy="216" rx="72" ry="14" fill="#6C5849" opacity="0.85" />
    <ellipse cx="120" cy="215" rx="56" ry="8" fill="#BD9E8C" opacity="0.4" />

    {/* Grounded Ancient Roots */}
    <path d="M112 214 Q90 220 74 226" stroke="#4A3B31" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
    <path d="M128 214 Q150 221 166 225" stroke="#4A3B31" strokeWidth="3.8" strokeLinecap="round" opacity="0.8" />
    <path d="M120 216 Q122 225 124 230" stroke="#4A3B31" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />

    {/* Soft Canopy Halo */}
    <circle cx="120" cy="110" r="70" fill="url(#canopyBackdrop)" />

    {/* Solid, Warm Trunk */}
    <path
      d="M120 215 C117 175 122 145 118 120"
      stroke="url(#flourishTrunk)"
      strokeWidth="9"
      strokeLinecap="round"
    />
    <path d="M118 145 C98 132 80 124 60 114" stroke="url(#flourishTrunk)" strokeWidth="5.5" strokeLinecap="round" />
    <path d="M120 138 C140 126 160 120 180 110" stroke="url(#flourishTrunk)" strokeWidth="5.5" strokeLinecap="round" />
    <path d="M118 120 C117 98 119 82 120 62" stroke="url(#flourishTrunk)" strokeWidth="4.5" strokeLinecap="round" />

    {/* Lush Layered Foliage Clouds & Leaves */}
    {/* Deep Layer Back */}
    <path
      d="M55 110 C45 88 70 70 90 80 C105 60 135 60 150 78 C170 68 195 85 185 110 C200 130 180 150 160 145 C140 155 100 155 80 145 C60 150 40 130 55 110Z"
      fill="url(#deepCanopy)"
      opacity="0.9"
    />

    {/* Mid Leaf Highlights */}
    <g transform="translate(62, 105) rotate(-35)">
      <path d="M0 0 C-14 -6 -24 -24 0 -32 C24 -24 14 -6 0 0Z" fill="url(#brightCanopy)" />
    </g>
    <g transform="translate(178, 105) rotate(35)">
      <path d="M0 0 C-14 -6 -24 -24 0 -32 C24 -24 14 -6 0 0Z" fill="url(#brightCanopy)" />
    </g>
    <g transform="translate(120, 56) rotate(0)">
      <path d="M0 0 C-18 -8 -30 -30 0 -40 C30 -30 18 -8 0 0Z" fill="url(#brightCanopy)" />
    </g>
    <g transform="translate(95, 75) rotate(-22)">
      <path d="M0 0 C-14 -6 -24 -24 0 -32 C24 -24 14 -6 0 0Z" fill="url(#brightCanopy)" />
    </g>
    <g transform="translate(145, 75) rotate(22)">
      <path d="M0 0 C-14 -6 -24 -24 0 -32 C24 -24 14 -6 0 0Z" fill="url(#brightCanopy)" />
    </g>

    {/* Tiny Botanical Blossom Florets (Peaceful, warm jasmine dots) */}
    <circle cx="85" cy="98" r="2.8" fill="#F4ECE4" />
    <circle cx="155" cy="95" r="2.8" fill="#F4ECE4" />
    <circle cx="118" cy="78" r="3" fill="#F4ECE4" />
    <circle cx="102" cy="120" r="2.5" fill="#F4ECE4" />
    <circle cx="138" cy="116" r="2.5" fill="#F4ECE4" />
  </svg>
);

/* =========================================================================
   State 5: Gentle Wilt / Seasonal Rest
   Soft resting posture, gentle ~14° droop, warm golden-ochre/olive tones
   Never dead grey or alarm red. Recovers completely on next active day.
   ========================================================================= */
const GentleWiltTree: React.FC = () => (
  <svg viewBox="0 0 240 240" className="w-full h-full overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="wiltTrunk" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#5B4A3E" />
        <stop offset="100%" stopColor="#7A6555" />
      </linearGradient>
      <linearGradient id="wiltLeafA" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#DECFA8" />
        <stop offset="100%" stopColor="#9B7F49" />
      </linearGradient>
      <linearGradient id="wiltLeafB" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#CDAF77" />
        <stop offset="100%" stopColor="#7D6433" />
      </linearGradient>
    </defs>

    {/* Soil Mound */}
    <ellipse cx="120" cy="214" rx="60" ry="11" fill="#7A6555" opacity="0.8" />
    <ellipse cx="120" cy="213" rx="46" ry="6" fill="#DECFA8" opacity="0.25" />

    {/* Root anchor (Still firm, representing underlying resilience) */}
    <path d="M115 214 Q100 220 90 223" stroke="#5B4A3E" strokeWidth="2.8" strokeLinecap="round" opacity="0.6" />
    <path d="M125 214 Q140 221 150 223" stroke="#5B4A3E" strokeWidth="2.8" strokeLinecap="round" opacity="0.6" />

    {/* Trunk: Rooted and stable */}
    <path
      d="M120 214 C119 182 121 152 118 130"
      stroke="url(#wiltTrunk)"
      strokeWidth="6.5"
      strokeLinecap="round"
    />

    {/* Branches gently relaxing downward */}
    {/* Left Arm drooping gently */}
    <path d="M118 152 C104 145 90 144 76 142" stroke="url(#wiltTrunk)" strokeWidth="4" strokeLinecap="round" />
    <path d="M88 144 C80 140 76 138 68 136" stroke="url(#wiltTrunk)" strokeWidth="2.8" strokeLinecap="round" />

    {/* Right Arm drooping gently */}
    <path d="M118 144 C134 140 148 140 162 140" stroke="url(#wiltTrunk)" strokeWidth="4" strokeLinecap="round" />
    <path d="M146 140 C154 138 160 136 170 134" stroke="url(#wiltTrunk)" strokeWidth="2.8" strokeLinecap="round" />

    {/* Center Top Spire relaxing */}
    <path d="M118 130 C117 114 116 102 114 90" stroke="url(#wiltTrunk)" strokeWidth="3" strokeLinecap="round" />

    {/* Leaves with Gentle ~14-20° Downward Droop */}
    {/* Left Drooping Leaves */}
    <g transform="translate(68, 136) rotate(15)">
      <path d="M0 0 C-10 6 -18 20 0 28 C18 20 10 6 0 0Z" fill="url(#wiltLeafA)" />
    </g>
    <g transform="translate(76, 142) rotate(22)">
      <path d="M0 0 C-9 5 -16 18 0 24 C16 18 9 5 0 0Z" fill="url(#wiltLeafB)" />
    </g>

    {/* Center Drooping Foliage */}
    <g transform="translate(114, 90) rotate(18)">
      <path d="M0 0 C-12 7 -22 24 0 32 C22 24 12 7 0 0Z" fill="url(#wiltLeafA)" />
    </g>
    <g transform="translate(104, 110) rotate(25)">
      <path d="M0 0 C-10 6 -18 20 0 26 C18 20 10 6 0 0Z" fill="url(#wiltLeafB)" />
    </g>

    {/* Right Drooping Leaves */}
    <g transform="translate(170, 134) rotate(-15)">
      <path d="M0 0 C-10 6 -18 20 0 28 C18 20 10 6 0 0Z" fill="url(#wiltLeafA)" />
    </g>
    <g transform="translate(162, 140) rotate(-20)">
      <path d="M0 0 C-9 5 -16 18 0 24 C16 18 9 5 0 0Z" fill="url(#wiltLeafB)" />
    </g>

    {/* Soft Fallen Leaf Resting On Earth (Peaceful nature cycle) */}
    <g transform="translate(148, 218) rotate(45)">
      <ellipse cx="0" cy="0" rx="6" ry="2.5" fill="#CDAF77" opacity="0.8" />
    </g>
  </svg>
);
