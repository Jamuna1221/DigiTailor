import { formatPrice } from '../../utils/formatPrice'

function ProductInfo({ product }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold">{product.name || 'Product Name'}</h1>
      <div className="flex items-center gap-4 mt-2 mb-4">
        <div className="text-2xl font-semibold text-indigo-700">
          {formatPrice(product.basePrice || product.price || 0)}
        </div>
        
        {/* Only show discount section if discount exists and > 0 */}
        {product.discount && product.discount > 0 && (
          <>
            <span className="text-xl line-through text-gray-400">
              {formatPrice((product.basePrice || 0) + product.discount)}
            </span>
            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold ml-2">
              Save {formatPrice(product.discount)}
            </span>
          </>
        )}
      </div>
      
      <div className="mb-2 text-gray-600">{product.description || 'No description available'}</div>
      
      {/* Only show delivery date if it exists */}
      {product.deliveryDate && (
        <div className="mb-1 text-green-600 font-medium">
          Delivery by {product.deliveryDate}
        </div>
      )}
    </div>
  )
}

export default ProductInfo
