import Review from '../models/review.model.js'
import Order from '../models/order.model.js'
import path from 'path'
import fs from 'fs'

// Create a new review for a specific product in an order
export const createProductReview = async (req, res) => {
  try {
    const { orderId, productId } = req.params
    const { rating, comment, productName, productType, productImage } = req.body
    const userId = req.user.id
    const files = req.files // From multer middleware

    console.log(`🌟 Creating review for product ${productId} in order ${orderId}`)

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      })
    }

    if (!productName || !productType) {
      return res.status(400).json({
        success: false,
        message: 'Product name and type are required'
      })
    }

    // Verify order exists and belongs to user
    const order = await Order.findOne({
      _id: orderId,
      userId: userId,
      status: 'delivered' // Only allow reviews for delivered orders
    })

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found, not delivered, or does not belong to you'
      })
    }

    // Verify product exists in the order
    const productInOrder = order.items.find(item => 
      item.id === productId || 
      item._id?.toString() === productId ||
      item.productId === productId
    )

    if (!productInOrder) {
      return res.status(400).json({
        success: false,
        message: 'Product not found in this order'
      })
    }

    // Check if review already exists for this product in this order
    const existingReview = await Review.findOne({
      orderId: orderId,
      productId: productId,
      userId: userId
    })

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      })
    }

    // Process uploaded images
    const reviewImages = []
    if (files && files.length > 0) {
      if (files.length > 5) {
        return res.status(400).json({
          success: false,
          message: 'Maximum 5 images allowed per review'
        })
      }

      files.forEach(file => {
        reviewImages.push({
          url: `/uploads/reviews/${file.filename}`,
          filename: file.filename,
          uploadedAt: new Date()
        })
      })
    }

    // Create the review
    const review = new Review({
      userId: userId,
      orderId: orderId,
      productId: productId,
      productName: productName,
      productType: productType,
      productImage: productImage,
      rating: Number(rating),
      comment: comment?.trim() || '',
      images: reviewImages,
      isVerifiedPurchase: true,
      status: 'approved' // Auto-approve for now
    })

    await review.save()

    // Update order to track which products have been reviewed
    if (!order.reviewsSubmitted) {
      order.reviewsSubmitted = []
    }
    if (!order.reviewsSubmitted.includes(productId)) {
      order.reviewsSubmitted.push(productId)
      await order.save()
    }

    console.log(`✅ Review created successfully for product ${productId}`)

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: {
        reviewId: review._id,
        productId: productId,
        rating: review.rating,
        imageCount: reviewImages.length
      }
    })

  } catch (error) {
    console.error('❌ Error creating product review:', error)
    res.status(500).json({
      success: false,
      message: 'Error creating review',
      error: error.message
    })
  }
}

// Get all reviews for a specific product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params
    const { page = 1, limit = 10, sort = 'newest' } = req.query

    console.log(`📋 Fetching reviews for product: ${productId}`)

    // Determine sort order
    let sortCriteria = {}
    switch (sort) {
      case 'newest':
        sortCriteria = { createdAt: -1 }
        break
      case 'oldest':
        sortCriteria = { createdAt: 1 }
        break
      case 'highest':
        sortCriteria = { rating: -1, createdAt: -1 }
        break
      case 'lowest':
        sortCriteria = { rating: 1, createdAt: -1 }
        break
      default:
        sortCriteria = { createdAt: -1 }
    }

    // Get reviews with pagination
    const reviews = await Review.find({
      productId: productId,
      status: 'approved'
    })
    .populate('userId', 'firstName lastName profilePicture')
    .sort(sortCriteria)
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))

    // Get total count
    const totalReviews = await Review.countDocuments({
      productId: productId,
      status: 'approved'
    })

    // Get product rating summary
    const ratingSummary = await Review.getProductRating(productId)

    res.json({
      success: true,
      data: {
        reviews: reviews,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(totalReviews / Number(limit)),
          totalReviews: totalReviews,
          limit: Number(limit)
        },
        ratingSummary: ratingSummary
      }
    })

  } catch (error) {
    console.error('❌ Error fetching product reviews:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    })
  }
}

// Get reviews by a specific user
export const getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id
    const { page = 1, limit = 10 } = req.query

    const reviews = await Review.find({ userId: userId })
      .populate('orderId', 'orderId createdAt')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))

    const totalReviews = await Review.countDocuments({ userId: userId })

    res.json({
      success: true,
      data: {
        reviews: reviews,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(totalReviews / Number(limit)),
          totalReviews: totalReviews,
          limit: Number(limit)
        }
      }
    })

  } catch (error) {
    console.error('❌ Error fetching user reviews:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching user reviews',
      error: error.message
    })
  }
}

// Get reviewable products for a delivered order
export const getReviewableProducts = async (req, res) => {
  try {
    const { orderId } = req.params
    const userId = req.user.id

    console.log(`🔍 Getting reviewable products for order: ${orderId}`)

    // Find the order
    const order = await Order.findOne({
      _id: orderId,
      userId: userId,
      status: 'delivered',
      deliveryConfirmedAt: { $exists: true } // Must be delivery confirmed
    })

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found, not delivered, or delivery not confirmed'
      })
    }

    // Get already submitted reviews for this order
    const existingReviews = await Review.find({
      orderId: orderId,
      userId: userId
    }).select('productId')

    const reviewedProductIds = existingReviews.map(review => review.productId)

    // Build reviewable products list
    const reviewableProducts = order.items.map(item => {
      const productId = item.id || item._id?.toString() || item.productId
      
      return {
        productId: productId,
        productName: item.name,
        productType: item.type || 'catalog',
        productImage: item.image,
        price: item.price,
        quantity: item.quantity,
        category: item.category,
        isReviewed: reviewedProductIds.includes(productId),
        canReview: !reviewedProductIds.includes(productId)
      }
    })

    res.json({
      success: true,
      data: {
        orderId: orderId,
        orderDate: order.createdAt,
        deliveryDate: order.deliveryConfirmedAt,
        products: reviewableProducts,
        totalProducts: reviewableProducts.length,
        reviewedCount: reviewedProductIds.length,
        pendingReviews: reviewableProducts.length - reviewedProductIds.length
      }
    })

  } catch (error) {
    console.error('❌ Error fetching reviewable products:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching reviewable products',
      error: error.message
    })
  }
}

// Update a review (within 7 days)
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params
    const { rating, comment } = req.body
    const userId = req.user.id

    const review = await Review.findOne({
      _id: reviewId,
      userId: userId
    })

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      })
    }

    if (!review.canBeEdited()) {
      return res.status(400).json({
        success: false,
        message: 'Review can only be edited within 7 days of submission'
      })
    }

    if (rating) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        })
      }
      review.rating = Number(rating)
    }

    if (comment !== undefined) {
      review.comment = comment.trim()
    }

    await review.save()

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review
    })

  } catch (error) {
    console.error('❌ Error updating review:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating review',
      error: error.message
    })
  }
}

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params
    const userId = req.user.id

    const review = await Review.findOne({
      _id: reviewId,
      userId: userId
    })

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      })
    }

    // Delete associated images
    if (review.images && review.images.length > 0) {
      review.images.forEach(image => {
        const imagePath = path.join(process.cwd(), 'uploads', 'reviews', image.filename)
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath)
        }
      })
    }

    await Review.findByIdAndDelete(reviewId)

    // Update order to remove from reviewsSubmitted
    await Order.findByIdAndUpdate(review.orderId, {
      $pull: { reviewsSubmitted: review.productId }
    })

    res.json({
      success: true,
      message: 'Review deleted successfully'
    })

  } catch (error) {
    console.error('❌ Error deleting review:', error)
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message
    })
  }
}

export default {
  createProductReview,
  getProductReviews,
  getUserReviews,
  getReviewableProducts,
  updateReview,
  deleteReview
}