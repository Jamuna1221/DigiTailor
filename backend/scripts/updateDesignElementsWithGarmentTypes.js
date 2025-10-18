import mongoose from 'mongoose'
import DesignElement from '../models/designElement.model.js'

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/digitailor', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// Define garment-specific design mappings
const garmentDesignMapping = {
  kurti: {
    categories: ['front-neck-designs', 'back-neck-designs', 'sleeves', 'embroidery', 'aari-work', 'borders-lace', 'prints-patterns', 'ropes-strings'],
    designs: {
      'front-neck-designs': ['V-neck', 'Round neck', 'Square neck', 'Boat neck'],
      'back-neck-designs': ['Deep back', 'Keyhole back', 'Button back', 'Plain back'],
      'sleeves': ['Full sleeves', 'Half sleeves', '3/4 sleeves'],
      'embroidery': ['Floral embroidery', 'Thread work', 'Mirror work'],
      'aari-work': ['Traditional Aari', 'Modern Aari', 'Heavy Aari'],
      'borders-lace': ['Lace border', 'Embroidered border', 'Printed border', 'Stone border', 'Mirror border'],
      'prints-patterns': ['Floral print', 'Geometric print', 'Abstract print', 'Traditional print'],
      'buttons-closures': ['Button front', 'Zip closure', 'Tie closure', 'Hook closure', 'No closure'],
      'ropes-strings': ['Waist tie', 'Neck tie', 'Sleeve tie']
    }
  },
  blouse: {
    categories: ['front-neck-designs', 'back-neck-designs', 'sleeves', 'embroidery', 'aari-work', 'borders-lace', 'buttons-closures'],
    designs: {
      'front-neck-designs': ['Deep V-neck', 'Sweetheart neck', 'High neck', 'Off-shoulder'],
      'back-neck-designs': ['Deep V-back', 'Backless', 'Halter back', 'Cross back'],
      'sleeves': ['Sleeveless', 'Cap sleeves', 'Elbow sleeves'],
      'embroidery': ['Heavy embroidery', 'Stone work', 'Sequin work'],
      'aari-work': ['Bridal Aari', 'Party Aari', 'Simple Aari'],
      'borders-lace': ['Designer lace', 'Stone border', 'Gold border', 'Pearl border', 'Embroidered edge'],
      'buttons-closures': ['Hook & eye', 'Zip back', 'Tie back', 'Button back', 'Drawstring']
    }
  },
  saree: {
    categories: ['borders-lace', 'embroidery', 'aari-work', 'prints-patterns'],
    designs: {
      'borders-lace': ['Traditional border', 'Zari border', 'Stone border', 'Embroidered border', 'Plain border'],
      'embroidery': ['Pallu embroidery', 'Border embroidery', 'All-over embroidery'],
      'aari-work': ['Pallu Aari', 'Border Aari', 'Full Aari'],
      'prints-patterns': ['Traditional motifs', 'Modern prints', 'Floral patterns', 'Geometric designs']
    }
  }
}

async function updateDesignElementsWithGarmentTypes() {
  try {
    console.log('Starting to update design elements with garment types...')
    
    // Get all existing design elements
    const designElements = await DesignElement.find({})
    console.log(`Found ${designElements.length} existing design elements`)
    
    // For now, let's assign all existing elements to 'kurti' as the primary garment
    // Later we can create specific variants for other garments
    const updatePromises = designElements.map(element => {
      return DesignElement.findByIdAndUpdate(
        element._id,
        { garmentType: 'kurti' },
        { new: true }
      )
    })
    
    await Promise.all(updatePromises)
    console.log('Updated all existing design elements with garmentType: kurti')
    
    // Now let's create blouse-specific variants for relevant categories
    const blouseCategories = garmentDesignMapping.blouse.categories
    const kurtiElements = await DesignElement.find({ garmentType: 'kurti' })
    
    const blouseElements = []
    
    for (const element of kurtiElements) {
      if (blouseCategories.includes(element.categoryId)) {
        // Create blouse variant
        const blouseElement = {
          categoryId: element.categoryId,
          categoryName: element.categoryName,
          name: element.name,
          price: element.price,
          image: element.image,
          description: element.description.replace(/kurti/gi, 'blouse'),
          garmentType: 'blouse',
          isActive: element.isActive,
          displayOrder: element.displayOrder,
          createdBy: 'system-garment-update'
        }
        blouseElements.push(blouseElement)
      }
    }
    
    if (blouseElements.length > 0) {
      await DesignElement.insertMany(blouseElements)
      console.log(`Created ${blouseElements.length} blouse-specific design elements`)
    }
    
    // Create saree-specific variants
    const sareeCategories = garmentDesignMapping.saree.categories
    const sareeElements = []
    
    for (const element of kurtiElements) {
      if (sareeCategories.includes(element.categoryId)) {
        // Create saree variant
        const sareeElement = {
          categoryId: element.categoryId,
          categoryName: element.categoryName,
          name: element.name,
          price: element.price,
          image: element.image,
          description: element.description.replace(/kurti/gi, 'saree'),
          garmentType: 'saree',
          isActive: element.isActive,
          displayOrder: element.displayOrder,
          createdBy: 'system-garment-update'
        }
        sareeElements.push(sareeElement)
      }
    }
    
    if (sareeElements.length > 0) {
      await DesignElement.insertMany(sareeElements)
      console.log(`Created ${sareeElements.length} saree-specific design elements`)
    }
    
    // Print summary
    const finalCounts = await DesignElement.aggregate([
      { $group: { _id: '$garmentType', count: { $sum: 1 } } }
    ])
    
    console.log('\nFinal design element counts by garment type:')
    finalCounts.forEach(item => {
      console.log(`${item._id}: ${item.count} designs`)
    })
    
    console.log('\nUpdate completed successfully!')
    
  } catch (error) {
    console.error('Error updating design elements:', error)
  } finally {
    mongoose.connection.close()
  }
}

updateDesignElementsWithGarmentTypes()