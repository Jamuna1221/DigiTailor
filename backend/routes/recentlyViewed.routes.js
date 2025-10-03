import express from 'express'
import { getRecentlyViewed, addRecentlyViewed } from '../controllers/recentlyViewed.controller.js'
import { optionalAuth, protect } from '../middlewares/auth.middleware.js'

const router = express.Router()

// GET returns server-stored list for logged-in users; guests receive [] and should fallback to localStorage
router.get('/', optionalAuth, getRecentlyViewed)

// POST requires auth; stores view in DB for the logged-in user
router.post('/', protect, addRecentlyViewed)

export default router