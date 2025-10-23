import mongoose from 'mongoose'
import DesignElement from '../models/designElement.model.js'
import dotenv from 'dotenv'

dotenv.config()

// One design per category - you can replace these with your actual designs later
const SAMPLE_DESIGNS = [
  {
    categoryId: 'aari-work',
    categoryName: 'Aari Work',
    name: 'Basic Aari Work',
    price: 150,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400',
    description: 'Traditional Aari embroidery work',
    garmentType: 'kurti',
    displayOrder: 1
  },
  {
    categoryId: 'buttons-closures',
    categoryName: 'Buttons and Closures',
    name: 'Standard Buttons',
    price: 30,
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400',
    description: 'Standard button closure',
    garmentType: 'kurti',
    displayOrder: 1
  },
  {
    categoryId: 'borders-laces',
    categoryName: 'Borders and Laces',
    name: 'Simple Border',
    price: 80,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
    description: 'Decorative border and lace',
    garmentType: 'kurti',
    displayOrder: 1
  },
  {
    categoryId: 'front-neck',
    categoryName: 'Front Neck',
    name: 'Round Neck',
    price: 0,
    image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400',
    description: 'Simple round neck design',
    garmentType: 'kurti',
    displayOrder: 1
  },
  {
    categoryId: 'back-neck',
    categoryName: 'Back Neck',
    name: 'Basic Back Neck',
    price: 50,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
    description: 'Simple back neck design',
    garmentType: 'kurti',
    displayOrder: 1
  },
  {
    categoryId: 'sleeve',
    categoryName: 'Sleeve',
    name: 'Full Sleeve',
    price: 40,
    image: 'https://images.unsplash.com/photo-1542295669297-4d352b042bca?w=400',
    description: 'Full length sleeve',
    garmentType: 'kurti',
    displayOrder: 1
  },
  {
    categoryId: 'ropes',
    categoryName: 'Ropes',
    name: 'Decorative Rope',
    price: 60,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400',
    description: 'Decorative rope detail',
    garmentType: 'kurti',
    displayOrder: 1
  },
  {
    categoryId: 'mirror-work',
    categoryName: 'Mirror Work',
    name: 'Basic Mirror Work',
    price: 120,
    image: 'https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?w=400',
    description: 'Traditional mirror work embellishment',
    garmentType: 'kurti',
    displayOrder: 1
  },
  // Add one blouse design too
  {
    categoryId: 'front-neck',
    categoryName: 'Front Neck',
    name: 'Blouse Round Neck',
    price: 0,
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400',
    description: 'Simple round neck for blouse',
    garmentType: 'blouse',
    displayOrder: 1
  }
]

async function addSampleDesigns() {
  try {
    console.log('🔄 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    console.log('\n📝 Adding one sample design per category...')
    
    for (const design of SAMPLE_DESIGNS) {
      try {
        const newDesign = new DesignElement(design)
        await newDesign.save()
        console.log(`✅ Added: ${design.name} (${design.garmentType} - ${design.categoryName})`)
      } catch (err) {
        console.error(`❌ Error creating ${design.name}:`, err.message)
      }
    }

    const totalCount = await DesignElement.countDocuments()
    console.log(`\n✅ Completed! Total designs: ${totalCount}`)
    
    console.log('\n📊 Summary by Garment Type:')
    const kurtiCount = await DesignElement.countDocuments({ garmentType: 'kurti' })
    const blouseCount = await DesignElement.countDocuments({ garmentType: 'blouse' })
    console.log(`   👕 Kurti: ${kurtiCount} designs`)
    console.log(`   👗 Blouse: ${blouseCount} designs`)

    console.log('\n📋 Summary by Category:')
    const categories = await DesignElement.distinct('categoryId')
    for (const categoryId of categories) {
      const count = await DesignElement.countDocuments({ categoryId })
      const design = await DesignElement.findOne({ categoryId })
      console.log(`   ${design.categoryName}: ${count} design(s)`)
    }

    console.log('\n✅ Now your admin panel will show all garment types and categories!')
    console.log('💡 You can edit or delete these samples and add your own designs.')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await mongoose.connection.close()
    console.log('\n🔌 Database connection closed')
    process.exit(0)
  }
}

addSampleDesigns()
