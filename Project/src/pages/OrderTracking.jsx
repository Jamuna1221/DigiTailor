import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function OrderTracking({ user }) {
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Generate mock orders for demonstration
  const generateMockOrders = () => {
    return [
      {
        _id: 'demo-order-001',
        status: 'delivered',
        createdAt: new Date('2024-01-15'),
        totalAmount: 2500,
        assignedTailor: { firstName: 'Selvi', lastName: 'K' },
        items: [
          { name: 'Custom Saree', quantity: 1, price: 2000 },
          { name: 'Blouse', quantity: 1, price: 500 }
        ]
      },
      {
        _id: 'demo-order-002',
        status: 'shipped',
        createdAt: new Date('2024-01-20'),
        totalAmount: 1800,
        assignedTailor: { firstName: 'Ravi', lastName: 'M' },
        items: [
          { name: 'Designer Kurti', quantity: 1, price: 1800 }
        ]
      },
      {
        _id: 'demo-order-003',
        status: 'completed',
        createdAt: new Date('2024-01-25'),
        totalAmount: 3200,
        assignedTailor: { firstName: 'Priya', lastName: 'S' },
        items: [
          { name: 'Wedding Lehenga', quantity: 1, price: 3000 },
          { name: 'Dupatta', quantity: 1, price: 200 }
        ]
      },
      {
        _id: 'demo-order-004',
        status: 'assigned',
        createdAt: new Date('2024-01-28'),
        totalAmount: 1500,
        assignedTailor: { firstName: 'Meera', lastName: 'T' },
        items: [
          { name: 'Casual Dress', quantity: 1, price: 1500 }
        ]
      },
      {
        _id: 'demo-order-005',
        status: 'placed',
        createdAt: new Date('2024-01-30'),
        totalAmount: 2200,
        items: [
          { name: 'Party Wear Saree', quantity: 1, price: 2200 }
        ]
      }
    ]
  }

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        // Fetch combined orders (regular + modular) for the logged-in user
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/user/${user.id}/combined`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setOrders(data.data)
          } else {
            setError('Failed to fetch orders')
          }
        } else if (response.status === 404) {
          // No orders found - use mock data for demonstration
          console.log('No real orders found, using demo data')
          setOrders(generateMockOrders())
        } else {
          setError('Failed to load orders')
        }
        
      } catch (error) {
        console.error('Error fetching orders:', error)
        // Use mock data for demonstration when API is not available
        console.log('API not available, using demo data')
        setOrders(generateMockOrders())
        setError(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUserOrders()
  }, [user])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-300 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Orders</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Log In</h2>
          <p className="text-gray-600 mb-8">You need to be logged in to view your orders.</p>
          <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block">
            Log In
          </Link>
        </div>
      </div>
    )
  }

  // Helper functions to categorize orders
  const isCompletedOrder = (order) => {
    return ['delivered', 'completed'].includes(order.status?.toLowerCase())
  }

  const isPendingOrder = (order) => {
    return !['delivered', 'completed'].includes(order.status?.toLowerCase())
  }

  const completedOrders = orders.filter(isCompletedOrder)
  const pendingOrders = orders.filter(isPendingOrder)
  const customOrders = orders.filter(order => order.orderType === 'modular')

  // Get filtered orders based on active tab
  const getFilteredOrders = () => {
    switch (activeTab) {
      case 'completed':
        return completedOrders
      case 'pending':
        return pendingOrders
      case 'custom':
        return customOrders
      default:
        return orders
    }
  }

  // Get tailor name from order
  const getTailorName = (order) => {
    if (order.assignedTailor) {
      return `${order.assignedTailor.firstName} ${order.assignedTailor.lastName}`
    }
    return 'Not assigned yet'
  }

  // Get status display info
  const getStatusInfo = (order) => {
    const status = order.status?.toLowerCase()
    const isCompleted = isCompletedOrder(order)
    
    if (isCompleted) {
      return {
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        borderColor: 'border-green-200',
        icon: '✅',
        label: 'Completed'
      }
    } else {
      return {
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        borderColor: 'border-orange-200',
        icon: '⏳',
        label: order.status || 'In Progress'
      }
    }
  }

  // Order Card Component
  const OrderCard = ({ order, index }) => {
    const statusInfo = getStatusInfo(order)
    
    return (
      <div 
        className="order-card bg-white rounded-2xl shadow-sm border border-gray-100 group"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="p-6">
          {/* Header with Order ID and Status */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-4">
              {/* Order Thumbnail/Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {order._id.slice(-2)}
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Order #{order._id.slice(-8)}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>📅 {new Date(order.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>🕒 {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className={`px-4 py-2 rounded-full ${statusInfo.bgColor} ${statusInfo.borderColor} border flex items-center space-x-2 transition-all duration-200`}>
              <span>{statusInfo.icon}</span>
              <span className={`font-semibold text-sm ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
            </div>
          </div>


          {/* Order Items */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Items ({order.items?.length || 0}):</h4>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {order.items?.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.name} × {item.quantity}</span>
                  <span className="font-medium text-gray-900">₹{item.price?.toLocaleString()}</span>
                </div>
              ))}
              {order.items?.length > 3 && (
                <div className="text-xs text-gray-500 text-center pt-1">
                  +{order.items.length - 3} more items
                </div>
              )}
            </div>
          </div>

          {/* Footer with Total and Action */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div>
              <span className="text-sm text-gray-500">Total Amount</span>
              <p className="text-2xl font-bold text-gray-900">₹{(order.pricing?.total || order.total || 0).toLocaleString()}</p>
            </div>
            
            <Link 
              to={`/orders/${order.orderId || order.orderNumber || order._id}`}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Your Orders
          </h1>
          <p className="text-gray-600 text-lg">Track and manage all your orders in one place</p>
        </div>

        {orders.length > 0 ? (
          <>
            {/* Modern Tab Navigation */}
            <div className="mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-2 mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { id: 'all', label: 'All Orders', count: orders.length, icon: '📋' },
                    { id: 'pending', label: 'Pending', count: pendingOrders.length, icon: '⌛' },
                    { id: 'completed', label: 'Completed', count: completedOrders.length, icon: '✅' },
                    { id: 'custom', label: 'Custom Design', count: customOrders.length, icon: '🎨' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative px-6 py-4 rounded-xl font-semibold tab-transition ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg transform scale-105'
                          : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50 hover:scale-102'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                        {tab.count > 0 && (
                          <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                            activeTab === tab.id 
                              ? 'bg-white bg-opacity-20 text-white' 
                              : 'bg-purple-100 text-purple-600'
                          }`}>
                            {tab.count}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Orders Grid */}
            <div className="animate-fade-in">
              {getFilteredOrders().length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {getFilteredOrders().map((order, index) => (
                    <OrderCard key={order._id} order={order} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-8xl mb-6">
                    {activeTab === 'completed' ? '🏆' : activeTab === 'pending' ? '⏳' : '📦'}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    No {activeTab === 'all' ? '' : activeTab} orders found
                  </h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    {activeTab === 'completed' 
                      ? "You haven't completed any orders yet." 
                      : activeTab === 'pending'
                      ? "No pending orders at the moment."
                      : "You haven't placed any orders yet. Start exploring our designs!"}
                  </p>
                  {activeTab !== 'completed' && (
                    <Link 
                      to="/catalog" 
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <span className="mr-2">🛍️</span>
                      Browse Catalog
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Summary Statistics */}
            <div className="mt-12 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Order Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600">{orders.length}</div>
                  <div className="text-sm text-blue-700 font-medium">Total Orders</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <div className="text-3xl font-bold text-orange-600">{pendingOrders.length}</div>
                  <div className="text-sm text-orange-700 font-medium">Pending Orders</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-3xl font-bold text-green-600">{completedOrders.length}</div>
                  <div className="text-sm text-green-700 font-medium">Completed Orders</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">📦</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No orders found</h2>
            <p className="text-gray-500 mb-8 text-lg max-w-md mx-auto">
              You haven't placed any orders yet. Start exploring our amazing designs!
            </p>
            <Link 
              to="/catalog" 
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="mr-2">🛍️</span>
              Browse Catalog
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderTracking
