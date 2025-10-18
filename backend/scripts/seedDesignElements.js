import mongoose from 'mongoose'
import DesignElement from '../models/designElement.model.js'
import dotenv from 'dotenv'
dotenv.config()

const mockDesignData = [
  // Sleeves - Kurti
  {
    categoryId: 'sleeves',
    categoryName: 'Sleeves',
    name: 'Classic Full Sleeves',
    price: 150,
    image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=300&fit=crop',
    description: 'Traditional full-length sleeves with elegant finish',
    garmentType: 'kurti',
    displayOrder: 1
  },
  {
    categoryId: 'sleeves',
    categoryName: 'Sleeves',
    name: 'Modern Half Sleeves',
    price: 100,
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&h=300&fit=crop',
    description: 'Contemporary half sleeves perfect for casual wear',
    displayOrder: 2
  },
  {
    categoryId: 'sleeves',
    categoryName: 'Sleeves',
    name: 'Elegant Bell Sleeves',
    price: 250,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=300&fit=crop',
    description: 'Flowy bell sleeves for a bohemian look',
    displayOrder: 3
  },
  {
    categoryId: 'sleeves',
    categoryName: 'Sleeves',
    name: 'Sleeveless Design',
    price: 0,
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop',
    description: 'Clean sleeveless cut for modern styling',
    displayOrder: 4
  },
  {
    categoryId: 'sleeves',
    categoryName: 'Sleeves',
    name: 'Designer 3/4 Sleeves',
    price: 175,
    image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&h=300&fit=crop',
    description: '3/4 length sleeves with designer details',
    displayOrder: 5
  },

  // Front Neck Designs
  {
    categoryId: 'front-neck',
    categoryName: 'Front Neck Designs',
    name: 'Classic Round Neck',
    price: 50,
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=300&fit=crop',
    description: 'Timeless round neckline for versatile styling',
    displayOrder: 1
  },
  {
    categoryId: 'front-neck',
    categoryName: 'Front Neck Designs',
    name: 'Elegant V-Neck',
    price: 100,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=300&fit=crop',
    description: 'Sophisticated V-neckline for formal occasions',
    displayOrder: 2
  },
  {
    categoryId: 'front-neck',
    categoryName: 'Front Neck Designs',
    name: 'Boat Neck Design',
    price: 125,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    description: 'Graceful boat neck for elegant silhouette',
    displayOrder: 3
  },
  {
    categoryId: 'front-neck',
    categoryName: 'Front Neck Designs',
    name: 'Square Neck Style',
    price: 150,
    image: 'https://images.unsplash.com/photo-1544957992-20514f595d6f?w=400&h=300&fit=crop',
    description: 'Modern square neckline with clean lines',
    displayOrder: 4
  },

  // Back Neck Designs
  {
    categoryId: 'back-neck',
    categoryName: 'Back Neck Designs',
    name: 'Simple Back Design',
    price: 0,
    image: 'https://images.unsplash.com/photo-1594633312681-ca13fe5dd6fc?w=400&h=300&fit=crop',
    description: 'Clean and simple back neckline',
    displayOrder: 1
  },
  {
    categoryId: 'back-neck',
    categoryName: 'Back Neck Designs',
    name: 'Deep Back Cut',
    price: 100,
    image: 'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=400&h=300&fit=crop',
    description: 'Dramatic deep back for evening wear',
    displayOrder: 2
  },
  {
    categoryId: 'back-neck',
    categoryName: 'Back Neck Designs',
    name: 'Lace Back Detail',
    price: 200,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop',
    description: 'Delicate lace detailing on back neckline',
    displayOrder: 3
  },
  {
    categoryId: 'back-neck',
    categoryName: 'Back Neck Designs',
    name: 'Button Back Closure',
    price: 125,
    image: 'https://images.unsplash.com/photo-1582142306909-195724d33814?w=400&h=300&fit=crop',
    description: 'Elegant button closure detail',
    displayOrder: 4
  },

  // Ropes & Strings
  {
    categoryId: 'ropes',
    categoryName: 'Ropes & Strings',
    name: 'Simple Rope Detail',
    price: 75,
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=300&fit=crop',
    description: 'Basic rope detailing for subtle accent',
    displayOrder: 1
  },
  {
    categoryId: 'ropes',
    categoryName: 'Ropes & Strings',
    name: 'Golden Rope Design',
    price: 150,
    image: 'https://images.unsplash.com/photo-1609205807107-e8ec2120f9de?w=400&h=300&fit=crop',
    description: 'Luxurious golden rope embellishment',
    displayOrder: 2
  },
  {
    categoryId: 'ropes',
    categoryName: 'Ropes & Strings',
    name: 'Beaded Rope Style',
    price: 200,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop',
    description: 'Elegant beaded rope detailing',
    displayOrder: 3
  },

  // Aari Work
  {
    categoryId: 'aari',
    categoryName: 'Aari Work',
    name: 'Simple Aari Work',
    price: 400,
    image: 'https://images.unsplash.com/photo-1572884596693-6c2df2d43b0c?w=400&h=300&fit=crop',
    description: 'Basic Aari embroidery with traditional patterns',
    displayOrder: 1
  },
  {
    categoryId: 'aari',
    categoryName: 'Aari Work',
    name: 'Heavy Aari Design',
    price: 800,
    image: 'https://images.unsplash.com/photo-1609205807107-e8ec2120f9de?w=400&h=300&fit=crop',
    description: 'Intricate heavy Aari work with detailed motifs',
    displayOrder: 2
  },
  {
    categoryId: 'aari',
    categoryName: 'Aari Work',
    name: 'Gold Thread Aari',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop',
    description: 'Luxurious gold thread Aari embroidery',
    displayOrder: 3
  },

  // Embroidery
  {
    categoryId: 'embroidery',
    categoryName: 'Embroidery',
    name: 'Floral Embroidery',
    price: 300,
    image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop',
    description: 'Delicate floral embroidery patterns',
    displayOrder: 1
  },
  {
    categoryId: 'embroidery',
    categoryName: 'Embroidery',
    name: 'Mirror Work Design',
    price: 450,
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=300&fit=crop',
    description: 'Traditional mirror work embroidery',
    displayOrder: 2
  },
  {
    categoryId: 'embroidery',
    categoryName: 'Embroidery',
    name: 'Thread Work Special',
    price: 350,
    image: 'https://images.unsplash.com/photo-1572884596693-6c2df2d43b0c?w=400&h=300&fit=crop',
    description: 'Colorful thread work embroidery',
    displayOrder: 3
  }
]

const seedDesignElements = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/digitailor')
    console.log('Connected to MongoDB')

    // Clear existing data
    await DesignElement.deleteMany({})
    console.log('Cleared existing design elements')

    // Insert mock data
    const insertedElements = await DesignElement.insertMany(mockDesignData)
    console.log(`Inserted ${insertedElements.length} design elements`)

    // Display summary
    const categories = {}
    insertedElements.forEach(element => {
      if (!categories[element.categoryId]) {
        categories[element.categoryId] = 0
      }
      categories[element.categoryId]++
    })

    console.log('Summary:')
    Object.entries(categories).forEach(([categoryId, count]) => {
      console.log(`  ${categoryId}: ${count} designs`)
    })

    console.log('✅ Seed data inserted successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding data:', error)
    process.exit(1)
  }
}

// Run the seed function
seedDesignElements()