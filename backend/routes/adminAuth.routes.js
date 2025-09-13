import express from 'express'
import {
  adminLogin,
  getCurrentAdmin,
  adminLogout
} from '../controllers/adminAuth.controller.js'
import { protect, adminOnly } from '../middlewares/auth.middleware.js'

const router = express.Router()

// Public admin routes
router.post('/login', adminLogin)

// Protected admin routes
router.get('/me', protect, adminOnly, getCurrentAdmin)
router.post('/logout', protect, adminOnly, adminLogout)

export default router
