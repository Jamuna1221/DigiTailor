import express from 'express'
import {
  createOrder,
  getAllOrdersForAdmin,
  getOrdersForTailor,
  getOrdersForUser,
  updateOrderByTailor,
  getOrderDetails,
  addReview,
  addAlterationRequest
} from '../controllers/order.controller.js'

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

// Add these routes to your order.routes.js
router.get('/:orderId', getOrderDetails)
router.post('/:orderId/review', addReview)
router.post('/:orderId/alteration', addAlterationRequest)

export default router
