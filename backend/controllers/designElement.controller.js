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
    
    const designs = await DesignElement.find({ 
      categoryId: categoryId, 
      garmentType: garmentType,
      isActive: true 
    }).sort({ displayOrder: 1 })

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

    // Create new modular order
    const order = new ModularOrder({
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
    })

    await order.save()

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        orderId: order.orderId,
        totalPrice: order.totalPrice,
        status: order.status
      }
    })
  } catch (error) {
    console.error('Error submitting modular order:', error)
    res.status(500).json({
      success: false,
      message: 'Error placing order',
      error: error.message
    })
  }
}

// Get all unique design categories across all garment types
const getAllDesignCategories = async (req, res) => {
  try {
    // Get all unique categories from all garment types
    const allCategories = await DesignElement.aggregate([
      { $match: { isActive: true } },
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
      // Show total designs available across all garment types for this category
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

export {
  getDesignCategories,
  getAllDesignCategories,
  getDesignsByCategory,
  getGarmentTypes,
  submitModularOrder,
  getOrderById
}
