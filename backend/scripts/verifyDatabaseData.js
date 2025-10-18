import mongoose from 'mongoose'
import DesignElement from '../models/designElement.model.js'
import dotenv from 'dotenv'
dotenv.config()

const verifyDatabaseData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/digitailor')
    console.log('✅ Connected to MongoDB')

    // Get all design elements
    const elements = await DesignElement.find({ isActive: true })
      .sort({ categoryId: 1, displayOrder: 1 })

    console.log(`📊 Total design elements in database: ${elements.length}`)
    
    // Group by category
    const categories = {}
    elements.forEach(element => {
      if (!categories[element.categoryId]) {
        categories[element.categoryId] = []
      }
      categories[element.categoryId].push({
        name: element.name,
        price: element.price,
        categoryName: element.categoryName
      })
    })

    console.log('\n📋 Categories and their designs:')
    Object.entries(categories).forEach(([categoryId, designs]) => {
      console.log(`\n🎨 ${designs[0].categoryName} (${categoryId}):`)
      designs.forEach((design, index) => {
        console.log(`   ${index + 1}. ${design.name} - ₹${design.price}`)
      })
    })

    console.log('\n✨ This data should match what you see in the frontend!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

verifyDatabaseData()