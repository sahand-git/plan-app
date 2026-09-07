import React, { useState } from 'react';
import { Sparkles, ArrowRight, Sunset } from 'lucide-react';
import type { TreeState } from '../../db';

interface DayEndTransitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasksCompleted: number;
  tasksTotal: number;
  habitsCompleted: number;
  habitsTotal: number;
  onApplyTransition: (nextState: TreeState) => void;
}

export const DayEndTransitionModal: React.FC<DayEndTransitionModalProps> = ({
  isOpen,
  onClose,
  tasksCompleted,
  tasksTotal,
  habitsCompleted,
  habitsTotal,
  onApplyTransition,
}) => {
  if (!isOpen) return null;

  const totalActions = tasksTotal + habitsTotal;
  const completedActions = tasksCompleted + habitsCompleted;
  const rate = totalActions > 0 ? completedActions / totalActions : 1.0;

  let projectedState: TreeState = 'foliage';
  let message = 'Your day was balanced and steady. The canopy retains its vibrant shade.';
  let stateTitle = 'Balanced Canopy';

  if (totalActions > 0 && completedActions === 0) {
    projectedState = 'gentle_wilt';
    stateTitle = 'Gentle Rest (Wilt)';
    message = 'Today was a quiet pause. The leaves droop softly in resting posture. There is zero failure here; tomorrow recovers fully.';
  } else if (rate >= 0.8) {
    projectedState = 'flourishing';
    stateTitle = 'Flourishing Growth';
    message = 'Generous care today has enriched the roots. The canopy flourishes in peaceful abundance.';
  } else if (rate >= 0.5) {
    projectedState = 'foliage';
    stateTitle = 'Balanced Canopy';
    message = 'A grounded, attentive day. Your tree stands calm and green.';
  } else {
    projectedState = 'sapling';
    stateTitle = 'Young Sapling';
    message = 'Tender steps were taken. The branches stretch gently for tomorrow’s light.';
  }

  const [selectedScenario, setSelectedScenario] = useState<TreeState>(projectedState);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-md animate-soft-fade-up">
      <div className="w-full max-w-lg bg-parchment-subtle dark:bg-night-surface rounded-3xl shadow-calm-lg border border-stone-200/80 dark:border-night-border p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-earth-100 dark:bg-night-card flex items-center justify-center text-earth-600 dark:text-stone-300">
            <Sunset className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-earth-600 dark:text-stone-300 font-medium">
              Daily Transition Engine
            </span>
            <h3 className="font-serif text-xl font-medium text-stone-800 dark:text-stone-100">
              Day’s End Reflection
            </h3>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-night-card border border-stone-200/60 dark:border-night-border/70 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-sage-700 dark:text-sage-400">
            <Sparkles className="w-4 h-4" />
            <span>Anti-Dopamine Architecture</span>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            Standard productivity apps flash animations after every completed task to hook your brain.
            <strong className="text-stone-800 dark:text-stone-100 font-medium"> The Tree Planner</strong> updates
            strictly once per day at twilight. No compulsive checking, no slot machine behavior.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-stone-100/70 dark:bg-night-surface border border-stone-200/50 dark:border-night-border space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>Today's Mindful Care</span>
            <span>
              {completedActions} of {totalActions} items completed
            </span>
          </div>

          <div className="pt-2 border-t border-stone-200/50 dark:border-night-border">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-stone-400">Projected Tomorrow State:</span>
              <span className="font-serif text-sm font-semibold text-sage-700 dark:text-sage-300">
                {stateTitle}
              </span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 font-serif italic">
              "{message}"
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs text-stone-400 font-medium block">
            Test Tomorrow's Morning Posture:
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
            {(['flourishing', 'foliage', 'sapling', 'seedling', 'gentle_wilt'] as TreeState[]).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedScenario(st)}
                className={`py-2 px-1 text-xs rounded-xl border text-center transition-all ${
                  selectedScenario === st
                    ? 'bg-sage-600 text-white border-sage-600 shadow-sm font-medium'
                    : 'bg-white dark:bg-night-card border-stone-200 dark:border-night-border text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-night-border'
                }`}
              >
                {st === 'gentle_wilt' ? 'Wilt (Rest)' : st.charAt(0).toUpperCase() + st.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-2xl border border-stone-300 dark:border-night-border text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-night-card text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onApplyTransition(selectedScenario);
              onClose();
            }}
            className="flex-1 py-3 px-4 rounded-2xl bg-sage-600 hover:bg-sage-700 active:scale-[0.99] text-white font-medium text-sm transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span>Conclude Day & Transition</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
