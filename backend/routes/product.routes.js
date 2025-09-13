import express from 'express'
import mongoose from 'mongoose'
import Product from '../models/product.model.js'

const router = express.Router()


// GET single product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    console.log(`🔍 Fetching product with ID: ${id}`)

    // Use findOne instead of findById - works with both string and ObjectId
    const product = await Product.findOne({ _id: id })
    
    if (!product) {
      console.log(`❌ Product not found: ${id}`)
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    console.log(`✅ Product found: ${product.name}`)
    res.status(200).json({
      success: true,
      data: product
    })

  } catch (error) {
    console.error('❌ Error fetching product:', error)
    res.status(500).json({
      success: false,
      message: 'Server error fetching product',
      error: error.message
    })
  }
})


export default router
