import Wishlist from '../models/wishlist.model.js'
import User from '../models/user.model.js'

// Get user's wishlist
export const getWishlist = async (req, res) => {
  try {
    console.log('📋 Getting wishlist for user:', req.user.id)

    let wishlist = await Wishlist.findOne({ userId: req.user.id })
      .populate('items.productId', 'name price images category description')

    if (!wishlist) {
      console.log('📋 No wishlist found, creating empty one')
      wishlist = new Wishlist({ userId: req.user.id, items: [] })
      await wishlist.save()
    }

    // Format the response
    const wishlistItems = wishlist.items.map(item => ({
      _id: item._id,
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      image: item.productId.images?.[0] || '/placeholder-image.jpg',
      category: item.productId.category,
      description: item.productId.description,
      addedAt: item.addedAt
    }))

    res.status(200).json({
      success: true,
      message: 'Wishlist fetched successfully',
      data: wishlistItems
    })

  } catch (error) {
    console.error('💥 Get wishlist error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlist'
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
      message: 'Failed to add item to wishlist'
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
      message: 'Failed to remove item from wishlist'
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
      message: 'Failed to clear wishlist'
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
      message: 'Failed to check wishlist'
    })
  }
}
