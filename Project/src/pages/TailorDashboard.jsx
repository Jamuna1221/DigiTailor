import { useState, useEffect, useCallback } from 'react' // ✅ Add useCallback
import { useNavigate } from 'react-router-dom'

function TailorDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    todaysOrders: 0
  })
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('all')

  const statusColors = {
    placed: 'bg-blue-100 text-blue-800',
    confirmed: 'bg-green-100 text-green-800',
    assigned: 'bg-purple-100 text-purple-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-indigo-100 text-indigo-800',
    packed: 'bg-orange-100 text-orange-800',
    shipped: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800'
  }

  // Categories matching your signup form
  const categoryIcons = {
    men: '👨',
    women: '👩',
    kids: '👶',
    bridal: '👰',
    dress: '👗',
    blouse: '👚',
    saree: '🥻',
    kurta: '👘',
    shirt: '👔',
    pants: '👖',
    suit: '🤵'
  }

  const calculateStats = (orders) => {
    const today = new Date().toDateString()
    setStats({
      totalOrders: orders.length,
      activeOrders: orders.filter(order => 
        ['assigned', 'in_progress', 'completed', 'packed'].includes(order.status)
      ).length,
      completedOrders: orders.filter(order => order.status === 'shipped').length,
      todaysOrders: orders.filter(order => 
        new Date(order.createdAt).toDateString() === today
      ).length
    })
  }

  // ✅ Wrap fetchTailorOrders with useCallback
  const fetchTailorOrders = useCallback(async (tailorId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/orders/tailor/${tailorId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(data.data || [])
        calculateStats(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching tailor orders:', error)
    } finally {
      setLoading(false)
    }
  }, []) // ✅ Empty dependency array since it doesn't depend on any props or state

  // ✅ Now useEffect can safely include fetchTailorOrders
  useEffect(() => {
    // Check if user is tailor
    const savedUser = localStorage.getItem('digitailor_user')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      if (userData.role !== 'tailor') {
        alert('Access denied. This page is for tailors only.')
        navigate('/')
        return
      }
      setUser(userData)
      fetchTailorOrders(userData.id || userData._id)
    } else {
      navigate('/login')
    }
  }, [navigate, fetchTailorOrders]) // ✅ Include fetchTailorOrders in dependencies

  // ✅ Also wrap updateOrderStatus for consistency
  const updateOrderStatus = useCallback(async (orderId, newStatus, notes = '') => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/orders/tailor/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus,
          tailorNotes: notes
        })
      })

      if (response.ok) {
        alert('Order status updated successfully!')
        if (user) {
          fetchTailorOrders(user.id || user._id)
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Failed to update order status')
    }
  }, [user, fetchTailorOrders]) // ✅ Dependencies: user and fetchTailorOrders

  const handleStatusUpdate = useCallback((orderId, currentStatus) => {
    const statusFlow = {
      assigned: 'in_progress',
      in_progress: 'completed',
      completed: 'packed',
      packed: 'shipped'
    }

    const nextStatus = statusFlow[currentStatus]
    if (nextStatus) {
      const confirmMessage = `Update order status to "${nextStatus.replace('_', ' ')}"?`
      if (window.confirm(confirmMessage)) {
        updateOrderStatus(orderId, nextStatus)
      }
    }
  }, [updateOrderStatus])

  // Rest of your component remains exactly the same...
  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : selectedStatus === 'shipped'
    ? orders.filter(order => order.status === 'shipped' || order.status === 'delivered')
    : orders.filter(order => order.status === selectedStatus)

  // Get tailor's specializations from user profile
  // const getSpecializationBadges = () => {
  //   if (!user?.tailorProfile?.specialties) return null
    
  //   return user.tailorProfile.specialties.map(specialty => (
  //     <span key={specialty} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mr-2 mb-2">
  //       <span className="mr-1">{categoryIcons[specialty.toLowerCase()] || '🎯'}</span>
  //       {specialty.charAt(0).toUpperCase() + specialty.slice(1)}
  //     </span>
  //   ))
  // }

  

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/')}
                className="text-purple-600 hover:text-purple-800"
              >
                ← Back to Home
              </button>
              <h1 className="ml-4 text-2xl font-bold text-gray-900">Tailor Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.firstName} {user?.lastName}</span>
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.firstName?.[0]}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tailor Profile Card */}
        <div className="bg-white rounded-lg shadow mb-8 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-gray-600">{user?.email}</p>
                  <p className="text-gray-600">{user?.phone}</p>
                </div>
              </div>
            </div>
            {/* <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Specializations:</h4>
              <div className="flex flex-wrap">
                {getSpecializationBadges()}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Experience:</span>
                  <p className="font-medium">{user?.tailorProfile?.experience || 0} years</p>
                </div>
                <div>
                  <span className="text-gray-600">Rating:</span>
                  <p className="font-medium">
                    {'⭐'.repeat(Math.floor(user?.tailorProfile?.rating || 0))} 
                    {user?.tailorProfile?.rating || 'No ratings yet'}
                  </p>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Active Orders</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.activeOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Completed</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.completedOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">📅</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Today</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.todaysOrders}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { key: 'all', label: 'All Orders', count: orders.length },
                { key: 'assigned', label: 'New Assignments', count: orders.filter(o => o.status === 'assigned').length },
                { key: 'in_progress', label: 'Working On', count: orders.filter(o => o.status === 'in_progress').length },
                { key: 'completed', label: 'Ready to Pack', count: orders.filter(o => o.status === 'completed').length },
                { key: 'shipped', label: 'Completed Orders', count: orders.filter(o => o.status === 'shipped' || o.status === 'delivered').length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedStatus(tab.key)}
                  className={`${
                    selectedStatus === tab.key
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  {tab.label}
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              {selectedStatus === 'all' ? 'All Orders' : `${selectedStatus.replace('_', ' ')} Orders`}
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <span className="text-4xl block mb-4">
                  {selectedStatus === 'assigned' ? '🎯' : 
                   selectedStatus === 'in_progress' ? '✂️' : 
                   selectedStatus === 'completed' ? '📦' : 
                   selectedStatus === 'shipped' ? '✅' : '📋'}
                </span>
                <p className="text-lg font-medium mb-2">
                  {selectedStatus === 'assigned' ? 'No new assignments' :
                   selectedStatus === 'in_progress' ? 'No orders in progress' :
                   selectedStatus === 'completed' ? 'No orders ready to pack' :
                   selectedStatus === 'shipped' ? 'No completed orders' :
                   'No orders found'}
                </p>
                <p className="text-sm">
                  {selectedStatus === 'assigned' ? 'New orders will appear here when assigned to you.' :
                   selectedStatus === 'in_progress' ? 'Start working on assigned orders.' :
                   selectedStatus === 'completed' ? 'Complete your current orders.' :
                   selectedStatus === 'shipped' ? 'Shipped and delivered orders will appear here.' :
                   'Orders will appear here once assigned to you.'}
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order._id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          Order #{order.orderId}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                          {order.status === 'assigned' ? 'NEW ASSIGNMENT' :
                           order.status === 'in_progress' ? 'WORKING ON' :
                           order.status === 'completed' ? 'READY TO PACK' :
                           order.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>📅 Placed: {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p>💰 Total: ₹{order.pricing?.total?.toLocaleString()}</p>
                        <p>📋 Items: {order.items?.length} items</p>
                        {order.estimatedDelivery && (
                          <p className="text-red-600 font-medium">
                            🚚 Due: {new Date(order.estimatedDelivery).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      {/* Order Items with Category Icons */}
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Items to Stitch:</p>
                        <div className="space-y-1">
                          {order.items?.map((item, index) => (
                            <a
                            key={index}
                            href={`/product/${item.productId}`} // ✅ link to product details page
                             className="flex items-center space-x-2 text-sm text-gray-600 hover:bg-gray-50 p-2 rounded transition"
                            >
                            <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                              <span className="text-lg">
                                {categoryIcons[item.category?.toLowerCase()] || '🎯'}
                              </span>
                              <span className="font-medium">{item.name}</span>
                              <span className="text-gray-400">x{item.quantity}</span>
                              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                                {item.category}
                              </span>
                              {item.price && (
                                <span className="text-green-600 font-medium">₹{item.price}</span>
                              )}
                            </div>
                            </a>
                          ))}
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700">Customer Details:</p>
                        <div className="text-sm text-gray-600 mt-1">
                          <p>👤 {order.shippingInfo?.fullName}</p>
                          <p>📧 {order.shippingInfo?.email}</p>
                          <p>📱 {order.shippingInfo?.phone}</p>
                          <p>📍 {order.shippingInfo?.address?.city}, {order.shippingInfo?.address?.state}</p>
                          {order.shippingInfo?.specialInstructions && (
                            <p className="mt-2 p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                              <span className="font-medium">Special Instructions:</span> {order.shippingInfo.specialInstructions}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="ml-6 flex flex-col space-y-2">
                      {order.status === 'assigned' && (
                        <button
                          onClick={() => handleStatusUpdate(order._id, order.status)}
                          className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-700 font-medium"
                        >
                          ✂️ Start Stitching
                        </button>
                      )}
                      
                      {order.status === 'in_progress' && (
                        <button
                          onClick={() => handleStatusUpdate(order._id, order.status)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 font-medium"
                        >
                          ✅ Mark Complete
                        </button>
                      )}
                      
                      {order.status === 'completed' && (
                        <button
                          onClick={() => handleStatusUpdate(order._id, order.status)}
                          className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700 font-medium"
                        >
                          📦 Pack Order
                        </button>
                      )}
                      
                      {order.status === 'packed' && (
                        <button
                          onClick={() => handleStatusUpdate(order._id, order.status)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 font-medium"
                        >
                          🚚 Ship Order
                        </button>
                      )}                      
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TailorDashboard
