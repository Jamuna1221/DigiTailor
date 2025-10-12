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

async function fixAllMissingTokens() {
  try {
    console.log('\n🔧 ======= FIXING ALL MISSING DELIVERY TOKENS =======')
    
    // Find ALL orders that should have delivery tokens but don't
    const ordersNeedingTokens = await Order.find({
      status: { $in: ['shipped', 'out_for_delivery'] }, // Any order that could be delivered
      $or: [
        { deliveryToken: null },
        { deliveryToken: { $exists: false } },
        { deliveryToken: '' }
      ]
    }).populate('userId', 'firstName lastName email')
    
    console.log(`🔍 Found ${ordersNeedingTokens.length} orders needing delivery tokens`)
    
    if (ordersNeedingTokens.length === 0) {
      console.log('✅ All eligible orders already have tokens!')
      process.exit(0)
    }
    
    for (const order of ordersNeedingTokens) {
      const deliveryToken = crypto.randomBytes(32).toString('hex')
      
      await Order.findByIdAndUpdate(order._id, {
        deliveryToken: deliveryToken
      })
      
      console.log(`✅ Fixed order ${order.orderId || order._id}:`)
      console.log(`   - Status: ${order.status}`)
      console.log(`   - Customer: ${order.userId.firstName} ${order.userId.lastName}`)
      console.log(`   - Email: ${order.userId.email}`)
      console.log(`   - Token: ${deliveryToken}`)
      console.log(`   - URL: http://localhost:5000/api/orders/confirm-delivery/${deliveryToken}`)
      console.log('')
    }
    
    console.log(`🎉 Fixed ${ordersNeedingTokens.length} orders!`)
    console.log('📧 These orders now have working delivery confirmation links.')
    console.log('=====================================')
    
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Error fixing tokens:', error)
    process.exit(1)
  }
}

// Run the fix
fixAllMissingTokens()