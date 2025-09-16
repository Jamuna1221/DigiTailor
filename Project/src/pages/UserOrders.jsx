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
  const [isLoading, setIsLoading] = useState(true) // ✅ Renamed to be used
 // At the top of your component
const navigate = useNavigate()
  // ✅ Use useCallback to fix dependency warning
  const fetchUserOrders = useCallback(async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        console.log('No token found')
        return
      }

      const response = await fetch('http://localhost:5000/api/orders/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(data.data || [])
      } else {
        console.error('Failed to fetch orders:', response.status)
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

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              📦
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
            <button
              onClick={() => window.location.href = '/catalog'}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
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
          </div>
        )}
      </div>
    </div>
  )
}

// ✅ Default export to fix Fast Refresh warning
export default UserOrders
