import React, { useState } from 'react';
import { Sprout, Check, ArrowRight } from 'lucide-react';
import { db } from '../../db';

interface CalmOnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

const STARTER_HABITS = [
  { id: 'water', title: 'Morning hydration', note: 'Start with a quiet glass of water' },
  { id: 'walk', title: '15-minute nature walk', note: 'Step outside and breathe fresh air' },
  { id: 'read', title: 'Read a few pages', note: 'Quiet moments with a book' },
  { id: 'evening', title: 'Evening reflection', note: 'Two mindful minutes before sleep' },
];

export const CalmOnboardingModal: React.FC<CalmOnboardingModalProps> = ({
  isOpen,
  onComplete,
}) => {
  const [selected, setSelected] = useState<string[]>(['water', 'walk']);

  if (!isOpen) return null;

  const toggleHabit = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleFinish = async () => {
    const timestamp = new Date().toISOString();
    for (const id of selected) {
      const habit = STARTER_HABITS.find((h) => h.id === id);
      if (habit) {
        await db.habits.add({
          title: habit.title,
          createdAt: timestamp,
          targetDays: [],
        });
      }
    }
    localStorage.setItem('treeplanner_onboarded', 'true');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-md animate-soft-fade-up">
      <div className="w-full max-w-md bg-parchment-subtle dark:bg-night-surface rounded-3xl p-6 sm:p-8 shadow-calm-lg border border-stone-200/80 dark:border-night-border space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-sage-100 dark:bg-night-card mx-auto flex items-center justify-center text-sage-600 dark:text-sage-400">
            <Sprout className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-2xl font-medium text-stone-800 dark:text-stone-100">
            Welcome to The Tree Planner
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-light leading-relaxed max-w-xs mx-auto">
            An exhale from cluttered, noisy task apps. Gentle structure without pressure or performance anxiety.
          </p>
        </div>

        <div className="space-y-2">
          <span className="text-xs text-stone-400 font-medium block">
            Choose 1 to 3 starter habits to plant:
          </span>
          <div className="space-y-2">
            {STARTER_HABITS.map((habit) => {
              const isChecked = selected.includes(habit.id);
              return (
                <button
                  key={habit.id}
                  type="button"
                  onClick={() => toggleHabit(habit.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                    isChecked
                      ? 'bg-white dark:bg-night-card border-sage-500/70 shadow-xs'
                      : 'bg-stone-50/50 dark:bg-night-surface/50 border-stone-200/60 dark:border-night-border hover:bg-white'
                  }`}
                >
                  <div>
                    <span className="text-sm font-medium text-stone-800 dark:text-stone-100 block">
                      {habit.title}
                    </span>
                    <span className="text-xs text-stone-400 font-light">{habit.note}</span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      isChecked
                        ? 'bg-sage-600 text-white'
                        : 'border border-stone-300 dark:border-stone-600'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-stone-100/70 dark:bg-night-card/50 border border-stone-200/50 dark:border-night-border text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed text-center font-serif italic">
          "Your tree updates once daily at day’s end. It will never shame you if you take time away."
        </div>

        <button
          onClick={handleFinish}
          className="w-full py-3.5 px-4 rounded-2xl bg-sage-600 hover:bg-sage-700 active:scale-[0.99] text-white font-medium text-sm transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <span>Begin With Calm</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
