import React, { createContext, useContext, useState, useEffect } from 'react'

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`
const WishlistContext = createContext()

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider')
  }
  return context
}

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Add to wishlist
  const addToWishlist = async (productId) => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/wishlist/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId })
      })

      const data = await response.json()
      
      if (data.success) {
        fetchWishlist() // Refresh wishlist
        return { success: true, message: data.message }
      } else {
        return { success: false, message: data.message }
      }
    } catch (fetchError) {
      console.error('Add to wishlist error:', fetchError)
      return { success: false, message: 'Failed to add to wishlist' }
    } finally {
      setIsLoading(false)
    }
  }

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/wishlist/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      
      if (data.success) {
        setWishlistItems(prev => prev.filter(item => item.productId !== productId))
        return { success: true, message: data.message }
      } else {
        return { success: false, message: data.message }
      }
    } catch (removeError) {
      console.error('Remove from wishlist error:', removeError)
      return { success: false, message: 'Failed to remove from wishlist' }
    } finally {
      setIsLoading(false)
    }
  }

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.productId === productId)
  }

  // Fetch wishlist
  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(`${API_BASE_URL}/wishlist`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      
      if (data.success) {
        setWishlistItems(data.data)
      }
    } catch (fetchError) {
      console.error('Error fetching wishlist:', fetchError)
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [])

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    fetchWishlist,
    isLoading
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}
