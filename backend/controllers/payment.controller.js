import Razorpay from 'razorpay'
import crypto from 'crypto'
import Order from '../models/order.model.js'
import ModularOrder from '../models/modularOrder.model.js'
import { allocateTailorToOrder } from '../services/tailorAllocation.js'

// Initialize Razorpay lazily
let razorpay = null

const getRazorpayInstance = () => {
  if (!razorpay) {
    console.log('🔧 Initializing Razorpay with:')
    console.log('Key ID:', process.env.RAZORPAY_KEY_ID ? 'Present' : 'Missing')
    console.log('Key Secret:', process.env.RAZORPAY_KEY_SECRET ? 'Present' : 'Missing')
    
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay keys are missing from environment variables')
    }
    
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
    
    console.log('✅ Razorpay initialized successfully')
  }
  return razorpay
}

// Create Razorpay order for catalog orders
export const createRazorpayOrder = async (req, res) => {
  try {
    console.log('🚀 Creating Razorpay order for catalog...')
    console.log('📤 Request body:', req.body)

    const {
      customer,
      items,
      subtotal,
      tax = 0,
      deliveryCharges = 50,
      total,
      customerNotes = '',
      shippingInfo
    } = req.body

    // Validation
    if (!customer || !items || items.length === 0 || !total) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: customer, items, total'
      })
    }

    // Create Razorpay order
    const options = {
      amount: total * 100, // Amount in paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: {
        customer_id: customer,
        order_type: 'catalog',
        items_count: items.length
      }
    }

    console.log('💳 Creating Razorpay order with options:', options)
    const razorpayInstance = getRazorpayInstance()
    const razorpayOrder = await razorpayInstance.orders.create(options)
    console.log('✅ Razorpay order created:', razorpayOrder.id)

    // Store order temporarily in session/cache or create pending order
    const orderData = {
      userId: customer,
      items: items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        category: item.category,
        image: item.image,
        customizations: item.customizations || {}
      })),
      shippingInfo: shippingInfo ? {
        fullName: shippingInfo.fullName,
        email: shippingInfo.email,
        phone: shippingInfo.phone,
        address: {
          street: shippingInfo.address?.street || shippingInfo.street,
          city: shippingInfo.address?.city || shippingInfo.city,
          state: shippingInfo.address?.state || shippingInfo.state,
          zipCode: shippingInfo.address?.zipCode || shippingInfo.zipCode
        },
        specialInstructions: shippingInfo.specialInstructions || customerNotes
      } : {
        fullName: 'Not provided',
        email: 'not@provided.com',
        phone: '0000000000',
        address: {
          street: 'Not provided',
          city: 'Not provided',
          state: 'Not provided',
          zipCode: '000000'
        }
      },
      pricing: {
        subtotal: Number(subtotal),
        delivery: Number(deliveryCharges),
        tax: Number(tax),
        total: Number(total)
      },
      payment: {
        method: 'razorpay',
        status: 'pending',
        razorpayOrderId: razorpayOrder.id
      },
      status: 'placed'
    }

    // Create pending order in database
    const newOrder = new Order(orderData)
    const savedOrder = await newOrder.save()

    res.status(200).json({
      success: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        orderId: savedOrder._id,
        key: process.env.RAZORPAY_KEY_ID
      }
    })

  } catch (error) {
    console.error('❌ Error creating Razorpay order:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message
    })
  }
}

// Create Razorpay order for modular orders
export const createRazorpayOrderModular = async (req, res) => {
  try {
    console.log('🚀 Creating Razorpay order for modular design...')
    console.log('📤 Request body:', req.body)

    const {
      customerInfo,
      selections,
      totalPrice,
      basePrice,
      shippingInfo
    } = req.body

    // Validation
    if (!customerInfo || !selections || selections.length === 0 || !totalPrice) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: customerInfo, selections, totalPrice'
      })
    }

    // Create Razorpay order
    const options = {
      amount: totalPrice * 100, // Amount in paise
      currency: 'INR',
      receipt: `modular_${Date.now()}`,
      notes: {
        customer_name: customerInfo.name,
        order_type: 'modular',
        selections_count: selections.length
      }
    }

    console.log('💳 Creating Razorpay modular order with options:', options)
    const razorpayInstance = getRazorpayInstance()
    const razorpayOrder = await razorpayInstance.orders.create(options)
    console.log('✅ Razorpay modular order created:', razorpayOrder.id)

    // Create pending modular order
    const modularOrderData = {
      customerInfo,
      selections,
      totalPrice,
      basePrice: basePrice || 180,
      paymentMethod: 'razorpay',
      status: 'placed',
      razorpayOrderId: razorpayOrder.id,
      shippingInfo
    }

    const newModularOrder = new ModularOrder(modularOrderData)
    const savedModularOrder = await newModularOrder.save()

    res.status(200).json({
      success: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        orderId: savedModularOrder._id,
        key: process.env.RAZORPAY_KEY_ID
      }
    })

  } catch (error) {
    console.error('❌ Error creating Razorpay modular order:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create modular payment order',
      error: error.message
    })
  }
}

// Verify Razorpay payment and complete order
export const verifyPayment = async (req, res) => {
  try {
    console.log('🔐 Verifying Razorpay payment...')
    console.log('📤 Request body:', req.body)

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id,
      order_type = 'catalog'
    } = req.body

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex')

    console.log('🔐 Signature verification:')
    console.log('Expected:', expectedSignature)
    console.log('Received:', razorpay_signature)

    if (expectedSignature !== razorpay_signature) {
      console.log('❌ Invalid signature')
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      })
    }

    console.log('✅ Signature verified successfully')

    let updatedOrder = null
    let assignedTailorId = null

    if (order_type === 'modular') {
      // Update modular order
      updatedOrder = await ModularOrder.findById(order_id)
      
      if (!updatedOrder) {
        return res.status(404).json({
          success: false,
          message: 'Modular order not found'
        })
      }

      // Allocate tailor for modular order
      assignedTailorId = await allocateTailorToOrder([{
        name: 'Custom Design',
        category: 'Modular Design',
        customizations: { type: 'modular' }
      }])

      updatedOrder.payment = {
        method: 'razorpay',
        status: 'paid',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        transactionDate: new Date()
      }
      updatedOrder.status = assignedTailorId ? 'assigned' : 'confirmed'
      updatedOrder.assignedTailor = assignedTailorId
      updatedOrder.allocationTimestamp = assignedTailorId ? new Date() : null

      // Set estimated delivery
      const estimatedDelivery = new Date()
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 7)
      updatedOrder.estimatedDelivery = estimatedDelivery

    } else {
      // Update catalog order
      updatedOrder = await Order.findById(order_id)
      
      if (!updatedOrder) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        })
      }

      // Allocate tailor for catalog order
      assignedTailorId = await allocateTailorToOrder(updatedOrder.items)

      updatedOrder.payment.status = 'paid'
      updatedOrder.payment.razorpayPaymentId = razorpay_payment_id
      updatedOrder.payment.razorpaySignature = razorpay_signature
      updatedOrder.payment.transactionDate = new Date()
      updatedOrder.status = assignedTailorId ? 'assigned' : 'confirmed'
      updatedOrder.assignedTailor = assignedTailorId
      updatedOrder.allocationTimestamp = assignedTailorId ? new Date() : null

      // Set estimated delivery
      const estimatedDelivery = new Date()
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 7)
      updatedOrder.estimatedDelivery = estimatedDelivery
    }

    await updatedOrder.save()

    console.log('🎉 Payment verified and order updated successfully')
    console.log(`📦 Order ID: ${updatedOrder.orderId || updatedOrder._id}`)
    console.log(`👨‍🎨 Tailor assigned: ${assignedTailorId ? 'Yes' : 'No'}`)

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        orderNumber: updatedOrder.orderNumber || updatedOrder.orderId || updatedOrder._id,
        orderId: updatedOrder._id,
        status: updatedOrder.status,
        estimatedDelivery: updatedOrder.estimatedDelivery,
        paymentStatus: 'paid'
      }
    })

  } catch (error) {
    console.error('❌ Error verifying payment:', error)
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    })
  }
}

// Handle payment failure
export const handlePaymentFailure = async (req, res) => {
  try {
    console.log('❌ Handling payment failure...')
    const { order_id, order_type = 'catalog', reason } = req.body

    let order = null

    if (order_type === 'modular') {
      order = await ModularOrder.findById(order_id)
      if (order) {
        order.payment = order.payment || {}
        order.payment.status = 'failed'
        order.payment.failureReason = reason
        order.status = 'cancelled'
      }
    } else {
      order = await Order.findById(order_id)
      if (order) {
        order.payment.status = 'failed'
        order.payment.failureReason = reason
        order.status = 'cancelled'
      }
    }

    if (order) {
      await order.save()
      console.log(`💥 Order ${order._id} marked as failed`)
    }

    res.status(200).json({
      success: true,
      message: 'Payment failure recorded'
    })

  } catch (error) {
    console.error('❌ Error handling payment failure:', error)
    res.status(500).json({
      success: false,
      message: 'Error handling payment failure',
      error: error.message
    })
  }
}

// Get payment status
export const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params
    const { orderType = 'catalog' } = req.query

    let order = null

    if (orderType === 'modular') {
      order = await ModularOrder.findById(orderId)
    } else {
      order = await Order.findById(orderId)
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    res.status(200).json({
      success: true,
      data: {
        paymentStatus: order.payment?.status || 'pending',
        orderStatus: order.status,
        razorpayOrderId: order.payment?.razorpayOrderId || order.razorpayOrderId,
        transactionDate: order.payment?.transactionDate
      }
    })

  } catch (error) {
    console.error('❌ Error getting payment status:', error)
    res.status(500).json({
      success: false,
      message: 'Error getting payment status',
      error: error.message
    })
  }
}