import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import i18n from '../../i18n'

export default function LanguageSelector() {
  const { language, setLanguage, languages } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onClick(e) {
      if (!ref.current) return
      if (!ref.current.contains(e.target)) setOpen(false)
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const current = languages.find(l => l.code === language) || languages[0]

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="inline-flex items-center gap-2 h-10 px-3 rounded-xl bg-white/80 dark:bg-slate-800/80 dark:text-white shadow-md border border-gray-100 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3a9 9 0 100 18 9 9 0 000-18zm0 0c2.485 0 4.5 4.03 4.5 9S14.485 21 12 21 7.5 16.97 7.5 12 9.515 3 12 3zm-9 9h18"/></svg>
        <span className="text-xs font-semibold tracking-wide">{current.short}</span>
        <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 mt-2 w-44 rounded-xl bg-white dark:bg-slate-900 shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50"
        >
          {languages.map((opt) => (
            <li key={opt.code}>
              <button
                role="option"
                aria-selected={language === opt.code}
                onClick={() => {
                  setLanguage(opt.code)
                  i18n.changeLanguage(opt.code)
                  setOpen(false)
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                  language === opt.code
                    ? 'bg-purple-600/10 text-purple-700 dark:text-purple-300'
                    : 'text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-bold">{opt.short}</span>
                  {opt.label}
                </span>
                {language === opt.code && (
                  <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
