import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { CartContext } from '../../contexts/CartContext'

function DesignCard({ design }) {
  const { addToCart } = useContext(CartContext)

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
      case 'beginner': return 'text-green-600 bg-green-100'
      case 'medium': 
      case 'intermediate': return 'text-amber-600 bg-amber-100'
      case 'hard':
      case 'advanced': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    addToCart(design)
    
    // Show success notification
    alert(`${design.name || 'Design'} added to cart!`)
  }

  // Add safety checks for all fields
  if (!design) {
    return <div className="p-4 border rounded">Loading design...</div>
  }

  return (
    <Link to={`/product/${design._id || design.id}`} className="block">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden card-hover">
        <div className="relative">
          <img
            src={design.primaryImage || '/placeholder-image.jpg'}
            alt={design.name || 'Design'}
            className="w-full h-64 object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'
            }}
          />
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(design.difficulty)}`}>
              {design.difficulty || 'Medium'}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-900 leading-tight">
              {design.name || 'Untitled Design'}
            </h3>
            <span className="text-2xl font-bold text-blue-600">
              ₹{design.basePrice || 0}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {design.description || 'No description available'}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <span className="flex items-center">
              <span className="mr-1">🎨</span>
              {design.category || (design.tags && design.tags[0]) || 'Style'}
            </span>
            <span className="flex items-center">
              <span className="mr-1">📅</span>
              {design.estimatedDays || 7} days
            </span>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-center py-2.5 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6H19M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
              </svg>
              Add to Cart
            </button>
            <button 
              onClick={(e) => e.preventDefault()}
              className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span>🤍</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default DesignCard
