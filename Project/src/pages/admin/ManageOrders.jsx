// src/pages/admin/ManageOrders.jsx
import { useState, useEffect } from 'react'

// Utility function for status colors
const getStatusColor = (status) => {
  switch (status) {
    case 'placed': return 'bg-yellow-200 text-yellow-900';
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

function ManageOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [stats, setStats] = useState(null)

useEffect(() => {
  const fetchAll = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) return
      // Orders
      const ordersRes = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/admin/all`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
      })
      const ordersJson = await ordersRes.json()
      if (ordersJson.success) setOrders(ordersJson.data)
      // Analytics summary
      const statsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/analytics/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const statsJson = await statsRes.json()
      if (statsJson.success) setStats(statsJson.data)
    } catch (error) {
      console.error('Error fetching orders/analytics:', error)
    } finally {
      setLoading(false)
    }
  }
  fetchAll()
}, [])



  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-gray-600">Loading orders...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Orders</h1>
        <p className="text-gray-600">View and manage all customer orders with tailor assignments</p>
      </div>
      {/* Analytics summary */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border p-4">
            <div className="text-xs text-gray-500">Today Income</div>
            <div className="text-2xl font-bold">₹{stats.daily.income.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Orders: {stats.daily.orders}</div>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <div className="text-xs text-gray-500">This Week</div>
            <div className="text-2xl font-bold">₹{stats.weekly.income.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Orders: {stats.weekly.orders}</div>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <div className="text-xs text-gray-500">This Month</div>
            <div className="text-2xl font-bold">₹{stats.monthly.income.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Orders: {stats.monthly.orders}</div>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <div className="text-xs text-gray-500">This Year</div>
            <div className="text-2xl font-bold">₹{stats.annual.income.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Orders: {stats.annual.orders}</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow border">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 mr-3">Filter by status:</span>
          {['all', 'pending', 'assigned', 'in_progress', 'ready', 'delivered'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.replace('_', ' ').toUpperCase()} 
              {status === 'all' ? ` (${orders.length})` : ` (${orders.filter(o => o.status === status).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Tailor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">#{order.orderNumber || order.orderId || order._id?.slice(-8)}</div>
                      <div className="text-sm text-gray-500">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.userId ? `${order.userId.firstName || ''} ${order.userId.lastName || ''}`.trim() : (order.customerInfo?.name || order.shippingInfo?.fullName || 'N/A')}
                      </div>
                      <div className="text-sm text-gray-500">{order.userId?.email || order.customerInfo?.email || order.shippingInfo?.email || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{order.shippingInfo?.phone || order.customerInfo?.phone || 'N/A'}</div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.assignedTailor ? (
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {`${order.assignedTailor.firstName || ''} ${order.assignedTailor.lastName || ''}`.trim() || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">{order.assignedTailor.email || 'N/A'}</div>
                      </div>
                    ) : (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Unassigned
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {(order.status || '').replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{Number(order.pricing?.total || order.totalPrice || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No orders found for the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageOrders
