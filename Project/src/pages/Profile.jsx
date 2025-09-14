import { useState, useEffect, useCallback } from 'react'
import MeasurementForm from '../components/order/MeasurementForm.jsx'
import OrderSummary from '../components/order/OrderSummary.jsx'
import admin from '../assets/images/admin.jpeg'

function Profile({ user }) {
  const [activeTab, setActiveTab] = useState('measurements')
  const [orders, setOrders] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [measurementsSaved, setMeasurementsSaved] = useState(false)

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true)
      
      // Fetch user orders and wishlist in parallel
      const [ordersResponse, wishlistResponse] = await Promise.all([
        fetch(`http://localhost:5000/api/orders/user/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`http://localhost:5000/api/wishlist`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        })
      ])

      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json()
        if (ordersData.success) {
          setOrders(ordersData.data)
        }
      }

      if (wishlistResponse.ok) {
        const wishlistData = await wishlistResponse.json()
        if (wishlistData.success) {
          // ✅ Enhanced wishlist data with better fallbacks
          const wishlistWithDetails = await Promise.all(
            wishlistData.data.map(async (item) => {
              try {
                // Try to fetch design details from your catalog API
                const designResponse = await fetch(`http://localhost:5000/api/catalog/${item.productId}`)
                if (designResponse.ok) {
                  const designData = await designResponse.json()
                  if (designData.success) {
                    return {
                      _id: item._id,
                      productId: item.productId,
                      addedAt: item.addedAt,
                      name: designData.data.name,
                      price: designData.data.basePrice,
                      image: designData.data.primaryImage,
                      category: designData.data.category,
                      description: designData.data.description
                    }
                  }
                }
                
                // If catalog API doesn't exist, use the data from wishlist response
                return {
                  _id: item._id,
                  productId: item.productId,
                  addedAt: item.addedAt,
                  name: item.name || `Design ${item.productId.slice(-4)}`,
                  price: item.price || Math.floor(Math.random() * 5000) + 2000,
                  image: item.image || 'https://via.placeholder.com/300x200?text=Design',
                  category: item.category || 'Custom Design',
                  description: item.description || 'Beautiful custom tailored design'
                }
              } catch (error) {
                console.error('Error fetching design details:', error)
                // Fallback data
                return {
                  _id: item._id,
                  productId: item.productId,
                  addedAt: item.addedAt,
                  name: `Design ${item.productId.slice(-4)}`,
                  price: 2500,
                  image: 'https://via.placeholder.com/300x200?text=Custom+Design',
                  category: 'Custom Design',
                  description: 'Beautiful custom tailored design'
                }
              }
            })
          )
          
          setWishlist(wishlistWithDetails)
        } else {
          setWishlist([])
        }
      }

    } catch (error) {
      console.error('Error fetching user data:', error)
      setWishlist([])
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [user.id])

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user, fetchUserData])

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/wishlist/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        // Remove from local state
        setWishlist(prev => prev.filter(item => item.productId !== productId))
        console.log('✅ Item removed from wishlist')
      } else {
        console.error('Failed to remove item from wishlist')
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    }
  }

  // Add to cart from wishlist
  const addToCartFromWishlist = async (item) => {
    try {
      // You can integrate with your cart context here
      console.log('Adding to cart:', item)
      alert(`${item.name} added to cart!`)
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  const handleSaveMeasurements = async (measurementData) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/measurements', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(measurementData)
      })

      if (response.ok) {
        setMeasurementsSaved(true)
        setTimeout(() => setMeasurementsSaved(false), 3000)
      } else {
        console.error('Failed to save measurements')
      }
    } catch (error) {
      console.error('Error saving measurements:', error)
    }
  }

  const tabs = [
    { id: 'measurements', name: 'Measurements', icon: '📏' },
    { id: 'orders', name: 'Order History', icon: '📦' },
    { id: 'wishlist', name: 'Wishlist', icon: '❤️' },
    { id: 'settings', name: 'Settings', icon: '⚙️' },
  ]

  // If no user is logged in, show login prompt
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-xl shadow-lg p-12">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
          <p className="text-gray-600 mb-6">You need to sign in to view your profile</p>
          <a href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Sign In
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white p-8 mb-8">
        <div className="flex items-center space-x-6">
          <img
            src={user.profileImage || admin}
            alt={user.firstName}
            className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
            onError={(e) => {
              e.target.src = admin
            }}
          />
          <div>
            <h1 className="text-3xl font-bold">{user.firstName} {user.lastName}</h1>
            <p className="text-blue-100">{user.email}</p>
            <div className="flex items-center mt-2 space-x-4">
              <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                <span className="text-sm font-medium">⭐ {user.loyaltyPoints || 0} points</span>
              </div>
              <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                <span className="text-sm font-medium">
                  {user.role === 'admin' ? '👑 Admin' : user.role === 'tailor' ? '✂️ Tailor' : '👤 Customer'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
              {tab.id === 'wishlist' && wishlist.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {wishlist.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'measurements' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Measurements</h2>
            {measurementsSaved && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <span className="text-green-600 mr-2">✅</span>
                  <span className="text-green-800">Measurements saved successfully!</span>
                </div>
              </div>
            )}
            <MeasurementForm onSubmit={handleSaveMeasurements} />
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <p className="ml-3 text-gray-600">Loading orders...</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">Order #{order._id.slice(-8)}</h3>
                        <p className="text-gray-600">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Dispatched' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                        <p className="text-xl font-bold text-gray-900 mt-1">₹{order.totalAmount?.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Items:</h4>
                      <ul className="space-y-1">
                        {order.items?.map((item, idx) => (
                          <li key={idx} className="flex justify-between text-sm">
                            <span>{item.name} x {item.quantity}</span>
                            <span>₹{item.price?.toLocaleString()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h3>
                <p className="text-gray-500 mb-6">Start by browsing our amazing design catalog</p>
                <a href="/catalog" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Browse Designs
                </a>
              </div>
            )}
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Your Wishlist ({wishlist.length} item{wishlist.length !== 1 ? 's' : ''})
              </h2>
              {wishlist.length > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
                      // Implement clear all wishlist functionality
                      setWishlist([])
                    }
                  }}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Clear All
                </button>
              )}
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <p className="ml-3 text-gray-600">Loading wishlist...</p>
              </div>
            ) : wishlist.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((item) => (
                  <div key={item._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img 
                        src={item.image || 'https://via.placeholder.com/300x200?text=Design'} 
                        alt={item.name || 'Design'}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=Design'
                        }}
                      />
                      <button
                        onClick={() => removeFromWishlist(item.productId)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        title="Remove from wishlist"
                      >
                        🗑️
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{item.name || 'Design Item'}</h3>
                      <p className="text-gray-600 text-sm mb-2">{item.category || 'Custom Design'}</p>
                      <p className="text-xl font-bold text-purple-600 mb-3">
                        ₹{item.price?.toLocaleString() || '2,500'}
                      </p>
                      <div className="space-y-2">
                        <button 
                          onClick={() => addToCartFromWishlist(item)}
                          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          Add to Cart
                        </button>
                        <p className="text-xs text-gray-500">
                          Added on {new Date(item.addedAt).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">❤️</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Your wishlist is empty</h3>
                <p className="text-gray-500 mb-6">Save designs you love for later by clicking the heart icon</p>
                <a href="/catalog" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Explore Designs
                </a>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input 
                      type="text" 
                      defaultValue={user.firstName}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input 
                      type="text" 
                      defaultValue={user.lastName}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      defaultValue={user.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input 
                      type="tel" 
                      defaultValue={user.phone}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      defaultChecked 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                    />
                    <span className="ml-3 text-sm text-gray-700">Order updates and tracking notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      defaultChecked 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                    />
                    <span className="ml-3 text-sm text-gray-700">New design releases and collections</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                    />
                    <span className="ml-3 text-sm text-gray-700">Promotional offers and discounts</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                    />
                    <span className="ml-3 text-sm text-gray-700">Weekly newsletter</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      defaultChecked 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                    />
                    <span className="ml-3 text-sm text-gray-700">Make my profile visible to tailors</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                    />
                    <span className="ml-3 text-sm text-gray-700">Share my measurements with recommended tailors</span>
                  </label>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                <div className="flex space-x-4">
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Save Changes
                  </button>
                  <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
