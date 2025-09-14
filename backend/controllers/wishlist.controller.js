import Wishlist from '../models/wishlist.model.js'

// Get user's wishlist
export const getWishlist = async (req, res) => {
  try {
    console.log('📋 Getting wishlist for user:', req.user.id)

    let wishlist = await Wishlist.findOne({ userId: req.user.id })

    if (!wishlist) {
      console.log('📋 No wishlist found, creating empty one')
      wishlist = new Wishlist({ userId: req.user.id, items: [] })
      await wishlist.save()
    }

    // For now, return simple format since we don't have a Product model to populate
    const wishlistItems = wishlist.items.map(item => ({
      _id: item._id,
      productId: item.productId,
      addedAt: item.addedAt
    }))

    console.log('✅ Wishlist fetched:', wishlistItems.length, 'items')

    res.status(200).json({
      success: true,
      message: 'Wishlist fetched successfully',
      data: wishlistItems
    })

  } catch (error) {
    console.error('💥 Get wishlist error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlist',
      error: error.message
    })
  }
}

// Add item to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body
    console.log('❤️ Adding to wishlist - User:', req.user.id, 'Product:', productId)

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      })
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ userId: req.user.id })
    
    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user.id, items: [] })
    }

    // Check if item already exists
    const existingItem = wishlist.items.find(
      item => item.productId.toString() === productId.toString()
    )

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: 'Item already in wishlist'
      })
    }

    // Add item to wishlist
    wishlist.items.push({ productId })
    await wishlist.save()

    console.log('✅ Item added to wishlist successfully')

    res.status(200).json({
      success: true,
      message: 'Item added to wishlist successfully'
    })

  } catch (error) {
    console.error('💥 Add to wishlist error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to add item to wishlist',
      error: error.message
    })
  }
}

// Remove item from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params
    console.log('🗑️ Removing from wishlist - User:', req.user.id, 'Product:', productId)

    const wishlist = await Wishlist.findOne({ userId: req.user.id })

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      })
    }

    // Remove item from wishlist
    const initialLength = wishlist.items.length
    wishlist.items = wishlist.items.filter(
      item => item.productId.toString() !== productId.toString()
    )

    if (wishlist.items.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in wishlist'
      })
    }

    await wishlist.save()

    console.log('✅ Item removed from wishlist successfully')

    res.status(200).json({
      success: true,
      message: 'Item removed from wishlist successfully'
    })

  } catch (error) {
    console.error('💥 Remove from wishlist error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from wishlist',
      error: error.message
    })
  }
}

// Clear entire wishlist
export const clearWishlist = async (req, res) => {
  try {
    console.log('🗑️ Clearing wishlist for user:', req.user.id)

    const wishlist = await Wishlist.findOne({ userId: req.user.id })

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      })
    }

    wishlist.items = []
    await wishlist.save()

    console.log('✅ Wishlist cleared successfully')

    res.status(200).json({
      success: true,
      message: 'Wishlist cleared successfully'
    })

  } catch (error) {
    console.error('💥 Clear wishlist error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to clear wishlist',
      error: error.message
    })
  }
}

// Check if item is in wishlist
export const checkWishlistItem = async (req, res) => {
  try {
    const { productId } = req.params
    
    const wishlist = await Wishlist.findOne({ userId: req.user.id })
    
    if (!wishlist) {
      return res.status(200).json({
        success: true,
        isInWishlist: false
      })
    }

    const isInWishlist = wishlist.items.some(
      item => item.productId.toString() === productId.toString()
    )

    res.status(200).json({
      success: true,
      isInWishlist
    })

  } catch (error) {
    console.error('💥 Check wishlist error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to check wishlist',
      error: error.message
    })
  }
}
