import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import {
  formatFriendlyDate,
  formatDateString,
  parseDateString,
  addDays,
  subDays,
  isToday
} from '../utils/date';

interface DateNavigatorProps {
  currentDate: string;
  onSelectDate: (date: string) => void;
}

export const DateNavigator: React.FC<DateNavigatorProps> = ({
  currentDate,
  onSelectDate,
}) => {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const parsed = parseDateString(currentDate);
  const isCurrentDayToday = isToday(parsed);

  const handlePrev = () => {
    onSelectDate(formatDateString(subDays(parsed, 1)));
  };

  const handleNext = () => {
    onSelectDate(formatDateString(addDays(parsed, 1)));
  };

  const handleToday = () => {
    onSelectDate(formatDateString(new Date()));
  };

  return (
    <div className="flex items-center justify-between gap-2 py-3 px-1">
      {/* Date Navigation & Friendly Label */}
      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={handlePrev}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Date label with hidden native datepicker trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => dateInputRef.current?.showPicker?.() || dateInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold tracking-tight hover:bg-slate-100 dark:hover:bg-slate-800/80 transition"
            title="Click to jump to date"
          >
            <CalendarIcon className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>{formatFriendlyDate(currentDate)}</span>
          </button>
          <input
            ref={dateInputRef}
            type="date"
            value={currentDate}
            onChange={(e) => e.target.value && onSelectDate(e.target.value)}
            className="absolute inset-0 opacity-0 pointer-events-none w-0 h-0"
            tabIndex={-1}
          />
        </div>
      </div>

      {/* "Today" button if not currently viewing today */}
      {!isCurrentDayToday && (
        <button
          type="button"
          onClick={handleToday}
          className="px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/60 dark:border-indigo-800/50 rounded-lg transition"
        >
          Jump to Today
        </button>
      )}
    </div>
  );
};
