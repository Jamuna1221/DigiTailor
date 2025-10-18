import mongoose from 'mongoose'
import DesignElement from '../models/designElement.model.js'
import dotenv from 'dotenv'
dotenv.config()

const additionalDesignData = [
  // Buttons & Closures
  {
    categoryId: 'buttons',
    categoryName: 'Buttons & Closures',
    name: 'Simple Buttons',
    price: 25,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop',
    description: 'Basic button closure with clean finish',
    displayOrder: 1
  },
  {
    categoryId: 'buttons',
    categoryName: 'Buttons & Closures',
    name: 'Designer Buttons',
    price: 75,
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop',
    description: 'Stylish designer buttons for elegant look',
    displayOrder: 2
  },
  {
    categoryId: 'buttons',
    categoryName: 'Buttons & Closures',
    name: 'Metal Buttons',
    price: 100,
    image: 'https://images.unsplash.com/photo-1616628188467-0b4d5c8aecd1?w=400&h=300&fit=crop',
    description: 'Premium metal buttons for durability',
    displayOrder: 3
  },
  {
    categoryId: 'buttons',
    categoryName: 'Buttons & Closures',
    name: 'Hook Closure',
    price: 50,
    image: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&h=300&fit=crop',
    description: 'Traditional hook and eye closure',
    displayOrder: 4
  },
  {
    categoryId: 'buttons',
    categoryName: 'Buttons & Closures',
    name: 'Zip Closure',
    price: 75,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop',
    description: 'Modern zipper closure system',
    displayOrder: 5
  },

  // Borders & Lace
  {
    categoryId: 'borders',
    categoryName: 'Borders & Lace',
    name: 'Simple Border',
    price: 75,
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=300&fit=crop',
    description: 'Clean and simple decorative border',
    displayOrder: 1
  },
  {
    categoryId: 'borders',
    categoryName: 'Borders & Lace',
    name: 'Lace Border',
    price: 125,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    description: 'Delicate lace border detailing',
    displayOrder: 2
  },
  {
    categoryId: 'borders',
    categoryName: 'Borders & Lace',
    name: 'Golden Border',
    price: 200,
    image: 'https://images.unsplash.com/photo-1609205807107-e8ec2120f9de?w=400&h=300&fit=crop',
    description: 'Luxurious golden border work',
    displayOrder: 3
  },
  {
    categoryId: 'borders',
    categoryName: 'Borders & Lace',
    name: 'Beaded Border',
    price: 250,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop',
    description: 'Elegant beaded border design',
    displayOrder: 4
  },
  {
    categoryId: 'borders',
    categoryName: 'Borders & Lace',
    name: 'Stone Border',
    price: 300,
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=300&fit=crop',
    description: 'Premium stone border embellishment',
    displayOrder: 5
  },

  // Fabric Types
  {
    categoryId: 'fabric-type',
    categoryName: 'Fabric Type',
    name: 'Cotton Fabric',
    price: 0,
    image: 'https://images.unsplash.com/photo-1586810430478-a0f67dd65b2d?w=400&h=300&fit=crop',
    description: 'Natural cotton fabric - breathable and comfortable',
    displayOrder: 1
  },
  {
    categoryId: 'fabric-type',
    categoryName: 'Fabric Type',
    name: 'Silk Fabric',
    price: 300,
    image: 'https://images.unsplash.com/photo-1594633312681-ca13fe5dd6fc?w=400&h=300&fit=crop',
    description: 'Premium silk fabric for luxury feel',
    displayOrder: 2
  },
  {
    categoryId: 'fabric-type',
    categoryName: 'Fabric Type',
    name: 'Georgette Fabric',
    price: 250,
    image: 'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=400&h=300&fit=crop',
    description: 'Lightweight georgette for elegant drape',
    displayOrder: 3
  },
  {
    categoryId: 'fabric-type',
    categoryName: 'Fabric Type',
    name: 'Chiffon Fabric',
    price: 200,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop',
    description: 'Sheer chiffon fabric for graceful flow',
    displayOrder: 4
  },
  {
    categoryId: 'fabric-type',
    categoryName: 'Fabric Type',
    name: 'Crepe Fabric',
    price: 225,
    image: 'https://images.unsplash.com/photo-1582142306909-195724d33814?w=400&h=300&fit=crop',
    description: 'Textured crepe fabric with elegant finish',
    displayOrder: 5
  },
  {
    categoryId: 'fabric-type',
    categoryName: 'Fabric Type',
    name: 'Satin Fabric',
    price: 275,
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=300&fit=crop',
    description: 'Glossy satin fabric for formal wear',
    displayOrder: 6
  },

  // Length & Fit
  {
    categoryId: 'length',
    categoryName: 'Length & Fit',
    name: 'Short Length',
    price: 0,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=300&fit=crop',
    description: 'Short length cut for casual styling',
    displayOrder: 1
  },
  {
    categoryId: 'length',
    categoryName: 'Length & Fit',
    name: 'Knee Length',
    price: 25,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    description: 'Knee-length for versatile wear',
    displayOrder: 2
  },
  {
    categoryId: 'length',
    categoryName: 'Length & Fit',
    name: 'Midi Length',
    price: 50,
    image: 'https://images.unsplash.com/photo-1544957992-20514f595d6f?w=400&h=300&fit=crop',
    description: 'Mid-calf length for elegant look',
    displayOrder: 3
  },
  {
    categoryId: 'length',
    categoryName: 'Length & Fit',
    name: 'Long Length',
    price: 75,
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&h=300&fit=crop',
    description: 'Full long length for formal occasions',
    displayOrder: 4
  },
  {
    categoryId: 'length',
    categoryName: 'Length & Fit',
    name: 'Floor Length',
    price: 100,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=300&fit=crop',
    description: 'Floor-sweeping length for special events',
    displayOrder: 5
  },
  {
    categoryId: 'length',
    categoryName: 'Length & Fit',
    name: 'Custom Length',
    price: 125,
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop',
    description: 'Custom tailored length as per requirement',
    displayOrder: 6
  },

  // Prints & Patterns
  {
    categoryId: 'prints',
    categoryName: 'Prints & Patterns',
    name: 'Floral Print',
    price: 150,
    image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop',
    description: 'Beautiful floral print design',
    displayOrder: 1
  },
  {
    categoryId: 'prints',
    categoryName: 'Prints & Patterns',
    name: 'Geometric Pattern',
    price: 125,
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=300&fit=crop',
    description: 'Modern geometric pattern design',
    displayOrder: 2
  },
  {
    categoryId: 'prints',
    categoryName: 'Prints & Patterns',
    name: 'Traditional Motifs',
    price: 200,
    image: 'https://images.unsplash.com/photo-1572884596693-6c2df2d43b0c?w=400&h=300&fit=crop',
    description: 'Classic traditional motif patterns',
    displayOrder: 3
  },
  {
    categoryId: 'prints',
    categoryName: 'Prints & Patterns',
    name: 'Abstract Design',
    price: 175,
    image: 'https://images.unsplash.com/photo-1609205807107-e8ec2120f9de?w=400&h=300&fit=crop',
    description: 'Contemporary abstract print design',
    displayOrder: 4
  }
]

const addMissingCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/digitailor')
    console.log('Connected to MongoDB')

    // Insert additional data
    const insertedElements = await DesignElement.insertMany(additionalDesignData)
    console.log(`✅ Added ${insertedElements.length} additional design elements`)

    // Display summary
    const categories = {}
    insertedElements.forEach(element => {
      if (!categories[element.categoryId]) {
        categories[element.categoryId] = 0
      }
      categories[element.categoryId]++
    })

    console.log('New Categories Added:')
    Object.entries(categories).forEach(([categoryId, count]) => {
      console.log(`  ${categoryId}: ${count} designs`)
    })

    // Get total count
    const totalCount = await DesignElement.countDocuments({ isActive: true })
    console.log(`📊 Total design elements in database: ${totalCount}`)

    console.log('✅ Missing categories added successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error adding categories:', error)
    process.exit(1)
  }
}

// Run the function
addMissingCategories()