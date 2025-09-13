// src/pages/TailorDashboard.jsx
import { useState, useEffect } from 'react'

// Utility function for status colors
const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'assigned': return 'bg-blue-100 text-blue-800'
    case 'in_progress': return 'bg-indigo-100 text-indigo-800'
    case 'quality_check': return 'bg-purple-100 text-purple-800'
    case 'ready': return 'bg-green-100 text-green-800'
    case 'delivered': return 'bg-green-600 text-white'
    case 'cancelled': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function TailorDashboard({ tailorId }) {
  const [assignedOrders, setAssignedOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    const fetchAssignedOrders = async () => {
      if (!tailorId) return
      
      try {
        setLoading(true)
        const response = await fetch(`http://localhost:5000/api/orders/tailor/${tailorId}`)
        const data = await response.json()
        if (data.success) {
          setAssignedOrders(data.data)
        }
      } catch (error) {
        console.error('Error fetching assigned orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAssignedOrders()
  }, [tailorId])

  const updateOrderStatus = async (orderId, newStatus, notes = '') => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/tailor/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, tailorNotes: notes })
      })
      
      if (response.ok) {
        // Update local state
        setAssignedOrders(orders => 
          orders.map(order => 
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        )
        console.log('✅ Order status updated')
      } else {
        console.error('Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  const filteredOrders = activeFilter === 'all' 
    ? assignedOrders 
    : assignedOrders.filter(order => order.status === activeFilter)

  const orderStats = {
    total: assignedOrders.length,
    pending: assignedOrders.filter(o => o.status === 'assigned').length,
    inProgress: assignedOrders.filter(o => o.status === 'in_progress').length,
    ready: assignedOrders.filter(o => o.status === 'ready').length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-gray-600">Loading your assigned orders...</p>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
        <p className="text-gray-600">Manage your assigned tailoring orders and track progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
              <p className="text-2xl font-bold text-gray-900">{orderStats.total}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500">Pending</h3>
              <p className="text-2xl font-bold text-gray-900">{orderStats.pending}</p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
              <p className="text-2xl font-bold text-gray-900">{orderStats.inProgress}</p>
            </div>
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500">Ready</h3>
              <p className="text-2xl font-bold text-gray-900">{orderStats.ready}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 mr-3">Filter orders:</span>
          {['all', 'assigned', 'in_progress', 'quality_check', 'ready'].map(status => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All Orders' : status.replace('_', ' ').toUpperCase()}
              {status === 'all' 
                ? ` (${assignedOrders.length})`
                : ` (${assignedOrders.filter(o => o.status === status).length})`
              }
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">
            {activeFilter === 'all' 
              ? 'You have no assigned orders at the moment.' 
              : `No orders with ${activeFilter.replace('_', ' ')} status.`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map(order => (
            <div key={order._id} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Information */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Order #{order.orderNumber}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Customer:</span>
                      <p className="text-gray-900">{order.customer.name}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Phone:</span>
                      <p className="text-gray-900">{order.customer.phone}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Order Date:</span>
                      <p className="text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <span className="text-sm font-medium text-gray-700 block mb-2">Items:</span>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-600">{item.category}</p>
                              {item.customization?.size && (
                                <p className="text-xs text-blue-600 mt-1">
                                  Size: {item.customization.size}
                                </p>
                              )}
                              {item.customization?.specialInstructions && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Instructions: {item.customization.specialInstructions}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">₹{item.price}</p>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-3">
                  <h4 className="font-medium text-gray-900 mb-2">Update Status:</h4>
                  
                  {order.status === 'assigned' && (
                    <button 
                      onClick={() => updateOrderStatus(order._id, 'in_progress')}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-6h.01M6 6h.01M6 18h.01M18 18h.01M18 6h.01" />
                      </svg>
                      Start Working
                    </button>
                  )}

                  {order.status === 'in_progress' && (
                    <button 
                      onClick={() => updateOrderStatus(order._id, 'quality_check')}
                      className="w-full bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Send for Quality Check
                    </button>
                  )}

                  {order.status === 'quality_check' && (
                    <button 
                      onClick={() => updateOrderStatus(order._id, 'ready')}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Mark as Ready
                    </button>
                  )}

                  {order.status === 'ready' && (
                    <div className="w-full bg-green-100 text-green-800 py-3 px-4 rounded-lg text-center font-medium">
                      ✅ Order Ready for Delivery
                    </div>
                  )}

                  {/* Contact Customer */}
                  <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                    📞 Contact Customer
                  </button>

                  {/* View Order Details */}
                  <button className="w-full border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                    👁️ View Full Details
                  </button>
                </div>
              </div>

              {/* Estimated Delivery */}
              {order.estimatedDelivery && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    <strong>Estimated Delivery:</strong> {new Date(order.estimatedDelivery).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TailorDashboard
