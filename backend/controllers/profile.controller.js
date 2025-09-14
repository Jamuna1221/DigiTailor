import User from '../models/user.model.js'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads', 'profiles')
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const uniqueName = `profile-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error('Only image files are allowed'))
  }
}

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
})

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    console.log('👤 Getting profile for user:', req.user.id)

    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const userProfile = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      loyaltyPoints: user.loyaltyPoints,
      profileImage: user.profileImage,
      isActive: user.isActive,
      createdAt: user.createdAt
    }

    res.status(200).json({
      success: true,
      message: 'Profile fetched successfully',
      data: userProfile
    })

  } catch (error) {
    console.error('💥 Get profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    })
  }
}

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    console.log('📝 Updating profile for user:', req.user.id)
    console.log('📝 Update data:', req.body)

    const { firstName, lastName, phone } = req.body

    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Update fields if provided
    if (firstName) user.firstName = firstName
    if (lastName) user.lastName = lastName
    if (phone) user.phone = phone

    await user.save()

    console.log('✅ Profile updated successfully')

    const updatedProfile = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      loyaltyPoints: user.loyaltyPoints,
      profileImage: user.profileImage
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile
    })

  } catch (error) {
    console.error('💥 Update profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    })
  }
}

// Upload profile picture
export const uploadProfilePicture = async (req, res) => {
  try {
    console.log('📸 Uploading profile picture for user:', req.user.id)

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      })
    }

    console.log('📸 File details:', req.file)

    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Delete old profile image if exists
    if (user.profileImage) {
      const oldImagePath = path.join(__dirname, '..', user.profileImage.replace('/uploads/', 'uploads/'))
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath)
        console.log('🗑️ Old profile image deleted')
      }
    }

    // Update user with new image path
    const imagePath = `/uploads/profiles/${req.file.filename}`
    user.profileImage = imagePath

    await user.save()

    console.log('✅ Profile picture updated successfully')

    res.status(200).json({
      success: true,
      message: 'Profile picture updated successfully',
      data: {
        profileImage: imagePath
      }
    })

  } catch (error) {
    console.error('💥 Upload profile picture error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile picture',
      error: error.message
    })
  }
}

// Delete profile picture
export const deleteProfilePicture = async (req, res) => {
  try {
    console.log('🗑️ Deleting profile picture for user:', req.user.id)

    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Delete image file if exists
    if (user.profileImage) {
      const imagePath = path.join(__dirname, '..', user.profileImage.replace('/uploads/', 'uploads/'))
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
        console.log('🗑️ Profile image file deleted')
      }
    }

    // Remove image path from user
    user.profileImage = null
    await user.save()

    console.log('✅ Profile picture deleted successfully')

    res.status(200).json({
      success: true,
      message: 'Profile picture deleted successfully'
    })

  } catch (error) {
    console.error('💥 Delete profile picture error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete profile picture',
      error: error.message
    })
  }
}
