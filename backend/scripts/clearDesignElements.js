import mongoose from 'mongoose'
import DesignElement from '../models/designElement.model.js'
import dotenv from 'dotenv'

dotenv.config()

async function clearDesignElements() {
  try {
    console.log('🔄 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    const count = await DesignElement.countDocuments()
    console.log(`\n📦 Current design elements: ${count}`)

    if (count > 0) {
      console.log('🗑️  Deleting all design elements...')
      await DesignElement.deleteMany({})
      console.log('✅ All design elements deleted!')
    } else {
      console.log('✅ Database is already empty')
    }

    console.log('\n📋 Your Categories:')
    console.log('   ✨ aari-work - Aari Work')
    console.log('   🔘 buttons-closures - Buttons and Closures')
    console.log('   🎭 borders-laces - Borders and Laces')
    console.log('   💎 front-neck - Front Neck')
    console.log('   🎀 back-neck - Back Neck')
    console.log('   👕 sleeve - Sleeve')
    console.log('   🧵 ropes - Ropes')
    console.log('   🕸️  mirror-work - Mirror Work')

    console.log('\n📊 Your Garment Types:')
    console.log('   👕 kurti - Kurti')
    console.log('   👗 blouse - Blouse')

    console.log('\n✅ You can now add your own designs using these categories!')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await mongoose.connection.close()
    console.log('\n🔌 Database connection closed')
    process.exit(0)
  }
}

clearDesignElements()
