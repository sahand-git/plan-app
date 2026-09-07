export interface BotanicalPalette {
  foliagePrimary: string;
  foliageSecondary: string;
  accent: string;
  trunk: string;
  trunkDark: string;
}

export interface SpeciesDefinition {
  id: string;
  name: string;
  kurdishName: string;
  scientificName: string;
  category: 'flowering' | 'sturdy' | 'rare';
  descriptionEn: string;
  descriptionCkb: string;
  earnedReasonEn: string;
  earnedReasonCkb: string;
  palette: BotanicalPalette;
}

export const SPECIES_CATALOG: Record<string, SpeciesDefinition> = {
  noble_pine: {
    id: 'noble_pine',
    name: 'Noble Pine',
    kurdishName: 'سنەوبەری بەرز',
    scientificName: 'Pinus procera',
    category: 'sturdy',
    descriptionEn: 'Deep evergreen needle clusters and layered horizontal branches built for mountain resilience.',
    descriptionCkb: 'پەل و پۆی سنەوبەری سەوزی هەمیشەیی کە بۆ خۆڕاگریی شاخەکان دروستکراوە.',
    earnedReasonEn: 'Earned through unwavering habit practice and steady daily rhythm.',
    earnedReasonCkb: 'بەدەستهاتووە لە ڕێگەی بەردەوامی لە نەریتە نەرمەکان و ڕیتمی ڕۆژانە.',
    palette: {
      foliagePrimary: '#3F6144',
      foliageSecondary: '#243D28',
      accent: '#6B8E23',
      trunk: '#4A3B31',
      trunkDark: '#2F231B',
    },
  },
  stone_bonsai: {
    id: 'stone_bonsai',
    name: 'Stone Bonsai',
    kurdishName: 'بۆنسای بەردین',
    scientificName: 'Juniperus chinensis',
    category: 'sturdy',
    descriptionEn: 'Sculptural curved trunk and compact jade-green cloud foliage shaped with patient mastery.',
    descriptionCkb: 'قەدێکی چەماوەی هونەری و گەڵای چڕی یەشمین کە بە سەبر و ئارامی پێگەیشتووە.',
    earnedReasonEn: 'Earned through disciplined task completion and quiet attention.',
    earnedReasonCkb: 'بەدەستهاتووە بەهۆی تەواوکردنی ڕێکوپێکی ئەرکەکان و سەرنجی هێمن.',
    palette: {
      foliagePrimary: '#3A6B56',
      foliageSecondary: '#234436',
      accent: '#5BB388',
      trunk: '#524336',
      trunkDark: '#352920',
    },
  },
  coastal_cypress: {
    id: 'coastal_cypress',
    name: 'Coastal Cypress',
    kurdishName: 'سەروی کەناراو',
    scientificName: 'Cupressus sempervirens',
    category: 'sturdy',
    descriptionEn: 'Slender, upright spire reaching towards the sky with wind-tested poise.',
    descriptionCkb: 'درەختێکی باریک و بەرز کە بەرەو ئاسمان بەرز دەبێتەوە بە نەرمی.',
    earnedReasonEn: 'Earned through dependable evening reflection and mindful closure.',
    earnedReasonCkb: 'بەدەستهاتووە لە ڕێگەی تێڕامانی ئێواران و خەوتنی بە ئارام.',
    palette: {
      foliagePrimary: '#2D5A46',
      foliageSecondary: '#1C3A2C',
      accent: '#478566',
      trunk: '#4E382A',
      trunkDark: '#302219',
    },
  },
  mountain_cedar: {
    id: 'mountain_cedar',
    name: 'Mountain Cedar',
    kurdishName: 'سیداری شاخاوی',
    scientificName: 'Cedrus libani',
    category: 'sturdy',
    descriptionEn: 'Broad terraced horizontal boughs offering timeless shade and shelter.',
    descriptionCkb: 'پەل و پۆی پان و پتەو کە سێبەرێکی فێنک و هەمیشەیی دابین دەکات.',
    earnedReasonEn: 'Earned through consistent execution across multiple tasks.',
    earnedReasonCkb: 'بەدەستهاتووە بە ئەنجامدانی ئارامانەی ژمارەیەکی زۆر لە ئەرکەکان.',
    palette: {
      foliagePrimary: '#4B6B55',
      foliageSecondary: '#2E4736',
      accent: '#689476',
      trunk: '#433428',
      trunkDark: '#2B2017',
    },
  },
  jasmine_magnolia: {
    id: 'jasmine_magnolia',
    name: 'Jasmine Magnolia',
    kurdishName: 'ماگنۆلیای یاسمین',
    scientificName: 'Magnolia grandiflora',
    category: 'flowering',
    descriptionEn: 'Creamy ivory blossoms amidst broad, leathery evergreen leaves carrying serene fragrance.',
    descriptionCkb: 'گوڵی گەورەی شیریی بێگەرد لە نێوان گەڵای پان و سەوزی بەهێزدا.',
    earnedReasonEn: 'Earned through frequent, heartfelt daily journal writing.',
    earnedReasonCkb: 'بەدەستهاتووە لە ڕێگەی نووسینی پڕ لە هەستی یاداشتە ڕۆژانەییەکان.',
    palette: {
      foliagePrimary: '#4A6B50',
      foliageSecondary: '#2C4430',
      accent: '#FFFDF0',
      trunk: '#5C483A',
      trunkDark: '#3C2E23',
    },
  },
  silver_wisteria: {
    id: 'silver_wisteria',
    name: 'Silver Wisteria',
    kurdishName: 'ویستێریای زیوین',
    scientificName: 'Wisteria sinensis',
    category: 'flowering',
    descriptionEn: 'Cascading racemes of soft lavender and silver florets swaying with twilight breeze.',
    descriptionCkb: 'هێشوە گوڵی شۆڕەبووی وەنەوشەیی و زیوین کە لەگەڵ با شنە دەکات.',
    earnedReasonEn: 'Earned through deep, poetic reflections during evening journaling.',
    earnedReasonCkb: 'بەدەستهاتووە لە ڕێگەی نووسینی یاداشتی قووڵ لە کاتی ئێواراندا.',
    palette: {
      foliagePrimary: '#5D7C66',
      foliageSecondary: '#3C5243',
      accent: '#C4B5FD',
      trunk: '#54463A',
      trunkDark: '#352B23',
    },
  },
  wild_azalea: {
    id: 'wild_azalea',
    name: 'Wild Azalea',
    kurdishName: 'ئازالیای کێوی',
    scientificName: 'Rhododendron canescens',
    category: 'flowering',
    descriptionEn: 'Delicate coral and blush star flowers emerging in exuberant forest clusters.',
    descriptionCkb: 'گوڵی پەمەیی و مەرجانیی ناسک کە بە کۆمەڵ لە دارستاندا دەڕوێن.',
    earnedReasonEn: 'Earned through continuous introspective writing across the cycle.',
    earnedReasonCkb: 'بەدەستهاتووە لە ڕێگەی بەردەوامی لە دەربڕینی هەستەکان لە یاداشتدا.',
    palette: {
      foliagePrimary: '#557356',
      foliageSecondary: '#384C38',
      accent: '#FDA4AF',
      trunk: '#584337',
      trunkDark: '#372922',
    },
  },
  camellia_rose: {
    id: 'camellia_rose',
    name: 'Camellia Rose',
    kurdishName: 'کامیلیای گوڵڕەنگ',
    scientificName: 'Camellia japonica',
    category: 'flowering',
    descriptionEn: 'Perfection of blush crimson petals nestled in deep glossy foliage.',
    descriptionCkb: 'گوڵی شێوە ڕۆزی پەمەیی ئاڵ کە لە ناو گەڵای سەوزی بریقەداردا دەدرەوشێتەوە.',
    earnedReasonEn: 'Earned through regular journaling and quiet mindfulness.',
    earnedReasonCkb: 'بەدەستهاتووە لە ڕێگەی یاداشتنووسینی بەردەوام و ئارامیی دڵ.',
    palette: {
      foliagePrimary: '#3A5C42',
      foliageSecondary: '#213B28',
      accent: '#F472B6',
      trunk: '#4E3A2F',
      trunkDark: '#31231B',
    },
  },
  cherry_blossom: {
    id: 'cherry_blossom',
    name: 'Cherry Blossom (Sakura)',
    kurdishName: 'گوڵە گێلاس (ساکورا)',
    scientificName: 'Prunus serrulata',
    category: 'rare',
    descriptionEn: 'Ethereal pale pink floral canopy with drifting petals celebrating transience and peace.',
    descriptionCkb: 'پەردەیەکی گوڵی پەمەیی ناسک کە گەڵاکانی لە هەوادا سەما دەکەن.',
    earnedReasonEn: 'Earned through unbroken daily presence with zero neglected days.',
    earnedReasonCkb: 'بەدەستهاتووە لە ڕێگەی ئامادەبوونی ڕۆژانەی بێ پچڕان.',
    palette: {
      foliagePrimary: '#8A5D6B',
      foliageSecondary: '#573641',
      accent: '#FBCFE8',
      trunk: '#42312C',
      trunkDark: '#281D1A',
    },
  },
  ancient_ginkgo: {
    id: 'ancient_ginkgo',
    name: 'Ancient Ginkgo',
    kurdishName: 'گینکگۆی دێرین',
    scientificName: 'Ginkgo biloba',
    category: 'rare',
    descriptionEn: 'Fan-shaped radiant golden amber leaves surviving unchanged across geological eras.',
    descriptionCkb: 'گەڵای شێوە پانکەیی زێڕین کە مێژووەکەی دەگەڕێتەوە بۆ ملیۆنان ساڵ پێش ئێستا.',
    earnedReasonEn: 'Earned through tri-harmony: balanced tasks, habits, and journal reflections.',
    earnedReasonCkb: 'بەدەستهاتووە لە ڕێگەی هاوسەنگیی تەواو لە نێوان ئەرک و نەریت و یاداشتدا.',
    palette: {
      foliagePrimary: '#D4A338',
      foliageSecondary: '#946F1E',
      accent: '#FEF08A',
      trunk: '#4E4136',
      trunkDark: '#322921',
    },
  },
  weeping_willow: {
    id: 'weeping_willow',
    name: 'Weeping Willow',
    kurdishName: 'بیی مەجنوون',
    scientificName: 'Salix babylonica',
    category: 'rare',
    descriptionEn: 'Graceful emerald tendrils cascading downward with forgiveness and flexibility.',
    descriptionCkb: 'شۆڕەبیی نەرم و جوان کە بە نەرمی بەرەو زەوی دادەبەزێت بە لێبوردەیی.',
    earnedReasonEn: 'Earned through gentle resilience: recovering fully after a quiet dimmed period.',
    earnedReasonCkb: 'بەدەستهاتووە لە ڕێگەی هەستانەوەی نەرم دوای ڕۆژانی بێدەنگی.',
    palette: {
      foliagePrimary: '#5E8255',
      foliageSecondary: '#3E5737',
      accent: '#86EFAC',
      trunk: '#46372D',
      trunkDark: '#2C221B',
    },
  },
  japanese_maple: {
    id: 'japanese_maple',
    name: 'Japanese Red Maple',
    kurdishName: 'مەیپڵی سووری ژاپۆنی',
    scientificName: 'Acer palmatum',
    category: 'rare',
    descriptionEn: 'Intricate star-lobed leaves of deep scarlet and amber creating contemplative warmth.',
    descriptionCkb: 'گەڵای ئەستێرەیی سوور و ئاڵتونی کە گەرمییەکی تایبەت بە باخچە دەبەخشێت.',
    earnedReasonEn: 'Earned through high creative focus and mindful task completion.',
    earnedReasonCkb: 'بەدەستهاتووە لە ڕێگەی سەرنجی قووڵ و بەرهەمداریی ئارام.',
    palette: {
      foliagePrimary: '#993333',
      foliageSecondary: '#5C1D1D',
      accent: '#F87171',
      trunk: '#3D302B',
      trunkDark: '#261E1A',
    },
  },
  golden_birch: {
    id: 'golden_birch',
    name: 'Golden Birch',
    kurdishName: 'بەڕووی زێڕین',
    scientificName: 'Betula alleghaniensis',
    category: 'rare',
    descriptionEn: 'Silvery paper bark peeling in fine curls crowned with luminous shimmering leaves.',
    descriptionCkb: 'قەدی سپیی ناسک و گەڵای زەردی درەوشاوە کە تیشکی خۆر وەردەگرێت.',
    earnedReasonEn: 'Earned through peaceful morning momentum and unhurried starts.',
    earnedReasonCkb: 'بەدەستهاتووە بەهۆی دەستپێکی ئارام و زووی بەیانیان.',
    palette: {
      foliagePrimary: '#C6A13B',
      foliageSecondary: '#856A20',
      accent: '#FDE047',
      trunk: '#D1C7BD',
      trunkDark: '#8F8479',
    },
  },
  sweet_fig: {
    id: 'sweet_fig',
    name: 'Sweet Fig',
    kurdishName: 'هەنجیری شیرین',
    scientificName: 'Ficus carica',
    category: 'sturdy',
    descriptionEn: 'Sculptural lobed foliage and fertile warmth nurtured by Mediterranean sunshine.',
    descriptionCkb: 'گەڵای پان و قووڵی هەنجیر کە بەرەکەی شیریین و سێبەرەکەی هێمنە.',
    earnedReasonEn: 'Earned through grounded presence and well-nourished weekly rhythms.',
    earnedReasonCkb: 'بەدەستهاتووە لە ڕێگەی پشوودانی دروست و هاوسەنگی لە ژیاندا.',
    palette: {
      foliagePrimary: '#4D6E44',
      foliageSecondary: '#30472A',
      accent: '#A3E635',
      trunk: '#56473D',
      trunkDark: '#382D25',
    },
  },
};

export const SPECIES_LIST = Object.values(SPECIES_CATALOG);

/**
 * Deterministic species selector:
 * No random loot boxes. Purely evaluated by the user's engagement over the growth cycle.
 */
export function determineEarnedSpecies(stats: {
  daysTended: number;
  totalDays: number;
  journalCount: number;
  habitsCompletedRatio: number;
  tasksCompletedRatio: number;
  recoveredFromNeglect: boolean;
  unbrokenStreak: boolean;
}): SpeciesDefinition {
  const {
    journalCount,
    habitsCompletedRatio,
    tasksCompletedRatio,
    recoveredFromNeglect,
    unbrokenStreak,
  } = stats;

  // 1. Rare Cases
  if (unbrokenStreak && stats.daysTended >= 10) {
    return SPECIES_CATALOG.cherry_blossom; // Rare Sakura
  }
  if (recoveredFromNeglect) {
    return SPECIES_CATALOG.weeping_willow; // Forgiving resilience
  }
  if (habitsCompletedRatio >= 0.75 && tasksCompletedRatio >= 0.75 && journalCount >= 5) {
    return SPECIES_CATALOG.ancient_ginkgo; // Harmonious mastery
  }
  if (tasksCompletedRatio >= 0.85) {
    return SPECIES_CATALOG.japanese_maple; // High task accomplishment
  }

  // 2. Flowering Trees (Driven by Journaling)
  if (journalCount >= 7) {
    return SPECIES_CATALOG.silver_wisteria;
  }
  if (journalCount >= 5) {
    return SPECIES_CATALOG.jasmine_magnolia;
  }
  if (journalCount >= 3) {
    return SPECIES_CATALOG.wild_azalea;
  }
  if (journalCount >= 2) {
    return SPECIES_CATALOG.camellia_rose;
  }

  // 3. Sturdy Evergreens / Bonsai (Driven by Habits & Pacing)
  if (habitsCompletedRatio >= 0.8) {
    return SPECIES_CATALOG.noble_pine;
  }
  if (habitsCompletedRatio >= 0.6) {
    return SPECIES_CATALOG.stone_bonsai;
  }
  if (tasksCompletedRatio >= 0.6) {
    return SPECIES_CATALOG.mountain_cedar;
  }
  if (stats.daysTended >= 5) {
    return SPECIES_CATALOG.coastal_cypress;
  }

  // Default calm species
  return SPECIES_CATALOG.sweet_fig;
}
