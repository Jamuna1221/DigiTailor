import mongoose from 'mongoose'

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
    enum: ['blouse', 'kurti', 'dress', 'mens_shirt', 'mens_kurta', 'kids', 'bridal']
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
  }
}, {
  timestamps: true
})

export default mongoose.model('Catalog', catalogSchema)
