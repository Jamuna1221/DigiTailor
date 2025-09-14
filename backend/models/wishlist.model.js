import mongoose from 'mongoose'

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    productId: {
      type: String, // Since your designs use string IDs
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true })

// Index for better performance
wishlistSchema.index({ userId: 1 })
wishlistSchema.index({ 'items.productId': 1 })

export default mongoose.model('Wishlist', wishlistSchema)
