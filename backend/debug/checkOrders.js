import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Order from '../models/order.model.js'

// Load environment variables
dotenv.config()

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/digitailor')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err))

export const debugOrderStatus = async (orderId = null) => {
  try {
    console.log('\n🔍 ======= ORDER DEBUG TOOL =======')
    
    if (orderId) {
      // Check specific order
      console.log(`🔍 Checking specific order: ${orderId}`)
      const order = await Order.findById(orderId).populate('userId', 'firstName lastName email')
      
      if (!order) {
        console.log('❌ Order not found')
        return
      }
      
      console.log(`📦 Order Details:`)
      console.log(`   - Order ID: ${order.orderId || order._id}`)
      console.log(`   - Status: ${order.status}`)
      console.log(`   - Delivery Token: ${order.deliveryToken || 'NOT SET'}`)
      console.log(`   - Customer: ${order.userId.firstName} ${order.userId.lastName}`)
      console.log(`   - Email: ${order.userId.email}`)
      console.log(`   - Created: ${order.createdAt}`)
      
      if (order.deliveryToken) {
        console.log(`🔗 Confirmation URL: http://localhost:5000/api/orders/confirm-delivery/${order.deliveryToken}`)
      }
      
    } else {
      // Check all orders with out_for_delivery status
      console.log('🔍 Checking all orders with "out_for_delivery" status...')
      const orders = await Order.find({ status: 'out_for_delivery' })
        .populate('userId', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .limit(5)
      
      console.log(`📊 Found ${orders.length} orders with "out_for_delivery" status`)
      
      orders.forEach((order, index) => {
        console.log(`\n📦 Order ${index + 1}:`)
        console.log(`   - Order ID: ${order.orderId || order._id}`)
        console.log(`   - Status: ${order.status}`)
        console.log(`   - Delivery Token: ${order.deliveryToken || 'NOT SET'}`)
        console.log(`   - Customer: ${order.userId.firstName} ${order.userId.lastName}`)
        console.log(`   - Email: ${order.userId.email}`)
        
        if (order.deliveryToken) {
          console.log(`   - Confirmation URL: http://localhost:5000/api/orders/confirm-delivery/${order.deliveryToken}`)
        } else {
          console.log(`   - ⚠️  Missing delivery token!`)
        }
      })
    }
    
    console.log('\n=================================')
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// If run directly
if (process.argv[2]) {
  const orderId = process.argv[2]
  await debugOrderStatus(orderId)
  process.exit(0)
} else {
  await debugOrderStatus()
  process.exit(0)
}