import mongoose from 'mongoose'

const designStyleSchema = new mongoose.Schema({
  styleName: { 
    type: String, 
    required: true, 
    maxlength: 50,
    enum: ['Traditional', 'Modern', 'Fusion', 'Bridal', 'Contemporary']
  },
  styleDescription: { type: String },
  sortOrder: { type: Number, default: 0 },
 
  createdBy: { type: String, required: true },
  updatedBy: { type: String }
}, { 
  timestamps: true 
})

export default mongoose.model('DesignStyle', designStyleSchema)
