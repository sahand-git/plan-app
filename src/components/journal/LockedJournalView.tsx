import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, ChevronLeft, ChevronRight, Shield, Check } from 'lucide-react';
import { format, parseISO, addDays, subDays } from 'date-fns';
import { db, saveDailyNote } from '../../db';
import { PinLockModal } from './PinLockModal';

interface LockedJournalViewProps {
  currentDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
}

export const LockedJournalView: React.FC<LockedJournalViewProps> = ({
  currentDate,
  onSelectDate,
}) => {
  const [content, setContent] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isLocked, setIsLocked] = useState(true);
  const [hasPin, setHasPin] = useState(false);
  const [pinHash, setPinHash] = useState<string | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinModalMode, setPinModalMode] = useState<'unlock' | 'setup'>('unlock');

  const saveTimerRef = useRef<number | null>(null);

  // Load PIN settings from localStorage / settings
  useEffect(() => {
    const savedPin = localStorage.getItem('treeplanner_journal_pin');
    if (savedPin) {
      setHasPin(true);
      setPinHash(savedPin);
      setIsLocked(true);
    } else {
      setHasPin(false);
      setIsLocked(false);
    }
  }, []);

  // Load daily note
  useEffect(() => {
    let isMounted = true;
    db.notes
      .where('date')
      .equals(currentDate)
      .first()
      .then((note) => {
        if (isMounted) {
          setContent(note?.content || '');
          setSaveStatus('idle');
        }
      });
    return () => {
      isMounted = false;
    };
  }, [currentDate]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setSaveStatus('saving');

    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = window.setTimeout(async () => {
      await saveDailyNote(currentDate, newContent);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 800);
  };

  const handleSetupPin = () => {
    setPinModalMode('setup');
    setShowPinModal(true);
  };

  const handleUnlockClick = () => {
    setPinModalMode('unlock');
    setShowPinModal(true);
  };

  const handlePinSuccess = () => {
    setShowPinModal(false);
    setIsLocked(false);
  };

  const handleSaveNewPin = (newHash: string) => {
    localStorage.setItem('treeplanner_journal_pin', newHash);
    setPinHash(newHash);
    setHasPin(true);
    setIsLocked(false);
  };

  const handleRemovePin = () => {
    if (window.confirm('Remove passcode lock from your daily journal?')) {
      localStorage.removeItem('treeplanner_journal_pin');
      setHasPin(false);
      setPinHash(null);
      setIsLocked(false);
    }
  };

  const formattedDate = format(parseISO(currentDate), 'EEEE, MMMM d, yyyy');
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-4 space-y-6">
      {/* Date & Privacy Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/60 dark:border-night-border">
        {/* Date Navigator */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectDate(format(subDays(parseISO(currentDate), 1), 'yyyy-MM-dd'))}
            className="p-1.5 rounded-xl hover:bg-stone-200/50 dark:hover:bg-night-card text-stone-500 transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-left">
            <h3 className="font-serif text-lg sm:text-xl font-medium text-stone-800 dark:text-stone-100">
              {formattedDate}
            </h3>
            <span className="text-xs text-stone-400 font-light">Daily Free-Write Sanctuary</span>
          </div>

          <button
            onClick={() => onSelectDate(format(addDays(parseISO(currentDate), 1), 'yyyy-MM-dd'))}
            className="p-1.5 rounded-xl hover:bg-stone-200/50 dark:hover:bg-night-card text-stone-500 transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Security Badge & Lock Controller */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {hasPin ? (
            <div className="flex items-center gap-1.5">
              {!isLocked && (
                <button
                  onClick={() => setIsLocked(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-night-card hover:bg-stone-200/70 rounded-xl transition-all"
                  title="Lock journal now"
                >
                  <Lock className="w-3.5 h-3.5 text-stone-500" />
                  <span>Lock Now</span>
                </button>
              )}
              <button
                onClick={handleRemovePin}
                className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 underline underline-offset-2 ml-1"
              >
                Change PIN
              </button>
            </div>
          ) : (
            <button
              onClick={handleSetupPin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-sage-700 dark:text-sage-300 bg-sage-50 dark:bg-night-card border border-sage-200/60 dark:border-night-border hover:bg-sage-100 rounded-xl transition-all"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Add Passcode Lock</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Journal Canvas or Locked Screen */}
      {isLocked ? (
        <div className="py-16 sm:py-24 px-6 text-center rounded-3xl bg-white/70 dark:bg-night-surface/70 border border-stone-200/60 dark:border-night-border/70 shadow-xs flex flex-col items-center justify-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-stone-100 dark:bg-night-card flex items-center justify-center text-stone-500 dark:text-stone-400">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h4 className="font-serif text-lg font-medium text-stone-800 dark:text-stone-100">
              Journal is Private
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-light leading-relaxed">
              Your entries are protected on-device. No cloud servers, no analytics, no external tracking.
            </p>
          </div>
          <button
            onClick={handleUnlockClick}
            className="mt-2 px-6 py-2.5 rounded-2xl bg-sage-600 hover:bg-sage-700 text-white text-xs font-medium tracking-wide transition-all shadow-sm flex items-center gap-2"
          >
            <Unlock className="w-4 h-4" />
            <span>Unlock Today's Entry</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Writing Canvas */}
          <div className="relative rounded-3xl bg-white/90 dark:bg-night-surface border border-stone-200/60 dark:border-night-border p-6 sm:p-8 shadow-calm">
            <textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Allow your thoughts to exhale freely here. No structure required..."
              rows={14}
              className="w-full bg-transparent border-0 focus:ring-0 resize-none font-serif text-base sm:text-lg leading-relaxed text-stone-800 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none"
            />

            {/* Bottom Status & Word Count */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-night-border/50 text-xs text-stone-400 font-light">
              <div className="flex items-center gap-1.5">
                {saveStatus === 'saving' && <span>Quietly saving...</span>}
                {saveStatus === 'saved' && (
                  <span className="flex items-center gap-1 text-sage-600 dark:text-sage-400">
                    <Check className="w-3.5 h-3.5" />
                    Saved on device
                  </span>
                )}
                {saveStatus === 'idle' && <span>Local-first storage</span>}
              </div>

              <span>{wordCount} words</span>
            </div>
          </div>
        </div>
      )}

      {/* Pin Lock Modal */}
      <PinLockModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={handlePinSuccess}
        mode={pinModalMode}
        currentPinHash={pinHash}
        onSaveNewPin={handleSaveNewPin}
      />
    </div>
  );
};
