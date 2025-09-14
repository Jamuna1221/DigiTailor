import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import DesignCard from '../components/design/DesignCard.jsx'
import { useWishlist } from '../contexts/WishlistContext'

const API_BASE_URL = 'http://localhost:5000/api'

function Catalog({ user }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [designs, setDesigns] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [wishlistMessage, setWishlistMessage] = useState('')

  // Wishlist context
  const { addToWishlist, removeFromWishlist, isInWishlist, isLoading: wishlistLoading } = useWishlist()

  // Get filters from URL params
  const selectedCategory = searchParams.get('category') || 'all'
  const searchQuery = searchParams.get('search') || ''
  const sortBy = searchParams.get('sortBy') || 'createdAt'
  const sortOrder = searchParams.get('sortOrder') || 'desc'

  // Handle wishlist toggle
  const handleWishlistToggle = async (designId) => {
    if (!user) {
      // You can add a login redirect here if needed
      alert('Please login to add items to wishlist')
      return
    }

    const inWishlist = isInWishlist(designId)
    
    let result
    if (inWishlist) {
      result = await removeFromWishlist(designId)
    } else {
      result = await addToWishlist(designId)
    }

    setWishlistMessage(result.message)
    setTimeout(() => setWishlistMessage(''), 3000)
  }

  // Fetch catalog data
  useEffect(() => {
    const fetchCatalogData = async () => {
      try {
        setLoading(true)
        console.log('📋 Fetching catalog data...')
        
        // Build query parameters
        const params = new URLSearchParams({
          category: selectedCategory === 'all' ? '' : selectedCategory,
          search: searchQuery,
          sortBy: sortBy,
          sortOrder: sortOrder
        })
        
        // Fetch designs and categories in parallel
        const [designsRes, categoriesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/catalog?${params}`),
          fetch(`${API_BASE_URL}/catalog/categories`)
        ])
        
        const designsData = await designsRes.json()
        const categoriesData = await categoriesRes.json()
        
        if (designsData.success) {
          setDesigns(designsData.data)
        }
        
        if (categoriesData.success) {
          setCategories(['all', ...categoriesData.data])
        }
        
        console.log('✅ Catalog data loaded successfully')
        
      } catch (err) {
        console.error('❌ Error fetching catalog data:', err)
        setError('Failed to load catalog data')
      } finally {
        setLoading(false)
      }
    }

    fetchCatalogData()
  }, [selectedCategory, searchQuery, sortBy, sortOrder])

  // Handle filter changes
  const handleCategoryChange = (e) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('category', e.target.value)
    setSearchParams(newParams)
  }

  const handleInputChange = (e) => {
    setSearchInput(e.target.value)
  }

  // Handle search execution (triggered by button click or Enter key)
  const handleSearchExecute = () => {
    const newParams = new URLSearchParams(searchParams)
    if (searchInput.trim()) {
      newParams.set('search', searchInput.trim())
    } else {
      newParams.delete('search')
    }
    setSearchParams(newParams)
  }

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchExecute()
    }
  }

  const handleSortChange = (e) => {
    const [newSortBy, newSortOrder] = e.target.value.split('-')
    const newParams = new URLSearchParams(searchParams)
    newParams.set('sortBy', newSortBy)
    newParams.set('sortOrder', newSortOrder)
    setSearchParams(newParams)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Catalog</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-purple-600 text-white px-4 py-2 rounded-md"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Design Catalog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse our extensive collection of AI-generated and traditional designs
          </p>
        </div>

        {/* Wishlist Message */}
        {wishlistMessage && (
          <div className="mb-6 max-w-md mx-auto">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-green-600 mr-2">✅</span>
                <span className="text-green-800 text-sm">{wishlistMessage}</span>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-2">
                Search
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search Designs"
                  value={searchInput}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className="flex-1 h-12 px-4 border border-gray-300 rounded-lg text-base bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <button 
                  onClick={handleSearchExecute}
                  className="h-12 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center"
                  type="button"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={handleSortChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="basePrice-asc">Price: Low to High</option>
                <option value="basePrice-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {designs.length} {designs.length === 1 ? 'design' : 'designs'}
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {/* Design Grid */}
        {designs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {designs.map(design => (
              <DesignCard 
                key={design._id} 
                design={design}
                user={user}
                onWishlistToggle={handleWishlistToggle}
                isInWishlist={isInWishlist(design._id)}
                wishlistLoading={wishlistLoading}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No designs found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchParams(new URLSearchParams())
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Catalog
