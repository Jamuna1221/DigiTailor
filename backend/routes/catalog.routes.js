import express from 'express'
import {
  getAllCatalog,
  getCatalogById,
  getCategories,
  getFeaturedCatalog,
  createCatalogItem,    // ← Add this
  updateCatalogItem,    // ← Add this
  deleteCatalogItem     // ← Add this
} from '../controllers/catalog.controller.js'

const router = express.Router()

// Public routes (existing)
router.get('/', getAllCatalog)
router.get('/categories', getCategories)
router.get('/featured', getFeaturedCatalog)
router.get('/:id', getCatalogById)

// Admin routes (new)
router.post('/', createCatalogItem)        // CREATE
router.put('/:id', updateCatalogItem)      // UPDATE
router.delete('/:id', deleteCatalogItem)   // DELETE

export default router
