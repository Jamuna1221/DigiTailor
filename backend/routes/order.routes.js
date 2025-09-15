import express from 'express'
import { 
  createRazorpayOrder,
  verifyPayment,
  createOrder,
  getUserOrders,
  getAllOrders,
  assignOrderToTailor,
  updateOrderStatus,
  getTailorOrders
} from '../controllers/order.controller.js'
import { protect, authorize } from '../middlewares/auth.middleware.js'

const router = express.Router()

// All routes require authentication
router.use(protect)

// Payment routes
router.post('/create-razorpay-order', createRazorpayOrder)
router.post('/verify-payment', verifyPayment)

// Order routes
router.post('/', createOrder)
router.get('/user/:userId', getUserOrders)

// Admin routes
router.get('/admin/all', authorize('admin'), getAllOrders)
router.put('/admin/:orderId/assign', authorize('admin'), assignOrderToTailor)

// Tailor routes
router.get('/tailor', authorize('tailor', 'admin'), getTailorOrders)

// Status update (Admin and assigned Tailor)
router.put('/:orderId/status', updateOrderStatus)

export default router
