import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import Admin from '../models/admin.model.js'

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  try {
    let token

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided'
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Determine if it's admin or user token
    if (decoded.type === 'admin') {
      // Get admin from database
      const admin = await Admin.findById(decoded.id)
      
      if (!admin || !admin.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, admin not found or inactive'
        })
      }

      req.admin = admin
      req.userType = 'admin'
    } else {
      // Get regular user from database
      const user = await User.findById(decoded.id)

      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, user not found or inactive'
        })
      }

      req.user = user
      req.userType = 'user'
    }

    next()

  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(401).json({
      success: false,
      message: 'Not authorized, token invalid'
    })
  }
}

// Admin only access
export const adminOnly = (req, res, next) => {
  if (req.userType === 'admin') {
    next()
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    })
  }
}

// Super Admin only access
export const superAdminOnly = (req, res, next) => {
  if (req.userType === 'admin' && req.admin.role === 'super_admin') {
    next()
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Super Admin privileges required.'
    })
  }
}
