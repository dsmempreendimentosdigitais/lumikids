'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, LanguageOption, TranslationDictionary, SUPPORTED_LANGUAGES, TRANSLATIONS } from '@/locales';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: keyof TranslationDictionary, fallback?: string) => string;
  currentLanguageOption: LanguageOption;
  languages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'pt',
  setLanguage: () => {},
  t: (key) => key,
  currentLanguageOption: SUPPORTED_LANGUAGES[0],
  languages: SUPPORTED_LANGUAGES,
});

const STORAGE_KEY = 'lumikids_language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>('pt');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage;
      if (saved && ['pt', 'en', 'es', 'fr', 'it'].includes(saved)) {
        setLanguageState(saved);
        document.documentElement.lang = saved;
      }
    } catch (e) {
      // Storage access error or SSR
    }
  }, []);

  const setLanguage = (newLang: SupportedLanguage) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.documentElement.lang = newLang;
    } catch (e) {}
  };

  const currentLanguageOption = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const t = (key: keyof TranslationDictionary, fallback?: string): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.pt;
    const value = dict[key];
    if (value) return value;
    const ptValue = TRANSLATIONS.pt[key];
    if (ptValue) return ptValue;
    return fallback || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currentLanguageOption, languages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
