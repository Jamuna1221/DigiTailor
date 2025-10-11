import { useState } from 'react'
import { useNotificationHelpers } from '../hooks/useNotificationHelpers'
import { useNotifications } from '../contexts/NotificationContext'

const NotificationTest = () => {
  const [testOrderId, setTestOrderId] = useState('ORD-2024-TEST01')
  const { 
    notifyOrderPlaced,
    notifyOrderAssigned,
    notifyStitchingCompleted,
    notifyOrderPacked,
    notifyOrderShipped,
    notifyOrderDelivered,
    handleOrderStatusChange
  } = useNotificationHelpers()
  
  const { notifications, unreadCount } = useNotifications()

  const orderStatuses = [
    {
      status: 'placed',
      label: 'Order Placed',
      message: 'Your order has been placed successfully.',
      icon: '📋',
      color: 'bg-blue-500',
      action: () => notifyOrderPlaced(testOrderId)
    },
    {
      status: 'assigned',
      label: 'Assigned to Tailor',
      message: 'Your order has been assigned to Selvi K.',
      icon: '👨‍🎨',
      color: 'bg-purple-500',
      action: () => notifyOrderAssigned(testOrderId, { firstName: 'Selvi', lastName: 'K' })
    },
    {
      status: 'completed',
      label: 'Stitching Completed',
      message: 'Your stitching is completed.',
      icon: '👕',
      color: 'bg-indigo-500',
      action: () => notifyStitchingCompleted(testOrderId)
    },
    {
      status: 'packed',
      label: 'Order Packed',
      message: 'Your order has been packed.',
      icon: '📦',
      color: 'bg-orange-500',
      action: () => notifyOrderPacked(testOrderId)
    },
    {
      status: 'shipped',
      label: 'Out for Delivery',
      message: 'Your order is out for delivery.',
      icon: '🚚',
      color: 'bg-blue-600',
      action: () => notifyOrderShipped(testOrderId)
    },
    {
      status: 'delivered',
      label: 'Delivered',
      message: 'Your order has been delivered.',
      icon: '🎉',
      color: 'bg-green-500',
      action: () => notifyOrderDelivered(testOrderId)
    }
  ]

  const testAllNotifications = () => {
    orderStatuses.forEach((status, index) => {
      setTimeout(() => {
        status.action()
      }, index * 1000) // 1 second intervals
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔔 Notification System Test
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Test the LinkedIn-style order notification system. Click any button below to trigger a notification 
            and check the notification bell in the header.
          </p>
        </div>

        {/* Current Status */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">📊 Current Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">{notifications.length}</div>
              <div className="text-sm text-gray-600">Total Notifications</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600">{unreadCount}</div>
              <div className="text-sm text-gray-600">Unread</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">{notifications.length - unreadCount}</div>
              <div className="text-sm text-gray-600">Read</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">{testOrderId}</div>
              <div className="text-sm text-gray-600">Test Order ID</div>
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">🎮 Test Controls</h2>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Test Order ID</label>
              <input
                type="text"
                value={testOrderId}
                onChange={(e) => setTestOrderId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter order ID for testing"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={testAllNotifications}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 transform hover:scale-105"
              >
                🚀 Test All Notifications
              </button>
            </div>
          </div>

          {/* Individual Status Tests */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orderStatuses.map((status) => (
              <div key={status.status} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-12 h-12 ${status.color} rounded-full flex items-center justify-center text-white text-xl`}>
                    {status.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{status.label}</h3>
                    <p className="text-sm text-gray-600">{status.message}</p>
                  </div>
                </div>
                <button
                  onClick={status.action}
                  className={`w-full ${status.color} text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity font-medium`}
                >
                  Trigger Notification
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Features Information */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-purple-900 mb-4">✨ Notification Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-purple-800 mb-3">🔔 LinkedIn-Style UI</h3>
              <ul className="space-y-2 text-purple-700">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  Bell icon with red badge for unread count
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  Dropdown panel with notification list
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  Purple theme for unread notifications
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  Gray theme for read notifications
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-purple-800 mb-3">🚀 Real-time Features</h3>
              <ul className="space-y-2 text-purple-700">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  Instant notification updates
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  Click to navigate to order details
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  Persistent storage (localStorage)
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  Mark as read/unread functionality
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
            <p className="text-yellow-800">
              <strong>🧪 How to Test:</strong> Click any notification button above, then check the bell icon in the header. 
              The badge will show the unread count, and clicking the bell will show your notifications in a LinkedIn-style dropdown.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationTest