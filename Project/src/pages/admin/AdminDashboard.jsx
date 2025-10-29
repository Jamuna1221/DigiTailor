import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalDesigns: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalGalleryItems: 0,
    activeUsers: 0
  })
  
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const token = localStorage.getItem('token')

        const headers = {
          'Content-Type': 'application/json'
        }
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }
        
        // Fetch dashboard statistics
        const [statsResponse, ordersResponse, analyticsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/admin/dashboard/stats`, { headers }),
          fetch(`${API_BASE_URL}/admin/dashboard/recent-orders?limit=5`, { headers }),
          fetch(`${API_BASE_URL}/analytics/dashboard`, { headers })
        ])
        
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          if (statsData.success) {
            setStats(statsData.data)
          }
        }
        
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json()
          if (ordersData.success) {
            setRecentOrders(ordersData.data)
          }
        }
        
        if (analyticsResponse.ok) {
          const a = await analyticsResponse.json()
          if (a.success) setAnalytics(a.data)
        }
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const quickActions = [
    { name: 'Add New Design', href: '/admin/catalog', icon: '➕', color: 'bg-blue-500' },
    { name: 'Add Gallery Item', href: '/admin/gallery', icon: '🖼️', color: 'bg-green-500' },
    { name: 'View Orders', href: '/admin/orders', icon: '📦', color: 'bg-yellow-500' },
    { name: 'Manage Users', href: '/admin/users', icon: '👥', color: 'bg-purple-500' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <p className="ml-3 text-gray-600">Loading dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-2">⚠️</div>
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white p-6">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Admin! 👋</h1>
        <p className="text-blue-100">Here's what's happening with your DigiTailor business today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <span className="text-2xl">👗</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Designs</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDesigns}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100">
              <span className="text-2xl">📦</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100">
              <span className="text-2xl">💳</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Avg Order Value (MTD)</h3>
              <p className="text-2xl font-bold text-gray-900">
                ₹{(analytics?.monthly?.completedOrders
                  ? Math.round(analytics.monthly.income / analytics.monthly.completedOrders)
                  : 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <span className="text-2xl">🎨</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Gallery Items</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.totalGalleryItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Insight widgets */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Donut: Today Income vs Expense */}
          <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-6">
            {(() => {
              const inc = analytics.daily.income || 0
              const exp = analytics.daily.expenses || 0
              const total = Math.max(inc + exp, 1)
              const deg = Math.round((inc / total) * 360)
              return (
                <div className="w-24 h-24 rounded-full" style={{ background: `conic-gradient(#10b981 0deg ${deg}deg, #ef4444 ${deg}deg 360deg)` }} />
              )
            })()}
            <div>
              <div className="text-sm text-gray-500 mb-1">Today</div>
              <div className="text-sm">Income: <span className="font-semibold text-emerald-600">₹{analytics.daily.income.toLocaleString()}</span></div>
              <div className="text-sm">Expenses: <span className="font-semibold text-rose-600">₹{analytics.daily.expenses.toLocaleString()}</span></div>
              <div className="text-sm">Profit: <span className={`font-semibold ${analytics.daily.profit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>₹{analytics.daily.profit.toLocaleString()}</span></div>
            </div>
          </div>
          {/* Mini bars: Orders overview */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="text-sm font-medium text-gray-700 mb-3">Orders Overview</div>
            <div className="space-y-2">
              {['daily','weekly','monthly','annual'].map(k => (
                <div key={k} className="flex items-center gap-3 text-sm">
                  <div className="w-16 capitalize text-gray-600">{k}</div>
                  <div className="flex-1 bg-gray-100 h-2 rounded">
                    <div className="h-2 bg-blue-600 rounded" style={{ width: `${Math.min(100, (analytics[k].orders || 0) / Math.max(1, analytics.monthly.orders || 1) * 100)}%` }} />
                  </div>
                  <div className="w-10 text-right font-medium">{analytics[k].orders}</div>
                </div>
              ))}
            </div>
          </div>
          {/* KPI: Profit trend */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="text-sm text-gray-500">Monthly Profit</div>
            <div className={`text-3xl font-bold ${analytics.monthly.profit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>₹{analytics.monthly.profit.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">Income ₹{analytics.monthly.income.toLocaleString()} • Expenses ₹{analytics.monthly.expenses.toLocaleString()}</div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
              className="flex flex-col items-center p-4 rounded-lg border hover:shadow-md transition-shadow"
            >
              <div className={`p-3 rounded-full ${action.color} text-white mb-2`}>
                <span className="text-xl">{action.icon}</span>
              </div>
              <span className="text-sm font-medium text-gray-900 text-center">{action.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <Link to="/admin/orders" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No recent orders to display</p>
              <p className="text-sm mt-2">Orders will appear here once customers start placing them.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="py-3 text-sm font-medium text-gray-900">
                      #{order.orderId || order._id.slice(-8)}
                    </td>
                    <td className="py-3 text-sm text-gray-900">{order.customerName}</td>
                    <td className="py-3 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Dispatched' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Completed' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-sm font-medium text-gray-900">
                      ₹{order.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
