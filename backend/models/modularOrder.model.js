import mongoose from 'mongoose'

const modularOrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
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
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-production', 'ready', 'delivered', 'cancelled'],
    default: 'pending'
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

// Generate order ID
modularOrderSchema.pre('save', function(next) {
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

export default mongoose.model('ModularOrder', modularOrderSchema)
