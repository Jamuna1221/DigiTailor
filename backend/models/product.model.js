import mongoose from 'mongoose'

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
export default Product
