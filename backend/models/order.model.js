import mongoose from 'mongoose'

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
  // ✅ ADDED: Review and alteration fields INSIDE the schema
  review: {
    rating: Number,
    comment: String,
    createdAt: Date
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

export default mongoose.model('Order', orderSchema)
