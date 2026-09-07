import React from 'react';
import { X, Sparkles, Compass, ShieldCheck, Moon } from 'lucide-react';
import type { TreeState, TreeDayLog } from '../../db';

interface TreeStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentState: TreeState;
  noPressureMode: boolean;
  weekDaysTended: number; // 0 - 7
  completionRate: number; // 0 - 100
  recentLogs: TreeDayLog[];
  onTriggerEveningReflection: () => void;
}

export const TreeStatsModal: React.FC<TreeStatsModalProps> = ({
  isOpen,
  onClose,
  currentState,
  noPressureMode,
  weekDaysTended,
  completionRate,
  onTriggerEveningReflection,
}) => {
  if (!isOpen) return null;

  const statePoetry: Record<TreeState, { title: string; poem: string }> = {
    seedling: {
      title: 'Rooted Sprout',
      poem: 'Every tall canopy began in the quiet earth. You are grounded and starting fresh.',
    },
    sapling: {
      title: 'Steady Sapling',
      poem: 'Reaching upward with gentle patience. Growth happens in unseen, quiet moments.',
    },
    foliage: {
      title: 'Balanced Canopy',
      poem: 'Leaves swaying in harmony with your week. You have tended to what mattered without rush.',
    },
    flourishing: {
      title: 'Flourishing Presence',
      poem: 'Deep roots and generous shade. A week of consistent care and peaceful rhythm.',
    },
    gentle_wilt: {
      title: 'Seasonal Pause',
      poem: 'The plant rests when the weather pauses. There is no guilt in resting; tomorrow brings fresh rain.',
    },
  };

  const dayLetters = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/40 dark:bg-black/60 backdrop-blur-sm animate-soft-fade-up">
      <div
        className="w-full max-w-md bg-parchment-subtle dark:bg-night-surface rounded-t-3xl sm:rounded-3xl shadow-calm-lg border border-stone-200/70 dark:border-night-border overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* iOS Drag Handle */}
        <div className="w-12 h-1.5 bg-stone-300 dark:bg-stone-600 rounded-full mx-auto mt-3 mb-1 sm:hidden" />

        {/* Header */}
        <div className="px-6 pt-4 pb-3 flex items-center justify-between border-b border-stone-200/50 dark:border-night-border">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-sage-600 dark:text-sage-400" />
            <h3 className="font-serif text-lg font-medium text-stone-800 dark:text-stone-100">
              The Botanical Mirror
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200/50 dark:hover:bg-night-card text-stone-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Current State Card */}
          <div className="bg-white dark:bg-night-card rounded-2xl p-5 border border-stone-200/60 dark:border-night-border/80 shadow-calm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider uppercase text-sage-600 dark:text-sage-400">
                Weekly Reflection
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-stone-400">
                <Sparkles className="w-3.5 h-3.5 text-sage-500" />
                No dopamine loops
              </span>
            </div>

            <h4 className="font-serif text-xl text-stone-800 dark:text-stone-100 mt-2">
              {statePoetry[currentState].title}
            </h4>
            <p className="text-sm text-stone-600 dark:text-stone-300 mt-2 font-serif italic leading-relaxed">
              "{statePoetry[currentState].poem}"
            </p>
          </div>

          {/* 7-Day Weekly Rhythm Pebbles (No shame, just gentle presence) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
              <span>This Week's Horizon</span>
              <span>{noPressureMode ? 'In rhythm' : `${weekDaysTended} of 7 days tended`}</span>
            </div>
            <div className="grid grid-cols-7 gap-2 pt-1">
              {dayLetters.map((d, index) => {
                const isTended = index < weekDaysTended;
                return (
                  <div key={index} className="flex flex-col items-center gap-1.5">
                    <span className="text-[11px] text-stone-400 dark:text-stone-400 font-medium">
                      {d}
                    </span>
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
                        isTended
                          ? 'bg-sage-600 text-white shadow-sm'
                          : 'bg-stone-100 dark:bg-night-card border border-stone-200/80 dark:border-night-border text-stone-400'
                      }`}
                    >
                      {isTended ? (
                        <div className="w-2 h-2 rounded-full bg-sage-200" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-stone-600" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Calm Quantitative vs Qualitative Stats */}
          {!noPressureMode ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-stone-100/70 dark:bg-night-card/70 border border-stone-200/60 dark:border-night-border">
                <span className="text-xs text-stone-500 dark:text-stone-400">Weekly Care Rate</span>
                <p className="text-2xl font-serif font-semibold text-stone-800 dark:text-stone-100 mt-1">
                  {Math.round(completionRate)}%
                </p>
                <span className="text-[11px] text-stone-400 mt-0.5 block">measured gently</span>
              </div>
              <div className="p-4 rounded-2xl bg-stone-100/70 dark:bg-night-card/70 border border-stone-200/60 dark:border-night-border">
                <span className="text-xs text-stone-500 dark:text-stone-400">Rhythm Status</span>
                <p className="text-base font-serif font-medium text-sage-700 dark:text-sage-300 mt-1">
                  Steady & Grounded
                </p>
                <span className="text-[11px] text-stone-400 mt-0.5 block">zero streak loss anxiety</span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-sage-50/70 dark:bg-night-card/80 border border-sage-200/50 dark:border-night-border flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-sage-600 dark:text-sage-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-sm font-medium text-sage-900 dark:text-sage-200">
                  No-Pressure Mode Active
                </h5>
                <p className="text-xs text-sage-700 dark:text-stone-300 mt-0.5 leading-relaxed">
                  Numeric percentages and streaks are hidden. The tree alone serves as your gentle, organic mirror.
                </p>
              </div>
            </div>
          )}

          {/* The Once-Daily Mechanic Notice */}
          <div className="p-4 rounded-2xl bg-earth-50/70 dark:bg-night-surface border border-earth-200/40 dark:border-night-border space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-earth-700 dark:text-stone-300">
              <Moon className="w-4 h-4 text-earth-600 dark:text-stone-300" />
              <span>The Once-Daily Principle</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
              Unlike game apps that ping your brain on every checkmark, this tree updates strictly once per day at day's end.
              Your work takes quiet root overnight while you rest.
            </p>
          </div>

          {/* Evening Reflection Trigger Button */}
          <button
            onClick={() => {
              onClose();
              onTriggerEveningReflection();
            }}
            className="w-full py-3 px-4 rounded-2xl bg-sage-600 hover:bg-sage-700 active:scale-[0.99] text-white font-medium text-sm transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Moon className="w-4 h-4" />
            <span>Simulate Day's End Reflection</span>
          </button>
        </div>
      </div>
    </div>
  );
};
