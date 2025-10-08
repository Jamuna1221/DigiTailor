import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ColorThemeContext = createContext({ 
  selectedTheme: 'blue', 
  setColorTheme: () => {},
  availableThemes: [],
  currentTheme: null
})

// Available color theme options with their color values
export const AVAILABLE_COLOR_THEMES = [
  {
    id: 'default',
    name: 'DigiTailor Default',
    displayName: 'DigiTailor Default',
    description: 'Original DigiTailor branding with purple-pink gradients',
    category: 'Original',
    colors: {
      primary: '#8b5cf6', // violet-500 (original DigiTailor primary)
      primaryLight: '#a855f7', // purple-500
      primaryDark: '#7c3aed', // violet-600
      secondary: '#ec4899', // pink-500
      accent: '#f472b6', // pink-400
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', // original purple-pink
      gradientHover: 'linear-gradient(135deg, #7c3aed 0%, #be185d 100%)'
    }
  },
  {
    id: 'blue',
    name: 'Ocean Blue',
    displayName: 'Ocean Blue',
    description: 'Professional and trustworthy, perfect for business',
    category: 'Classic',
    colors: {
      primary: '#1e40af', // blue-700
      primaryLight: '#3b82f6', // blue-500
      primaryDark: '#1e3a8a', // blue-800
      secondary: '#06b6d4', // cyan-500
      accent: '#0ea5e9', // sky-500
      gradient: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
      gradientHover: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)'
    }
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    displayName: 'Royal Purple',
    description: 'Creative and luxurious, great for premium brands',
    category: 'Creative',
    colors: {
      primary: '#7c3aed', // violet-600
      primaryLight: '#8b5cf6', // violet-500
      primaryDark: '#6d28d9', // violet-700
      secondary: '#a855f7', // purple-500
      accent: '#c084fc', // purple-400
      gradient: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
      gradientHover: 'linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%)'
    }
  },
  {
    id: 'emerald',
    name: 'Emerald Green',
    displayName: 'Emerald Green',
    description: 'Fresh and natural, perfect for eco-friendly brands',
    category: 'Nature',
    colors: {
      primary: '#059669', // emerald-600
      primaryLight: '#10b981', // emerald-500
      primaryDark: '#047857', // emerald-700
      secondary: '#06d6a0', // Custom green
      accent: '#34d399', // emerald-400
      gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      gradientHover: 'linear-gradient(135deg, #047857 0%, #059669 100%)'
    }
  },
  {
    id: 'orange',
    name: 'Sunset Orange',
    displayName: 'Sunset Orange',
    description: 'Energetic and warm, great for creative industries',
    category: 'Vibrant',
    colors: {
      primary: '#ea580c', // orange-600
      primaryLight: '#f97316', // orange-500
      primaryDark: '#c2410c', // orange-700
      secondary: '#fb923c', // orange-400
      accent: '#fdba74', // orange-300
      gradient: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
      gradientHover: 'linear-gradient(135deg, #c2410c 0%, #ea580c 100%)'
    }
  },
  {
    id: 'pink',
    name: 'Rose Pink',
    displayName: 'Rose Pink',
    description: 'Elegant and modern, perfect for fashion brands',
    category: 'Elegant',
    colors: {
      primary: '#e11d48', // rose-600
      primaryLight: '#f43f5e', // rose-500
      primaryDark: '#be123c', // rose-700
      secondary: '#fb7185', // rose-400
      accent: '#fda4af', // rose-300
      gradient: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)',
      gradientHover: 'linear-gradient(135deg, #be123c 0%, #e11d48 100%)'
    }
  },
  {
    id: 'teal',
    name: 'Ocean Teal',
    displayName: 'Ocean Teal',
    description: 'Calm and sophisticated, great for wellness brands',
    category: 'Calm',
    colors: {
      primary: '#0d9488', // teal-600
      primaryLight: '#14b8a6', // teal-500
      primaryDark: '#0f766e', // teal-700
      secondary: '#5eead4', // teal-300
      accent: '#2dd4bf', // teal-400
      gradient: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
      gradientHover: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)'
    }
  },
  {
    id: 'indigo',
    name: 'Deep Indigo',
    displayName: 'Deep Indigo',
    description: 'Professional and modern, perfect for tech companies',
    category: 'Professional',
    colors: {
      primary: '#4338ca', // indigo-600
      primaryLight: '#6366f1', // indigo-500
      primaryDark: '#3730a3', // indigo-700
      secondary: '#818cf8', // indigo-400
      accent: '#a5b4fc', // indigo-300
      gradient: 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)',
      gradientHover: 'linear-gradient(135deg, #3730a3 0%, #4338ca 100%)'
    }
  },
  {
    id: 'red',
    name: 'Crimson Red',
    displayName: 'Crimson Red',
    description: 'Bold and powerful, great for making statements',
    category: 'Bold',
    colors: {
      primary: '#dc2626', // red-600
      primaryLight: '#ef4444', // red-500
      primaryDark: '#b91c1c', // red-700
      secondary: '#f87171', // red-400
      accent: '#fca5a5', // red-300
      gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
      gradientHover: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)'
    }
  }
]

export function ColorThemeProvider({ children }) {
  const [selectedTheme, setSelectedTheme] = useState(() => {
    const saved = localStorage.getItem('digitailor_color_theme')
    if (saved) {
      const savedTheme = AVAILABLE_COLOR_THEMES.find(theme => theme.id === saved)
      return savedTheme ? saved : 'default'
    }
    return 'default' // Default to original DigiTailor theme
  })

  const setColorTheme = (themeId) => {
    const theme = AVAILABLE_COLOR_THEMES.find(t => t.id === themeId)
    if (theme) {
      setSelectedTheme(themeId)
      localStorage.setItem('digitailor_color_theme', themeId)
      
      // Apply theme colors to CSS custom properties
      const root = document.documentElement
      root.style.setProperty('--theme-primary', theme.colors.primary)
      root.style.setProperty('--theme-primary-light', theme.colors.primaryLight)
      root.style.setProperty('--theme-primary-dark', theme.colors.primaryDark)
      root.style.setProperty('--theme-secondary', theme.colors.secondary)
      root.style.setProperty('--theme-accent', theme.colors.accent)
      root.style.setProperty('--theme-gradient', theme.colors.gradient)
      root.style.setProperty('--theme-gradient-hover', theme.colors.gradientHover)
      
      // Add theme class to body
      document.body.className = document.body.className.replace(/theme-\w+/g, '')
      document.body.classList.add(`theme-${themeId}`)
    }
  }

  useEffect(() => {
    // Apply saved theme on mount
    const theme = AVAILABLE_COLOR_THEMES.find(t => t.id === selectedTheme)
    if (theme) {
      const root = document.documentElement
      root.style.setProperty('--theme-primary', theme.colors.primary)
      root.style.setProperty('--theme-primary-light', theme.colors.primaryLight)
      root.style.setProperty('--theme-primary-dark', theme.colors.primaryDark)
      root.style.setProperty('--theme-secondary', theme.colors.secondary)
      root.style.setProperty('--theme-accent', theme.colors.accent)
      root.style.setProperty('--theme-gradient', theme.colors.gradient)
      root.style.setProperty('--theme-gradient-hover', theme.colors.gradientHover)
      
      // Add theme class to body
      document.body.className = document.body.className.replace(/theme-\w+/g, '')
      document.body.classList.add(`theme-${selectedTheme}`)
    }
  }, [selectedTheme])

  const currentTheme = AVAILABLE_COLOR_THEMES.find(t => t.id === selectedTheme) || AVAILABLE_COLOR_THEMES[0]

  const value = useMemo(() => ({ 
    selectedTheme, 
    setColorTheme,
    currentTheme,
    availableThemes: AVAILABLE_COLOR_THEMES
  }), [selectedTheme, currentTheme])

  return (
    <ColorThemeContext.Provider value={value}>
      {children}
    </ColorThemeContext.Provider>
  )
}

export function useColorTheme() {
  const context = useContext(ColorThemeContext)
  if (!context) {
    throw new Error('useColorTheme must be used within a ColorThemeProvider')
  }
  return context
}