import Order from '../models/order.model.js'
import Razorpay from 'razorpay'
import crypto from 'crypto'

// Initialize Razorpay with your real keys
let razorpay = null

try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    })
    console.log('✅ Razorpay initialized with real keys')
  } else {
    console.warn('⚠️ Razorpay keys not found in environment variables')
  }
} catch (error) {
  console.error('❌ Failed to initialize Razorpay:', error.message)
}

// Create Razorpay order
export const createRazorpayOrder = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(500).json({
        success: false,
        message: 'Payment gateway not configured'
      })
    }

    const { amount, currency = 'INR' } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount provided'
      })
    }

    console.log('💰 Creating Razorpay order for amount:', amount)

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: `order_${Date.now()}`,
      payment_capture: 1
    }

    const razorpayOrder = await razorpay.orders.create(options)

    console.log('✅ Razorpay order created:', razorpayOrder.id)

    res.status(200).json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID
    })

  } catch (error) {
    console.error('💥 Razorpay order creation error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message
    })
  }
}

// Keep all your other controller functions as they were...


// Verify Razorpay payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    console.log('🔐 Verifying Razorpay payment:', razorpay_payment_id)

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification data'
      })
    }

    // Check if Razorpay secret is available
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'Payment verification not configured'
      })
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex')

    if (expectedSignature === razorpay_signature) {
      console.log('✅ Payment verified successfully')
      res.status(200).json({
        success: true,
        message: 'Payment verified successfully'
      })
    } else {
      console.log('❌ Payment verification failed - signature mismatch')
      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      })
    }

  } catch (error) {
    console.error('💥 Payment verification error:', error)
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    })
  }
}

// Create order
export const createOrder = async (req, res) => {
  try {
    console.log('📝 Creating new order for user:', req.user.id)
    console.log('📦 Order data:', req.body)

    const { items, shippingInfo, payment, customizations } = req.body

    // Validate required fields
    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'Order items are required'
      })
    }

    if (!shippingInfo) {
      return res.status(400).json({
        success: false,
        message: 'Shipping information is required'
      })
    }

    // Calculate pricing
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const delivery = 50
    const tax = 0
    const total = subtotal + delivery + tax

    // Create order
    const order = new Order({
      userId: req.user.id,
      items: items.map(item => ({
        ...item,
        customizations: customizations || {}
      })),
      shippingInfo,
      pricing: {
        subtotal,
        delivery,
        tax,
        total
      },
      payment: {
        method: payment?.method || 'razorpay',
        status: payment?.status || 'pending',
        razorpayOrderId: payment?.razorpayOrderId,
        razorpayPaymentId: payment?.razorpayPaymentId,
        razorpaySignature: payment?.razorpaySignature,
        transactionDate: payment?.razorpayPaymentId ? new Date() : null
      },
      status: 'placed',
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    })

    await order.save()

    console.log('✅ Order created successfully:', order.orderId)

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    })

  } catch (error) {
    console.error('💥 Create order error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    })
  }
}

// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    console.log('📋 Getting orders for user:', req.user.id)

    const orders = await Order.find({ userId: req.user.id })
      .populate('assignedTailor', 'firstName lastName email')
      .sort({ createdAt: -1 })

    console.log('✅ Found', orders.length, 'orders')

    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      data: orders
    })

  } catch (error) {
    console.error('💥 Get user orders error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    })
  }
}

// Get all orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    console.log('📋 Getting all orders for admin')

    const { status, page = 1, limit = 20 } = req.query

    const query = status && status !== 'all' ? { status } : {}
    
    const orders = await Order.find(query)
      .populate('userId', 'firstName lastName email phone')
      .populate('assignedTailor', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Order.countDocuments(query)

    console.log('✅ Found', orders.length, 'orders')

    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      data: orders,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('💥 Get all orders error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    })
  }
}

// Assign order to tailor (Admin)
export const assignOrderToTailor = async (req, res) => {
  try {
    const { orderId } = req.params
    const { tailorId, note } = req.body

    console.log('👨‍🎨 Assigning order', orderId, 'to tailor', tailorId)

    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    order.assignedTailor = tailorId
    order.status = 'assigned'
    order.statusHistory.push({
      status: 'assigned',
      timestamp: new Date(),
      note: note || `Assigned to tailor`,
      updatedBy: req.user.id
    })

    await order.save()

    console.log('✅ Order assigned successfully')

    res.status(200).json({
      success: true,
      message: 'Order assigned to tailor successfully',
      data: order
    })

  } catch (error) {
    console.error('💥 Assign order error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to assign order',
      error: error.message
    })
  }
}

// Update order status (Tailor/Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params
    const { status, note } = req.body

    console.log('🔄 Updating order', orderId, 'status to', status)

    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    // Check if user is authorized to update this order
    if (req.user.role !== 'admin' && order.assignedTailor?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      })
    }

    order.status = status
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Status updated to ${status}`,
      updatedBy: req.user.id
    })

    await order.save()

    console.log('✅ Order status updated successfully')

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    })

  } catch (error) {
    console.error('💥 Update order status error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    })
  }
}

// Get tailor orders
export const getTailorOrders = async (req, res) => {
  try {
    console.log('👨‍🎨 Getting orders for tailor:', req.user.id)

    const orders = await Order.find({ assignedTailor: req.user.id })
      .populate('userId', 'firstName lastName email phone')
      .sort({ createdAt: -1 })

    console.log('✅ Found', orders.length, 'orders for tailor')

    res.status(200).json({
      success: true,
      message: 'Tailor orders fetched successfully',
      data: orders
    })

  } catch (error) {
    console.error('💥 Get tailor orders error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tailor orders',
      error: error.message
    })
  }
}
