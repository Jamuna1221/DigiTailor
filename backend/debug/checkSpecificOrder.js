import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Order from '../models/order.model.js'
import User from '../models/user.model.js'

// Load environment variables
dotenv.config()

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/digitailor')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err))

async function checkSpecificOrder() {
  try {
    const orderId = '69eba6d29d1ff09408191f9f7' // From your URL
    
    console.log('\n🔍 ======= SPECIFIC ORDER DEBUG =======')
    console.log(`🔍 Looking for order: ${orderId}`)
    
    const order = await Order.findById(orderId).populate('userId', 'firstName lastName email')
    
    if (!order) {
      console.log('❌ Order not found with this exact ID')
      
      // Try to find by partial match
      console.log('🔍 Searching for similar order IDs...')
      const similarOrders = await Order.find({ 
        _id: { $regex: orderId.substring(0, 10) } 
      }).limit(5)
      
      if (similarOrders.length > 0) {
        console.log('📦 Found similar orders:')
        similarOrders.forEach(order => {
          console.log(`   - ${order._id} (${order.orderId})`)
        })
      }
      process.exit(0)
    }
    
    console.log('✅ Order found!')
    console.log(`📦 Order Details:`)
    console.log(`   - Order ID: ${order.orderId}`)
    console.log(`   - Database ID: ${order._id}`)
    console.log(`   - Status: ${order.status}`)
    console.log(`   - Delivery Token: ${order.deliveryToken || 'NOT SET'}`)
    console.log(`   - Customer: ${order.userId.firstName} ${order.userId.lastName}`)
    console.log(`   - Email: ${order.userId.email}`)
    console.log(`   - Created: ${order.createdAt}`)
    
    if (order.deliveryToken) {
      console.log(`🔗 Confirmation URL: http://localhost:5000/api/orders/confirm-delivery/${order.deliveryToken}`)
    } else {
      console.log(`⚠️  Missing delivery token - needs to be fixed!`)
    }
    
    console.log('\n=================================')
    
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

// Run the check
checkSpecificOrder()