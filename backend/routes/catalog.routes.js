import express from 'express'
import {
  getAllCatalog,
  getCatalogById,
  getCategories,
  getFeaturedCatalog,
  getTopCatalogItems,
  addReview,
  createCatalogItem,    // ← Add this
  updateCatalogItem,    // ← Add this
  deleteCatalogItem     // ← Add this
} from '../controllers/catalog.controller.js'
import { optionalAuth } from '../middlewares/auth.middleware.js'

const router = express.Router()

// Public routes (existing)
router.get('/', getAllCatalog)
router.get('/categories', getCategories)
router.get('/featured', getFeaturedCatalog)
router.get('/top-items', getTopCatalogItems)
router.get('/:id', getCatalogById)

// Reviews
router.post('/:id/reviews', optionalAuth, addReview)

// Admin routes (new)
router.post('/', createCatalogItem)        // CREATE
router.put('/:id', updateCatalogItem)      // UPDATE
router.delete('/:id', deleteCatalogItem)   // DELETE

export default router
