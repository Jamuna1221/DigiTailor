import React, { useState, useRef } from 'react'
import Modal from '../components/common/Modal'

const CustomStudio = () => {
  // State for order type toggle
  const [orderType, setOrderType] = useState('reference')
  const [category, setCategory] = useState('Blouse')
  
  // Reference Order States
  const [referenceOrder, setReferenceOrder] = useState({
    image: null,
    instructions: '',
    customerName: '',
    phone: '',
    email: ''
  })

  // Design Elements States
  const [designElements, setDesignElements] = useState({
    images: [],
    instructions: '',
    customerName: '',
    phone: '',
    email: '',
    budget: '',
    timeline: ''
  })

  // General states
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  // File refs
  const referenceUploadRef = useRef(null)
  const designElementsRef = useRef(null)

  // Handle reference image upload
  const handleReferenceImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setReferenceOrder(prev => ({...prev, image: e.target.result}))
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle design elements upload
  const handleDesignElementsUpload = (event) => {
    const files = Array.from(event.target.files)
    if (files.length > 0) {
      const newImages = []
      let filesProcessed = 0
      
      files.forEach((file, index) => {
        if (designElements.images.length + index < 10) {
          const reader = new FileReader()
          reader.onload = (e) => {
            newImages.push(e.target.result)
            filesProcessed++
            
            if (filesProcessed === Math.min(files.length, 10 - designElements.images.length)) {
              setDesignElements(prev => ({
                ...prev, 
                images: [...prev.images, ...newImages]
              }))
            }
          }
          reader.readAsDataURL(file)
        }
      })
    }
  }

  // Handle reference order submission
  const handleReferenceOrderSubmit = async () => {
    if (!referenceOrder.image || !referenceOrder.instructions.trim() || 
        !referenceOrder.customerName.trim() || !referenceOrder.phone.trim()) {
      alert('Please fill in all required fields and upload a reference image.')
      return
    }

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Reference Order Submitted:', {
        ...referenceOrder,
        category,
        orderType: 'reference'
      })
      setShowModal(true)
      // Reset form
      setReferenceOrder({
        image: null,
        instructions: '',
        customerName: '',
        phone: '',
        email: ''
      })
    } catch (error) {
      console.error('Order submission failed:', error)
      alert('Failed to submit order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle design elements submission
  const handleDesignElementsSubmit = async () => {
    if (designElements.images.length === 0 || !designElements.instructions.trim() || 
        !designElements.customerName.trim() || !designElements.phone.trim()) {
      alert('Please upload at least one image, fill in instructions, name, and phone number.')
      return
    }

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Design Elements Enquiry Submitted:', {
        ...designElements,
        category,
        orderType: 'elements'
      })
      setShowModal(true)
      // Reset form
      setDesignElements({
        images: [],
        instructions: '',
        customerName: '',
        phone: '',
        email: '',
        budget: '',
        timeline: ''
      })
    } catch (error) {
      console.error('Enquiry submission failed:', error)
      alert('Failed to submit enquiry. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-[#0B1220] dark:via-[#0B1220] dark:to-[#0B1220] dark:text-white relative">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              ✨ Custom Studio ✨
            </h1>
            <div className="absolute -top-2 -right-2 animate-bounce">🎨</div>
            <div className="absolute -top-1 -left-3 animate-pulse">✨</div>
          </div>
          <p className="text-xl text-gray-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Upload your reference images or design elements and get professional custom tailoring services!
          </p>
        </div>

        {/* Order Type Toggle */}
        <div className="bg-white/90 dark:bg-[#111827] backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 dark:border-slate-800 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setOrderType('reference')}
              className={`flex-1 max-w-md py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                orderType === 'reference'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-slate-600'
              }`}
            >
              📸 Reference Image Order
            </button>
            <button
              onClick={() => setOrderType('elements')}
              className={`flex-1 max-w-md py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                orderType === 'elements'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-slate-600'
              }`}
            >
              🎨 Design Elements Enquiry
            </button>
          </div>
        </div>

        {/* Reference Image Order Section */}
        {orderType === 'reference' && (
          <div className="bg-white/90 dark:bg-[#111827] backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 dark:border-slate-800 mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 text-center">
              📸 Reference Image Order
            </h2>
            <p className="text-gray-600 dark:text-slate-300 text-center mb-8">
              Upload a reference image and provide detailed instructions. We'll create a custom design exactly like your reference!
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-4">Upload Reference Image *</label>
                <div
                  onClick={() => referenceUploadRef.current?.click()}
                  className="border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-2xl p-8 text-center cursor-pointer hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50 dark:bg-slate-800 hover:shadow-lg"
                >
                  {referenceOrder.image ? (
                    <div className="relative">
                      <img src={referenceOrder.image} alt="Reference" className="w-full h-64 object-cover rounded-xl shadow-md" />
                      <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-2">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="mt-4 text-green-600 font-medium">✓ Reference image uploaded successfully!</p>
                    </div>
                  ) : (
                    <div className="text-purple-600 dark:text-white">
                      <div className="text-6xl mb-4">📸</div>
                      <p className="text-xl font-bold mb-2">Upload Reference Image</p>
                      <p className="text-gray-500 dark:text-slate-300">Click to browse files or drag and drop</p>
                      <p className="text-sm text-gray-400 dark:text-slate-400 mt-2">JPG, PNG, WebP up to 10MB</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={referenceUploadRef}
                  onChange={handleReferenceImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Order Form */}
              <div className="space-y-6">
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 border-2 border-purple-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-[#0f172a] dark:text-white"
                  >
                    <option value="Blouse">👗 Blouse</option>
                    <option value="Kurti">👘 Kurti</option>
                    <option value="Dress">💃 Dress</option>
                    <option value="Saree">👺 Saree</option>
                    <option value="Kids">👶 Kids Wear</option>
                    <option value="Gown">👰 Gown</option>
                  </select>
                </div>

                {/* Instructions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Detailed Instructions *</label>
                  <textarea
                    value={referenceOrder.instructions}
                    onChange={(e) => setReferenceOrder(prev => ({...prev, instructions: e.target.value}))}
                    placeholder="Please provide detailed instructions about the design, colors, size, measurements, special requirements, etc..."
                    className="w-full p-4 border-2 border-purple-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-200 bg-white/50 dark:bg-[#0f172a] dark:text-white"
                    rows={6}
                  />
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Your Name *</label>
                    <input
                      type="text"
                      value={referenceOrder.customerName}
                      onChange={(e) => setReferenceOrder(prev => ({...prev, customerName: e.target.value}))}
                      placeholder="Enter your full name"
                      className="w-full p-3 border-2 border-purple-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-[#0f172a] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={referenceOrder.phone}
                      onChange={(e) => setReferenceOrder(prev => ({...prev, phone: e.target.value}))}
                      placeholder="Enter your phone number"
                      className="w-full p-3 border-2 border-purple-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-[#0f172a] dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Email (Optional)</label>
                  <input
                    type="email"
                    value={referenceOrder.email}
                    onChange={(e) => setReferenceOrder(prev => ({...prev, email: e.target.value}))}
                    placeholder="Enter your email address"
                    className="w-full p-3 border-2 border-purple-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-[#0f172a] dark:text-white"
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleReferenceOrderSubmit}
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-white text-lg transition-all duration-300 transform hover:scale-105 ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Processing Order...
                    </span>
                  ) : (
                    '📦 Place Order Now'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Design Elements Enquiry Section */}
        {orderType === 'elements' && (
          <div className="bg-white/90 dark:bg-[#111827] backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 dark:border-slate-800 mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 text-center">
              🎨 Design Elements Enquiry
            </h2>
            <p className="text-gray-600 dark:text-slate-300 text-center mb-8">
              Upload multiple design elements and let us know your requirements. Perfect for custom patterns, decorations, or design consultations!
            </p>
            
            <div className="space-y-8">
              {/* File Upload Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-4">Upload Design Elements (Up to 10 images) *</label>
                <div
                  onClick={() => designElementsRef.current?.click()}
                  className="border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-2xl p-8 text-center cursor-pointer hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50 dark:bg-slate-800 hover:shadow-lg"
                >
                  <div className="text-purple-600 dark:text-white">
                    <div className="text-6xl mb-4">🎨</div>
                    <p className="text-xl font-bold mb-2">Upload Design Elements</p>
                    <p className="text-gray-500 dark:text-slate-300">Click to browse files or drag and drop</p>
                    <p className="text-sm text-gray-400 dark:text-slate-400 mt-2">JPG, PNG, WebP up to 10MB each | Maximum 10 files</p>
                  </div>
                </div>
                <input
                  type="file"
                  ref={designElementsRef}
                  onChange={handleDesignElementsUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
              </div>

              {/* Display uploaded images */}
              {designElements.images.length > 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Uploaded Design Elements ({designElements.images.length}/10)
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {designElements.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img src={image} alt={`Element ${index + 1}`} className="w-full h-24 object-cover rounded-xl shadow-md" />
                        <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-xl transition-all duration-200"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Instructions and Customer Details Form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Instructions */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Design Requirements & Instructions *</label>
                    <textarea
                      value={designElements.instructions}
                      onChange={(e) => setDesignElements(prev => ({...prev, instructions: e.target.value}))}
                      placeholder="Describe your design requirements, preferred colors, styles, usage purposes, any specific instructions, etc..."
                      className="w-full p-4 border-2 border-purple-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-200 bg-white/50 dark:bg-[#0f172a] dark:text-white"
                      rows={8}
                    />
                  </div>
                  
                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Inquiry Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-3 border-2 border-purple-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-[#0f172a] dark:text-white"
                    >
                      <option value="Pattern Design">🎨 Pattern Design</option>
                      <option value="Embroidery">🧵 Embroidery</option>
                      <option value="Print Design">🖨️ Print Design</option>
                      <option value="Color Consultation">🎭 Color Consultation</option>
                      <option value="Style Consultation">👗 Style Consultation</option>
                      <option value="Custom Elements">✨ Custom Elements</option>
                      <option value="Other">🔄 Other</option>
                    </select>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Your Name *</label>
                      <input
                        type="text"
                        value={designElements.customerName}
                        onChange={(e) => setDesignElements(prev => ({...prev, customerName: e.target.value}))}
                        placeholder="Enter your full name"
                        className="w-full p-3 border-2 border-purple-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-[#0f172a] dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        value={designElements.phone}
                        onChange={(e) => setDesignElements(prev => ({...prev, phone: e.target.value}))}
                        placeholder="Enter your phone number"
                        className="w-full p-3 border-2 border-purple-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-[#0f172a] dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Email (Optional)</label>
                    <input
                      type="email"
                      value={designElements.email}
                      onChange={(e) => setDesignElements(prev => ({...prev, email: e.target.value}))}
                      placeholder="Enter your email address"
                      className="w-full p-3 border-2 border-purple-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-[#0f172a] dark:text-white"
                    />
                  </div>

                  {/* Budget Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Budget Range (Optional)</label>
                    <select
                      value={designElements.budget}
                      onChange={(e) => setDesignElements(prev => ({...prev, budget: e.target.value}))}
                      className="w-full p-3 border-2 border-purple-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-[#0f172a] dark:text-white"
                    >
                      <option value="">Select budget range</option>
                      <option value="Under ₹500">💰 Under ₹500</option>
                      <option value="₹500 - ₹1000">💰 ₹500 - ₹1000</option>
                      <option value="₹1000 - ₹2000">💰 ₹1000 - ₹2000</option>
                      <option value="₹2000 - ₹5000">💰 ₹2000 - ₹5000</option>
                      <option value="Above ₹5000">💰 Above ₹5000</option>
                      <option value="Open to discussion">🤝 Open to discussion</option>
                    </select>
                  </div>

                  {/* Timeline */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Expected Timeline (Optional)</label>
                    <select
                      value={designElements.timeline}
                      onChange={(e) => setDesignElements(prev => ({...prev, timeline: e.target.value}))}
                      className="w-full p-3 border-2 border-purple-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-[#0f172a] dark:text-white"
                    >
                      <option value="">Select timeline</option>
                      <option value="ASAP">⚡ ASAP</option>
                      <option value="Within 1 week">📅 Within 1 week</option>
                      <option value="Within 2 weeks">📅 Within 2 weeks</option>
                      <option value="Within 1 month">📅 Within 1 month</option>
                      <option value="Flexible">🌈 Flexible</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleDesignElementsSubmit}
                    disabled={loading}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-white text-lg transition-all duration-300 transform hover:scale-105 ${
                      loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        Submitting Enquiry...
                      </span>
                    ) : (
                      '💬 Submit Design Enquiry'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={orderType === 'reference' ? 'Order Submitted Successfully! 🎉' : 'Enquiry Submitted Successfully! 🎉'}
      >
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <p className="text-gray-600 dark:text-slate-300 mb-6 leading-relaxed">
            Your {orderType === 'reference' ? 'reference image order' : 'design elements enquiry'} has been submitted successfully. 
            Our expert team will contact you within 24 hours!
          </p>
          <button
            onClick={() => setShowModal(false)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg w-full"
          >
            Awesome! Thanks 🙌
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default CustomStudio