import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

// Import models
import Order from '../models/order.model.js'
import User from '../models/user.model.js'

async function testDeliveryTokens() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Find orders that are shipped/out_for_delivery with delivery tokens
    const ordersWithTokens = await Order.find({
      status: { $in: ['out_for_delivery', 'shipped'] },
      deliveryToken: { $ne: null, $exists: true }
    }).populate('userId', 'email firstName lastName')

    console.log(`\n🔍 Found ${ordersWithTokens.length} orders with valid delivery tokens:`)

    for (const order of ordersWithTokens) {
      if (order.userId) {
        console.log(`\n📦 Order: ${order.orderId || order._id}`)
        console.log(`   - Status: ${order.status}`)
        console.log(`   - User: ${order.userId.firstName} ${order.userId.lastName}`)
        console.log(`   - Email: ${order.userId.email}`)
        console.log(`   - Token: ${order.deliveryToken.substring(0, 10)}...${order.deliveryToken.substring(-4)}`)
        console.log(`   - Test URL: ${process.env.BACKEND_URL || 'http://localhost:5000'}/api/orders/confirm-delivery/${order.deliveryToken}`)
      }
    }

    console.log(`\n✅ All ${ordersWithTokens.length} orders have valid delivery tokens`)
    console.log('🎯 You can now test delivery confirmation by visiting one of the URLs above')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await mongoose.disconnect()
    console.log('📤 Disconnected from MongoDB')
  }
}

testDeliveryTokens()