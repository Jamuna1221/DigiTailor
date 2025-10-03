import RecentlyViewed from '../models/recentlyViewed.model.js'
import Catalog from '../models/catalog.model.js'

const MAX_ITEMS = 10

export const getRecentlyViewed = async (req, res) => {
  try {
    if (!req.user) {
      // Guest mode → frontend will fallback to localStorage
      return res.status(200).json({ success: true, data: [] })
    }

    const doc = await RecentlyViewed.findOne({ user: req.user._id }).lean()
    return res.status(200).json({ success: true, data: doc?.items?.slice(0, MAX_ITEMS) || [] })
  } catch (error) {
    console.error('Error fetching recently viewed:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch recently viewed', error: error.message })
  }
}

export const addRecentlyViewed = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const { productId } = req.body
    if (!productId) {
      return res.status(400).json({ success: false, message: 'productId is required' })
    }

    // Fetch snapshot from catalog (name, price, image)
    const c = await Catalog.findById(productId).select('name basePrice primaryImage').lean()
    if (!c) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    const snapshot = {
      productId: c._id,
      name: c.name,
      price: c.basePrice || 0,
      image: c.primaryImage,
      link: `/product/${c._id}`,
      viewedAt: new Date(),
    }

    let doc = await RecentlyViewed.findOne({ user: req.user._id })
    if (!doc) {
      doc = new RecentlyViewed({ user: req.user._id, items: [] })
    }

    // Remove duplicates
    doc.items = (doc.items || []).filter((i) => String(i.productId) !== String(productId))
    // Add to front
    doc.items.unshift(snapshot)
    // Cap to MAX_ITEMS
    if (doc.items.length > MAX_ITEMS) doc.items = doc.items.slice(0, MAX_ITEMS)

    await doc.save()

    res.status(201).json({ success: true, message: 'Added to recently viewed', data: doc.items })
  } catch (error) {
    console.error('Error adding to recently viewed:', error)
    res.status(500).json({ success: false, message: 'Failed to add to recently viewed', error: error.message })
  }
}