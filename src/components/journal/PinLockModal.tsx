import React, { useState } from 'react';
import { Lock, X, AlertCircle } from 'lucide-react';

interface PinLockModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSuccess: () => void;
  mode: 'unlock' | 'setup';
  currentPinHash?: string | null;
  onSaveNewPin?: (pinHash: string) => void;
}

export async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`tree_planner_salt_${pin}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const PinLockModal: React.FC<PinLockModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  mode,
  currentPinHash,
  onSaveNewPin,
}) => {
  const [digits, setDigits] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDigitPress = async (digit: string) => {
    if (digits.length >= 4) return;
    const next = digits + digit;
    setDigits(next);
    setError(null);

    if (next.length === 4) {
      if (mode === 'unlock') {
        const hashed = await hashPin(next);
        if (hashed === currentPinHash) {
          setTimeout(() => {
            setDigits('');
            onSuccess();
          }, 150);
        } else {
          setTimeout(() => {
            setError('Incorrect passcode. Try again.');
            setDigits('');
          }, 200);
        }
      } else if (mode === 'setup') {
        const hashed = await hashPin(next);
        if (onSaveNewPin) {
          onSaveNewPin(hashed);
        }
        setTimeout(() => {
          setDigits('');
          onSuccess();
        }, 150);
      }
    }
  };

  const handleBackspace = () => {
    setDigits((prev) => prev.slice(0, -1));
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-soft-fade-up">
      <div className="w-full max-w-xs bg-parchment-subtle dark:bg-night-surface rounded-3xl p-6 shadow-calm-lg border border-stone-200/80 dark:border-night-border text-center flex flex-col items-center">
        {onClose && (
          <button
            onClick={onClose}
            className="self-end p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="w-12 h-12 rounded-2xl bg-sage-100 dark:bg-night-card flex items-center justify-center text-sage-600 dark:text-sage-400 mb-3 mt-1">
          <Lock className="w-5 h-5" />
        </div>

        <h4 className="font-serif text-lg font-medium text-stone-800 dark:text-stone-100">
          {mode === 'setup' ? 'Set Private Passcode' : 'Journal Sanctuary'}
        </h4>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 mb-6 font-light">
          {mode === 'setup'
            ? 'Choose a 4-digit PIN stored securely only on your device.'
            : 'Enter your 4-digit passcode to unlock your thoughts.'}
        </p>

        {/* 4 Dot Indicators */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = digits.length > idx;
            return (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                  isFilled
                    ? 'bg-sage-600 dark:bg-sage-400 scale-110'
                    : 'border-2 border-stone-300 dark:border-stone-600 bg-transparent'
                }`}
              />
            );
          })}
        </div>

        {error && (
          <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 mb-4">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Numeric Keypad (Calm Minimalist) */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[220px]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handleDigitPress(num)}
              className="w-14 h-14 rounded-full bg-white dark:bg-night-card border border-stone-200/70 dark:border-night-border/80 text-stone-800 dark:text-stone-100 text-lg font-serif font-medium active:scale-95 transition-all shadow-xs hover:bg-stone-50 dark:hover:bg-night-border"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleDigitPress('0')}
            className="w-14 h-14 rounded-full bg-white dark:bg-night-card border border-stone-200/70 dark:border-night-border/80 text-stone-800 dark:text-stone-100 text-lg font-serif font-medium active:scale-95 transition-all shadow-xs hover:bg-stone-50 dark:hover:bg-night-border"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="w-14 h-14 rounded-full flex items-center justify-center text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};
