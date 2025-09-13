//import { useCart } from '../../contexts/CartContext'
import { useCart } from '../../hooks/useCart' 
import React, { useState } from 'react'
export default function ProductActions({ product }) {
  const { addToCart } = useCart()

  // const [selectedColor, setSelectedColor] = useState('')
  const [selectedColor] = useState('')
  const [selectedSize] = useState('')
  const [selectedQuantity] = useState(1)

  const handleAddToCart = () => {
    addToCart(product, {
      color: selectedColor, // get from state
      size: selectedSize,   // get from state
      quantity: selectedQuantity
    })
  }

  return (
    <div className="flex gap-4 mb-7">
      <button 
        onClick={handleAddToCart}
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition"
      >
        Add to Cart
      </button>
      <button className="bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition">
        Buy Now
      </button>
    </div>
  )
}
