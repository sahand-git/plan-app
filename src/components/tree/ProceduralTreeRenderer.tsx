import React from 'react';
import type { TreeLifecycleStage } from '../../db';
import { SPECIES_CATALOG, type SpeciesDefinition } from './speciesData';

interface ProceduralTreeRendererProps {
  speciesId?: string;
  stage?: TreeLifecycleStage;
  isDimmed?: boolean;
  journalCount?: number;
  className?: string;
}

export const ProceduralTreeRenderer: React.FC<ProceduralTreeRendererProps> = ({
  speciesId = 'noble_pine',
  stage = 'mature',
  isDimmed = false,
  journalCount = 4,
  className = 'w-full h-full',
}) => {
  const species: SpeciesDefinition = SPECIES_CATALOG[speciesId] || SPECIES_CATALOG.noble_pine;
  const p = species.palette;

  // Root depth tier 1-4 based on permanent journal reflections
  const rootTier = Math.max(1, Math.min(4, Math.ceil(journalCount / 4)));

  // Neglect Dimmed Palettes: soft muted desaturation without harsh yellow or dead styling
  const foliageFill1 = isDimmed ? '#777265' : p.foliagePrimary;
  const foliageFill2 = isDimmed ? '#5E5B51' : p.foliageSecondary;
  const accentFill = isDimmed ? '#A69F91' : p.accent;
  const trunkFill = isDimmed ? '#524A42' : p.trunk;

  // =========================================================================
  // STAGE 1: SEEDLING / SEED SPROUT
  // =========================================================================
  if (stage === 'seed') {
    return (
      <svg viewBox="0 0 240 260" className={`${className} overflow-visible`} fill="none">
        {/* Ground Soil Mound */}
        <ellipse cx="120" cy="195" rx="58" ry="10" fill="#6A594D" opacity={isDimmed ? 0.6 : 0.85} />
        <ellipse cx="120" cy="194" rx="42" ry="6" fill="#8C7362" opacity="0.4" />

        {/* Starting Taproot (Permanent) */}
        <path d="M120 195 Q119 215 117 232" stroke="#5B4A3E" strokeWidth="3" strokeLinecap="round" />
        <path d="M118 202 Q105 212 96 220" stroke="#6C5849" strokeWidth="2" strokeLinecap="round" />
        <path d="M122 203 Q135 214 144 222" stroke="#6C5849" strokeWidth="2" strokeLinecap="round" />

        {/* Delicate Emerging Sprout Stem */}
        <path
          d={isDimmed ? 'M120 195 Q122 172 126 155' : 'M120 195 Q120 168 120 150'}
          stroke={foliageFill2}
          strokeWidth="3.5"
          strokeLinecap="round"
          className="transition-all duration-700"
        />

        {/* Tender Emerging Sprout Leaves */}
        <g className={`transition-all duration-700 ${isDimmed ? 'opacity-75 rotate-3' : 'animate-leaf-rustle'}`}>
          <ellipse
            cx="108"
            cy="148"
            rx="14"
            ry="9"
            transform={isDimmed ? 'rotate(-18 108 148)' : 'rotate(-32 108 148)'}
            fill={foliageFill1}
          />
          <ellipse
            cx="132"
            cy="148"
            rx="14"
            ry="9"
            transform={isDimmed ? 'rotate(18 132 148)' : 'rotate(32 132 148)'}
            fill={foliageFill2}
          />
          {/* Central seed bead */}
          <circle cx="120" cy="155" r="3.5" fill={accentFill} />
        </g>
      </svg>
    );
  }

  // =========================================================================
  // STAGE 2: YOUNG SAPLING
  // =========================================================================
  if (stage === 'sapling') {
    return (
      <svg viewBox="0 0 240 260" className={`${className} overflow-visible`} fill="none">
        {/* Ground Soil Mound */}
        <ellipse cx="120" cy="195" rx="64" ry="11" fill="#6A594D" opacity={isDimmed ? 0.6 : 0.85} />
        <ellipse cx="120" cy="194" rx="48" ry="7" fill="#8C7362" opacity="0.4" />

        {/* Permanent Roots */}
        <path d="M120 195 Q119 220 116 244" stroke="#5B4A3E" strokeWidth="3.8" strokeLinecap="round" />
        <path d="M116 199 Q96 211 82 224" stroke="#6C5849" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M124 199 Q144 212 158 226" stroke="#6C5849" strokeWidth="2.4" strokeLinecap="round" />

        {/* Young Sapling Trunk & Branches */}
        <path
          d={isDimmed ? 'M120 195 Q121 160 126 125' : 'M120 195 Q119 160 120 120'}
          stroke={trunkFill}
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path d="M120 152 Q102 140 92 130" stroke={trunkFill} strokeWidth="3.2" strokeLinecap="round" />
        <path d="M121 140 Q138 128 148 118" stroke={trunkFill} strokeWidth="3.2" strokeLinecap="round" />

        {/* Sapling Leaf Clusters */}
        <g className={`transition-all duration-700 ${isDimmed ? 'opacity-70' : 'animate-leaf-rustle'}`}>
          {/* Left Branch Leaves */}
          <ellipse cx="86" cy="126" rx="16" ry="10" transform={isDimmed ? 'rotate(-10 86 126)' : 'rotate(-25 86 126)'} fill={foliageFill1} />
          <ellipse cx="98" cy="120" rx="14" ry="9" transform="rotate(-15 98 120)" fill={foliageFill2} />

          {/* Right Branch Leaves */}
          <ellipse cx="154" cy="114" rx="16" ry="10" transform={isDimmed ? 'rotate(10 154 114)' : 'rotate(25 154 114)'} fill={foliageFill1} />
          <ellipse cx="142" cy="108" rx="14" ry="9" transform="rotate(15 142 108)" fill={foliageFill2} />

          {/* Crown Leaves */}
          <ellipse cx="114" cy="112" rx="18" ry="11" transform={isDimmed ? 'rotate(-8 114 112)' : 'rotate(-18 114 112)'} fill={foliageFill1} />
          <ellipse cx="128" cy="110" rx="18" ry="11" transform={isDimmed ? 'rotate(8 128 110)' : 'rotate(18 128 110)'} fill={foliageFill2} />
          <circle cx="121" cy="100" r="4" fill={accentFill} />
        </g>
      </svg>
    );
  }

  // =========================================================================
  // STAGE 3: MATURE TREE (SPECIES-SPECIFIC BOTANICAL VISUALS)
  // =========================================================================
  return (
    <svg viewBox="0 0 240 260" className={`${className} overflow-visible`} fill="none">
      {/* Ground Soil Mound */}
      <ellipse cx="120" cy="195" rx="72" ry="12" fill="#5B4A3E" opacity={isDimmed ? 0.6 : 0.85} />
      <ellipse cx="120" cy="194" rx="56" ry="7" fill="#8C7362" opacity="0.4" />

      {/* Permanent Roots */}
      <g className="transition-all duration-700">
        <path
          d={
            rootTier === 1
              ? 'M120 195 Q118 215 116 232'
              : rootTier === 2
              ? 'M120 195 Q119 220 115 246'
              : 'M120 195 Q121 225 118 258'
          }
          stroke="#4A3B31"
          strokeWidth={rootTier >= 3 ? '5' : '3.8'}
          strokeLinecap="round"
        />
        <path d="M116 199 Q96 211 78 222" stroke="#5C4B3F" strokeWidth="3" strokeLinecap="round" />
        <path d="M124 199 Q144 212 162 224" stroke="#5C4B3F" strokeWidth="3" strokeLinecap="round" />
        {rootTier >= 2 && (
          <>
            <path d="M117 218 Q95 230 80 246" stroke="#7A6555" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M122 222 Q145 234 158 250" stroke="#7A6555" strokeWidth="2.2" strokeLinecap="round" />
          </>
        )}
      </g>

      {/* Species-Specific Trunk */}
      {species.id === 'stone_bonsai' ? (
        // Curved sculpted Bonsai trunk
        <path
          d="M120 195 Q106 170 112 150 Q124 130 118 112"
          stroke={trunkFill}
          strokeWidth="11"
          strokeLinecap="round"
        />
      ) : species.id === 'coastal_cypress' ? (
        // Slender tapered spire trunk
        <path
          d="M120 195 L120 90"
          stroke={trunkFill}
          strokeWidth="8"
          strokeLinecap="round"
        />
      ) : (
        // Classic sturdy botanical trunk with gentle taper
        <path
          d="M120 195 L120 120"
          stroke={trunkFill}
          strokeWidth="10"
          strokeLinecap="round"
        />
      )}

      {/* Canopy Renderings By Species Category */}
      <g
        className={`transition-all duration-700 ${
          isDimmed ? 'opacity-70 saturate-50' : 'animate-leaf-rustle'
        }`}
      >
        {species.id === 'cherry_blossom' ? (
          // Sakura Pink Cloud with Drifting Blossom Petals
          <>
            <ellipse cx="120" cy="115" rx="58" ry="42" fill={foliageFill1} />
            <ellipse cx="92" cy="125" rx="36" ry="28" fill={foliageFill2} />
            <ellipse cx="148" cy="125" rx="36" ry="28" fill={foliageFill2} />
            <ellipse cx="120" cy="92" rx="42" ry="32" fill={foliageFill1} />
            {/* Blossom Petal Accents */}
            <circle cx="102" cy="100" r="5.5" fill={accentFill} />
            <circle cx="138" cy="102" r="6" fill={accentFill} />
            <circle cx="120" cy="80" r="5" fill={accentFill} />
            <circle cx="80" cy="130" r="4.5" fill={accentFill} />
            <circle cx="160" cy="126" r="4.5" fill={accentFill} />
            {!isDimmed && (
              <>
                <ellipse cx="172" cy="154" rx="4" ry="2.5" transform="rotate(35 172 154)" fill={accentFill} opacity="0.85" />
                <ellipse cx="68" cy="160" rx="3.5" ry="2" transform="rotate(-25 68 160)" fill={accentFill} opacity="0.85" />
              </>
            )}
          </>
        ) : species.id === 'ancient_ginkgo' ? (
          // Golden Amber Fan-Shaped Ginkgo Foliage
          <>
            <ellipse cx="120" cy="110" rx="56" ry="46" fill={foliageFill2} />
            <path d="M85 105 Q120 70 155 105 Q120 135 85 105 Z" fill={foliageFill1} />
            <ellipse cx="90" cy="122" rx="30" ry="24" fill={foliageFill1} />
            <ellipse cx="150" cy="122" rx="30" ry="24" fill={foliageFill1} />
            {/* Fan leaf highlights */}
            <circle cx="120" cy="84" r="7" fill={accentFill} opacity="0.9" />
            <circle cx="95" cy="110" r="6" fill={accentFill} opacity="0.9" />
            <circle cx="145" cy="110" r="6" fill={accentFill} opacity="0.9" />
          </>
        ) : species.id === 'weeping_willow' ? (
          // Cascading Emerald Willow Tendrils
          <>
            <ellipse cx="120" cy="102" rx="46" ry="34" fill={foliageFill2} />
            {/* Hanging tendril boughs */}
            <path d="M78 100 Q68 140 74 180" stroke={foliageFill1} strokeWidth="4.5" strokeLinecap="round" />
            <path d="M96 95 Q88 145 92 185" stroke={foliageFill1} strokeWidth="5" strokeLinecap="round" />
            <path d="M120 90 Q118 148 120 188" stroke={foliageFill1} strokeWidth="5.5" strokeLinecap="round" />
            <path d="M144 95 Q152 145 148 185" stroke={foliageFill1} strokeWidth="5" strokeLinecap="round" />
            <path d="M162 100 Q172 140 166 180" stroke={foliageFill1} strokeWidth="4.5" strokeLinecap="round" />
            {/* Dew drop nodes */}
            <circle cx="74" cy="180" r="3.5" fill={accentFill} />
            <circle cx="92" cy="185" r="3.5" fill={accentFill} />
            <circle cx="120" cy="188" r="3.8" fill={accentFill} />
            <circle cx="148" cy="185" r="3.5" fill={accentFill} />
            <circle cx="166" cy="180" r="3.5" fill={accentFill} />
          </>
        ) : species.id === 'jasmine_magnolia' ? (
          // Cream Ivory Blossoms amidst Broad Wax Leaves
          <>
            <ellipse cx="120" cy="114" rx="55" ry="42" fill={foliageFill1} />
            <ellipse cx="94" cy="124" rx="34" ry="26" fill={foliageFill2} />
            <ellipse cx="146" cy="124" rx="34" ry="26" fill={foliageFill2} />
            {/* Magnolia Ivory Blossoms */}
            <ellipse cx="120" cy="88" rx="10" ry="13" fill={accentFill} stroke="#DDD5C7" strokeWidth="1.2" />
            <ellipse cx="88" cy="114" rx="9" ry="12" transform="rotate(-20 88 114)" fill={accentFill} stroke="#DDD5C7" strokeWidth="1.2" />
            <ellipse cx="152" cy="114" rx="9" ry="12" transform="rotate(20 152 114)" fill={accentFill} stroke="#DDD5C7" strokeWidth="1.2" />
          </>
        ) : species.id === 'silver_wisteria' ? (
          // Cascading Lavender Wisteria Racemes
          <>
            <ellipse cx="120" cy="98" rx="52" ry="34" fill={foliageFill1} />
            {/* Raceme cluster pods */}
            <path d="M90 105 Q88 135 90 162" stroke={accentFill} strokeWidth="8" strokeLinecap="round" />
            <path d="M120 100 Q120 138 120 172" stroke={accentFill} strokeWidth="9" strokeLinecap="round" />
            <path d="M150 105 Q152 135 150 162" stroke={accentFill} strokeWidth="8" strokeLinecap="round" />
          </>
        ) : species.id === 'stone_bonsai' ? (
          // Sculpted Bonsai Jade Cloud Pads
          <>
            <ellipse cx="78" cy="125" rx="34" ry="18" fill={foliageFill1} />
            <ellipse cx="80" cy="122" rx="26" ry="14" fill={foliageFill2} />
            <ellipse cx="152" cy="98" rx="38" ry="20" fill={foliageFill1} />
            <ellipse cx="154" cy="95" rx="30" ry="16" fill={foliageFill2} />
            <ellipse cx="118" cy="74" rx="30" ry="16" fill={foliageFill1} />
            <circle cx="118" cy="70" r="5" fill={accentFill} />
          </>
        ) : species.id === 'coastal_cypress' ? (
          // Slender Spiraling Spire
          <>
            <path d="M120 60 Q142 110 136 175 Q120 185 104 175 Q98 110 120 60 Z" fill={foliageFill1} />
            <path d="M120 75 Q134 115 128 165 Q120 172 112 165 Q106 115 120 75 Z" fill={foliageFill2} />
            <circle cx="120" cy="62" r="4.5" fill={accentFill} />
          </>
        ) : (
          // Balanced Botanical Foliage & Flower / Seed Node system (Default / Pine / Fig / Azalea / Maple)
          <>
            <ellipse cx="120" cy="116" rx="55" ry="42" fill={foliageFill2} />
            <ellipse cx="94" cy="126" rx="34" ry="26" fill={foliageFill1} />
            <ellipse cx="146" cy="126" rx="34" ry="26" fill={foliageFill1} />
            <ellipse cx="120" cy="88" rx="42" ry="32" fill={foliageFill1} />
            <circle cx="102" cy="100" r="5" fill={accentFill} />
            <circle cx="138" cy="102" r="5" fill={accentFill} />
            <circle cx="120" cy="76" r="5.5" fill={accentFill} />
          </>
        )}
      </g>
    </svg>
  );
};
