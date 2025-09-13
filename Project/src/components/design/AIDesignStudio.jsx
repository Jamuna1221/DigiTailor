import { useState } from 'react'

function AIDesignStudio({ onDesignGenerated }) {
  const [formData, setFormData] = useState({
    category: 'Blouse',
    style: 'Traditional',
    occasion: 'Wedding',
    colors: '',
    fabric: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate AI generation
    setTimeout(() => {
      const generatedDesign = {
        id: Date.now(),
        name: `AI Generated ${formData.category}`,
        description: formData.description,
        category: formData.category,
        style: formData.style,
        occasion: formData.occasion,
        estimatedPrice: Math.floor(Math.random() * 200) + 100,
        estimatedDays: Math.floor(Math.random() * 10) + 5,
        generatedImage: `https://source.unsplash.com/600x800/?${formData.category},${formData.style},fashion`
      }
      
      setLoading(false)
      onDesignGenerated && onDesignGenerated(generatedDesign)
    }, 3000)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">AI Design Generator</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="Blouse">Blouse</option>
              <option value="Kurti">Kurti</option>
              <option value="Dress">Dress</option>
              <option value="Kids">Kids Wear</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
            <select
              name="style"
              value={formData.style}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="Traditional">Traditional</option>
              <option value="Modern">Modern</option>
              <option value="Fusion">Fusion</option>
              <option value="Bridal">Bridal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Occasion</label>
            <select
              name="occasion"
              value={formData.occasion}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Occasion</option>
              <option value="Wedding">Wedding</option>
              <option value="Party">Party</option>
              <option value="Casual">Casual</option>
              <option value="Festival">Festival</option>
              <option value="Office">Office</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Colors</label>
            <input
              type="text"
              name="colors"
              value={formData.colors}
              onChange={handleChange}
              placeholder="e.g., Red, Gold, Blue"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Fabric Preference</label>
            <input
              type="text"
              name="fabric"
              value={formData.fabric}
              onChange={handleChange}
              placeholder="e.g., Silk, Cotton, Chiffon"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Design Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe your dream design in detail..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'btn-ai'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Design...
            </span>
          ) : (
            '✨ Generate AI Design'
          )}
        </button>
      </form>
    </div>
  )
}

export default AIDesignStudio
