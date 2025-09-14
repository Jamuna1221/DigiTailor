import mongoose from 'mongoose'

const measurementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  measurementType: {
    type: String,
    required: true,
    enum: ['Blouse', 'Shirt', 'Pant', 'Saree Blouse', 'Lehenga', 'Suit', 'Dress', 'Kurta']
  },
  measurements: {
    // Common measurements
    bust: { type: Number }, // inches
    waist: { type: Number }, // inches
    hip: { type: Number }, // inches
    
    // Upper body measurements
    shoulderWidth: { type: Number },
    armLength: { type: Number },
    sleeveLength: { type: Number },
    armhole: { type: Number },
    frontLength: { type: Number },
    backLength: { type: Number },
    
    // Lower body measurements
    inseam: { type: Number },
    outseam: { type: Number },
    thigh: { type: Number },
    knee: { type: Number },
    calf: { type: Number },
    ankle: { type: Number },
    
    // Neck and collar
    neckCircumference: { type: Number },
    collarSize: { type: Number },
    
    // Additional measurements
    bicep: { type: Number },
    wrist: { type: Number },
    rise: { type: Number }
  },
  notes: {
    type: String,
    maxlength: 500
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

// Index for better performance
measurementSchema.index({ userId: 1, measurementType: 1 })

export default mongoose.model('Measurement', measurementSchema)
