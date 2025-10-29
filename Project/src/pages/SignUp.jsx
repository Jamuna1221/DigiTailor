import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`

function SignUp({ onSignIn }) {
  const navigate = useNavigate()
  
  const [step, setStep] = useState(1) // 1: Form, 2: OTP Verification
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    specializations: [],
    agreeTerms: false
  })
  
  const [otpData, setOtpData] = useState({
    otp: '',
    timer: 300, // 5 minutes
    canResend: false
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState({})

  // Google OAuth handler
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`
  }

  // Timer for OTP
  React.useEffect(() => {
    let interval = null
    if (step === 2 && otpData.timer > 0) {
      interval = setInterval(() => {
        setOtpData(prev => ({
          ...prev,
          timer: prev.timer - 1
        }))
      }, 1000)
    } else if (otpData.timer === 0) {
      setOtpData(prev => ({ ...prev, canResend: true }))
    }
    return () => clearInterval(interval)
  }, [step, otpData.timer])

  // Comprehensive validation function
  const validateForm = () => {
    const errors = {}

    // First Name validation
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required'
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters'
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required'
    } else if (formData.lastName.trim().length < 1) {
      errors.lastName = 'Last name must be at least 2 characters'
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    // Phone validation - exactly 10 digits
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required'
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number'
    }

    // Password validation - 8+ chars, 1 uppercase, 1 digit, 1 special character
    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(formData.password)) {
      errors.password = 'Password must be 8+ characters with 1 uppercase, 1 number, and 1 special character'
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    // Tailor specializations validation
    if (formData.role === 'tailor' && formData.specializations.length === 0) {
      errors.specializations = 'Please select at least one specialization'
    }

    // Terms agreement validation
    if (!formData.agreeTerms) {
      errors.agreeTerms = 'You must agree to the Terms and Conditions'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name === 'specializations') {
      let updatedSpecializations
      if (checked) {
        updatedSpecializations = [...formData.specializations, value]
      } else {
        updatedSpecializations = formData.specializations.filter(spec => spec !== value)
      }
      
      setFormData(prev => ({
        ...prev,
        specializations: updatedSpecializations
      }))
    } else if (name === 'phone') {
      // Only allow digits for phone number
      const phoneValue = value.replace(/\D/g, '').slice(0, 10)
      setFormData(prev => ({
        ...prev,
        [name]: phoneValue
      }))
    } else {
      const newValue = type === 'checkbox' ? checked : value
      setFormData(prev => ({
        ...prev,
        [name]: newValue
      }))
    }
    
    // Clear specific field error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    setError('')
  }

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6) // Only digits, max 6
    setOtpData(prev => ({
      ...prev,
      otp: value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form before submission
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const submitData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        specializations: formData.role === 'tailor' ? formData.specializations : []
      }

      console.log('📊 Sending registration data:', submitData)

      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      })

      const data = await response.json()

      if (data.success) {
        setStep(2)
        setOtpData(prev => ({ ...prev, timer: 300, canResend: false, otp: '' }))
      } else {
        setError(data.message || 'Failed to send OTP. Please try again.')
      }
    } catch (err) {
      console.error('Registration error:', err)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    
    if (otpData.otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          otp: otpData.otp
        })
      })

      const data = await response.json()

      if (data.success) {
        // Store token and user
        localStorage.setItem('token', data.data.token)
        localStorage.setItem('digitailor_user', JSON.stringify(data.data.user))
        
        if (onSignIn) onSignIn(data.data.user)
        
        // Redirect based on role
        if (data.data.user.role === 'admin') {
          navigate('/admin')
        } else if (data.data.user.role === 'tailor') {
          navigate('/tailor-dashboard')
        } else {
          navigate('/')
        }
      } else {
        setError(data.message || 'Invalid OTP. Please try again.')
      }
    } catch (err) {
      console.error('OTP verification error:', err)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email.trim().toLowerCase() })
      })

      const data = await response.json()

      if (data.success) {
        setOtpData(prev => ({ ...prev, timer: 300, canResend: false, otp: '' }))
        setError('')
      } else {
        setError(data.message || 'Failed to resend OTP.')
      }
    } catch  {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: '', color: '' }
    
    let score = 0
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)

    }
    
    Object.values(checks).forEach(check => check && score++)
    
    if (score < 3) return { strength: score, text: 'Weak', color: 'text-red-500' }
    if (score < 5) return { strength: score, text: 'Medium', color: 'text-yellow-500' }
    return { strength: score, text: 'Strong', color: 'text-green-500' }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  // OTP Verification Step
  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center space-x-2 mb-8">
              <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">DT</span>
              </div>
              <span className="text-2xl font-bold gradient-text">DigiTailor</span>
            </Link>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify your email</h2>
            <p className="text-gray-600">We sent a verification code to {formData.email}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-800 text-sm">{error}</span>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  value={otpData.otp}
                  onChange={handleOtpChange}
                  required
                  maxLength="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-center text-2xl tracking-widest"
                  placeholder="000000"
                />
                <p className="text-xs text-gray-500 mt-1">Enter the 6-digit code sent to your email</p>
              </div>

              <div className="text-center">
                {otpData.timer > 0 ? (
                  <p className="text-gray-600 text-sm">
                    Resend code in {formatTimer(otpData.timer)}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-purple-600 hover:text-purple-500 font-medium text-sm"
                  >
                    Resend verification code
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || otpData.otp.length !== 6}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white transition-all duration-200 ${
                  loading || otpData.otp.length !== 6
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  'Verify & Create Account'
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                ← Back to registration
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Main Registration Form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">DT</span>
            </div>
            <span className="text-2xl font-bold gradient-text">DigiTailor</span>
          </Link>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
          <p className="text-gray-600">Join DigiTailor and start your fashion journey</p>
        </div>

        {/* Sign Up Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          

          {/* Divider */}
          

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-800 text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am registering as:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${formData.role === 'customer' ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`}>
                  <input
                    type="radio"
                    name="role"
                    value="customer"
                    checked={formData.role === 'customer'}
                    onChange={handleChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">Customer</div>
                    <div className="text-xs text-gray-500">I want to place orders</div>
                  </div>
                </label>
                
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${formData.role === 'tailor' ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`}>
                  <input
                    type="radio"
                    name="role"
                    value="tailor"
                    checked={formData.role === 'tailor'}
                    onChange={handleChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">Tailor</div>
                    <div className="text-xs text-gray-500">I want to fulfill orders</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Specializations (Show only if role is tailor) */}
            {formData.role === 'tailor' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specializations (Select all that apply) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['men', 'women', 'kids', 'bridal'].map(spec => (
                    <label key={spec} className="flex items-center">
                      <input
                        type="checkbox"
                        name="specializations"
                        value={spec}
                        checked={formData.specializations.includes(spec)}
                        onChange={handleChange}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{spec}</span>
                    </label>
                  ))}
                </div>
                {validationErrors.specializations && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.specializations}</p>
                )}
              </div>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  autoComplete="given-name"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    validationErrors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="First name"
                />
                {validationErrors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  autoComplete="family-name"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    validationErrors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Last name"
                />
                {validationErrors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                  validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                autoComplete="tel"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                  validationErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="9876543210"
                maxLength="10"
              />
              {validationErrors.phone && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
              )}
              {formData.phone && formData.phone.length === 10 && !validationErrors.phone && (
                <p className="mt-1 text-sm text-green-600">✓ Valid phone number</p>
              )}
            </div>

            {/* Password Fields */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                  validationErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Create a strong password"
              />
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Password strength:</span>
                    <span className={`text-xs font-semibold ${passwordStrength.color}`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        passwordStrength.strength < 3 ? 'bg-red-500' :
                        passwordStrength.strength < 5 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    ></div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    Must include: 8+ chars, uppercase, lowercase, number, special character
                  </div>
                </div>
              )}
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                  validationErrors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Confirm your password"
              />
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
              )}
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="mt-1 text-sm text-green-600">✓ Passwords match</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <input
                id="agreeTerms"
                name="agreeTerms"
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1"
              />
              <label htmlFor="agreeTerms" className="ml-3 block text-sm text-gray-700">
                I agree to the{' '}
                <Link to="/terms" className="text-purple-600 hover:text-purple-500 font-medium">
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-purple-600 hover:text-purple-500 font-medium">
                  Privacy Policy
                </Link>{' '}
                <span className="text-red-500">*</span>
              </label>
            </div>
            {validationErrors.agreeTerms && (
              <p className="text-sm text-red-600">{validationErrors.agreeTerms}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white transition-all duration-200 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending verification...
                </>
              ) : (
                'Send Verification Code'
              )}
            </button>
            <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>
            {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex justify-center items-center py-3 px-4 mb-6 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
