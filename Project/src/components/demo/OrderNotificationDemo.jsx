import { useState } from 'react'
import { useNotificationHelpers } from '../../hooks/useNotificationHelpers'
import { useNotifications } from '../../contexts/NotificationContext'

const OrderNotificationDemo = () => {
  const [demoOrderId, setDemoOrderId] = useState('ORD-2024-DEMO01')
  const [currentStatusIndex, setCurrentStatusIndex] = useState(-1)
  const { 
    notifyOrderPlaced,
    notifyOrderConfirmed,
    notifyOrderAssigned,
    notifyStitchingCompleted,
    notifyOrderPacked,
    notifyOrderShipped,
    notifyOrderDelivered,
    handleOrderStatusChange
  } = useNotificationHelpers()
  
  const { notifications, unreadCount } = useNotifications()

  const statusFlow = [
    {
      key: 'placed',
      label: 'Order Placed',
      icon: '📋',
      description: 'Order has been placed and payment confirmed',
      notifyFunction: () => notifyOrderPlaced(demoOrderId, { amount: '₹2,500', items: 2 })
    },
    {
      key: 'confirmed',
      label: 'Order Confirmed',
      icon: '✅',
      description: 'Order confirmed by admin and ready for processing',
      notifyFunction: () => notifyOrderConfirmed(demoOrderId)
    },
    {
      key: 'assigned',
      label: 'Assigned to Tailor',
      icon: '👨‍🎨',
      description: 'Order assigned to a skilled tailor',
      notifyFunction: () => notifyOrderAssigned(demoOrderId, {
        tailorInfo: {
          firstName: 'Selvi',
          lastName: 'K',
          phone: '6374367712'
        }
      })
    },
    {
      key: 'completed',
      label: 'Stitching Completed',
      icon: '👕',
      description: 'Tailoring work completed and ready for packing',
      notifyFunction: () => notifyStitchingCompleted(demoOrderId, 'Dec 25, 2024')
    },
    {
      key: 'packed',
      label: 'Packed',
      icon: '📦',
      description: 'Order packed and ready for shipment',
      notifyFunction: () => notifyOrderPacked(demoOrderId, `DT${Date.now().toString().slice(-6)}`)
    },
    {
      key: 'shipped',
      label: 'Out for Delivery',
      icon: '🚚',
      description: 'Order shipped and on the way to customer',
      notifyFunction: () => notifyOrderShipped(demoOrderId, `DT${Date.now().toString().slice(-6)}`)
    },
    {
      key: 'delivered',
      label: 'Delivered',
      icon: '🎉',
      description: 'Order successfully delivered to customer',
      notifyFunction: () => notifyOrderDelivered(demoOrderId)
    }
  ]

  const triggerNextStatus = () => {
    const nextIndex = currentStatusIndex + 1
    if (nextIndex < statusFlow.length) {
      const status = statusFlow[nextIndex]
      status.notifyFunction()
      setCurrentStatusIndex(nextIndex)
    }
  }

  const triggerSpecificStatus = (index) => {
    if (index < statusFlow.length) {
      const status = statusFlow[index]
      status.notifyFunction()
      setCurrentStatusIndex(index)
    }
  }

  const triggerAllStatuses = async () => {
    for (let i = 0; i < statusFlow.length; i++) {
      setTimeout(() => {
        statusFlow[i].notifyFunction()
        setCurrentStatusIndex(i)
      }, i * 1000) // 1 second delay between each notification
    }
  }

  const resetDemo = () => {
    setCurrentStatusIndex(-1)
    setDemoOrderId(`ORD-2024-DEMO${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`)
  }

  const testOrderStatusChangeHandler = () => {
    const testStatuses = ['placed', 'assigned', 'completed', 'packed', 'shipped', 'delivered']
    testStatuses.forEach((status, index) => {
      setTimeout(() => {
        const additionalInfo = {}
        
        if (status === 'assigned') {
          additionalInfo.tailorInfo = { firstName: 'Ravi', lastName: 'M', phone: '9876543210' }
        } else if (status === 'completed') {
          additionalInfo.estimatedDelivery = 'Dec 28, 2024'
        } else if (status === 'packed' || status === 'shipped') {
          additionalInfo.trackingNumber = `TEST${Date.now().toString().slice(-6)}`
        }
        
        handleOrderStatusChange(`TEST-${Date.now()}`, status, additionalInfo)
      }, index * 800)
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Order Notification Testing</h2>
        <p className="text-gray-600">
          Test the complete order notification flow. Click buttons to simulate order status changes
          and check the notification bell in the header.
        </p>
      </div>

      {/* Demo Controls */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Demo Controls</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Demo Order ID</label>
            <input
              type="text"
              value={demoOrderId}
              onChange={(e) => setDemoOrderId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={triggerNextStatus}
              disabled={currentStatusIndex >= statusFlow.length - 1}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Next Status
            </button>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={triggerAllStatuses}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              All Statuses
            </button>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={resetDemo}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Reset Demo
            </button>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={testOrderStatusChangeHandler}
            className="px-6 py-3 text-white rounded-lg font-medium transition-all"
            style={{ background: 'var(--theme-gradient)' }}
          >
            🔄 Test Status Change Handler
          </button>
        </div>
      </div>

      {/* Status Flow Visualization */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Flow</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statusFlow.map((status, index) => (
            <div
              key={status.key}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                index === currentStatusIndex
                  ? 'border-purple-500 bg-purple-50 shadow-md'
                  : index < currentStatusIndex
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm'
              }`}
              onClick={() => triggerSpecificStatus(index)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                  index === currentStatusIndex
                    ? 'bg-purple-500 text-white animate-pulse'
                    : index < currentStatusIndex
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {index < currentStatusIndex ? '✓' : status.icon}
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${
                    index <= currentStatusIndex ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {status.label}
                  </h4>
                  <p className="text-sm text-gray-600">{status.description}</p>
                  {index === currentStatusIndex && (
                    <span className="inline-block mt-1 px-2 py-1 bg-purple-500 text-white text-xs rounded-full">
                      Current
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">📊 Notification Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{notifications.length}</div>
            <div className="text-sm text-blue-700">Total Notifications</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
            <div className="text-sm text-red-700">Unread</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{notifications.length - unreadCount}</div>
            <div className="text-sm text-green-700">Read</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{currentStatusIndex + 1}</div>
            <div className="text-sm text-purple-700">Demo Progress</div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">🔔 Testing Instructions</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Click individual status boxes to trigger specific notifications</li>
          <li>• Use "Next Status" to progress through the flow step by step</li>
          <li>• Use "All Statuses" to simulate the complete order journey</li>
          <li>• Check the notification bell in the header for new notifications</li>
          <li>• Click notifications to navigate to order details</li>
          <li>• Use the Status Change Handler to test the unified notification system</li>
        </ul>
      </div>
    </div>
  )
}

export default OrderNotificationDemo