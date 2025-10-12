import { useState, useEffect } from 'react'

function DeliveryStatusBanner({ orderId }) {
  const [deliveryStatus, setDeliveryStatus] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDeliveryStatus = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:5000/api/orders/${orderId}/delivery-status`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setDeliveryStatus(data.data)
        }
      } catch (error) {
        console.error('Error fetching delivery status:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDeliveryStatus()
  }, [orderId])

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-pulse">
        <div className="h-6 bg-blue-100 rounded w-3/4"></div>
      </div>
    )
  }

  if (!deliveryStatus) return null

  const { status, isAwaitingDeliveryConfirmation, deliveryConfirmed, canReview, hasReview } = deliveryStatus

  if (isAwaitingDeliveryConfirmation) {
    return (
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-2xl">📦</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-orange-900 mb-2">
              🚚 Order Out for Delivery!
            </h3>
            <p className="text-orange-800 mb-3">
              Your order is on its way! We've sent you an email with a delivery confirmation button.
            </p>
            <div className="bg-white bg-opacity-70 rounded-lg p-3 border border-orange-200">
              <p className="text-sm text-orange-800 font-medium">
                📧 <strong>Important:</strong> Please check your email and click the "Mark as Delivered" button once you receive your order to:
              </p>
              <ul className="text-sm text-orange-700 mt-2 space-y-1 ml-6">
                <li>• Confirm successful delivery</li>
                <li>• Enable the review system</li>
                <li>• Help us improve our service</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'delivered' && deliveryConfirmed && !hasReview && canReview) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-2xl">✅</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              🎉 Delivery Confirmed!
            </h3>
            <p className="text-green-800 mb-3">
              Thank you for confirming delivery! We'd love to hear about your experience.
            </p>
            <div className="bg-white bg-opacity-70 rounded-lg p-3 border border-green-200">
              <p className="text-sm text-green-800">
                📝 <strong>Ready to review?</strong> Share your experience and photos to help other customers!
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'delivered' && hasReview) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
            <span className="text-2xl">⭐</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-purple-900 mb-2">
              💜 Thank You for Your Review!
            </h3>
            <p className="text-purple-800">
              Your feedback helps us improve and assists other customers in making informed decisions.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default DeliveryStatusBanner