import { useState, useEffect, useCallback } from 'react'
import { useCart } from '../contexts/CartContext'
import { useNavigate } from 'react-router-dom'
import CheckoutRecommendations from '../components/checkout/CheckoutRecommendations'

// ✅ Fixed: Use environment variable properly for Vite
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://your-production-api.com/api' 
  : 'http://localhost:5000/api'

function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('razorpay')
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    specialInstructions: ''
  })

  // ✅ Enhanced form validation
  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      case 'phone':
        return /^[6-9]\d{9}$/.test(value)
      case 'zipCode':
        return /^\d{6}$/.test(value)
      case 'fullName':
        return value.trim().length >= 2
      default:
        return value.trim().length > 0
    }
  }

  const getFieldError = (name, value) => {
    if (!value.trim()) return `${name} is required`
    
    switch (name) {
      case 'email':
        return !validateField(name, value) ? 'Please enter a valid email address' : ''
      case 'phone':
        return !validateField(name, value) ? 'Please enter a valid 10-digit mobile number' : ''
      case 'zipCode':
        return !validateField(name, value) ? 'Please enter a valid 6-digit ZIP code' : ''
      case 'fullName':
        return !validateField(name, value) ? 'Full name must be at least 2 characters' : ''
      default:
        return ''
    }
  }

  // ✅ Secure user loading with proper cleanup
  useEffect(() => {
    let isMounted = true

    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem('digitailor_user')
        if (savedUser && isMounted) {
          const userData = JSON.parse(savedUser)
          setUser(userData)
          console.log('✅ User loaded:', userData)
          
          // Pre-fill form with user data
          setShippingInfo(prev => ({
            ...prev,
            fullName: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
            email: userData.email || '',
            phone: userData.phone || ''
          }))
        } else if (isMounted) {
          navigate('/login?redirect=checkout')
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('digitailor_user')
        if (isMounted) navigate('/login?redirect=checkout')
      }
    }

    loadUser()

    // Redirect if cart is empty
    if ((!cartItems || cartItems.length === 0) && isMounted) {
      navigate('/catalog')
    }

    return () => { isMounted = false }
  }, [cartItems, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // ✅ Price calculations
  const subtotal = getCartTotal()
  const delivery = 50
  const tax = 0
  const codCharges = paymentMethod === 'cod' ? 10 : 0
  const total = subtotal + delivery + tax + codCharges

  // ✅ Load Razorpay script only once
  const loadRazorpayScript = useCallback(() => {
    return new Promise((resolve) => {
      if (razorpayLoaded || window.Razorpay) {
        resolve(true)
        return
      }

      // Check if script already exists
      const existingScript = document.querySelector('script[src*="razorpay"]')
      if (existingScript) {
        existingScript.onload = () => {
          setRazorpayLoaded(true)
          resolve(true)
        }
        return
      }

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        setRazorpayLoaded(true)
        resolve(true)
      }
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }, [razorpayLoaded])

  // ✅ ENHANCED API request function with FULL error details
  const makeAPIRequest = async (url, options) => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('Authentication token not found. Please login again.')
    }

    console.log(`🌐 Making API request to: ${API_BASE_URL}${url}`)
    console.log('📤 Request payload:', options.body)

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    })

    console.log(`📡 Response status: ${response.status}`)
    
    const responseText = await response.text()
    console.log('📄 Raw response:', responseText)
    
    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`
      try {
        const errorData = JSON.parse(responseText)
        errorMessage = errorData.message || errorData.error || errorMessage
        console.log('❌ Parsed error:', errorData)
      } catch (parseError) {
        errorMessage = responseText || errorMessage
        console.log('❌ Parse error:', parseError)
      }
      throw new Error(errorMessage)
    }

    try {
      return JSON.parse(responseText)
    } catch (parseError) {
      console.log('JSON parse error:', parseError)
      throw new Error('Invalid response format from server')
    }
  }

  // ✅ COMPLETELY FIXED COD Handler - EXACT match to your controller
 const handleCODOrder = async () => {
  console.log('🚚 Starting COD order creation...')
  
  if (!user?.id && !user?._id) {
    throw new Error('User ID is missing. Please login again.')
  }
  
  if (!cartItems || cartItems.length === 0) {
    throw new Error('Cart is empty')
  }

  // ✅ SEND data matching what controller expects
  const orderData = {
    customer: user.id || user._id,
    items: cartItems.map(item => ({
      productId: item.id || item._id || item.productId,
      name: item.name || 'Unknown Product',
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      category: item.category || '',
      image: item.image || ''
    })),
    subtotal: Number(subtotal),
    tax: Number(tax),
    deliveryCharges: Number(delivery),
    total: Number(total),
    paymentMethod: 'cash_on_delivery',
    customerNotes: shippingInfo.specialInstructions || '',
    
    // ✅ PROPER shippingInfo structure
    shippingInfo: {
      fullName: shippingInfo.fullName,
      email: shippingInfo.email,
      phone: shippingInfo.phone,
      address: {
        street: shippingInfo.street,
        city: shippingInfo.city,
        state: shippingInfo.state,
        zipCode: shippingInfo.zipCode
      },
      specialInstructions: shippingInfo.specialInstructions || ''
    }
  }

  console.log('📋 Final order data:', JSON.stringify(orderData, null, 2))
  
  const result = await makeAPIRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  })

  console.log('🎉 COD Order created:', result)
  return result
}

  // ✅ Handle Razorpay payment
  const handleRazorpayPayment = async () => {
    console.log('💳 Starting Razorpay payment...')

    // Prepare order data for Razorpay
    const orderData = {
      customer: user.id || user._id,
      items: cartItems.map(item => ({
        productId: item.id || item._id || item.productId,
        name: item.name || 'Unknown Product',
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        category: item.category || '',
        image: item.image || ''
      })),
      subtotal: Number(subtotal),
      tax: Number(tax),
      deliveryCharges: Number(delivery),
      total: Number(total),
      customerNotes: shippingInfo.specialInstructions || '',
      shippingInfo: {
        fullName: shippingInfo.fullName,
        email: shippingInfo.email,
        phone: shippingInfo.phone,
        address: {
          street: shippingInfo.street,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode
        },
        specialInstructions: shippingInfo.specialInstructions || ''
      }
    }

    try {
      // Create Razorpay order
      const response = await makeAPIRequest('/payment/create-order', {
        method: 'POST',
        body: JSON.stringify(orderData)
      })

      console.log('✅ Razorpay order created:', response.data)

      // Initialize Razorpay payment
      const options = {
        key: response.data.key,
        amount: response.data.amount,
        currency: response.data.currency,
        name: 'DigiTailor',
        description: 'Custom Tailoring Order',
        order_id: response.data.razorpayOrderId,
        handler: async function (paymentResponse) {
          console.log('🎉 Payment successful:', paymentResponse)
          
          // Verify payment
          try {
            const verifyResponse = await makeAPIRequest('/payment/verify', {
              method: 'POST',
              body: JSON.stringify({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                order_id: response.data.orderId,
                order_type: 'catalog'
              })
            })

            console.log('✅ Payment verified:', verifyResponse.data)
            
            // Success - redirect to order success page
            const orderNumber = verifyResponse.data?.orderNumber || 'N/A'
            const orderId = verifyResponse.data?.orderId || 'N/A'
            navigate('/order-success', { state: { orderNumber, orderId } })
            
          } catch (verifyError) {
            console.error('❌ Payment verification failed:', verifyError)
            alert('❌ Payment verification failed. Please contact support.')
          }
        },
        modal: {
          ondismiss: function() {
            console.log('❌ Payment cancelled by user')
            alert('❌ Payment was cancelled')
          }
        },
        prefill: {
          name: shippingInfo.fullName,
          email: shippingInfo.email,
          contact: shippingInfo.phone
        },
        theme: {
          color: '#7C3AED'
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

      rzp.on('payment.failed', function (response) {
        console.error('❌ Payment failed:', response.error)
        
        // Handle payment failure
        makeAPIRequest('/payment/failure', {
          method: 'POST',
          body: JSON.stringify({
            order_id: response.data.orderId,
            order_type: 'catalog',
            reason: response.error.description
          })
        }).catch(console.error)
        
        alert(`❌ Payment failed: ${response.error.description}`)
      })

    } catch (error) {
      console.error('❌ Error creating Razorpay order:', error)
      throw error
    }
  }

  // ✅ Main payment handler with enhanced error handling
  const handlePayment = async () => {
    try {
      setLoading(true)
      console.log('🚀 Starting payment process...', paymentMethod)

      // Validate cart
      if (!cartItems || cartItems.length === 0) {
        alert('Your cart is empty!')
        return
      }

      if (!user?.id && !user?._id) {
        alert('User session invalid. Please login again.')
        navigate('/login?redirect=checkout')
        return
      }

      // Enhanced form validation
      const requiredFields = ['fullName', 'email', 'phone', 'street', 'city', 'state', 'zipCode']
      const errors = []

      for (const field of requiredFields) {
        const error = getFieldError(field, shippingInfo[field])
        if (error) errors.push(error)
      }

      if (errors.length > 0) {
        alert('Please fix the following errors:\n' + errors.join('\n'))
        return
      }

      console.log('✅ All validations passed')

      let result
      if (paymentMethod === 'cod') {
        result = await handleCODOrder()
        // Success
        console.log('🎉 Order placed successfully:', result)
        const orderNumber = result.data?.orderNumber || 'N/A'
        const orderId = result.data?.orderId || 'N/A'
        navigate('/order-success', { state: { orderNumber, orderId } })
      } else {
        const scriptLoaded = await loadRazorpayScript()
        if (!scriptLoaded) {
          alert('Failed to load payment gateway. Please try again.')
          return
        }
        await handleRazorpayPayment()
      }

    } catch (error) {
      console.error('💥 COMPLETE Payment error details:', error)
      console.error('💥 Error stack:', error.stack)

      let userMessage = error.message || 'Unknown error occurred'

      if (error.message.includes('Authentication')) {
        userMessage = 'Your session has expired. Please login again.'
        setTimeout(() => {
          localStorage.removeItem('digitailor_user')
          localStorage.removeItem('token')
          navigate('/login?redirect=checkout')
        }, 2000)
      } else if (error.message.includes('Network') || error.message.includes('fetch')) {
        userMessage = 'Network error. Please check your connection and try again.'
      } else if (error.message.includes('cancelled')) {
        userMessage = 'Payment was cancelled.'
      }

      alert(`❌ Order failed: ${userMessage}`)
    } finally {
      setLoading(false)
    }
  }

  // Loading states
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <button 
            onClick={() => navigate('/catalog')}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Browse Catalog
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1220] py-8 dark:text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-[#111827] rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-800">
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600 mt-1">Complete your order details</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Shipping Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
              
              <div className="space-y-4">
                {[
                  { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Enter your full name' },
                  { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter your email' },
                  { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Enter 10-digit mobile number' },
                  { name: 'street', label: 'Street Address', type: 'text', placeholder: 'Enter your street address' }
                ].map(field => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label} *
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={shippingInfo[field.name]}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        shippingInfo[field.name] && !validateField(field.name, shippingInfo[field.name])
                          ? 'border-red-300'
                          : 'border-gray-300'
                      }`}
                      placeholder={field.placeholder}
                    />
                    {shippingInfo[field.name] && !validateField(field.name, shippingInfo[field.name]) && (
                      <p className="mt-1 text-sm text-red-600">
                        {getFieldError(field.name, shippingInfo[field.name])}
                      </p>
                    )}
                  </div>
                ))}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { name: 'city', label: 'City', placeholder: 'City' },
                    { name: 'state', label: 'State', placeholder: 'State' },
                    { name: 'zipCode', label: 'ZIP Code', placeholder: 'ZIP Code' }
                  ].map(field => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label} *
                      </label>
                      <input
                        type="text"
                        name={field.name}
                        value={shippingInfo[field.name]}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          shippingInfo[field.name] && !validateField(field.name, shippingInfo[field.name])
                            ? 'border-red-300'
                            : 'border-gray-300'
                        }`}
                        placeholder={field.placeholder}
                      />
                      {shippingInfo[field.name] && !validateField(field.name, shippingInfo[field.name]) && (
                        <p className="mt-1 text-sm text-red-600">
                          {getFieldError(field.name, shippingInfo[field.name])}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    name="specialInstructions"
                    value={shippingInfo.specialInstructions}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Any special delivery instructions or design preferences..."
                  />
                </div>

                {/* Payment Method Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Payment Method *
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        id="razorpay"
                        name="paymentMethod"
                        type="radio"
                        value="razorpay"
                        checked={paymentMethod === 'razorpay'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                      />
                      <label htmlFor="razorpay" className="ml-3 block text-sm font-medium text-gray-700">
                        <div className="flex items-center">
                          <span>💳 Online Payment (Razorpay)</span>
                          <span className="ml-2 text-green-600 text-xs">Available</span>
                        </div>
                        <p className="text-gray-500 text-xs mt-1">Pay securely using cards, UPI, net banking</p>
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="cod"
                        name="paymentMethod"
                        type="radio"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                      />
                      <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
                        <div className="flex items-center">
                          <span>🚚 Cash on Delivery</span>
                          <span className="ml-2 text-orange-600 text-xs">+₹10 extra</span>
                        </div>
                        <p className="text-gray-500 text-xs mt-1">Pay when your order is delivered</p>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <img
                        src={item.image || 'https://via.placeholder.com/60x60?text=Item'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        <p className="text-xs text-gray-500">{item.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Breakdown */}
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery:</span>
                    <span className="font-medium">₹{delivery}</span>
                  </div>
                  {paymentMethod === 'cod' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">COD Charges:</span>
                      <span className="font-medium text-orange-600">₹{codCharges}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">₹{tax}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-purple-600">₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-colors ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {loading ? 'Processing...' : 
                    paymentMethod === 'cod' ? 
                      `Place COD Order - ₹${total.toLocaleString()}` : 
                      `Pay Now - ₹${total.toLocaleString()}`
                  }
                </button>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    {paymentMethod === 'cod' ? 
                      'You will pay on delivery' : 
                      'Secure payment powered by Razorpay'
                    }
                  </p>
                </div>

                {/* Recommendations below Pay Now */}
                <CheckoutRecommendations cartItems={cartItems} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
