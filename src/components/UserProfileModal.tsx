import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  X,
  User,
  Mail,
  Quote,
  Check,
  CheckCircle2,
  Flame,
  BookOpen,
  ShieldCheck
} from 'lucide-react';
import { db } from '../db';
import type { UserProfile } from '../hooks/useUserProfile';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (updates: Partial<UserProfile>) => void;
}

const GRADIENT_OPTIONS = [
  { id: 'indigo-violet', label: 'Indigo', gradient: 'from-indigo-600 to-violet-500' },
  { id: 'amber-rose', label: 'Sunset', gradient: 'from-amber-500 to-rose-500' },
  { id: 'emerald-teal', label: 'Emerald', gradient: 'from-emerald-500 to-teal-500' },
  { id: 'sky-blue', label: 'Sky', gradient: 'from-sky-500 to-blue-600' },
  { id: 'purple-pink', label: 'Purple', gradient: 'from-purple-600 to-pink-500' },
];

const EMOJI_OPTIONS = ['🎯', '⚡', '🚀', '🔥', '🌟', '🌱', '☕', '🧠'];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [motto, setMotto] = useState(profile.motto);
  const [avatarGradient, setAvatarGradient] = useState(profile.avatarGradient);
  const [avatarEmoji, setAvatarEmoji] = useState(profile.avatarEmoji || '🎯');
  const [isSaved, setIsSaved] = useState(false);

  // Live productivity statistics
  const totalTasks = useLiveQuery(() => db.tasks.count()) || 0;
  const completedTasks = useLiveQuery(() => db.tasks.where('completed').equals(1).count()) || 0;
  const totalHabits = useLiveQuery(() => db.habits.count()) || 0;
  const totalNotes = useLiveQuery(() => db.notes.count()) || 0;

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      name: name.trim() || 'User',
      email: email.trim(),
      motto: motto.trim(),
      avatarGradient,
      avatarEmoji,
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  const initialLetter = (name.trim()[0] || 'U').toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-6 text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <User className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              User Profile
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Avatar Preview Banner */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${avatarGradient} flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-500/20 shrink-0 relative`}>
            {initialLetter}
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-xs shadow-xs border border-slate-200 dark:border-slate-700">
              {avatarEmoji}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {name || 'Sahand'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {email || 'sahandabas2@gmail.com'}
            </p>
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium italic mt-0.5 truncate">
              "{motto || 'Make every day count'}"
            </p>
          </div>
        </div>

        {/* Productivity Statistics Grid */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="p-2.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-center">
            <div className="flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div className="text-base font-black text-slate-900 dark:text-white">
              {completedTasks}{totalTasks > 0 ? `/${totalTasks}` : ''}
            </div>
            <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
              Tasks Done
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 text-center">
            <div className="flex items-center justify-center text-amber-500 mb-1">
              <Flame className="w-3.5 h-3.5" />
            </div>
            <div className="text-base font-black text-slate-900 dark:text-white">
              {totalHabits}
            </div>
            <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
              Habits
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-center">
            <div className="flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-1">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <div className="text-base font-black text-slate-900 dark:text-white">
              {totalNotes}
            </div>
            <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
              Notes Logged
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Display Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full pl-9 pr-3.5 py-2 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full pl-9 pr-3.5 py-2 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Daily Motto / Goal
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Quote className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={motto}
                onChange={(e) => setMotto(e.target.value)}
                placeholder="e.g. Focus on progress, not perfection"
                className="w-full pl-9 pr-3.5 py-2 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          {/* Avatar Gradient Choice */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Avatar Color Style
            </label>
            <div className="flex items-center gap-2">
              {GRADIENT_OPTIONS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setAvatarGradient(g.gradient)}
                  className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${g.gradient} flex items-center justify-center text-white transition active:scale-95 ${
                    avatarGradient === g.gradient
                      ? 'ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-slate-900 scale-110'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  title={g.label}
                >
                  {avatarGradient === g.gradient && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Emoji Badge Choice */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Profile Icon Badge
            </label>
            <div className="flex items-center gap-1.5">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setAvatarEmoji(emoji)}
                  className={`w-7 h-7 rounded-xl text-xs flex items-center justify-center transition border active:scale-95 ${
                    avatarEmoji === emoji
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 scale-110 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Saved offline on device</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-1.5 text-xs font-semibold rounded-xl shadow-xs transition active:scale-95 flex items-center gap-1.5 text-white ${
                  isSaved
                    ? 'bg-emerald-600'
                    : 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 shadow-indigo-600/20'
                }`}
              >
                {isSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Profile</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
