import mongoose from 'mongoose'

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

export default mongoose.model('Expense', expenseSchema)
