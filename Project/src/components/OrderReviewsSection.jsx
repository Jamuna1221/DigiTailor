import { useState, useEffect } from 'react'

function OrderReviewsSection({ orderId }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrderReviews()
  }, [orderId])

  const fetchOrderReviews = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/order/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setReviews(data.data)
      }
    } catch (error) {
      console.error('Error fetching order reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Your Reviews</h2>
        <p className="text-gray-500">Loading reviews...</p>
      </div>
    )
  }

  if (reviews.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">📝 Your Reviews for this Order</h2>
      
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            {/* Product Info */}
            <div className="flex items-start space-x-4 mb-3">
              {review.productImage && (
                <img
                  src={review.productImage}
                  alt={review.productName}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{review.productName}</h3>
                <div className="flex items-center mt-1">
                  {/* Star Rating */}
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-lg ${
                          star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {review.rating}/5
                  </span>
                </div>
              </div>
              <div className="text-right text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>

            {/* Review Comment */}
            {review.comment && (
              <div className="mb-3">
                <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
              </div>
            )}

            {/* Review Images */}
            {review.images && review.images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {review.images.map((image, index) => (
                  <img
                    key={index}
                    src={`${import.meta.env.VITE_API_URL}${image.url}`}
                    alt={`Review image ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => window.open(`${import.meta.env.VITE_API_URL}${image.url}`, '_blank')}
                  />
                ))}
              </div>
            )}

            {/* Verified Purchase Badge */}
            {review.isVerifiedPurchase && (
              <div className="mt-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✓ Verified Purchase
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrderReviewsSection
