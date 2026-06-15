import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '../utils/translations'
import type { TranslationKey } from '../utils/translations'

export type Language = 'es' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => any
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('portfolio-language')
    if (saved === 'es' || saved === 'en') return saved
    
    // Fallback to browser language if it is Spanish, otherwise English
    const browserLang = navigator.language.substring(0, 2)
    return browserLang === 'es' ? 'es' : 'en'
  })

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('portfolio-language', lang)
  }

  const t = (key: TranslationKey) => {
    const dict = translations[language]
    return dict[key] || translations['es'][key] || key
  }

  // Localized SEO Synchronization
  useEffect(() => {
    // 1. Dynamic HTML Lang attribute
    document.documentElement.lang = language;

    // 2. Dynamic localized browser tab title
    const localizedTitle = t('seoTitle');
    if (typeof localizedTitle === 'string') {
      document.title = localizedTitle;
    }

    // 3. Dynamic localized meta description
    const localizedDesc = t('seoDescription');
    if (typeof localizedDesc === 'string') {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', localizedDesc);
      }
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
