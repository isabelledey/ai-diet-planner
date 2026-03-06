'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { translations, type Language, type TranslationKey } from '@/lib/i18n/dictionary'

const STORAGE_KEY = 'nutrisnap_language'

type LanguageContextValue = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null
    if (stored === 'en' || stored === 'he' || stored === 'ru') {
      setLanguageState(stored)
    }
  }, [])

  useEffect(() => {
    const dir = language === 'he' ? 'rtl' : 'ltr'
    document.documentElement.lang = language
    document.documentElement.dir = dir
    document.body.dir = dir
    localStorage.setItem(STORAGE_KEY, language)
  }, [language])

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage: setLanguageState,
      t: (key, vars) => {
        let text = translations[language][key] ?? translations.en[key] ?? key
        if (vars) {
          Object.entries(vars).forEach(([varKey, varValue]) => {
            text = text.replaceAll(`{${varKey}}`, String(varValue))
          })
        }
        return text
      },
    }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useTranslation() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider.')
  }
  return context
}
