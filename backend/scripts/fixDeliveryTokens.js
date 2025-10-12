import mongoose from 'mongoose'
import crypto from 'crypto'
import dotenv from 'dotenv'
import Order from '../models/order.model.js'

// Load environment variables
dotenv.config()

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/digitailor')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err))

async function fixMissingDeliveryTokens() {
  try {
    console.log('\n🔧 ======= FIXING DELIVERY TOKENS =======')
    
    // Find all orders with out_for_delivery status but no delivery token
    const ordersNeedingTokens = await Order.find({
      status: 'out_for_delivery',
      $or: [
        { deliveryToken: null },
        { deliveryToken: { $exists: false } }
      ]
    }).populate('userId', 'firstName lastName email')
    
    console.log(`🔍 Found ${ordersNeedingTokens.length} orders needing delivery tokens`)
    
    if (ordersNeedingTokens.length === 0) {
      console.log('✅ All out_for_delivery orders already have tokens!')
      process.exit(0)
    }
    
    for (const order of ordersNeedingTokens) {
      const deliveryToken = crypto.randomBytes(32).toString('hex')
      
      await Order.findByIdAndUpdate(order._id, {
        deliveryToken: deliveryToken
      })
      
      console.log(`✅ Fixed order ${order.orderId || order._id}:`)
      console.log(`   - Customer: ${order.userId.firstName} ${order.userId.lastName}`)
      console.log(`   - Token: ${deliveryToken}`)
      console.log(`   - URL: http://localhost:5000/api/orders/confirm-delivery/${deliveryToken}`)
    }
    
    console.log(`\\n🎉 Fixed ${ordersNeedingTokens.length} orders!`)
    console.log('=====================================')
    
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Error fixing tokens:', error)
    process.exit(1)
  }
}

// Run the fix
fixMissingDeliveryTokens()