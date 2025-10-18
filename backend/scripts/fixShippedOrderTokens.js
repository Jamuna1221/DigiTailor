import mongoose from 'mongoose'
import Order from '../models/order.model.js'
import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

const fixShippedOrderTokens = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')
    
    console.log('\n🔧 ======= FIXING SHIPPED ORDER TOKENS =======')
    
    // Find orders with 'shipped' status but missing delivery tokens
    const shippedOrdersWithoutTokens = await Order.find({
      status: 'shipped',
      $or: [
        { deliveryToken: null },
        { deliveryToken: { $exists: false } },
        { deliveryToken: '' }
      ]
    }).sort({ createdAt: -1 })
    
    console.log(`\n🔍 Found ${shippedOrdersWithoutTokens.length} shipped orders without delivery tokens:`)
    
    if (shippedOrdersWithoutTokens.length === 0) {
      console.log('✅ No orders need fixing!')
      return
    }
    
    // Fix each order
    let fixed = 0
    for (const order of shippedOrdersWithoutTokens) {
      const deliveryToken = crypto.randomBytes(32).toString('hex')
      
      await Order.findByIdAndUpdate(order._id, {
        deliveryToken: deliveryToken
      })
      
      console.log(`✅ Fixed order ${order.orderId || order._id}: ${deliveryToken.substring(0, 16)}...`)
      fixed++
    }
    
    console.log(`\n🎉 Successfully fixed ${fixed} orders!`)
    console.log(`\n📋 All fixed orders now have delivery tokens and can receive confirmation emails.`)
    
    // Verify the fix
    console.log(`\n🔍 Verifying fix...`)
    const remainingBrokenOrders = await Order.countDocuments({
      status: 'shipped',
      $or: [
        { deliveryToken: null },
        { deliveryToken: { $exists: false } },
        { deliveryToken: '' }
      ]
    })
    
    if (remainingBrokenOrders === 0) {
      console.log('✅ All shipped orders now have delivery tokens!')
    } else {
      console.log(`❌ ${remainingBrokenOrders} orders still need fixing`)
    }
    
    console.log('\n=======================================')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await mongoose.connection.close()
    console.log('🔌 Disconnected from MongoDB')
  }
}

fixShippedOrderTokens()