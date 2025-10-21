import DesignElement from '../models/designElement.model.js'
import ModularOrder from '../models/modularOrder.model.js'

// Get all design categories with their elements
const getDesignCategories = async (req, res) => {
  try {
    const { garmentType = 'kurti' } = req.query // Default to kurti if not specified
    
    const elements = await DesignElement.find({ 
      isActive: true,
      garmentType: garmentType 
    }).sort({ categoryId: 1, displayOrder: 1 })

    // Group elements by category
    const categories = {}
    elements.forEach(element => {
      if (!categories[element.categoryId]) {
        categories[element.categoryId] = {
          id: element.categoryId,
          name: element.categoryName,
          emoji: getCategoryEmoji(element.categoryId),
          description: getCategoryDescription(element.categoryId),
          designs: []
        }
      }
      categories[element.categoryId].designs.push({
        id: element._id.toString(),
        name: element.name,
        price: element.price,
        image: element.image,
        description: element.description
      })
    })

    const categoriesArray = Object.values(categories)

    res.status(200).json({
      success: true,
      data: categoriesArray
    })
  } catch (error) {
    console.error('Error fetching design categories:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching design categories',
      error: error.message
    })
  }
}

// Get design elements by category
const getDesignsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params
    const { garmentType = 'kurti' } = req.query
    
    const elements = await DesignElement.find({ 
      categoryId: categoryId, 
      garmentType: garmentType,
      isActive: true 
    }).sort({ displayOrder: 1 })

    // Format the designs to match frontend expectations
    const designs = elements.map(element => ({
      id: element._id.toString(),
      name: element.name,
      price: element.price,
      image: element.image,
      description: element.description,
      categoryId: element.categoryId,
      categoryName: element.categoryName,
      garmentType: element.garmentType,
      displayOrder: element.displayOrder,
      isActive: element.isActive
    }))

    res.status(200).json({
      success: true,
      data: designs
    })
  } catch (error) {
    console.error('Error fetching designs by category:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching designs',
      error: error.message
    })
  }
}

// Submit modular design order
const submitModularOrder = async (req, res) => {
  try {
    const { customerInfo, selections, totalPrice } = req.body

    // Log the incoming request for debugging
    console.log('📦 Received order data:', {
      customerInfo,
      selections: selections?.length,
      totalPrice
    })

    // Validate required fields
    if (!customerInfo?.name || !customerInfo?.phone) {
      return res.status(400).json({
        success: false,
        message: 'Customer name and phone are required'
      })
    }

    if (!selections || selections.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one design selection is required'
      })
    }

    // Generate orderId manually first
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substr(2, 5)
    const generatedOrderId = `MOD-${timestamp}-${random}`.toUpperCase()

    // Create new modular order with explicit orderId
    const orderData = {
      orderId: generatedOrderId,
      customerInfo: {
        name: customerInfo.name.trim(),
        phone: customerInfo.phone.trim(),
        email: customerInfo.email?.trim() || ''
      },
      selections: selections.map(selection => ({
        categoryId: selection.categoryId,
        categoryName: selection.categoryName,
        designId: selection.id,
        designName: selection.name,
        price: selection.price,
        image: selection.image,
        description: selection.description
      })),
      totalPrice: totalPrice || 180,
      basePrice: 180
    }

    console.log('💾 Creating order with data:', orderData)

    const order = new ModularOrder(orderData)
    await order.save()

    console.log('✅ Order saved successfully:', order.orderId)

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        orderId: order.orderId,
        totalPrice: order.totalPrice,
        status: order.status,
        customerInfo: order.customerInfo
      }
    })
  } catch (error) {
    console.error('❌ Error submitting modular order:', error)
    console.error('Error details:', error.stack)
    res.status(500).json({
      success: false,
      message: 'Error placing order',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}

// Get all unique design categories across all garment types
const getAllDesignCategories = async (req, res) => {
  try {
    const { garmentType } = req.query // Allow filtering by garment type

    // Build match condition
    const matchCondition = { isActive: true }
    if (garmentType) {
      matchCondition.garmentType = garmentType
    }

    // Get all unique categories, optionally filtered by garment type
    const allCategories = await DesignElement.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: '$categoryId',
          categoryName: { $first: '$categoryName' },
          sampleDesigns: { $push: '$$ROOT' }
        }
      },
      { $sort: { _id: 1 } }
    ])

    const categoriesData = allCategories.map(category => ({
      id: category._id,
      name: category.categoryName,
      emoji: getCategoryEmoji(category._id),
      description: getCategoryDescription(category._id),
      // Show design count for the specified garment type (or all if no filter)
      designs: category.sampleDesigns.length
    }))

    res.status(200).json({
      success: true,
      data: categoriesData
    })
  } catch (error) {
    console.error('Error fetching all design categories:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching design categories',
      error: error.message
    })
  }
}

// Get available garment types
const getGarmentTypes = async (req, res) => {
  try {
    const garmentTypes = await DesignElement.distinct('garmentType', { isActive: true })
    
    // Create garment type objects with additional info
    const garmentTypesData = garmentTypes.map(type => ({
      id: type,
      name: type.charAt(0).toUpperCase() + type.slice(1),
      emoji: getGarmentEmoji(type),
      description: getGarmentDescription(type)
    })).sort((a, b) => a.name.localeCompare(b.name))

    res.status(200).json({
      success: true,
      data: garmentTypesData
    })
  } catch (error) {
    console.error('Error fetching garment types:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching garment types',
      error: error.message
    })
  }
}

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params
    
    const order = await ModularOrder.findOne({ orderId })
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    res.status(200).json({
      success: true,
      data: order
    })
  } catch (error) {
    console.error('Error fetching order:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    })
  }
}

// Helper functions
const getCategoryEmoji = (categoryId) => {
  const emojis = {
    'sleeves': '👕',
    'front-neck-designs': '💎',
    'back-neck-designs': '✨',
    'ropes-strings': '🎀',
    'aari-work': '🧵',
    'embroidery': '🌺',
    'borders-lace': '🎭',
    'buttons-closures': '🔘',
    'prints-patterns': '🎨',
    'fabric-type': '🧶',
    'length': '📏'
  }
  return emojis[categoryId] || '🎨'
}

const getCategoryDescription = (categoryId) => {
  const descriptions = {
    'sleeves': 'Choose your sleeve style',
    'front-neck-designs': 'Front neckline designs',
    'back-neck-designs': 'Back neckline designs',
    'ropes-strings': 'Decorative ropes and strings',
    'aari-work': 'Traditional Aari embroidery',
    'embroidery': 'Beautiful embroidery work',
    'borders-lace': 'Decorative borders and lace',
    'buttons-closures': 'Buttons and closure styles',
    'prints-patterns': 'Design element options',
    'fabric-type': 'Choose your fabric',
    'length': 'Length and fitting options'
  }
  return descriptions[categoryId] || 'Design element options'
}

const getGarmentEmoji = (garmentType) => {
  const emojis = {
    'kurti': '👕',
    'blouse': '👗', 
    'saree': '🎀',
    'lehenga': '👠',
    'dress': '👗'
  }
  return emojis[garmentType] || '👕'
}

const getGarmentDescription = (garmentType) => {
  const descriptions = {
    'kurti': 'Traditional Indian tunic with versatile styling options',
    'blouse': 'Elegant fitted top perfect for sarees and lehengas',
    'saree': 'Classic Indian drape with timeless elegance',
    'lehenga': 'Traditional flared skirt with rich embellishments',
    'dress': 'Modern fusion wear with contemporary styling'
  }
  return descriptions[garmentType] || 'Traditional Indian wear'
}

// Get all modular orders
const getAllModularOrders = async (req, res) => {
  try {
    const modularOrders = await ModularOrder.find({}
      ).sort({ createdAt: -1 })
    
    res.status(200).json({
      success: true,
      data: modularOrders,
      count: modularOrders.length
    })
  } catch (error) {
    console.error('Error fetching modular orders:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching modular orders',
      error: error.message
    })
  }
}

export {
  getDesignCategories,
  getAllDesignCategories,
  getDesignsByCategory,
  getGarmentTypes,
  submitModularOrder,
  getOrderById,
  getAllModularOrders
}
