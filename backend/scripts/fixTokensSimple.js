import mongoose from 'mongoose'
import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

// Import models
import Order from '../models/order.model.js'
import User from '../models/user.model.js'

async function fixTokensSimple() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Find orders that are 'out_for_delivery' or 'shipped' but have no delivery token
    const ordersNeedingTokens = await Order.find({
      status: { $in: ['out_for_delivery', 'shipped'] },
      deliveryToken: { $exists: false }
    }).populate('userId', 'email firstName lastName')

    console.log(`\n🔍 Found ${ordersNeedingTokens.length} orders needing delivery tokens`)

    let fixedCount = 0
    for (const order of ordersNeedingTokens) {
      if (order.userId) { // Only fix if user exists
        const deliveryToken = crypto.randomBytes(32).toString('hex')
        order.deliveryToken = deliveryToken
        await order.save()
        
        console.log(`✅ Fixed order ${order.orderId || order._id}:`)
        console.log(`   - Status: ${order.status}`)
        console.log(`   - User: ${order.userId.firstName} ${order.userId.lastName}`)
        console.log(`   - Token: ${deliveryToken.substring(0, 10)}...`)
        fixedCount++
      } else {
        console.log(`⚠️ Skipping order ${order.orderId || order._id} - no user data`)
      }
    }

    // Also check for orders with null tokens
    const ordersWithNullTokens = await Order.find({
      status: { $in: ['out_for_delivery', 'shipped'] },
      deliveryToken: null
    }).populate('userId', 'email firstName lastName')

    console.log(`\n🔍 Found ${ordersWithNullTokens.length} orders with null tokens`)

    for (const order of ordersWithNullTokens) {
      if (order.userId) {
        const deliveryToken = crypto.randomBytes(32).toString('hex')
        order.deliveryToken = deliveryToken
        await order.save()
        
        console.log(`✅ Fixed null token for order ${order.orderId || order._id}:`)
        console.log(`   - Status: ${order.status}`)
        console.log(`   - User: ${order.userId.firstName} ${order.userId.lastName}`)
        console.log(`   - Token: ${deliveryToken.substring(0, 10)}...`)
        fixedCount++
      }
    }

    console.log(`\n✅ Fixed ${fixedCount} orders with missing/null delivery tokens`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await mongoose.disconnect()
    console.log('📤 Disconnected from MongoDB')
  }
}

fixTokensSimple()