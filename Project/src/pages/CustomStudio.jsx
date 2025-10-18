import React, { useState, useRef, useEffect } from 'react'
import Modal from '../components/common/Modal'
import DesignElementCard from '../components/design/DesignElementCard'
import DesignElementAPI from '../services/designElementAPI'

const CustomStudio = () => {
  // State for main workflow toggle
  const [workflow, setWorkflow] = useState('modular') // 'modular' or 'reference'
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
  
  // Reference Order States
  const [referenceOrder, setReferenceOrder] = useState({
    image: null,
    instructions: '',
    customerName: '',
    phone: '',
    email: ''
  })

  // General states
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: '' })

  // File refs
  const referenceUploadRef = useRef(null)

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

  // Fetch design categories (all categories, garment filtering happens when clicking on category)
  useEffect(() => {
    const fetchDesignCategories = async () => {
      try {
        setApiLoading(true)
        // Get all unique categories across all garment types
        const categories = await DesignElementAPI.getAllDesignCategories()
        
        // Validate and clean the data
        const validCategories = categories.filter(category => {
          if (!category.id || !category.name) {
            console.warn('Invalid category found:', category)
            return false
          }
          return true
        })
        
        setDesignCategories(validCategories)
        console.log('📦 Fetched and validated categories from API:', validCategories)
      } catch (error) {
        console.error('❌ Error fetching design categories:', error)
        // You could show an error message to the user here
        alert('Failed to load design categories. Please refresh the page.')
      } finally {
        setApiLoading(false)
      }
    }

    fetchDesignCategories()
  }, [])

  // Handle garment type change
  const handleGarmentTypeChange = (newGarmentType) => {
    setSelectedGarmentType(newGarmentType)
    // If we're currently viewing a category, reload its designs for the new garment type
    if (selectedCategory) {
      handleCategoryClick({ 
        id: selectedCategory.id, 
        name: selectedCategory.name,
        emoji: selectedCategory.emoji,
        description: selectedCategory.description
      })
    }
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

  // Handle reference image upload
  const handleReferenceImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setReferenceOrder(prev => ({...prev, image: e.target.result}))
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle modular design order submission
  const handleModularOrderSubmit = async () => {
    if (!modularDesign.customerInfo.name.trim() || !modularDesign.customerInfo.phone.trim()) {
      alert('Please fill in your name and phone number.')
      return
    }

    if (Object.keys(modularDesign.selections).length === 0) {
      alert('Please select at least one design element.')
      return
    }

    setLoading(true)
    try {
      // Prepare order data for API
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
        totalPrice: modularDesign.totalPrice
      }

      console.log('📦 Submitting order data:', orderData)
      
      const response = await DesignElementAPI.submitModularOrder(orderData)
      
      console.log('✅ Order submitted successfully:', response)
      
      setModalContent({
        title: 'Order Placed Successfully! 🎉',
        message: `Your custom design order has been placed successfully for ₹${modularDesign.totalPrice.toLocaleString()}! Order ID: ${response.data.orderId}. Our team will start working on it immediately.`,
        type: 'success'
      })
      setShowModal(true)
      
      // Reset form
      setModularDesign({
        category: null,
        selections: {},
        totalPrice: 180, // Reset to base price
        customerInfo: { name: '', phone: '', email: '' }
      })
      setSelectedCategory(null)
    } catch (error) {
      console.error('❌ Order submission failed:', error)
      alert(`Failed to submit order: ${error.message}. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  // Handle reference order enquiry submission
  const handleReferenceEnquirySubmit = async () => {
    if (!referenceOrder.image || !referenceOrder.instructions.trim() || 
        !referenceOrder.customerName.trim() || !referenceOrder.phone.trim()) {
      alert('Please fill in all required fields and upload a reference image.')
      return
    }

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Reference Enquiry Submitted:', {
        ...referenceOrder,
        orderType: 'reference',
        timestamp: new Date().toISOString()
      })
      
      setModalContent({
        title: 'Enquiry Submitted Successfully! 💬',
        message: 'Your reference image enquiry has been submitted successfully. Our design team will review it and contact you within 24 hours with pricing and details.',
        type: 'enquiry'
      })
      setShowModal(true)
      
      // Reset form
      setReferenceOrder({
        image: null,
        instructions: '',
        customerName: '',
        phone: '',
        email: ''
      })
    } catch (error) {
      console.error('Enquiry submission failed:', error)
      alert('Failed to submit enquiry. Please try again.')
    } finally {
      setLoading(false)
    }
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

        {/* Workflow Type Toggle */}
        <div className="bg-white/90 dark:bg-[#111827] backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 dark:border-slate-800 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setWorkflow('modular')
                setSelectedCategory(null)
              }}
              className={`flex-1 max-w-md py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                workflow === 'modular'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-slate-600'
              }`}
            >
              🎨 Modular Design Elements
            </button>
            <button
              onClick={() => setWorkflow('reference')}
              className={`flex-1 max-w-md py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                workflow === 'reference'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-slate-600'
              }`}
            >
              📸 Reference Image Enquiry
            </button>
          </div>
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
            
            {/* Order Summary & Customer Info */}
            {Object.keys(modularDesign.selections).length > 0 && (
              <div className="bg-white/90 dark:bg-[#111827] backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 dark:border-slate-800">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Order Summary */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">📋 Order Summary</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600 dark:text-slate-300">Base Price</span>
                          <span className="font-bold text-gray-800 dark:text-white">₹180</span>
                        </div>
                        <div className="border-t border-gray-200 dark:border-slate-700 pt-2">
                          {Object.entries(modularDesign.selections).map(([categoryId, selection]) => {
                            const category = designCategories.find(cat => cat.id === categoryId)
                            return (
                              <div key={categoryId} className="flex justify-between items-center mb-1">
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
                        <div className="border-t-2 border-purple-200 dark:border-purple-700 pt-2 mt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-purple-600 dark:text-purple-400">Total Price</span>
                            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">₹{modularDesign.totalPrice.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Customer Information */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">📝 Customer Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Your Name *</label>
                        <input
                          type="text"
                          value={modularDesign.customerInfo.name}
                          onChange={(e) => setModularDesign(prev => ({
                            ...prev,
                            customerInfo: { ...prev.customerInfo, name: e.target.value }
                          }))}
                          placeholder="Enter your full name"
                          className="w-full p-3 border-2 border-purple-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-[#0f172a] dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Phone Number *</label>
                        <input
                          type="tel"
                          value={modularDesign.customerInfo.phone}
                          onChange={(e) => setModularDesign(prev => ({
                            ...prev,
                            customerInfo: { ...prev.customerInfo, phone: e.target.value }
                          }))}
                          placeholder="Enter your phone number"
                          className="w-full p-3 border-2 border-purple-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-[#0f172a] dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Email (Optional)</label>
                        <input
                          type="email"
                          value={modularDesign.customerInfo.email}
                          onChange={(e) => setModularDesign(prev => ({
                            ...prev,
                            customerInfo: { ...prev.customerInfo, email: e.target.value }
                          }))}
                          placeholder="Enter your email address"
                          className="w-full p-3 border-2 border-purple-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-[#0f172a] dark:text-white"
                        />
                      </div>
                      <button
                        onClick={handleModularOrderSubmit}
                        disabled={loading}
                        className={`w-full py-4 px-6 rounded-xl font-bold text-white text-lg transition-all duration-300 transform hover:scale-105 ${
                          loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                        }`}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                            Processing Order...
                          </span>
                        ) : (
                          `📲 Place Order Now - ₹${modularDesign.totalPrice.toLocaleString()}`
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reference Image Enquiry Section */}
        {workflow === 'reference' && (
          <div className="bg-white/90 dark:bg-[#111827] backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 dark:border-slate-800 mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 text-center">
              📸 Reference Image Enquiry
            </h2>
            <p className="text-gray-600 dark:text-slate-300 text-center mb-8">
              Upload a reference image and provide detailed instructions. Our design team will review and provide you with a custom quote!
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-4">Upload Reference Image *</label>
                <div
                  onClick={() => referenceUploadRef.current?.click()}
                  className="border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-2xl p-8 text-center cursor-pointer hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50 dark:bg-slate-800 hover:shadow-lg"
                >
                  {referenceOrder.image ? (
                    <div className="relative">
                      <img src={referenceOrder.image} alt="Reference" className="w-full h-64 object-cover rounded-xl shadow-md" />
                      <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-2">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="mt-4 text-green-600 font-medium">✓ Reference image uploaded successfully!</p>
                    </div>
                  ) : (
                    <div className="text-purple-600 dark:text-white">
                      <div className="text-6xl mb-4">📸</div>
                      <p className="text-xl font-bold mb-2">Upload Reference Image</p>
                      <p className="text-gray-500 dark:text-slate-300">Click to browse files or drag and drop</p>
                      <p className="text-sm text-gray-400 dark:text-slate-400 mt-2">JPG, PNG, WebP up to 10MB</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={referenceUploadRef}
                  onChange={handleReferenceImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Order Form */}
              <div className="space-y-6">
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Garment Category *</label>
                  <select
                    value={referenceOrder.category || 'Blouse'}
                    onChange={(e) => setReferenceOrder(prev => ({...prev, category: e.target.value}))}
                    className="w-full p-3 border-2 border-purple-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-[#0f172a] dark:text-white"
                  >
                    <option value="Blouse">👗 Blouse</option>
                    <option value="Kurti">👘 Kurti</option>
                    <option value="Dress">💃 Dress</option>
                    <option value="Saree">👺 Saree Blouse</option>
                    <option value="Lehenga">👑 Lehenga</option>
                    <option value="Kids">👶 Kids Wear</option>
                    <option value="Gown">👰 Gown</option>
                    <option value="Suit">👔 Suit</option>
                    <option value="Other">✨ Other</option>
                  </select>
                </div>

                {/* Instructions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Detailed Instructions *</label>
                  <textarea
                    value={referenceOrder.instructions}
                    onChange={(e) => setReferenceOrder(prev => ({...prev, instructions: e.target.value}))}
                    placeholder="Please provide detailed instructions about the design, colors, size, measurements, special requirements, etc..."
                    className="w-full p-4 border-2 border-purple-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-200 bg-white/50 dark:bg-[#0f172a] dark:text-white"
                    rows={6}
                  />
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Your Name *</label>
                    <input
                      type="text"
                      value={referenceOrder.customerName}
                      onChange={(e) => setReferenceOrder(prev => ({...prev, customerName: e.target.value}))}
                      placeholder="Enter your full name"
                      className="w-full p-3 border-2 border-purple-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-[#0f172a] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={referenceOrder.phone}
                      onChange={(e) => setReferenceOrder(prev => ({...prev, phone: e.target.value}))}
                      placeholder="Enter your phone number"
                      className="w-full p-3 border-2 border-purple-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-[#0f172a] dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Email (Optional)</label>
                  <input
                    type="email"
                    value={referenceOrder.email}
                    onChange={(e) => setReferenceOrder(prev => ({...prev, email: e.target.value}))}
                    placeholder="Enter your email address"
                    className="w-full p-3 border-2 border-purple-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-[#0f172a] dark:text-white"
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleReferenceEnquirySubmit}
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-white text-lg transition-all duration-300 transform hover:scale-105 ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Submitting Enquiry...
                    </span>
                  ) : (
                    '💬 Send Enquiry'
                  )}
                </button>
              </div>
            </div>
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