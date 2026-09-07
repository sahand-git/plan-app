import React from 'react';
import { translations, type AppLanguage } from '../../utils/i18n';
import { requestNotificationPermission } from '../../utils/notifications';
import { Moon, Bell, X } from 'lucide-react';

interface ContextualNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: AppLanguage;
}

export const ContextualNotificationModal: React.FC<ContextualNotificationModalProps> = ({
  isOpen,
  onClose,
  lang = 'en',
}) => {
  const t = translations[lang] || translations.en;

  if (!isOpen) return null;

  const handleEnable = async () => {
    await requestNotificationPermission();
    localStorage.setItem('treeplanner_contextual_notif_asked', 'true');
    onClose();
  };

  const handleDismiss = () => {
    localStorage.setItem('treeplanner_contextual_notif_asked', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-soft-fade-up select-none">
      <div className="w-full max-w-sm bg-white dark:bg-night-surface rounded-3xl p-6 shadow-calm-lg border border-stone-200/80 dark:border-night-border space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-2xl bg-earth-100 dark:bg-night-card flex items-center justify-center text-earth-700 dark:text-stone-300">
            <Moon className="w-5 h-5" />
          </div>
          <button onClick={handleDismiss} className="p-1 rounded-full text-stone-400 hover:text-stone-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1.5 text-center sm:text-left">
          <h3 className="font-serif text-lg font-medium text-stone-800 dark:text-stone-100">
            {t.notifications.softPromptTitle}
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-300 font-light leading-relaxed">
            {t.notifications.softPromptBody}
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={handleEnable}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-sage-600 hover:bg-sage-700 text-white text-xs font-serif font-medium shadow-xs transition-all active:scale-98"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{t.notifications.enableAction}</span>
          </button>

          <button
            onClick={handleDismiss}
            className="w-full py-2 text-xs text-stone-400 dark:text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 font-light transition-colors"
          >
            {t.notifications.dismissAction}
          </button>
        </div>
      </div>
    </div>
  );
};
