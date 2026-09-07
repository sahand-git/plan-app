import React, { useState } from 'react';
import type { GardenTree } from '../../db';
import { ProceduralTreeRenderer } from '../tree/ProceduralTreeRenderer';
import { SPECIES_CATALOG } from '../tree/speciesData';
import { translations, type AppLanguage } from '../../utils/i18n';
import { Share2, Calendar, Sparkles, Disc, Info, ArrowLeft, Filter } from 'lucide-react';

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

  const matureTrees = gardenTrees.filter((tree) => tree.status === 'mature');

  const filteredTrees = matureTrees.filter((tree) => {
    if (categoryFilter === 'all') return true;
    const spec = SPECIES_CATALOG[tree.speciesId];
    return spec?.category === categoryFilter;
  });

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
      <div className="space-y-3">
        <h3 className="font-serif text-sm font-medium text-stone-700 dark:text-stone-300">
          {t.garden.pastGrove} ({filteredTrees.length})
        </h3>

        {filteredTrees.length === 0 ? (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredTrees.map((tree) => {
              const spec = SPECIES_CATALOG[tree.speciesId] || SPECIES_CATALOG.noble_pine;
              const title = lang === 'ckb' ? spec.kurdishName : spec.name;
              const reason = lang === 'ckb' ? spec.earnedReasonCkb : spec.earnedReasonEn;

              return (
                <div
                  key={tree.id || tree.cycleStart}
                  onClick={() => setSelectedTree(tree)}
                  className="p-4 rounded-3xl bg-white dark:bg-night-card border border-stone-200/70 dark:border-night-border shadow-xs hover:shadow-calm transition-all cursor-pointer group flex flex-col justify-between space-y-3 active:scale-98"
                >
                  <div className="h-32 w-full flex items-center justify-center relative p-2 bg-stone-50/70 dark:bg-night-surface/50 rounded-2xl">
                    <ProceduralTreeRenderer
                      speciesId={tree.speciesId}
                      stage="mature"
                      journalCount={tree.journalCount}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-sm font-medium text-stone-800 dark:text-stone-100 group-hover:text-sage-700 transition-colors">
                        {title}
                      </h4>
                      <span className="text-[10px] uppercase font-serif text-sage-600 dark:text-sage-400">
                        {spec.category}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 font-light">
                      {reason}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-100 dark:border-night-border flex items-center justify-between text-[10px] text-stone-400 font-serif">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {tree.cycleStart}
                    </span>
                    <span className="flex items-center gap-1">
                      <Disc className="w-3 h-3" />
                      {tree.ringsCount} {t.tree.rings.toLowerCase()}
                    </span>
                  </div>
                </div>
              );
            })}
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
