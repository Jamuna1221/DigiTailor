import fetch from 'node-fetch'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const API_BASE_URL = 'http://localhost:5000/api'
const ADMIN_KEY = process.env.ADMIN_REGISTRATION_KEY || 'DIGITAILOR_ADMIN_2024_SECURE_KEY'

async function testAdminRegistration() {
  try {
    console.log('🧪 Testing Admin Registration...')
    
    const testAdminData = {
      firstName: 'Test',
      lastName: 'Admin',
      email: 'testadmin@digitailor.com',
      password: 'Admin123!',
      phone: '9876543210',
      role: 'admin',
      adminKey: ADMIN_KEY
    }
    
    console.log('📨 Sending admin registration request...')
    
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testAdminData)
    })
    
    const data = await response.json()
    
    if (data.success) {
      console.log('✅ Admin registration successful!')
      console.log('🔑 Token:', data.data.token)
      console.log('👤 Admin:', data.data.user)
      console.log('\n🎯 You can now:')
      console.log('  1. Go to http://localhost:5173/admin-signup')
      console.log('  2. Use the admin key:', ADMIN_KEY)
      console.log('  3. Create your admin account')
      console.log('  4. Login at http://localhost:5173/login')
      console.log('  5. Access admin panel at http://localhost:5173/admin')
    } else {
      console.log('❌ Admin registration failed:', data.message)
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error.message)
  }
}

// Run test if server is available
console.log('🚀 Starting admin registration test...')
console.log('🔑 Admin key:', ADMIN_KEY)
testAdminRegistration()