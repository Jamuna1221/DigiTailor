import mongoose from 'mongoose'
import Order from '../models/order.model.js'
import User from '../models/user.model.js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const debugDeliveryTokens = async () => {
  try {
    console.log('🔍 ======= DEBUG DELIVERY TOKENS =======')
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Find all orders that have delivery tokens
    const ordersWithTokens = await Order.find({
      deliveryToken: { $exists: true, $ne: null }
    }).populate('userId', 'firstName lastName email')
    
    console.log(`\n📦 Found ${ordersWithTokens.length} orders with delivery tokens:\n`)
    
    ordersWithTokens.forEach((order, index) => {
      console.log(`--- Order ${index + 1} ---`)
      console.log(`🆔 Order ID: ${order.orderId || order._id}`)
      console.log(`👤 Customer: ${order.userId.firstName} ${order.userId.lastName}`)
      console.log(`📧 Email: ${order.userId.email}`)
      console.log(`📋 Status: ${order.status}`)
      console.log(`🔑 Token: ${order.deliveryToken}`)
      console.log(`✅ Confirmed At: ${order.deliveryConfirmedAt || 'Not confirmed'}`)
      console.log(`🔗 Confirmation URL: ${process.env.BACKEND_URL || 'http://localhost:5000'}/api/orders/confirm-delivery/${order.deliveryToken}`)
      console.log(`📅 Created: ${order.createdAt}`)
      console.log('')
    })

    // Also check for orders in out_for_delivery status without tokens
    const outForDeliveryOrders = await Order.find({
      status: { $in: ['out_for_delivery', 'shipped'] }
    }).populate('userId', 'firstName lastName email')

    console.log(`\n🚚 Found ${outForDeliveryOrders.length} orders in out_for_delivery/shipped status:\n`)
    
    outForDeliveryOrders.forEach((order, index) => {
      console.log(`--- Delivery Order ${index + 1} ---`)
      console.log(`🆔 Order ID: ${order.orderId || order._id}`)
      console.log(`👤 Customer: ${order.userId.firstName} ${order.userId.lastName}`)
      console.log(`📋 Status: ${order.status}`)
      console.log(`🔑 Has Token: ${!!order.deliveryToken}`)
      if (order.deliveryToken) {
        console.log(`🔑 Token: ${order.deliveryToken}`)
        console.log(`🔗 URL: ${process.env.BACKEND_URL || 'http://localhost:5000'}/api/orders/confirm-delivery/${order.deliveryToken}`)
      }
      console.log('')
    })

    await mongoose.disconnect()
    console.log('🔌 Disconnected from MongoDB')
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Error:', error)
    await mongoose.disconnect()
    process.exit(1)
  }
}

console.log('🎯 DigiTailor Delivery Token Debug')
console.log('=================================')
debugDeliveryTokens()