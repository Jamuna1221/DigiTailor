import { useState, useEffect } from 'react'
import GalleryForm from '../../components/gallery/GalleryForm.jsx'
import GalleryTable from '../../components/gallery/GalleryTable.jsx'

const API_BASE_URL = 'http://localhost:5000/api'

function ManageGallery() {
  const [items, setItems] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch gallery items from backend
  const fetchGalleryItems = async () => {
    try {
      setLoading(true)
      setError('') // Clear any previous errors
      
      const response = await fetch(`${API_BASE_URL}/gallery?_t=${Date.now()}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success && Array.isArray(data.data)) {
        setItems([...data.data])
        console.log(`✅ Loaded ${data.data.length} gallery items`)
      } else {
        setError(data.message || 'Failed to load gallery items')
        setItems([]) // Reset to empty array on error
      }
    } catch (err) {
      console.error('❌ Error fetching gallery:', err)
      setError('Failed to connect to server. Please check your internet connection.')
      setItems([]) // Reset to empty array on error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGalleryItems()
  }, [])

  // Create new gallery item via API
  const handleCreate = async (newItem) => {
    try {
      setLoading(true)
      console.log('📝 Creating gallery item:', newItem)
      
      // Validate required fields
      if (!newItem.title || !newItem.afterImage) {
        alert('Please fill in all required fields (Title and Image)')
        return
      }
      
      const response = await fetch(`${API_BASE_URL}/gallery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newItem.title?.trim(),
          category: newItem.category || 'General',
          style: newItem.style || 'Modern',
          beforeImage: newItem.beforeImage?.trim() || null,
          afterImage: newItem.afterImage?.trim(),
          customerName: newItem.customerName?.trim() || null,
          customerStory: newItem.customerStory?.trim() || null,
          satisfaction: Math.min(Math.max(parseInt(newItem.satisfaction) || 5, 1), 5),
          designTime: newItem.designTime?.trim() || '7 days',
          occasion: newItem.occasion?.trim() || null,
          isFeatured: Boolean(newItem.isFeatured),
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('📝 Create response:', data)
      
      if (data.success && data.data) {
        // Add new item to the beginning of the list for better UX
        setItems(prevItems => [data.data, ...prevItems])
        setShowForm(false)
        setEditingItem(null)
        alert('Gallery story created successfully!')
      } else {
        alert(`Error: ${data.message || 'Failed to create gallery story'}`)
      }
    } catch (err) {
      console.error('❌ Error creating gallery item:', err)
      alert('Failed to create gallery story. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Update gallery item via API
  const handleUpdate = async (updatedItem) => {
    try {
      setLoading(true)
      console.log('✏️ Updating gallery item:', updatedItem)
      
      // Validate that we have a valid ID
      const itemId = updatedItem._id
      if (!itemId || itemId === 'undefined' || itemId === 'null') {
        console.error('❌ Invalid item ID for update:', itemId)
        alert('Error: Invalid item ID. Please refresh the page and try again.')
        return
      }
      
      // Validate required fields
      if (!updatedItem.title || !updatedItem.afterImage) {
        alert('Please fill in all required fields (Title and Image)')
        return
      }
      
      const response = await fetch(`${API_BASE_URL}/gallery/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: updatedItem.title?.trim(),
          category: updatedItem.category || 'General',
          style: updatedItem.style || 'Modern',
          beforeImage: updatedItem.beforeImage?.trim() || null,
          afterImage: updatedItem.afterImage?.trim(),
          customerName: updatedItem.customerName?.trim() || null,
          customerStory: updatedItem.customerStory?.trim() || null,
          satisfaction: Math.min(Math.max(parseInt(updatedItem.satisfaction) || 5, 1), 5),
          designTime: updatedItem.designTime?.trim() || '7 days',
          occasion: updatedItem.occasion?.trim() || null,
          isFeatured: Boolean(updatedItem.isFeatured)
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('✏️ Update response:', data)
      
      if (data.success && data.data) {
        // Update the specific item in state
        setItems(prevItems => 
          prevItems.map(item => 
            item._id === itemId ? { ...data.data } : item
          )
        )
        setEditingItem(null)
        setShowForm(false)
        alert('Gallery story updated successfully!')
      } else {
        alert(`Error: ${data.message || 'Failed to update gallery story'}`)
      }
    } catch (err) {
      console.error('❌ Error updating gallery item:', err)
      alert('Failed to update gallery story. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Delete gallery item via API
  const handleDelete = async (id) => {
    // Validate ID before proceeding
    if (!id || id === 'undefined' || id === 'null') {
      console.error('❌ Invalid item ID for delete:', id)
      alert('Error: Invalid item ID. Please refresh the page and try again.')
      return
    }

    if (!window.confirm('Delete this gallery story? This action cannot be undone.')) return

    try {
      setLoading(true)
      console.log('🗑️ Deleting gallery item:', id)
      
      const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('🗑️ Delete response:', data)
      
      if (data.success) {
        // Remove item from state immediately
        setItems(prevItems => prevItems.filter(item => item._id !== id))
        alert('Gallery story deleted successfully!')
      } else {
        alert(`Error: ${data.message || 'Failed to delete gallery story'}`)
      }
    } catch (err) {
      console.error('❌ Error deleting gallery item:', err)
      alert('Failed to delete gallery story. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle edit button click
 // Handle edit button click
const handleEdit = (item) => {
  console.log('✏️ Editing item:', item)
  
  // Validate item has required ID
  if (!item._id) {
    console.error('❌ Item missing _id:', item)
    alert('Error: Item ID is missing. Please refresh the page and try again.')
    return
  }
  
  // Create a clean copy of the item for editing with guaranteed _id
  const editItem = {
    ...item,
    _id: item._id, // Explicitly ensure _id is preserved
    // Ensure all fields exist with fallbacks
    title: item.title || '',
    category: item.category || 'General',
    style: item.style || 'Modern',
    beforeImage: item.beforeImage || '',
    afterImage: item.afterImage || '',
    customerName: item.customerName || '',
    customerStory: item.customerStory || '',
    satisfaction: item.satisfaction || 5,
    designTime: item.designTime || '7 days',
    occasion: item.occasion || '',
    isFeatured: Boolean(item.isFeatured)
  }
  
  console.log('✅ Edit item prepared with ID:', editItem._id)
  
  setEditingItem(editItem)
  setShowForm(true)
}

  // Loading state for initial load
  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading gallery items...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Gallery</h1>
          <p className="text-gray-600">Showcase your best design transformations</p>
        </div>
        <button
          onClick={() => { 
            setEditingItem(null)
            setShowForm(true) 
          }}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {loading ? 'Loading...' : 'Add Story'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800">{error}</p>
          </div>
          <button 
            onClick={() => {
              setError('')
              fetchGalleryItems()
            }}
            className="mt-2 text-red-600 hover:text-red-800 font-medium underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Stories</h3>
              <p className="text-2xl font-bold text-gray-900">{items.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Featured</h3>
              <p className="text-2xl font-bold text-blue-600">{items.filter(item => item.isFeatured).length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Categories</h3>
              <p className="text-2xl font-bold text-purple-600">{[...new Set(items.map(item => item.category))].length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Avg Rating</h3>
              <p className="text-2xl font-bold text-green-600">
                {items.length > 0 ? (items.reduce((sum, item) => sum + (item.satisfaction || 5), 0) / items.length).toFixed(1) : '5.0'}⭐
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <GalleryForm
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

      {/* Gallery Display */}
      <div className="bg-white rounded-xl shadow border">
        {items.length === 0 && !loading ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">📸</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No gallery stories yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create your first transformation story to inspire customers and showcase your amazing work.
            </p>
            <button
              onClick={() => { 
                setEditingItem(null)
                setShowForm(true) 
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create Your First Story
            </button>
          </div>
        ) : (
          <GalleryTable
            items={items}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        )}
      </div>

      {/* Loading overlay for operations */}
      {loading && items.length > 0 && (
        <div className="fixed inset-0 bg-black/20 z-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
              <span className="text-gray-700 font-medium">Processing...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageGallery
