import React, { useState, useEffect, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  BookOpen,
  Edit3,
  Eye,
  Check,
  Bold,
  Italic,
  Heading,
  List,
  Quote,
  Code,
  Sparkles
} from 'lucide-react';
import { db } from '../db';
import { DateNavigator } from './DateNavigator';
import { MarkdownLite } from './MarkdownLite';

interface JournalViewProps {
  currentDate: string;
  onSelectDate: (date: string) => void;
}

export const JournalView: React.FC<JournalViewProps> = ({
  currentDate,
  onSelectDate,
}) => {
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Reactively query note for current date
  const existingNote = useLiveQuery(
    () => db.notes.where('date').equals(currentDate).first(),
    [currentDate]
  );

  // Sync state when date changes or note loads
  useEffect(() => {
    if (existingNote) {
      setContent(existingNote.content);
    } else {
      setContent('');
    }
    setSaveStatus('idle');
  }, [currentDate, existingNote]);

  // Debounced auto-save
  useEffect(() => {
    if (content === (existingNote?.content || '')) {
      return;
    }

    setSaveStatus('saving');
    const timer = setTimeout(async () => {
      await db.notes.put({
        date: currentDate,
        content,
        updatedAt: new Date().toISOString(),
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 600);

    return () => clearTimeout(timer);
  }, [content, currentDate, existingNote]);

  // Insert markdown helper at cursor
  const insertSyntax = (before: string, after: string = '') => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const previousText = el.value;
    const selection = previousText.substring(start, end);
    const replacement = `${before}${selection}${after}`;
    const newText = previousText.substring(0, start) + replacement + previousText.substring(end);

    setContent(newText);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 sm:py-6 animate-in fade-in duration-200">
      {/* Date Navigation */}
      <DateNavigator currentDate={currentDate} onSelectDate={onSelectDate} />

      {/* Main Journal Card */}
      <div className="mt-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-2xs overflow-hidden">
        {/* Card Header: Mode Switcher & Auto-save status */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Daily Note & Journal
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Auto-save status */}
            <div className="text-[11px] font-medium text-slate-400">
              {saveStatus === 'saving' && (
                <span className="text-amber-500 animate-pulse">Saving...</span>
              )}
              {saveStatus === 'saved' && (
                <span className="text-emerald-500 inline-flex items-center gap-1">
                  <Check className="w-3 h-3" /> Saved
                </span>
              )}
              {saveStatus === 'idle' && existingNote && (
                <span>Saved</span>
              )}
            </div>

            {/* Write / Preview Tab Switcher */}
            <div className="flex items-center bg-slate-200/60 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('write')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition font-medium ${
                  activeTab === 'write'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-semibold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3 h-3" />
                <span>Write</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition font-medium ${
                  activeTab === 'preview'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-semibold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>Preview</span>
              </button>
            </div>
          </div>
        </div>

        {/* Markdown Toolbar (Visible in Write Mode) */}
        {activeTab === 'write' && (
          <div className="flex items-center gap-1 px-3 py-1.5 border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 text-slate-500 overflow-x-auto">
            <button
              type="button"
              onClick={() => insertSyntax('**', '**')}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg hover:text-slate-800 dark:hover:text-slate-200 transition"
              title="Bold (**text**)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSyntax('*', '*')}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg hover:text-slate-800 dark:hover:text-slate-200 transition"
              title="Italic (*text*)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSyntax('### ')}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg hover:text-slate-800 dark:hover:text-slate-200 transition"
              title="Heading (### Heading)"
            >
              <Heading className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSyntax('- ')}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg hover:text-slate-800 dark:hover:text-slate-200 transition"
              title="Bullet list (- item)"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSyntax('> ')}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg hover:text-slate-800 dark:hover:text-slate-200 transition"
              title="Quote (> quote)"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSyntax('`', '`')}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg hover:text-slate-800 dark:hover:text-slate-200 transition"
              title="Code (`code`)"
            >
              <Code className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="p-4 sm:p-5 min-h-[300px]">
          {activeTab === 'write' ? (
            <textarea
              ref={textareaRef}
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind today? Write thoughts, plans, reflections, meeting notes, or ideas..."
              className="w-full h-full bg-transparent border-none focus:outline-none text-sm leading-relaxed text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-y"
            />
          ) : (
            <div className="prose prose-slate dark:prose-invert max-w-none">
              {content.trim() ? (
                <MarkdownLite content={content} />
              ) : (
                <div className="text-center py-12 px-4">
                  <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-2 opacity-60" />
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    No note written for this day
                  </p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    Switch to the Write tab to record your daily journal or freeform notes.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Card Footer: Metrics & Helpful Tips */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/40 text-[11px] text-slate-400">
          <span>
            {wordCount} words • {charCount} characters
          </span>
          <span className="hidden sm:inline">
            Supports lightweight Markdown formatting
          </span>
        </div>
      </div>
    </div>
  );
};
