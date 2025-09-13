import express from 'express'
import {
  register,
  login,
  getMe,
  logout,
  sendOtp,
  verifyOtp,
  resendOtp,
  googleAuth,
  facebookAuth
} from '../controllers/auth.controller.js'
import { protect } from '../middlewares/auth.middleware.js'

const router = express.Router()

// Public routes
router.post('/register', register) // Keep for backward compatibility
router.post('/login', login)
router.post('/logout', logout)

// OTP routes
router.post('/send-otp', sendOtp)
router.post('/verify-otp', verifyOtp)
router.post('/resend-otp', resendOtp)

// OAuth routes - Fixed URLs with proper encoding
router.get('/google', (req, res) => {
  try {
    console.log('🔍 Google OAuth initiated')
    const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.GOOGLE_REDIRECT_URI)}&scope=profile email&response_type=code`
    console.log('🔗 Google Auth URL:', googleAuthURL)
    res.redirect(googleAuthURL)
  } catch (error) {
    console.error('❌ Google OAuth initiation error:', error)
    res.status(500).json({ success: false, message: 'OAuth initiation failed' })
  }
})

router.get('/google/callback', googleAuth)
// Add these imports to your existing auth.routes.js
import { forgotPassword, resetPassword, verifyResetToken } from '../controllers/auth.controller.js'

// Add these routes
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.get('/verify-reset-token/:token', verifyResetToken)

router.get('/facebook', (req, res) => {
  try {
    console.log('🔍 Facebook OAuth initiated')
    // Remove 'email' from scope temporarily 
    const facebookAuthURL = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(process.env.FACEBOOK_REDIRECT_URI)}&scope=public_profile&response_type=code`
    console.log('🔗 Facebook Auth URL:', facebookAuthURL)
    res.redirect(facebookAuthURL)
  } catch (error) {
    console.error('❌ Facebook OAuth error:', error)
    res.status(500).json({ success: false, message: 'OAuth initiation failed' })
  }
})


router.get('/facebook/callback', facebookAuth)

// Test routes for debugging
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Auth routes working!', 
    timestamp: new Date(),
    env: {
      googleClientId: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing',
      facebookAppId: process.env.FACEBOOK_APP_ID ? 'Set' : 'Missing',
      frontendUrl: process.env.FRONTEND_URL || 'Not set'
    }
  })
})

// Protected routes
router.get('/me', protect, getMe)

export default router
