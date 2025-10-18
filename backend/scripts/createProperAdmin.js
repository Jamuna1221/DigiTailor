import mongoose from 'mongoose'
import Admin from '../models/admin.model.js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const createProperAdmin = async () => {
  try {
    console.log('🚀 Starting proper admin creation script...')
    
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB successfully')

    // Check if admin already exists
    console.log('🔍 Checking if admin already exists...')
    const existingAdmin = await Admin.findOne({ 
      email: 'mydigitailorpro@gmail.com' 
    })

    if (existingAdmin) {
      console.log('⚠️  Admin already exists!')
      console.log('📧 Email:', existingAdmin.email)
      console.log('👤 Name:', existingAdmin.fullName)
      console.log('🎯 Role:', existingAdmin.role)
      console.log('💡 You can login with existing admin credentials')
      await mongoose.disconnect()
      process.exit(0)
    }

    console.log('🆕 Creating new admin...')

    // Create admin (password will be hashed by pre-save middleware)
    const admin = new Admin({
      username: 'digitailoradmin',
      email: 'mydigitailorpro@gmail.com',
      password: 'Digi@10692', // This will be hashed automatically
      fullName: 'DigiTailor Admin',
      role: 'super_admin',
      permissions: ['users', 'orders', 'catalog', 'gallery', 'analytics', 'settings'],
      isActive: true,
      createdBy: 'system',
      notes: 'Primary admin account created by system'
    })

    await admin.save()
    
    console.log('')
    console.log('🎉 Admin created successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('👤 Username: digitailoradmin')
    console.log('📧 Email: mydigitailorpro@gmail.com')
    console.log('🔑 Password: Digi@10692')
    console.log('📝 Full Name: DigiTailor Admin')
    console.log('🎯 Role: super_admin')
    console.log('✅ Status: Active')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('💡 You can now login via: POST /api/admin/auth/login')
    console.log('💡 Use either username or email to login')
    console.log('')
    
    await mongoose.disconnect()
    console.log('🔌 Disconnected from MongoDB')
    process.exit(0)
    
  } catch (error) {
    console.error('')
    console.error('❌ Error creating admin:')
    console.error(error.message)
    
    if (error.code === 11000) {
      console.error('📧 Admin with this email/username already exists')
    }
    
    await mongoose.disconnect()
    process.exit(1)
  }
}

// Execute the script
console.log('🎯 DigiTailor Proper Admin Creation Script')
console.log('=========================================')
createProperAdmin()