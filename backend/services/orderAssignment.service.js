import User from '../models/user.model.js'
import Order from '../models/order.model.js'
import Catalog from '../models/catalog.model.js'

// Map catalog categories to departments
const categoryToDepartment = {
  'blouse': 'women',
  'kurti': 'women', 
  'dress': 'women',
  'kids': 'kids',
  'bridal': 'bridal',
  'mens_shirt': 'men',
  'mens_kurta': 'men'
}

export const assignOrderToTailor = async (orderId) => {
  try {
    console.log('🎯 Assigning order to tailor:', orderId)
    
    // Get the order details
    const order = await Order.findById(orderId).populate('designId')
    if (!order) {
      throw new Error('Order not found')
    }

    // Determine department from catalog item
    let department = order.department
    if (!department && order.designId) {
      department = categoryToDepartment[order.designId.category] || 'women'
    }

    console.log('🏷️ Order department:', department)

    // Find eligible tailors
    const eligibleTailors = await User.find({
      role: 'tailor',
      specializations: department,
      isActive: true
    })

    if (eligibleTailors.length === 0) {
      throw new Error(`No tailors available for ${department} department`)
    }

    console.log('👥 Found eligible tailors:', eligibleTailors.length)

    // Find tailor with least active orders
    let selectedTailor = null
    let minOrders = Infinity

    for (const tailor of eligibleTailors) {
      const activeOrdersCount = await Order.countDocuments({
        assignedTailorId: tailor._id,
        orderStatus: { $in: ['assigned', 'in_progress'] }
      })
      
      console.log(`👤 ${tailor.firstName} has ${activeOrdersCount} active orders`)
      
      if (activeOrdersCount < minOrders) {
        minOrders = activeOrdersCount
        selectedTailor = tailor
      }
    }

    if (!selectedTailor) {
      throw new Error('Could not select a tailor')
    }

    // Assign the order
    order.assignedTailorId = selectedTailor._id
    order.assignedAt = new Date()
    order.orderStatus = 'assigned'
    order.department = department
    
    await order.save()

    console.log(`✅ Order ${orderId} assigned to ${selectedTailor.firstName} (${minOrders} active orders)`)

    return {
      order,
      tailor: selectedTailor,
      message: `Order assigned to ${selectedTailor.firstName} ${selectedTailor.lastName}`
    }

  } catch (error) {
    console.error('❌ Order assignment error:', error)
    throw error
  }
}

// Get tailor workload summary
export const getTailorWorkload = async () => {
  try {
    const tailors = await User.find({ role: 'tailor', isActive: true })
    
    const workloadSummary = await Promise.all(
      tailors.map(async (tailor) => {
        const activeOrders = await Order.countDocuments({
          assignedTailorId: tailor._id,
          orderStatus: { $in: ['assigned', 'in_progress'] }
        })
        
        const completedOrders = await Order.countDocuments({
          assignedTailorId: tailor._id,
          orderStatus: 'completed'
        })

        return {
          tailorId: tailor._id,
          name: `${tailor.firstName} ${tailor.lastName}`,
          specializations: tailor.specializations,
          activeOrders,
          completedOrders,
          totalOrders: activeOrders + completedOrders
        }
      })
    )

    return workloadSummary
  } catch (error) {
    throw error
  }
}
