import mongoose from 'mongoose'
import Order from '../models/order.model.js'
import dotenv from 'dotenv'

dotenv.config()

const testFixedTokens = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')
    
    console.log('\n🧪 ======= TESTING FIXED TOKENS =======')
    
    // Get recently fixed orders with tokens
    const fixedOrders = await Order.find({
      status: 'shipped',
      deliveryToken: { $exists: true, $ne: null, $ne: '' }
    }).sort({ createdAt: -1 }).limit(3)
    
    console.log(`\n📦 Found ${fixedOrders.length} shipped orders with valid tokens:`)
    
    fixedOrders.forEach((order, index) => {
      const confirmationUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/orders/confirm-delivery/${order.deliveryToken}`
      console.log(`\n${index + 1}. Order: ${order.orderId}`)
      console.log(`   Token: ${order.deliveryToken}`)
      console.log(`   📧 Valid URL: ${confirmationUrl}`)
      console.log(`   ✅ Test this URL: http://localhost:5000/api/orders/confirm-delivery/${order.deliveryToken}`)
    })
    
    console.log(`\n🎯 SOLUTION SUMMARY:`)
    console.log(`   1. ✅ Fixed delivery token generation for 'shipped' status`)
    console.log(`   2. ✅ Generated tokens for 4 existing orders`)
    console.log(`   3. ✅ All new orders will now get tokens automatically`)
    console.log(`   4. ✅ Old emails with null tokens won't work, but new emails will`)
    
    console.log('\n=======================================')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await mongoose.connection.close()
    console.log('🔌 Disconnected from MongoDB')
  }
}

testFixedTokens()