import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true 
  },
  otp: { 
    type: String, 
    required: true 
  },
  userData: { 
    type: Object, 
    required: true 
  }, // Temporary user registration data
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 300 // 5 minutes expiry
  }
}, {
  timestamps: true
})

// Index for automatic cleanup
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 })

export default mongoose.model('OTP', otpSchema)
