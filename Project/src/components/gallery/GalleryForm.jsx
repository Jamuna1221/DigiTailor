import { useState, useEffect } from 'react'

function GalleryForm({ item, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Bridal',
    style: 'Traditional',
    customerName: '',
    customerStory: '',
    satisfaction: '5',
    designTime: '7 days',
    occasion: '',
    isFeatured: false
  })

  const [imagePreviews, setImagePreviews] = useState({
    afterImage: null
  })

  const [imageUrls, setImageUrls] = useState({
    afterImageUrl: ''
  })

  // State to preserve the item ID for updates
  const [itemId, setItemId] = useState(null)

  useEffect(() => {
    if (item) {
      console.log('📝 Form received item:', item)
      console.log('📝 Item ID:', item._id)
      
      // Preserve the item ID
      setItemId(item._id)
      
      setFormData({
        title: item.title || '',
        category: item.category || 'Bridal',
        style: item.style || 'Traditional',
        customerName: item.customerName || '',
        customerStory: item.customerStory || '',
        satisfaction: item.satisfaction?.toString() || '5',
        designTime: item.designTime || '7 days',
        occasion: item.occasion || '',
        isFeatured: Boolean(item.isFeatured)
      })
      
      if (item.afterImage) {
        setImagePreviews(prev => ({ ...prev, afterImage: item.afterImage }))
        setImageUrls(prev => ({ ...prev, afterImageUrl: item.afterImage }))
      }
    } else {
      // Reset for new item
      setItemId(null)
      setFormData({
        title: '',
        category: 'Bridal',
        style: 'Traditional',
        customerName: '',
        customerStory: '',
        satisfaction: '5',
        designTime: '7 days',
        occasion: '',
        isFeatured: false
      })
      setImagePreviews({ afterImage: null })
      setImageUrls({ afterImageUrl: '' })
    }
  }, [item])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleUrlChange = (e) => {
    const { name, value } = e.target
    setImageUrls(prev => ({ ...prev, [name]: value }))
    
    if (value.trim()) {
      setImagePreviews(prev => ({
        ...prev,
        [name.replace('Url', '')]: value.trim()
      }))
    } else {
      setImagePreviews(prev => ({
        ...prev,
        [name.replace('Url', '')]: null
      }))
    }
  }

  const handleFileUpload = (e, imageType) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file')
      e.target.value = '' // Reset file input
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size should be less than 5MB')
      e.target.value = '' // Reset file input
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const base64String = e.target.result
      
      setImageUrls(prev => ({
        ...prev,
        [`${imageType}Url`]: base64String
      }))

      setImagePreviews(prev => ({
        ...prev,
        [imageType]: base64String
      }))

      console.log(`✅ ${imageType} converted to base64 and filled in URL field`)
    }
    
    reader.onerror = () => {
      alert('Error reading file. Please try again.')
      e.target.value = '' // Reset file input
    }
    
    reader.readAsDataURL(file)
  }

  const removeImage = (imageType) => {
    setImagePreviews(prev => ({ ...prev, [imageType]: null }))
    setImageUrls(prev => ({ ...prev, [`${imageType}Url`]: '' }))
    
    // Reset file input if exists
    const fileInput = document.querySelector(`input[type="file"]`)
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const validateForm = () => {
    const errors = []
    
    if (!formData.title?.trim()) {
      errors.push('Title is required')
    } else if (formData.title.trim().length < 3) {
      errors.push('Title must be at least 3 characters long')
    }
    
    if (!formData.category?.trim()) {
      errors.push('Category is required')
    }
    
    if (!formData.style?.trim()) {
      errors.push('Style is required')
    }
    
    if (!imageUrls.afterImageUrl?.trim()) {
      errors.push('Design image is required')
    }
    
    if (errors.length > 0) {
      alert(`Please fix the following errors:\n• ${errors.join('\n• ')}`)
      return false
    }
    
    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    // Prepare submit data with proper ID handling
    const submitData = {
      ...formData,
      afterImage: imageUrls.afterImageUrl.trim()
    }
    
    // Include _id for updates
    if (itemId) {
      submitData._id = itemId
      console.log('✅ Submitting update with ID:', itemId)
    } else {
      console.log('✅ Submitting new item (no ID)')
    }
    
    console.log('📝 Final submit data:', submitData)
    onSubmit(submitData)
  }

  return (
    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {item ? `Edit Story${itemId ? ` (ID: ${itemId.slice(-6)})` : ''}` : 'Add New Story'}
          </h2>
          <button 
            type="button" 
            onClick={onCancel} 
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50 p-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Basic Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Story title (min 3 characters)"
              minLength={3}
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="Bridal">Bridal</option>
              <option value="Office">Office</option>
              <option value="Casual">Casual</option>
              <option value="Party">Party</option>
              <option value="Traditional">Traditional</option>
              <option value="Festive">Festive</option>
              <option value="Contemporary">Contemporary</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Style <span className="text-red-500">*</span>
            </label>
            <select
              name="style"
              value={formData.style}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="Traditional">Traditional</option>
              <option value="Modern">Modern</option>
              <option value="Contemporary">Contemporary</option>
              <option value="Fusion">Fusion</option>
              <option value="Minimalist">Minimalist</option>
              <option value="Elegant">Elegant</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Design Time</label>
            <input
              type="text"
              name="designTime"
              value={formData.designTime}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="e.g., 7 days, 2 weeks"
              maxLength={20}
            />
          </div>
        </div>

        {/* Design Image Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Design Image <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            <div>
              <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Design Image
                <input
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  disabled={loading}
                  onChange={(e) => handleFileUpload(e, 'afterImage')}
                />
              </label>
              <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
            </div>

            <div className="text-center text-gray-500 text-sm">OR</div>

            <input
              type="url"
              name="afterImageUrl"
              value={imageUrls.afterImageUrl}
              onChange={handleUrlChange}
              disabled={loading}
              placeholder="Enter image URL (auto-filled after upload)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />

            {imagePreviews.afterImage && (
              <div className="relative inline-block">
                <img
                  src={imagePreviews.afterImage}
                  alt="Design preview"
                  className="w-32 h-32 object-cover rounded-lg border shadow-sm"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/128x128?text=Invalid+Image'
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeImage('afterImage')}
                  disabled={loading}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Additional Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Customer's name (optional)"
              maxLength={50}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Satisfaction Rating</label>
            <select
              name="satisfaction"
              value={formData.satisfaction}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
              <option value="4">⭐⭐⭐⭐ Very Good</option>
              <option value="3">⭐⭐⭐ Good</option>
              <option value="2">⭐⭐ Fair</option>
              <option value="1">⭐ Poor</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Occasion</label>
          <input
            type="text"
            name="occasion"
            value={formData.occasion}
            onChange={handleInputChange}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="e.g., Wedding, Birthday, Festival (optional)"
            maxLength={30}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Customer Story</label>
          <textarea
            name="customerStory"
            value={formData.customerStory}
            onChange={handleInputChange}
            disabled={loading}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
            placeholder="Share the transformation story and customer experience..."
            maxLength={500}
          />
          <p className="mt-1 text-xs text-gray-500">
            {formData.customerStory.length}/500 characters
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isFeatured"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleInputChange}
            disabled={loading}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
          />
          <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700 cursor-pointer">
            ⭐ Featured Story (will appear prominently in gallery)
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !formData.title.trim() || !imageUrls.afterImageUrl.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? 'Saving...' : (item ? 'Update Story' : 'Create Story')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default GalleryForm
