import { useState } from 'react'

function ProductGallery({ images }) {
  const [selected, setSelected] = useState(0)
  
  // Safety check: if images is undefined or empty, provide fallback
  if (!images || !Array.isArray(images) || images.length === 0) {
    return (
      <div className="w-full h-80 bg-gray-200 rounded-xl flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    )
  }

  return (
    <div>
      <img 
        src={images[selected]} 
        alt="" 
        className="w-full h-80 object-cover rounded-xl mb-4" 
      />
      <div className="flex gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`w-16 h-16 rounded-xl border-2 ${
              i === selected ? 'border-indigo-600' : 'border-gray-200'
            } overflow-hidden`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}

export default ProductGallery
