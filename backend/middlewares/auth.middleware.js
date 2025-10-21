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
    console.log('🔑 Token decoded:', { id: decoded.id, type: decoded.type || 'user' })

    // Get user from database (admin users are also stored in User model)
    const user = await User.findById(decoded.id)

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, user not found or inactive'
      })
    }

    // Set request properties
    req.user = user
    
    // Determine user type based on role or token type
    if (user.role === 'admin' || decoded.type === 'admin') {
      req.admin = user // ✅ Set admin reference for compatibility
      req.userType = 'admin'
      console.log('👑 Admin authenticated:', user.email, 'Role:', user.role)
    } else {
      req.userType = 'user'
      console.log('👤 User authenticated:', user.email, 'Role:', user.role)
    }

    next()

  } catch (error) {
    console.error('💥 Auth middleware error:', error)
    
    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, invalid token'
      })
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token expired'
      })
    }
    
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
  if (req.userType === 'admin' && req.admin?.role === 'super_admin') {
    next()
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Super Admin privileges required.'
    })
  }
}

// Role-based access control
export const authorize = (...roles) => {
  return (req, res, next) => {
    let userRole = null
    
    if (req.userType === 'admin' && req.admin) {
      userRole = req.admin.role || 'admin'
    } else if (req.user) {
      userRole = req.user.role || 'customer'
    }

    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${roles.join(', ')}`
      })
    }

    next()
  }
}

// Optional auth - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
  try {
    let token

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      // No token provided, continue without authentication
      req.user = null
      req.userType = null
      return next()
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Get user from database (admin users are also stored in User model)
    const user = await User.findById(decoded.id)
    if (user && user.isActive) {
      req.user = user
      
      // Determine user type based on role or token type
      if (user.role === 'admin' || decoded.type === 'admin') {
        req.admin = user
        req.userType = 'admin'
      } else {
        req.userType = 'user'
      }
    }

    next()

  } catch (error) {
    console.warn('Optional auth failed:', error.message)
    // Continue without authentication
    req.user = null
    req.userType = null
    next()
  }
}
