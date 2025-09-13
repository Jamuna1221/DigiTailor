import Catalog from '../models/catalog.model.js'

// Add this helper function at the top of your controller
const normalizeDifficulty = (value) => {
  if (!value) return 'intermediate' // default
  const val = value.toLowerCase()
  
  // Map common variations to enum values
  if (val === 'easy' || val === 'beginner') return 'beginner'
  if (val === 'medium' || val === 'intermediate') return 'intermediate'
  if (val === 'hard' || val === 'advanced') return 'advanced'
  
  // Return as-is if already valid
  if (['beginner', 'intermediate', 'advanced'].includes(val)) return val
  
  return 'intermediate' // fallback default
}

// GET /api/catalog - Get all active catalog items
export const getAllCatalog = async (req, res) => {
  try {
    console.log('📋 Fetching all catalog items...')
    
    const { category, sortBy = 'createdAt', sortOrder = 'desc', limit, search } = req.query
    
    // Build filter object
    let filter = {}
    
    // Add category filter if provided
    if (category && category !== 'all') {
      filter.category = category
    }
    
    // Add search filter if provided
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    }
    
    // Build sort object
    const sortOptions = {}
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1
    
    // Execute query
    let query = Catalog.find(filter)
      .select('name primaryImage category basePrice tags estimatedDays isFeatured')
      .sort(sortOptions)
    
    if (limit) {
      query = query.limit(parseInt(limit))
    }
    
    const catalogs = await query
    
    console.log(`✅ Found ${catalogs.length} catalog items`)
    
    res.status(200).json({
      success: true,
      message: 'Catalog items fetched successfully',
      data: catalogs,
      count: catalogs.length,
      filters: { category, search, sortBy, sortOrder }
    })
    
  } catch (error) {
    console.error('❌ Error fetching catalog items:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch catalog items',
      error: error.message
    })
  }
}

// GET /api/catalog/:id - Get single catalog item by ID
export const getCatalogById = async (req, res) => {
  try {
    const { id } = req.params
    console.log(`🔍 Fetching catalog item with ID: ${id}`)
    
    const catalogItem = await Catalog.findById(id)
    
    if (!catalogItem) {
      return res.status(404).json({
        success: false,
        message: 'Catalog item not found'
      })
    }
    
    console.log(`✅ Found catalog item: ${catalogItem.name}`)
    
    res.status(200).json({
      success: true,
      message: 'Catalog item fetched successfully',
      data: catalogItem
    })
    
  } catch (error) {
    console.error('❌ Error fetching catalog item:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch catalog item',
      error: error.message
    })
  }
}

// GET /api/catalog/categories - Get all available categories
export const getCategories = async (req, res) => {
  try {
    console.log('🏷️ Fetching available categories...')
    
    // Get unique categories from existing catalog items
    const categories = await Catalog.distinct('category')
    
    console.log(`✅ Found ${categories.length} categories`)
    
    res.status(200).json({
      success: true,
      message: 'Categories fetched successfully',
      data: categories,
      count: categories.length
    })
    
  } catch (error) {
    console.error('❌ Error fetching categories:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    })
  }
}

// GET /api/catalog/featured - Get featured catalog items
export const getFeaturedCatalog = async (req, res) => {
  try {
    console.log('⭐ Fetching featured catalog items...')
    
    const featuredItems = await Catalog.find({ 
      isFeatured: true 
    })
    .select('name primaryImage category basePrice tags estimatedDays isFeatured')
    .sort({ createdAt: -1 })
    .limit(6)
    
    console.log(`✅ Found ${featuredItems.length} featured items`)
    
    res.status(200).json({
      success: true,
      message: 'Featured catalog items fetched successfully',
      data: featuredItems,
      count: featuredItems.length
    })
    
  } catch (error) {
    console.error('❌ Error fetching featured catalog items:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured catalog items',
      error: error.message
    })
  }
}

// POST /api/catalog - Create new catalog item (Admin only)
export const createCatalogItem = async (req, res) => {
  try {
    console.log('📝 Creating new catalog item...')
    
    const {
      name,
      description,
      category,
      basePrice,
      primaryImage,
      additionalImages = [],
      tags = [],
      difficulty = 'intermediate',
      estimatedDays = 7,
      isFeatured = false
    } = req.body

    // Validation
    if (!name || !description || !category || !basePrice || !primaryImage) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: name, description, category, basePrice, primaryImage'
      })
    }

    // Create new catalog item with normalized difficulty
    const newCatalogItem = new Catalog({
      name,
      description,
      category,
      basePrice: parseFloat(basePrice),
      primaryImage,
      additionalImages,
      tags: Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()),
      difficulty: normalizeDifficulty(difficulty),
      estimatedDays: parseInt(estimatedDays),
      isFeatured,
      createdBy: 'admin'
    })

    const savedItem = await newCatalogItem.save()
    console.log('✅ Catalog item created:', savedItem.name)

    res.status(201).json({
      success: true,
      message: 'Catalog item created successfully',
      data: savedItem
    })

  } catch (error) {
    console.error('❌ Error creating catalog item:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create catalog item',
      error: error.message
    })
  }
}

// PUT /api/catalog/:id - Update catalog item (Admin only)
export const updateCatalogItem = async (req, res) => {
  try {
    const { id } = req.params
    console.log(`✏️ Updating catalog item: ${id}`)

    // Process the request body
    const updateData = { ...req.body }
    
    // Normalize difficulty field
    if (updateData.difficulty) {
      updateData.difficulty = normalizeDifficulty(updateData.difficulty)
    }

    // Convert numeric fields
    if (updateData.basePrice) updateData.basePrice = parseFloat(updateData.basePrice)
    if (updateData.estimatedDays) updateData.estimatedDays = parseInt(updateData.estimatedDays)

    const updatedItem = await Catalog.findByIdAndUpdate(
      id,
      { ...updateData, updatedBy: 'admin' },
      { new: true, runValidators: true }
    )

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: 'Catalog item not found'
      })
    }

    console.log('✅ Catalog item updated:', updatedItem.name)

    res.status(200).json({
      success: true,
      message: 'Catalog item updated successfully',
      data: updatedItem
    })

  } catch (error) {
    console.error('❌ Error updating catalog item:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update catalog item',
      error: error.message
    })
  }
}

// DELETE /api/catalog/:id - Delete catalog item (Admin only)
export const deleteCatalogItem = async (req, res) => {
  try {
    const { id } = req.params
    console.log(`🗑️ Deleting catalog item: ${id}`)

    // Hard delete since no isActive field
    const deletedItem = await Catalog.findByIdAndDelete(id)

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: 'Catalog item not found'
      })
    }

    console.log('✅ Catalog item deleted:', deletedItem.name)

    res.status(200).json({
      success: true,
      message: 'Catalog item deleted successfully'
    })

  } catch (error) {
    console.error('❌ Error deleting catalog item:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete catalog item',
      error: error.message
    })
  }
}
