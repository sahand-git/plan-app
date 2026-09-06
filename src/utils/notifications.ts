import { db } from '../db';
import { format, parseISO } from 'date-fns';

export type NotificationStatus = 'default' | 'granted' | 'denied' | 'unsupported';

export function getNotificationPermission(): NotificationStatus {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission as NotificationStatus;
}

export async function requestNotificationPermission(): Promise<NotificationStatus> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  try {
    const result = await Notification.requestPermission();
    return result as NotificationStatus;
  } catch (err) {
    console.error('Failed to request notification permission:', err);
    return 'denied';
  }
}

/**
 * Plays a pleasant, subtle two-tone chime using Web Audio API
 */
export function playNotificationSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // First tone
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    gain1.gain.setValueAtTime(0.15, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.35);

    // Second tone
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain2.gain.setValueAtTime(0.15, ctx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 0.55);
  } catch (err) {
    console.warn('Audio playback not permitted or unavailable:', err);
  }
}

/**
 * Fires a system notification via ServiceWorker registration if available, or native Notification
 */
export async function sendLocalNotification(title: string, body: string, tag?: string) {
  playNotificationSound();

  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  const options = {
    body,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: tag || `task-${Date.now()}`,
    renotify: true,
  } as NotificationOptions;

  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg && 'showNotification' in reg) {
        await reg.showNotification(title, options);
        return;
      }
    }
  } catch (err) {
    console.warn('Service worker notification failed, falling back to Notification constructor:', err);
  }

  try {
    new Notification(title, options);
  } catch (err) {
    console.error('Failed to trigger Notification constructor:', err);
  }
}

/**
 * Scheduler check loop: inspects all tasks with reminders and determines if any are due right now.
 */
export async function checkAndFireReminders(): Promise<number> {
  if (getNotificationPermission() !== 'granted') {
    return 0;
  }

  const now = new Date();
  const currentHHMM = format(now, 'HH:mm');
  const todayStr = format(now, 'yyyy-MM-dd');
  const currentDayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const isWeekday = currentDayOfWeek >= 1 && currentDayOfWeek <= 5;

  let firedCount = 0;

  try {
    const tasksWithReminders = await db.tasks
      .filter((t) => !t.completed && Boolean(t.reminder?.enabled))
      .toArray();

    for (const task of tasksWithReminders) {
      const reminder = task.reminder;
      if (!reminder || !reminder.enabled) continue;

      const reminderTime = reminder.time;
      // If time does not match current minute, continue
      if (reminderTime !== currentHHMM) continue;

      // Check if already notified for today
      if (reminder.lastNotified === todayStr) continue;

      let shouldFire = false;
      const recurring = reminder.recurring || 'none';

      if (recurring === 'none') {
        // One-time reminder: only fires on scheduled task date
        if (task.date === todayStr) {
          shouldFire = true;
        }
      } else if (recurring === 'daily') {
        shouldFire = true;
      } else if (recurring === 'weekdays') {
        if (isWeekday) {
          shouldFire = true;
        }
      } else if (recurring === 'weekly') {
        if (reminder.recurringDays && reminder.recurringDays.length > 0) {
          if (reminder.recurringDays.includes(currentDayOfWeek)) {
            shouldFire = true;
          }
        } else {
          // Default weekly: fires on the same day of week as task.date
          const taskDateObj = parseISO(task.date);
          if (taskDateObj.getDay() === currentDayOfWeek) {
            shouldFire = true;
          }
        }
      }

      if (shouldFire && task.id) {
        firedCount++;
        const title = `Reminder: ${task.title}`;
        const body = task.description
          ? `${task.description} (${task.time || reminderTime})`
          : `Scheduled for ${task.time || reminderTime}`;

        await sendLocalNotification(title, body, `task-reminder-${task.id}-${todayStr}`);

        // Update lastNotified in Dexie to avoid duplicate notifications today
        await db.tasks.update(task.id, {
          reminder: {
            ...reminder,
            lastNotified: todayStr,
          },
        });
      }
    }
  } catch (err) {
    console.error('Error during reminder check:', err);
  }

  return firedCount;
}
