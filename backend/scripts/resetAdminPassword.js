import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js'
import dotenv from 'dotenv'

dotenv.config()

const resetAdminPassword = async () => {
  try {
    console.log('🔄 Resetting admin password...')
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Find admin user
    const admin = await User.findOne({ email: 'mydigitailorpro@gmail.com' }).select('+password')
    
    if (!admin) {
      console.log('❌ Admin user not found')
      process.exit(1)
    }

    console.log('👤 Found admin user:', admin.email)
    console.log('🗑️ Removing old password hash...')

    // Create a completely fresh password hash
    const plainPassword = 'Digi@10692'
    console.log('🔐 Creating fresh password hash for:', plainPassword)
    
    // Use bcryptjs.hash directly, not the pre-save middleware
    const saltRounds = 12
    const newHashedPassword = await bcryptjs.hash(plainPassword, saltRounds)
    
    console.log('✅ New hash created successfully')
    console.log('📏 New hash length:', newHashedPassword.length)
    console.log('🔤 New hash preview:', newHashedPassword.substring(0, 20) + '...')

    // Test the new hash immediately
    console.log('🧪 Testing new hash before saving...')
    const testResult = await bcryptjs.compare(plainPassword, newHashedPassword)
    console.log('Test result:', testResult ? '✅ WORKS' : '❌ FAILED')

    if (!testResult) {
      console.log('❌ Hash test failed, something is wrong with bcryptjs')
      process.exit(1)
    }

    // Update the user directly in the database (bypass Mongoose middleware)
    await User.updateOne(
      { email: 'mydigitailorpro@gmail.com' },
      { 
        $set: { 
          password: newHashedPassword,
          updatedAt: new Date()
        } 
      }
    )

    console.log('💾 Password updated directly in database')

    // Verify the update
    const updatedAdmin = await User.findOne({ email: 'mydigitailorpro@gmail.com' }).select('+password')
    console.log('✅ Verification - Password in DB:', updatedAdmin.password.substring(0, 20) + '...')

    // Final test
    console.log('🎯 Final test with stored password:')
    const finalTest = await bcryptjs.compare(plainPassword, updatedAdmin.password)
    console.log('Final result:', finalTest ? '✅ SUCCESS' : '❌ STILL FAILED')

    if (finalTest) {
      console.log('')
      console.log('🎉 Admin password reset successfully!')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('📧 Email: mydigitailorpro@gmail.com')
      console.log('🔑 Password: Digi@10692')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('💡 You can now login successfully!')
    } else {
      console.log('❌ Reset failed, there might be an issue with bcryptjs')
    }
    
    await mongoose.disconnect()
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Error resetting admin password:', error)
    await mongoose.disconnect()
    process.exit(1)
  }
}

console.log('🔄 DigiTailor Admin Password Reset Script')
console.log('=========================================')
resetAdminPassword()
