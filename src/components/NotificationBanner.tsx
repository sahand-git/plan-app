import React, { useState } from 'react';
import { Bell, CheckCircle, Info, X } from 'lucide-react';
import type { NotificationStatus } from '../utils/notifications';

interface NotificationBannerProps {
  permission: NotificationStatus;
  onRequestPermission: () => Promise<NotificationStatus>;
  onSendTestNotification: () => Promise<boolean>;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  permission,
  onRequestPermission,
  onSendTestNotification,
}) => {
  const [dismissed, setDismissed] = useState(false);
  const [testSent, setTestSent] = useState(false);

  if (dismissed) return null;

  if (permission === 'unsupported') {
    return null;
  }

  const handleTest = async () => {
    const sent = await onSendTestNotification();
    if (sent) {
      setTestSent(true);
      setTimeout(() => setTestSent(false), 4000);
    }
  };

  return (
    <div className="mb-4 rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-950/20 p-3 text-xs transition-all">
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 p-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 shrink-0">
            <Bell className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {permission === 'granted'
                  ? 'Reminders Enabled (Best-effort)'
                  : 'Enable Task Reminders'}
              </span>
              {permission === 'granted' && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[10px] font-medium bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  <CheckCircle className="w-2.5 h-2.5" /> Active
                </span>
              )}
            </div>

            <p className="mt-0.5 text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              {permission === 'granted' ? (
                <>
                  <strong className="font-medium text-slate-700 dark:text-slate-300">Note:</strong> Notifications fire reliably when DayFlow is open or minimized/backgrounded in your browser or installed PWA. They will not fire if the app is fully terminated or device is asleep.
                </>
              ) : (
                'Allow notifications to receive sound and desktop alerts for tasks with scheduled reminder times.'
              )}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-2">
              {permission !== 'granted' && (
                <button
                  type="button"
                  onClick={onRequestPermission}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium rounded-lg shadow-2xs transition"
                >
                  Enable Notifications
                </button>
              )}

              {permission === 'granted' && (
                <button
                  type="button"
                  onClick={handleTest}
                  disabled={testSent}
                  className="px-2 py-0.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-md shadow-2xs transition disabled:opacity-60"
                >
                  {testSent ? '✓ Sent Chime & Alert' : 'Test Sound & Alert'}
                </button>
              )}

              <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200/50 dark:border-amber-900/30">
                <Info className="w-3 h-3 shrink-0" />
                Best-effort delivery
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
