import { useState, useEffect, useCallback } from 'react'
import MeasurementForm from '../components/order/MeasurementForm.jsx'
import admin from '../assets/images/admin.jpg'
import { useFont } from '../contexts/FontContext.jsx'
import { useColorTheme } from '../contexts/ColorThemeContext.jsx'

function Profile({ user }) {
  const [activeTab, setActiveTab] = useState('measurements')
  const [orders, setOrders] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [measurements, setMeasurements] = useState([])
  const [loading, setLoading] = useState(true)
  const [measurementsSaved, setMeasurementsSaved] = useState(false)
  const [profileUpdateLoading, setProfileUpdateLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const { selectedFont, setFont, currentFont, availableFonts } = useFont()
  const { selectedTheme, setColorTheme, currentTheme, availableThemes } = useColorTheme()
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  })

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true)
      
      // Fetch user orders, wishlist, and measurements in parallel
      const [ordersResponse, wishlistResponse, measurementsResponse] = await Promise.all([
        fetch(`http://localhost:5000/api/orders/user/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }).catch(() => null),
        fetch(`http://localhost:5000/api/wishlist`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }).catch(() => null),
        fetch(`http://localhost:5000/api/measurements`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }).catch(() => null)
      ])

      // Handle orders
      if (ordersResponse && ordersResponse.ok) {
        const ordersData = await ordersResponse.json()
        if (ordersData.success) {
          setOrders(ordersData.data)
        }
      }

      // Handle wishlist
      if (wishlistResponse && wishlistResponse.ok) {
        const wishlistData = await wishlistResponse.json()
        if (wishlistData.success) {
          const wishlistWithDetails = await Promise.all(
            wishlistData.data.map(async (item) => {
              try {
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

      // Handle measurements
      if (measurementsResponse && measurementsResponse.ok) {
        const measurementsData = await measurementsResponse.json()
        if (measurementsData.success) {
          setMeasurements(measurementsData.data)
        }
      }

    } catch (error) {
      console.error('Error fetching user data:', error)
      setWishlist([])
      setOrders([])
      setMeasurements([])
    } finally {
      setLoading(false)
    }
  }, [user.id])

  useEffect(() => {
    if (user) {
      fetchUserData()
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      })
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
      console.log('Adding to cart:', item)
      alert(`${item.name} added to cart!`)
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  // Handle measurements save
  const handleSaveMeasurements = async (measurementData) => {
    try {
      setMeasurementsSaved(false)
      const response = await fetch('http://localhost:5000/api/measurements', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(measurementData)
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setMeasurementsSaved(true)
          setTimeout(() => setMeasurementsSaved(false), 3000)
          
          // Refresh measurements
          const measurementsResponse = await fetch('http://localhost:5000/api/measurements', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          })
          
          if (measurementsResponse.ok) {
            const measurementsData = await measurementsResponse.json()
            if (measurementsData.success) {
              setMeasurements(measurementsData.data)
            }
          }
        }
      } else {
        console.error('Failed to save measurements')
        alert('Failed to save measurements. Please try again.')
      }
    } catch (error) {
      console.error('Error saving measurements:', error)
      alert('Error saving measurements. Please try again.')
    }
  }

  // Handle profile picture upload
  const handleProfilePictureUpload = async (file) => {
    try {
      setUploadingImage(true)
      const formData = new FormData()
      formData.append('profileImage', file)

      const response = await fetch('http://localhost:5000/api/profile/picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Update user data in localStorage
          const savedUser = JSON.parse(localStorage.getItem('digitailor_user'))
          if (savedUser) {
            savedUser.profileImage = data.data.profileImage
            localStorage.setItem('digitailor_user', JSON.stringify(savedUser))
          }
          
          alert('Profile picture updated successfully!')
          window.location.reload() // Refresh to show new image
        }
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Failed to upload profile picture')
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error)
      alert('Error uploading profile picture. Please try again.')
    } finally {
      setUploadingImage(false)
    }
  }

  // Handle profile picture deletion
  const handleDeleteProfilePicture = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/profile/picture', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        // Update user data in localStorage
        const savedUser = JSON.parse(localStorage.getItem('digitailor_user'))
        if (savedUser) {
          savedUser.profileImage = null
          localStorage.setItem('digitailor_user', JSON.stringify(savedUser))
        }
        
        alert('Profile picture removed successfully!')
        window.location.reload() // Refresh to show default image
      } else {
        alert('Failed to remove profile picture')
      }
    } catch (error) {
      console.error('Error deleting profile picture:', error)
      alert('Error removing profile picture. Please try again.')
    }
  }

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setProfileUpdateLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Update user data in localStorage
          const savedUser = JSON.parse(localStorage.getItem('digitailor_user'))
          if (savedUser) {
            Object.assign(savedUser, data.data)
            localStorage.setItem('digitailor_user', JSON.stringify(savedUser))
          }
          
          alert('Profile updated successfully!')
          window.location.reload() // Refresh to show updated data
        }
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile. Please try again.')
    } finally {
      setProfileUpdateLoading(false)
    }
  }

  // Delete measurement
  const deleteMeasurement = async (measurementId) => {
    if (!window.confirm('Are you sure you want to delete this measurement?')) {
      return
    }

    try {
      const response = await fetch(`http://localhost:5000/api/measurements/${measurementId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setMeasurements(prev => prev.filter(m => m._id !== measurementId))
        alert('Measurement deleted successfully!')
      } else {
        alert('Failed to delete measurement')
      }
    } catch (error) {
      console.error('Error deleting measurement:', error)
      alert('Error deleting measurement. Please try again.')
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
                  <a href="/login" className="text-white px-6 py-3 rounded-lg transition-colors" style={{ background: 'var(--theme-gradient)' }}>
                    Sign In
                  </a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="rounded-xl text-white p-8 mb-8" style={{ background: 'var(--theme-gradient)' }}>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={user.profileImage ? `http://localhost:5000${user.profileImage}` : admin}
              alt={user.firstName}
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
              onError={(e) => {
                e.target.src = admin
              }}
            />
            {uploadingImage && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            )}
          </div>
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
                  ? 'text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              style={{
                borderColor: activeTab === tab.id ? 'var(--theme-primary)' : 'transparent',
                color: activeTab === tab.id ? 'var(--theme-primary)' : undefined
              }}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
              {tab.id === 'wishlist' && wishlist.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {wishlist.length}
                </span>
              )}
              {tab.id === 'measurements' && measurements.length > 0 && (
                <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  {measurements.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'measurements' && (
          <div className="space-y-8">
            {/* Existing Measurements */}
            {measurements.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Saved Measurements ({measurements.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {measurements.map((measurement) => (
                    <div key={measurement._id} className="bg-gray-50 rounded-lg p-6 border">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{measurement.measurementType}</h3>
                        <div className="flex space-x-2">
                          <span className="text-xs text-gray-500">
                            {new Date(measurement.createdAt).toLocaleDateString()}
                          </span>
                          <button
                            onClick={() => deleteMeasurement(measurement._id)}
                            className="text-red-500 hover:text-red-700 text-xs"
                            title="Delete measurement"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        {measurement.measurements.bust && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Bust:</span>
                            <span className="font-medium">{measurement.measurements.bust}"</span>
                          </div>
                        )}
                        {measurement.measurements.waist && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Waist:</span>
                            <span className="font-medium">{measurement.measurements.waist}"</span>
                          </div>
                        )}
                        {measurement.measurements.hip && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Hip:</span>
                            <span className="font-medium">{measurement.measurements.hip}"</span>
                          </div>
                        )}
                        {measurement.measurements.shoulderWidth && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Shoulder:</span>
                            <span className="font-medium">{measurement.measurements.shoulderWidth}"</span>
                          </div>
                        )}
                        {measurement.measurements.armLength && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Arm Length:</span>
                            <span className="font-medium">{measurement.measurements.armLength}"</span>
                          </div>
                        )}
                        {measurement.measurements.sleeveLength && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Sleeve:</span>
                            <span className="font-medium">{measurement.measurements.sleeveLength}"</span>
                          </div>
                        )}
                      </div>
                      {measurement.notes && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">Notes:</span> {measurement.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Measurement */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Measurement</h2>
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
                <a href="/catalog" className="text-white px-6 py-3 rounded-lg transition-all" style={{ background: 'var(--theme-gradient)' }}>
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
                          className="w-full text-white py-2 rounded-lg transition-all font-medium"
                          style={{ background: 'var(--theme-gradient)' }}
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
                <a href="/catalog" className="text-white px-6 py-3 rounded-lg transition-all" style={{ background: 'var(--theme-gradient)' }}>
                  Explore Designs
                </a>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Account Settings</h2>
            
            <div className="space-y-8">
              {/* Profile Picture Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Picture</h3>
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <img
                      src={user.profileImage ? `http://localhost:5000${user.profileImage}` : admin}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                      onError={(e) => {
                        e.target.src = admin
                      }}
                    />
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          handleProfilePictureUpload(e.target.files[0])
                        }
                      }}
                      className="hidden"
                      id="profileImageInput"
                      disabled={uploadingImage}
                    />
                    <div className="flex space-x-3">
                      <label
                        htmlFor="profileImageInput"
                        className={`px-4 py-2 rounded-lg cursor-pointer transition-all text-white ${
                          uploadingImage 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : ''
                        }`}
                        style={{
                          background: uploadingImage ? undefined : 'var(--theme-gradient)'
                        }}
                      >
                        {uploadingImage ? 'Uploading...' : 'Upload New Picture'}
                      </label>
                      {user.profileImage && !uploadingImage && (
                        <button
                          onClick={handleDeleteProfilePicture}
                          className="px-4 py-2 text-red-600 hover:text-red-800 border border-red-600 hover:border-red-800 rounded-lg transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Max file size: 5MB. Supported formats: JPG, PNG, GIF
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <form onSubmit={handleProfileUpdate}>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input 
                      type="text" 
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{
                        '--tw-ring-color': 'var(--theme-primary)',
                        '--tw-ring-opacity': '0.2'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--theme-primary)'
                        e.target.style.boxShadow = `0 0 0 3px var(--theme-primary)20`
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1d5db'
                        e.target.style.boxShadow = 'none'
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input 
                      type="text" 
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      value={profileData.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input 
                      type="tel" 
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200 mt-8">
                  <div className="flex space-x-4">
                    <button 
                      type="submit" 
                      disabled={profileUpdateLoading}
                      className={`px-6 py-3 rounded-lg font-medium transition-all text-white ${
                        profileUpdateLoading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : ''
                      }`}
                      style={{
                        background: profileUpdateLoading ? undefined : 'var(--theme-gradient)'
                      }}
                    >
                      {profileUpdateLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setProfileData({
                          firstName: user.firstName || '',
                          lastName: user.lastName || '',
                          email: user.email || '',
                          phone: user.phone || ''
                        })
                      }}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </form>

              {/* Email Notifications */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      defaultChecked 
                      className="rounded border-gray-300 focus:ring-2"
                      style={{
                        accentColor: 'var(--theme-primary)',
                        '--tw-ring-color': 'var(--theme-primary)',
                        '--tw-ring-opacity': '0.2'
                      }}
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

              {/* Privacy Settings */}
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

              {/* Font Selection */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Font Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div>
                      <p className="font-medium text-gray-900">Current Font</p>
                      <p className="text-sm text-gray-600">{currentFont.displayName}</p>
                      <p className="text-xs text-gray-500">{currentFont.description}</p>
                    </div>
                    <div className="text-right">
                      <div 
                        className="px-4 py-2 bg-white rounded-lg border shadow-sm"
                        style={{ fontFamily: currentFont.fontFamily }}
                      >
                        <span className="text-lg font-medium">Sample Text</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Choose Font</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableFonts.map((font) => (
                        <div 
                          key={font.id}
                          onClick={() => setFont(font.id)}
                          className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                            selectedFont === font.id 
                              ? 'border-purple-500 bg-purple-50 shadow-md' 
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{font.displayName}</h4>
                              <p className="text-xs text-gray-500">{font.category}</p>
                            </div>
                            <div className="flex items-center">
                              <div 
                                className="w-6 h-6 rounded-full border-2 transition-colors ${
                                  selectedFont === font.id 
                                    ? 'border-purple-500 bg-purple-500' 
                                    : 'border-gray-300'
                                }"
                              >
                                {selectedFont === font.id && (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div 
                            className="text-center p-3 bg-gray-50 rounded-lg"
                            style={{ fontFamily: font.fontFamily }}
                          >
                            <p className="text-lg font-medium text-gray-900">DigiTailor</p>
                            <p className="text-sm text-gray-600">The quick brown fox jumps</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">{font.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex">
                      <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-blue-900">Font changes apply instantly</p>
                        <p className="text-xs text-blue-700 mt-1">Your font preference will be applied to the entire website and saved for future visits.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Theme Selection */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Color Theme</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div>
                      <p className="font-medium text-gray-900">Current Theme</p>
                      <p className="text-sm text-gray-600">{currentTheme.displayName}</p>
                      <p className="text-xs text-gray-500">{currentTheme.description}</p>
                    </div>
                    <div className="text-right">
                      <div 
                        className="flex space-x-1 p-2 bg-white rounded-lg border shadow-sm"
                      >
                        <div 
                          className="w-6 h-6 rounded-full" 
                          style={{ backgroundColor: currentTheme.colors.primary }}
                        ></div>
                        <div 
                          className="w-6 h-6 rounded-full" 
                          style={{ backgroundColor: currentTheme.colors.primaryLight }}
                        ></div>
                        <div 
                          className="w-6 h-6 rounded-full" 
                          style={{ backgroundColor: currentTheme.colors.secondary }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Choose Color Theme</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {availableThemes.map((theme) => (
                        <div 
                          key={theme.id}
                          onClick={() => setColorTheme(theme.id)}
                          className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                            selectedTheme === theme.id 
                              ? 'border-2 shadow-md' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          style={{
                            borderColor: selectedTheme === theme.id ? theme.colors.primary : undefined,
                            backgroundColor: selectedTheme === theme.id ? `${theme.colors.primary}08` : 'white'
                          }}
                        >
                          <div className="text-center">
                            <div className="flex justify-center space-x-1 mb-3">
                              <div 
                                className="w-6 h-6 rounded-full border border-gray-200" 
                                style={{ backgroundColor: theme.colors.primary }}
                              ></div>
                              <div 
                                className="w-6 h-6 rounded-full border border-gray-200" 
                                style={{ backgroundColor: theme.colors.primaryLight }}
                              ></div>
                              <div 
                                className="w-6 h-6 rounded-full border border-gray-200" 
                                style={{ backgroundColor: theme.colors.secondary }}
                              ></div>
                            </div>
                            <h4 className="font-semibold text-sm text-gray-900 mb-1">{theme.displayName}</h4>
                            <p className="text-xs text-gray-500 mb-2">{theme.category}</p>
                            
                            {/* Sample gradient button */}
                            <div 
                              className="w-full h-8 rounded-md flex items-center justify-center text-white text-xs font-medium transition-all"
                              style={{ background: theme.colors.gradient }}
                            >
                              Sample
                            </div>
                            
                            {/* Selection indicator */}
                            <div className="flex justify-center mt-2">
                              <div 
                                className={`w-4 h-4 rounded-full border-2 transition-colors ${
                                  selectedTheme === theme.id 
                                    ? 'border-2' 
                                    : 'border-gray-300'
                                }`}
                                style={{
                                  borderColor: selectedTheme === theme.id ? theme.colors.primary : undefined,
                                  backgroundColor: selectedTheme === theme.id ? theme.colors.primary : 'transparent'
                                }}
                              >
                                {selectedTheme === theme.id && (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-green-900">Theme changes apply instantly</p>
                        <p className="text-xs text-green-700 mt-1">Your color theme will be applied across the entire website including buttons, links, and accents.</p>
                      </div>
                    </div>
                  </div>
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
