import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../components/common/Modal'
import DesignElementCard from '../components/design/DesignElementCard'
import DesignElementAPI from '../services/designElementAPI'

const CustomStudio = () => {
  const navigate = useNavigate()
  
  // State for main workflow toggle  
  const [workflow, setWorkflow] = useState('modular') // Only modular workflow available
  const [selectedCategory, setSelectedCategory] = useState(null)
  
  // Garment selection states
  const [garmentTypes, setGarmentTypes] = useState([])
  const [selectedGarmentType, setSelectedGarmentType] = useState('kurti')
  const [garmentLoading, setGarmentLoading] = useState(true)
  
  // API Data states
  const [designCategories, setDesignCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [apiLoading, setApiLoading] = useState(true)
  
  // Modular Design States
  const [modularDesign, setModularDesign] = useState({
    category: null,
    selections: {}, // Will hold selected design elements
    totalPrice: 180, // Base price of 180
    customerInfo: {
      name: '',
      phone: '',
      email: ''
    }
  })
  

  // General states
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: '' })


  // Fetch garment types on component mount
  useEffect(() => {
    const fetchGarmentTypes = async () => {
      try {
        setGarmentLoading(true)
        const types = await DesignElementAPI.getGarmentTypes()
        setGarmentTypes(types)
        console.log('📦 Fetched garment types:', types)
        
        // Set first garment type as default if available
        if (types.length > 0) {
          setSelectedGarmentType(types[0].id)
        }
      } catch (error) {
        console.error('❌ Error fetching garment types:', error)
        alert('Failed to load garment types. Please refresh the page.')
      } finally {
        setGarmentLoading(false)
      }
    }

    fetchGarmentTypes()
  }, [])

  // Fetch design categories for the selected garment type
  useEffect(() => {
    const fetchDesignCategories = async () => {
      try {
        setApiLoading(true)
        // Get categories for the selected garment type
        const categories = await DesignElementAPI.getAllDesignCategories(selectedGarmentType)
        
        // Validate and clean the data
        const validCategories = categories.filter(category => {
          if (!category.id || !category.name) {
            console.warn('Invalid category found:', category)
            return false
          }
          return true
        })
        
        setDesignCategories(validCategories)
        console.log(`📦 Fetched categories for ${selectedGarmentType}:`, validCategories)
      } catch (error) {
        console.error('❌ Error fetching design categories:', error)
        // You could show an error message to the user here
        alert('Failed to load design categories. Please refresh the page.')
      } finally {
        setApiLoading(false)
      }
    }

    // Only fetch if we have a selected garment type
    if (selectedGarmentType) {
      fetchDesignCategories()
    }
  }, [selectedGarmentType])

  // Handle garment type change
  const handleGarmentTypeChange = (newGarmentType) => {
    setSelectedGarmentType(newGarmentType)
    // Clear the selected category since design counts will change
    setSelectedCategory(null)
    // Clear any existing selections since they're for the previous garment type
    setModularDesign(prev => ({
      ...prev,
      selections: {},
      totalPrice: 180 // Reset to base price
    }))
  }

  // Handle category click - fetch designs for the selected garment type
  const handleCategoryClick = async (category) => {
    try {
      setApiLoading(true)
      // Fetch designs for this category and current garment type
      const designs = await DesignElementAPI.getDesignsByCategory(category.id, selectedGarmentType)
      
      // Create an updated category object with the fetched designs
      const categoryWithDesigns = {
        ...category,
        designs: designs || []
      }
      
      setSelectedCategory(categoryWithDesigns)
    } catch (error) {
      console.error('Error fetching category designs:', error)
      alert(`Failed to load ${category.name} designs. Please try again.`)
    } finally {
      setApiLoading(false)
    }
  }

  // Handle design element selection for modular workflow
  const handleDesignSelection = (categoryId, design) => {
    // Validate inputs
    if (!categoryId || !design || !design.id || !design.name || design.price === undefined) {
      console.error('Invalid design selection:', { categoryId, design })
      return
    }
    
    setModularDesign(prev => {
      const newSelections = { ...prev.selections }
      
      // Update selection with the design object
      newSelections[categoryId] = design
      
      // Calculate new total price
      const newTotalPrice = Object.values(newSelections).reduce((total, selection) => {
        return total + (selection?.price || 0)
      }, 180) // Base price of 180
      
      return {
        ...prev,
        selections: newSelections,
        totalPrice: newTotalPrice
      }
    })
  }


  // Handle navigate to checkout
  const handleProceedToCheckout = () => {
    if (Object.keys(modularDesign.selections).length === 0) {
      alert('Please select at least one design element before proceeding to checkout.')
      return
    }

    // Prepare order data to pass to checkout
    const orderData = {
      customerInfo: modularDesign.customerInfo,
      selections: Object.entries(modularDesign.selections).map(([categoryId, selection]) => ({
        categoryId: categoryId,
        categoryName: selection.categoryName || designCategories.find(cat => cat.id === categoryId)?.name,
        id: selection.id,
        name: selection.name,
        price: selection.price,
        image: selection.image,
        description: selection.description
      })),
      totalPrice: modularDesign.totalPrice,
      garmentType: garmentTypes.find(g => g.id === selectedGarmentType)
    }

    // Navigate to checkout page with order data
    navigate('/modular-checkout', {
      state: { orderData },
      replace: false
    })
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-[#0B1220] dark:via-[#0B1220] dark:to-[#0B1220] dark:text-white relative">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              ✨ Custom Design Studio ✨
            </h1>
            <div className="absolute -top-2 -right-2 animate-bounce">🎨</div>
            <div className="absolute -top-1 -left-3 animate-pulse">✨</div>
          </div>
          <p className="text-xl text-gray-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Create your perfect outfit with modular design elements or upload reference images for custom tailoring!
          </p>
        </div>


        {/* Garment Type Selection Dropdown */}
        {workflow === 'modular' && (
          <div className="bg-white/90 dark:bg-[#111827] backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 dark:border-slate-800 mb-8">
            <div className="flex items-center justify-center gap-4">
              <label className="text-lg font-semibold text-gray-700 dark:text-white">
                👗 Garment Type:
              </label>
              {garmentLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600 mr-2"></div>
                  <span className="text-gray-600 dark:text-slate-300">Loading...</span>
                </div>
              ) : (
                <select
                  value={selectedGarmentType}
                  onChange={(e) => handleGarmentTypeChange(e.target.value)}
                  className="px-4 py-2 border-2 border-purple-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-[#0f172a] dark:text-white min-w-48 text-center font-medium"
                >
                  {garmentTypes.map((garmentType) => (
                    <option key={garmentType.id} value={garmentType.id}>
                      {garmentType.emoji} {garmentType.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        )}

        {/* Modular Design Elements Section */}
        {workflow === 'modular' && (
          <div className="space-y-8">
            {!selectedCategory ? (
              /* Design Categories Grid */
              <div className="bg-white/90 dark:bg-[#111827] backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 dark:border-slate-800">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 text-center">
                  Choose Design Categories
                </h2>
                <p className="text-center text-gray-600 dark:text-slate-300 mb-8">
                  Customize your {garmentTypes.find(g => g.id === selectedGarmentType)?.name || selectedGarmentType} with these design options
                </p>
                {apiLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    <span className="ml-3 text-gray-600 dark:text-slate-300">Loading design categories...</span>
                  </div>
                ) : designCategories.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">😔</div>
                    <p className="text-gray-600 dark:text-slate-300">No design categories available at the moment.</p>
                    <button 
                      onClick={() => window.location.reload()} 
                      className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Refresh Page
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {designCategories.map((category) => (
                      <div
                        key={category.id}
                        onClick={() => handleCategoryClick(category)}
                        className="bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 border-2 border-gray-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-600 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl group"
                      >
                        <div className="text-center">
                          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{category.emoji}</div>
                          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{category.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-slate-300 mb-4">{category.description}</p>
                          <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg py-2 px-4">
                            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                              {category.designs || 0} Designs Available
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Selected Category Options */
              <div className="bg-white/90 dark:bg-[#111827] backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 dark:border-slate-800">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {selectedCategory.emoji} {selectedCategory.name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                      For {garmentTypes.find(g => g.id === selectedGarmentType)?.name || selectedGarmentType}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-white px-6 py-2 rounded-xl font-medium transition-colors"
                  >
                    ← Back to Categories
                  </button>
                </div>
                <p className="text-gray-600 dark:text-slate-300 mb-8 text-center">{selectedCategory.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(selectedCategory.designs || []).filter(design => design && design.id && design.name).map((design) => {
                    const isSelected = modularDesign.selections[selectedCategory.id]?.id === design.id
                    return (
                      <DesignElementCard
                        key={design.id || Math.random()}
                        design={design}
                        onAdd={(selectedDesign) => handleDesignSelection(selectedCategory.id, selectedDesign)}
                        isSelected={isSelected}
                      />
                    )
                  })}
                </div>
              </div>
            )}
            
            {/* Selected Design Elements Summary */}
            {Object.keys(modularDesign.selections).length > 0 && (
              <div className="bg-white/90 dark:bg-[#111827] backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 dark:border-slate-800">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                  📋 Your Selected Design Elements
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-purple-200 dark:border-purple-700">
                        <th className="text-left p-4 font-bold text-purple-600 dark:text-purple-400">
                          Design Category
                        </th>
                        <th className="text-left p-4 font-bold text-purple-600 dark:text-purple-400">
                          Selected Option
                        </th>
                        <th className="text-right p-4 font-bold text-purple-600 dark:text-purple-400">
                          Price
                        </th>
                        <th className="text-center p-4 font-bold text-purple-600 dark:text-purple-400">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {designCategories.map((category) => {
                        const selection = modularDesign.selections[category.id]
                        return (
                          <tr 
                            key={category.id} 
                            className={`border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors ${
                              selection ? 'bg-green-50 dark:bg-green-900/10' : 'bg-gray-50 dark:bg-slate-800/50'
                            }`}
                          >
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">{category.emoji}</span>
                                <div>
                                  <div className="font-semibold text-gray-800 dark:text-white">
                                    {category.name}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-slate-400">
                                    {category.description}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              {selection ? (
                                <div className="flex items-center space-x-3">
                                  <img 
                                    src={selection.image || '/api/placeholder/60x60'}
                                    alt={selection.name}
                                    className="w-12 h-12 rounded-lg object-cover shadow-md"
                                    onError={(e) => {
                                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxOEg0MFY0MkgyMFYxOFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2Zz4K'
                                    }}
                                  />
                                  <div>
                                    <div className="font-semibold text-gray-800 dark:text-white text-sm">
                                      {selection.name}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-slate-400">
                                      ✓ Selected
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-400 dark:text-slate-500 italic">
                                  Not selected
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-right">
                              {selection ? (
                                <span className={`font-bold ${
                                  selection.price === 0 
                                    ? 'text-green-600 dark:text-green-400' 
                                    : 'text-purple-600 dark:text-purple-400'
                                }`}>
                                  {selection.price === 0 ? 'Free' : `+₹${selection.price}`}
                                </span>
                              ) : (
                                <span className="text-gray-400 dark:text-slate-500">
                                  ₹0
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                  selection 
                                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50'
                                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                                }`}
                              >
                                {selection ? 'Change' : 'Select'}
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20">
                        <td colSpan="2" className="p-4">
                          <div className="font-bold text-lg text-purple-700 dark:text-purple-300">
                            Total (Base: ₹180 + Selected Options)
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            ₹{modularDesign.totalPrice.toLocaleString()}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                            {Object.keys(modularDesign.selections).length} / {designCategories.filter(cat => cat.designs && cat.designs.length > 0).length} Selected
                          </div>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                
                {/* Quick Actions */}
                <div className="mt-6 flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={() => {
                      setModularDesign(prev => ({
                        ...prev,
                        selections: {},
                        totalPrice: 180
                      }))
                    }}
                    className="px-6 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  >
                    🗑️ Clear All Selections
                  </button>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="px-6 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    🎨 Continue Selecting
                  </button>
                </div>
              </div>
            )}
            
            {/* Order Summary & Proceed to Checkout */}
            {Object.keys(modularDesign.selections).length > 0 && (
              <div className="bg-white/90 dark:bg-[#111827] backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 dark:border-slate-800">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">📋 Order Summary</h3>
                
                <div className="max-w-2xl mx-auto">
                  <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600 dark:text-slate-300">Base Price</span>
                      <span className="font-bold text-gray-800 dark:text-white">₹180</span>
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-slate-700 pt-4 space-y-2">
                      {Object.entries(modularDesign.selections).map(([categoryId, selection]) => {
                        const category = designCategories.find(cat => cat.id === categoryId)
                        return (
                          <div key={categoryId} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-slate-300">
                              {category?.name}: {selection.name}
                            </span>
                            <span className="text-sm font-medium text-gray-800 dark:text-white">
                              {selection.price === 0 ? 'Free' : `+₹${selection.price}`}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                    
                    <div className="border-t-2 border-purple-200 dark:border-purple-700 pt-4 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-purple-600 dark:text-purple-400">Total Price</span>
                        <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">₹{modularDesign.totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <button
                      onClick={handleProceedToCheckout}
                      className="w-full py-4 px-6 rounded-xl font-bold text-white text-lg transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                    >
                      🛍️ Proceed to Checkout - ₹{modularDesign.totalPrice.toLocaleString()}
                    </button>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
                      You'll provide shipping details and payment method on the next page
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}


      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalContent.title}
      >
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">
            {modalContent.type === 'success' ? '🎉' : modalContent.type === 'enquiry' ? '💬' : '🎉'}
          </div>
          <p className="text-gray-600 dark:text-slate-300 mb-6 leading-relaxed">
            {modalContent.message}
          </p>
          <button
            onClick={() => setShowModal(false)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg w-full"
          >
            {modalContent.type === 'success' ? 'Awesome! Thanks 🙌' : 'Got it! Thanks 💫'}
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default CustomStudio