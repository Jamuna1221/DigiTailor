import mongoose from 'mongoose'

const designCategorySchema = new mongoose.Schema({
  categoryName: { 
    type: String, 
    required: true, 
    maxlength: 50,
    enum: ['Blouse', 'Kurti', 'Western Dress', 'Kids', 'Bridal']
  },
  categoryDescription: { type: String },
  categoryImage: { type: String, maxlength: 255 },
  sortOrder: { type: Number, default: 0 },
  createdBy: { type: String, required: true },
  updatedBy: { type: String }
}, { 
  timestamps: true 
})

export default mongoose.model('DesignCategory', designCategorySchema)
