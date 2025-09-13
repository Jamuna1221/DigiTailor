import express from 'express'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller.js'

const router = express.Router()

// Public routes
router.get('/', getCategories)

// Admin routes (add auth middleware later)
router.post('/', createCategory)
router.put('/:id', updateCategory)
router.delete('/:id', deleteCategory)

export default router
