import mongoose from 'mongoose'
import crypto from 'crypto'
import dotenv from 'dotenv'
import Order from '../models/order.model.js'
import User from '../models/user.model.js'

// Load environment variables
dotenv.config()

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/digitailor')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err))

async function fixShippedOrders() {
  try {
    console.log('\n🔧 ======= FIXING SHIPPED ORDERS =======')
    
    // Find all orders with shipped status but no delivery token
    const ordersNeedingTokens = await Order.find({
      status: 'shipped',
      $or: [
        { deliveryToken: null },
        { deliveryToken: { $exists: false } }
      ]
    }).populate('userId', 'firstName lastName email')
    
    console.log(`🔍 Found ${ordersNeedingTokens.length} shipped orders needing delivery tokens`)
    
    if (ordersNeedingTokens.length === 0) {
      console.log('✅ All shipped orders already have tokens!')
      process.exit(0)
    }
    
    for (const order of ordersNeedingTokens) {
      const deliveryToken = crypto.randomBytes(32).toString('hex')
      
      await Order.findByIdAndUpdate(order._id, {
        deliveryToken: deliveryToken
      })
      
      console.log(`✅ Fixed order ${order.orderId || order._id}:`)
      console.log(`   - Customer: ${order.userId.firstName} ${order.userId.lastName}`)
      console.log(`   - Email: ${order.userId.email}`)
      console.log(`   - Token: ${deliveryToken}`)
      console.log(`   - URL: http://localhost:5000/api/orders/confirm-delivery/${deliveryToken}`)
      console.log('')
    }
    
    console.log(`🎉 Fixed ${ordersNeedingTokens.length} shipped orders!`)
    console.log('Now these orders can be confirmed for delivery.')
    console.log('=====================================')
    
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Error fixing shipped orders:', error)
    process.exit(1)
  }
}

// Run the fix
fixShippedOrders()