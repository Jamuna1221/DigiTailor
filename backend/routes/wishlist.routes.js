import express from 'express'
import { 
  getWishlist, 
  addToWishlist, 
  removeFromWishlist, 
  clearWishlist,
  checkWishlistItem 
} from '../controllers/wishlist.controller.js'
import { protect } from '../middlewares/auth.middleware.js'

const router = express.Router()

// All wishlist routes require authentication
router.use(protect)

// Get user's wishlist
router.get('/', getWishlist)

// Add item to wishlist
router.post('/add', addToWishlist)

// Remove item from wishlist
router.delete('/remove/:productId', removeFromWishlist)

// Clear entire wishlist
router.delete('/clear', clearWishlist)

// Check if item is in wishlist
router.get('/check/:productId', checkWishlistItem)

export default router
