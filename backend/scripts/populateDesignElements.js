import mongoose from 'mongoose'
import DesignElement from '../models/designElement.model.js'
import dotenv from 'dotenv'

dotenv.config()

// Available garment types (must match the enum in the model)
const GARMENT_TYPES = ['kurti', 'blouse', 'saree', 'lehenga', 'dress']

// Available categories with their details
const CATEGORIES = [
  { id: 'sleeve-style', name: 'Sleeve Style', emoji: '👔' },
  { id: 'front-neck-designs', name: 'Front Neck Designs', emoji: '💎' },
  { id: 'back-neck-designs', name: 'Back Neck Designs', emoji: '🎀' },
  { id: 'ropes-strings', name: 'Ropes & Strings', emoji: '🧵' },
  { id: 'aari-work', name: 'Aari Work', emoji: '✨' },
  { id: 'embroidery', name: 'Embroidery', emoji: '🌸' },
  { id: 'borders-lace', name: 'Borders & Lace', emoji: '🎨' },
  { id: 'buttons-closures', name: 'Buttons & Closures', emoji: '🔘' },
  { id: 'prints-patterns', name: 'Prints & Patterns', emoji: '🎭' },
  { id: 'fabric-type', name: 'Fabric Type', emoji: '🧶' },
  { id: 'length', name: 'Length', emoji: '📏' }
]

// Sample design elements
const SAMPLE_DESIGNS = [
  // Sleeve Styles
  {
    categoryId: 'sleeve-style',
    categoryName: 'Sleeve Style',
    name: 'Full Sleeve',
    price: 50,
    image: 'https://images.unsplash.com/photo-1542295669297-4d352b042bca?w=400',
    description: 'Classic full-length sleeves for traditional elegance',
    garmentType: 'kurti',
    displayOrder: 1
  },
  {
    categoryId: 'sleeve-style',
    categoryName: 'Sleeve Style',
    name: 'Three-Quarter Sleeve',
    price: 40,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
    description: 'Versatile three-quarter length sleeves',
    garmentType: 'kurti',
    displayOrder: 2
  },
  {
    categoryId: 'sleeve-style',
    categoryName: 'Sleeve Style',
    name: 'Short Sleeve',
    price: 30,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400',
    description: 'Comfortable short sleeves for casual wear',
    garmentType: 'kurti',
    displayOrder: 3
  },
  {
    categoryId: 'sleeve-style',
    categoryName: 'Sleeve Style',
    name: 'Sleeveless',
    price: 0,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
    description: 'Modern sleeveless design',
    garmentType: 'blouse',
    displayOrder: 4
  },
  
  // Front Neck Designs
  {
    categoryId: 'front-neck-designs',
    categoryName: 'Front Neck Designs',
    name: 'Round Neck',
    price: 0,
    image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400',
    description: 'Simple and elegant round neckline',
    garmentType: 'kurti',
    displayOrder: 1
  },
  {
    categoryId: 'front-neck-designs',
    categoryName: 'Front Neck Designs',
    name: 'V-Neck',
    price: 20,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
    description: 'Flattering V-shaped neckline',
    garmentType: 'kurti',
    displayOrder: 2
  },
  {
    categoryId: 'front-neck-designs',
    categoryName: 'Front Neck Designs',
    name: 'Boat Neck',
    price: 30,
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400',
    description: 'Wide boat-shaped neckline',
    garmentType: 'blouse',
    displayOrder: 3
  },
  
  // Embroidery
  {
    categoryId: 'embroidery',
    categoryName: 'Embroidery',
    name: 'Zari Work',
    price: 200,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400',
    description: 'Traditional golden zari embroidery',
    garmentType: 'kurti',
    displayOrder: 1
  },
  {
    categoryId: 'embroidery',
    categoryName: 'Embroidery',
    name: 'Thread Work',
    price: 150,
    image: 'https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?w=400',
    description: 'Intricate thread embroidery',
    garmentType: 'kurti',
    displayOrder: 2
  },
  
  // Fabric Types
  {
    categoryId: 'fabric-type',
    categoryName: 'Fabric Type',
    name: 'Cotton',
    price: 0,
    image: 'https://images.unsplash.com/photo-1618333281914-37a7e2b50f88?w=400',
    description: 'Breathable cotton fabric',
    garmentType: 'kurti',
    displayOrder: 1
  },
  {
    categoryId: 'fabric-type',
    categoryName: 'Fabric Type',
    name: 'Silk',
    price: 100,
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400',
    description: 'Premium silk fabric',
    garmentType: 'saree',
    displayOrder: 2
  }
]

async function populateDesignElements() {
  try {
    console.log('🔄 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    console.log('\n📊 Available Garment Types:', GARMENT_TYPES.join(', '))
    console.log('\n📂 Available Categories:')
    CATEGORIES.forEach(cat => console.log(`   ${cat.emoji} ${cat.id} - ${cat.name}`))

    // Check existing design elements
    const existingCount = await DesignElement.countDocuments()
    console.log(`\n📦 Current design elements in database: ${existingCount}`)

    if (existingCount > 0) {
      console.log('\n⚠️  Database already has design elements.')
      console.log('Do you want to:')
      console.log('1. Add sample designs (keeping existing ones)')
      console.log('2. Delete all and start fresh')
      console.log('\nTo delete all: Run this script with --reset flag')
      console.log('Example: node scripts/populateDesignElements.js --reset')
      
      if (!process.argv.includes('--reset')) {
        console.log('\n✅ Adding sample designs to existing collection...')
      } else {
        console.log('\n🗑️  Deleting all existing design elements...')
        await DesignElement.deleteMany({})
        console.log('✅ Deleted all existing design elements')
      }
    }

    console.log('\n📝 Creating sample design elements...')
    
    for (const design of SAMPLE_DESIGNS) {
      try {
        const newDesign = new DesignElement(design)
        await newDesign.save()
        console.log(`✅ Created: ${design.name} (${design.garmentType} - ${design.categoryName})`)
      } catch (err) {
        console.error(`❌ Error creating ${design.name}:`, err.message)
      }
    }

    const finalCount = await DesignElement.countDocuments()
    console.log(`\n✅ Completed! Total design elements: ${finalCount}`)
    
    console.log('\n📋 Summary by Category:')
    for (const category of CATEGORIES) {
      const count = await DesignElement.countDocuments({ categoryId: category.id })
      if (count > 0) {
        console.log(`   ${category.emoji} ${category.name}: ${count} designs`)
      }
    }

    console.log('\n📋 Summary by Garment Type:')
    for (const garmentType of GARMENT_TYPES) {
      const count = await DesignElement.countDocuments({ garmentType: garmentType })
      if (count > 0) {
        console.log(`   ${garmentType}: ${count} designs`)
      }
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await mongoose.connection.close()
    console.log('\n🔌 Database connection closed')
    process.exit(0)
  }
}

populateDesignElements()
