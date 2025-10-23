import mongoose from 'mongoose'
import ModularOrder from '../models/modularOrder.model.js'
import User from '../models/user.model.js'
import Order from '../models/order.model.js'
import dotenv from 'dotenv'

dotenv.config()

async function assignTailorsToModularOrders() {
  try {
    console.log('🔄 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Get all active tailors
    console.log('\n👔 Fetching active tailors...')
    const tailors = await User.find({ role: 'tailor', isActive: true })
    
    if (tailors.length === 0) {
      console.log('❌ No active tailors found!')
      process.exit(1)
    }
    
    console.log(`✅ Found ${tailors.length} active tailors`)

    // Get modular orders that need tailor assignment
    console.log('\n📦 Fetching modular orders without assigned tailors...')
    const orders = await ModularOrder.find({
      assignedTailor: null,
      status: { $in: ['placed', 'confirmed'] }
    })
    
    console.log(`Found ${orders.length} orders to assign`)

    if (orders.length === 0) {
      console.log('✅ All orders already have tailors assigned!')
      process.exit(0)
    }

    let assignedCount = 0

    for (const order of orders) {
      // Calculate workload for each tailor
      const tailorWorkloads = await Promise.all(
        tailors.map(async (tailor) => {
          const regularOrders = await Order.countDocuments({
            assignedTailor: tailor._id,
            status: { $in: ['assigned', 'in_progress', 'confirmed'] }
          })
          
          const modularOrders = await ModularOrder.countDocuments({
            assignedTailor: tailor._id,
            status: { $in: ['assigned', 'in_progress', 'confirmed'] }
          })

          return {
            tailorId: tailor._id,
            name: tailor.firstName + ' ' + tailor.lastName,
            totalOrders: regularOrders + modularOrders
          }
        })
      )

      // Sort by least workload
      tailorWorkloads.sort((a, b) => a.totalOrders - b.totalOrders)
      const selectedTailor = tailorWorkloads[0]

      console.log(`\n📝 Assigning order ${order.orderId}`)
      console.log(`   → Tailor: ${selectedTailor.name} (${selectedTailor.totalOrders} active orders)`)

      order.assignedTailor = selectedTailor.tailorId
      order.status = 'assigned'
      order.allocationTimestamp = new Date()

      await order.save()
      assignedCount++
      console.log('   ✅ Assigned successfully')
    }

    console.log(`\n✅ Assignment complete!`)
    console.log(`   Orders assigned: ${assignedCount}`)

  } catch (error) {
    console.error('❌ Assignment error:', error)
  } finally {
    await mongoose.connection.close()
    console.log('\n🔌 Database connection closed')
    process.exit(0)
  }
}

assignTailorsToModularOrders()
