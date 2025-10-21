import mongoose from 'mongoose'
import DesignElement from './models/designElement.model.js'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/digitailor'

async function debugMissingDesigns() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // 1. Check total count
    const totalCount = await DesignElement.countDocuments({})
    console.log(`\n📊 Total design elements in database: ${totalCount}`)

    // 2. Check active vs inactive
    const activeCount = await DesignElement.countDocuments({ isActive: true })
    const inactiveCount = await DesignElement.countDocuments({ isActive: false })
    console.log(`✅ Active elements: ${activeCount}`)
    console.log(`❌ Inactive elements: ${inactiveCount}`)

    // 3. Group by garment type and status
    console.log('\n👕 Breakdown by Garment Type & Status:')
    const pipeline = [
      {
        $group: {
          _id: { 
            garmentType: '$garmentType', 
            isActive: '$isActive' 
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.garmentType': 1, '_id.isActive': -1 } }
    ]
    
    const breakdown = await DesignElement.aggregate(pipeline)
    breakdown.forEach(item => {
      const status = item._id.isActive ? '✅ Active' : '❌ Inactive'
      console.log(`  ${item._id.garmentType}: ${item.count} ${status}`)
    })

    // 4. Check for problematic data
    console.log('\n🔍 Checking for data issues:')
    
    // Elements with missing required fields
    const missingName = await DesignElement.countDocuments({ 
      $or: [{ name: null }, { name: '' }, { name: { $exists: false } }]
    })
    console.log(`❌ Missing name: ${missingName}`)

    const missingImage = await DesignElement.countDocuments({ 
      $or: [{ image: null }, { image: '' }, { image: { $exists: false } }]
    })
    console.log(`❌ Missing image: ${missingImage}`)

    const missingCategory = await DesignElement.countDocuments({ 
      $or: [{ categoryId: null }, { categoryId: '' }, { categoryId: { $exists: false } }]
    })
    console.log(`❌ Missing categoryId: ${missingCategory}`)

    // 5. Show sample of each garment type (active only)
    console.log('\n📋 Sample Active Elements by Garment Type:')
    const garmentTypes = await DesignElement.distinct('garmentType', { isActive: true })
    
    for (const garmentType of garmentTypes) {
      const samples = await DesignElement.find({ 
        garmentType, 
        isActive: true 
      }).limit(3).select('name categoryId categoryName price')
      
      console.log(`\n  ${garmentType.toUpperCase()}:`)
      if (samples.length === 0) {
        console.log('    No active elements found')
      } else {
        samples.forEach(sample => {
          console.log(`    - ${sample.name} (${sample.categoryId}) - ₹${sample.price}`)
        })
        
        const totalForType = await DesignElement.countDocuments({ 
          garmentType, 
          isActive: true 
        })
        console.log(`    Total active: ${totalForType}`)
      }
    }

    // 6. Check categories distribution
    console.log('\n📂 Categories with Active Elements:')
    const categoriesBreakdown = await DesignElement.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: { categoryId: '$categoryId', categoryName: '$categoryName' },
          count: { $sum: 1 },
          garmentTypes: { $addToSet: '$garmentType' }
        }
      },
      { $sort: { '_id.categoryId': 1 } }
    ])

    categoriesBreakdown.forEach(category => {
      console.log(`  ${category._id.categoryId}: ${category.count} elements`)
      console.log(`    Garment types: ${category.garmentTypes.join(', ')}`)
    })

    // 7. Test the actual API query
    console.log('\n🧪 Testing API Queries:')
    
    // Test for blouse in aari-work category
    const blouseAariWork = await DesignElement.find({
      categoryId: 'aari-work',
      garmentType: 'blouse',
      isActive: true
    }).select('name price image')
    console.log(`Blouse + Aari Work: ${blouseAariWork.length} elements`)
    blouseAariWork.forEach(element => {
      console.log(`  - ${element.name} (₹${element.price})`)
    })

    // Test for kurti in any category
    const kurtiElements = await DesignElement.find({
      garmentType: 'kurti',
      isActive: true
    }).select('name categoryId price').limit(5)
    console.log(`Kurti elements (first 5): ${kurtiElements.length}`)
    kurtiElements.forEach(element => {
      console.log(`  - ${element.name} (${element.categoryId}) - ₹${element.price}`)
    })

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await mongoose.disconnect()
    console.log('\n✅ Disconnected from MongoDB')
  }
}

debugMissingDesigns()