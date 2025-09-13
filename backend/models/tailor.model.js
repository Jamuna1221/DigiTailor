import mongoose from 'mongoose'

const tailorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  specialties: [{ 
    type: String, 
    enum: ['Blouse', 'Saree', 'Lehenga', 'Salwar', 'Gown', 'Kurti', 'Churidar']
  }],
  experience: { type: Number, default: 0 }, // years
  rating: { type: Number, default: 5, min: 1, max: 5 },
  isActive: { type: Boolean, default: true },
  userType: { type: String, default: 'T' }, // T for Tailor
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Link to user account
}, {
  timestamps: true
})

export default mongoose.model('Tailor', tailorSchema)
