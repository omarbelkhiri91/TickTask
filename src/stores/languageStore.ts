import { create } from 'zustand';
import { translations, Language, TranslationKey } from '../i18n/translations';

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: 'ar',
  setLanguage: (lang) => set({ language: lang }),
}));

// Helper functions
export const t = (key: TranslationKey): string => {
  const lang = useLanguageStore.getState().language;
  return translations[lang][key] || key;
};

export const isRTL = (): boolean => {
  return useLanguageStore.getState().language === 'ar';
};
