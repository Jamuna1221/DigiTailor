import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import i18n from '../i18n'

const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  languages: [],
})

const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'ta', label: 'தமிழ்', short: 'TA' },
  { code: 'hi', label: 'हिंदी', short: 'HI' },
  { code: 'te', label: 'తెలుగు', short: 'TE' },
  { code: 'ml', label: 'മലയാളം', short: 'ML' },
  { code: 'kn', label: 'ಕನ್ನಡ', short: 'KN' },
]

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('digitailor_lang')
    return saved || 'en'
  })

  useEffect(() => {
    // apply to <html lang="...">
    document.documentElement.setAttribute('lang', language)
    localStorage.setItem('digitailor_lang', language)
    i18n.changeLanguage(language)
  }, [language])

  const setLanguage = (code) => setLanguageState(code)

  const value = useMemo(() => ({ language, setLanguage, languages: LANGUAGE_OPTIONS }), [language])

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
