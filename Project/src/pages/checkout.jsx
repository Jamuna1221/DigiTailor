import { useState, useEffect } from 'react'
import { useCart } from '../contexts/CartContext'
import { useNavigate } from 'react-router-dom'

function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)

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

  useEffect(() => {
    // Get logged in user
    const savedUser = localStorage.getItem('digitailor_user')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      
      // Pre-fill form with user data
      setShippingInfo(prev => ({
        ...prev,
        fullName: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        phone: userData.phone || ''
      }))
    } else {
      // Redirect to login if not authenticated
      navigate('/login?redirect=checkout')
      return
    }

    // Debug cart data
    console.log('🛒 Cart items in checkout:', cartItems)
    console.log('💰 Cart total in checkout:', getCartTotal())

    // Redirect if cart is empty
    if (!cartItems || cartItems.length === 0) {
      console.log('❌ Cart is empty, redirecting to catalog')
      navigate('/catalog')
      return
    }
  }, [cartItems, navigate, getCartTotal])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const subtotal = getCartTotal()
  const delivery = 50
  const tax = 0
  const total = subtotal + delivery + tax

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    try {
      setLoading(true)
      console.log('🚀 Starting payment process...')

      // ✅ Additional validation
      if (!cartItems || cartItems.length === 0) {
        alert('Your cart is empty!')
        return
      }

      if (total <= 0) {
        alert('Invalid order total!')
        return
      }

      // Validate form
      const requiredFields = ['fullName', 'email', 'phone', 'street', 'city', 'state', 'zipCode']
      const missingFields = requiredFields.filter(field => !shippingInfo[field])
      
      if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(', ')}`)
        return
      }

      console.log('✅ Validation passed')

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        alert('Failed to load payment gateway. Please try again.')
        return
      }

      console.log('✅ Razorpay script loaded')

      // Check if backend is accessible
      const token = localStorage.getItem('token')
      console.log('🔑 Token exists:', !!token)

      // Create Razorpay order
      console.log('💳 Creating Razorpay order for amount:', total)
      
      const orderResponse = await fetch('http://localhost:5000/api/orders/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: total,
          currency: 'INR'
        })
      })

      console.log('📡 Order response status:', orderResponse.status)

      if (!orderResponse.ok) {
        const errorText = await orderResponse.text()
        console.error('❌ Order response error:', errorText)
        throw new Error(`Failed to create payment order: ${orderResponse.status} ${errorText}`)
      }

      const orderData = await orderResponse.json()
      console.log('✅ Order data received:', orderData)

      // Configure Razorpay options
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'DigiTailor',
        description: 'Custom Tailoring Order',
        order_id: orderData.orderId,
        prefill: {
          name: shippingInfo.fullName,
          email: shippingInfo.email,
          contact: shippingInfo.phone
        },
        theme: {
          color: '#4F46E5'
        },
        handler: async function (response) {
          try {
            console.log('💰 Payment successful, verifying...')
            
            // Verify payment
            const verifyResponse = await fetch('http://localhost:5000/api/orders/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            })

            if (verifyResponse.ok) {
              console.log('✅ Payment verified, creating order...')
              
              // Create order in database
              const createOrderResponse = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  items: cartItems.map(item => ({
                    productId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    category: item.category,
                    image: item.image
                  })),
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
                    specialInstructions: shippingInfo.specialInstructions
                  },
                  payment: {
                    method: 'razorpay',
                    status: 'paid',
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature
                  },
                  total: total,
                  subtotal: subtotal,
                  delivery: delivery,
                  tax: tax
                })
              })

              if (createOrderResponse.ok) {
                const orderResult = await createOrderResponse.json()
                console.log('🎉 Order created successfully:', orderResult)
                alert('Order placed successfully!')
                clearCart()
                navigate('/orders')
              } else {
                const errorText = await createOrderResponse.text()
                console.error('❌ Order creation failed:', errorText)
                throw new Error('Failed to create order')
              }
            } else {
              const errorText = await verifyResponse.text()
              console.error('❌ Payment verification failed:', errorText)
              throw new Error('Payment verification failed')
            }
          } catch (error) {
            console.error('💥 Order creation error:', error)
            alert('Failed to create order. Please contact support with payment ID: ' + response.razorpay_payment_id)
          }
        },
        modal: {
          ondismiss: function() {
            console.log('🚫 Payment modal closed')
          }
        }
      }

      console.log('🎯 Opening Razorpay modal...')
      const razorpay = new window.Razorpay(options)
      razorpay.open()

    } catch (error) {
      console.error('💥 Payment error:', error)
      alert(`Payment failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // ✅ Better loading check
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600 mt-1">Complete your order details</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Shipping Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={shippingInfo.street}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your street address"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="State"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="ZIP"
                    />
                  </div>
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
                  {loading ? 'Processing...' : `Place Order - ₹${total.toLocaleString()}`}
                </button>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Secure payment powered by Razorpay
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
