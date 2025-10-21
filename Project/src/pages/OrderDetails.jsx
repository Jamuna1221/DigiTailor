import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useNotificationHelpers } from '../hooks/useNotificationHelpers'
import EnhancedReviewModal from '../components/EnhancedReviewModal'
import DeliveryStatusBanner from '../components/DeliveryStatusBanner'

function OrderDetails() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { handleOrderStatusChange } = useNotificationHelpers()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showEnhancedReview, setShowEnhancedReview] = useState(false)
  const [showAlterations, setShowAlterations] = useState(false)
  const [alterationRequest, setAlterationRequest] = useState('')

  // Order status flow
  const statusFlow = [
    { key: 'placed', label: 'Order Placed', icon: '📋', color: 'blue' },
    
    { key: 'assigned', label: 'Assigned to Tailor', icon: '👨‍🎨', color: 'purple' },
    { key: 'completed', label: 'Stitching Completed', icon: '👕', color: 'indigo' },
    { key: 'packed', label: 'Packed', icon: '📦', color: 'orange' },
    { key: 'shipped', label: 'Out for Delivery', icon: '🚚', color: 'blue' },
    { key: 'delivered', label: 'Delivered', icon: '🎉', color: 'green' }
  ]

  // ✅ Use useCallback to prevent infinite re-renders
  const fetchOrderDetails = useCallback(async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setOrder(data.data)
      } else {
        console.error('Failed to fetch order details')
      }
    } catch (error) {
      console.error('Error fetching order details:', error)
    } finally {
      setLoading(false)
    }
  }, [orderId]) // ✅ Add orderId as dependency

  // ✅ Now fetchOrderDetails is stable and can be safely added to dependencies
  useEffect(() => {
    fetchOrderDetails()
  }, [fetchOrderDetails])

  // Watch for order status changes and trigger notifications
  useEffect(() => {
    if (!order || !order.status) return
    
    // Check if this is a status change (not initial load)
    const lastNotifiedStatus = localStorage.getItem(`notified_status_${orderId}`)
    if (lastNotifiedStatus !== order.status) {
      // Trigger notification for the current status
      const currentStatus = statusFlow.find(s => s.key === order.status)
      if (currentStatus) {
        const additionalInfo = {}
        
        // Add context-specific info based on status
        if (order.status === 'assigned' && order.assignedTailor) {
          additionalInfo.tailorInfo = {
            firstName: order.assignedTailor.firstName,
            lastName: order.assignedTailor.lastName,
            phone: order.assignedTailor.phone
          }
        } else if (order.status === 'packed' && order.trackingNumber) {
          additionalInfo.trackingNumber = order.trackingNumber
        } else if (order.status === 'shipped' && order.trackingNumber) {
          additionalInfo.trackingNumber = order.trackingNumber
          additionalInfo.deliveryDate = order.expectedDelivery
        }
        
        // Only trigger notification if status actually changed
        if (lastNotifiedStatus !== null) {
          handleOrderStatusChange(orderId, order.status, additionalInfo)
        }
        
        // Remember this status to avoid duplicate notifications
        localStorage.setItem(`notified_status_${orderId}`, order.status)
      }
    }
  }, [order?.status, orderId, handleOrderStatusChange])

  // Enhanced review submission handler
  const handleReviewSubmitted = () => {
    setShowEnhancedReview(false)
    fetchOrderDetails() // Refresh order data
  }

  const submitAlterationRequest = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/alteration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          request: alterationRequest
        })
      })
      
      if (response.ok) {
        alert('Alteration request submitted! Our tailor will contact you soon.')
        setShowAlterations(false)
        setAlterationRequest('')
      }
    } catch (error) {
      console.error('Error submitting alteration request:', error)
    }
  }

  

  const getCurrentStatusIndex = () => {
    return statusFlow.findIndex(status => status.key === order?.status) || 0
  }

  const StarRating = ({ rating, onRatingChange, readonly = false }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onRatingChange(star)}
            className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} ${!readonly && 'hover:text-yellow-400 cursor-pointer'}`}
          >
            ⭐
          </button>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
          <button 
            onClick={() => navigate('/orders')}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Back to Orders
          </button>
        </div>
      </div>
    )
  }

  const currentStatusIndex = getCurrentStatusIndex()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/orders')}
            className="flex items-center text-purple-600 hover:text-purple-800 mb-4"
          >
            ← Back to Orders
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
          <p className="text-gray-600">Order #{order.orderId}</p>
        </div>

        {/* Delivery Status Banner */}
        <DeliveryStatusBanner orderId={orderId} />

        {/* Order Status Timeline */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">Order Status</h2>
          
          <div className="relative">
            {statusFlow.map((status, index) => {
              const isCompleted = index <= currentStatusIndex
              const isCurrent = index === currentStatusIndex
              const isAssignedStep = status.key === 'assigned' && order?.assignedTailor
              return (
                <div key={status.key} className="flex items-center mb-8 last:mb-0">
                  {/* Timeline line */}
                  {index < statusFlow.length - 1 && (
                    <div className={`absolute left-6 top-12 w-0.5 h-16 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`} style={{ transform: 'translateX(-50%)' }} />
                  )}
                  
                  {/* Status icon */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    isCompleted 
                      ? isCurrent 
                        ? `bg-${status.color}-500 text-white animate-pulse` 
                        : 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    {isCompleted && !isCurrent ? '✓' : status.icon}
                  </div>
                  
                  {/* Status info */}
                  <div className="ml-6">
                    <h3 className={`font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                      {status.label}
                    </h3>
                    {/* 💜 Tailor info appears here */}
        {isAssignedStep && (
          <p className="text-sm text-purple-600 font-medium mt-1">
            👔 {order.assignedTailor.firstName} {order.assignedTailor.lastName} — 📞 {order.assignedTailor.phone}
          </p>
        )}
                    {isCurrent && (
                      <p className="text-sm text-blue-600 font-medium">Current Status</p>
                    )}
                    {isCompleted && !isCurrent && (
                      <p className="text-sm text-green-600">Completed</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <img
                  src={item.image || 'https://via.placeholder.com/80x80?text=Item'}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-sm text-gray-600">Category: {item.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Payment Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="text-gray-600">
              <p className="font-medium text-gray-900">{order.shippingInfo?.fullName || 'Not provided'}</p>
              
              {/* Handle different address structures */}
              {order.shippingInfo?.address?.street && (
                <>
                  <p>{order.shippingInfo.address.street}</p>
                  <p>{order.shippingInfo.address.city}, {order.shippingInfo.address.state}</p>
                  <p>{order.shippingInfo.address.zipCode}</p>
                </>
              )}
              
              {/* For modular orders or different structures */}
              {!order.shippingInfo?.address?.street && (
                <div className="text-gray-500 italic">
                  {order.orderType === 'modular' ? (
                    <p>Shipping details will be collected separately</p>
                  ) : (
                    <p>Address details not available</p>
                  )}
                </div>
              )}
              
              {order.shippingInfo?.email && (
                <p className="mt-2">📧 {order.shippingInfo.email}</p>
              )}
              {order.shippingInfo?.phone && (
                <p>📱 {order.shippingInfo.phone}</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{order.pricing?.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span>₹{order.pricing?.delivery}</span>
              </div>
              {order.pricing?.codCharges > 0 && (
                <div className="flex justify-between">
                  <span>COD Charges:</span>
                  <span>₹{order.pricing?.codCharges}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-base border-t pt-2">
                <span>Total:</span>
                <span>₹{order.pricing?.total?.toLocaleString()}</span>
              </div>
              <div className="mt-4">
                <span className={`px-3 py-1 rounded-full text-xs ${
                  order.payment.method === 'cod' 
                    ? 'bg-orange-100 text-orange-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {order.payment.method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                </span>
              </div>
            </div>
          </div>
        </div>

        

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Actions </h2>
          <div className="flex flex-wrap gap-4">
            {/* Real-time Status Progression Buttons */}
            
            {/* Show enhanced review option only when delivered and confirmed */}
            {order.status === 'delivered' && order.deliveryConfirmedAt && !order.review?.rating && (
              <button
                onClick={() => setShowEnhancedReview(true)}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-3 rounded-lg hover:from-yellow-600 hover:to-orange-600 font-semibold shadow-lg transition-all"
              >
                ⭐ Write Review with Photos
              </button>
            )}

            {/* Show alteration request for delivered orders */}
            {order.status === 'delivered' && (
              <button
                onClick={() => setShowAlterations(true)}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
              >
                🔧 Request Alterations
              </button>
            )}

            {/* Cancel order option for placed/confirmed orders */}
            {(order.status === 'placed' || order.status === 'confirmed') && (
              <button
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
              >
                ❌ Cancel Order
              </button>
            )}
          </div>
        </div>

        {/* Enhanced Review Modal */}
        {showEnhancedReview && (
          <EnhancedReviewModal
            orderId={orderId}
            onClose={() => setShowEnhancedReview(false)}
            onSubmit={handleReviewSubmitted}
          />
        )}

        {/* Alteration Request Modal */}
        {showAlterations && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Request Alterations</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Describe what needs to be altered</label>
                <textarea
                  value={alterationRequest}
                  onChange={(e) => setAlterationRequest(e.target.value)}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Please describe the alterations needed..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={submitAlterationRequest}
                  disabled={!alterationRequest.trim()}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
                >
                  Submit Request
                </button>
                <button
                  onClick={() => setShowAlterations(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
