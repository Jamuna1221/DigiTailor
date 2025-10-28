import express from 'express'
import {
  createRazorpayOrder,
  createRazorpayOrderModular,
  verifyPayment,
  handlePaymentFailure,
  getPaymentStatus
} from '../controllers/payment.controller.js'

const router = express.Router()

// Create Razorpay order for catalog orders
router.post('/create-order', createRazorpayOrder)

// Create Razorpay order for modular orders
router.post('/create-order-modular', createRazorpayOrderModular)

// Verify payment after successful payment
router.post('/verify', verifyPayment)

// Handle payment failure
router.post('/failure', handlePaymentFailure)

// Get payment status
router.get('/status/:orderId', getPaymentStatus)

export default router