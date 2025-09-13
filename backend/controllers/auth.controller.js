import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import User from '../models/user.model.js'
import OTP from '../models/otp.model.js'
import { sendOTPEmail, verifyEmailConnection, sendPasswordResetEmail } from '../services/email.service.js'

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  })
}

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send OTP for registration
export const sendOtp = async (req, res) => {
  try {
    console.log('📧 OTP send request started')
    console.log('📨 Request body:', req.body)
    
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      phone, 
      role = 'customer',
      specializations = [] 
    } = req.body

    // Validation
    if (!firstName || !lastName || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      console.log('❌ User already exists:', email)
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      })
    }

    // Verify email connection first
    const isConnected = await verifyEmailConnection()
    if (!isConnected) {
      return res.status(500).json({
        success: false,
        message: 'Email service is currently unavailable. Please try again later.'
      })
    }

    // Generate OTP
    const otp = generateOTP()
    console.log('🔑 Generated OTP:', otp)

    // Store user data and OTP temporarily
    await OTP.findOneAndDelete({ email: email.toLowerCase() }) // Remove existing OTP
    
    const otpData = new OTP({
      email: email.toLowerCase(),
      otp,
      userData: {
        firstName,
        lastName,
        email: email.toLowerCase(),
        password,
        phone,
        role,
        specializations: role === 'tailor' ? specializations : []
      }
    })

    await otpData.save()
    console.log('💾 OTP data saved successfully')

    // Send OTP email
    try {
      await sendOTPEmail(email, otp, firstName)
      console.log('📧 OTP email sent successfully to:', email)
      
      res.status(200).json({
        success: true,
        message: 'OTP sent to your email successfully. Please check your inbox and spam folder.'
      })
      
    } catch (emailError) {
      console.error('📧 Email sending failed:', emailError)
      
      // Clean up OTP data if email fails
      await OTP.findByIdAndDelete(otpData._id)
      
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please check your email address and try again.',
        error: emailError.message
      })
    }

  } catch (error) {
    console.error('💥 Send OTP error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
      error: error.message
    })
  }
}

// Verify OTP and create user
export const verifyOtp = async (req, res) => {
  try {
    console.log('🔍 OTP verification started')
    console.log('📨 Request body:', req.body)
    
    const { email, otp } = req.body

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      })
    }

    // Find OTP data
    const otpData = await OTP.findOne({ 
      email: email.toLowerCase(), 
      otp: otp.toString() 
    })

    if (!otpData) {
      console.log('❌ Invalid or expired OTP for email:', email)
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP. Please request a new one.'
      })
    }

    // Check if OTP is expired (5 minutes)
    const now = new Date()
    const otpAge = (now - otpData.createdAt) / (1000 * 60) // minutes
    if (otpAge > 5) {
      console.log('❌ OTP expired. Age:', otpAge, 'minutes')
      await OTP.findByIdAndDelete(otpData._id)
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      })
    }

    console.log('✅ OTP verified successfully')

    // Create user with stored data (password will be hashed by pre-save middleware)
    const userData = otpData.userData
    const user = new User({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password, // Will be hashed by pre-save middleware
      phone: userData.phone,
      role: userData.role,
      specializations: userData.specializations || [],
      isActive: true,
      loyaltyPoints: 0,
      createdBy: 'otp-registration'
    })

    await user.save()
    console.log('✅ User created successfully:', user._id)

    // Delete OTP data after successful registration
    await OTP.findByIdAndDelete(otpData._id)

    // Generate token
    const token = generateToken(user._id)

    // Create clean user response object
    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      specializations: user.specializations,
      isActive: user.isActive,
      loyaltyPoints: user.loyaltyPoints
    }

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      data: {
        user: userResponse,
        token
      }
    })

  } catch (error) {
    console.error('💥 OTP verification error:', error)
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      })
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      })
    }

    res.status(500).json({
      success: false,
      message: 'OTP verification failed',
      error: error.message
    })
  }
}

// Resend OTP
export const resendOtp = async (req, res) => {
  try {
    console.log('🔄 Resend OTP request')
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      })
    }

    // Find existing OTP data
    const existingOtpData = await OTP.findOne({ email: email.toLowerCase() })
    
    if (!existingOtpData) {
      return res.status(404).json({
        success: false,
        message: 'No registration request found for this email. Please start registration again.'
      })
    }

    // Generate new OTP
    const newOtp = generateOTP()
    console.log('🔑 Generated new OTP:', newOtp)

    // Update OTP and timestamp
    existingOtpData.otp = newOtp
    existingOtpData.createdAt = new Date()
    await existingOtpData.save()

    // Send new OTP email
    try {
      await sendOTPEmail(email, newOtp, existingOtpData.userData.firstName)
      console.log('📧 New OTP email sent successfully')
      
      res.status(200).json({
        success: true,
        message: 'New OTP sent to your email successfully'
      })
      
    } catch (emailError) {
      console.error('📧 Email sending failed:', emailError)
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      })
    }

  } catch (error) {
    console.error('💥 Resend OTP error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP',
      error: error.message
    })
  }
}

// Register User (Keep for backward compatibility)
export const register = async (req, res) => {
  try {
    console.log('📝 Direct registration attempt')
    console.log('📨 Request body:', req.body)
    
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      phone, 
      role = 'customer',
      specializations = [] 
    } = req.body

    // Validation
    if (!firstName || !lastName || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      console.log('❌ User already exists:', email)
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      })
    }

    console.log('🆕 Creating new user...')
    
    // Create new user (password will be hashed by pre-save middleware)
    const user = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password, // Will be hashed by pre-save middleware
      phone,
      role,
      specializations: role === 'tailor' ? specializations : [],
      isActive: true,
      loyaltyPoints: 0,
      createdBy: 'direct-registration'
    })

    await user.save()
    console.log('✅ User saved successfully:', user._id)

    // Generate token
    const token = generateToken(user._id)

    // Create clean user response
    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      specializations: user.specializations,
      isActive: user.isActive,
      loyaltyPoints: user.loyaltyPoints
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token
      }
    })

  } catch (error) {
    console.error('💥 Registration error:', error)
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      })
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    })
  }
}

// Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    
    console.log('🔍 Login attempt for email:', email)

    if (!email || !password) {
      console.log('❌ Missing email or password')
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      })
    }

    // Find user and include password field
    console.log('👀 Looking for user in database...')
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    
    if (!user) {
      console.log('❌ User not found in database')
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    console.log('👤 User found:', user.email)
    console.log('🏃‍♂️ User is active:', user.isActive)

    // Check if user is active
    if (!user.isActive) {
      console.log('❌ User account is deactivated')
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated'
      })
    }

    // Check password using the user's comparePassword method
    console.log('🔄 Comparing passwords using user method...')
    const isPasswordMatch = await user.comparePassword(password)
    console.log('✅ Password comparison result:', isPasswordMatch)
    
    if (!isPasswordMatch) {
      console.log('❌ Password does not match')
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    console.log('🎉 Login successful!')

    // Update last login if method exists
    try {
      if (typeof user.updateLastLogin === 'function') {
        await user.updateLastLogin()
      }
    } catch (updateError) {
      console.log('⚠️ Failed to update last login:', updateError.message)
      // Don't fail login if this fails
    }

    // Generate token
    const token = generateToken(user._id)

    // Create clean user response
    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      specializations: user.specializations,
      isActive: user.isActive,
      loyaltyPoints: user.loyaltyPoints
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { 
        user: userResponse, 
        token 
      }
    })

  } catch (error) {
    console.error('💥 Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    })
  }
}

// Forgot Password - Send reset email
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    console.log('🔒 Forgot password request for:', email)

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      })
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      // Don't reveal if email exists or not for security
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    
    // Save reset token and expiration to user
    user.passwordResetToken = resetToken
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    await user.save({ validateBeforeSave: false })

    // Create reset URL
    const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`

    // Send reset email
    try {
      await sendPasswordResetEmail(user.email, user.firstName, resetURL, resetToken)
      
      console.log('✅ Password reset email sent to:', email)
      
      res.status(200).json({
        success: true,
        message: 'Password reset link sent to your email. Please check your inbox and spam folder.'
      })

    } catch (emailError) {
      // Clear reset token if email fails
      user.passwordResetToken = undefined
      user.passwordResetExpires = undefined
      await user.save({ validateBeforeSave: false })

      console.error('❌ Failed to send reset email:', emailError)
      
      return res.status(500).json({
        success: false,
        message: 'Failed to send password reset email. Please try again later.'
      })
    }

  } catch (error) {
    console.error('💥 Forgot password error:', error)
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.'
    })
  }
}

// Reset Password - Update password with token
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body
    console.log('🔄 Password reset attempt with token')

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token, new password, and confirm password are required'
      })
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      })
    }

    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token'
      })
    }

    // Update password (will be hashed by pre-save middleware)
    user.password = newPassword
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    
    await user.save()

    console.log('✅ Password reset successful for user:', user.email)

    // Generate new login token
    const loginToken = generateToken(user._id)

    res.status(200).json({
      success: true,
      message: 'Password reset successful! You are now logged in.',
      data: {
        token: loginToken,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        }
      }
    })

  } catch (error) {
    console.error('💥 Reset password error:', error)
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.'
    })
  }
}

// Verify Reset Token - Check if token is valid
export const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Token is valid',
      data: {
        email: user.email,
        firstName: user.firstName
      }
    })

  } catch (error) {
    console.error('💥 Verify token error:', error)
    res.status(500).json({
      success: false,
      message: 'Something went wrong'
    })
  }
}

// Get Current User
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      specializations: user.specializations,
      isActive: user.isActive,
      loyaltyPoints: user.loyaltyPoints
    }
    
    res.status(200).json({
      success: true,
      data: userResponse
    })
  } catch (error) {
    console.error('💥 Get user error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get user data',
      error: error.message
    })
  }
}

// Logout (Client-side token removal)
export const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  })
}

// Google OAuth (placeholder - implement with passport)
export const googleAuth = async (req, res) => {
  try {
    console.log('📗 Google OAuth callback initiated')
    
    // This will be called after successful Google OAuth
    // req.user will contain Google profile data
    const token = generateToken(req.user._id)
    
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`)
  } catch (error) {
    console.error('💥 Google OAuth error:', error)
    res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=OAuth callback failed`)
  }
}

// Facebook OAuth callback
export const facebookAuth = async (req, res) => {
  try {
    console.log('📘 Facebook OAuth callback initiated')
    console.log('📘 Query params:', req.query)
    
    const { code, error } = req.query
    
    // Handle OAuth error
    if (error) {
      console.error('❌ Facebook OAuth error:', error)
      return res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=${encodeURIComponent(error)}`)
    }
    
    // Handle missing code
    if (!code) {
      console.error('❌ No authorization code received')
      return res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=No authorization code`)
    }

    console.log('🔑 Authorization code received:', code.substring(0, 10) + '...')

    // Exchange code for access token
    const tokenResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        code,
        redirect_uri: process.env.FACEBOOK_REDIRECT_URI
      })
    })
    
    const tokens = await tokenResponse.json()
    console.log('🎫 Token response:', tokens.access_token ? 'Token received' : 'No token')
    
    if (tokens.error) {
      console.error('❌ Facebook token error:', tokens.error)
      return res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=Token exchange failed`)
    }

    // Get user info from Facebook
    const userResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,first_name,last_name,email&access_token=${tokens.access_token}`)
    const facebookUser = await userResponse.json()
    
    console.log('👤 Facebook user:', facebookUser.name, facebookUser.email)
    
    if (facebookUser.error) {
      console.error('❌ Facebook user fetch error:', facebookUser.error)
      return res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=Failed to get user data`)
    }

    // Find or create user in your database
    let user = await User.findOne({ email: facebookUser.email })
    
    if (!user) {
      console.log('🆕 Creating new user from Facebook data')
      
      // Create user (password will be generated and hashed by pre-save middleware)
      user = new User({
        firstName: facebookUser.first_name,
        lastName: facebookUser.last_name || '',
        email: facebookUser.email,
        password: Math.random().toString(36), // Random password, will be hashed
        phone: '', // Facebook doesn't always provide phone
        role: 'customer',
        isActive: true,
        loyaltyPoints: 0,
        createdBy: 'facebook-oauth'
      })
      await user.save()
      console.log('✅ New user created:', user._id)
    } else {
      console.log('✅ Existing user found:', user._id)
    }
    
    // Generate JWT token
    const token = generateToken(user._id)
    
    // Create user data for URL (keep it minimal)
    const userData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    }
    
    // Redirect to frontend with success
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/success?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`
    console.log('🔄 Redirecting to frontend:', redirectUrl)
    res.redirect(redirectUrl)
    
  } catch (error) {
    console.error('💥 Facebook OAuth callback error:', error)
    res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=OAuth callback failed`)
  }
}

// Test email function
export const testEmail = async (req, res) => {
  try {
    const { email } = req.body
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      })
    }
    
    // First verify connection
    const isConnected = await verifyEmailConnection()
    if (!isConnected) {
      return res.status(500).json({
        success: false,
        message: 'SMTP connection failed. Check email configuration.'
      })
    }
    
    // Send test OTP
    const testOtp = generateOTP()
    await sendOTPEmail(email, testOtp, 'Test User')
    
    res.status(200).json({
      success: true,
      message: 'Test email sent successfully! Check your inbox and spam folder.',
      testOtp // Remove this in production
    })
    
  } catch (error) {
    console.error('Test email route error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to send test email: ' + error.message
    })
  }
}
