import mongoose from 'mongoose'

const recentlyViewedItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Catalog', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  link: { type: String, required: true },
  viewedAt: { type: Date, default: Date.now },
}, { _id: false })

const recentlyViewedSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  items: { type: [recentlyViewedItemSchema], default: [] },
}, { timestamps: true })

recentlyViewedSchema.index({ user: 1 })

const RecentlyViewed = mongoose.models.RecentlyViewed || mongoose.model('RecentlyViewed', recentlyViewedSchema)
export default RecentlyViewed