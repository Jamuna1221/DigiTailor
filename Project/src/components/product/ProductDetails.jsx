// src/components/product/ProductDetails.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { addRecentlyViewed } from '../../utils/recentlyViewed'
import Recommendations from './Recommendations'

function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [customization, setCustomization] = useState({
    specialInstructions: '',
    measurements: {
      bust: '',
      waist: '',
      hips: '',
      length: ''
    }
  })

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        console.log(`🔍 Fetching product ID: ${id}`)
        
        // ✅ Use the public catalog endpoint (no auth required)
        const response = await fetch(`http://localhost:5000/api/catalog/${id}`)
        console.log(`🔍 Response status: ${response.status}`)
        
        const data = await response.json()
        console.log(`🔍 Response data:`, data)
        
        if (data.success) {
          setProduct(data.data)
          console.log('✅ Product loaded successfully')
          try {
            const p = data.data || {}
            const pid = p._id || p.id || id
            const image = p.primaryImage || p.image || (Array.isArray(p.images) ? p.images[0] : null) || '/placeholder-image.jpg'
            // Guest/local fallback
            addRecentlyViewed({
              id: pid,
              name: p.name || 'Product',
              price: p.basePrice || p.price || 0,
              image,
              link: `/product/${pid}`,
            })
            // Logged-in: also persist to server
            const token = localStorage.getItem('token')
            if (token) {
              try {
                await fetch('http://localhost:5000/api/recently-viewed', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ productId: pid }),
                })
                // Fire a local update event to refresh any listeners
                window.dispatchEvent(new CustomEvent('recentlyViewed:update'))
              } catch (postErr) {
                console.warn('Failed to persist recently viewed to server', postErr)
              }
            }
          } catch (e) {
            console.warn('Could not add to recently viewed', e)
          }
        } else {
          console.error('❌ Product not found:', data.message)
          setProduct(null)
        }
      } catch (error) {
        console.error('💥 Error fetching product:', error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  const handleAddToCart = () => {
    if (!product) return

    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.basePrice || product.price || 0,
      image: product.primaryImage || product.image || '/placeholder-image.jpg',
      category: product.category,
      quantity: quantity,
      customization: {
        size: selectedSize,
        color: selectedColor,
        specialInstructions: customization.specialInstructions,
        measurements: customization.measurements
      }
    }

    console.log('🛒 Adding to cart from ProductDetails:', cartItem)

    const success = addToCart(cartItem)
    if (success) {
      alert(`${product.name} added to cart!`)
    } else {
      alert('Failed to add item to cart')
    }
  }

  const handleOrderNow = () => {
    if (!product) return

    // Add to cart first
    handleAddToCart()
    
    // Then navigate to checkout
    setTimeout(() => {
      navigate('/checkout')
    }, 500) // Small delay to ensure cart is updated
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <p className="ml-3 text-gray-600">Loading product details...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/catalog')}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Browse Catalog
        </button>
      </div>
    )
  }

  // const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  // const availableColors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Black', 'White']

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1220] py-8 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-[#111827] rounded-lg shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Product Image */}
            <div className="p-6">
              <div className="aspect-w-1 aspect-h-1">
                <img
                  src={product.primaryImage || product.image || '/placeholder-image.jpg'}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x400?text=No+Image'
                  }}
                />
              </div>
              
              {/* Additional Images */}
              {product.images && product.images.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {product.images.slice(1, 5).map((image, idx) => (
                    <img
                      key={idx}
                      src={image}
                      alt={`${product.name} ${idx + 2}`}
                      className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="p-6 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-purple-600">
                    ₹{(product.basePrice || product.price || 0).toLocaleString()}
                  </span>
                  {product.difficulty && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full">
                      {product.difficulty}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed">
                {product.description || 'Beautiful custom tailored design with premium quality materials and expert craftsmanship.'}
              </p>

              {/* Product Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Category:</span>
                  <p className="text-purple-600">{product.category || 'Custom Design'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Estimated Time:</span>
                  <p className="text-gray-900">{product.estimatedDays || 7} days</p>
                </div>
              </div>

              {/* Size Selection */}
              {/* <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Select Size</h3>
                <div className="grid grid-cols-3 gap-3">
                  {availableSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-4 border rounded-lg text-center transition-colors ${
                        selectedSize === size
                          ? 'border-purple-600 bg-purple-50 text-purple-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div> */}

              {/* Color Selection */}
              {/* <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Select Color</h3>
                <div className="grid grid-cols-4 gap-3">
                  {availableColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`py-2 px-3 border rounded-lg text-sm text-center transition-colors ${
                        selectedColor === color
                          ? 'border-purple-600 bg-purple-50 text-purple-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div> */}

              {/* Quantity */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Quantity</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Customization */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Customization</h3>
                <textarea
                  placeholder="Special instructions for the tailor (optional)..."
                  value={customization.specialInstructions}
                  onChange={(e) => setCustomization({
                    ...customization,
                    specialInstructions: e.target.value
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows="3"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleOrderNow}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Order Now - ₹{((product.basePrice || product.price || 0) * quantity).toLocaleString()}
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex items-center justify-center px-6 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6H19M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
                    </svg>
                    Add to Cart
                  </button>

                  <button className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Save
                  </button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">What to expect:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Expert tailor will be assigned to your order
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Free alterations within 30 days
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Quality guarantee on all stitching
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Recommendations Section */}
      <Recommendations
        productId={product?._id || product?.id}
        category={product?.category}
        tags={Array.isArray(product?.tags) ? product.tags : []}
      />
    </div>
  )
}

export default ProductDetails
