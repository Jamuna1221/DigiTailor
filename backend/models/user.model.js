import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  phone: { type: String, required: true },
  role: { type: String, enum: ['customer', 'tailor', 'admin'], default: 'customer' },
  specializations: [{ type: String }],
  isActive: { type: Boolean, default: true },
  loyaltyPoints: { type: Number, default: 0 },
  createdBy: { type: String },
  
  // Password reset fields
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date }
}, { timestamps: true })

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    console.log('🔍 Comparing password for user:', this.email)
    console.log('🔐 Candidate password length:', candidatePassword ? candidatePassword.length : 'undefined')
    console.log('🗃️ Stored password hash length:', this.password ? this.password.length : 'undefined')
    
    const result = await bcryptjs.compare(candidatePassword, this.password)
    console.log('✅ Password comparison result:', result)
    
    return result
  } catch (error) {
    console.error('❌ Password comparison error:', error)
    return false
  }
}

// Update last login method
userSchema.methods.updateLastLogin = async function() {
  this.lastLoginAt = new Date()
  return await this.save({ validateBeforeSave: false })
}

// Generate password reset token
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex')
  
  this.passwordResetToken = resetToken
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  
  return resetToken
}

// Hash password before saving
userSchema.pre('save', async function(next) {
  try {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
      console.log('🔄 Password not modified, skipping hash for:', this.email)
      return next()
    }
    
    console.log('🔐 Hashing password for user:', this.email)
    console.log('📏 Original password length:', this.password ? this.password.length : 'undefined')
    
    // Hash password with cost of 12
    const hashedPassword = await bcryptjs.hash(this.password, 12)
    this.password = hashedPassword
    
    console.log('✅ Password hashed successfully')
    console.log('📏 Hashed password length:', this.password.length)
    
    next()
  } catch (error) {
    console.error('❌ Password hashing error:', error)
    next(error)
  }
})

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject()
  delete userObject.password
  delete userObject.passwordResetToken
  delete userObject.passwordResetExpires
  return userObject
}

// Index for better query performance
userSchema.index({ email: 1 })
userSchema.index({ role: 1 })
userSchema.index({ isActive: 1 })
userSchema.index({ passwordResetToken: 1 })

export default mongoose.model('User', userSchema)
