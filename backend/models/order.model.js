import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  image: { type: String },
  category: { type: String, required: true }, // Important for tailor allocation
  customization: {
    size: { type: String },
    color: { type: String },
    fabric: { type: String },
    measurements: {
      bust: Number,
      waist: Number,
      hips: Number,
      length: Number
    },
    specialInstructions: { type: String }
  }
})

const orderSchema = new mongoose.Schema({
  orderNumber: { 
    type: String, 
    unique: true, 
    default: () => 'DT' + Date.now() + Math.floor(Math.random() * 1000)
  },
  
  // Customer Information
  customer: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true }
    }
  },

  // Order Items
  items: [orderItemSchema],

  // **TAILOR ALLOCATION** - Hidden from customer
  assignedTailor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tailor' 
  },
  allocationTimestamp: { type: Date },
  tailorNotes: { type: String }, // Only tailor can see/edit

  // Pricing
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  deliveryCharges: { type: Number, default: 50 },
  total: { type: Number, required: true },

  // Order Status
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in_progress', 'quality_check', 'ready', 'delivered', 'cancelled'],
    default: 'pending'
  },

  // Payment
  paymentMethod: {
    type: String,
    enum: ['cash_on_delivery', 'online_payment', 'bank_transfer'],
    default: 'cash_on_delivery'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },

  // Timeline
  estimatedDelivery: { type: Date },
  actualDelivery: { type: Date },

  // Notes
  customerNotes: { type: String },
  adminNotes: { type: String }
}, {
  timestamps: true
})

export default mongoose.model('Order', orderSchema)
