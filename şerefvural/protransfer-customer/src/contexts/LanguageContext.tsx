'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { safeLocalStorage, isClient } from '@/utils/hydration';

type Language = 'en' | 'tr' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [translations, setTranslations] = useState<Record<string, any>>({});

  // Load translations
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const translation = await import(`@/locales/${language}.json`);
        setTranslations(translation.default);
      } catch (error) {
        console.error('Failed to load translations:', error);
        // Fallback to English
        const fallback = await import('@/locales/en.json');
        setTranslations(fallback.default);
      }
    };

    loadTranslations();
  }, [language]);

  // Load language from localStorage on mount
  useEffect(() => {
    if (isClient) {
      const savedLanguage = safeLocalStorage.getItem('language') as Language;
      if (savedLanguage && ['en', 'tr', 'ar'].includes(savedLanguage)) {
        setLanguageState(savedLanguage);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    
    if (isClient) {
      safeLocalStorage.setItem('language', lang);
      
      // Update document direction for Arabic
      if (lang === 'ar') {
        document.documentElement.dir = 'rtl';
        document.documentElement.lang = 'ar';
      } else {
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = lang;
      }
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: Record<string, any> | string = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
