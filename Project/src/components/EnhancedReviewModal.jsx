import { useState, useRef } from 'react'

function EnhancedReviewModal({ orderId, onClose, onSubmit }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  const handleImageSelection = (e) => {
    const files = Array.from(e.target.files)
    
    // Limit to 5 images
    if (images.length + files.length > 5) {
      alert('Maximum 5 images allowed')
      return
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`)
        return false
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large (max 5MB)`)
        return false
      }
      return true
    })

    // Update images state
    setImages(prev => [...prev, ...validFiles])

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviews(prev => [...prev, {
          file: file,
          url: e.target.result,
          name: file.name
        }])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!rating) {
      alert('Please select a rating')
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('rating', rating)
      formData.append('comment', comment)
      
      // Append images
      images.forEach((image, index) => {
        formData.append('images', image)
      })

      const token = localStorage.getItem('token')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}/review-with-images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        alert(`✅ Review submitted successfully with ${data.data.imageCount} images!`)
        onSubmit()
      } else {
        const error = await response.json()
        alert(`Error: ${error.message}`)
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const StarRating = ({ rating, onRatingChange }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          className={`text-3xl transition-colors ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          } hover:text-yellow-400 cursor-pointer`}
        >
          ⭐
        </button>
      ))}
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">📝 Write Review</h3>
              <p className="text-gray-600">Share your experience and help others!</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Rating Section */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4">
              <StarRating rating={rating} onRatingChange={setRating} />
              <span className="text-lg font-medium text-gray-600">
                {rating > 0 && (
                  <>
                    {rating}/5 {rating === 5 ? '🔥' : rating >= 4 ? '😊' : rating >= 3 ? '😐' : rating >= 2 ? '😕' : '😞'}
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Comment Section */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Tell us about the quality, fit, delivery experience, and anything else that might help other customers..."
              maxLength="1000"
            />
            <div className="text-right text-sm text-gray-400 mt-1">
              {comment.length}/1000
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              📸 Add Photos (Optional)
              <span className="font-normal text-gray-500 ml-2">Max 5 images, 5MB each</span>
            </label>
            
            {/* Upload Button */}
            <div className="mb-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={images.length >= 5}
                className={`
                  w-full border-2 border-dashed rounded-lg p-6 text-center transition-colors
                  ${images.length >= 5 
                    ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' 
                    : 'border-purple-300 bg-purple-50 text-purple-600 hover:border-purple-400 hover:bg-purple-100 cursor-pointer'
                  }
                `}
              >
                <div className="text-3xl mb-2">📷</div>
                <div className="font-medium">
                  {images.length >= 5 ? 'Maximum images reached' : 'Click to add photos'}
                </div>
                <div className="text-sm">
                  {images.length < 5 && `${5 - images.length} more allowed`}
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelection}
                className="hidden"
              />
            </div>

            {/* Image Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview.url}
                      alt={`Review ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg truncate">
                      {preview.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="text-blue-500 text-xl">💡</div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Tips for great reviews:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Include photos showing fit, quality, and details</li>
                  <li>• Mention sizing accuracy and comfort</li>
                  <li>• Share delivery experience and packaging</li>
                  <li>• Be honest to help other customers</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={!rating || isSubmitting}
              className={`
                flex-1 py-3 px-6 rounded-lg font-semibold transition-all
                ${!rating || isSubmitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl'
                }
              `}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </div>
              ) : (
                `📤 Submit Review${images.length > 0 ? ` with ${images.length} photo${images.length > 1 ? 's' : ''}` : ''}`
              )}
            </button>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedReviewModal