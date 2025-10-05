import { useState, useRef, useEffect } from 'react'
import Modal from '../components/common/Modal.jsx'

function AIStudio() {
  const [prompt, setPrompt] = useState('')
  const [category, setCategory] = useState('Blouse')
  const [style, setStyle] = useState('Traditional')
  const [loading, setLoading] = useState(false)
  const [generatedDesign, setGeneratedDesign] = useState(null)
  const [showModal, setShowModal] = useState(false)
  
  // Color picker state - moved to main page
  const [selectedColors, setSelectedColors] = useState({
    primary: '#8B5CF6',
    secondary: '#EC4899',
    accent: '#06B6D4'
  })
  
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [activeColorType, setActiveColorType] = useState('primary')
  const [customColor, setCustomColor] = useState('#8B5CF6')
  const [colorPickerMode, setColorPickerMode] = useState('normal')
  const [pickerImage, setPickerImage] = useState(null)
  
  // Reference image states
  const [referenceImage, setReferenceImage] = useState(null)
  const [designElements, setDesignElements] = useState({
    neckDesign: null,
    handDesign: null,
    frontNeckModel: null
  })
  const [mergedDesign, setMergedDesign] = useState(null)
  
  // Auto-rotating design suggestions
  const [currentAdIndex, setCurrentAdIndex] = useState(0)
  const [showSidebar, setShowSidebar] = useState(false)
  
  // Tracked design for AI generation
  const [trackedDesign, setTrackedDesign] = useState(null)
  
  // File upload refs
  const referenceUploadRef = useRef(null)
  const neckDesignUploadRef = useRef(null)
  const handDesignUploadRef = useRef(null)
  const frontNeckUploadRef = useRef(null)
  const imagePickerUploadRef = useRef(null)

  // Enhanced design advertisements
  const designAds = [
    {
      id: 1,
      title: "Elegant Silk Blouse Collection",
      frontDesign: "https://source.unsplash.com/500x600/?silk,blouse,front,elegant",
      backDesign: "https://source.unsplash.com/500x600/?silk,blouse,back,elegant",
      handDesign: "https://source.unsplash.com/500x600/?sleeve,silk,elegant",
      tag: "Featured Collection",
      color: "from-pink-500 to-rose-400",
      description: "Luxurious silk with intricate embroidery",
      keywords: "silk,elegant,blouse,traditional"
    },
    {
      id: 2,
      title: "Traditional Kurti Designs",
      frontDesign: "https://source.unsplash.com/500x600/?kurti,traditional,front,indian",
      backDesign: "https://source.unsplash.com/500x600/?kurti,traditional,back,indian",
      handDesign: "https://source.unsplash.com/500x600/?kurti,sleeve,traditional",
      tag: "Featured Collection",
      color: "from-purple-500 to-indigo-400",
      description: "Authentic Indian patterns and motifs",
      keywords: "kurti,traditional,indian,ethnic"
    },
    {
      id: 3,
      title: "Modern Fusion Dress",
      frontDesign: "https://source.unsplash.com/500x600/?fusion,dress,modern,front",
      backDesign: "https://source.unsplash.com/500x600/?fusion,dress,modern,back",
      handDesign: "https://source.unsplash.com/500x600/?dress,sleeve,modern",
      tag: "Featured Collection",
      color: "from-blue-500 to-cyan-400",
      description: "Contemporary style meets traditional elegance",
      keywords: "fusion,modern,dress,contemporary"
    },
    {
      id: 4,
      title: "Bridal Wedding Collection",
      frontDesign: "https://source.unsplash.com/500x600/?bridal,wedding,dress,front",
      backDesign: "https://source.unsplash.com/500x600/?bridal,wedding,dress,back",
      handDesign: "https://source.unsplash.com/500x600/?bridal,sleeve,wedding",
      tag: "Featured Collection",
      color: "from-yellow-500 to-orange-400",
      description: "Exquisite bridal wear for your special day",
      keywords: "bridal,wedding,luxury,special"
    }
  ]

  // Auto-rotate design ads
  useEffect(() => {
    if (showSidebar) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prevIndex) => (prevIndex + 1) % designAds.length)
      }, 6000)
      return () => clearInterval(interval)
    }
  }, [designAds.length, showSidebar])

  // Color picker functions
  const openColorPicker = (colorType, mode = 'normal') => {
    setShowColorPicker(false)
    
    setTimeout(() => {
      setActiveColorType(colorType)
      setCustomColor(selectedColors[colorType])
      setColorPickerMode(mode)
      setPickerImage(null)
      setShowColorPicker(true)
    }, 100)
  }

  const closeColorPicker = () => {
    setShowColorPicker(false)
    setColorPickerMode('normal')
    setPickerImage(null)
  }

  const handleCustomColorChange = (color) => {
    setCustomColor(color)
    setSelectedColors(prev => ({
      ...prev,
      [activeColorType]: color
    }))
  }

  const handleImageColorPickerUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPickerImage(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const extractColorFromImage = (event) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = event.target
    
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)
    
    const rect = img.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    const scaleX = img.width / rect.width
    const scaleY = img.height / rect.height
    
    const pixelData = ctx.getImageData(x * scaleX, y * scaleY, 1, 1).data
    const hex = `#${pixelData[0].toString(16).padStart(2, '0')}${pixelData[1].toString(16).padStart(2, '0')}${pixelData[2].toString(16).padStart(2, '0')}`
    
    setSelectedColors(prev => ({
      ...prev,
      [activeColorType]: hex
    }))
    
    closeColorPicker()
  }

  // Track design function
  const trackDesignForAI = (design) => {
    setTrackedDesign(design)
    // Optional: Show a toast or indication that design is tracked
    console.log('Design tracked for AI generation:', design.title)
  }

  // Handle reference image upload
  const handleReferenceUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setReferenceImage(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle design element uploads
  const handleDesignElementUpload = (type, event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setDesignElements(prev => ({
          ...prev,
          [type]: e.target.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Enhanced AI generation with tracked design
  const handleGenerate = async () => {
    if (!prompt.trim() && !referenceImage && !trackedDesign) return
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      let imageKeywords = category.toLowerCase()
      
      if (trackedDesign) {
        imageKeywords = `${trackedDesign.keywords},${category.toLowerCase()},${style.toLowerCase()}`
      }
      
      const mockGenerated = {
        id: Date.now(),
        name: `AI Generated ${category}`,
        image: `https://source.unsplash.com/600x800/?fashion,${imageKeywords}`,
        prompt: prompt,
        colors: selectedColors,
        estimatedPrice: Math.floor(Math.random() * 200) + 50,
        estimatedDays: Math.floor(Math.random() * 10) + 5,
        category,
        style,
        basedOn: trackedDesign ? trackedDesign.title : null
      }
      setGeneratedDesign(mockGenerated)
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const mergeDesigns = () => {
    if (!referenceImage) return
    setLoading(true)
    setTimeout(() => {
      const mockMergedDesign = {
        id: Date.now(),
        name: `Custom ${category} Design`,
        baseImage: referenceImage,
        elements: designElements,
        colors: selectedColors,
        merged: true,
        estimatedPrice: Math.floor(Math.random() * 300) + 100,
        estimatedDays: Math.floor(Math.random() * 15) + 7,
        category,
        style
      }
      setMergedDesign(mockMergedDesign)
      setLoading(false)
    }, 2000)
  }

  const clearAllDesigns = () => {
    setReferenceImage(null)
    setDesignElements({
      neckDesign: null,
      handDesign: null,
      frontNeckModel: null
    })
    setMergedDesign(null)
    setGeneratedDesign(null)
    setTrackedDesign(null)
  }

  const currentAd = designAds[currentAdIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-[#0B1220] dark:via-[#0B1220] dark:to-[#0B1220] dark:text-white relative">
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="fixed top-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-full shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-110"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Simplified Sidebar - Only Designs */}
      <div className={`fixed right-0 top-0 h-full w-96 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md shadow-2xl border-l border-white/20 dark:border-slate-800 z-40 overflow-hidden transition-transform duration-500 ease-in-out ${
        showSidebar ? 'transform translate-x-0' : 'transform translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          {/* Close Button */}
          <button
            onClick={() => setShowSidebar(false)}
            className="absolute top-4 right-4 z-10 bg-white/80 dark:bg-slate-800 text-gray-600 dark:text-white p-2 rounded-full hover:bg-white dark:hover:bg-slate-700 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Featured Collection Header */}
          <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-bold flex items-center">
                <span className="mr-2">🔥</span>
                {currentAd.tag}
              </h3>
            </div>
            <p className="text-purple-100 text-sm">{currentAd.description}</p>
            <p className="text-yellow-200 text-xs mt-2">💡 Click "Track for AI" to use this design as reference!</p>
          </div>

          {/* Design Views with Track Button */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {/* Front Design */}
            <div className="bg-white/90 dark:bg-[#111827] rounded-xl shadow-lg overflow-hidden">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <h4 className="text-sm font-bold flex items-center justify-between">
                  <span className="flex items-center">
                    <span className="w-3 h-3 bg-white rounded-full mr-2"></span>
                    Front Design
                  </span>
                  <button
                    onClick={() => trackDesignForAI(currentAd)}
                    className={`text-xs px-3 py-1 rounded-full font-medium transition-all duration-200 ${
                      trackedDesign && trackedDesign.id === currentAd.id 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {trackedDesign && trackedDesign.id === currentAd.id ? '✓ Tracked' : 'Track for AI'}
                  </button>
                </h4>
              </div>
              <div className="p-3">
                <img
                  src={currentAd.frontDesign}
                  alt="Front Design"
                  className="w-full h-40 object-cover rounded-lg shadow-md"
                />
              </div>
            </div>

            {/* Back Design */}
            <div className="bg-white/90 dark:bg-[#111827] rounded-xl shadow-lg overflow-hidden">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <h4 className="text-sm font-bold flex items-center">
                  <span className="w-3 h-3 bg-white rounded-full mr-2"></span>
                  Back Design
                </h4>
              </div>
              <div className="p-3">
                <img
                  src={currentAd.backDesign}
                  alt="Back Design"
                  className="w-full h-40 object-cover rounded-lg shadow-md"
                />
              </div>
            </div>

            {/* Hand/Sleeve Design */}
            <div className="bg-white/90 dark:bg-[#111827] rounded-xl shadow-lg overflow-hidden">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <h4 className="text-sm font-bold flex items-center">
                  <span className="w-3 h-3 bg-white rounded-full mr-2"></span>
                  Hand/Sleeve Design
                </h4>
              </div>
              <div className="p-3">
                <img
                  src={currentAd.handDesign}
                  alt="Hand Design"
                  className="w-full h-40 object-cover rounded-lg shadow-md"
                />
              </div>
            </div>

            {/* Order Button */}
            <div className="pt-4">
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3 rounded-xl font-bold text-white transition-all duration-200 transform hover:scale-105 shadow-lg">
                Order This Design
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              ✨ AI Design Studio ✨
            </h1>
            <div className="absolute -top-2 -right-2 animate-bounce">🎨</div>
            <div className="absolute -top-1 -left-3 animate-pulse">✨</div>
          </div>
          <p className="text-xl text-gray-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Create stunning custom designs with AI technology. Upload, customize colors, and craft your perfect outfit!
          </p>
          
          <div className="flex justify-center mt-6 space-x-8">
            <div className="flex items-center space-x-2 bg-white/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg text-gray-700 dark:text-white">
              <span className="text-2xl">👗</span>
              <span className="text-sm font-medium text-gray-700">Custom Designs</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg text-gray-700 dark:text-white">
              <span className="text-2xl">🎨</span>
              <span className="text-sm font-medium text-gray-700">Advanced Colors</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg text-gray-700 dark:text-white">
              <span className="text-2xl">⚡</span>
              <span className="text-sm font-medium text-gray-700">AI Powered</span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white/90 dark:bg-[#111827] backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 dark:border-slate-800">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                🎯 Design Parameters
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 border-2 border-purple-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-[#0f172a] dark:text-white"
                  >
                    <option value="Blouse">👗 Blouse</option>
                    <option value="Kurti">👘 Kurti</option>
                    <option value="Dress">💃 Dress</option>
                    <option value="Kids">👶 Kids Wear</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Style</label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full p-3 border-2 border-purple-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-[#0f172a] dark:text-white"
                  >
                    <option value="Traditional">🏛️ Traditional</option>
                    <option value="Modern">🌟 Modern</option>
                    <option value="Fusion">🎭 Fusion</option>
                    <option value="Bridal">💒 Bridal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Design Prompt</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="✍️ Describe your dream outfit in detail..."
                    className="w-full p-4 border-2 border-purple-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-200 bg-white/50 dark:bg-[#0f172a] dark:text-white"
                    rows={4}
                  />
                  {trackedDesign && (
                    <p className="text-xs text-green-600 dark:text-green-300 mt-2 flex items-center">
                      <span className="mr-1">🎯</span>
                      AI will generate based on: {trackedDesign.title}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={loading || (!prompt.trim() && !referenceImage && !trackedDesign)}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-white text-lg transition-all duration-300 transform hover:scale-105 ${
                    loading || (!prompt.trim() && !referenceImage && !trackedDesign)
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Generating Magic...
                    </span>
                  ) : (
                    '✨ Generate Design'
                  )}
                </button>

                <button
                  onClick={clearAllDesigns}
                  className="w-full py-3 px-4 border-2 border-gray-300 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-200 font-medium"
                >
                  🗑️ Clear All
                </button>
              </div>
            </div>

            {/* Reference Image Upload */}
            <div className="bg-white/90 dark:bg-[#111827] backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 dark:border-slate-800">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📸 Reference Image</h3>
              
                <div
                  onClick={() => referenceUploadRef.current?.click()}
                  className="border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-xl p-6 text-center cursor-pointer hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-200 bg-gradient-to-br from-purple-50 to-pink-50 dark:bg-slate-800 hover:from-purple-100 hover:to-pink-100 dark:hover:shadow-md"
                >
                {referenceImage ? (
                  <div className="relative">
                    <img src={referenceImage} alt="Reference" className="w-full h-40 object-cover rounded-xl mb-2 shadow-md" />
                    <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="text-purple-600 dark:text-white">
                    <div className="text-4xl mb-3">📸</div>
                    <p className="font-medium">Upload Reference Image</p>
                    <p className="text-sm text-gray-500 dark:text-slate-300 mt-1">Click to browse files</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={referenceUploadRef}
                onChange={handleReferenceUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          {/* Design Elements Section */}
          <div className="space-y-6">
            <div className="bg-white/90 dark:bg-[#111827] backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 dark:border-slate-800">
              <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                🎨 Design Elements
              </h3>
              
              <div className="space-y-4">
                {/* Neck Design */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Neck Design</label>
                  <div
                    onClick={() => neckDesignUploadRef.current?.click()}
                    className="border-2 border-purple-200 dark:border-purple-700 rounded-xl p-4 text-center cursor-pointer hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-200 bg-gradient-to-br from-purple-50 to-indigo-50 dark:bg-slate-800/50 hover:shadow-md"
                  >
                    {designElements.neckDesign ? (
                      <div className="relative">
                        <img src={designElements.neckDesign} alt="Neck Design" className="w-full h-24 object-cover rounded-lg shadow-sm" />
                        <div className="absolute -top-1 -right-1 bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">✓</div>
                      </div>
                    ) : (
                      <div className="text-purple-600 dark:text-white py-2">
                        <div className="text-2xl mb-1">👗</div>
                        <p className="text-sm font-medium">Add Neck Design</p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={neckDesignUploadRef}
                    onChange={(e) => handleDesignElementUpload('neckDesign', e)}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* Hand Design */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Hand/Sleeve Design</label>
                  <div
                    onClick={() => handDesignUploadRef.current?.click()}
                    className="border-2 border-pink-200 dark:border-pink-700 rounded-xl p-4 text-center cursor-pointer hover:border-pink-400 dark:hover:border-pink-500 transition-all duration-200 bg-gradient-to-br from-pink-50 to-rose-50 dark:bg-slate-800/50 hover:shadow-md"
                  >
                    {designElements.handDesign ? (
                      <div className="relative">
                        <img src={designElements.handDesign} alt="Hand Design" className="w-full h-24 object-cover rounded-lg shadow-sm" />
                        <div className="absolute -top-1 -right-1 bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">✓</div>
                      </div>
                    ) : (
                      <div className="text-pink-600 dark:text-white py-2">
                        <div className="text-2xl mb-1">👕</div>
                        <p className="text-sm font-medium">Add Sleeve Design</p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={handDesignUploadRef}
                    onChange={(e) => handleDesignElementUpload('handDesign', e)}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* Front Neck Model */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Front Neck Model</label>
                  <div
                    onClick={() => frontNeckUploadRef.current?.click()}
                    className="border-2 border-indigo-200 dark:border-indigo-700 rounded-xl p-4 text-center cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-200 bg-gradient-to-br from-indigo-50 to-blue-50 dark:bg-slate-800/50 hover:shadow-md"
                  >
                    {designElements.frontNeckModel ? (
                      <div className="relative">
                        <img src={designElements.frontNeckModel} alt="Front Neck" className="w-full h-24 object-cover rounded-lg shadow-sm" />
                        <div className="absolute -top-1 -right-1 bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">✓</div>
                      </div>
                    ) : (
                      <div className="text-indigo-600 py-2">
                        <div className="text-2xl mb-1">✨</div>
                        <p className="text-sm font-medium">Add Front Neck</p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={frontNeckUploadRef}
                    onChange={(e) => handleDesignElementUpload('frontNeckModel', e)}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <button
                  onClick={mergeDesigns}
                  disabled={!referenceImage || loading}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 ${
                    !referenceImage || loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Merging...
                    </span>
                  ) : (
                    '🎨 Merge Designs'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            {!generatedDesign && !mergedDesign && !loading && (
              <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-indigo-100 dark:bg-slate-800/70 border-2 border-dashed border-purple-300 dark:border-slate-700 rounded-2xl p-12 text-center transform transition-all duration-300 hover:scale-105">
                <div className="text-6xl mb-4 animate-bounce">🎨</div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-white mb-2">Your Masterpiece Awaits</h3>
                <p className="text-gray-500 dark:text-slate-300">Upload images, pick colors, and create stunning designs!</p>
                <div className="mt-4 flex justify-center space-x-2">
                  <span className="animate-pulse">✨</span>
                  <span className="animate-pulse" style={{ animationDelay: '0.5s' }}>✨</span>
                  <span className="animate-pulse" style={{ animationDelay: '1s' }}>✨</span>
                </div>
              </div>
            )}

            {(generatedDesign || mergedDesign) && (
              <div className="bg-white/90 dark:bg-[#111827] backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 dark:border-slate-800">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {generatedDesign ? generatedDesign.name : mergedDesign.name}
                  </h3>
                  {generatedDesign && generatedDesign.basedOn && (
                    <p className="text-sm text-green-600 flex items-center">
                      <span className="mr-1">🎯</span>
                      Based on: {generatedDesign.basedOn}
                    </p>
                  )}
                </div>
                <img 
                  src={generatedDesign ? generatedDesign.image : mergedDesign.baseImage} 
                  alt="Generated Design" 
                  className="w-full h-80 object-cover rounded-xl shadow-md mb-4"
                />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-slate-300">Estimated Price:</span>
                    <span className="font-medium">${generatedDesign ? generatedDesign.estimatedPrice : mergedDesign.estimatedPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-slate-300">Delivery:</span>
                    <span className="font-medium">{generatedDesign ? generatedDesign.estimatedDays : mergedDesign.estimatedDays} days</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Order This Design
                </button>
              </div>
            )}

            {loading && (
              <div className="bg-white/90 dark:bg-[#111827] backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center border border-white/20 dark:border-slate-800">
                <div className="animate-pulse">
                  <div className="w-full h-96 bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gradient-to-r from-purple-300 to-pink-300 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-4 bg-gradient-to-r from-pink-300 to-indigo-300 rounded w-1/2 mx-auto"></div>
                </div>
                <div className="mt-6 flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <p className="text-purple-600 font-bold text-lg">
                    🤖 AI is crafting magic...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Color Picker Section - Moved to bottom of main page */}
        <div className="mt-16 bg-white/90 dark:bg-[#111827] backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 dark:border-slate-800">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              🎨 Advanced Color Picker
            </h2>
            <p className="text-gray-600 dark:text-slate-300">
              Customize your design colors or pick colors from any image
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Color Selection */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Selected Colors</h3>
              <div className="space-y-4">
                {/* Primary Color */}
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4">
                  <div className="text-gray-700 dark:text-white text-sm font-medium mb-2">Primary Color</div>
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-16 h-16 rounded-xl border-4 border-white shadow-lg cursor-pointer hover:scale-105 transition-transform"
                      style={{ backgroundColor: selectedColors.primary }}
                      onClick={() => openColorPicker('primary')}
                    ></div>
                    <div>
                      <div className="text-gray-800 dark:text-white font-mono text-lg">{selectedColors.primary}</div>
                      <button
                        onClick={() => openColorPicker('primary')}
                        className="text-purple-600 dark:text-white hover:text-purple-800 dark:hover:text-white/90 text-sm font-medium flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit Color
                      </button>
                    </div>
                  </div>
                </div>

                {/* Secondary Color */}
                <div className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-xl p-4">
                  <div className="text-gray-700 dark:text-white text-sm font-medium mb-2">Secondary Color</div>
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-12 h-12 rounded-lg border-4 border-white shadow-lg cursor-pointer hover:scale-105 transition-transform"
                      style={{ backgroundColor: selectedColors.secondary }}
                      onClick={() => openColorPicker('secondary')}
                    ></div>
                    <div>
                      <div className="text-gray-800 dark:text-white font-mono text-base">{selectedColors.secondary}</div>
                      <button
                        onClick={() => openColorPicker('secondary')}
                        className="text-pink-600 dark:text-white hover:text-pink-800 dark:hover:text-white/90 text-sm font-medium flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit Color
                      </button>
                    </div>
                  </div>
                </div>

                {/* Accent Color */}
                <div className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-xl p-4">
                  <div className="text-gray-700 dark:text-white text-sm font-medium mb-2">Accent Color</div>
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-10 h-10 rounded-lg border-4 border-white shadow-lg cursor-pointer hover:scale-105 transition-transform"
                      style={{ backgroundColor: selectedColors.accent }}
                      onClick={() => openColorPicker('accent')}
                    ></div>
                    <div>
                      <div className="text-gray-800 dark:text-white font-mono text-base">{selectedColors.accent}</div>
                      <button
                        onClick={() => openColorPicker('accent')}
                        className="text-cyan-600 dark:text-white hover:text-cyan-800 dark:hover:text-white/90 text-sm font-medium flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit Color
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Color Palette Preview */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Color Palette Preview</h3>
              <div className="bg-white dark:bg-[#111827] rounded-xl p-6 shadow-lg border-2 border-gray-200 dark:border-slate-800">
                <div className="space-y-4">
                  <div className="h-20 rounded-lg flex overflow-hidden shadow-md">
                    <div 
                      className="flex-1 flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: selectedColors.primary }}
                    >
                      Primary
                    </div>
                    <div 
                      className="flex-1 flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: selectedColors.secondary }}
                    >
                      Secondary
                    </div>
                    <div 
                      className="flex-1 flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: selectedColors.accent }}
                    >
                      Accent
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openColorPicker('primary', 'image')}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Pick from Image</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unified Color Picker Modal */}
      {showColorPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Choose {activeColorType.charAt(0).toUpperCase() + activeColorType.slice(1)} Color
              </h3>
              <button
                onClick={closeColorPicker}
                className="text-gray-400 dark:text-slate-300 hover:text-gray-600 dark:hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Mode Toggle Buttons */}
            <div className="flex space-x-2 mb-6">
              <button
                onClick={() => setColorPickerMode('normal')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                  colorPickerMode === 'normal' 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
              >
                🎨 Color Picker
              </button>
              <button
                onClick={() => setColorPickerMode('image')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                  colorPickerMode === 'image' 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' 
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
              >
                🖼️ Pick from Image
              </button>
            </div>

            {/* Normal Color Picker Mode */}
            {colorPickerMode === 'normal' && (
              <div>
                {/* Color Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Hex Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => handleCustomColorChange(e.target.value)}
                      className="w-16 h-12 border-2 border-gray-300 dark:border-slate-700 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customColor}
                      onChange={(e) => handleCustomColorChange(e.target.value)}
                      className="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono dark:bg-[#0f172a] dark:text-white"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                {/* Preset Colors */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-3">Preset Colors</label>
                  <div className="grid grid-cols-8 gap-2">
                    {[
                      '#8B5CF6', '#EC4899', '#06B6D4', '#10B981', '#F59E0B',
                      '#EF4444', '#8B5A2B', '#6B7280', '#1F2937', '#7C3AED',
                      '#F472B6', '#34D399', '#FBBF24', '#FB7185', '#A78BFA',
                      '#60A5FA'
                    ].map(color => (
                      <button
                        key={color}
                        onClick={() => handleCustomColorChange(color)}
                        className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                          customColor === color ? 'border-gray-800 scale-110 shadow-lg' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      ></button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Image Color Picker Mode */}
            {colorPickerMode === 'image' && (
              <div>
                {!pickerImage ? (
                  <div
                    onClick={() => imagePickerUploadRef.current?.click()}
                    className="border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 bg-gradient-to-br from-blue-50 to-cyan-50 dark:bg-slate-800 hover:from-blue-100 hover:to-cyan-100"
                  >
                    <div className="text-blue-600 dark:text-white">
                      <div className="text-4xl mb-3">🖼️</div>
                      <p className="font-medium">Upload Image to Pick Colors</p>
                      <p className="text-sm text-gray-500 dark:text-slate-300 mt-1">Click anywhere on the image to extract color</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-slate-300 mb-4">Click anywhere on the image to pick that color</p>
                    <img
                      src={pickerImage}
                      alt="Color Picker"
                      className="max-w-full max-h-80 mx-auto rounded-lg shadow-md cursor-crosshair"
                      onClick={extractColorFromImage}
                      onLoad={(e) => {
                        e.target.style.cursor = 'crosshair'
                      }}
                    />
                    <div className="mt-4">
                      <button
                        onClick={() => setPickerImage(null)}
                        className="py-2 px-4 border-2 border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors font-medium"
                      >
                        Choose Different Image
                      </button>
                    </div>
                  </div>
                )}
                
                <input
                  type="file"
                  ref={imagePickerUploadRef}
                  onChange={handleImageColorPickerUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3 mt-6">
              <button
                onClick={closeColorPicker}
                className="flex-1 py-2 px-4 border-2 border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={closeColorPicker}
                className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium"
              >
                Apply Color
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Design Submitted Successfully! 🎉"
      >
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <p className="text-gray-600 dark:text-slate-300 mb-6 leading-relaxed">
            Your design with custom colors has been submitted for review. 
            Our expert team will contact you within 24 hours!
          </p>
          <button
            onClick={() => setShowModal(false)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg w-full"
          >
            Awesome! Thanks 🙌
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default AIStudio