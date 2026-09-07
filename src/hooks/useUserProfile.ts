import { useState, useEffect } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  initials: string;
  avatarGradient: string;
  avatarEmoji?: string;
  motto: string;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Sahand',
  email: 'sahandabas2@gmail.com',
  initials: 'S',
  avatarGradient: 'from-indigo-600 to-violet-500',
  avatarEmoji: '🎯',
  motto: 'Make every day count and stay focused.',
};

const STORAGE_KEY = 'dayflow_user_profile';

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore json parse error
    }
    return DEFAULT_PROFILE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (err) {
      console.error('Failed to save user profile to localStorage:', err);
    }
  }, [profile]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      // auto compute initials if name changed
      if (updates.name && !updates.initials) {
        const parts = updates.name.trim().split(/\s+/);
        if (parts.length >= 2) {
          next.initials = (parts[0][0] + parts[1][0]).toUpperCase();
        } else if (parts[0]) {
          next.initials = parts[0][0].toUpperCase();
        }
      }
      return next;
    });
  };

  return {
    profile,
    updateProfile,
  };
}
