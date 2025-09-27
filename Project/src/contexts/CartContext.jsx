/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'
import { useCallback } from 'react'
// ✅ Create context
const CartContext = createContext()

// ✅ Custom hook - this is fine to export
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

// ✅ Get user-specific cart key
const getCartKey = () => {
  const user = JSON.parse(localStorage.getItem('digitailor_user') || '{}')
  const userId = user.id || user._id
  return userId ? `digitailor_cart_${userId}` : 'digitailor_cart_guest'
}

// ✅ Main provider component - default export only
function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentUser, setCurrentUser] = useState(null) // ✅ Track current user

  // ✅ Load cart based on current user
  const loadUserCart = () => {
    const cartKey = getCartKey()
    console.log('🔑 Loading cart with key:', cartKey)
    
    const savedCart = localStorage.getItem(cartKey)
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart)
          console.log('✅ Cart loaded from localStorage:', parsedCart)
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
        localStorage.removeItem(cartKey)
        setCartItems([])
      }
    } else {
      setCartItems([])
    }
  }

  // ✅ Initial cart load
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('digitailor_user') || '{}')
    setCurrentUser(user)
    loadUserCart()
    setIsLoaded(true)
  }, [])

  // ✅ Listen for user changes (login/logout)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'digitailor_user') {
        console.log('👤 User changed, reloading cart')
        const newUser = e.newValue ? JSON.parse(e.newValue) : {}
        setCurrentUser(newUser)
        loadUserCart()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // ✅ Save cart whenever it changes (user-specific key)
  useEffect(() => {
    if (isLoaded) {
      const cartKey = getCartKey()
      localStorage.setItem(cartKey, JSON.stringify(cartItems))
      console.log('💾 Cart saved to localStorage with key:', cartKey, cartItems)
    }
  }, [cartItems, isLoaded])

  // ✅ Switch cart when user logs in/out
  const switchUserCart = useCallback((newUser) => {
  console.log('🔄 Switching cart for new user:', newUser?.id || newUser?._id)
  setCurrentUser(newUser)
  loadUserCart()
}, []);
  const addToCart = (item) => {
    // ✅ Check if user is logged in
    const user = JSON.parse(localStorage.getItem('digitailor_user') || '{}')
    
    if (!user.id && !user._id) {
      const shouldLogin = window.confirm(
        'Please login to add items to your cart. Would you like to login now?'
      )
      if (shouldLogin) {
        window.location.href = '/login'
      }
      return false
    }

    console.log('🛒 CartContext received item for user:', user.id || user._id, item)
    
    const sanitizedItem = {
      id: item.id || item._id || `temp-${Date.now()}`,
      name: item.name || item.title || 'Custom Design',
      price: parseFloat(item.price) || parseFloat(item.basePrice) || 0,
      image: item.image || item.primaryImage || item.imageUrl || 'https://via.placeholder.com/300x300?text=Design',
      category: item.category || 'Custom Design',
      description: item.description || 'Beautiful custom tailored design',
      quantity: parseInt(item.quantity) || 1,
      designId: item.designId || item._id || item.id,
      fabric: item.fabric || 'Cotton',
      color: item.color || 'Default',
      size: item.size || 'Custom',
      difficulty: item.difficulty || 'Medium',
      estimatedDays: item.estimatedDays || 7
    }

    console.log('🔄 Sanitized cart item:', sanitizedItem)

    if (!sanitizedItem.id) {
      console.error('❌ Cannot add item: missing ID')
      return false
    }

    if (sanitizedItem.price <= 0) {
      console.error('❌ Cannot add item: invalid price', sanitizedItem.price)
      return false
    }

    try {
      setCartItems(prev => {
        const existingItemIndex = prev.findIndex(cartItem => cartItem.id === sanitizedItem.id)
        
        if (existingItemIndex !== -1) {
          const updatedCart = prev.map((cartItem, index) =>
            index === existingItemIndex
              ? { ...cartItem, quantity: cartItem.quantity + sanitizedItem.quantity }
              : cartItem
          )
          console.log('✅ Updated existing item in cart')
          return updatedCart
        } else {
          const newCart = [...prev, sanitizedItem]
          console.log('✅ Added new item to cart')
          return newCart
        }
      })
      
      setIsCartOpen(true)
      return true
    } catch (error) {
      console.error('💥 Error adding item to cart:', error)
      return false
    }
  }

  const removeFromCart = (itemId) => {
    console.log('🗑️ Removing item from cart:', itemId)
    setCartItems(prev => {
      const filtered = prev.filter(item => item.id !== itemId)
      console.log('✅ Item removed. New cart:', filtered)
      return filtered
    })
  }

  const updateQuantity = (itemId, quantity) => {
    console.log('📊 Updating quantity:', itemId, quantity)
    
    if (quantity <= 0) {
      removeFromCart(itemId)
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === itemId 
            ? { ...item, quantity: parseInt(quantity) || 1 }
            : item
        )
      )
    }
  }

  const clearCart = () => {
    console.log('🧹 Clearing cart')
    setCartItems([])
    // ✅ Remove user-specific cart
    const cartKey = getCartKey()
    localStorage.removeItem(cartKey)
  }

  const getCartTotal = () => {
    const total = cartItems.reduce((sum, item) => {
      const itemTotal = (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0)
      return sum + itemTotal
    }, 0)
    return total
  }

  const getCartItemsCount = () => {
    const count = cartItems.reduce((total, item) => total + (parseInt(item.quantity) || 0), 0)
    return count
  }

  // ✅ Functions your Header expects
  const getTotalItems = () => {
    return getCartItemsCount()
  }

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  const closeCart = () => {
    setIsCartOpen(false)
  }

  const openCart = () => {
    setIsCartOpen(true)
  }

  // ✅ Context value with all functions
  const contextValue = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    isCartOpen,
    toggleCart,
    closeCart,
    openCart,
    getTotalItems,
    switchUserCart, // ✅ Add this for manual cart switching
    currentUser
  }

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
}

// ✅ Only default export - this makes Fast Refresh happy
export default CartProvider
