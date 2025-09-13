import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  serviceInterested: { type: String, default: '' },
  consultationType: { 
    type: String, 
    enum: ['online', 'in-person'], 
    default: 'online' 
  },
  preferredTime: { type: String, default: '' },
  message: { type: String, required: true },
  requestType: {
    type: String,
    enum: ['general_inquiry', 'book_consultation', 'live_chat', 'request_callback'],
    default: 'general_inquiry'
  },
  status: { 
    type: String, 
    enum: ['pending', 'contacted', 'in_progress', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  isRead: { type: Boolean, default: false },
  adminNotes: { type: String, default: '' }
}, {
  timestamps: true
})

export default mongoose.model('Contact', contactSchema)
