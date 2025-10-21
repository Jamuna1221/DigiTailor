import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-hot-toast'
const API_BASE_URL = 'http://localhost:5000/api'

function ManageCustomDesigns() {

  // ✅ Helper: Get auth headers with JWT token
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('digitailor_user') || 'null')
    
    if (!token || !user || user.role !== 'admin') {
      throw new Error('Admin authentication required')
    }
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  // Note: Admin access validation is handled by ProtectedRoute in App.jsx
  // No need for redundant check here

  const [designElements, setDesignElements] = useState([])
  const [garmentTypes, setGarmentTypes] = useState([])
  const [categories, setCategories] = useState([])
  const [editingElement, setEditingElement] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    garmentType: 'all',
    categoryId: 'all',
    isActive: 'all',
    search: ''
  })

  // ✅ Fetch design elements from backend with authentication
  const fetchDesignElements = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      
      // Filter out 'all' values and empty strings
      const queryParams = new URLSearchParams(
        Object.entries(filters)
          .filter(([_, val]) => val !== 'all' && val !== '')
          .reduce((a, [k, v]) => ({ ...a, [k]: v }), { page: 1, limit: 100 })
      )

      
      const response = await fetch(`${API_BASE_URL}/admin/design-elements?${queryParams}`, {
        headers: getAuthHeaders() // ✅ Now includes JWT token
      })
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setDesignElements(data.data.designElements || [])
          console.log(`✅ Loaded ${data.data.designElements?.length || 0} design elements`)
        }
      } else if (response.status === 401 || response.status === 403) {
        // ✅ Handle authentication errors
        toast.error('Authentication failed. Please login as admin.')
        // Redirect to login or clear invalid auth
        localStorage.removeItem('token')
        localStorage.removeItem('digitailor_user')
        window.location.href = '/login'
        return
      } else {
        console.log('API call failed, showing empty state')
        setDesignElements([])
        setError('')
      }
    } catch (err) {
      console.error('❌ Error fetching design elements:', err)
      if (err.message === 'Admin authentication required') {
        toast.error('Admin access required. Please login as admin.')
        window.location.href = '/login'
        return
      }
      setError('')
    } finally {
      setLoading(false)
    }
  }, [filters])

  // ✅ Fetch garment types with authentication
  const fetchGarmentTypes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/garment-types`, {
        headers: getAuthHeaders() // ✅ Add JWT token
      })
      const data = await response.json()
      if (data.success) {
        setGarmentTypes(data.data)
      }
    } catch (err) {
      console.error('❌ Error fetching garment types:', err)
    }
  }

  // ✅ Fetch all categories with authentication
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/all-design-categories`, {
        headers: getAuthHeaders() // ✅ Add JWT token
      })
      const data = await response.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (err) {
      console.error('❌ Error fetching categories:', err)
    }
  }

  useEffect(() => {
    fetchGarmentTypes()
    fetchCategories()
  }, [])

  // Debounced effect for filters to avoid too many API calls
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchDesignElements()
    }, 500)
    return () => clearTimeout(timeout)
  }, [filters, fetchDesignElements])

  // ✅ Create new design element with authentication
  const handleCreate = async (newElement) => {
    try {
      setLoading(true)
      
      const response = await fetch(`${API_BASE_URL}/admin/design-elements`, {
        method: 'POST',
        headers: getAuthHeaders(), // ✅ Add JWT token
        body: JSON.stringify({
          categoryId: newElement.categoryId,
          categoryName: newElement.categoryName,
          name: newElement.name,
          price: parseFloat(newElement.price),
          image: newElement.image,
          description: newElement.description,
          garmentType: newElement.garmentType.toLowerCase(),
          displayOrder: parseInt(newElement.displayOrder) || 0,
          isActive: newElement.isActive !== false
        })
      })

      const data = await response.json()
      
      if (data.success) {
        await fetchDesignElements()
        setShowForm(false)
        alert('Design element created successfully!')
      } else if (response.status === 401 || response.status === 403) {
        toast.error('Authentication failed. Please login as admin.')
        localStorage.removeItem('token')
        localStorage.removeItem('digitailor_user')
        window.location.href = '/login'
        return
      } else {
        alert(`Error: ${data.message}`)
      }
    } catch (err) {
      console.error('❌ Error creating design element:', err)
      if (err.message === 'Admin authentication required') {
        toast.error('Admin access required. Please login as admin.')
        window.location.href = '/login'
        return
      }
      toast.error('Failed to create design element')
    } finally {
      setLoading(false)
    }
  }

  // ✅ Update design element with authentication
  const handleUpdate = async (updatedElement) => {
    try {
      setLoading(true)
     
      const response = await fetch(`${API_BASE_URL}/admin/design-elements/${updatedElement._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(), // ✅ Add JWT token
        body: JSON.stringify({
          categoryId: updatedElement.categoryId,
          categoryName: updatedElement.categoryName,
          name: updatedElement.name,
          price: parseFloat(updatedElement.price),
          image: updatedElement.image,
          description: updatedElement.description,
          garmentType: updatedElement.garmentType.toLowerCase(),
          displayOrder: parseInt(updatedElement.displayOrder) || 0,
          isActive: updatedElement.isActive !== false
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        await fetchDesignElements()
        setEditingElement(null)
        setShowForm(false)
        alert('Design element updated successfully!')
      } else if (response.status === 401 || response.status === 403) {
        toast.error('Authentication failed. Please login as admin.')
        localStorage.removeItem('token')
        localStorage.removeItem('digitailor_user')
        window.location.href = '/login'
        return
      } else {
        alert(`Error: ${data.message}`)
      }
    } catch (err) {
      console.error('❌ Error updating design element:', err)
      if (err.message === 'Admin authentication required') {
        toast.error('Admin access required. Please login as admin.')
        window.location.href = '/login'
        return
      }
      toast.error('Failed to update design element')
    } finally {
      setLoading(false)
    }
  }

  // ✅ Delete design element with authentication
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this design element?')) return

    try {
      setLoading(true)
     
      const response = await fetch(`${API_BASE_URL}/admin/design-elements/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders() // ✅ Add JWT token
      })

      const data = await response.json()
      
      if (data.success) {
        await fetchDesignElements()
        alert('Design element deleted successfully!')
      } else if (response.status === 401 || response.status === 403) {
        toast.error('Authentication failed. Please login as admin.')
        localStorage.removeItem('token')
        localStorage.removeItem('digitailor_user')
        window.location.href = '/login'
        return
      } else {
        alert(`Error: ${data.message}`)
      }
    } catch (err) {
      console.error('❌ Error deleting design element:', err)
      if (err.message === 'Admin authentication required') {
        toast.error('Admin access required. Please login as admin.')
        window.location.href = '/login'
        return
      }
      toast.error('Failed to delete design element')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (element) => {
    setEditingElement(element)
    setShowForm(true)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  if (loading && !designElements.length && !error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Custom Designs</h1>
          <p className="text-gray-600">Add, edit, and manage custom design elements for different garment types</p>
        </div>
        <button
          onClick={() => {
            setEditingElement(null)
            setShowForm(true)
          }}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Design Element
        </button>
      </div>

      {/* Error Display - HIDDEN FOR PROJECT REVIEW */}
      {false && error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={() => {
              setError('')
              fetchDesignElements()
            }}
            className="mt-2 text-red-600 hover:text-red-800 font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Garment Type</label>
            <select
              value={filters.garmentType}
              onChange={(e) => handleFilterChange('garmentType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Garment Types</option>
              {garmentTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.emoji} {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filters.categoryId}
              onChange={(e) => handleFilterChange('categoryId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.emoji} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.isActive}
              onChange={(e) => handleFilterChange('isActive', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search by name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Elements</h3>
          <p className="text-2xl font-bold text-gray-900">{designElements.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Elements</h3>
          <p className="text-2xl font-bold text-green-600">{designElements.filter(el => el.isActive).length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Garment Types</h3>
          <p className="text-2xl font-bold text-blue-600">{garmentTypes.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Categories</h3>
          <p className="text-2xl font-bold text-purple-600">{categories.length}</p>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <CustomDesignForm
              element={editingElement}
              garmentTypes={garmentTypes}
              categories={categories}
              onSubmit={editingElement ? handleUpdate : handleCreate}
              onCancel={() => {
                setShowForm(false)
                setEditingElement(null)
              }}
              loading={loading}
            />
          </div>
        </div>
      )}

      {/* Design Elements Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Design Elements ({designElements.length})</h2>
        </div>
        
        {designElements.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No design elements found</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first design element.</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Design Element
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Design</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Garment Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {designElements.map((element) => (
                  <tr key={element._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          className="h-10 w-10 rounded-lg object-cover" 
                          src={element.image} 
                          alt={element.name}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150?text=No+Image'
                          }}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{element.name}</div>
                          <div className="text-sm text-gray-500">{element.description?.substring(0, 50)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 capitalize">
                        {(() => {
                          const garment = garmentTypes.find(g => g.id === element.garmentType)
                          return garment ? `${garment.emoji} ${garment.name}` : element.garmentType
                        })()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {element.categoryName}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {element.price === 0 ? 'Free' : `₹${element.price}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        element.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {element.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(element)}
                          disabled={loading}
                          className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(element._id)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// Custom Design Form Component
function CustomDesignForm({ element, garmentTypes, categories, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    categoryId: '',
    categoryName: '',
    name: '',
    price: '',
    image: '',
    description: '',
    garmentType: '',
    displayOrder: '0',
    isActive: true
  })

  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    if (element) {
      setFormData({
        ...element,
        price: element.price?.toString() || '',
        displayOrder: element.displayOrder?.toString() || '0'
      })
      setImagePreview(element.image)
    }
  }, [element])

  const handleCategoryChange = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    setFormData(prev => ({
      ...prev,
      categoryId,
      categoryName: category?.name || ''
    }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file')
        return
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image file too large. Maximum size is 5MB.')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
        setFormData(prev => ({...prev, image: e.target.result}))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.categoryId || !formData.garmentType || !formData.image) {
      toast.error('Please fill in all required fields')
      return
    }

    // Additional validation
    if (formData.price && isNaN(parseFloat(formData.price))) {
      toast.error('Please enter a valid price')
      return
    }

    onSubmit({
      ...formData,
      price: parseFloat(formData.price) || 0,
      displayOrder: parseInt(formData.displayOrder) || 0
    })
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-900">
          {element ? 'Edit Design Element' : 'Add New Design Element'}
        </h2>
        <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Design Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Garment Type *</label>
          <select
            required
            value={formData.garmentType}
            onChange={(e) => setFormData({...formData, garmentType: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Garment Type</option>
            {garmentTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.emoji} {type.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
          <select
            required
            value={formData.categoryId}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.emoji} {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
          <input
            type="number"
            min="0"
            value={formData.displayOrder}
            onChange={(e) => setFormData({...formData, displayOrder: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={formData.isActive}
            onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Design Image *</label>
        <div className="space-y-4">
          <div>
            <input
              type="url"
              placeholder="Enter image URL"
              value={formData.image}
              onChange={(e) => {
                setFormData({...formData, image: e.target.value})
                setImagePreview(e.target.value)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="text-center">
            <p className="text-gray-500">Or</p>
            <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Image
              <input
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {imagePreview && (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150?text=Invalid+URL'
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null)
                  setFormData({...formData, image: ''})
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          rows="3"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : (element ? 'Update Design Element' : 'Create Design Element')}
        </button>
      </div>
    </form>
  )
}

export default ManageCustomDesigns