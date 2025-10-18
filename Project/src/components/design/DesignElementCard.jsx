import React from 'react'

function DesignElementCard({ design, onAdd, isSelected }) {
  const handleAddClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Validate design data before adding
    if (!design || !design.id || !design.name) {
      console.error('Invalid design data:', design)
      return
    }
    
    onAdd(design)
  }

  if (!design) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="bg-gray-300 h-48 rounded mb-4"></div>
          <div className="bg-gray-300 h-4 rounded mb-2"></div>
          <div className="bg-gray-300 h-4 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
      isSelected ? 'ring-2 ring-purple-500 ring-opacity-50' : ''
    }`}>
      <div className="relative h-48">
        <img
          src={design.image || '/api/placeholder/400x300'}
          alt={design.name || 'Design Element'}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTIwSDIyNVYxODBIMTc1VjEyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2Zz4K'
          }}
        />
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
            {design.price === 0 ? 'Free' : `₹${design.price}`}
          </span>
        </div>

        {/* Selected Indicator */}
        {isSelected && (
          <div className="absolute top-4 left-4">
            <div className="bg-green-500 text-white rounded-full p-2 shadow-lg">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {design.name || 'Untitled Design'}
        </h3>
        
        {design.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {design.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-purple-600">
            {(design.price === 0 || design.price) ? (design.price === 0 ? 'Free' : `₹${design.price.toLocaleString()}`) : 'Price N/A'}
          </div>
          
          <button 
            onClick={handleAddClick}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isSelected 
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {isSelected ? '✓ Added' : '+ Add'}
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex justify-between text-xs text-gray-500">
            <span>⚡ Custom Design</span>
            <span>🎨 Premium Quality</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DesignElementCard