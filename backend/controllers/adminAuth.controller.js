import jwt from 'jsonwebtoken'
import Admin from '../models/admin.model.js'

// Generate JWT Token for Admin
const generateAdminToken = (adminId) => {
  return jwt.sign(
    { 
      id: adminId, 
      type: 'admin' // Important: distinguish from regular users
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  )
}

// Admin Login (No signup allowed)
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body

    console.log('🔍 Admin login attempt for:', username)

    // Check if username and password provided
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password'
      })
    }

    // Find admin by username or email (include password field)
    const admin = await Admin.findOne({
      $or: [
        { username: username.toLowerCase() },
        { email: username.toLowerCase() }
      ]
    }).select('+password')

    if (!admin) {
      console.log('❌ Admin not found:', username)
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      })
    }

    // Check if admin is active
    if (!admin.isActive) {
      console.log('❌ Admin account deactivated:', username)
      return res.status(401).json({
        success: false,
        message: 'Admin account has been deactivated'
      })
    }

    // Check password
    const isPasswordMatch = await admin.comparePassword(password)
    
    if (!isPasswordMatch) {
      console.log('❌ Invalid password for admin:', username)
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      })
    }

    // Update last login
    await admin.updateLastLogin()

    // Generate token
    const token = generateAdminToken(admin._id)

    // Remove password from response
    admin.password = undefined

    console.log('✅ Admin login successful:', username)

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      data: {
        admin,
        token
      }
    })

  } catch (error) {
    console.error('💥 Admin login error:', error)
    res.status(500).json({
      success: false,
      message: 'Admin login failed',
      error: error.message
    })
  }
}

// Get Current Admin Info
export const getCurrentAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id)
    
    res.status(200).json({
      success: true,
      data: admin
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get admin data',
      error: error.message
    })
  }
}

// Admin Logout
export const adminLogout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin logged out successfully'
  })
}
