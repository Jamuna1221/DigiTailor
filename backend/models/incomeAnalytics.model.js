import mongoose from 'mongoose'

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

export default mongoose.model('IncomeAnalytics', incomeAnalyticsSchema)
