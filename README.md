# DayFlow — Daily Planner, Habit Tracker & Journal

A clean, minimal, mobile-first Daily Planner built with **Vite**, **React**, **TypeScript**, **Tailwind CSS**, **Dexie.js (IndexedDB)**, **Vite PWA**, and **date-fns**.

100% client-side and offline-first. No accounts, no multi-user tracking, no backend database, and zero cloud sync.

---

## Features

1. **Daily Task List**
   - Add, edit, delete, and check off tasks for any day.
   - Optional priority flags (**High**, **Med**, **Low**) and time-of-day tags.
   - **Overdue Rollover**: Uncompleted tasks from previous days roll over visibly into a dedicated, prominent **Overdue Tasks** section with quick actions to complete or reschedule to today.
   - Global keyboard shortcut: Press **`n`** from anywhere to quick-add a task.

2. **Reminders & Local Notifications**
   - Schedule reminders for any task with custom times.
   - Recurring reminder frequencies: **Daily**, **Weekdays (Mon–Fri)**, or **Weekly (custom days of week)**.
   - Multi-tier alert mechanism: native `Notification` API / Service Worker notifications + synthesizer chime via Web Audio API.
   - Transparent, honest "Best-effort" delivery badges throughout the UI.

3. **Calendar View**
   - **Month View**: Displays visual task density per day with colored status dots (red/amber for pending, green for completed) and completion counts.
   - **Week View**: Detailed 7-day strip with task previews, priority indicators, and quick-jump navigation.
   - 1-click jump to any day's task list.

4. **Daily Notes & Journal**
   - Dedicated freeform note area per day, separated from task items.
   - **Markdown-Lite support**: `# Headings`, `**bold**`, `*italic*`, `> blockquotes`, `- bullet lists`, `1. numbered lists`, and `` `code` `` spans.
   - Live **Write** / **Preview** modes.
   - Automatic debounced auto-save with save status indicator.

5. **Habit Tracker**
   - Track recurring daily habits (e.g. *Morning Workout*, *Read 20 Pages*, *Mindfulness*).
   - Consecutive streak counters: **Current Streak** (flame badge) and all-time **Best Streak** (trophy badge).
   - Interactive 7-day mini activity heat track.

6. **Data Management & Backup**
   - **Export to JSON**: One-click download of all tasks, notes, habits, and logs into a single structured backup file.
   - **Import from JSON**: Restore previous backups with options to either merge or cleanly replace data.
   - Complete local privacy: IndexedDB data stays exclusively on your device.
   - Persistent Dark / Light / System theme modes stored in `localStorage`.

---

## 1. How to Run Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation & Development Server
```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

### Production Build & Preview
```bash
# Build production bundle with PWA assets and Service Worker
npm run build

# Preview production build locally
npm run preview
```

---

## 2. How to Install as a PWA (Progressive Web App)

DayFlow is configured with `vite-plugin-pwa`, complete with offline service worker precaching and a web app manifest.

### On Desktop (Chrome, Edge, Brave):
1. Open the app URL in your browser (`http://localhost:5173` or your production domain).
2. Click the **Install** icon on the right side of the address bar (or go to browser menu `...` > **Apps** > **Install DayFlow**).
3. The app will launch in its own dedicated, chromeless window, accessible from your desktop and Start/App menu like a native desktop app.

### On Mobile (iOS Safari):
1. Open DayFlow in Safari.
2. Tap the **Share** button (the square with an arrow pointing up).
3. Scroll down and tap **Add to Home Screen**.
4. Tap **Add**. DayFlow will appear on your home screen with its custom icon and run fullscreen without Safari URL bars.

### On Mobile (Android Chrome):
1. Open DayFlow in Google Chrome.
2. Tap the three-dot menu icon in the upper right.
3. Tap **Install app** (or **Add to Home screen**).
4. Follow the prompt to install the native standalone web app.

---

## 3. Limitations of the Reminder System (Honest Disclosure)

DayFlow is designed intentionally as a **purely client-side, local-first application without external cloud servers, databases, or third-party tracking**. Because of this privacy-preserving architecture, local reminders rely strictly on client browser APIs.

Here is an honest, technical explanation of when reminders **will** and **will not** fire:

### When Reminders WILL Fire:
- **App is in the foreground**: When DayFlow is open and currently in use.
- **App is running in the background**: When DayFlow is minimized or open in another tab/window while your browser remains running. The internal scheduler checks pending reminders every 20 seconds and upon window focus/visibility changes, triggering both the browser notification and a synthesized Web Audio chime.
- **Installed PWA is minimized**: When installed as a PWA and left open in the taskbar/dock.

### When Reminders WILL NOT Fire:
- **Browser or PWA is force-quit / completely closed**: Client-side web apps cannot wake up an operating system process that has been terminated. Truly waking a sleeping or closed device requires an always-on remote push server using Apple APNs or Google FCM (Web Push protocol with VAPID keys). Because DayFlow is deliberately offline and serverless, this is not possible when the app is completely quit.
- **Device is asleep or in deep OS battery suspension**: Modern operating systems (especially iOS and Android battery saver modes) suspend background JavaScript execution timers when the screen is locked and the device enters deep sleep. Notifications scheduled during sleep will fire once the device wakes up or DayFlow is brought back into focus.
- **Browser notifications are blocked or muted**: If notifications are disabled in your browser or operating system Focus/Do Not Disturb settings, visual notifications will be suppressed by the OS.

> **Summary UI Label**: In DayFlow, all reminders are marked with a **"Best-effort"** indicator to ensure you always know what to expect. For critical, life-or-death alarms, use your device's native system Clock app. For daily work planning and focus sessions while at your desk or mobile device, DayFlow reminders provide a lightweight, privacy-focused alert system.

---

## License
MIT License. Free and open source.
