import { useState } from 'react'
import { useNotifications } from '../../contexts/NotificationContext'

const OrderNotificationDemo = () => {
  const { addNotification } = useNotifications()
  const [loading, setLoading] = useState(false)

  const generateOrderNotifications = async () => {
    setLoading(true)
    
    const orderNotifications = [
      {
        id: `order-${Date.now()}-1`,
        title: 'Order Placed Successfully',
        message: 'Your order #DT241029001 has been placed and is being processed.',
        type: 'success',
        icon: '✅',
        timestamp: new Date(),
        category: 'order',
        actionUrl: '/orders/DT241029001'
      },
      {
        id: `order-${Date.now()}-2`,
        title: 'Tailor Assigned',
        message: 'Master tailor Priya Singh has been assigned to work on your order.',
        type: 'info',
        icon: '👨‍🎨',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        category: 'order'
      },
      {
        id: `order-${Date.now()}-3`,
        title: 'Order in Progress',
        message: 'Your custom kurti is now being crafted. Estimated completion: 5 days.',
        type: 'info',
        icon: '⚡',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        category: 'order'
      },
      {
        id: `order-${Date.now()}-4`,
        title: 'Quality Check Complete',
        message: 'Your order has passed quality inspection and is ready for shipping.',
        type: 'success',
        icon: '🔍',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        category: 'order'
      },
      {
        id: `order-${Date.now()}-5`,
        title: 'Out for Delivery',
        message: 'Your order is out for delivery. Expected delivery: Today by 6 PM.',
        type: 'warning',
        icon: '🚚',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        category: 'order'
      }
    ]

    // Add notifications with delays to show the effect
    for (let i = 0; i < orderNotifications.length; i++) {
      setTimeout(() => {
        addNotification(orderNotifications[i])
        if (i === orderNotifications.length - 1) {
          setLoading(false)
        }
      }, i * 500) // 500ms delay between each notification
    }
  }

  const generateSingleNotification = (type) => {
    const notificationTypes = {
      success: {
        title: 'Order Delivered Successfully',
        message: 'Your custom blouse has been delivered. Please confirm receipt.',
        icon: '🎉',
        type: 'success'
      },
      info: {
        title: 'Measurement Reminder',
        message: 'Please update your measurements for better fitting.',
        icon: 'ℹ️',
        type: 'info'
      },
      warning: {
        title: 'Payment Pending',
        message: 'Your COD order requires payment confirmation.',
        icon: '⚠️',
        type: 'warning'
      },
      error: {
        title: 'Delivery Failed',
        message: 'Unable to deliver your order. Please reschedule.',
        icon: '❌',
        type: 'error'
      }
    }

    const notification = {
      id: `single-${Date.now()}-${type}`,
      timestamp: new Date(),
      category: 'order',
      ...notificationTypes[type]
    }

    addNotification(notification)
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg border p-4">
        <h4 className="font-medium text-gray-900 mb-3">Order Notification Simulator</h4>
        <p className="text-sm text-gray-700 mb-4">
          Test different types of order notifications to see how they appear in your notification bell.
        </p>
        
        <div className="space-y-3">
          {/* Bulk Order Flow */}
          <div>
            <button
              onClick={generateOrderNotifications}
              disabled={loading}
              className="px-4 py-2 rounded-lg font-medium transition-all text-white disabled:opacity-50"
              style={{ background: loading ? '#6b7280' : 'var(--theme-gradient)' }}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </div>
              ) : (
                '📦 Generate Order Flow Notifications'
              )}
            </button>
            <p className="text-xs text-gray-600 mt-1">
              Simulates a complete order journey from placement to delivery
            </p>
          </div>

          {/* Individual Notification Types */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              onClick={() => generateSingleNotification('success')}
              className="px-3 py-2 bg-green-100 text-green-800 rounded-md text-sm hover:bg-green-200 transition-colors"
            >
              ✅ Success
            </button>
            <button
              onClick={() => generateSingleNotification('info')}
              className="px-3 py-2 bg-blue-100 text-blue-800 rounded-md text-sm hover:bg-blue-200 transition-colors"
            >
              ℹ️ Info
            </button>
            <button
              onClick={() => generateSingleNotification('warning')}
              className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded-md text-sm hover:bg-yellow-200 transition-colors"
            >
              ⚠️ Warning
            </button>
            <button
              onClick={() => generateSingleNotification('error')}
              className="px-3 py-2 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200 transition-colors"
            >
              ❌ Error
            </button>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-900">Test Mode</p>
            <p className="text-xs text-blue-700 mt-1">
              These are demo notifications to test the notification system. Check your notification bell (🔔) in the header to see them appear.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderNotificationDemo