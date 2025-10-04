import User from '../models/user.model.js'
import Order from '../models/order.model.js'

export const allocateTailorToOrder = async () => {
  try {
    console.log('🎯 Allocating tailor (ignoring specialties & experience)')

    // Step 1: Get all active tailors
    const eligibleTailors = await User.find({ role: 'tailor', isActive: true })

    if (eligibleTailors.length === 0) {
      console.log('❌ No active tailors found')
      return null
    }

    // Step 2: Count active orders for each eligible tailor
    const tailorWorkloads = await Promise.all(
      eligibleTailors.map(async (tailor) => {
        const activeOrderCount = await Order.countDocuments({
          assignedTailor: tailor._id,
          status: { $in: ['assigned', 'in_progress', 'confirmed'] }
        })

        return {
          tailorId: tailor._id,
          tailor,
          activeOrders: activeOrderCount
        }
      })
    )

    if (tailorWorkloads.length === 0) return null

    // Step 3: Sort by least workload
    tailorWorkloads.sort((a, b) => a.activeOrders - b.activeOrders)

    const selectedTailor = tailorWorkloads[0]

    console.log(
      `✅ Allocated tailor: ${selectedTailor.tailor.name} (${selectedTailor.activeOrders} active orders)`
    )

    return selectedTailor.tailorId

  } catch (error) {
    console.error('❌ Error in tailor allocation:', error)
    return null
  }
}
