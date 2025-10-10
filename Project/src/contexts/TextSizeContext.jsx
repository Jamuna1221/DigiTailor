import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const TextSizeContext = createContext({ 
  textSize: 'medium', 
  setTextSize: () => {},
  availableTextSizes: [],
  currentTextSize: null
})

// Available text size options
export const AVAILABLE_TEXT_SIZES = [
  {
    id: 'small',
    name: 'Small',
    displayName: 'Small',
    description: 'Compact text for more content',
    scale: 0.875, // 87.5% of base size
    baseSize: '14px'
  },
  {
    id: 'medium',
    name: 'Medium',
    displayName: 'Medium',
    description: 'Standard comfortable reading size',
    scale: 1, // 100% of base size
    baseSize: '16px'
  },
  {
    id: 'large',
    name: 'Large',
    displayName: 'Large',
    description: 'Larger text for better readability',
    scale: 1.125, // 112.5% of base size
    baseSize: '18px'
  },
  {
    id: 'extra-large',
    name: 'Extra Large',
    displayName: 'Extra Large',
    description: 'Very large text for accessibility',
    scale: 1.25, // 125% of base size
    baseSize: '20px'
  }
]

export function TextSizeProvider({ children }) {
  const [textSize, setSelectedTextSize] = useState(() => {
    const saved = localStorage.getItem('digitailor_text_size')
    if (saved) {
      const savedSize = AVAILABLE_TEXT_SIZES.find(size => size.id === saved)
      return savedSize ? saved : 'medium'
    }
    return 'medium' // Default to medium
  })

  const setTextSize = (sizeId) => {
    const size = AVAILABLE_TEXT_SIZES.find(s => s.id === sizeId)
    if (size) {
      setSelectedTextSize(sizeId)
      localStorage.setItem('digitailor_text_size', sizeId)
      
      // Apply text size to CSS custom properties
      const root = document.documentElement
      root.style.setProperty('--text-scale', size.scale.toString())
      root.style.setProperty('--text-base-size', size.baseSize)
      
      // Apply different text sizes
      root.style.setProperty('--text-xs', `${0.75 * size.scale}rem`)
      root.style.setProperty('--text-sm', `${0.875 * size.scale}rem`)
      root.style.setProperty('--text-base', `${1 * size.scale}rem`)
      root.style.setProperty('--text-lg', `${1.125 * size.scale}rem`)
      root.style.setProperty('--text-xl', `${1.25 * size.scale}rem`)
      root.style.setProperty('--text-2xl', `${1.5 * size.scale}rem`)
      root.style.setProperty('--text-3xl', `${1.875 * size.scale}rem`)
      root.style.setProperty('--text-4xl', `${2.25 * size.scale}rem`)
      root.style.setProperty('--text-5xl', `${3 * size.scale}rem`)
      root.style.setProperty('--text-6xl', `${3.75 * size.scale}rem`)
      root.style.setProperty('--text-7xl', `${4.5 * size.scale}rem`)
    }
  }

  useEffect(() => {
    // Apply saved text size on mount
    const size = AVAILABLE_TEXT_SIZES.find(s => s.id === textSize)
    if (size) {
      const root = document.documentElement
      root.style.setProperty('--text-scale', size.scale.toString())
      root.style.setProperty('--text-base-size', size.baseSize)
      
      // Apply different text sizes
      root.style.setProperty('--text-xs', `${0.75 * size.scale}rem`)
      root.style.setProperty('--text-sm', `${0.875 * size.scale}rem`)
      root.style.setProperty('--text-base', `${1 * size.scale}rem`)
      root.style.setProperty('--text-lg', `${1.125 * size.scale}rem`)
      root.style.setProperty('--text-xl', `${1.25 * size.scale}rem`)
      root.style.setProperty('--text-2xl', `${1.5 * size.scale}rem`)
      root.style.setProperty('--text-3xl', `${1.875 * size.scale}rem`)
      root.style.setProperty('--text-4xl', `${2.25 * size.scale}rem`)
      root.style.setProperty('--text-5xl', `${3 * size.scale}rem`)
      root.style.setProperty('--text-6xl', `${3.75 * size.scale}rem`)
      root.style.setProperty('--text-7xl', `${4.5 * size.scale}rem`)
    }
  }, [textSize])

  const currentTextSize = AVAILABLE_TEXT_SIZES.find(s => s.id === textSize) || AVAILABLE_TEXT_SIZES[1]

  const value = useMemo(() => ({ 
    textSize, 
    setTextSize,
    currentTextSize,
    availableTextSizes: AVAILABLE_TEXT_SIZES
  }), [textSize, currentTextSize])

  return (
    <TextSizeContext.Provider value={value}>
      {children}
    </TextSizeContext.Provider>
  )
}

export function useTextSize() {
  const context = useContext(TextSizeContext)
  if (!context) {
    throw new Error('useTextSize must be used within a TextSizeProvider')
  }
  return context
}