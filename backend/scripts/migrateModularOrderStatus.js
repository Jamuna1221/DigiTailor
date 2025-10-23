import mongoose from 'mongoose'
import ModularOrder from '../models/modularOrder.model.js'
import dotenv from 'dotenv'

dotenv.config()

// Status mapping from old to new
const statusMapping = {
  'pending': 'placed',
  'confirmed': 'confirmed',
  'in-production': 'in_progress',
  'ready': 'completed',
  'delivered': 'delivered',
  'cancelled': 'cancelled'
}

async function migrateModularOrderStatuses() {
  try {
    console.log('🔄 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    console.log('\n📦 Fetching all modular orders...')
    const orders = await ModularOrder.find({})
    console.log(`Found ${orders.length} modular orders`)

    let updatedCount = 0

    for (const order of orders) {
      const oldStatus = order.status
      const newStatus = statusMapping[oldStatus] || oldStatus

      if (oldStatus !== newStatus) {
        console.log(`\n📝 Updating order ${order.orderId}`)
        console.log(`   Old status: ${oldStatus} → New status: ${newStatus}`)

        order.status = newStatus
        
        // Initialize statusHistory if it doesn't exist
        if (!order.statusHistory || order.statusHistory.length === 0) {
          order.statusHistory = [{
            status: newStatus,
            timestamp: order.createdAt || new Date(),
            note: 'Migrated from old status format'
          }]
        }

        await order.save()
        updatedCount++
        console.log('   ✅ Updated successfully')
      }
    }

    console.log(`\n✅ Migration complete!`)
    console.log(`   Total orders: ${orders.length}`)
    console.log(`   Updated: ${updatedCount}`)
    console.log(`   Unchanged: ${orders.length - updatedCount}`)

  } catch (error) {
    console.error('❌ Migration error:', error)
  } finally {
    await mongoose.connection.close()
    console.log('\n🔌 Database connection closed')
    process.exit(0)
  }
}

migrateModularOrderStatuses()
