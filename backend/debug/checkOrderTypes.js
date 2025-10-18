import mongoose from 'mongoose'
import Order from '../models/order.model.js'
import ModularOrder from '../models/modularOrder.model.js'
import dotenv from 'dotenv'

dotenv.config()

const checkOrderTypes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')
    
    console.log('\n📊 ======= ORDER TYPE ANALYSIS =======')
    
    // Check regular orders
    const regularOrders = await Order.find().sort({ createdAt: -1 }).limit(5)
    console.log(`\n🟦 REGULAR ORDERS (Order model): ${await Order.countDocuments()} total`)
    regularOrders.forEach((order, index) => {
      console.log(`  ${index + 1}. ID: ${order.orderId || order._id}`)
      console.log(`     Status: ${order.status}`)
      console.log(`     Has Token: ${!!order.deliveryToken}`)
      console.log(`     Token: ${order.deliveryToken || 'NULL'}`)
      console.log(`     Created: ${order.createdAt}`)
      console.log(``)
    })
    
    // Check modular orders  
    const modularOrders = await ModularOrder.find().sort({ createdAt: -1 }).limit(5)
    console.log(`\n🟨 MODULAR ORDERS (ModularOrder model): ${await ModularOrder.countDocuments()} total`)
    modularOrders.forEach((order, index) => {
      console.log(`  ${index + 1}. ID: ${order.orderId}`)
      console.log(`     Status: ${order.status}`)
      console.log(`     Customer: ${order.customerInfo.name}`)
      console.log(`     Phone: ${order.customerInfo.phone}`)
      console.log(`     Created: ${order.createdAt}`)
      console.log(`     Note: ModularOrders don't have deliveryToken field`)
      console.log(``)
    })
    
    console.log('🔍 ANALYSIS:')
    console.log(`   - Regular Orders: Use /api/orders endpoint, have delivery tokens`)
    console.log(`   - Modular Orders: Use design element controller, NO delivery tokens`)
    console.log(`   - If you're creating orders through the modular design system,`)
    console.log(`     they won't have delivery confirmation functionality`)
    
    console.log('\n=====================================')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await mongoose.connection.close()
    console.log('🔌 Disconnected from MongoDB')
  }
}

checkOrderTypes()