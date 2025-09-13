import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const createAdmin = async () => {
  try {
    console.log('🚀 Starting admin creation script...')
    
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB successfully')

    // Check if admin already exists
    console.log('🔍 Checking if admin user already exists...')
    const existingAdmin = await User.findOne({ 
      email: 'mydigitailorpro@gmail.com' 
    })

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!')
      console.log('📧 Email:', existingAdmin.email)
      console.log('👤 Name:', existingAdmin.firstName, existingAdmin.lastName)
      console.log('🎯 Role:', existingAdmin.role)
      console.log('💡 You can login with existing credentials')
      await mongoose.disconnect()
      process.exit(0)
    }

    console.log('🆕 Creating new admin user...')

    // Hash password securely
    console.log('🔐 Hashing password...')
    const hashedPassword = await bcryptjs.hash('Digi@10692', 12)

    // Create admin user
    const adminUser = new User({
      firstName: 'Digi',
      lastName: 'Tailor',
      email: 'mydigitailorpro@gmail.com',
      password: hashedPassword,
      phone: '8608737147',
      role: 'admin',
      isActive: true,
      loyaltyPoints: 0,
      specializations: [],
      createdBy: 'admin-seeder'
    })

    await adminUser.save()
    
    console.log('')
    console.log('🎉 Admin user created successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 Email: mydigitailorpro@gmail.com')
    console.log('🔑 Password: Digi@10692')
    console.log('👤 Name: Digi Tailor')
    console.log('📱 Phone: 8608737147')
    console.log('🎯 Role: admin')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('💡 You can now login to /admin with these credentials')
    console.log('')
    
    await mongoose.disconnect()
    console.log('🔌 Disconnected from MongoDB')
    process.exit(0)
    
  } catch (error) {
    console.error('')
    console.error('❌ Error creating admin user:')
    console.error(error.message)
    
    if (error.code === 11000) {
      console.error('📧 Email already exists in database')
    }
    
    await mongoose.disconnect()
    process.exit(1)
  }
}

// Execute the script
console.log('🎯 DigiTailor Admin User Creation Script')
console.log('======================================')
createAdmin()
