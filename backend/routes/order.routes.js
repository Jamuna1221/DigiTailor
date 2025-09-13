import express from 'express'
import {
  createOrder,
  getAllOrdersForAdmin,
  getOrdersForUser,
  updateOrderStatus
} from '../controllers/order.controller.js'

const router = express.Router()

// Public - Create order
router.post('/', createOrder)

// Admin - Get all orders with tailor details
router.get('/admin/all', getAllOrdersForAdmin)

// User - Get user orders (no tailor info)
router.get('/user/:userId', getOrdersForUser)

// Admin - Update order status
router.put('/admin/:id', updateOrderStatus)

export default router
