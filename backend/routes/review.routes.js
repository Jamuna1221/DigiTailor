import express from 'express'
import {
  createProductReview,
  getProductReviews,
  getUserReviews,
  getReviewableProducts,
  updateReview,
  deleteReview
} from '../controllers/review.controller.js'
import { protect } from '../middlewares/auth.middleware.js'
import { uploadReviewImages, handleUploadError } from '../middleware/upload.js'

const router = express.Router()

// Public routes (no authentication required)
// Get all reviews for a specific product - for product detail pages
router.get('/product/:productId', getProductReviews)

// Protected routes (authentication required)
router.use(protect)

// Get reviewable products for a delivered order
router.get('/order/:orderId/products', getReviewableProducts)

// Create a review for a specific product in an order
router.post('/order/:orderId/product/:productId', 
  uploadReviewImages, 
  handleUploadError, 
  createProductReview
)

// Get all reviews by the authenticated user
router.get('/my-reviews', getUserReviews)

// Update a review (within 7 days)
router.put('/:reviewId', updateReview)

// Delete a review
router.delete('/:reviewId', deleteReview)

export default router