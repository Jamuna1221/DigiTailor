import mongoose from 'mongoose'
import Order from '../models/order.model.js'
import User from '../models/user.model.js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const testDeliveryConfirmation = async () => {
  try {
    console.log('🧪 ======= TEST DELIVERY CONFIRMATION =======')
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Get the first order with a token that's not confirmed
    const orderToTest = await Order.findOne({
      deliveryToken: { $exists: true, $ne: null },
      deliveryConfirmedAt: { $exists: false },
      status: { $in: ['shipped', 'out_for_delivery'] }
    }).populate('userId', 'firstName lastName email')

    if (!orderToTest) {
      console.log('❌ No unconfirmed orders with tokens found')
      process.exit(0)
    }

    console.log('\n📦 Testing order:')
    console.log(`🆔 Order ID: ${orderToTest.orderId}`)
    console.log(`👤 Customer: ${orderToTest.userId.firstName} ${orderToTest.userId.lastName}`)
    console.log(`📋 Status: ${orderToTest.status}`)
    console.log(`🔑 Token: ${orderToTest.deliveryToken}`)
    console.log(`🔗 Test URL: http://localhost:5000/api/orders/confirm-delivery/${orderToTest.deliveryToken}`)
    
    // Test the confirmation logic manually
    console.log('\n🧪 Simulating delivery confirmation...')
    
    orderToTest.status = 'delivered'
    orderToTest.deliveryConfirmedAt = new Date()
    orderToTest.deliveryConfirmedBy = 'manual_test'
    
    await orderToTest.save()
    
    console.log('✅ Order confirmed successfully!')
    console.log(`⏰ Confirmed at: ${orderToTest.deliveryConfirmedAt}`)
    
    // Undo the test
    console.log('\n↩️ Reverting changes for testing...')
    orderToTest.status = 'shipped'
    orderToTest.deliveryConfirmedAt = undefined
    orderToTest.deliveryConfirmedBy = undefined
    await orderToTest.save()
    console.log('✅ Changes reverted')

    await mongoose.disconnect()
    console.log('🔌 Disconnected from MongoDB')
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Error:', error)
    await mongoose.disconnect()
    process.exit(1)
  }
}

console.log('🎯 DigiTailor Delivery Confirmation Test')
console.log('=======================================')
testDeliveryConfirmation()