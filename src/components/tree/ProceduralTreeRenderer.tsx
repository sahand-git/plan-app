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

      {/* Species-Specific Trunk Geometry */}
      {species.id === 'golden_birch' ? (
        // Slender chalk-white/silver birch trunk with dark horizontal bark lenticels
        <g>
          <path d="M120 195 Q118 150 120 105" stroke="#E4E1DB" strokeWidth="8" strokeLinecap="round" />
          <line x1="116" y1="182" x2="124" y2="182" stroke="#2B2A27" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="117" y1="168" x2="122" y2="168" stroke="#2B2A27" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="116" y1="152" x2="123" y2="152" stroke="#2B2A27" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="118" y1="135" x2="123" y2="135" stroke="#2B2A27" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="117" y1="120" x2="122" y2="120" stroke="#2B2A27" strokeWidth="1.4" strokeLinecap="round" />
        </g>
      ) : species.id === 'wild_azalea' ? (
        // Multi-stemmed woodland shrub shoots emerging from base
        <g stroke={trunkFill} strokeLinecap="round">
          <path d="M120 195 Q106 165 92 135" strokeWidth="4.5" />
          <path d="M120 195 Q120 155 120 125" strokeWidth="5.5" />
          <path d="M120 195 Q134 165 148 135" strokeWidth="4.5" />
        </g>
      ) : species.id === 'stone_bonsai' ? (
        // Dramatic sculpted S-curve Bonsai trunk
        <path
          d="M120 195 Q102 168 112 144 Q128 120 114 96"
          stroke={trunkFill}
          strokeWidth="12"
          strokeLinecap="round"
        />
      ) : species.id === 'mountain_cedar' ? (
        // Massive angled trunk with heavy horizontal elbow boughs
        <g stroke={trunkFill} strokeLinecap="round">
          <path d="M120 195 L118 125" strokeWidth="13" />
          <path d="M118 152 L78 138" strokeWidth="6" />
          <path d="M118 138 L162 126" strokeWidth="6" />
        </g>
      ) : species.id === 'noble_pine' ? (
        // Rugged vertical mountain pine trunk
        <g stroke={trunkFill} strokeLinecap="round">
          <path d="M120 195 L120 105" strokeWidth="11" />
          <path d="M120 150 L95 138" strokeWidth="4" />
          <path d="M120 145 L145 135" strokeWidth="4" />
        </g>
      ) : species.id === 'sweet_fig' ? (
        // Stout, knobby Mediterranean fig trunk
        <path
          d="M120 195 Q114 165 110 138 Q130 126 142 118"
          stroke={trunkFill}
          strokeWidth="13"
          strokeLinecap="round"
        />
      ) : species.id === 'silver_wisteria' ? (
        // Spiraling, sinuous climbing vine trunk
        <path
          d="M120 195 Q108 162 122 136 Q115 112 120 90"
          stroke={trunkFill}
          strokeWidth="10"
          strokeLinecap="round"
        />
      ) : species.id === 'japanese_maple' ? (
        // Low, artfully twisting dark branches
        <g stroke={trunkFill} strokeLinecap="round">
          <path d="M120 195 Q125 162 114 136" strokeWidth="9" />
          <path d="M114 136 Q98 120 82 108" strokeWidth="5.5" />
          <path d="M114 136 Q138 120 158 108" strokeWidth="5.5" />
        </g>
      ) : species.id === 'coastal_cypress' ? (
        // Slender tapered spire trunk
        <path d="M120 195 L120 85" stroke={trunkFill} strokeWidth="7" strokeLinecap="round" />
      ) : species.id === 'jasmine_magnolia' ? (
        // Smooth dividing gray boughs
        <g stroke={trunkFill} strokeLinecap="round">
          <path d="M120 195 L120 148 Q106 130 96 112" strokeWidth="9" />
          <path d="M120 148 Q134 130 144 112" strokeWidth="7.5" />
        </g>
      ) : (
        // Classic sturdy botanical trunk with gentle taper
        <path d="M120 195 L120 118" stroke={trunkFill} strokeWidth="10" strokeLinecap="round" />
      )}

      {/* Canopy Renderings By Species Silhouette */}
      <g
        className={`transition-all duration-700 ${
          isDimmed ? 'opacity-70 saturate-50' : 'animate-leaf-rustle'
        }`}
      >
        {species.id === 'noble_pine' ? (
          // 1. NOBLE PINE: Tiered Evergreen Triangular Needle Shelves + Pinecones
          <>
            {/* Bottom Tier */}
            <polygon points="56,168 120,132 184,168 120,178" fill={foliageFill2} />
            <polygon points="62,164 120,132 178,164" fill={foliageFill1} />
            {/* Middle Tier */}
            <polygon points="68,135 120,100 172,135 120,144" fill={foliageFill2} />
            <polygon points="74,132 120,100 166,132" fill={foliageFill1} />
            {/* Top Crown Tier */}
            <polygon points="82,102 120,60 158,102 120,110" fill={foliageFill2} />
            <polygon points="86,100 120,60 154,100" fill={foliageFill1} />
            {/* Hanging Pinecone Accents */}
            <ellipse cx="78" cy="168" rx="3.5" ry="5.5" fill="#6E4723" />
            <ellipse cx="162" cy="168" rx="3.5" ry="5.5" fill="#6E4723" />
            <ellipse cx="120" cy="144" rx="3.5" ry="5.5" fill="#6E4723" />
            <circle cx="120" cy="62" r="3" fill={accentFill} />
          </>
        ) : species.id === 'mountain_cedar' ? (
          // 2. MOUNTAIN CEDAR: Flat-Topped Terraced Horizontal Boughs (Lebanese Cedar)
          <>
            {/* Low Left Terraced Bough */}
            <ellipse cx="76" cy="142" rx="42" ry="14" fill={foliageFill2} />
            <ellipse cx="78" cy="140" rx="36" ry="11" fill={foliageFill1} />
            {/* Low Right Terraced Bough */}
            <ellipse cx="164" cy="130" rx="44" ry="14" fill={foliageFill2} />
            <ellipse cx="162" cy="128" rx="38" ry="11" fill={foliageFill1} />
            {/* High Broad Flat-Topped Crown */}
            <ellipse cx="120" cy="94" rx="58" ry="17" fill={foliageFill2} />
            <ellipse cx="120" cy="91" rx="52" ry="13" fill={foliageFill1} />
            <circle cx="76" cy="136" r="3.5" fill={accentFill} />
            <circle cx="164" cy="124" r="3.5" fill={accentFill} />
            <circle cx="120" cy="88" r="4" fill={accentFill} />
          </>
        ) : species.id === 'stone_bonsai' ? (
          // 3. STONE BONSAI: Sculpted Asymmetrical Horizontal Jade Cloud Pads
          <>
            <ellipse cx="74" cy="126" rx="34" ry="16" fill={foliageFill1} />
            <ellipse cx="76" cy="123" rx="26" ry="12" fill={foliageFill2} />
            <ellipse cx="156" cy="98" rx="38" ry="18" fill={foliageFill1} />
            <ellipse cx="158" cy="95" rx="30" ry="14" fill={foliageFill2} />
            <ellipse cx="116" cy="72" rx="28" ry="14" fill={foliageFill1} />
            <circle cx="116" cy="68" r="4.5" fill={accentFill} />
            <circle cx="156" cy="92" r="3.5" fill={accentFill} />
          </>
        ) : species.id === 'coastal_cypress' ? (
          // 4. COASTAL CYPRESS: Tall Flame Columnar Spire
          <>
            <path d="M120 50 Q144 110 136 175 Q120 186 104 175 Q96 110 120 50 Z" fill={foliageFill1} />
            <path d="M120 68 Q136 115 128 165 Q120 173 112 165 Q104 115 120 68 Z" fill={foliageFill2} />
            <circle cx="120" cy="52" r="4" fill={accentFill} />
            <ellipse cx="120" cy="115" rx="8" ry="24" fill={accentFill} opacity="0.3" />
          </>
        ) : species.id === 'sweet_fig' ? (
          // 5. SWEET FIG: Broad Palmate Dome with Teardrop Fig Fruits
          <>
            <ellipse cx="120" cy="118" rx="60" ry="44" fill={foliageFill2} />
            <circle cx="86" cy="125" r="28" fill={foliageFill1} />
            <circle cx="154" cy="125" r="28" fill={foliageFill1} />
            <circle cx="120" cy="92" r="36" fill={foliageFill1} />
            {/* Hanging Teardrop Fig Fruits */}
            <ellipse cx="92" cy="148" rx="4.5" ry="6.5" fill="#6B2856" />
            <ellipse cx="148" cy="148" rx="4.5" ry="6.5" fill="#6B2856" />
            <ellipse cx="120" cy="138" rx="4.5" ry="6.5" fill="#6B2856" />
            <ellipse cx="168" cy="132" rx="4" ry="6" fill="#6B2856" />
            <circle cx="120" cy="80" r="4.5" fill={accentFill} />
          </>
        ) : species.id === 'cherry_blossom' ? (
          // 6. CHERRY BLOSSOM: Ethereal Pink Floral Cloud with Drifting Petals
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
        ) : species.id === 'jasmine_magnolia' ? (
          // 7. JASMINE MAGNOLIA: Broad Leathery Evergreen with Upright Ivory Cup Blossoms
          <>
            <ellipse cx="120" cy="114" rx="56" ry="42" fill={foliageFill1} />
            <ellipse cx="94" cy="124" rx="34" ry="26" fill={foliageFill2} />
            <ellipse cx="146" cy="124" rx="34" ry="26" fill={foliageFill2} />
            {/* Upright Magnolia Ivory Blossoms */}
            <ellipse cx="120" cy="84" rx="10" ry="14" fill={accentFill} stroke="#DDD5C7" strokeWidth="1.2" />
            <circle cx="120" cy="87" r="3" fill="#EAB308" />
            <ellipse cx="86" cy="112" rx="9" ry="12" transform="rotate(-20 86 112)" fill={accentFill} stroke="#DDD5C7" strokeWidth="1.2" />
            <circle cx="86" cy="115" r="2.5" fill="#EAB308" />
            <ellipse cx="154" cy="112" rx="9" ry="12" transform="rotate(20 154 112)" fill={accentFill} stroke="#DDD5C7" strokeWidth="1.2" />
            <circle cx="154" cy="115" r="2.5" fill="#EAB308" />
          </>
        ) : species.id === 'silver_wisteria' ? (
          // 8. SILVER WISTERIA: Horizontal Boughs with Cascading Lavender Racemes
          <>
            <ellipse cx="120" cy="96" rx="54" ry="32" fill={foliageFill1} />
            <ellipse cx="88" cy="104" rx="34" ry="22" fill={foliageFill2} />
            <ellipse cx="152" cy="104" rx="34" ry="22" fill={foliageFill2} />
            {/* Cascading Tapered Lavender Racemes */}
            <path d="M86 104 Q84 135 88 165" stroke={accentFill} strokeWidth="8" strokeLinecap="round" />
            <path d="M102 108 Q100 142 104 175" stroke={accentFill} strokeWidth="7" strokeLinecap="round" />
            <path d="M120 98 Q120 145 120 182" stroke={accentFill} strokeWidth="9" strokeLinecap="round" />
            <path d="M138 108 Q140 142 136 175" stroke={accentFill} strokeWidth="7" strokeLinecap="round" />
            <path d="M154 104 Q156 135 152 165" stroke={accentFill} strokeWidth="8" strokeLinecap="round" />
          </>
        ) : species.id === 'wild_azalea' ? (
          // 9. WILD AZALEA: Billowing Shrub Clouds with Star-Shaped Coral Blossoms
          <>
            <circle cx="88" cy="120" r="32" fill={foliageFill1} />
            <circle cx="120" cy="105" r="34" fill={foliageFill2} />
            <circle cx="152" cy="120" r="32" fill={foliageFill1} />
            {/* Star-Shaped Coral Blossoms */}
            <circle cx="80" cy="115" r="5.5" fill={accentFill} />
            <circle cx="98" cy="130" r="4.5" fill={accentFill} />
            <circle cx="120" cy="92" r="6" fill={accentFill} />
            <circle cx="118" cy="122" r="5" fill={accentFill} />
            <circle cx="144" cy="112" r="5.5" fill={accentFill} />
            <circle cx="160" cy="128" r="4.5" fill={accentFill} />
          </>
        ) : species.id === 'camellia_rose' ? (
          // 10. CAMELLIA ROSE: Dense Symmetrical Glossy Dome with Rosette Blooms
          <>
            <ellipse cx="120" cy="112" rx="58" ry="46" fill={foliageFill2} />
            <ellipse cx="120" cy="108" rx="48" ry="38" fill={foliageFill1} />
            {/* Layered Rosette Blooms */}
            <circle cx="120" cy="85" r="8" fill={accentFill} />
            <circle cx="120" cy="85" r="4" fill="#BE185D" />
            <circle cx="90" cy="115" r="7.5" fill={accentFill} />
            <circle cx="90" cy="115" r="3.5" fill="#BE185D" />
            <circle cx="150" cy="115" r="7.5" fill={accentFill} />
            <circle cx="150" cy="115" r="3.5" fill="#BE185D" />
            <circle cx="120" cy="132" r="6.5" fill={accentFill} />
            <circle cx="120" cy="132" r="3" fill="#BE185D" />
          </>
        ) : species.id === 'ancient_ginkgo' ? (
          // 11. ANCIENT GINKGO: Radiant Amber Fan-Leaf Sprays
          <>
            <ellipse cx="120" cy="110" rx="56" ry="46" fill={foliageFill2} />
            <path d="M85 105 Q120 70 155 105 Q120 135 85 105 Z" fill={foliageFill1} />
            <ellipse cx="90" cy="122" rx="30" ry="24" fill={foliageFill1} />
            <ellipse cx="150" cy="122" rx="30" ry="24" fill={foliageFill1} />
            {/* Fan leaf sprays */}
            <path d="M120 75 Q110 65 120 58 Q130 65 120 75 Z" fill={accentFill} />
            <path d="M96 98 Q86 90 94 82 Q104 90 96 98 Z" fill={accentFill} />
            <path d="M144 98 Q154 90 146 82 Q136 90 144 98 Z" fill={accentFill} />
            <circle cx="120" cy="88" r="6" fill={accentFill} opacity="0.9" />
          </>
        ) : species.id === 'weeping_willow' ? (
          // 12. WEEPING WILLOW: Cascading Vertical Drapery Tendrils
          <>
            <ellipse cx="120" cy="98" rx="46" ry="32" fill={foliageFill2} />
            {/* Long Sweeping Vertical Tendrils */}
            <path d="M74 95 Q64 140 70 188" stroke={foliageFill1} strokeWidth="4.5" strokeLinecap="round" />
            <path d="M92 90 Q84 145 88 192" stroke={foliageFill1} strokeWidth="5" strokeLinecap="round" />
            <path d="M108 86 Q104 146 106 194" stroke={foliageFill1} strokeWidth="5" strokeLinecap="round" />
            <path d="M120 84 Q118 148 120 196" stroke={foliageFill1} strokeWidth="5.5" strokeLinecap="round" />
            <path d="M132 86 Q136 146 134 194" stroke={foliageFill1} strokeWidth="5" strokeLinecap="round" />
            <path d="M148 90 Q156 145 152 192" stroke={foliageFill1} strokeWidth="5" strokeLinecap="round" />
            <path d="M166 95 Q176 140 170 188" stroke={foliageFill1} strokeWidth="4.5" strokeLinecap="round" />
            {/* Dew drop leaf nodes */}
            <circle cx="70" cy="188" r="3.5" fill={accentFill} />
            <circle cx="88" cy="192" r="3.5" fill={accentFill} />
            <circle cx="120" cy="196" r="3.8" fill={accentFill} />
            <circle cx="152" cy="192" r="3.5" fill={accentFill} />
            <circle cx="170" cy="188" r="3.5" fill={accentFill} />
          </>
        ) : species.id === 'japanese_maple' ? (
          // 13. JAPANESE RED MAPLE: Tiered Spreading Canopy with Star-Lobed Scarlet Foliage
          <>
            <ellipse cx="80" cy="106" rx="34" ry="18" fill={foliageFill2} />
            <ellipse cx="82" cy="104" rx="28" ry="14" fill={foliageFill1} />
            <ellipse cx="160" cy="106" rx="34" ry="18" fill={foliageFill2} />
            <ellipse cx="158" cy="104" rx="28" ry="14" fill={foliageFill1} />
            <ellipse cx="120" cy="80" rx="38" ry="20" fill={foliageFill1} />
            {/* Scarlet Palmate Star Leaves */}
            <polygon points="120,68 123,76 131,76 125,81 127,89 120,84 113,89 115,81 109,76 117,76" fill={accentFill} />
            <polygon points="78,98 80,103 86,103 81,107 83,112 78,109 73,112 75,107 70,103 76,103" fill={accentFill} />
            <polygon points="162,98 164,103 170,103 165,107 167,112 162,109 157,112 159,107 154,103 160,103" fill={accentFill} />
          </>
        ) : species.id === 'golden_birch' ? (
          // 14. GOLDEN BIRCH: Airy Shimmering Golden Oval Canopy
          <>
            <ellipse cx="120" cy="98" rx="46" ry="52" fill={foliageFill2} opacity="0.85" />
            <ellipse cx="120" cy="94" rx="40" ry="46" fill={foliageFill1} />
            {/* Shimmering Golden Flecks */}
            <circle cx="106" cy="74" r="4.5" fill={accentFill} />
            <circle cx="134" cy="78" r="4.5" fill={accentFill} />
            <circle cx="94" cy="104" r="5" fill={accentFill} />
            <circle cx="146" cy="102" r="5" fill={accentFill} />
            <circle cx="120" cy="118" r="4.5" fill={accentFill} />
            <circle cx="120" cy="62" r="4" fill={accentFill} />
          </>
        ) : (
          // Default Balanced Canopy fallback
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
