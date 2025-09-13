import Order from '../models/order.model.js'

// Create new order
export const createOrder = async (req, res) => {
  try {
    console.log('📋 Creating new order...')
    console.log('Request body:', req.body)
    
    const {
      customer,
      items,
      subtotal,
      tax = 0,
      deliveryCharges = 50,
      total,
      paymentMethod = 'cash_on_delivery',
      customerNotes = ''
    } = req.body

    // Validation
    if (!customer || !items || items.length === 0 || !total) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: customer, items, total'
      })
    }

    // Calculate estimated delivery (7 days from now)
    const estimatedDelivery = new Date()
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 7)

    const newOrder = new Order({
      customer,
      items,
      subtotal,
      tax,
      deliveryCharges,
      total,
      paymentMethod,
      customerNotes,
      estimatedDelivery,
      status: 'pending'
    })

    const savedOrder = await newOrder.save()
    console.log('✅ Order created and saved:', savedOrder.orderNumber)

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: {
        orderNumber: savedOrder.orderNumber,
        orderId: savedOrder._id,
        estimatedDelivery: savedOrder.estimatedDelivery,
        status: savedOrder.status
      }
    })

  } catch (error) {
    console.error('❌ Error creating order:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to place order. Please try again.',
      error: error.message
    })
  }
}

// Get user's orders (NO tailor information)
export const getOrdersForUser = async (req, res) => {
  try {
    const { userId } = req.params
    console.log(`📋 Fetching orders for user: ${userId}`)
    
    const orders = await Order.find({ 'customer.id': userId })
      .select('-assignedTailor -tailorNotes -allocationTimestamp -adminNotes')
      .sort({ createdAt: -1 })
    
    console.log(`✅ Found ${orders.length} orders for user`)
    
    res.status(200).json({
      success: true,
      data: orders,
      count: orders.length
    })
    
  } catch (error) {
    console.error('❌ Error fetching user orders:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching user orders'
    })
  }
}

// Get all orders for admin
export const getAllOrdersForAdmin = async (req, res) => {
  try {
    console.log('📋 Admin fetching all orders...')
    
    const orders = await Order.find()
      .populate('assignedTailor', 'name email phone specialties experience')
      .sort({ createdAt: -1 })
    
    console.log(`✅ Found ${orders.length} total orders`)
    
    res.status(200).json({
      success: true,
      data: orders,
      count: orders.length
    })
    
  } catch (error) {
    console.error('❌ Error fetching orders for admin:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    })
  }
}

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status, adminNotes } = req.body
    
    const updateData = { status }
    if (adminNotes) updateData.adminNotes = adminNotes
    
    if (status === 'delivered') {
      updateData.actualDelivery = new Date()
      updateData.paymentStatus = 'paid'
    }
    
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
    
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }
    
    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: updatedOrder
    })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order'
    })
  }
}
