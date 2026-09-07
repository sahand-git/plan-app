import React from 'react';
import { Smartphone, Apple, Sparkles, Moon, Sun, Languages } from 'lucide-react';
import { isRtl, type AppLanguage } from '../../utils/i18n';

export type PlatformMode = 'ios' | 'android' | 'responsive';

interface PlatformShellProps {
  platformMode: PlatformMode;
  onSelectPlatform: (mode: PlatformMode) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  noPressureMode: boolean;
  onToggleNoPressure: () => void;
  lang?: AppLanguage;
  onToggleLang?: () => void;
  children: React.ReactNode;
}

export const PlatformShell: React.FC<PlatformShellProps> = ({
  platformMode,
  onSelectPlatform,
  isDark,
  onToggleTheme,
  noPressureMode,
  onToggleNoPressure,
  lang = 'en',
  onToggleLang,
  children,
}) => {
  const rtl = isRtl(lang);

  return (
    <div
      dir={rtl ? 'rtl' : 'ltr'}
      className={`min-h-screen flex flex-col bg-stone-100 dark:bg-stone-950 transition-colors duration-500 ${
        rtl ? 'font-sans text-right' : ''
      }`}
    >
      {/* Top Designer Toolbar (Platform Switcher & Design System Controls) */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-night-surface/80 backdrop-blur-md border-b border-stone-200/60 dark:border-night-border px-4 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-medium text-stone-800 dark:text-stone-100 text-sm tracking-wide">
              The Tree Planner
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-sage-100 dark:bg-night-card text-sage-700 dark:text-sage-300 text-[10px] font-medium">
              v1.0 One-Time Paid
            </span>
          </div>

          {/* Platform Mockup Switcher */}
          <div className="flex items-center p-0.5 bg-stone-100 dark:bg-night-card rounded-xl border border-stone-200/70 dark:border-night-border">
            <button
              onClick={() => onSelectPlatform('ios')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                platformMode === 'ios'
                  ? 'bg-white dark:bg-night-surface text-stone-900 dark:text-stone-100 shadow-xs font-medium'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <Apple className="w-3.5 h-3.5" />
              <span>iOS 18</span>
            </button>
            <button
              onClick={() => onSelectPlatform('android')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                platformMode === 'android'
                  ? 'bg-white dark:bg-night-surface text-stone-900 dark:text-stone-100 shadow-xs font-medium'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android M3</span>
            </button>
            <button
              onClick={() => onSelectPlatform('responsive')}
              className={`px-3 py-1 rounded-lg transition-all hidden md:inline-block ${
                platformMode === 'responsive'
                  ? 'bg-white dark:bg-night-surface text-stone-900 dark:text-stone-100 shadow-xs font-medium'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              Full Screen
            </button>
          </div>
        </div>

        {/* Global Controls: Language, No-Pressure Mode & Theme Toggle */}
        <div className="flex items-center gap-2">
          {onToggleLang && (
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-medium border border-stone-200/70 dark:border-night-border bg-stone-100/70 dark:bg-night-card text-stone-700 dark:text-stone-300 hover:bg-stone-200/60 transition-all shadow-xs"
              title="Toggle Language: English / کوردی سۆرانی"
            >
              <Languages className="w-3.5 h-3.5 text-sage-600" />
              <span>{lang === 'ckb' ? 'کوردی' : 'English'}</span>
            </button>
          )}

          <button
            onClick={onToggleNoPressure}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] transition-all border ${
              noPressureMode
                ? 'bg-sage-100 dark:bg-sage-950/60 border-sage-300 dark:border-sage-800 text-sage-800 dark:text-sage-200 font-medium'
                : 'bg-transparent border-transparent text-stone-500 hover:bg-stone-200/50 dark:hover:bg-night-card'
            }`}
            title="Toggle No-Pressure Mode (hides all numbers and streaks)"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">No-Pressure Mode:</span>
            <span>{noPressureMode ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-xl text-stone-500 hover:bg-stone-200/60 dark:hover:bg-night-card transition-colors"
            title="Toggle Dark / Light Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Display Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-0 sm:p-6 overflow-x-hidden">
        {platformMode === 'ios' ? (
          /* iOS 18 iPhone Mockup Frame */
          <div className="relative w-full max-w-[390px] h-[844px] bg-parchment dark:bg-night-bg rounded-[50px] shadow-2xl border-[10px] border-stone-800 dark:border-stone-700 overflow-hidden flex flex-col my-auto transition-all">
            {/* Dynamic Island */}
            <div className="absolute top-2.5 inset-x-0 z-30 flex justify-center pointer-events-none">
              <div className="w-28 h-7 bg-black rounded-full flex items-center justify-between px-3 text-[10px] text-white">
                <div className="w-2 h-2 rounded-full bg-stone-900 border border-stone-800" />
                <span className="text-[9px] text-stone-400 font-mono tracking-tighter">9:41</span>
                <div className="w-2 h-2 rounded-full bg-green-500/80" />
              </div>
            </div>

            {/* iOS Screen Viewport */}
            <div className="flex-1 flex flex-col overflow-y-auto pt-10 pb-6 relative scrollbar-none">
              {children}
            </div>

            {/* iOS Home Indicator */}
            <div className="absolute bottom-1 inset-x-0 z-30 flex justify-center pointer-events-none py-1.5">
              <div className="w-32 h-1 bg-stone-400/80 dark:bg-stone-600 rounded-full" />
            </div>
          </div>
        ) : platformMode === 'android' ? (
          /* Android Material 3 Pixel Frame */
          <div className="relative w-full max-w-[395px] h-[850px] bg-parchment dark:bg-night-bg rounded-[40px] shadow-2xl border-[8px] border-stone-700 dark:border-stone-800 overflow-hidden flex flex-col my-auto transition-all">
            {/* Android Center Camera Punch Hole */}
            <div className="absolute top-3 inset-x-0 z-30 flex justify-center pointer-events-none">
              <div className="w-3.5 h-3.5 bg-black rounded-full border border-stone-900 shadow-inner" />
            </div>

            {/* Android M3 Screen Viewport */}
            <div className="flex-1 flex flex-col overflow-y-auto pt-8 pb-5 relative scrollbar-none">
              {children}
            </div>

            {/* Android Gesture Pill Bar */}
            <div className="absolute bottom-1.5 inset-x-0 z-30 flex justify-center pointer-events-none py-1">
              <div className="w-20 h-1 bg-stone-500/70 dark:bg-stone-500 rounded-full" />
            </div>
          </div>
        ) : (
          /* Responsive Mode */
          <div className="w-full max-w-lg min-h-[800px] bg-parchment dark:bg-night-bg rounded-3xl shadow-calm-lg border border-stone-200/70 dark:border-night-border overflow-hidden flex flex-col my-auto">
            <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6">
              {children}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
