import React, { useState } from 'react';
import { Sprout, Check, Plus, Sparkles, X } from 'lucide-react';
import { db } from '../../db';

interface DailyRhythmSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onHabitsSaved?: () => void;
}

const PRESET_HABITS = [
  { id: 'water', title: 'Morning hydration', note: 'Start with a quiet glass of water' },
  { id: 'walk', title: '15-minute nature walk', note: 'Step outside and breathe fresh air' },
  { id: 'read', title: 'Mindful reading', note: 'A few quiet pages with a book' },
  { id: 'stretch', title: 'Gentle stretching', note: 'Release tension with slow ease' },
  { id: 'evening', title: 'Evening reflection', note: 'Two mindful minutes before rest' },
];

export const DailyRhythmSetupModal: React.FC<DailyRhythmSetupModalProps> = ({
  isOpen,
  onClose,
  onHabitsSaved,
}) => {
  const [selected, setSelected] = useState<string[]>(['water', 'walk', 'read']);
  const [customTitle, setCustomTitle] = useState('');
  const [customList, setCustomList] = useState<string[]>([]);

  if (!isOpen) return null;

  const togglePreset = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    setCustomList((prev) => [...prev, customTitle.trim()]);
    setCustomTitle('');
  };

  const removeCustom = (index: number) => {
    setCustomList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveRhythm = async () => {
    try {
      const timestamp = new Date().toISOString();
      const existingHabits = await db.habits.toArray();
      const existingTitles = new Set(existingHabits.map((h) => h.title.trim().toLowerCase()));

      // Add selected presets
      for (const id of selected) {
        const preset = PRESET_HABITS.find((p) => p.id === id);
        if (preset && !existingTitles.has(preset.title.trim().toLowerCase())) {
          await db.habits.add({
            title: preset.title,
            createdAt: timestamp,
            targetDays: [],
          });
          existingTitles.add(preset.title.trim().toLowerCase());
        }
      }

      // Add custom habits
      for (const title of customList) {
        if (title.trim() && !existingTitles.has(title.trim().toLowerCase())) {
          await db.habits.add({
            title: title.trim(),
            createdAt: timestamp,
            targetDays: [],
          });
          existingTitles.add(title.trim().toLowerCase());
        }
      }

      localStorage.setItem('treeplanner_onboarded', 'true');
      onHabitsSaved?.();
      onClose();
    } catch (err) {
      console.error('Error saving daily rhythm habits:', err);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-soft-fade-up">
      <div className="w-full max-w-lg bg-parchment-subtle dark:bg-night-surface rounded-3xl p-6 sm:p-7 shadow-calm-lg border border-stone-200/80 dark:border-night-border space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sage-100 dark:bg-night-card flex items-center justify-center text-sage-700 dark:text-sage-400">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-medium tracking-wider uppercase text-sage-600 dark:text-sage-400">
                Daily Anchor Routines
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-medium text-stone-800 dark:text-stone-100">
                Set Your Daily Rhythm
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-night-card transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Botanical Philosophy Note */}
        <div className="p-3.5 rounded-2xl bg-sage-50/70 dark:bg-night-card/60 border border-sage-200/60 dark:border-night-border text-xs text-sage-800 dark:text-stone-300 leading-relaxed font-light flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-sage-600 dark:text-sage-400 shrink-0 mt-0.5" />
          <p>
            Your daily habits nurture the <strong>trunk and branches</strong> of your tree. Checking them daily guides your tree from a <em>tender seed</em> into a <em>young sapling</em>, and finally a <em>majestic mature tree</em>.
          </p>
        </div>

        {/* Preset Habits Selection */}
        <div className="space-y-2">
          <span className="text-xs text-stone-400 font-medium block">
            Select 2 to 4 gentle anchor habits:
          </span>
          <div className="space-y-2">
            {PRESET_HABITS.map((habit) => {
              const isChecked = selected.includes(habit.id);
              return (
                <button
                  key={habit.id}
                  type="button"
                  onClick={() => togglePreset(habit.id)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between ${
                    isChecked
                      ? 'bg-white dark:bg-night-card border-sage-500/70 shadow-xs'
                      : 'bg-stone-50/60 dark:bg-night-surface/50 border-stone-200/60 dark:border-night-border hover:bg-white dark:hover:bg-night-card'
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

        {/* Custom Habit Input */}
        <div className="space-y-2 pt-1">
          <span className="text-xs text-stone-400 font-medium block">
            Or create a custom habit:
          </span>
          <form onSubmit={handleAddCustom} className="flex gap-2">
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="e.g. 10 mins meditation, sketch..."
              className="flex-1 px-3.5 py-2.5 rounded-2xl bg-white dark:bg-night-card border border-stone-200 dark:border-night-border text-sm text-stone-800 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-sage-500 transition-all"
            />
            <button
              type="submit"
              disabled={!customTitle.trim()}
              className="px-3.5 py-2.5 rounded-2xl bg-stone-100 dark:bg-night-card hover:bg-sage-100 dark:hover:bg-night-border text-stone-700 dark:text-stone-200 text-sm font-medium transition-all disabled:opacity-40 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </form>

          {/* Custom list chips */}
          {customList.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {customList.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage-50 dark:bg-night-card border border-sage-200/70 dark:border-night-border text-xs text-sage-800 dark:text-stone-300"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeCustom(idx)}
                    className="text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleSaveRhythm}
            className="w-full py-3.5 px-4 rounded-2xl bg-sage-600 hover:bg-sage-700 active:scale-[0.99] text-white font-medium text-sm transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Sprout className="w-4 h-4" />
            <span>Nurture My Tree with These Habits</span>
          </button>
        </div>
      </div>
    </div>
  );
};
