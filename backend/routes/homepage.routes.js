import express from 'express'
import {
  getFeaturedDesigns,
  getHomepageStats,
  getTestimonials
} from '../controllers/homepage.controller.js'

const router = express.Router()

// GET /api/homepage/featured-designs
router.get('/featured-designs', getFeaturedDesigns)

// GET /api/homepage/stats
router.get('/stats', getHomepageStats)

// GET /api/homepage/testimonials
router.get('/testimonials', getTestimonials)

export default router
