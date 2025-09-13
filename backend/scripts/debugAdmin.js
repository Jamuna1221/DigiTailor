import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js'
import dotenv from 'dotenv'

dotenv.config()

const debugAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    const admin = await User.findOne({ email: 'mydigitailorpro@gmail.com' }).select('+password')
    
    if (!admin) {
      console.log('❌ Admin user not found')
      process.exit(1)
    }

    console.log('📋 Admin Debug Info:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 Email:', admin.email)
    console.log('👤 Name:', admin.firstName, admin.lastName)
    console.log('🎯 Role:', admin.role)
    console.log('🔐 Password exists:', admin.password ? 'YES' : 'NO')
    console.log('📏 Password length:', admin.password ? admin.password.length : 0)
    console.log('🔤 Password preview:', admin.password ? admin.password.substring(0, 20) + '...' : 'N/A')
    console.log('🕐 Created:', admin.createdAt)
    console.log('🔧 Created by:', admin.createdBy)
    
    // Test password comparison
    if (admin.password) {
      console.log('')
      console.log('🧪 Testing password comparison:')
      const testPasswords = ['Digi@10692', 'wrong-password']
      
      for (const testPwd of testPasswords) {
        const isMatch = await bcryptjs.compare(testPwd, admin.password)
        console.log(`  "${testPwd}": ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`)
      }
    }
    
    await mongoose.disconnect()
    
  } catch (error) {
    console.error('❌ Debug error:', error)
    await mongoose.disconnect()
  }
}

debugAdmin()
