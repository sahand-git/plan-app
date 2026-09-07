import React, { useState } from 'react';
import { translations, type AppLanguage } from '../../utils/i18n';
import { ProceduralTreeRenderer } from '../tree/ProceduralTreeRenderer';
import { SPECIES_CATALOG } from '../tree/speciesData';
import { X, ChevronLeft, ChevronRight, Share2, Sparkles, Anchor, Disc, Heart } from 'lucide-react';
import type { GardenTree } from '../../db';

interface YearlyRecapModalProps {
  isOpen: boolean;
  onClose: () => void;
  gardenTrees: GardenTree[];
  totalJournalCount?: number;
  totalWeeksAccumulated?: number;
  lang?: AppLanguage;
  onOpenShareModal?: () => void;
}

export const YearlyRecapModal: React.FC<YearlyRecapModalProps> = ({
  isOpen,
  onClose,
  gardenTrees,
  totalJournalCount = 14,
  totalWeeksAccumulated = 24,
  lang = 'en',
  onOpenShareModal,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const t = translations[lang] || translations.en;

  if (!isOpen) return null;

  const matureTrees = gardenTrees.filter((t) => t.status === 'mature');
  const dominantSpeciesId = matureTrees.length > 0 ? matureTrees[0].speciesId : 'noble_pine';
  const dominantSpecies = SPECIES_CATALOG[dominantSpeciesId] || SPECIES_CATALOG.noble_pine;
  const dominantTitle = lang === 'ckb' ? dominantSpecies.kurdishName : dominantSpecies.name;

  const slides = [
    {
      title: t.recap.slide1Title,
      subtitle: t.recap.yearInReview,
      body: t.recap.slide1Text,
      icon: Sparkles,
      graphic: (
        <div className="flex flex-col items-center justify-center space-y-2 py-4">
          <span className="font-serif text-5xl sm:text-6xl font-bold text-sage-800 dark:text-sage-200">
            {matureTrees.length + 1}
          </span>
          <span className="text-xs text-stone-500 font-serif uppercase tracking-wider">
            Mindful Growth Cycles Completed
          </span>
        </div>
      ),
    },
    {
      title: t.recap.slide2Title,
      subtitle: 'A sanctuary of earned milestones',
      body: t.recap.slide2Text,
      icon: Heart,
      graphic: (
        <div className="flex items-center justify-center gap-2 py-2 overflow-x-auto no-scrollbar">
          {matureTrees.slice(0, 3).map((tr, i) => (
            <div key={i} className="w-20 h-24 bg-white/70 dark:bg-night-surface rounded-2xl p-1 border border-stone-200/50 shadow-xs flex flex-col items-center justify-center">
              <div className="w-14 h-14">
                <ProceduralTreeRenderer speciesId={tr.speciesId} stage="mature" journalCount={tr.journalCount} />
              </div>
              <span className="text-[9px] font-serif truncate max-w-[70px] text-stone-600 dark:text-stone-300">
                {SPECIES_CATALOG[tr.speciesId]?.name || tr.speciesName}
              </span>
            </div>
          ))}
          {matureTrees.length === 0 && (
            <div className="w-24 h-24 bg-white/70 dark:bg-night-surface rounded-2xl p-2 border border-stone-200/50 shadow-xs flex items-center justify-center">
              <div className="w-16 h-16">
                <ProceduralTreeRenderer speciesId="noble_pine" stage="sapling" journalCount={totalJournalCount} />
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      title: t.recap.slide3Title,
      subtitle: 'Living thoughts rooted permanently',
      body: t.recap.slide3Text,
      icon: Anchor,
      graphic: (
        <div className="flex flex-col items-center justify-center py-4 space-y-1">
          <div className="flex items-baseline gap-1">
            <span className="font-serif text-5xl font-bold text-earth-800 dark:text-earth-300">
              {totalJournalCount}
            </span>
            <span className="text-xs font-serif text-earth-600">reflections</span>
          </div>
          <span className="text-xs text-stone-500 font-light">
            Taproot deepened through all strata layers
          </span>
        </div>
      ),
    },
    {
      title: t.recap.slide4Title,
      subtitle: 'Dendrochronology of patient living',
      body: t.recap.slide4Text,
      icon: Disc,
      graphic: (
        <div className="flex flex-col items-center justify-center py-4 space-y-1">
          <div className="flex items-baseline gap-1">
            <span className="font-serif text-5xl font-bold text-stone-800 dark:text-stone-100">
              {totalWeeksAccumulated}
            </span>
            <span className="text-xs font-serif text-stone-500">weeks</span>
          </div>
          <span className="text-xs text-stone-500 font-light">
            Concentric growth rings recorded in trunk heartwood
          </span>
        </div>
      ),
    },
    {
      title: t.recap.slide5Title,
      subtitle: dominantTitle,
      body: t.recap.slide5Text,
      icon: Sparkles,
      graphic: (
        <div className="flex flex-col items-center justify-center py-2 space-y-2">
          <div className="w-32 h-32 relative flex items-center justify-center">
            <ProceduralTreeRenderer speciesId={dominantSpecies.id} stage="mature" journalCount={totalJournalCount} />
          </div>
          <span className="font-serif text-base font-medium text-stone-800 dark:text-stone-100">
            {dominantTitle}
          </span>
        </div>
      ),
    },
  ];

  const current = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-soft-fade-up select-none">
      <div className="w-full max-w-sm bg-gradient-to-b from-parchment-subtle to-parchment-deep dark:from-night-surface dark:to-stone-950 rounded-3xl p-6 shadow-calm-lg border border-stone-200/80 dark:border-night-border space-y-5 flex flex-col justify-between min-h-[500px]">
        {/* Top Story Progress Bars */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-medium tracking-wider text-sage-600 dark:text-sage-400">
              {t.recap.title}
            </span>
            <button onClick={onClose} className="p-1 rounded-full text-stone-400 hover:text-stone-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  idx <= currentSlide ? 'bg-sage-600' : 'bg-stone-200 dark:bg-night-card'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Slide Main Content */}
        <div className="text-center space-y-3 flex-1 flex flex-col justify-center">
          <div className="w-10 h-10 rounded-2xl bg-sage-100 dark:bg-night-card mx-auto flex items-center justify-center text-sage-600">
            <current.icon className="w-5 h-5" />
          </div>

          <h3 className="font-serif text-xl sm:text-2xl font-medium text-stone-800 dark:text-stone-100">
            {current.title}
          </h3>

          <p className="text-xs text-sage-700 dark:text-sage-400 font-serif">
            {current.subtitle}
          </p>

          <div className="py-2">
            {current.graphic}
          </div>

          <p className="text-xs text-stone-600 dark:text-stone-300 font-light max-w-xs mx-auto leading-relaxed">
            {current.body}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-200/50 dark:border-night-border">
          <button
            onClick={() => setCurrentSlide((s) => Math.max(0, s - 1))}
            disabled={currentSlide === 0}
            className="flex items-center gap-1 text-xs text-stone-500 disabled:opacity-30 p-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t.recap.prev}</span>
          </button>

          {currentSlide === slides.length - 1 && onOpenShareModal ? (
            <button
              onClick={() => {
                onClose();
                onOpenShareModal();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sage-600 hover:bg-sage-700 text-white rounded-xl text-xs font-medium shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{t.share.shareNative}</span>
            </button>
          ) : (
            <button
              onClick={() => setCurrentSlide((s) => Math.min(slides.length - 1, s + 1))}
              className="flex items-center gap-1 text-xs font-serif font-medium text-sage-700 dark:text-sage-300 p-2"
            >
              <span>{t.recap.next}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
