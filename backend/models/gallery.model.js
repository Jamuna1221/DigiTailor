import mongoose from 'mongoose'

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

export default mongoose.model('Gallery', gallerySchema)
