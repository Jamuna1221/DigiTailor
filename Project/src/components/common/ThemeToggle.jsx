import { useTheme } from '../../contexts/ThemeContext'

export default function ThemeToggle({ showLabel = true, placement = 'right' }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="relative inline-flex items-center">
      {showLabel && (
        <div className={`hidden xl:block absolute ${placement === 'right' ? 'right-full mr-3' : 'left-full ml-3'} top-1/2 -translate-y-1/2`}>
          <div className="flex items-center">
            {placement === 'right' ? (
              <svg width="22" height="22" viewBox="0 0 24 24" className="text-gray-400">
                <path fill="currentColor" d="M24 12H5l6-6l-1.4-1.4L1.2 13l8.4 8.4L11 20l-6-6h19z"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" className="text-gray-400 rotate-180">
                <path fill="currentColor" d="M24 12H5l6-6l-1.4-1.4L1.2 13l8.4 8.4L11 20l-6-6h19z"/>
              </svg>
            )}
            <div className="rounded-xl bg-white/90 dark:bg-slate-800/90 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 shadow-md border border-gray-100 dark:border-slate-700">
              Theme Toggle (Switch between Light and Dark mode)
            </div>
          </div>
        </div>
      )}

      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className={`relative inline-flex items-center justify-center h-11 w-11 rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
          ${isDark ? 'bg-gradient-to-br from-indigo-700 to-slate-800 text-yellow-200' : 'bg-gradient-to-br from-blue-50 to-sky-100 text-yellow-500'} 
          dark:shadow-slate-900/50`}
      >
        {isDark ? (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.79 1.8-1.79zm10.45 14.32l1.79 1.79 1.79-1.79-1.79-1.79-1.79 1.79zM12 4V1h-0v3h0zm0 19v-3h-0v3h0zM4 12H1v0h3v0zm19 0h-3v0h3v0zM6.76 19.16l-1.8 1.79-1.79-1.79 1.79-1.79 1.8 1.79zM19.16 6.76l1.79-1.79-1.79-1.79-1.79 1.79 1.79 1.79zM12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
        )}
        <span className={`absolute inset-0 rounded-full ${isDark ? 'shadow-inner shadow-indigo-900/50' : 'shadow-inner shadow-white/60'}`}></span>
      </button>
    </div>
  )
}
