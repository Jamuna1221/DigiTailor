import mongoose from 'mongoose'
import DesignElement from '../models/designElement.model.js'
import dotenv from 'dotenv'
dotenv.config()

const removeCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/digitailor')
    console.log('✅ Connected to MongoDB')

    // Categories to remove
    const categoriesToRemove = ['length', 'fabric-type']

    console.log(`🗑️ Removing categories: ${categoriesToRemove.join(', ')}`)

    // Remove design elements from these categories
    const deleteResult = await DesignElement.deleteMany({
      categoryId: { $in: categoriesToRemove }
    })

    console.log(`✅ Deleted ${deleteResult.deletedCount} design elements`)

    // Show remaining categories
    const remainingElements = await DesignElement.find({ isActive: true })
      .sort({ categoryId: 1, displayOrder: 1 })

    // Group by category
    const categories = {}
    remainingElements.forEach(element => {
      if (!categories[element.categoryId]) {
        categories[element.categoryId] = {
          name: element.categoryName,
          count: 0
        }
      }
      categories[element.categoryId].count++
    })

    console.log('\n📋 Remaining Categories:')
    Object.entries(categories).forEach(([categoryId, info]) => {
      console.log(`  ${info.name} (${categoryId}): ${info.count} designs`)
    })

    console.log(`\n📊 Total remaining design elements: ${remainingElements.length}`)
    console.log('✅ Categories removed successfully!')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error removing categories:', error)
    process.exit(1)
  }
}

removeCategories()