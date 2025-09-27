import mongoose from 'mongoose'

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

export default mongoose.model('Catalog', catalogSchema)
