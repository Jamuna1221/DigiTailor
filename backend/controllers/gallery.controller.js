import Gallery from '../models/gallery.model.js'

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id) => {
  return id && id.toString().match(/^[0-9a-fA-F]{24}$/)
}

// Helper function to sanitize string input
const sanitizeString = (str) => {
  return str && typeof str === 'string' ? str.trim() : null
}

// Helper function to validate numeric range
const validateRange = (value, min, max, defaultValue) => {
  const num = parseInt(value)
  if (isNaN(num)) return defaultValue
  return Math.min(Math.max(num, min), max)
}

// GET /api/gallery - Get all gallery items
export const getAllGallery = async (req, res) => {
  try {
    console.log('🖼️ Fetching gallery items...')
    
    const { category, limit, featured } = req.query
    let filter = {}
    
    // Category filter
    if (category && category !== 'All' && category !== 'all') {
      filter.category = { $regex: new RegExp(category, 'i') }
    }
    
    // Featured filter
    if (featured === 'true') {
      filter.isFeatured = true
    }
    
    let query = Gallery.find(filter).sort({ createdAt: -1 })
    
    // Limit results
    if (limit && !isNaN(parseInt(limit))) {
      query = query.limit(parseInt(limit))
    }
    
    const galleryItems = await query
    console.log(`✅ Found ${galleryItems.length} gallery items`)
    
    res.status(200).json({
      success: true,
      message: 'Gallery items fetched successfully',
      data: galleryItems || [],
      count: galleryItems.length,
      filters: { category, limit, featured }
    })
    
  } catch (error) {
    console.error('❌ Error fetching gallery items:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery items',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      data: []
    })
  }
}

// GET /api/gallery/categories - Get available categories
export const getGalleryCategories = async (req, res) => {
  try {
    console.log('🏷️ Fetching gallery categories...')
    
    const categories = await Gallery.distinct('category')
    const validCategories = categories.filter(cat => cat && cat.trim() !== '')
    const allCategories = ['All', ...validCategories.sort()]
    
    console.log(`✅ Found ${validCategories.length} categories`)
    
    res.status(200).json({
      success: true,
      message: 'Categories fetched successfully',
      data: allCategories,
      count: validCategories.length
    })
    
  } catch (error) {
    console.error('❌ Error fetching categories:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      data: ['All']
    })
  }
}

// GET /api/gallery/:id - Get single gallery item (also increments views)
export const getGalleryById = async (req, res) => {
  try {
    const { id } = req.params
    console.log(`🔍 Fetching gallery item: ${id}`)
    
    // Validate ID parameter
    if (!id || id === 'undefined' || id === 'null' || id.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Invalid gallery ID provided',
        error: 'ID parameter is required and cannot be empty'
      })
    }
    
    // Validate MongoDB ObjectId format
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid gallery ID format',
        error: 'ID must be a valid 24 character MongoDB ObjectId'
      })
    }
    
    // Find the gallery item
    const item = await Gallery.findById(id)
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found',
        error: `No gallery item found with ID: ${id}`
      })
    }
    
    // Increment views count asynchronously (don't wait for completion)
    setImmediate(async () => {
      try {
        await Gallery.findByIdAndUpdate(id, { $inc: { views: 1 } })
        console.log(`👁️ Views incremented for: ${item.title}`)
      } catch (err) {
        console.error('Failed to increment views:', err.message)
      }
    })
    
    console.log(`✅ Gallery item found: ${item.title}`)
    
    res.status(200).json({
      success: true,
      message: 'Gallery item fetched successfully',
      data: item
    })
    
  } catch (error) {
    console.error('❌ Error fetching gallery item:', error)
    
    // Handle specific MongoDB errors
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid gallery ID format',
        error: 'The provided ID is not a valid MongoDB ObjectId'
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery item',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    })
  }
}

// PUT /api/gallery/:id/like - Increment likes for a gallery item
export const likeGalleryItem = async (req, res) => {
  try {
    const { id } = req.params
    console.log(`❤️ Liking gallery item: ${id}`)
    
    // Validate ID parameter
    if (!id || id === 'undefined' || id === 'null' || id.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Invalid gallery ID provided',
        error: 'ID parameter is required and cannot be empty'
      })
    }
    
    // Validate MongoDB ObjectId format
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid gallery ID format',
        error: 'ID must be a valid 24 character MongoDB ObjectId'
      })
    }
    
    const updatedItem = await Gallery.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true, select: 'likes title' }
    )
    
    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found',
        error: `No gallery item found with ID: ${id}`
      })
    }
    
    console.log(`✅ Gallery item liked: ${updatedItem.title} (${updatedItem.likes} likes)`)
    
    res.status(200).json({
      success: true,
      message: 'Gallery item liked successfully',
      data: { 
        likes: updatedItem.likes,
        title: updatedItem.title
      }
    })
    
  } catch (error) {
    console.error('❌ Error liking gallery item:', error)
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid gallery ID format',
        error: 'The provided ID is not a valid MongoDB ObjectId'
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to like gallery item',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    })
  }
}

// POST /api/gallery - Create new gallery item (Admin)
export const createGalleryItem = async (req, res) => {
  try {
    console.log('📝 Creating new gallery item...')
    console.log('Request body:', req.body)
    
    const {
      title,
      category,
      style,
      beforeImage,
      afterImage,
      customerName,
      customerStory,
      satisfaction = 5,
      designTime = '7 days',
      occasion,
      isFeatured = false
    } = req.body

    // Validate required fields
    const requiredFields = { title, category, style, afterImage }
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value || (typeof value === 'string' && value.trim() === ''))
      .map(([key]) => key)

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        error: 'All required fields must be provided and cannot be empty',
        missingFields
      })
    }

    // Additional validation
    const cleanTitle = sanitizeString(title)
    if (!cleanTitle || cleanTitle.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Title must be at least 3 characters long',
        error: 'Title validation failed'
      })
    }

    // Validate image URLs (basic check)
    const urlPattern = /^(https?:\/\/)|(data:image\/)/
    if (!urlPattern.test(afterImage)) {
      return res.status(400).json({
        success: false,
        message: 'After image must be a valid URL or base64 data',
        error: 'Invalid image format'
      })
    }

    // Create new gallery item
    const newGalleryItem = new Gallery({
      title: cleanTitle,
      category: sanitizeString(category),
      style: sanitizeString(style),
      beforeImage: sanitizeString(beforeImage) || null,
      afterImage: sanitizeString(afterImage),
      customerName: sanitizeString(customerName) || null,
      customerStory: sanitizeString(customerStory) || null,
      satisfaction: validateRange(satisfaction, 1, 5, 5),
      designTime: sanitizeString(designTime) || '7 days',
      occasion: sanitizeString(occasion) || null,
      isFeatured: Boolean(isFeatured),
      likes: 0,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const savedItem = await newGalleryItem.save()
    console.log('✅ Gallery item created:', savedItem.title, 'ID:', savedItem._id)

    res.status(201).json({
      success: true,
      message: 'Gallery item created successfully',
      data: savedItem
    })

  } catch (error) {
    console.error('❌ Error creating gallery item:', error)
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }))
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: 'One or more fields failed validation',
        validationErrors
      })
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Duplicate entry detected',
        error: 'A gallery item with similar details already exists'
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create gallery item',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    })
  }
}

// PUT /api/gallery/:id - Update gallery item (Admin)
export const updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params
    console.log(`✏️ Updating gallery item: ${id}`)
    console.log('Update data:', req.body)

    // Validate ID parameter
    if (!id || id === 'undefined' || id === 'null' || id.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Invalid gallery ID provided',
        error: 'ID parameter is required and cannot be empty'
      })
    }

    // Validate MongoDB ObjectId format
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid gallery ID format',
        error: 'ID must be a valid 24 character MongoDB ObjectId'
      })
    }

    // Check if item exists
    const existingItem = await Gallery.findById(id)
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found',
        error: `No gallery item found with ID: ${id}`
      })
    }

    const updateData = { ...req.body }
    
    // Clean and validate update data
    const cleanFields = ['title', 'customerName', 'customerStory', 'occasion', 'designTime', 'category', 'style', 'beforeImage', 'afterImage']
    cleanFields.forEach(field => {
      if (updateData[field] !== undefined) {
        updateData[field] = sanitizeString(updateData[field])
      }
    })
    
    // Validate title length if provided
    if (updateData.title && updateData.title.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Title must be at least 3 characters long',
        error: 'Title validation failed'
      })
    }
    
    // Validate image URL if provided
    if (updateData.afterImage) {
      const urlPattern = /^(https?:\/\/)|(data:image\/)/
      if (!urlPattern.test(updateData.afterImage)) {
        return res.status(400).json({
          success: false,
          message: 'After image must be a valid URL or base64 data',
          error: 'Invalid image format'
        })
      }
    }
    
    // Convert and validate numeric fields
    if (updateData.satisfaction !== undefined) {
      updateData.satisfaction = validateRange(updateData.satisfaction, 1, 5, existingItem.satisfaction)
    }
    
    // Convert boolean fields
    if (updateData.isFeatured !== undefined) {
      updateData.isFeatured = Boolean(updateData.isFeatured)
    }
    
    // Remove undefined, null, or empty string values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === null || updateData[key] === '') {
        delete updateData[key]
      }
    })
    
    // Add updated timestamp
    updateData.updatedAt = new Date()

    const updatedItem = await Gallery.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )

    console.log('✅ Gallery item updated:', updatedItem.title)

    res.status(200).json({
      success: true,
      message: 'Gallery item updated successfully',
      data: updatedItem
    })

  } catch (error) {
    console.error('❌ Error updating gallery item:', error)
    
    // Handle specific errors
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid gallery ID format',
        error: 'The provided ID is not a valid MongoDB ObjectId'
      })
    }
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }))
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: 'One or more fields failed validation',
        validationErrors
      })
    }
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Duplicate entry detected',
        error: 'A gallery item with similar details already exists'
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update gallery item',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    })
  }
}

// DELETE /api/gallery/:id - Delete gallery item (Admin)
export const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params
    console.log(`🗑️ Deleting gallery item: ${id}`)

    // Validate ID parameter
    if (!id || id === 'undefined' || id === 'null' || id.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Invalid gallery ID provided',
        error: 'ID parameter is required and cannot be empty'
      })
    }

    // Validate MongoDB ObjectId format
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid gallery ID format',
        error: 'ID must be a valid 24 character MongoDB ObjectId'
      })
    }

    // Check if item exists before deletion
    const existingItem = await Gallery.findById(id)
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found',
        error: `No gallery item found with ID: ${id}`
      })
    }

    // Hard delete - completely remove the item
    const deletedItem = await Gallery.findByIdAndDelete(id)

    console.log('✅ Gallery item deleted:', deletedItem.title)

    res.status(200).json({
      success: true,
      message: 'Gallery item deleted successfully',
      data: {
        id: deletedItem._id,
        title: deletedItem.title,
        deletedAt: new Date()
      }
    })

  } catch (error) {
    console.error('❌ Error deleting gallery item:', error)
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid gallery ID format',
        error: 'The provided ID is not a valid MongoDB ObjectId'
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to delete gallery item',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    })
  }
}

// GET /api/gallery/stats - Get gallery statistics (Admin)
export const getGalleryStats = async (req, res) => {
  try {
    console.log('📊 Fetching gallery statistics...')
    
    const [totalItems, featuredItems, categories, totalLikes, totalViews] = await Promise.all([
      Gallery.countDocuments(),
      Gallery.countDocuments({ isFeatured: true }),
      Gallery.distinct('category'),
      Gallery.aggregate([{ $group: { _id: null, total: { $sum: '$likes' } } }]),
      Gallery.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }])
    ])
    
    const stats = {
      totalItems,
      featuredItems,
      totalCategories: categories.length,
      totalLikes: totalLikes[0]?.total || 0,
      totalViews: totalViews[0]?.total || 0,
      averageLikes: totalItems > 0 ? Math.round((totalLikes[0]?.total || 0) / totalItems) : 0,
      averageViews: totalItems > 0 ? Math.round((totalViews[0]?.total || 0) / totalItems) : 0,
      categories: categories.sort()
    }
    
    console.log('✅ Gallery statistics calculated')
    
    res.status(200).json({
      success: true,
      message: 'Gallery statistics fetched successfully',
      data: stats
    })
    
  } catch (error) {
    console.error('❌ Error fetching gallery statistics:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    })
  }
}
