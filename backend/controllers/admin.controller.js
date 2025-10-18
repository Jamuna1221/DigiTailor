import DesignElement from '../models/designElement.model.js'
import ModularOrder from '../models/modularOrder.model.js'

// Get all design elements for admin (with pagination and filtering)
const getAllDesignElements = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      garmentType,
      categoryId,
      search,
      isActive = 'all'
    } = req.query

    // Build filter object
    const filter = {}
    if (garmentType && garmentType !== 'all') {
      filter.garmentType = garmentType
    }
    if (categoryId && categoryId !== 'all') {
      filter.categoryId = categoryId
    }
    if (isActive !== 'all') {
      filter.isActive = isActive === 'true'
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { categoryName: { $regex: search, $options: 'i' } }
      ]
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)

    // Get total count for pagination
    const totalCount = await DesignElement.countDocuments(filter)

    // Get paginated results
    const designElements = await DesignElement.find(filter)
      .sort({ garmentType: 1, categoryId: 1, displayOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    // Get summary statistics
    const stats = await DesignElement.aggregate([
      {
        $group: {
          _id: null,
          totalDesigns: { $sum: 1 },
          activeDesigns: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
          inactiveDesigns: { $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] } }
        }
      }
    ])

    const garmentTypeStats = await DesignElement.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$garmentType', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ])

    const categoryStats = await DesignElement.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: { garmentType: '$garmentType', categoryId: '$categoryId' }, count: { $sum: 1 } } },
      { $sort: { '_id.garmentType': 1, '_id.categoryId': 1 } }
    ])

    res.status(200).json({
      success: true,
      data: {
        designElements,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalItems: totalCount,
          itemsPerPage: parseInt(limit),
          hasNext: skip + parseInt(limit) < totalCount,
          hasPrev: parseInt(page) > 1
        },
        stats: {
          overview: stats[0] || { totalDesigns: 0, activeDesigns: 0, inactiveDesigns: 0 },
          byGarmentType: garmentTypeStats,
          byCategory: categoryStats
        }
      }
    })
  } catch (error) {
    console.error('Error fetching design elements for admin:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching design elements',
      error: error.message
    })
  }
}

// Get single design element by ID
const getDesignElementById = async (req, res) => {
  try {
    const { id } = req.params
    
    const designElement = await DesignElement.findById(id)
    
    if (!designElement) {
      return res.status(404).json({
        success: false,
        message: 'Design element not found'
      })
    }

    res.status(200).json({
      success: true,
      data: designElement
    })
  } catch (error) {
    console.error('Error fetching design element:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching design element',
      error: error.message
    })
  }
}

// Create new design element
const createDesignElement = async (req, res) => {
  try {
    const {
      categoryId,
      categoryName,
      name,
      price,
      image,
      description,
      garmentType,
      displayOrder,
      isActive = true
    } = req.body

    // Validate required fields
    const requiredFields = ['categoryId', 'categoryName', 'name', 'price', 'image', 'description', 'garmentType']
    const missingFields = requiredFields.filter(field => !req.body[field])
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      })
    }

    // Validate garment type
    const validGarmentTypes = ['kurti', 'blouse', 'saree', 'lehenga', 'dress']
    if (!validGarmentTypes.includes(garmentType.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid garment type. Must be one of: ${validGarmentTypes.join(', ')}`
      })
    }

    // Check if design element with same name exists in same category and garment type
    const existingDesign = await DesignElement.findOne({
      name: name.trim(),
      categoryId: categoryId.trim(),
      garmentType: garmentType.toLowerCase()
    })

    if (existingDesign) {
      return res.status(409).json({
        success: false,
        message: `A design element with name "${name}" already exists in ${categoryName} for ${garmentType}`
      })
    }

    // Create new design element
    const designElement = new DesignElement({
      categoryId: categoryId.trim(),
      categoryName: categoryName.trim(),
      name: name.trim(),
      price: parseFloat(price),
      image: image.trim(),
      description: description.trim(),
      garmentType: garmentType.toLowerCase(),
      displayOrder: displayOrder ? parseInt(displayOrder) : 0,
      isActive,
      createdBy: req.user?.id || 'admin',
      updatedBy: req.user?.id || 'admin'
    })

    await designElement.save()

    res.status(201).json({
      success: true,
      message: 'Design element created successfully',
      data: designElement
    })
  } catch (error) {
    console.error('Error creating design element:', error)
    res.status(500).json({
      success: false,
      message: 'Error creating design element',
      error: error.message
    })
  }
}

// Update design element
const updateDesignElement = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = { ...req.body }

    // Remove fields that shouldn't be updated directly
    delete updateData._id
    delete updateData.__v
    delete updateData.createdAt
    delete updateData.createdBy

    // Add updatedBy field
    updateData.updatedBy = req.user?.id || 'admin'

    // Validate garment type if provided
    if (updateData.garmentType) {
      const validGarmentTypes = ['kurti', 'blouse', 'saree', 'lehenga', 'dress']
      if (!validGarmentTypes.includes(updateData.garmentType.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: `Invalid garment type. Must be one of: ${validGarmentTypes.join(', ')}`
        })
      }
      updateData.garmentType = updateData.garmentType.toLowerCase()
    }

    // Clean string fields
    const stringFields = ['categoryId', 'categoryName', 'name', 'image', 'description']
    stringFields.forEach(field => {
      if (updateData[field]) {
        updateData[field] = updateData[field].trim()
      }
    })

    // Parse numeric fields
    if (updateData.price !== undefined) {
      updateData.price = parseFloat(updateData.price)
    }
    if (updateData.displayOrder !== undefined) {
      updateData.displayOrder = parseInt(updateData.displayOrder)
    }

    const designElement = await DesignElement.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )

    if (!designElement) {
      return res.status(404).json({
        success: false,
        message: 'Design element not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Design element updated successfully',
      data: designElement
    })
  } catch (error) {
    console.error('Error updating design element:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating design element',
      error: error.message
    })
  }
}

// Delete design element (soft delete - set isActive to false)
const deleteDesignElement = async (req, res) => {
  try {
    const { id } = req.params
    const { permanent = false } = req.query

    if (permanent === 'true') {
      // Permanent delete
      const designElement = await DesignElement.findByIdAndDelete(id)
      
      if (!designElement) {
        return res.status(404).json({
          success: false,
          message: 'Design element not found'
        })
      }

      res.status(200).json({
        success: true,
        message: 'Design element permanently deleted'
      })
    } else {
      // Soft delete - set isActive to false
      const designElement = await DesignElement.findByIdAndUpdate(
        id,
        { 
          isActive: false,
          updatedBy: req.user?.id || 'admin'
        },
        { new: true }
      )

      if (!designElement) {
        return res.status(404).json({
          success: false,
          message: 'Design element not found'
        })
      }

      res.status(200).json({
        success: true,
        message: 'Design element deactivated successfully',
        data: designElement
      })
    }
  } catch (error) {
    console.error('Error deleting design element:', error)
    res.status(500).json({
      success: false,
      message: 'Error deleting design element',
      error: error.message
    })
  }
}

// Bulk operations
const bulkUpdateDesignElements = async (req, res) => {
  try {
    const { ids, updates } = req.body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of design element IDs'
      })
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide updates to apply'
      })
    }

    // Add updatedBy field
    updates.updatedBy = req.user?.id || 'admin'

    const result = await DesignElement.updateMany(
      { _id: { $in: ids } },
      { $set: updates }
    )

    res.status(200).json({
      success: true,
      message: `Successfully updated ${result.modifiedCount} design elements`,
      data: {
        matched: result.matchedCount,
        modified: result.modifiedCount
      }
    })
  } catch (error) {
    console.error('Error bulk updating design elements:', error)
    res.status(500).json({
      success: false,
      message: 'Error bulk updating design elements',
      error: error.message
    })
  }
}

// Get orders for admin dashboard
const getOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      startDate,
      endDate,
      search
    } = req.query

    // Build filter object
    const filter = {}
    if (status && status !== 'all') {
      filter.status = status
    }
    if (startDate || endDate) {
      filter.createdAt = {}
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate)
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate)
      }
    }
    if (search) {
      filter.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { 'customerInfo.name': { $regex: search, $options: 'i' } },
        { 'customerInfo.phone': { $regex: search, $options: 'i' } }
      ]
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const totalCount = await ModularOrder.countDocuments(filter)

    const orders = await ModularOrder.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    // Get order statistics
    const orderStats = await ModularOrder.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' },
          avgOrderValue: { $avg: '$totalPrice' }
        }
      }
    ])

    const statusStats = await ModularOrder.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ])

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalItems: totalCount,
          itemsPerPage: parseInt(limit)
        },
        stats: {
          overview: orderStats[0] || { totalOrders: 0, totalRevenue: 0, avgOrderValue: 0 },
          byStatus: statusStats
        }
      }
    })
  } catch (error) {
    console.error('Error fetching orders for admin:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    })
  }
}

export {
  getAllDesignElements,
  getDesignElementById,
  createDesignElement,
  updateDesignElement,
  deleteDesignElement,
  bulkUpdateDesignElements,
  getOrders
}