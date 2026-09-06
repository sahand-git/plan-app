import { useState, useEffect, useCallback } from 'react';
import {
  getNotificationPermission,
  requestNotificationPermission,
  sendLocalNotification,
  checkAndFireReminders,
  type NotificationStatus
} from '../utils/notifications';

export function useNotificationScheduler() {
  const [permission, setPermission] = useState<NotificationStatus>(getNotificationPermission);

  const requestPermission = useCallback(async () => {
    const status = await requestNotificationPermission();
    setPermission(status);
    return status;
  }, []);

  const sendTestNotification = useCallback(async () => {
    if (permission !== 'granted') {
      const status = await requestPermission();
      if (status !== 'granted') return false;
    }
    await sendLocalNotification(
      'DayFlow Reminder Test',
      'This is how your task reminders will sound and appear when scheduled!'
    );
    return true;
  }, [permission, requestPermission]);

  useEffect(() => {
    // Initial check
    checkAndFireReminders();

    // Check periodically every 20 seconds
    const interval = setInterval(() => {
      checkAndFireReminders();
    }, 20000);

    // Also check immediately when window gains focus or tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAndFireReminders();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, []);

  return {
    permission,
    requestPermission,
    sendTestNotification,
  };
}
