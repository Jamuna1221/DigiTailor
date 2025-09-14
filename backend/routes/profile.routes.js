import express from 'express'
import { 
  getUserProfile, 
  updateUserProfile, 
  uploadProfilePicture, 
  deleteProfilePicture,
  upload 
} from '../controllers/profile.controller.js'

const router = express.Router()

// Note: auth middleware is applied in server.js, so these routes are already protected

// Get user profile
router.get('/', getUserProfile)

// Update user profile
router.put('/', updateUserProfile)

// Upload profile picture
router.post('/picture', upload.single('profileImage'), uploadProfilePicture)

// Delete profile picture
router.delete('/picture', deleteProfilePicture)

export default router
