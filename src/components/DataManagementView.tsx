import React, { useState, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileJson,
  Shield,
  Moon,
  Sun,
  Laptop,
  Sparkles,
  Sprout,
} from 'lucide-react';
import { db, type Task, type DailyNote, type Habit, type HabitLog, type TreeDayLog } from '../db';
import type { Theme } from '../hooks/useTheme';

interface DataManagementViewProps {
  theme: Theme;
  onSetTheme: (theme: Theme) => void;
  noPressureMode: boolean;
  onToggleNoPressure: () => void;
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
    treeLogs?: TreeDayLog[];
  };
}

export const DataManagementView: React.FC<DataManagementViewProps> = ({
  theme,
  onSetTheme,
  noPressureMode,
  onToggleNoPressure,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [pendingImportData, setPendingImportData] = useState<ExportPayload | null>(null);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  // Queries
  const tasks = useLiveQuery(() => db.tasks.toArray()) || [];
  const notes = useLiveQuery(() => db.notes.toArray()) || [];
  const habits = useLiveQuery(() => db.habits.toArray()) || [];
  const treeLogs = useLiveQuery(() => db.treeLogs.toArray()) || [];

  // Export JSON file
  const handleExport = () => {
    const payload: ExportPayload = {
      version: 1,
      appName: 'The Tree Planner',
      exportedAt: new Date().toISOString(),
      data: {
        tasks,
        notes,
        habits,
        habitLogs: [],
        treeLogs,
      },
    };

    const jsonStr = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `the-tree-planner-backup-${dateStr}.json`;
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
          throw new Error('Invalid backup file format.');
        }

        setPendingImportData(parsed);
        setImportError(null);
      } catch (err: unknown) {
        setImportError(err instanceof Error ? err.message : 'Failed to parse JSON backup file.');
        setPendingImportData(null);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Execute Import
  const executeImport = async (mode: 'merge' | 'replace') => {
    if (!pendingImportData) return;

    try {
      setImportError(null);
      await db.transaction('rw', [db.tasks, db.notes, db.habits, db.habitLogs, db.treeLogs], async () => {
        if (mode === 'replace') {
          await db.tasks.clear();
          await db.notes.clear();
          await db.habits.clear();
          await db.habitLogs.clear();
          await db.treeLogs.clear();
        }

        const {
          tasks: inTasks = [],
          notes: inNotes = [],
          habits: inHabits = [],
          habitLogs: inLogs = [],
          treeLogs: inTree = [],
        } = pendingImportData.data;

        for (const t of inTasks) {
          const { id, ...rest } = t;
          if (mode === 'merge') {
            await db.tasks.add(rest as Task);
          } else {
            await db.tasks.put(t);
          }
        }

        for (const n of inNotes) {
          await db.notes.put(n);
        }

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

        for (const tr of inTree) {
          await db.treeLogs.put(tr);
        }
      });

      const totalItems =
        (pendingImportData.data.tasks?.length || 0) +
        (pendingImportData.data.notes?.length || 0) +
        (pendingImportData.data.habits?.length || 0);

      setImportStatus(`Successfully restored ${totalItems} items (${mode === 'replace' ? 'replaced' : 'merged'}).`);
      setPendingImportData(null);
      setTimeout(() => setImportStatus(null), 5000);
    } catch (err: unknown) {
      setImportError(err instanceof Error ? err.message : 'Import failed.');
    }
  };

  // Clear Database
  const handleClearAll = async () => {
    await db.transaction('rw', [db.tasks, db.notes, db.habits, db.habitLogs, db.treeLogs], async () => {
      await db.tasks.clear();
      await db.notes.clear();
      await db.habits.clear();
      await db.habitLogs.clear();
      await db.treeLogs.clear();
    });
    localStorage.removeItem('treeplanner_journal_pin');
    setIsConfirmingClear(false);
    setImportStatus('All local records have been cleared.');
    setTimeout(() => setImportStatus(null), 4000);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 space-y-5 animate-soft-fade-up pb-24">
      {/* Overview Card */}
      <div className="p-5 bg-white dark:bg-night-surface border border-stone-200/70 dark:border-night-border rounded-3xl shadow-calm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sage-100 dark:bg-night-card text-sage-600 dark:text-sage-400 flex items-center justify-center">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-base font-medium text-stone-800 dark:text-stone-100">
              Vault & Local Storage
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-light">
              One-time purchase, 100% on-device. Zero recurring subscription.
            </p>
          </div>
        </div>

        {/* Local Storage Stats */}
        <div className="grid grid-cols-4 gap-2 mt-5">
          <div className="p-2.5 bg-stone-50 dark:bg-night-card/60 rounded-2xl text-center border border-stone-200/50 dark:border-night-border">
            <span className="text-base font-serif font-semibold text-stone-800 dark:text-stone-100 block">
              {tasks.length}
            </span>
            <span className="text-[10px] text-stone-400">Tasks</span>
          </div>
          <div className="p-2.5 bg-stone-50 dark:bg-night-card/60 rounded-2xl text-center border border-stone-200/50 dark:border-night-border">
            <span className="text-base font-serif font-semibold text-stone-800 dark:text-stone-100 block">
              {notes.length}
            </span>
            <span className="text-[10px] text-stone-400">Journal</span>
          </div>
          <div className="p-2.5 bg-stone-50 dark:bg-night-card/60 rounded-2xl text-center border border-stone-200/50 dark:border-night-border">
            <span className="text-base font-serif font-semibold text-stone-800 dark:text-stone-100 block">
              {habits.length}
            </span>
            <span className="text-[10px] text-stone-400">Habits</span>
          </div>
          <div className="p-2.5 bg-stone-50 dark:bg-night-card/60 rounded-2xl text-center border border-stone-200/50 dark:border-night-border">
            <span className="text-base font-serif font-semibold text-stone-800 dark:text-stone-100 block">
              {treeLogs.length}
            </span>
            <span className="text-[10px] text-stone-400">Tree Days</span>
          </div>
        </div>
      </div>

      {/* Success / Error Banners */}
      {importStatus && (
        <div className="p-3.5 bg-sage-50 dark:bg-night-card border border-sage-200 dark:border-sage-800 text-sage-800 dark:text-sage-200 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-sage-600" />
          <span>{importStatus}</span>
        </div>
      )}

      {importError && (
        <div className="p-3.5 bg-amber-50 dark:bg-night-card border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 rounded-2xl text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{importError}</span>
        </div>
      )}

      {/* Preferences Card */}
      <div className="p-5 bg-white dark:bg-night-surface border border-stone-200/70 dark:border-night-border rounded-3xl shadow-calm space-y-4">
        <h3 className="font-serif text-sm font-medium text-stone-800 dark:text-stone-100">
          Mindful Preferences
        </h3>

        {/* No-Pressure Mode Switch */}
        <div className="flex items-center justify-between py-2 border-b border-stone-100 dark:border-night-border">
          <div className="pr-4">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sage-600 dark:text-sage-400" />
              <span className="text-xs font-medium text-stone-800 dark:text-stone-200">
                No-Pressure Mode
              </span>
            </div>
            <p className="text-[11px] text-stone-400 mt-0.5 font-light">
              Conceals numbers, percentages, and streaks app-wide.
            </p>
          </div>

          <button
            type="button"
            onClick={onToggleNoPressure}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
              noPressureMode ? 'bg-sage-600' : 'bg-stone-300 dark:bg-stone-600'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                noPressureMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Theme Settings */}
        <div className="flex items-center justify-between py-2">
          <div>
            <span className="text-xs font-medium text-stone-800 dark:text-stone-200 block">
              Calm Atmosphere
            </span>
            <span className="text-[11px] text-stone-400 font-light">
              Parchment Light or Night Forest
            </span>
          </div>

          <div className="flex items-center bg-stone-100 dark:bg-night-card p-1 rounded-2xl border border-stone-200/60 dark:border-night-border text-xs">
            {[
              { id: 'light' as Theme, label: 'Light', icon: <Sun className="w-3.5 h-3.5" /> },
              { id: 'dark' as Theme, label: 'Night', icon: <Moon className="w-3.5 h-3.5" /> },
              { id: 'system' as Theme, label: 'System', icon: <Laptop className="w-3.5 h-3.5" /> },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onSetTheme(t.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-medium transition ${
                  theme === t.id
                    ? 'bg-white dark:bg-night-surface text-sage-700 dark:text-sage-300 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Backup & Restore */}
      <div className="p-5 bg-white dark:bg-night-surface border border-stone-200/70 dark:border-night-border rounded-3xl shadow-calm space-y-4">
        <div>
          <h3 className="font-serif text-sm font-medium text-stone-800 dark:text-stone-100 flex items-center gap-2">
            <FileJson className="w-4 h-4 text-sage-600" />
            <span>Manual Backup & File Export</span>
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-light leading-relaxed">
            Download your data as a clean JSON file to store on your device or transfer to a new phone.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleExport}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-sage-600 hover:bg-sage-700 active:scale-95 text-white font-medium text-xs rounded-2xl shadow-xs transition"
          >
            <Download className="w-4 h-4" />
            <span>Export Backup File</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-100 dark:bg-night-card hover:bg-stone-200/60 dark:hover:bg-night-border border border-stone-200/80 dark:border-night-border text-stone-700 dark:text-stone-300 font-medium text-xs rounded-2xl transition"
          >
            <Upload className="w-4 h-4 text-stone-500" />
            <span>Restore Backup</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Pending Import */}
        {pendingImportData && (
          <div className="p-4 bg-stone-50 dark:bg-night-card border border-stone-200 dark:border-night-border rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-800 dark:text-stone-100">
              <CheckCircle2 className="w-4 h-4 text-sage-600" />
              <span>Backup file recognized</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 font-light">
              Contains {pendingImportData.data.tasks?.length || 0} tasks,{' '}
              {pendingImportData.data.notes?.length || 0} journal entries, and{' '}
              {pendingImportData.data.habits?.length || 0} habits.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => executeImport('merge')}
                className="px-3 py-1.5 bg-sage-600 hover:bg-sage-700 text-white font-medium text-xs rounded-xl shadow-xs"
              >
                Merge
              </button>
              <button
                type="button"
                onClick={() => executeImport('replace')}
                className="px-3 py-1.5 bg-stone-800 text-white font-medium text-xs rounded-xl shadow-xs"
              >
                Replace All
              </button>
              <button
                type="button"
                onClick={() => setPendingImportData(null)}
                className="px-3 py-1.5 text-stone-500 text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Privacy Guarantee */}
      <div className="p-4 bg-earth-50/60 dark:bg-night-card/40 border border-earth-200/40 dark:border-night-border rounded-2xl flex items-start gap-3 text-xs text-stone-500 dark:text-stone-400">
        <Shield className="w-4 h-4 text-sage-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-medium text-stone-800 dark:text-stone-200 block">
            Zero Cloud Dependency
          </span>
          <p className="text-[11px] font-light leading-relaxed mt-0.5">
            Your tasks, habits, and private journal remain exclusively inside your browser or device storage.
            No accounts, no third-party tracking, no ongoing cloud costs.
          </p>
        </div>
      </div>

      {/* Clear Database (Quiet) */}
      <div className="pt-2 text-center">
        {isConfirmingClear ? (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-xl"
            >
              Confirm Wipe All
            </button>
            <button
              onClick={() => setIsConfirmingClear(false)}
              className="px-3 py-1.5 text-xs text-stone-500"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsConfirmingClear(true)}
            className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
          >
            Reset All Local Data
          </button>
        )}
      </div>
    </div>
  );
};
