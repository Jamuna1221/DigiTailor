// ===================================================================
// DIGITAILOR - COMPLETE MODELS COLLECTION
// All MongoDB Mongoose Schemas in One File
// ===================================================================

import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

// ===================================================================
// 1. USER MODEL
// ===================================================================
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  phone: { type: String},
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

const User = mongoose.model('User', userSchema)

// ===================================================================
// 2. ORDER MODEL
// ===================================================================
const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    productId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    },
    category: String,
    image: String,
    customizations: {
      fabric: String,
      color: String,
      size: String,
      specialInstructions: String
    }
  }],
  shippingInfo: {
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      street: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      zipCode: {
        type: String,
        required: true
      }
    },
    specialInstructions: String
  },
  pricing: {
    subtotal: {
      type: Number,
      required: true
    },
    delivery: {
      type: Number,
      default: 50
    },
    tax: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  payment: {
    method: {
      type: String,
      enum: ['razorpay', 'cod'],
      default: 'razorpay'
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    transactionDate: Date
  },
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'assigned', 'in_progress', 'completed', 'shipped','out_for_delivery', 'delivered', 'cancelled'],
    default: 'placed'
  },
  assignedTailor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  estimatedDelivery: {
    type: Date
  },
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  // ✅ NEW: Track which products in this order have been reviewed
  reviewsSubmitted: [{
    type: String // Product IDs that have been reviewed
  }],
  // ✅ ADDED: Delivery confirmation fields
  deliveryToken: {
    type: String,
    default: null
  },
  deliveryConfirmedAt: {
    type: Date,
    default: null
  },
  deliveryConfirmedBy: {
    type: String, // 'customer' or 'auto'
    default: null
  },
  alterationRequests: [{
    request: String,
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending'
    },
    response: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  suppressReservedKeysWarning: true
})

// ✅ FIXED Generate unique order ID
orderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    
    // ✅ Use this.constructor instead of mongoose.models.Order
    const count = await this.constructor.countDocuments({
      createdAt: {
        $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
      }
    })
    
    this.orderId = `DT${year}${month}${day}${String(count + 1).padStart(3, '0')}`
  }
  
  // Add to status history
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    })
  }
  
  next()
})

const Order = mongoose.model('Order', orderSchema)

// ===================================================================
// 3. MODULAR ORDER MODEL
// ===================================================================
const modularOrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true
  },
  customerInfo: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      default: ''
    }
  },
  shippingInfo: {
    fullName: {
      type: String,
      required: false,
      trim: true
    },
    email: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      required: false,
      trim: true
    },
    address: {
      street: {
        type: String,
        required: false,
        trim: true
      },
      city: {
        type: String,
        required: false,
        trim: true
      },
      state: {
        type: String,
        required: false,
        trim: true
      },
      zipCode: {
        type: String,
        required: false,
        trim: true
      }
    },
    specialInstructions: {
      type: String,
      trim: true,
      default: ''
    }
  },
  selections: [{
    categoryId: {
      type: String,
      required: true
    },
    categoryName: {
      type: String,
      required: true
    },
    designId: {
      type: String,
      required: true
    },
    designName: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    image: {
      type: String,
      required: true
    },
    description: {
      type: String
    }
  }],
  basePrice: {
    type: Number,
    required: true,
    default: 180
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['cash_on_delivery', 'razorpay', 'stripe'],
    default: 'cash_on_delivery'
  },
  payment: {
    method: {
      type: String,
      enum: ['razorpay', 'cod'],
      default: 'cod'
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    transactionDate: Date,
    failureReason: String
  },
  razorpayOrderId: String,
  estimatedDelivery: {
    type: Date,
    default: () => {
      const date = new Date()
      date.setDate(date.getDate() + 7) // 7 days from now
      return date
    }
  },
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'assigned', 'in_progress', 'completed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'placed'
  },
  assignedTailor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  allocationTimestamp: {
    type: Date,
    default: null
  },
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  deliveryToken: {
    type: String,
    default: null
  },
  deliveryConfirmedAt: {
    type: Date,
    default: null
  },
  deliveryConfirmedBy: {
    type: String,
    default: null
  },
  orderType: {
    type: String,
    default: 'modular'
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
})

// Generate order ID and track status changes
modularOrderSchema.pre('save', function(next) {
  if (!this.orderId) {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substr(2, 5)
    this.orderId = `MOD-${timestamp}-${random}`.toUpperCase()
  }
  
  // Add to status history
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    })
  }
  
  next()
})

// Also generate orderId before validation
modularOrderSchema.pre('validate', function(next) {
  if (!this.orderId) {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substr(2, 5)
    this.orderId = `MOD-${timestamp}-${random}`.toUpperCase()
  }
  next()
})

// Indexes
modularOrderSchema.index({ orderId: 1 })
modularOrderSchema.index({ status: 1, createdAt: -1 })
modularOrderSchema.index({ 'customerInfo.phone': 1 })

const ModularOrder = mongoose.model('ModularOrder', modularOrderSchema)

// ===================================================================
// 4. CATALOG MODEL
// ===================================================================
const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { _id: false })

const catalogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['blouse', 'kurti','Western dress', 'mens_shirt', 'mens_kurta', 'kids', 'bridal']
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  primaryImage: {
    type: String,
    required: true
  },
  additionalImages: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  estimatedDays: {
    type: Number,
    default: 7
  },
  materials: [{
    name: String,
    quantity: String
  }],
  measurements: [{
    name: String,
    description: String
  }],
  createdBy: {
    type: String,
    default: 'admin'
  },
  // New analytics and reviews
  views: { type: Number, default: 0, index: true },
  reviewsCount: { type: Number, default: 0, index: true },
  reviews: [reviewSchema]
}, {
  timestamps: true
})

const Catalog = mongoose.model('Catalog', catalogSchema)

// ===================================================================
// 5. DESIGN ELEMENT MODEL
// ===================================================================
const designElementSchema = new mongoose.Schema({
  categoryId: {
    type: String,
    required: true,
    trim: true
  },
  categoryName: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  garmentType: {
    type: String,
    required: true,
    enum: ['kurti', 'blouse'],
    trim: true,
    lowercase: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: String,
    default: 'system'
  },
  updatedBy: {
    type: String
  }
}, {
  timestamps: true
})

// Indexes for faster queries
designElementSchema.index({ categoryId: 1, garmentType: 1, isActive: 1, displayOrder: 1 })
designElementSchema.index({ garmentType: 1, isActive: 1 })
designElementSchema.index({ isActive: 1 })

const DesignElement = mongoose.model('DesignElement', designElementSchema)

// ===================================================================
// 6. GALLERY MODEL
// ===================================================================
const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Bridal', 'Office', 'Casual', 'Party', 'Traditional'],
    default: 'Casual'
  },
  style: {
    type: String,
    required: true
  },
  // ✅ Removed beforeImage field completely
  afterImage: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    trim: true
  },
  customerStory: {
    type: String,
    maxlength: 1000
  },
  satisfaction: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  designTime: {
    type: String,
    default: '7 days'
  },
  occasion: {
    type: String,
    trim: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

const Gallery = mongoose.model('Gallery', gallerySchema)

// ===================================================================
// 7. MEASUREMENT MODEL
// ===================================================================
const measurementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  measurementType: {
    type: String,
    required: true,
    enum: ['Blouse', 'Shirt', 'Pant', 'Saree Blouse', 'Lehenga', 'Suit', 'Dress', 'Kurta']
  },
  measurements: {
    // Common measurements
    bust: { type: Number }, // inches
    waist: { type: Number }, // inches
    hip: { type: Number }, // inches
    
    // Upper body measurements
    shoulderWidth: { type: Number },
    armLength: { type: Number },
    sleeveLength: { type: Number },
    armhole: { type: Number },
    frontLength: { type: Number },
    backLength: { type: Number },
    
    // Lower body measurements
    inseam: { type: Number },
    outseam: { type: Number },
    thigh: { type: Number },
    knee: { type: Number },
    calf: { type: Number },
    ankle: { type: Number },
    
    // Neck and collar
    neckCircumference: { type: Number },
    collarSize: { type: Number },
    
    // Additional measurements
    bicep: { type: Number },
    wrist: { type: Number },
    rise: { type: Number }
  },
  notes: {
    type: String,
    maxlength: 500,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

// Index for better performance
measurementSchema.index({ userId: 1, measurementType: 1 })

const Measurement = mongoose.model('Measurement', measurementSchema)

// ===================================================================
// 8. WISHLIST MODEL
// ===================================================================
const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    productId: {
      type: String, // Since your designs use string IDs
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true })

// Index for better performance
wishlistSchema.index({ userId: 1 })
wishlistSchema.index({ 'items.productId': 1 })

const Wishlist = mongoose.model('Wishlist', wishlistSchema)

// ===================================================================
// 9. REVIEW MODEL
// ===================================================================
const reviewSchemaMain = new mongoose.Schema({
  // User who wrote the review
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Order this review came from (for verification)
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  
  // Product being reviewed
  productId: {
    type: String, // Could be catalog item ID or custom design ID
    required: true
  },
  
  productName: {
    type: String,
    required: true
  },
  
  productType: {
    type: String,
    enum: ['catalog', 'custom_design', 'gallery'],
    required: true
  },
  
  productImage: {
    type: String, // Product main image URL
    required: false
  },
  
  // Review content
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  
  comment: {
    type: String,
    maxLength: 1000,
    trim: true
  },
  
  // Review images uploaded by customer
  images: [{
    url: String,
    filename: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Verification
  isVerifiedPurchase: {
    type: Boolean,
    default: true // Always true since reviews come from actual orders
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved' // Auto-approve for now, can add moderation later
  },
  
  // Helpful votes (for future enhancement)
  helpfulVotes: {
    type: Number,
    default: 0
  },
  
  // Admin response (optional)
  adminResponse: {
    message: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    respondedAt: Date
  }
}, {
  timestamps: true
})

// Indexes for efficient queries
reviewSchemaMain.index({ productId: 1, createdAt: -1 }) // Get reviews for a product
reviewSchemaMain.index({ userId: 1, createdAt: -1 }) // Get reviews by user
reviewSchemaMain.index({ orderId: 1, productId: 1 }, { unique: true }) // Prevent duplicate reviews for same product in same order

// Virtual for user details (populated)
reviewSchemaMain.virtual('userDetails', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
  select: 'firstName lastName profilePicture'
})

// Static method to get average rating for a product
reviewSchemaMain.statics.getProductRating = async function(productId) {
  const result = await this.aggregate([
    {
      $match: { 
        productId: productId,
        status: 'approved'
      }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    }
  ])
  
  if (result.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    }
  }
  
  const data = result[0]
  
  // Count rating distribution
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  data.ratingDistribution.forEach(rating => {
    distribution[rating]++
  })
  
  return {
    averageRating: Math.round(data.averageRating * 10) / 10, // Round to 1 decimal
    totalReviews: data.totalReviews,
    ratingDistribution: distribution
  }
}

// Instance method to check if review can be edited
reviewSchemaMain.methods.canBeEdited = function() {
  const daysSinceCreation = Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24))
  return daysSinceCreation <= 7 // Allow editing within 7 days
}

const Review = mongoose.model('Review', reviewSchemaMain)

// ===================================================================
// 10. CONTACT MODEL
// ===================================================================
const contactSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  serviceInterested: { type: String, default: '' },
  consultationType: { 
    type: String, 
    enum: ['online', 'in-person'], 
    default: 'online' 
  },
  preferredTime: { type: String, default: '' },
  message: { type: String, required: true },
  requestType: {
    type: String,
    enum: ['general_inquiry', 'book_consultation', 'live_chat', 'request_callback'],
    default: 'general_inquiry'
  },
  status: { 
    type: String, 
    enum: ['pending', 'contacted', 'in_progress', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  isRead: { type: Boolean, default: false },
  adminNotes: { type: String, default: '' }
}, {
  timestamps: true
})

const Contact = mongoose.model('Contact', contactSchema)

// ===================================================================
// 11. ADMIN MODEL
// ===================================================================
const adminSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true,
    select: false // Don't return password by default
  },
  fullName: {
    type: String,
    required: true
  },
  role: { 
    type: String, 
    default: 'admin',
    enum: ['admin', 'super_admin']
  },
  permissions: [{
    type: String,
    enum: ['users', 'orders', 'catalog', 'gallery', 'analytics', 'settings']
  }],
  isActive: { 
    type: Boolean, 
    default: true 
  },
  lastLogin: { 
    type: Date 
  },
  createdBy: {
    type: String,
    default: 'owner'
  },
  notes: {
    type: String // Owner can add notes about this admin
  }
}, {
  timestamps: true
})

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare password method
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Update last login
adminSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date()
  return this.save()
}

const Admin = mongoose.model('Admin', adminSchema)

// ===================================================================
// 12. OTP MODEL
// ===================================================================
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

const OTP = mongoose.model('OTP', otpSchema)

// ===================================================================
// 13. EXPENSE MODEL
// ===================================================================
const expenseSchema = new mongoose.Schema({
  expenseId: {
    type: String,
    unique: true
  },
  type: {
    type: String,
    enum: ['material', 'salary', 'utility', 'rent', 'maintenance', 'other'],
    required: true
  },
  category: {
    type: String,
    required: true,
    // For materials: 'lace', 'lining', 'thread', 'buttons', 'zipper', etc.
    // For utilities: 'electricity', 'water', 'internet', etc.
    // For other: custom category
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  unitPrice: {
    type: Number,
    default: 0
  },
  // For salary expenses
  tailorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  tailorName: {
    type: String,
    default: null
  },
  salaryMonth: {
    type: String, // Format: 'YYYY-MM'
    default: null
  },
  salaryType: {
    type: String,
    enum: ['monthly', 'weekly', 'daily', 'bonus', 'advance'],
    default: null
  },
  // Payment details
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank_transfer', 'upi', 'cheque', 'card'],
    default: 'cash'
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'pending', 'partial'],
    default: 'paid'
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  // Invoice/Receipt info
  invoiceNumber: {
    type: String,
    default: null
  },
  vendorName: {
    type: String,
    default: null
  },
  // Date information
  expenseDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  // Metadata
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  attachments: [{
    url: String,
    filename: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
})

// Generate unique expense ID
expenseSchema.pre('save', async function(next) {
  if (!this.expenseId) {
    const date = new Date(this.expenseDate || new Date())
    const year = date.getFullYear().toString().slice(-2)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    
    const count = await this.constructor.countDocuments({
      expenseDate: {
        $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
      }
    })
    
    this.expenseId = `EXP${year}${month}${day}${String(count + 1).padStart(3, '0')}`
  }
  
  next()
})

// Indexes for efficient querying
expenseSchema.index({ expenseDate: -1 })
expenseSchema.index({ type: 1, expenseDate: -1 })
expenseSchema.index({ tailorId: 1, salaryMonth: 1 })
expenseSchema.index({ addedBy: 1 })

const Expense = mongoose.model('Expense', expenseSchema)

// ===================================================================
// 14. INCOME ANALYTICS MODEL
// ===================================================================
const incomeAnalyticsSchema = new mongoose.Schema({
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'annual'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  // For weekly: start of week, for monthly: first day of month, for annual: Jan 1
  periodKey: {
    type: String,
    required: true,
    unique: true
    // Format: 'daily_YYYY-MM-DD', 'weekly_YYYY-WW', 'monthly_YYYY-MM', 'annual_YYYY'
  },
  // Income metrics
  totalIncome: {
    type: Number,
    default: 0
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  completedOrders: {
    type: Number,
    default: 0
  },
  cancelledOrders: {
    type: Number,
    default: 0
  },
  averageOrderValue: {
    type: Number,
    default: 0
  },
  // Order status breakdown
  ordersByStatus: {
    placed: { type: Number, default: 0 },
    confirmed: { type: Number, default: 0 },
    assigned: { type: Number, default: 0 },
    in_progress: { type: Number, default: 0 },
    completed: { type: Number, default: 0 },
    shipped: { type: Number, default: 0 },
    delivered: { type: Number, default: 0 },
    cancelled: { type: Number, default: 0 }
  },
  // Payment breakdown
  paymentMethods: {
    cod: { type: Number, default: 0 },
    razorpay: { type: Number, default: 0 }
  },
  // Category-wise income
  categoryIncome: [{
    category: String,
    amount: Number,
    orderCount: Number
  }],
  // Top products
  topProducts: [{
    productId: String,
    productName: String,
    orderCount: Number,
    totalRevenue: Number
  }],
  lastCalculated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Indexes
incomeAnalyticsSchema.index({ periodKey: 1 }, { unique: true })
incomeAnalyticsSchema.index({ period: 1, date: -1 })
incomeAnalyticsSchema.index({ date: -1 })

const IncomeAnalytics = mongoose.model('IncomeAnalytics', incomeAnalyticsSchema)

// ===================================================================
// 15. PRODUCT MODEL
// ===================================================================
const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  basePrice: { 
    type: Number, 
    required: true 
  },
  category: { 
    type: String, 
    required: true,
    enum: ['Blouse', 'Saree', 'Lehenga', 'Salwar', 'Gown', 'Kurti', 'Churidar']
  },
  difficulty: { 
    type: String, 
    enum: ['Easy', 'Medium', 'Hard', 'Beginner', 'Intermediate', 'Advanced'],
    default: 'Medium'
  },
  estimatedDays: { 
    type: Number, 
    default: 7 
  },
  primaryImage: { 
    type: String, 
    required: true 
  },
  images: [{ 
    type: String 
  }],
  tags: [{ 
    type: String 
  }],
  isActive: { 
    type: Boolean, 
    default: true 
  },
  isNew: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true
})

// ✅ Fix: Check if model exists before creating
const Product = mongoose.models.Product || mongoose.model('Product', productSchema)

// ===================================================================
// 16. DESIGN CATEGORY MODEL
// ===================================================================
const designCategorySchema = new mongoose.Schema({
  categoryName: { 
    type: String, 
    required: true, 
    maxlength: 50,
    enum: ['Blouse', 'Kurti', 'Western Dress', 'Kids', 'Bridal']
  },
  categoryDescription: { type: String },
  categoryImage: { type: String, maxlength: 255 },
  sortOrder: { type: Number, default: 0 },
  createdBy: { type: String, required: true },
  updatedBy: { type: String }
}, { 
  timestamps: true 
})

const DesignCategory = mongoose.model('DesignCategory', designCategorySchema)

// ===================================================================
// 17. RECENTLY VIEWED MODEL
// ===================================================================
const recentlyViewedItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Catalog', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  link: { type: String, required: true },
  viewedAt: { type: Date, default: Date.now },
}, { _id: false })

const recentlyViewedSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  items: { type: [recentlyViewedItemSchema], default: [] },
}, { timestamps: true })

recentlyViewedSchema.index({ user: 1 })

const RecentlyViewed = mongoose.models.RecentlyViewed || mongoose.model('RecentlyViewed', recentlyViewedSchema)

// ===================================================================
// 18. DESIGN STYLE MODEL
// ===================================================================
const designStyleSchema = new mongoose.Schema({
  styleName: { 
    type: String, 
    required: true, 
    maxlength: 50,
    enum: ['Traditional', 'Modern', 'Fusion', 'Bridal', 'Contemporary']
  },
  styleDescription: { type: String },
  sortOrder: { type: Number, default: 0 },
 
  createdBy: { type: String, required: true },
  updatedBy: { type: String }
}, { 
  timestamps: true 
})

const DesignStyle = mongoose.model('DesignStyle', designStyleSchema)

// ===================================================================
// 19. TAILOR MODEL
// ===================================================================
const tailorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  specialties: [{ 
    type: String, 
    enum: ['Blouse', 'Saree', 'Lehenga', 'Salwar', 'Gown', 'Kurti', 'Churidar']
  }],
  experience: { type: Number, default: 0 }, // years
  rating: { type: Number, default: 5, min: 1, max: 5 },
  isActive: { type: Boolean, default: true },
  userType: { type: String, default: 'T' }, // T for Tailor
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Link to user account
}, {
  timestamps: true
})

const Tailor = mongoose.model('Tailor', tailorSchema)

// ===================================================================
// EXPORT ALL MODELS
// ===================================================================
export {
  User,
  Order,
  ModularOrder,
  Catalog,
  DesignElement,
  Gallery,
  Measurement,
  Wishlist,
  Review,
  Contact,
  Admin,
  OTP,
  Expense,
  IncomeAnalytics,
  Product,
  DesignCategory,
  RecentlyViewed,
  DesignStyle,
  Tailor
}

// ===================================================================
// END OF DIGITAILOR MODELS COLLECTION
// ===================================================================