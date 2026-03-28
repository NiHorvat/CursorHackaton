import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { translate } from './translations'

const STORAGE_KEY = 'zagreb-events-locale'

const LanguageContext = createContext(null)

/** @returns {{ locale: 'hr' | 'en', setLocale: (l: 'hr' | 'en') => void, toggleLocale: () => void, t: (path: string, vars?: Record<string, string | number>) => string, intlLocale: string }} */
export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY)
      if (s === 'en' || s === 'hr') return s
    } catch {
      /* ignore */
    }
    return 'hr'
  })

  const setLocale = useCallback((next) => {
    setLocaleState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  const toggleLocale = useCallback(() => {
    const next = locale === 'hr' ? 'en' : 'hr'
    setLocale(next)
  }, [locale, setLocale])

  useEffect(() => {
    document.documentElement.lang = locale === 'en' ? 'en' : 'hr'
  }, [locale])

  const intlLocale = locale === 'en' ? 'en-GB' : 'hr-HR'

  const t = useCallback(
    (path, vars) => translate(locale, path, vars),
    [locale],
  )

  const value = useMemo(
    () => ({ locale, setLocale, toggleLocale, t, intlLocale }),
    [locale, setLocale, toggleLocale, t, intlLocale],
  )

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return ctx
}
