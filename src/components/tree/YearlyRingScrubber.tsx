import React, { useState } from 'react';
import { Disc, ChevronLeft, ChevronRight } from 'lucide-react';

interface YearlyRingScrubberProps {
  currentWeek?: number;
  totalWeeksAccumulated: number;
  onClose: () => void;
}

export const YearlyRingScrubber: React.FC<YearlyRingScrubberProps> = ({
  totalWeeksAccumulated = 12,
  onClose,
}) => {
  // Clamp total rings between 1 and 52
  const maxRings = Math.max(1, Math.min(52, totalWeeksAccumulated));
  const [selectedRing, setSelectedRing] = useState<number>(maxRings);

  // Simulated historical reflection data per ring
  const getRingHistory = (ringNum: number) => {
    const isWiltedWeek = ringNum % 7 === 0;
    const isFlourishingWeek = ringNum % 3 === 0;
    return {
      weekNumber: ringNum,
      daysTended: isWiltedWeek ? 3 : isFlourishingWeek ? 7 : 5,
      careRate: isWiltedWeek ? 45 : isFlourishingWeek ? 92 : 74,
      journalEntries: Math.min(7, (ringNum * 2) % 6 + 1),
      canopyState: (isWiltedWeek ? 'Seasonal Rest' : isFlourishingWeek ? 'Flourishing' : 'Balanced Canopy') as string,
      note: isWiltedWeek
        ? 'A quiet rest week. Roots absorbed nourishment quietly.'
        : isFlourishingWeek
        ? 'A deep, vibrant week of mindful presence.'
        : 'Steady harmony with unhurried daily pace.',
    };
  };

  const history = getRingHistory(selectedRing);

  return (
    <div className="w-full flex flex-col items-center animate-soft-fade-up">
      {/* Header Banner */}
      <div className="w-full max-w-sm flex items-center justify-between mb-3 px-2 text-xs">
        <div className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
          <Disc className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400" />
          <span className="font-serif font-medium">Tree Trunk Rings (Dendrochronology)</span>
        </div>
        <div className="text-[11px] text-stone-400">
          {maxRings} {maxRings === 1 ? 'ring' : 'rings'} recorded
        </div>
      </div>

      {/* Cross-Section Tree Rings SVG */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full p-2 border border-stone-200/80 dark:border-night-border shadow-calm bg-gradient-to-tr from-[#E6D7CB] via-[#F4ECE4] to-[#EAE0D5] dark:from-[#242C25] dark:via-[#1D241E] dark:to-[#171C18] flex items-center justify-center select-none overflow-hidden">
        {/* Outer Bark Rim */}
        <div className="absolute inset-0 rounded-full border-[6px] border-[#5B4A3E] dark:border-[#3E3228] opacity-90" />

        <svg viewBox="0 0 240 240" className="w-full h-full overflow-visible">
          <defs>
            <radialGradient id="ringHeartwood" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#8A624D" />
              <stop offset="40%" stopColor="#A87C64" />
              <stop offset="100%" stopColor="#BD9E8C" />
            </radialGradient>
          </defs>

          {/* Heartwood Center Core (Week 1 Genesis) */}
          <circle cx="120" cy="120" r="14" fill="url(#ringHeartwood)" />

          {/* Concentric Weekly Growth Rings */}
          {Array.from({ length: Math.min(24, maxRings) }).map((_, i) => {
            const ringIndex = i + 1;
            const radius = 14 + (ringIndex / Math.min(24, maxRings)) * 88;
            const isSelected = selectedRing === ringIndex;

            return (
              <circle
                key={ringIndex}
                cx="120"
                cy="120"
                r={radius}
                fill="none"
                stroke={isSelected ? '#5A735E' : '#7D6433'}
                strokeWidth={isSelected ? '2.5' : '1'}
                strokeDasharray={isSelected ? 'none' : '3, 2'}
                opacity={isSelected ? 1 : 0.4}
                className="transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedRing(ringIndex)}
              />
            );
          })}

          {/* Selected Ring Highlight Marker */}
          {selectedRing > 0 && (
            <circle
              cx="120"
              cy={120 - (14 + (selectedRing / Math.min(24, maxRings)) * 88)}
              r="4"
              fill="#5A735E"
            />
          )}
        </svg>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500 dark:text-stone-400">
            Week
          </span>
          <span className="text-xl font-serif font-bold text-stone-800 dark:text-stone-100">
            {selectedRing}
          </span>
        </div>
      </div>

      {/* Interactive Week Scrubber Slider */}
      <div className="w-full max-w-xs mt-4 space-y-1.5 px-2">
        <div className="flex items-center justify-between text-xs text-stone-500">
          <button
            onClick={() => setSelectedRing((r: number) => Math.max(1, r - 1))}
            disabled={selectedRing <= 1}
            className="p-1 rounded-lg hover:bg-stone-200/50 dark:hover:bg-night-card disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-serif font-medium text-stone-700 dark:text-stone-200">
            Scrubbing Past Rings (Week {selectedRing} of {maxRings})
          </span>

          <button
            onClick={() => setSelectedRing((r: number) => Math.min(maxRings, r + 1))}
            disabled={selectedRing >= maxRings}
            className="p-1 rounded-lg hover:bg-stone-200/50 dark:hover:bg-night-card disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <input
          type="range"
          min={1}
          max={maxRings}
          value={selectedRing}
          onChange={(e) => setSelectedRing(Number(e.target.value))}
          className="w-full accent-sage-600 cursor-pointer h-1.5 bg-stone-200 dark:bg-night-card rounded-lg"
        />
      </div>

      {/* Historical Record of Selected Ring */}
      <div className="mt-3 w-full max-w-sm p-3.5 rounded-2xl bg-white dark:bg-night-surface border border-stone-200/70 dark:border-night-border shadow-xs text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-serif font-medium text-stone-800 dark:text-stone-100">
            Week {history.weekNumber} Archive
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-sage-100 dark:bg-night-card text-sage-700 dark:text-sage-300 font-medium">
            {history.canopyState}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-2 rounded-xl bg-stone-50 dark:bg-night-card/60">
            <span className="text-[10px] text-stone-400 block">Days Tended</span>
            <span className="font-serif font-medium text-stone-700 dark:text-stone-200">
              {history.daysTended} of 7 days
            </span>
          </div>
          <div className="p-2 rounded-xl bg-stone-50 dark:bg-night-card/60">
            <span className="text-[10px] text-stone-400 block">Journal Rooted</span>
            <span className="font-serif font-medium text-stone-700 dark:text-stone-200">
              {history.journalEntries} entries
            </span>
          </div>
        </div>

        <p className="text-[11px] font-serif italic text-stone-500 dark:text-stone-400 pt-1">
          "{history.note}"
        </p>
      </div>

      {/* Close/Return Button */}
      <button
        onClick={onClose}
        className="mt-3 text-xs text-sage-700 dark:text-sage-400 hover:text-sage-800 underline underline-offset-4"
      >
        Return to Surface Canopy
      </button>
    </div>
  );
};
