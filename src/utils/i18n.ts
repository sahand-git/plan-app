export type AppLanguage = 'en' | 'ckb';

export interface TranslationDictionary {
  appName: string;
  appSubtitle: string;
  paidBadge: string;
  noPressureMode: string;
  on: string;
  off: string;
  tabs: {
    mirror: string;
    garden: string;
    journal: string;
    calendar: string;
    vault: string;
  };
  headers: {
    todaysMirror: string;
    gardenGrove: string;
    dailyJournal: string;
    calendarHorizon: string;
    vaultPrivacy: string;
  };
  tree: {
    seed: string;
    sapling: string;
    mature: string;
    dimmed: string;
    dimmedNeglectTitle: string;
    dimmedNeglectSubtitle: string;
    canopy: string;
    roots: string;
    rings: string;
    garden: string;
    tapToReflect: string;
    daysEndReflect: string;
    maturity: string;
    plantInGarden: string;
    daysTended: string;
    cycleProgress: string;
    returnToCanopy: string;
    undergroundTitle: string;
    undergroundSubtitle: string;
    depthCm: string;
    reflectionsRooted: string;
    ringsTitle: string;
    ringsSubtitle: string;
    scrubbingWeek: string;
  };
  tasks: {
    addPlaceholder: string;
    quietTasks: string;
    habitsPractice: string;
    ofChecked: string;
    noTasksYet: string;
    pullOrTap: string;
  };
  garden: {
    title: string;
    subtitle: string;
    currentCycle: string;
    pastGrove: string;
    emptyGrove: string;
    emptyGroveDesc: string;
    speciesEarned: string;
    inspectTree: string;
    shareGrove: string;
    timeline: string;
  };
  calendar: {
    title: string;
    subtitle: string;
    today: string;
    canopyPosture: string;
    activityLevel: string;
    journalRootRecord: string;
    rootedPermanently: string;
    noJournalThisDay: string;
    viewTasks: string;
    openJournal: string;
    legendJournal: string;
    legendRest: string;
    legendFlourish: string;
  };
  notifications: {
    softPromptTitle: string;
    softPromptBody: string;
    enableAction: string;
    dismissAction: string;
  };
  share: {
    title: string;
    subtitle: string;
    storyCard: string;
    downloadPng: string;
    shareNative: string;
    footerQuote: string;
  };
  recap: {
    title: string;
    yearInReview: string;
    slide1Title: string;
    slide1Text: string;
    slide2Title: string;
    slide2Text: string;
    slide3Title: string;
    slide3Text: string;
    slide4Title: string;
    slide4Text: string;
    slide5Title: string;
    slide5Text: string;
    next: string;
    prev: string;
    close: string;
  };
}

export const translations: Record<AppLanguage, TranslationDictionary> = {
  en: {
    appName: 'The Tree Planner',
    appSubtitle: 'Today’s Gentle Rhythm',
    paidBadge: 'v1.0 One-Time Paid',
    noPressureMode: 'No-Pressure Mode',
    on: 'ON',
    off: 'OFF',
    tabs: {
      mirror: 'Mirror',
      garden: 'Garden',
      journal: 'Journal',
      calendar: 'Calendar',
      vault: 'Vault',
    },
    headers: {
      todaysMirror: "Today's Mirror",
      gardenGrove: 'Botanical Garden',
      dailyJournal: 'Daily Journal',
      calendarHorizon: 'Calendar Horizon',
      vaultPrivacy: 'Vault & Privacy',
    },
    tree: {
      seed: 'Quiet Seed',
      sapling: 'Young Sapling',
      mature: 'Mature Tree',
      dimmed: 'Dimmed Rest',
      dimmedNeglectTitle: 'Gentle Rest (Dimmed)',
      dimmedNeglectSubtitle: 'Soft reduced vitality • Recovers on next active day',
      canopy: 'Canopy',
      roots: 'Roots',
      rings: 'Rings',
      garden: 'Garden',
      tapToReflect: 'tap to reflect',
      daysEndReflect: 'Day’s End Reflect',
      maturity: 'Maturity',
      plantInGarden: 'Plant in Garden & Sprout New Seed',
      daysTended: 'Days Tended',
      cycleProgress: 'Cycle Progress',
      returnToCanopy: 'Return to Surface Canopy',
      undergroundTitle: 'Underground Strata',
      undergroundSubtitle: 'Permanent roots deepen with every journal reflection',
      depthCm: 'cm depth',
      reflectionsRooted: 'reflections rooted',
      ringsTitle: 'Trunk Growth Rings',
      ringsSubtitle: 'Dendrochronology of closed weekly cycles',
      scrubbingWeek: 'Scrubbing Past Rings',
    },
    tasks: {
      addPlaceholder: 'What quietly needs your attention?',
      quietTasks: "Today's Quiet Tasks",
      habitsPractice: 'Habits & Gentle Practice',
      ofChecked: 'checked',
      noTasksYet: 'No scheduled tasks today. Breathe and enjoy the stillness.',
      pullOrTap: 'pull or tap',
    },
    garden: {
      title: 'Botanical Sanctuary',
      subtitle: 'A timeline grove of your completed mindful cycles',
      currentCycle: 'Active Tree in Growth',
      pastGrove: 'Your Living Garden Grove',
      emptyGrove: 'Your garden awaits its first matured tree.',
      emptyGroveDesc: 'Continue tending your current seed. When mature, it will take root here permanently.',
      speciesEarned: 'Species Earned',
      inspectTree: 'Inspect Tree',
      shareGrove: 'Share Garden Snapshot',
      timeline: 'Garden Timeline',
    },
    calendar: {
      title: 'Botanical Heatmap Horizon',
      subtitle: 'Peaceful Weekly Flow',
      today: 'Today',
      canopyPosture: 'Canopy Posture',
      activityLevel: 'Activity Level',
      journalRootRecord: 'Journal Root Record',
      rootedPermanently: 'Rooted permanently',
      noJournalThisDay: 'Quiet day without journal reflections',
      viewTasks: 'View Tasks',
      openJournal: 'Journal',
      legendJournal: 'Journal rooted',
      legendRest: 'Rest',
      legendFlourish: 'Flourish',
    },
    notifications: {
      softPromptTitle: 'Want a gentle nudge next time?',
      softPromptBody: 'Your tree gently dimmed from a quiet day. No loud alarms or red badges—just an unhurried twilight whisper when your plant needs attention.',
      enableAction: 'Enable Gentle Whispers',
      dismissAction: 'Maybe Later',
    },
    share: {
      title: 'Botanical Story Snapshot',
      subtitle: 'Sized cleanly for Instagram & WhatsApp Stories',
      storyCard: 'Story Card',
      downloadPng: 'Download PNG',
      shareNative: 'Share Story',
      footerQuote: 'Grown with unhurried care • The Tree Planner',
    },
    recap: {
      title: 'Yearly Botanical Recap',
      yearInReview: 'Your Year in Leaves & Roots',
      slide1Title: 'Your Year in Leaves',
      slide1Text: 'You spent dedicated cycles nurturing calm progress without pressure or burnout.',
      slide2Title: 'The Grove You Cultivated',
      slide2Text: 'Each tree in your garden reflects a unique period of mindfulness, habits, and care.',
      slide3Title: 'Subterranean Depths',
      slide3Text: 'Your thoughts anchored deep into the soil through intentional journal reflections.',
      slide4Title: 'Rings of Presence',
      slide4Text: 'Every closed week added concentric rings of calm resilience to your trunk.',
      slide5Title: 'Your Signature Botanical Flora',
      slide5Text: 'The trees you earned are lasting records of your mindful presence.',
      next: 'Next',
      prev: 'Back',
      close: 'Close Recap',
    },
  },
  ckb: {
    appName: 'پلاندانەری درەخت',
    appSubtitle: 'ڕیتمی ئارامی ئەمڕۆ',
    paidBadge: 'وەشانی تایبەت v1.0',
    noPressureMode: 'دۆخی بێ پەستان',
    on: 'چالاکە',
    off: 'ناچالاکە',
    tabs: {
      mirror: 'ئاوێنە',
      garden: 'باخچە',
      journal: 'بیرەوەری',
      calendar: 'ڕۆژژمێر',
      vault: 'خەزنە',
    },
    headers: {
      todaysMirror: 'ئاوێنەی ئەمڕۆ',
      gardenGrove: 'باخچەی سروشتی',
      dailyJournal: 'بیرەوەریی ڕۆژانە',
      calendarHorizon: 'ئاسۆی ڕۆژژمێر',
      vaultPrivacy: 'خەزنە و تایبەتمەندی',
    },
    tree: {
      seed: 'تۆوی بێدەنگ',
      sapling: 'نەمامی لاو',
      mature: 'درەختی پێگەیشتوو',
      dimmed: 'پشووی کەمبوونەوەی ڕووناکی',
      dimmedNeglectTitle: 'پشووی ئارام (کەمبوونەوەی درەوشاوەیی)',
      dimmedNeglectSubtitle: 'کەمبوونەوەی هێواشی گەشە • سبەی بە تەواوی نوێ دەبێتەوە',
      canopy: 'پەل و پۆ',
      roots: 'ڕەگەکان',
      rings: 'بازنەکان',
      garden: 'باخچە',
      tapToReflect: 'دەست لێبدە بۆ تێڕامان',
      daysEndReflect: 'تێڕامانی کۆتایی ڕۆژ',
      maturity: 'پێگەیشتن',
      plantInGarden: 'ڕواندن لە باخچە و دەستپێکردنی تۆوی نوێ',
      daysTended: 'ڕۆژانی چاودێریکراو',
      cycleProgress: 'پێشکەوتنی سووڕەکە',
      returnToCanopy: 'گەڕانەوە بۆ سەرووی زەوی',
      undergroundTitle: 'چینەکانی ژێر زەوی',
      undergroundSubtitle: 'ڕەگە هەمیشەییەکان لەگەڵ هەموو یاداشتێک قووڵتر دەبن',
      depthCm: 'سم قووڵی',
      reflectionsRooted: 'یاداشتی ڕەگداکوتاو',
      ringsTitle: 'بازنەکانی گەشەی قەد',
      ringsSubtitle: 'تەمەنی دار بەپێی سووڕە هەفتانەییە تەواوبووەکان',
      scrubbingWeek: 'پێداچوونەوەی بازنەکانی ڕابردوو',
    },
    tasks: {
      addPlaceholder: 'ئەمڕۆ چی پێویستی بە سەرنجی ئارامی تۆیە؟',
      quietTasks: 'ئەرکە ئارامەکانی ئەمڕۆ',
      habitsPractice: 'ڕاهێنان و نەریتە نەرمەکان',
      ofChecked: 'تەواوکراو',
      noTasksYet: 'هیچ ئەرکێک دیاری نەکراوە. هەناسەیەکی قووڵ هەڵمژە و لە ئارامیدا بە.',
      pullOrTap: 'ڕابکێشە یان دەست لێبدە',
    },
    garden: {
      title: 'پەناگەی سروشتیی باخچە',
      subtitle: 'هێڵی کاتیی درەختە پێگەیشتووەکانی سووڕەکانی ڕابردووت',
      currentCycle: 'درەختی ئێستای گەشەسەندوو',
      pastGrove: 'باخچەی درەختە سەوزەکانت',
      emptyGrove: 'باخچەکەت چاوەڕوانی یەکەم درەختی پێگەیشتووە.',
      emptyGroveDesc: 'بەردەوام بە لە ئاگاداری تۆوەکەت. کاتێک گەورە بوو، بۆ هەمیشە لێرە دەڕوێت.',
      speciesEarned: 'جۆری بەدەستهاتوو',
      inspectTree: 'سەیرکردنی درەخت',
      shareGrove: 'هاوبەشکردنی وێنەی باخچە',
      timeline: 'هێڵی کاتیی باخچە',
    },
    calendar: {
      title: 'نەخشەی گەرمی سروشتی',
      subtitle: 'ڕەوتی هێمنی هەفتانە',
      today: 'ئەمڕۆ',
      canopyPosture: 'دۆخی درەخت',
      activityLevel: 'ئاستی چالاکی',
      journalRootRecord: 'تۆماری ڕەگی بیرەوەری',
      rootedPermanently: 'بۆ هەمیشە ڕەگی داکوتاوە',
      noJournalThisDay: 'ڕۆژێکی ئارام بەبێ نووسینی یاداشت',
      viewTasks: 'پیشاندانی ئەرکەکان',
      openJournal: 'بیرەوەری',
      legendJournal: 'ڕەگی یاداشت',
      legendRest: 'پشوو',
      legendFlourish: 'گەشەسەندوو',
    },
    notifications: {
      softPromptTitle: 'دەتەوێت بیرخستنەوەیەکی نەرمت بۆ بێت؟',
      softPromptBody: 'درەختەکەت بەهۆی کەمبوونەوەی چالاکی ئەمڕۆ کەمێک بێدەنگ بوو. بەبێ دەنگی بێزارکەر—تەنها ورتەورتی ئێواران لە کاتی پێویستدا.',
      enableAction: 'چالاککردنی ورتەورتی ئارام',
      dismissAction: 'دواتر ڕەنگە',
    },
    share: {
      title: 'وێنەی سەرنجڕاکێشی ستۆری',
      subtitle: 'قەبارەی تایبەت بۆ ستۆریی ئینستاگرام و واتسئەپ',
      storyCard: 'کارتی ستۆری',
      downloadPng: 'داگرتنی وێنە (PNG)',
      shareNative: 'هاوبەشکردنی ستۆری',
      footerQuote: 'بە ئارامی و هێمنی ڕوواوە • پلاندانەری درەخت',
    },
    recap: {
      title: 'پوختەی ساڵانەی سروشتی',
      yearInReview: 'ساڵی تۆ لە نێوان گەڵا و ڕەگەکاندا',
      slide1Title: 'ساڵی تۆ لە گەڵاکاندا',
      slide1Text: 'چەندین سووڕی ئارامت بەبێ پەستان و بێزاری بەڕێکرد.',
      slide2Title: 'ئەو باخچەیەی پێگەیاندت',
      slide2Text: 'هەر درەختێکی ناو باخچەکەت نیشانەی قۆناغێکی تایبەتی هۆشیاری و ئاگادارییە.',
      slide3Title: 'قووڵاییەکانی ژێر زەوی',
      slide3Text: 'بیرۆکەکانت لە ڕێگەی یاداشتەکانەوە ڕەگی پتەویان داکوتا.',
      slide4Title: 'بازنەکانی ئامادەیی',
      slide4Text: 'هەموو هەفتەیەکی تەواوکراو بازنەیەکی ئارامی بە قەدی درەختەکەت بەخشی.',
      slide5Title: 'درەختی تایبەتی تۆ',
      slide5Text: 'ئەو جۆرانەی بەدەستت هێناوە یادگارییەکی هەمیشەیین بۆ ئارامیی دڵت.',
      next: 'دواتر',
      prev: 'پێشتر',
      close: 'داخستن',
    },
  },
};

const LANG_KEY = 'treeplanner_lang';

export function getInitialLanguage(): AppLanguage {
  if (typeof window === 'undefined') return 'en';
  const saved = localStorage.getItem(LANG_KEY);
  if (saved === 'ckb' || saved === 'en') return saved;
  return 'en';
}

export function saveLanguage(lang: AppLanguage) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.dir = lang === 'ckb' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }
}

export function isRtl(lang: AppLanguage): boolean {
  return lang === 'ckb';
}
