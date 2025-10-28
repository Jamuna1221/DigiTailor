import User from '../models/user.model.js'
import Order from '../models/order.model.js'

// Get Dashboard Statistics
export const getDashboardStats = async (req, res) => {
  try {
    console.log('📊 Fetching admin dashboard statistics...')

    // Get total counts
    const [
      totalDesigns,
      totalOrders,
      pendingOrders,
      totalGalleryItems,
      activeUsers
    ] = await Promise.all([
      // Total designs from catalog (you might have a Product/Design model)
      getTotalDesigns(),
      // Total orders
      Order.countDocuments(),
      // Pending orders (exclude delivered/cancelled)
      Order.countDocuments({ 
        status: { $nin: ['delivered', 'cancelled'] } 
      }),
      // Total gallery items (you might have a Gallery model)
      getTotalGalleryItems(),
      // Active users (customers and tailors)
      User.countDocuments({ 
        isActive: true,
        role: { $in: ['customer', 'tailor'] }
      })
    ])

    // Calculate total revenue from delivered orders
    const revenueData = await Order.aggregate([
      {
        $match: {
          status: 'delivered'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$pricing.total' }
        }
      }
    ])

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0

    const stats = {
      totalDesigns,
      totalOrders,
      totalRevenue: Math.round(totalRevenue),
      pendingOrders,
      totalGalleryItems,
      activeUsers
    }

    console.log('✅ Dashboard stats:', stats)

    res.status(200).json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('❌ Dashboard stats error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    })
  }
}

// Get Recent Orders
export const getRecentOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5
    console.log(`📦 Fetching ${limit} recent orders...`)

    const orders = await Order.find()
      .populate('userId', 'firstName lastName email')
      .populate('assignedTailor', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    // Format orders for frontend
    const formattedOrders = orders.map(order => ({
      _id: order._id,
      orderId: order.orderId,
      customerName: order.userId 
        ? `${order.userId.firstName} ${order.userId.lastName}`
        : 'Guest',
      customerEmail: order.userId?.email || 'N/A',
      createdAt: order.createdAt,
      status: formatOrderStatus(order.status),
      total: order.pricing?.total || order.total || 0,
      itemCount: order.items?.length || 0,
      assignedTailor: order.assignedTailor 
        ? `${order.assignedTailor.firstName} ${order.assignedTailor.lastName}`
        : 'Not assigned'
    }))

    console.log(`✅ Retrieved ${formattedOrders.length} recent orders`)

    res.status(200).json({
      success: true,
      data: formattedOrders
    })

  } catch (error) {
    console.error('❌ Recent orders error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent orders',
      error: error.message
    })
  }
}

// Get Chart Data for Revenue Over Time
export const getRevenueChartData = async (req, res) => {
  try {
    const { period = 'month' } = req.query // 'week', 'month', 'year'
    console.log(`📈 Fetching revenue chart data for period: ${period}`)

    let groupBy = {}
    let dateRange = new Date()

    switch (period) {
      case 'week':
        dateRange.setDate(dateRange.getDate() - 7)
        groupBy = {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$pricing.total' },
          orders: { $sum: 1 }
        }
        break
      case 'month':
        dateRange.setMonth(dateRange.getMonth() - 1)
        groupBy = {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$pricing.total' },
          orders: { $sum: 1 }
        }
        break
      case 'year':
        dateRange.setFullYear(dateRange.getFullYear() - 1)
        groupBy = {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          revenue: { $sum: '$pricing.total' },
          orders: { $sum: 1 }
        }
        break
    }

    const chartData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: dateRange },
          status: 'delivered'
        }
      },
      {
        $group: groupBy
      },
      {
        $sort: { _id: 1 }
      }
    ])

    res.status(200).json({
      success: true,
      data: chartData
    })

  } catch (error) {
    console.error('❌ Revenue chart error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch revenue chart data',
      error: error.message
    })
  }
}

// Get Order Status Breakdown
export const getOrderStatusBreakdown = async (req, res) => {
  try {
    console.log('📊 Fetching order status breakdown...')

    const statusBreakdown = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          _id: 0
        }
      }
    ])

    // Format status names for frontend
    const formattedBreakdown = statusBreakdown.map(item => ({
      status: formatOrderStatus(item.status),
      count: item.count
    }))

    res.status(200).json({
      success: true,
      data: formattedBreakdown
    })

  } catch (error) {
    console.error('❌ Status breakdown error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order status breakdown',
      error: error.message
    })
  }
}

// Helper function to format order status
function formatOrderStatus(status) {
  const statusMap = {
    'order_placed': 'Pending',
    'assigned_to_tailor': 'In Progress',
    'stitching_in_progress': 'In Progress',
    'stitching_completed': 'Completed',
    'packed': 'Packed',
    'out_for_delivery': 'Dispatched',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled'
  }
  return statusMap[status] || status
}

// Helper function to get total designs
async function getTotalDesigns() {
  try {
    // Prefer Catalog model if available, else Product
    try {
      const Catalog = (await import('../models/catalog.model.js')).default
      return await Catalog.countDocuments()
    } catch {}
    const Product = (await import('../models/product.model.js')).default
    return await Product.countDocuments()
  } catch (error) {
    console.log('No Catalog/Product model found, returning 0 for designs')
    return 0
  }
}

// Helper function to get total gallery items
async function getTotalGalleryItems() {
  try {
    // Try to import Gallery model
    const Gallery = (await import('../models/gallery.model.js')).default
    return await Gallery.countDocuments()
  } catch (error) {
    console.log('No Gallery model found, returning 0 for gallery items')
    return 0
  }
}
