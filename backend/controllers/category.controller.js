import DesignCategory from '../models/designCategory.model.js'

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await DesignCategory.find({ isActive: true })
      .sort({ sortOrder: 1 })
    
    res.json({
      success: true,
      data: categories
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Create new category
export const createCategory = async (req, res) => {
  try {
    const category = new DesignCategory({
      ...req.body,
      createdBy: 'admin' // TODO: Get from authenticated user
    })
    
    await category.save()
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// Update category
export const updateCategory = async (req, res) => {
  try {
    const category = await DesignCategory.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: 'admin' },
      { new: true, runValidators: true }
    )
    
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' })
    }
    
    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const category = await DesignCategory.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedBy: 'admin' },
      { new: true }
    )
    
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' })
    }
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
