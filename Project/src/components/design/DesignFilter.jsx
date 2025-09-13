function DesignFilter({ filters, onChange }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target
    onChange({ ...filters, [name]: value })
  }

  const clearFilters = () => {
    onChange({ style: '', occasion: '', difficulty: '', priceRange: '' })
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Clear All
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
          <select
            name="style"
            value={filters.style}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Styles</option>
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
            value={filters.occasion}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Occasions</option>
            <option value="Casual">Casual</option>
            <option value="Party">Party</option>
            <option value="Wedding">Wedding</option>
            <option value="Festival">Festival</option>
            <option value="Office">Office</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
          <select
            name="difficulty"
            value={filters.difficulty}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Levels</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
          <select
            name="priceRange"
            value={filters.priceRange}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Any Price</option>
            <option value="0-50">Rs.0 - Rs.50</option>
            <option value="50-100">Rs.50 - Rs.100</option>
            <option value="100-200">Rs.100 - Rs.200</option>
            <option value="200+">Rs.200+</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default DesignFilter
