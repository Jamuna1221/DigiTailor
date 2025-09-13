import { Link } from 'react-router-dom'

function ProductCard({ product }) {
  return (
    <Link 
      to={`/product/${product._id}`} 
      className="block group rounded-xl overflow-hidden shadow hover:shadow-lg transition-all bg-white"
    >
      <img 
        src={product.primaryImage || '/placeholder-image.jpg'} 
        alt={product.name} 
        className="h-56 w-full object-cover"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'
        }}
      />
      <div className="p-4">
        <div className="text-lg font-bold mb-1">{product.name}</div>
        <div className="text-gray-700 mb-1">₹{product.basePrice?.toLocaleString()}</div>
        <div className="text-sm text-gray-500 mb-2">{product.category}</div>
        
        {/* Status indicators */}
        <div className="flex gap-2 items-center">
          {product.difficulty && (
            <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
              {product.difficulty}
            </span>
          )}
          {product.isActive && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Available
            </span>
          )}
        </div>
        
        {/* Estimated days */}
        {product.estimatedDays && (
          <div className="text-xs text-gray-500 mt-2">
            Est. {product.estimatedDays} days
          </div>
        )}
      </div>
    </Link>
  )
}

export default ProductCard
