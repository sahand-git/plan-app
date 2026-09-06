import React, { useState, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Download,
  Upload,
  Database,
  CheckCircle2,
  AlertTriangle,
  FileJson,
  Shield,
  Moon,
  Sun,
  Laptop,
  Wifi,
  WifiOff
} from 'lucide-react';
import { db, type Task, type DailyNote, type Habit, type HabitLog } from '../db';
import type { Theme } from '../hooks/useTheme';
import { useNotificationScheduler } from '../hooks/useNotificationScheduler';

interface DataManagementViewProps {
  theme: Theme;
  onSetTheme: (theme: Theme) => void;
}

interface ExportPayload {
  version: number;
  appName: string;
  exportedAt: string;
  data: {
    tasks: Task[];
    notes: DailyNote[];
    habits: Habit[];
    habitLogs: HabitLog[];
  };
}

export const DataManagementView: React.FC<DataManagementViewProps> = ({
  theme,
  onSetTheme,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [pendingImportData, setPendingImportData] = useState<ExportPayload | null>(null);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  const { permission, requestPermission, sendTestNotification } = useNotificationScheduler();

  // Queries
  const tasks = useLiveQuery(() => db.tasks.toArray()) || [];
  const notes = useLiveQuery(() => db.notes.toArray()) || [];
  const habits = useLiveQuery(() => db.habits.toArray()) || [];
  const habitLogs = useLiveQuery(() => db.habitLogs.toArray()) || [];

  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  // Export JSON file
  const handleExport = () => {
    const payload: ExportPayload = {
      version: 1,
      appName: 'DayFlow Planner',
      exportedAt: new Date().toISOString(),
      data: {
        tasks,
        notes,
        habits,
        habitLogs,
      },
    };

    const jsonStr = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `dayflow-backup-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text) as ExportPayload;

        if (!parsed.data || (!parsed.data.tasks && !parsed.data.notes && !parsed.data.habits)) {
          throw new Error('Invalid DayFlow backup file format.');
        }

        setPendingImportData(parsed);
        setImportError(null);
      } catch (err: unknown) {
        setImportError(err instanceof Error ? err.message : 'Failed to parse JSON backup file.');
        setPendingImportData(null);
      }
    };
    reader.readAsText(file);
    // Reset file input so user can re-select the same file if needed
    e.target.value = '';
  };

  // Execute Import
  const executeImport = async (mode: 'merge' | 'replace') => {
    if (!pendingImportData) return;

    try {
      setImportError(null);
      await db.transaction('rw', [db.tasks, db.notes, db.habits, db.habitLogs], async () => {
        if (mode === 'replace') {
          await db.tasks.clear();
          await db.notes.clear();
          await db.habits.clear();
          await db.habitLogs.clear();
        }

        const { tasks: inTasks = [], notes: inNotes = [], habits: inHabits = [], habitLogs: inLogs = [] } =
          pendingImportData.data;

        // Insert tasks
        for (const t of inTasks) {
          const { id, ...rest } = t;
          if (mode === 'merge') {
            await db.tasks.add(rest as Task);
          } else {
            await db.tasks.put(t);
          }
        }

        // Insert notes
        for (const n of inNotes) {
          await db.notes.put(n);
        }

        // Insert habits & logs
        for (const h of inHabits) {
          if (mode === 'replace') {
            await db.habits.put(h);
          } else {
            const { id, ...rest } = h;
            await db.habits.add(rest as Habit);
          }
        }

        for (const l of inLogs) {
          if (mode === 'replace') {
            await db.habitLogs.put(l);
          } else {
            const { id, ...rest } = l;
            await db.habitLogs.add(rest as HabitLog);
          }
        }
      });

      const totalItems =
        (pendingImportData.data.tasks?.length || 0) +
        (pendingImportData.data.notes?.length || 0) +
        (pendingImportData.data.habits?.length || 0);

      setImportStatus(`Successfully imported ${totalItems} records (${mode === 'replace' ? 'replaced existing' : 'merged'}).`);
      setPendingImportData(null);
      setTimeout(() => setImportStatus(null), 5000);
    } catch (err: unknown) {
      setImportError(err instanceof Error ? err.message : 'Import failed.');
    }
  };

  // Clear Database
  const handleClearAll = async () => {
    await db.transaction('rw', [db.tasks, db.notes, db.habits, db.habitLogs], async () => {
      await db.tasks.clear();
      await db.notes.clear();
      await db.habits.clear();
      await db.habitLogs.clear();
    });
    setIsConfirmingClear(false);
    setImportStatus('All data has been cleared.');
    setTimeout(() => setImportStatus(null), 4000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 sm:py-6 animate-in fade-in duration-200 space-y-6">
      {/* Overview Card */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-2xs">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Data Management & Settings
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                100% private, client-side IndexedDB storage. No cloud servers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            {isOnline ? (
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">
                <Wifi className="w-3.5 h-3.5" /> PWA Ready
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 text-[11px] font-medium">
                <WifiOff className="w-3.5 h-3.5" /> Offline Mode
              </span>
            )}
          </div>
        </div>

        {/* Database Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
            <span className="text-lg font-bold text-slate-900 dark:text-white block">
              {tasks.length}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Tasks</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
            <span className="text-lg font-bold text-slate-900 dark:text-white block">
              {notes.length}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Journal Notes</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
            <span className="text-lg font-bold text-slate-900 dark:text-white block">
              {habits.length}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Habits</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
            <span className="text-lg font-bold text-slate-900 dark:text-white block">
              {habitLogs.length}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Habit Logs</span>
          </div>
        </div>
      </div>

      {/* Success / Error Banners */}
      {importStatus && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          <span>{importStatus}</span>
        </div>
      )}

      {importError && (
        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 rounded-xl text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{importError}</span>
        </div>
      )}

      {/* Backup & Restore Card */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-2xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileJson className="w-4 h-4 text-indigo-500" /> Backup & Restore
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Export a portable JSON backup file with all your tasks, habits, streaks, and journal notes.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {/* Export Button */}
          <button
            type="button"
            onClick={handleExport}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition shadow-indigo-600/20"
          >
            <Download className="w-4 h-4" />
            <span>Export Backup to JSON</span>
          </button>

          {/* Import Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl transition"
          >
            <Upload className="w-4 h-4 text-slate-500" />
            <span>Import from JSON Backup</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Pending Import Modal / Confirmation */}
        {pendingImportData && (
          <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900 dark:text-indigo-200">
              <CheckCircle2 className="w-4 h-4 text-indigo-500" />
              <span>Backup file parsed successfully</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Found <strong>{pendingImportData.data.tasks?.length || 0} tasks</strong>,{' '}
              <strong>{pendingImportData.data.notes?.length || 0} journal notes</strong>,{' '}
              <strong>{pendingImportData.data.habits?.length || 0} habits</strong>, and{' '}
              <strong>{pendingImportData.data.habitLogs?.length || 0} logs</strong>.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => executeImport('merge')}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg shadow-2xs"
              >
                Merge with Existing Data
              </button>
              <button
                type="button"
                onClick={() => executeImport('replace')}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs rounded-lg shadow-2xs"
              >
                Replace All Data
              </button>
              <button
                type="button"
                onClick={() => setPendingImportData(null)}
                className="px-3 py-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* App Appearance & Notifications Settings */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-2xs space-y-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Preferences & Controls
        </h3>

        {/* Theme Settings */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
              Theme Mode
            </span>
            <span className="text-[11px] text-slate-400">
              Customize interface color scheme
            </span>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200/60 dark:border-slate-700/50 text-xs">
            {[
              { id: 'light' as Theme, label: 'Light', icon: <Sun className="w-3.5 h-3.5" /> },
              { id: 'dark' as Theme, label: 'Dark', icon: <Moon className="w-3.5 h-3.5" /> },
              { id: 'system' as Theme, label: 'System', icon: <Laptop className="w-3.5 h-3.5" /> },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onSetTheme(t.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
                  theme === t.id
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-semibold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notifications Setting */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
              Browser Notifications
            </span>
            <span className="text-[11px] text-slate-400">
              Status: <strong className="capitalize">{permission}</strong> (Best-effort delivery)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {permission !== 'granted' ? (
              <button
                type="button"
                onClick={requestPermission}
                className="px-2.5 py-1 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition"
              >
                Enable
              </button>
            ) : (
              <button
                type="button"
                onClick={sendTestNotification}
                className="px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition"
              >
                Test Sound & Alert
              </button>
            )}
          </div>
        </div>

        {/* Danger Zone: Clear Data */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 block">
              Clear All Planner Data
            </span>
            <span className="text-[11px] text-slate-400">
              Permanently wipe all tasks, notes, and habits from this device
            </span>
          </div>

          {isConfirmingClear ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClearAll}
                className="px-2.5 py-1 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg shadow-2xs transition"
              >
                Yes, Delete All
              </button>
              <button
                type="button"
                onClick={() => setIsConfirmingClear(false)}
                className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsConfirmingClear(true)}
              className="px-2.5 py-1 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-lg transition"
            >
              Reset Data
            </button>
          )}
        </div>
      </div>

      {/* Security & Privacy Banner */}
      <div className="p-4 bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl flex items-start gap-3 text-xs text-slate-500 dark:text-slate-400">
        <Shield className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            Local-First & Offline Privacy
          </p>
          <p className="text-[11px] leading-relaxed">
            Your tasks, notes, habits, and streak data remain exclusively on your local device in IndexedDB. No external servers or analytics ever access your data.
          </p>
        </div>
      </div>
    </div>
  );
};
