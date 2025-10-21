import mongoose from 'mongoose'
import ModularOrder from './models/modularOrder.model.js'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/digitailor'

async function testModularOrder() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Test order data similar to what frontend sends
    const testOrderData = {
      customerInfo: {
        name: 'Test Customer',
        phone: '1234567890',
        email: 'test@example.com'
      },
      selections: [
        {
          categoryId: 'buttons-closures',
          categoryName: 'Buttons & Closures',
          designId: '123',
          designName: 'Test Design',
          price: 76,
          image: 'test-image.jpg',
          description: 'Test description'
        }
      ],
      totalPrice: 256,
      basePrice: 180
    }

    console.log('🧪 Creating test modular order...')
    
    // Generate orderId manually
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substr(2, 5)
    const generatedOrderId = `MOD-${timestamp}-${random}`.toUpperCase()
    
    const order = new ModularOrder({
      ...testOrderData,
      orderId: generatedOrderId
    })
    
    await order.save()
    
    console.log('✅ Test order created successfully!')
    console.log('Order ID:', order.orderId)
    console.log('Customer:', order.customerInfo.name)
    console.log('Total Price:', order.totalPrice)
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    console.error('Error stack:', error.stack)
  } finally {
    await mongoose.disconnect()
    console.log('✅ Disconnected from MongoDB')
  }
}

testModularOrder()