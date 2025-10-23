import mongoose from 'mongoose'

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

export default mongoose.model('DesignElement', designElementSchema)
