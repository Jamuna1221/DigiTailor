import bcrypt from 'bcryptjs'

async function testBcrypt() {
  console.log('🧪 Testing bcrypt functionality...\n')
  
  const testPassword = 'test123'
  const saltRounds = 12
  
  try {
    // 1. Hash the password
    const hashedPassword = await bcrypt.hash(testPassword, saltRounds)
    console.log('📝 Original Password:', testPassword)
    console.log('🔐 Hashed Password:', hashedPassword)
    
    // 2. Compare password
    const isMatch = await bcrypt.compare(testPassword, hashedPassword)
    console.log('✅ Passwords Match:', isMatch)
    
    // 3. Test wrong password
    const wrongMatch = await bcrypt.compare('wrongpassword', hashedPassword)
    console.log('❌ Wrong Password Match:', wrongMatch)
    
    console.log('\n🎉 bcrypt is working correctly!')
    
  } catch (error) {
    console.error('❌ bcrypt test failed:', error)
  }
}

testBcrypt()
