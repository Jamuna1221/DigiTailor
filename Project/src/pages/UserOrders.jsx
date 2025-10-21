import { useState, useEffect, useCallback } from 'react'
 import { useNavigate } from 'react-router-dom'
// ✅ Helper function defined outside component
const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-purple-100 text-purple-800',
    'ready-for-pickup': 'bg-green-100 text-green-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

function UserOrders() {
  const [orders, setOrders] = useState([])
  const [modularOrders, setModularOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all') // all, regular, modular
  const navigate = useNavigate()
  // Fetch both regular and modular orders
  const fetchUserOrders = useCallback(async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        console.log('No token found')
        return
      }

      // Fetch regular orders
      const regularResponse = await fetch('http://localhost:5000/api/orders/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      // Fetch modular orders
      const modularResponse = await fetch('http://localhost:5000/api/modular-orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (regularResponse.ok) {
        const data = await regularResponse.json()
        setOrders(data.data || [])
      }

      if (modularResponse.ok) {
        const data = await modularResponse.json()
        setModularOrders(data.data || [])
      }

    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUserOrders()
  }, [fetchUserOrders]) // ✅ Fixed dependency

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatPrice = (price) => {
    return `₹${price.toLocaleString()}`
  }

  // ✅ Use isLoading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Track and manage your tailoring orders</p>
        </div>

        {/* Order Type Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Orders ({orders.length + modularOrders.length})
              </button>
              <button
                onClick={() => setActiveTab('regular')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'regular'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Regular Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('modular')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'modular'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Custom Design Orders ({modularOrders.length})
              </button>
            </nav>
          </div>
        </div>

        {orders.length === 0 && modularOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              📦
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => window.location.href = '/catalog'}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Browse Catalog
              </button>
              <button
                onClick={() => window.location.href = '/custom-studio'}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Custom Design Studio
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Regular Orders */}
            {(activeTab === 'all' || activeTab === 'regular') && orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order._id.slice(-6)}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 py-2 border-b border-gray-100 last:border-b-0">
                        <img
                          src={item.image || 'https://via.placeholder.com/60x60?text=Item'}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                          <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 text-sm">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-2 sm:mb-0">
                      Payment: {order.payment?.method === 'cod' ? 'Cash on Delivery' : 'Online'}
                      {order.payment?.method === 'cod' && (
                        <span className="text-orange-600 ml-1">(+COD charges)</span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-purple-600">
                        Total: {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  {order.shippingInfo && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-medium text-gray-900 text-sm mb-2">Shipping Address</h5>
                      <p className="text-gray-600 text-sm">
                        {order.shippingInfo.fullName}<br/>
                        {order.shippingInfo.address?.street}<br/>
                        {order.shippingInfo.address?.city}, {order.shippingInfo.address?.state} {order.shippingInfo.address?.zipCode}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-4 flex space-x-3">
                   



// Then use this button
                 <button
                   onClick={() => navigate(`/orders/${order._id}`)}
                 className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors"
                 >
                   View Details
                </button>

                    {order.status === 'pending' && (
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to cancel this order?')) {
                            // Handle order cancellation
                          }
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Modular Orders */}
            {(activeTab === 'all' || activeTab === 'modular') && modularOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-blue-500">
                <div className="p-6">
                  {/* Order Header with Custom Design Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {order.orderId}
                        </h3>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          🎨 Custom Design
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-blue-900 text-sm mb-1">Customer Information</h5>
                    <p className="text-blue-700 text-sm">
                      {order.customerInfo.name} • {order.customerInfo.phone}
                      {order.customerInfo.email && ` • ${order.customerInfo.email}`}
                    </p>
                  </div>

                  {/* Design Elements */}
                  <div className="space-y-3 mb-4">
                    <h5 className="font-medium text-gray-900 text-sm">Selected Design Elements:</h5>
                    {order.selections.map((selection, index) => (
                      <div key={index} className="flex items-center space-x-3 py-2 border-b border-gray-100 last:border-b-0">
                        <img
                          src={selection.image || 'https://via.placeholder.com/60x60?text=Design'}
                          alt={selection.designName}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{selection.designName}</h4>
                          <p className="text-gray-600 text-xs">{selection.categoryName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 text-sm">
                            {selection.price === 0 ? 'FREE' : formatPrice(selection.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-2 sm:mb-0">
                      <span className="inline-flex items-center">
                        <span className="text-blue-600 mr-1">🎨</span>
                        Custom Design Order • {order.selections.length} elements
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Base: ₹{order.basePrice}</div>
                      <p className="text-lg font-bold text-blue-600">
                        Total: {formatPrice(order.totalPrice)}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => navigate(`/modular-orders/${order._id}`)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </button>
                    {order.status === 'pending' && (
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to cancel this custom design order?')) {
                            // Handle order cancellation
                          }
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ✅ Default export to fix Fast Refresh warning
export default UserOrders
