import { useCart } from '../../contexts/CartContext'
import { Link } from 'react-router-dom'

function DesignCard({ design, user, onWishlistToggle, isInWishlist, wishlistLoading }) {
  const { addToCart } = useCart()

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
  
  const cartItem = {
    id: design._id || design.id,
    name: design.name || 'Untitled Design',
    price: design.basePrice || design.price || 0,
    image: design.primaryImage || design.image || design.imageUrl || 'https://via.placeholder.com/300x300?text=Design',
    category: design.category || (design.tags && design.tags[0]) || 'Custom Design',
    description: design.description || 'Beautiful custom tailored design',
    quantity: 1, // ✅ Explicit quantity
    designId: design._id || design.id,
    difficulty: design.difficulty || 'Medium',
    estimatedDays: design.estimatedDays || 7,
    fabric: design.fabric || 'Cotton',
    color: design.color || 'Default',
    size: 'Custom',
    tags: design.tags || []
  }

  console.log('🛒 DesignCard adding item:', cartItem)
  
  if (!cartItem.id) {
    console.error('Cannot add item to cart: missing ID')
    alert('Error: Unable to add item to cart. Please try again.')
    return
  }

  if (!cartItem.price || cartItem.price <= 0) {
    console.error('Cannot add item to cart: invalid price')
    alert('Error: This item has an invalid price. Please contact support.')
    return
  }

  try {
    const success = addToCart(cartItem)
    if (success) {
      alert(`${cartItem.name} added to cart for ₹${cartItem.price.toLocaleString()}!`)
    } else {
      alert('Failed to add item to cart. Please try again.')
    }
  } catch (error) {
    console.error('Error adding to cart:', error)
    alert('Failed to add item to cart. Please try again.')
  }
}


  const handleWishlistClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) {
      alert('Please login to add items to wishlist')
      return
    }
    
    if (onWishlistToggle) {
      onWishlistToggle(design._id || design.id)
    }
  }

  if (!design) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="bg-gray-300 h-64 rounded mb-4"></div>
          <div className="bg-gray-300 h-4 rounded mb-2"></div>
          <div className="bg-gray-300 h-4 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  return (
    <Link to={`/product/${design._id || design.id}`} className="block">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden card-hover h-[420px] flex flex-col">
        <div className="relative h-[180px]">
          <img
            src={design.primaryImage || design.image || design.imageUrl || 'https://via.placeholder.com/400x300?text=Design'}
            alt={design.name || 'Design'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'
            }}
          />
          
          {/* Only Difficulty Badge - removed heart icon from top */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(design.difficulty)}`}>
              {design.difficulty || 'Medium'}
            </span>
          </div>

          {/* Price Badge in top right */}
          <div className="absolute top-4 right-4">
            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
              ₹{(design.basePrice || design.price || 0).toLocaleString()}
            </span>
          </div>
        </div>
        
        <div className="p-4 flex flex-col flex-1 overflow-hidden">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900 leading-tight flex-1 pr-4 line-clamp-2">
              {design.name || 'Untitled Design'}
            </h3>
            <span className="text-2xl font-bold text-purple-600 whitespace-nowrap">
              ₹{(design.basePrice || design.price || 0).toLocaleString()}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {design.description || 'Beautiful custom tailored design with premium quality materials and expert craftsmanship.'}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <span className="flex items-center">
              <span className="mr-1">🎨</span>
              {design.category || (design.tags && design.tags[0]) || 'Custom Style'}
            </span>
            <span className="flex items-center">
              <span className="mr-1">📅</span>
              {design.estimatedDays || 7} days
            </span>
          </div>

          {/* Fabric and Color Info */}
          {(design.fabric || design.color) && (
            <div className="flex justify-between text-xs text-gray-500 mb-3">
              {design.fabric && (
                <span className="flex items-center">
                  <span className="mr-1">🧵</span>
                  {design.fabric}
                </span>
              )}
              {design.color && (
                <span className="flex items-center">
                  <span className="mr-1">🎨</span>
                  {design.color}
                </span>
              )}
            </div>
          )}
          
          {/* Bottom Buttons - Only Add to Cart and Wishlist (no Order Now) */}
          <div className="mt-auto flex space-x-2">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-2.5 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6H19M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
              </svg>
              Add to Cart
            </button>
            
            {/* Wishlist Heart Icon - Only at bottom */}
            <button 
              onClick={handleWishlistClick}
              disabled={wishlistLoading}
              className={`p-2.5 border rounded-lg transition-colors ${
                isInWishlist 
                  ? 'border-red-500 bg-red-50 text-red-500' 
                  : 'border-gray-300 hover:bg-gray-50'
              } ${wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {wishlistLoading ? (
                <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full"></div>
              ) : (
                <span className="text-lg">{isInWishlist ? '❤️' : '🤍'}</span>
              )}
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex justify-between text-xs text-gray-500">
              <span>⚡ Custom Tailored</span>
              <span>🚚 Free Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default DesignCard
