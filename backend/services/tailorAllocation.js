import Tailor from '../models/tailor.model.js'
import Order from '../models/order.model.js'

export const allocateTailorToOrder = async (orderItems) => {
  try {
    // Extract unique categories from order items
    const categories = [...new Set(orderItems.map(item => item.category))]
    
    console.log('🎯 Allocating tailor for categories:', categories)

    // Step 1: Find tailors who can handle ALL categories in the order
    const eligibleTailors = await Tailor.find({
      specialties: { $all: categories },
      isActive: true
    })

    if (eligibleTailors.length === 0) {
      // Fallback: Find tailors who can handle at least one category
      const fallbackTailors = await Tailor.find({
        specialties: { $in: categories },
        isActive: true
      })
      
      if (fallbackTailors.length === 0) {
        console.log('❌ No eligible tailors found')
        return null
      }
      
      console.log(`⚠️ Using fallback tailors: ${fallbackTailors.length} found`)
      eligibleTailors.push(...fallbackTailors)
    }

    // Step 2: Count active orders for each eligible tailor
    const tailorWorkloads = await Promise.all(
      eligibleTailors.map(async (tailor) => {
        const activeOrderCount = await Order.countDocuments({
          assignedTailor: tailor._id,
          status: { $in: ['assigned', 'in_progress', 'quality_check'] }
        })

        return {
          tailorId: tailor._id,
          tailor: tailor,
          activeOrders: activeOrderCount,
          // Priority score: fewer orders = higher priority
          priority: activeOrderCount
        }
      })
    )

    // Step 3: Sort by workload (ascending) then by experience (descending)
    tailorWorkloads.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority // Fewer orders first
      }
      return b.tailor.experience - a.tailor.experience // More experienced first
    })

    const selectedTailor = tailorWorkloads[0]
    
    console.log(`✅ Allocated tailor: ${selectedTailor.tailor.name} (${selectedTailor.activeOrders} active orders)`)
    
    return selectedTailor.tailorId

  } catch (error) {
    console.error('❌ Error in tailor allocation:', error)
    return null
  }
}
