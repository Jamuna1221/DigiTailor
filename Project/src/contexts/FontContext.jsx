import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const FontContext = createContext({ 
  selectedFont: 'Inter', 
  setFont: () => {},
  availableFonts: []
})

// Available font options with their display names and CSS font-family values
export const AVAILABLE_FONTS = [
  {
    id: 'inter',
    name: 'Inter',
    displayName: 'Inter',
    fontFamily: "'Inter', sans-serif",
    category: 'Sans Serif',
    description: 'Modern and clean, great for readability'
  },
  {
    id: 'poppins',
    name: 'Poppins',
    displayName: 'Poppins',
    fontFamily: "'Poppins', sans-serif",
    category: 'Sans Serif',
    description: 'Geometric and friendly, perfect for headings'
  },
  {
    id: 'roboto',
    name: 'Roboto',
    displayName: 'Roboto',
    fontFamily: "'Roboto', sans-serif",
    category: 'Sans Serif',
    description: 'Google\'s signature font, balanced and versatile'
  },
  {
    id: 'opensans',
    name: 'Open Sans',
    displayName: 'Open Sans',
    fontFamily: "'Open Sans', sans-serif",
    category: 'Sans Serif',
    description: 'Neutral and friendly, excellent for body text'
  },
  {
    id: 'montserrat',
    name: 'Montserrat',
    displayName: 'Montserrat',
    fontFamily: "'Montserrat', sans-serif",
    category: 'Sans Serif',
    description: 'Elegant and modern, inspired by urban typography'
  },
  {
    id: 'lato',
    name: 'Lato',
    displayName: 'Lato',
    fontFamily: "'Lato', sans-serif",
    category: 'Sans Serif',
    description: 'Humanist with a warm feeling'
  },
  {
    id: 'playfair',
    name: 'Playfair Display',
    displayName: 'Playfair Display',
    fontFamily: "'Playfair Display', serif",
    category: 'Serif',
    description: 'Elegant serif, perfect for luxury brands'
  },
  {
    id: 'merriweather',
    name: 'Merriweather',
    displayName: 'Merriweather',
    fontFamily: "'Merriweather', serif",
    category: 'Serif',
    description: 'Readable serif designed for screens'
  },
  {
    id: 'sourcesans',
    name: 'Source Sans Pro',
    displayName: 'Source Sans Pro',
    fontFamily: "'Source Sans Pro', sans-serif",
    category: 'Sans Serif',
    description: 'Clean and professional'
  },
  {
    id: 'nunito',
    name: 'Nunito',
    displayName: 'Nunito',
    fontFamily: "'Nunito', sans-serif",
    category: 'Sans Serif',
    description: 'Rounded and friendly'
  }
]

export function FontProvider({ children }) {
  const [selectedFont, setSelectedFont] = useState(() => {
    const saved = localStorage.getItem('digitailor_font')
    if (saved) {
      const savedFont = AVAILABLE_FONTS.find(font => font.id === saved)
      return savedFont ? saved : 'inter'
    }
    return 'inter' // Default to Inter
  })

  const setFont = (fontId) => {
    const font = AVAILABLE_FONTS.find(f => f.id === fontId)
    if (font) {
      setSelectedFont(fontId)
      localStorage.setItem('digitailor_font', fontId)
      
      // Apply font to document root
      document.documentElement.style.setProperty('--selected-font-family', font.fontFamily)
      
      // Also apply to body for immediate effect
      document.body.style.fontFamily = font.fontFamily
    }
  }

  useEffect(() => {
    // Apply saved font on mount
    const font = AVAILABLE_FONTS.find(f => f.id === selectedFont)
    if (font) {
      document.documentElement.style.setProperty('--selected-font-family', font.fontFamily)
      document.body.style.fontFamily = font.fontFamily
    }
  }, [selectedFont])

  const currentFont = AVAILABLE_FONTS.find(f => f.id === selectedFont) || AVAILABLE_FONTS[0]

  const value = useMemo(() => ({ 
    selectedFont, 
    setFont,
    currentFont,
    availableFonts: AVAILABLE_FONTS
  }), [selectedFont, currentFont])

  return (
    <FontContext.Provider value={value}>
      {children}
    </FontContext.Provider>
  )
}

export function useFont() {
  const context = useContext(FontContext)
  if (!context) {
    throw new Error('useFont must be used within a FontProvider')
  }
  return context
}