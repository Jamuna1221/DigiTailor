import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js'
import dotenv from 'dotenv'

dotenv.config()

const fixAdminPassword = async () => {
  try {
    console.log('🔧 Fixing admin password...')
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Find admin user
    const admin = await User.findOne({ email: 'mydigitailorpro@gmail.com' })
    
    if (!admin) {
      console.log('❌ Admin user not found')
      process.exit(1)
    }

    console.log('👤 Found admin user:', admin.email)
    console.log('🔍 Current password hash:', admin.password ? 'EXISTS' : 'MISSING')

    // Hash the password properly
    console.log('🔐 Hashing new password...')
    const hashedPassword = await bcryptjs.hash('Digi@10692', 12)
    console.log('✅ Password hashed successfully')
    console.log('📝 New hash length:', hashedPassword.length)

    // Update admin password directly
    admin.password = hashedPassword
    await admin.save({ validateBeforeSave: false })
    
    console.log('')
    console.log('🎉 Admin password updated successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 Email: mydigitailorpro@gmail.com')
    console.log('🔑 Password: Digi@10692')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('💡 Try logging in again now')
    
    // Test the password comparison
    console.log('')
    console.log('🧪 Testing password comparison...')
    const isMatch = await bcryptjs.compare('Digi@10692', hashedPassword)
    console.log('✅ Password comparison test:', isMatch ? 'PASSED' : 'FAILED')
    
    await mongoose.disconnect()
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Error fixing admin password:', error)
    await mongoose.disconnect()
    process.exit(1)
  }
}

console.log('🔧 DigiTailor Admin Password Fix Script')
console.log('=====================================')
fixAdminPassword()
