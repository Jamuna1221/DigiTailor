import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'
import crypto from 'crypto'

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  phone: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['customer', 'tailor', 'admin'], 
    default: 'customer' 
  },
  
  // ✅ General specializations for signup form
  specializations: [{ 
    type: String,
    enum: ['men', 'women', 'kids', 'bridal']
  }],
  
  // ✅ Complete tailor profile for dashboard and allocation
  tailorProfile: {
    // Specializations matching your signup form
    specialties: [{
      type: String,
      enum: ['men', 'women', 'kids', 'bridal']
    }],
    
    // Professional details
    experience: {
      type: Number,
      default: 0,
      min: 0
    },
    
    // Performance metrics
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    
    totalRatings: {
      type: Number,
      default: 0
    },
    
    completedOrders: {
      type: Number,
      default: 0
    },
    
    // Workload management
    currentWorkload: {
      type: Number,
      default: 0
    },
    
    maxCapacity: {
      type: Number,
      default: 5,
      min: 1,
      max: 20
    },
    
    // Availability
    isActive: {
      type: Boolean,
      default: true
    },
    
    isAvailable: {
      type: Boolean,
      default: true
    },
    
    // Work schedule
    workingHours: {
      start: {
        type: String,
        default: '09:00'
      },
      end: {
        type: String,
        default: '18:00'
      }
    },
    
    workingDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      default: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    }],
    
    // Location details
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      area: String
    },
    
    // Portfolio and certifications
    portfolio: [{
      title: String,
      description: String,
      image: String,
      category: {
        type: String,
        enum: ['men', 'women', 'kids', 'bridal']
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    
    certifications: [{
      name: String,
      institution: String,
      year: Number,
      certificate: String // URL to certificate image
    }],
    
    // Pricing information
    pricing: {
      basePrice: {
        men: { type: Number, default: 500 },
        women: { type: Number, default: 600 },
        kids: { type: Number, default: 400 },
        bridal: { type: Number, default: 2000 }
      },
      rush: {
        multiplier: { type: Number, default: 1.5 },
        enabled: { type: Boolean, default: true }
      }
    },
    
    // Statistics
    stats: {
      averageCompletionTime: { type: Number, default: 7 }, // days
      onTimeDeliveryRate: { type: Number, default: 100 }, // percentage
      customerSatisfactionRate: { type: Number, default: 100 }, // percentage
      totalEarnings: { type: Number, default: 0 }
    },
    
    // Reviews from customers
    reviews: [{
      customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    
    // Bank details for payments
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      bankName: String,
      accountHolderName: String
    },
    
    // Verification status
    verification: {
      isVerified: { type: Boolean, default: false },
      documents: [{
        type: { type: String, enum: ['id_proof', 'address_proof', 'skill_certificate'] },
        url: String,
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
        uploadedAt: { type: Date, default: Date.now }
      }],
      verifiedAt: Date,
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  },
  
  // Customer specific fields
  customerProfile: {
    preferences: {
      categories: [String],
      fabrics: [String],
      colors: [String]
    },
    
    measurements: {
      chest: Number,
      waist: Number,
      hip: Number,
      shoulder: Number,
      neckline: Number,
      armLength: Number,
      height: Number,
      weight: Number,
      notes: String,
      lastUpdated: {
        type: Date,
        default: Date.now
      }
    },
    
    addresses: [{
      type: { type: String, enum: ['home', 'work', 'other'], default: 'home' },
      fullName: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      isDefault: { type: Boolean, default: false }
    }],
    
    favoriteDesigns: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
    
    favoriteTailors: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  
  // General fields
  profileImage: {
    type: String,
    default: null
  },
  
  isActive: { 
    type: Boolean, 
    default: true 
  },
  
  loyaltyPoints: { 
    type: Number, 
    default: 0 
  },
  
  lastLoginAt: {
    type: Date
  },
  
  createdBy: { 
    type: String 
  },
  
  // Password reset fields
  passwordResetToken: { 
    type: String 
  },
  
  passwordResetExpires: { 
    type: Date 
  },
  
  // Notification preferences
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    orderUpdates: { type: Boolean, default: true },
    promotions: { type: Boolean, default: false }
  }
}, { 
  timestamps: true,
  suppressReservedKeysWarning: true
})

// ✅ Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`
})

// ✅ Virtual for tailor rating display
userSchema.virtual('displayRating').get(function() {
  if (this.role === 'tailor' && this.tailorProfile?.rating) {
    return this.tailorProfile.rating.toFixed(1)
  }
  return 'No ratings'
})

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

// ✅ Method to update tailor rating
userSchema.methods.updateTailorRating = async function(newRating) {
  if (this.role !== 'tailor') return
  
  const currentRating = this.tailorProfile.rating || 0
  const currentCount = this.tailorProfile.totalRatings || 0
  
  const newCount = currentCount + 1
  const newAverageRating = ((currentRating * currentCount) + newRating) / newCount
  
  this.tailorProfile.rating = Math.round(newAverageRating * 10) / 10 // Round to 1 decimal
  this.tailorProfile.totalRatings = newCount
  
  return await this.save()
}

// ✅ Method to update workload
userSchema.methods.updateWorkload = async function(increment = 1) {
  if (this.role !== 'tailor') return
  
  this.tailorProfile.currentWorkload = Math.max(0, (this.tailorProfile.currentWorkload || 0) + increment)
  return await this.save()
}

// ✅ Method to check availability
userSchema.methods.isAvailableForWork = function() {
  if (this.role !== 'tailor') return false
  
  return (
    this.isActive && 
    this.tailorProfile?.isActive && 
    this.tailorProfile?.isAvailable &&
    (this.tailorProfile?.currentWorkload || 0) < (this.tailorProfile?.maxCapacity || 5)
  )
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

// ✅ Pre-save middleware to sync specializations with tailor profile
userSchema.pre('save', function(next) {
  if (this.role === 'tailor' && this.specializations && this.specializations.length > 0) {
    if (!this.tailorProfile) {
      this.tailorProfile = {}
    }
    this.tailorProfile.specialties = this.specializations
  }
  next()
})

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject({ virtuals: true })
  delete userObject.password
  delete userObject.passwordResetToken
  delete userObject.passwordResetExpires
  
  // Remove sensitive tailor information for non-admin users
  if (this.role === 'tailor' && userObject.tailorProfile) {
    delete userObject.tailorProfile.bankDetails
    delete userObject.tailorProfile.totalEarnings
  }
  
  return userObject
}

// Index for better query performance
userSchema.index({ email: 1 })
userSchema.index({ role: 1 })
userSchema.index({ isActive: 1 })
userSchema.index({ passwordResetToken: 1 })
userSchema.index({ 'tailorProfile.specialties': 1 })
userSchema.index({ 'tailorProfile.isActive': 1 })
userSchema.index({ 'tailorProfile.rating': -1 })
userSchema.index({ 'tailorProfile.currentWorkload': 1 })

export default mongoose.model('User', userSchema)
