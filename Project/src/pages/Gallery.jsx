import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const API_BASE_URL = 'http://localhost:5000/api'

function Gallery() {
  const [galleryItems, setGalleryItems] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [filteredItems, setFilteredItems] = useState([])
  const [selectedStory, setSelectedStory] = useState(null)
  const [categories, setCategories] = useState(['All'])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Top items banner state
  const [topItems, setTopItems] = useState([])
  const [topType, setTopType] = useState('views') // 'views' | 'reviews'

  // Fetch gallery items, categories, and top items from backend
  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        setLoading(true)
        
        const [galleryRes, categoriesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/gallery`),
          fetch(`${API_BASE_URL}/gallery/categories`)
        ])
        
        const galleryData = await galleryRes.json()
        const categoriesData = await categoriesRes.json()
        
        if (galleryData.success) {
          setGalleryItems(galleryData.data)
          setFilteredItems(galleryData.data)
          console.log(`✅ Loaded ${galleryData.data.length} gallery items`)
        } else {
          setError('Failed to load gallery items')
        }
        
        if (categoriesData.success) {
          setCategories(categoriesData.data)
        }
        
      } catch (err) {
        console.error('Failed to fetch gallery data:', err)
        setError('Failed to connect to server')
      } finally {
        setLoading(false)
      }
    }

    const fetchTopItems = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/catalog/top-items?type=${topType}&limit=10`)
        const data = await res.json()
        if (data.success) setTopItems(data.data)
      } catch (err) {
        console.error('Failed to fetch top items:', err)
      }
    }

    fetchGalleryData()
    fetchTopItems()
  }, [topType])

  // Filter items by category
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredItems(galleryItems)
    } else {
      setFilteredItems(galleryItems.filter(item => item.category === selectedCategory))
    }
  }, [selectedCategory, galleryItems])

  const openStory = (item) => {
    setSelectedStory(item)
    // Increment views (optional)
    incrementViews(item._id)
  }

  const closeStory = () => {
    setSelectedStory(null)
  }

  // Handle like functionality
  const handleLike = async (itemId, event) => {
    event.stopPropagation() // Prevent opening modal
    try {
      await fetch(`${API_BASE_URL}/gallery/${itemId}/like`, {
        method: 'PUT'
      })
      
      // Update local state
      setGalleryItems(prev => 
        prev.map(item => 
          item._id === itemId 
            ? { ...item, likes: (item.likes || 0) + 1 }
            : item
        )
      )
    } catch (error) {
      console.error('Failed to like item:', error)
    }
  }

  // Increment views (optional)
  const incrementViews = async (itemId) => {
    try {
      await fetch(`${API_BASE_URL}/gallery/${itemId}`)
    } catch (error) {
      console.error('Failed to increment views:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-red-600 text-xl">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Items Shimmer Tape Banner */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow">
              ✨ Trending
            </span>
            <h2 className="text-xl font-bold text-gray-900">Most {topType === 'views' ? 'Viewed' : 'Reviewed'} Designs</h2>
          </div>
          <div className="bg-white rounded-full p-1 shadow-sm border border-gray-100">
            <button
              onClick={() => setTopType('views')}
              className={`px-3 py-1 text-sm rounded-full ${topType === 'views' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              👁 Views
            </button>
            <button
              onClick={() => setTopType('reviews')}
              className={`px-3 py-1 text-sm rounded-full ${topType === 'reviews' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              ⭐ Reviews
            </button>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-purple-100 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 opacity-20 animate-[shimmer_6s_linear_infinite]" />
          <div className="relative flex gap-4 py-3 items-stretch whitespace-nowrap animate-[scrollLeft_25s_linear_infinite]">
            {[...topItems, ...topItems].map((item, idx) => (
              <Link
                to={`/product/${item._id}`}
                key={`${item._id}-${idx}`}
                className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-xl shadow border border-gray-100 px-3 py-2 hover:shadow-md transition-all hover:scale-[1.01]"
                title={item.name}
              >
                <img
                  src={item.primaryImage}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/64x64?text=DT' }}
                />
                <div className="min-w-[140px]">
                  <div className="text-sm font-semibold text-gray-900 truncate max-w-[220px]">{item.name}</div>
                  <div className="text-xs text-gray-600">
                    {topType === 'views' ? (
                      <span>👁 {item.views || 0} Views</span>
                    ) : (
                      <span>⭐ {item.reviewsCount || 0} Reviews</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Transformation Stories</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Every design has a story. Click on any transformation to discover the journey from vision to reality.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-2 bg-white rounded-lg p-1 shadow-md">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <div 
            key={item._id} 
            className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
            onClick={() => openStory(item)}
          >
            <div className="relative">
              <img
                src={item.afterImage}
                alt={item.title}
                className="w-full h-64 object-cover group-hover:opacity-90 transition-opacity"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'
                }}
              />
              
              <div className="absolute top-4 left-4">
                <span className="bg-white bg-opacity-90 px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                  {item.category}
                </span>
              </div>

              {/* Like Button */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={(e) => handleLike(item._id, e)}
                  className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-all"
                >
                  <span className="text-red-500">♥</span>
                  {item.likes > 0 && (
                    <span className="ml-1 text-xs text-gray-600">{item.likes}</span>
                  )}
                </button>
              </div>

              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <p className="font-medium">📖 Click to Read Story</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 mb-2">Style: {item.style}</p>
              
              {item.customerName && (
                <p className="text-sm text-blue-600">by {item.customerName}</p>
              )}
              
              {item.customerStory && (
                <p className="text-gray-500 text-sm mt-2 italic">
                  "{item.customerStory.substring(0, 60)}..."
                </p>
              )}

              {/* Views and Design Time */}
              <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
                {item.views && <span>👁 {item.views} views</span>}
                {item.designTime && <span>⏱ {item.designTime}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modern Story Modal */}
      {selectedStory && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-xl flex items-center justify-center p-4 z-50" 
          onClick={closeStory}
        >
          <div 
            className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-white/20" 
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={closeStory}
              className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 z-20 group"
            >
              <svg className="w-5 h-5 text-gray-700 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col lg:flex-row h-full">
              {/* Left Side - Hero Image */}
              <div className="lg:w-1/2 relative overflow-hidden">
                <div className="relative h-96 lg:h-full">
                  <img 
                    src={selectedStory.afterImage} 
                    alt={selectedStory.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/600x400?text=No+Image'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  
                  <div className="absolute top-6 left-6">
                    <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl px-4 py-2">
                      <span className="text-white font-medium text-sm">{selectedStory.category}</span>
                    </div>
                  </div>

                  {/* Before/After Toggle (if beforeImage exists) */}
                  {selectedStory.beforeImage && (
                    <div className="absolute bottom-6 left-6">
                      <button 
                        className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl px-4 py-2 text-white font-medium text-sm hover:bg-white/30 transition-all"
                        onClick={() => {
                          // Toggle between before and after image
                          const img = document.querySelector('.story-image')
                          img.src = img.src.includes('after') ? selectedStory.beforeImage : selectedStory.afterImage
                        }}
                      >
                        Show Before/After
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side - Story Content */}
              <div className="lg:w-1/2 overflow-y-auto">
                <div className="p-8 lg:p-12 space-y-8">
                  {/* Header */}
                  <div className="space-y-4">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight tracking-tight">
                      {selectedStory.title}
                    </h2>
                    
                    {selectedStory.customerName && (
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg">
                            {selectedStory.customerName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-lg">{selectedStory.customerName}</p>
                          <p className="text-gray-500">{selectedStory.occasion || 'Special Occasion'}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
                      <div className="text-2xl font-bold text-blue-600">{selectedStory.style}</div>
                      <div className="text-sm text-blue-500">Style</div>
                    </div>
                    
                    {selectedStory.designTime && (
                      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 border border-emerald-100">
                        <div className="text-2xl font-bold text-emerald-600">{selectedStory.designTime}</div>
                        <div className="text-sm text-emerald-500">Design Time</div>
                      </div>
                    )}

                    {selectedStory.likes > 0 && (
                      <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl p-4 border border-pink-100">
                        <div className="text-2xl font-bold text-pink-600">{selectedStory.likes}</div>
                        <div className="text-sm text-pink-500">Likes</div>
                      </div>
                    )}

                    {selectedStory.views > 0 && (
                      <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-4 border border-gray-100">
                        <div className="text-2xl font-bold text-gray-600">{selectedStory.views}</div>
                        <div className="text-sm text-gray-500">Views</div>
                      </div>
                    )}
                  </div>

                  {/* Rating */}
                  {selectedStory.satisfaction && (
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-orange-800 mb-1">Customer Rating</p>
                          <div className="flex items-center space-x-2">
                            <div className="flex text-yellow-400 text-xl">
                              {'★'.repeat(selectedStory.satisfaction)}{'☆'.repeat(5 - selectedStory.satisfaction)}
                            </div>
                            <span className="text-orange-700 font-semibold">{selectedStory.satisfaction}/5</span>
                          </div>
                        </div>
                        <div className="text-4xl">⭐</div>
                      </div>
                    </div>
                  )}

                  {/* Story Quote */}
                  {selectedStory.customerStory && (
                    <div className="relative">
                      <div className="absolute -top-2 -left-2 text-6xl text-blue-200 leading-none">"</div>
                      <blockquote className="text-lg text-gray-700 leading-relaxed pl-8 pr-4 italic font-medium">
                        {selectedStory.customerStory}
                      </blockquote>
                      <div className="absolute -bottom-4 -right-2 text-6xl text-blue-200 leading-none rotate-180">"</div>
                    </div>
                  )}

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                    <button 
                      onClick={() => {
                        closeStory()
                        // Navigate to AI Studio - you can add navigation here
                        window.location.href = '/ai-studio'
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform"
                    >
                      ✨ Start Your Story
                    </button>
                    <button 
                      onClick={() => {
                        handleLike(selectedStory._id, { stopPropagation: () => {} })
                      }}
                      className="px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-colors"
                    >
                      ❤️ Like Story
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredItems.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No stories in this category</h3>
          <p className="text-gray-500">Try selecting a different category</p>
        </div>
      )}
    </div>
  )
}

export default Gallery

/* CSS for shimmer and scrolling animation */
const style = document.createElement('style')
style.innerHTML = `
@keyframes scrollLeft {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes shimmer {
  0% { opacity: 0.15; }
  50% { opacity: 0.35; }
  100% { opacity: 0.15; }
}
`
if (typeof document !== 'undefined' && !document.getElementById('gallery-banner-anim')) {
  style.id = 'gallery-banner-anim'
  document.head.appendChild(style)
}
