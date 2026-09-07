import React, { useState, useRef } from 'react';
import type { GardenTree } from '../../db';
import { ProceduralTreeRenderer } from '../tree/ProceduralTreeRenderer';
import { SPECIES_CATALOG } from '../tree/speciesData';
import { translations, type AppLanguage } from '../../utils/i18n';
import { Share2, Sparkles, Info, ArrowLeft, Filter, Footprints } from 'lucide-react';

interface GardenGroveViewProps {
  gardenTrees: GardenTree[];
  activeTree?: GardenTree;
  onOpenShareModal: () => void;
  onOpenRecapModal: () => void;
  lang?: AppLanguage;
  onBackToMirror?: () => void;
}

export const GardenGroveView: React.FC<GardenGroveViewProps> = ({
  gardenTrees,
  activeTree,
  onOpenShareModal,
  onOpenRecapModal,
  lang = 'en',
  onBackToMirror,
}) => {
  const t = translations[lang] || translations.en;
  const [selectedTree, setSelectedTree] = useState<GardenTree | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'flowering' | 'sturdy' | 'rare'>('all');
  const [scrollX, setScrollX] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mature trees ordered chronologically (oldest to newest)
  const matureTrees = gardenTrees
    .filter((tree) => tree.status === 'mature')
    .sort((a, b) => (a.cycleStart > b.cycleStart ? 1 : -1));

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollX(e.currentTarget.scrollLeft);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 space-y-6 animate-soft-fade-up select-none pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-medium tracking-wider uppercase text-sage-600 dark:text-sage-400">
            {t.garden.title}
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-medium text-stone-800 dark:text-stone-100">
            {t.headers.gardenGrove}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 font-light">
            {t.garden.subtitle}
          </p>
        </div>

        {/* Action Buttons: Back, Recap, Share */}
        <div className="flex items-center gap-1.5">
          {onBackToMirror && (
            <button
              onClick={onBackToMirror}
              className="p-2 rounded-2xl bg-stone-100 dark:bg-night-card text-stone-600 dark:text-stone-300 border border-stone-200/60 dark:border-night-border hover:scale-105 active:scale-95 transition-all shadow-xs"
              title="Return to Mirror"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onOpenRecapModal}
            className="p-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/60 hover:scale-105 active:scale-95 transition-all shadow-xs"
            title="Open Yearly Botanical Recap"
          >
            <Sparkles className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenShareModal}
            className="p-2 rounded-2xl bg-sage-50 dark:bg-night-card text-sage-700 dark:text-sage-300 border border-sage-200/60 dark:border-night-border hover:scale-105 active:scale-95 transition-all shadow-xs"
            title={t.garden.shareGrove}
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Active Growing Tree Card */}
      {activeTree && (
        <div className="p-4 rounded-3xl bg-white/70 dark:bg-night-card/70 border border-stone-200/70 dark:border-night-border shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-earth-700 dark:text-earth-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {t.garden.currentCycle}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-earth-100 dark:bg-earth-950/60 text-earth-800 dark:text-earth-300 font-serif">
              {activeTree.lifecycleStage === 'seed'
                ? t.tree.seed
                : activeTree.lifecycleStage === 'sapling'
                ? t.tree.sapling
                : t.tree.mature}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-20 h-20 shrink-0 relative flex items-center justify-center bg-stone-50 dark:bg-night-surface rounded-2xl p-1">
              <ProceduralTreeRenderer
                speciesId={activeTree.speciesId}
                stage={activeTree.lifecycleStage}
                journalCount={activeTree.journalCount}
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-base font-medium text-stone-800 dark:text-stone-100">
                {lang === 'ckb'
                  ? SPECIES_CATALOG[activeTree.speciesId]?.kurdishName || activeTree.speciesName
                  : activeTree.speciesName}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-light line-clamp-2">
                {lang === 'ckb'
                  ? SPECIES_CATALOG[activeTree.speciesId]?.earnedReasonCkb || activeTree.earnedReason
                  : activeTree.earnedReason}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-stone-400 font-serif pt-1">
                <span>{activeTree.daysTended} {t.tree.daysTended.toLowerCase()}</span>
                <span>•</span>
                <span>{activeTree.journalCount} {t.tree.roots.toLowerCase()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        {(
          [
            { id: 'all', label: lang === 'ckb' ? 'هەموو' : 'All Flora' },
            { id: 'flowering', label: lang === 'ckb' ? 'گوڵدارەکان' : 'Flowering' },
            { id: 'sturdy', label: lang === 'ckb' ? 'پتەوەکان' : 'Sturdy' },
            { id: 'rare', label: lang === 'ckb' ? 'دەگمەنەکان' : 'Rare' },
          ] as const
        ).map((f) => (
          <button
            key={f.id}
            onClick={() => setCategoryFilter(f.id)}
            className={`px-3 py-1 rounded-xl text-xs font-medium transition-all shrink-0 ${
              categoryFilter === f.id
                ? 'bg-sage-600 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-night-card text-stone-600 dark:text-stone-400 hover:bg-stone-200/60'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Mature Garden Grove Timeline */}
      {/* Visual Landscape Grove Scene */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-sm font-medium text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
            <span>{t.garden.pastGrove}</span>
            <span className="text-xs text-stone-400 font-sans">({matureTrees.length})</span>
          </h3>
          <span className="text-[11px] text-stone-400 font-light flex items-center gap-1">
            <Footprints className="w-3.5 h-3.5" />
            <span>{lang === 'ckb' ? 'بۆ بینینی هەمووی ڕابکێشە →' : 'Walk the path →'}</span>
          </span>
        </div>

        {matureTrees.length === 0 ? (
          <div className="p-8 rounded-3xl bg-stone-50/70 dark:bg-night-card/40 border border-stone-200/50 dark:border-night-border text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-sage-100 dark:bg-night-surface mx-auto flex items-center justify-center text-sage-600">
              <Info className="w-5 h-5" />
            </div>
            <p className="font-serif text-sm text-stone-800 dark:text-stone-200">
              {t.garden.emptyGrove}
            </p>
            <p className="text-xs text-stone-400 font-light max-w-xs mx-auto">
              {t.garden.emptyGroveDesc}
            </p>
          </div>
        ) : (
          /* Panoramic Landscape Viewport with 2-Layer Subtle Parallax */
          <div className="relative rounded-3xl overflow-hidden border border-stone-200/80 dark:border-night-border bg-gradient-to-b from-[#F3EEE6] via-[#E8E1D5] to-[#D5C9BA] dark:from-[#151D18] dark:via-[#19221C] dark:to-[#101612] shadow-calm">
            {/* Layer 1: Distant Mountain Silhouettes & Atmosphere (0.35x Parallax) */}
            <div
              className="absolute inset-0 pointer-events-none transition-transform ease-out duration-75"
              style={{ transform: `translateX(-${scrollX * 0.35}px)` }}
            >
              {/* Soft Golden Hour Glow */}
              <div className="absolute top-2 left-1/4 w-96 h-28 rounded-full bg-amber-100/40 dark:bg-amber-900/10 blur-3xl" />
              {/* Distant Hills Silhouette */}
              <svg
                className="absolute bottom-14 left-0 w-[1800px] h-28 text-stone-300/50 dark:text-stone-800/40 opacity-70"
                viewBox="0 0 1800 120"
                fill="currentColor"
                preserveAspectRatio="none"
              >
                <path d="M0 80 Q200 40 450 70 T900 60 T1350 75 T1800 50 L1800 120 L0 120 Z" />
              </svg>
            </div>

            {/* Layer 2: Midground Rolling Meadow Contour (0.6x Parallax) */}
            <div
              className="absolute inset-0 pointer-events-none transition-transform ease-out duration-75"
              style={{ transform: `translateX(-${scrollX * 0.6}px)` }}
            >
              <svg
                className="absolute bottom-6 left-0 w-[2000px] h-20 text-sage-200/50 dark:text-night-surface/60 opacity-80"
                viewBox="0 0 2000 100"
                fill="currentColor"
                preserveAspectRatio="none"
              >
                <path d="M0 60 Q250 25 500 55 T1000 45 T1500 55 T2000 35 L2000 100 L0 100 Z" />
              </svg>
            </div>

            {/* Layer 3: Foreground Walking Ground & Standing Botanical Trees (1.0x Scroll) */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="relative z-10 w-full overflow-x-auto no-scrollbar py-6 px-5 cursor-grab active:cursor-grabbing"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <div className="flex items-end gap-6 sm:gap-8 min-w-max pb-2">
                {matureTrees.map((tree) => {
                  const spec = SPECIES_CATALOG[tree.speciesId] || SPECIES_CATALOG.noble_pine;
                  const title = lang === 'ckb' ? spec.kurdishName : spec.name;
                  const isMatching = categoryFilter === 'all' || spec.category === categoryFilter;

                  return (
                    <div
                      key={tree.id || tree.cycleStart}
                      onClick={() => setSelectedTree(tree)}
                      className={`relative flex flex-col items-center group cursor-pointer transition-all duration-500 ${
                        isMatching
                          ? 'opacity-100 scale-100'
                          : 'opacity-30 grayscale-[70%] scale-95 hover:opacity-75'
                      }`}
                    >
                      {/* Standing Botanical Tree Rendering */}
                      <div className="w-36 h-48 sm:w-44 sm:h-56 relative flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-1.5 group-active:scale-95">
                        {isMatching && (
                          <div className="absolute inset-3 rounded-full bg-sage-100/50 dark:bg-sage-900/20 blur-xl pointer-events-none group-hover:bg-amber-100/40" />
                        )}
                        <ProceduralTreeRenderer
                          speciesId={tree.speciesId}
                          stage="mature"
                          journalCount={tree.journalCount}
                          className="w-full h-full"
                        />
                      </div>

                      {/* Ground Marker / Botanical Stone Plaque */}
                      <div className="mt-1 flex flex-col items-center text-center">
                        <div className="px-3 py-1.5 rounded-2xl bg-white/90 dark:bg-night-card/90 backdrop-blur-md border border-stone-200/80 dark:border-night-border shadow-xs group-hover:border-sage-300 dark:group-hover:border-sage-700 transition-all">
                          <span className="font-serif text-xs font-medium text-stone-800 dark:text-stone-100 block leading-tight">
                            {title}
                          </span>
                          <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-400 font-serif mt-0.5">
                            <span>{tree.cycleStart.slice(0, 7)}</span>
                            <span>•</span>
                            <span className="text-sage-600 dark:text-sage-400 uppercase font-sans tracking-tight text-[9px]">
                              {spec.category}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] text-stone-400 dark:text-stone-500 mt-1 font-serif opacity-0 group-hover:opacity-100 transition-opacity">
                          {t.garden.inspectTree}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* End of Path: Active Growing Tree Rooted in Present Moment */}
                {activeTree && (
                  <div className="relative flex flex-col items-center pl-4 border-l border-dashed border-stone-300/70 dark:border-night-border/70">
                    <div className="w-32 h-44 sm:w-36 sm:h-48 relative flex items-center justify-center">
                      <div className="absolute inset-4 rounded-full bg-earth-100/50 dark:bg-earth-950/40 blur-xl pointer-events-none" />
                      <ProceduralTreeRenderer
                        speciesId={activeTree.speciesId}
                        stage={activeTree.lifecycleStage}
                        journalCount={activeTree.journalCount}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="mt-1 flex flex-col items-center text-center">
                      <div className="px-3 py-1.5 rounded-2xl bg-earth-50/90 dark:bg-earth-950/80 backdrop-blur-md border border-earth-200/80 dark:border-earth-900/60 shadow-xs">
                        <span className="font-serif text-xs font-medium text-earth-800 dark:text-earth-200 block leading-tight flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-earth-600" />
                          {lang === 'ckb' ? 'ڕوواندنی ئێستا' : 'Present Cycle'}
                        </span>
                        <span className="text-[10px] text-earth-600/80 dark:text-earth-400 font-serif block">
                          {activeTree.lifecycleStage === 'seed'
                            ? t.tree.seed
                            : activeTree.lifecycleStage === 'sapling'
                            ? t.tree.sapling
                            : t.tree.mature}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Continuous Ground Walking Path Bar */}
              <div className="h-3 w-full rounded-full bg-gradient-to-r from-[#B9A38F] via-[#A8927F] to-[#988270] dark:from-[#242F27] dark:via-[#1F2721] dark:to-[#171E19] border-t border-earth-200/40 dark:border-night-border/40 mt-1 shadow-inner" />
            </div>
          </div>
        )}
      </div>

      {/* Selected Past Tree Modal / Retrospective */}
      {selectedTree && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 dark:bg-black/60 backdrop-blur-xs animate-soft-fade-up">
          <div className="w-full max-w-sm bg-white dark:bg-night-surface rounded-3xl shadow-calm-lg border border-stone-200/80 dark:border-night-border p-6 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-wider text-sage-600">
                {t.garden.speciesEarned}
              </span>
              <button
                onClick={() => setSelectedTree(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <div className="h-44 w-full flex items-center justify-center bg-stone-50 dark:bg-night-card rounded-2xl p-2">
              <ProceduralTreeRenderer
                speciesId={selectedTree.speciesId}
                stage="mature"
                journalCount={selectedTree.journalCount}
              />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-serif text-lg font-medium text-stone-800 dark:text-stone-100">
                {lang === 'ckb'
                  ? SPECIES_CATALOG[selectedTree.speciesId]?.kurdishName || selectedTree.speciesName
                  : selectedTree.speciesName}
              </h3>
              <p className="text-xs text-stone-500 font-light">
                {lang === 'ckb'
                  ? SPECIES_CATALOG[selectedTree.speciesId]?.earnedReasonCkb || selectedTree.earnedReason
                  : selectedTree.earnedReason}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-2xl bg-stone-50 dark:bg-night-card text-xs">
              <div>
                <span className="text-[10px] text-stone-400 block">{t.tree.daysTended}</span>
                <span className="font-serif font-medium text-stone-800 dark:text-stone-200">
                  {selectedTree.daysTended}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 block">{t.tree.roots}</span>
                <span className="font-serif font-medium text-earth-700 dark:text-earth-400">
                  {selectedTree.journalCount}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 block">{t.tree.rings}</span>
                <span className="font-serif font-medium text-sage-700 dark:text-sage-400">
                  {selectedTree.ringsCount}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedTree(null)}
              className="w-full py-2.5 rounded-2xl bg-stone-100 dark:bg-night-card hover:bg-stone-200 text-stone-800 dark:text-stone-200 font-serif text-xs transition-colors"
            >
              {t.recap.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
