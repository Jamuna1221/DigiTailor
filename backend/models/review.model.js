import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  // User who wrote the review
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Order this review came from (for verification)
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  
  // Product being reviewed
  productId: {
    type: String, // Could be catalog item ID or custom design ID
    required: true
  },
  
  productName: {
    type: String,
    required: true
  },
  
  productType: {
    type: String,
    enum: ['catalog', 'custom_design', 'gallery'],
    required: true
  },
  
  productImage: {
    type: String, // Product main image URL
    required: false
  },
  
  // Review content
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  
  comment: {
    type: String,
    maxLength: 1000,
    trim: true
  },
  
  // Review images uploaded by customer
  images: [{
    url: String,
    filename: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Verification
  isVerifiedPurchase: {
    type: Boolean,
    default: true // Always true since reviews come from actual orders
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved' // Auto-approve for now, can add moderation later
  },
  
  // Helpful votes (for future enhancement)
  helpfulVotes: {
    type: Number,
    default: 0
  },
  
  // Admin response (optional)
  adminResponse: {
    message: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    respondedAt: Date
  }
}, {
  timestamps: true
})

// Indexes for efficient queries
reviewSchema.index({ productId: 1, createdAt: -1 }) // Get reviews for a product
reviewSchema.index({ userId: 1, createdAt: -1 }) // Get reviews by user
reviewSchema.index({ orderId: 1, productId: 1 }, { unique: true }) // Prevent duplicate reviews for same product in same order

// Virtual for user details (populated)
reviewSchema.virtual('userDetails', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
  select: 'firstName lastName profilePicture'
})

// Static method to get average rating for a product
reviewSchema.statics.getProductRating = async function(productId) {
  const result = await this.aggregate([
    {
      $match: { 
        productId: productId,
        status: 'approved'
      }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    }
  ])
  
  if (result.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    }
  }
  
  const data = result[0]
  
  // Count rating distribution
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  data.ratingDistribution.forEach(rating => {
    distribution[rating]++
  })
  
  return {
    averageRating: Math.round(data.averageRating * 10) / 10, // Round to 1 decimal
    totalReviews: data.totalReviews,
    ratingDistribution: distribution
  }
}

// Instance method to check if review can be edited
reviewSchema.methods.canBeEdited = function() {
  const daysSinceCreation = Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24))
  return daysSinceCreation <= 7 // Allow editing within 7 days
}

export default mongoose.model('Review', reviewSchema)