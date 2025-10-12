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

async function checkAllOrders() {
  try {
    console.log('\n🔍 ======= ALL ORDERS DEBUG =======')
    
    // Get all orders
    const orders = await Order.find({})
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(10)
    
    console.log(`📊 Found ${orders.length} total orders`)
    
    if (orders.length === 0) {
      console.log('❌ No orders found in database')
      process.exit(0)
    }
    
    orders.forEach((order, index) => {
      console.log(`\n📦 Order ${index + 1}:`)
      console.log(`   - Order ID: ${order.orderId || order._id}`)
      console.log(`   - Status: ${order.status}`)
      console.log(`   - Delivery Token: ${order.deliveryToken || 'NOT SET'}`)
      console.log(`   - Customer: ${order.userId?.firstName || 'N/A'} ${order.userId?.lastName || 'N/A'}`)
      console.log(`   - Email: ${order.userId?.email || 'N/A'}`)
      console.log(`   - Created: ${order.createdAt}`)
      
      if (order.status === 'out_for_delivery') {
        if (order.deliveryToken) {
          console.log(`   - 🔗 Confirmation URL: http://localhost:5000/api/orders/confirm-delivery/${order.deliveryToken}`)
        } else {
          console.log(`   - ⚠️  Missing delivery token!`)
        }
      }
    })
    
    // Count by status
    console.log('\n📊 ======= ORDER STATUS COUNTS =======')
    const statusCounts = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])
    
    statusCounts.forEach(statusCount => {
      console.log(`   - ${statusCount._id}: ${statusCount.count}`)
    })
    
    console.log('\n=================================')
    
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

// Run the check
checkAllOrders()