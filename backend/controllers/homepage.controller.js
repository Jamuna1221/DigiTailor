import Catalog from '../models/catalog.model.js'

// Get featured designs for homepage
export const getFeaturedDesigns = async (req, res) => {
  try {
    console.log('📡 Fetching featured designs for homepage...')
    
    // Get 6 featured and active designs
    const featuredDesigns = await Catalog.find({ 
      isFeatured: true, 
      isActive: true 
    })
    .select('name description category basePrice primaryImage tags estimatedDays')
    .sort({ createdAt: -1 })
    .limit(6)

    // If no featured designs, get latest 6 designs
    if (featuredDesigns.length === 0) {
      console.log('📍 No featured designs found, fetching latest designs...')
      
      const latestDesigns = await Catalog.find({ isActive: true })
        .select('name description category basePrice primaryImage tags estimatedDays')
        .sort({ createdAt: -1 })
        .limit(6)
      
      return res.status(200).json({
        success: true,
        message: 'Latest designs fetched successfully',
        data: latestDesigns,
        count: latestDesigns.length
      })
    }

    console.log(`✅ Found ${featuredDesigns.length} featured designs`)

    res.status(200).json({
      success: true,
      message: 'Featured designs fetched successfully',
      data: featuredDesigns,
      count: featuredDesigns.length
    })

  } catch (error) {
    console.error('❌ Error fetching featured designs:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured designs',
      error: error.message
    })
  }
}

// Get homepage statistics
export const getHomepageStats = async (req, res) => {
  try {
    console.log('📊 Fetching homepage statistics...')

    // You can get these from your database
    const stats = {
      happyCustomers: 10000,
      designsCreated: 50000,
      satisfactionRate: 99.9,
      aiAssistance: '24/7'
    }

    // If you want real stats from database:
    // const totalOrders = await Order.countDocuments({ orderStatus: 'delivered' })
    // const totalDesigns = await Catalog.countDocuments({ isActive: true })
    // const avgRating = await Review.aggregate([{ $group: { _id: null, avgRating: { $avg: '$rating' } } }])

    res.status(200).json({
      success: true,
      message: 'Homepage stats fetched successfully',
      data: stats
    })

  } catch (error) {
    console.error('❌ Error fetching homepage stats:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch homepage stats',
      error: error.message
    })
  }
}

// Get testimonials for homepage
export const getTestimonials = async (req, res) => {
  try {
    console.log('💬 Fetching testimonials...')

    // Mock testimonials (you can create a Testimonial model later)
    const testimonials = [
      {
        id: 1,
        name: 'Priya Sharma',
        role: 'Fashion Designer',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100',
        content: 'The AI understood my style perfectly! The designs were exactly what I envisioned, and the quality is outstanding.',
        rating: 5
      },
      {
        id: 2,
        name: 'Raj Patel',
        role: 'Business Owner',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        content: 'Incredible technology! I got a perfectly fitted suit in just 5 days. The AI suggestions were spot on.',
        rating: 5
      },
      {
        id: 3,
        name: 'Anita Singh',
        role: 'Teacher',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
        content: 'Amazing experience! The AI created beautiful ethnic wear designs that I absolutely love. Highly recommended!',
        rating: 5
      }
    ]

    res.status(200).json({
      success: true,
      message: 'Testimonials fetched successfully',
      data: testimonials,
      count: testimonials.length
    })

  } catch (error) {
    console.error('❌ Error fetching testimonials:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonials',
      error: error.message
    })
  }
}
