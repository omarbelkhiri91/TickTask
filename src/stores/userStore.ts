import { create } from 'zustand';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string | null;
  bio: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other' | '';
  occupation: string;
  company: string;
  location: string;
  website: string;
  socialLinks: {
    twitter: string;
    linkedin: string;
    github: string;
    instagram: string;
  };
  preferences: {
    defaultCategory: string;
    dailyGoal: number;
    weekStartDay: 'sunday' | 'monday' | 'saturday';
  };
  stats: {
    totalTasksCompleted: number;
    streakDays: number;
    memberSince: string;
  };
}

interface UserStore {
  user: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
  updateSocialLinks: (links: Partial<UserProfile['socialLinks']>) => void;
  updatePreferences: (prefs: Partial<UserProfile['preferences']>) => void;
  setAvatar: (uri: string | null) => void;
  incrementTasksCompleted: () => void;
}

const defaultUser: UserProfile = {
  id: '1',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  avatar: null,
  bio: '',
  birthDate: '',
  gender: '',
  occupation: '',
  company: '',
  location: '',
  website: '',
  socialLinks: {
    twitter: '',
    linkedin: '',
    github: '',
    instagram: '',
  },
  preferences: {
    defaultCategory: 'personal',
    dailyGoal: 5,
    weekStartDay: 'sunday',
  },
  stats: {
    totalTasksCompleted: 0,
    streakDays: 0,
    memberSince: new Date().toISOString(),
  },
};

export const useUserStore = create<UserStore>((set) => ({
  user: defaultUser,

  updateProfile: (data) => {
    set((state) => ({
      user: { ...state.user, ...data },
    }));
  },

  updateSocialLinks: (links) => {
    set((state) => ({
      user: {
        ...state.user,
        socialLinks: { ...state.user.socialLinks, ...links },
      },
    }));
  },

  updatePreferences: (prefs) => {
    set((state) => ({
      user: {
        ...state.user,
        preferences: { ...state.user.preferences, ...prefs },
      },
    }));
  },

  setAvatar: (uri) => {
    set((state) => ({
      user: { ...state.user, avatar: uri },
    }));
  },

  incrementTasksCompleted: () => {
    set((state) => ({
      user: {
        ...state.user,
        stats: {
          ...state.user.stats,
          totalTasksCompleted: state.user.stats.totalTasksCompleted + 1,
        },
      },
    }));
  },
}));
