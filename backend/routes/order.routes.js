import express from 'express'
import {
  createOrder,
  getAllOrdersForAdmin,
  getOrdersForTailor,
  getOrdersForUser,
  updateOrderByTailor,
  getOrderDetails,
  addReview,
  addAlterationRequest,
  confirmDelivery,
  addReviewWithImages,
  getDeliveryStatus,
  testDeliveryEmail
} from '../controllers/order.controller.js'
import { uploadReviewImages, handleUploadError } from '../middleware/upload.js'

const router = express.Router()

// Public - Create order (auto-allocates tailor)
router.post('/', createOrder)

// Admin - Get all orders with tailor details
router.get('/admin/all', getAllOrdersForAdmin)

// Tailor - Get assigned orders
router.get('/tailor/:tailorId', getOrdersForTailor)

// User - Get user orders (no tailor info)
router.get('/user/:userId', getOrdersForUser)

// Tailor - Update order status/notes
router.put('/tailor/:orderId', updateOrderByTailor)

// Original routes
router.get('/:orderId', getOrderDetails)
router.post('/:orderId/review', addReview)
router.post('/:orderId/alteration', addAlterationRequest)

// Delivery status route (protected - needs auth)
router.get('/:orderId/delivery-status', getDeliveryStatus)

// Enhanced review route with image upload
router.post('/:orderId/review-with-images', 
  uploadReviewImages, 
  handleUploadError, 
  addReviewWithImages
)

// 🧪 DEBUG: Test delivery email route
router.post('/:orderId/test-delivery-email', testDeliveryEmail)

export default router
