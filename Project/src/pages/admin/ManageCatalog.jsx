
import { useState, useEffect } from 'react'

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`

function ManageCatalog() {
  const [items, setItems] = useState([])
  const [editingItem, setEditingItem] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch catalogs from backend
  const fetchCatalogs = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/catalog`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setItems(data.data)
        console.log(`✅ Loaded ${data.data.length} catalog items`)
      } else {
        setError(data.message || 'Failed to load catalog')
      }
    } catch (err) {
      console.error('❌ Error fetching catalogs:', err)
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCatalogs()
  }, [])

  // Create new item via API
  const handleCreate = async (newItem) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/catalog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newItem.name,
          description: newItem.description,
          category: newItem.style,
          basePrice: parseFloat(newItem.basePrice),
          primaryImage: newItem.primaryImage,
          tags: [newItem.style],
          difficulty: newItem.difficulty,
          estimatedDays: parseInt(newItem.standardDays),
          isFeatured: false
        })
      })

      const data = await response.json()
      
      if (data.success) {
        await fetchCatalogs() // Refresh list
        setShowForm(false)
        alert('Design created successfully!')
      } else {
        alert(`Error: ${data.message}`)
      }
    } catch (err) {
      console.error('❌ Error creating item:', err)
      alert('Failed to create design')
    } finally {
      setLoading(false)
    }
  }

  // Update item via API
  const handleUpdate = async (updatedItem) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/catalog/${updatedItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: updatedItem.name,
          description: updatedItem.description,
          category: updatedItem.style,
          basePrice: parseFloat(updatedItem.basePrice),
          primaryImage: updatedItem.primaryImage,
          tags: [updatedItem.style],
          difficulty: updatedItem.difficulty,
          estimatedDays: parseInt(updatedItem.standardDays)
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        await fetchCatalogs() // Refresh list
        setEditingItem(null)
        setShowForm(false)
        alert('Design updated successfully!')
      } else {
        alert(`Error: ${data.message}`)
      }
    } catch (err) {
      console.error('❌ Error updating item:', err)
      alert('Failed to update design')
    } finally {
      setLoading(false)
    }
  }

  // Delete item via API
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return

    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/catalog/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      
      if (data.success) {
        await fetchCatalogs() // Refresh list
        alert('Design deleted successfully!')
      } else {
        alert(`Error: ${data.message}`)
      }
    } catch (err) {
      console.error('❌ Error deleting item:', err)
      alert('Failed to delete design')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item) => {
    // Transform database item to form format
    const formItem = {
      ...item,
      id: item._id,
      style: item.category || item.tags?.[0] || 'Modern',
      standardDays: item.estimatedDays || 7,
      difficulty: item.difficulty?.charAt(0).toUpperCase() + item.difficulty?.slice(1) || 'Medium'
    }
    setEditingItem(formItem)
    setShowForm(true)
  }

  if (loading && items.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900">Manage Catalog</h1>
          <p className="text-gray-600">Add, edit, and manage your design catalog</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null)
            setShowForm(true)
          }}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Design
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={() => {
              setError('')
              fetchCatalogs()
            }}
            className="mt-2 text-red-600 hover:text-red-800 font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats Cards - Removed Featured card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Designs</h3>
          <p className="text-2xl font-bold text-gray-900">{items.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Categories</h3>
          <p className="text-2xl font-bold text-blue-600">{[...new Set(items.map(item => item.category))].length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Avg Price</h3>
          <p className="text-2xl font-bold text-purple-600">₹{Math.round(items.reduce((sum, item) => sum + (item.basePrice || 0), 0) / items.length || 0)}</p>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CatalogForm
              item={editingItem}
              onSubmit={editingItem ? handleUpdate : handleCreate}
              onCancel={() => {
                setShowForm(false)
                setEditingItem(null)
              }}
              loading={loading}
            />
          </div>
        </div>
      )}

      {/* Catalog Table - Removed Difficulty and Status columns */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">All Designs ({items.length})</h2>
        </div>
        
        {items.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No designs found</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first design.</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Design
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Design</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          className="h-10 w-10 rounded-lg object-cover" 
                          src={item.primaryImage} 
                          alt={item.name}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150?text=No+Image'
                          }}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.description?.substring(0, 50)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{item.basePrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.estimatedDays} days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          disabled={loading}
                          className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
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


// Updated CatalogForm Component
function CatalogForm({ item, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    style: '',
    difficulty: 'Medium',
    standardDays: '7',
    primaryImage: '',
  })

  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    if (item) {
      setFormData({
        ...item,
        basePrice: item.basePrice?.toString() || '',
        standardDays: item.standardDays?.toString() || item.estimatedDays?.toString() || '7'
      })
      setImagePreview(item.primaryImage)
    }
  }, [item])

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
        setFormData(prev => ({...prev, primaryImage: e.target.result}))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.basePrice || !formData.primaryImage) {
      alert('Please fill in all required fields')
      return
    }

    onSubmit({
      ...formData,
      basePrice: parseFloat(formData.basePrice),
      standardDays: parseInt(formData.standardDays),
      updatedAt: new Date().toISOString()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-900">
          {item ? 'Edit Design' : 'Add New Design'}
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Base Price (₹) *</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.basePrice}
            onChange={(e) => setFormData({...formData, basePrice: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={formData.style}
            onChange={(e) => setFormData({...formData, style: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            <option value="blouse">Blouse</option>
            <option value="kurti">Kurti</option>
            <option value="Western dress">Western dress</option>
            <option value="mens_shirt">Men's Shirt</option>
            <option value="kids">Kids</option>
            <option value="bridal">Bridal</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
          <select
            value={formData.difficulty}
            onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Days</label>
          <input
            type="number"
            min="1"
            value={formData.standardDays}
            onChange={(e) => setFormData({...formData, standardDays: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Image *</label>
        <div className="space-y-4">
          <div>
            <input
              type="url"
              placeholder="Enter image URL"
              value={formData.primaryImage}
              onChange={(e) => {
                setFormData({...formData, primaryImage: e.target.value})
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
                  setFormData({...formData, primaryImage: ''})
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
          {loading ? 'Saving...' : (item ? 'Update Design' : 'Create Design')}
        </button>
      </div>
    </form>
  )
}

export default ManageCatalog
