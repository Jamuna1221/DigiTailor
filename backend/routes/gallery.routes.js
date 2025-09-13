import express from 'express'
import {
  getAllGallery,
  getGalleryCategories,
  getGalleryById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
} from '../controllers/gallery.controller.js'

const router = express.Router()

// GET routes - IMPORTANT: Specific routes MUST come before parameterized routes
router.get('/', getAllGallery)                    // GET /api/gallery
router.get('/categories', getGalleryCategories)   // GET /api/gallery/categories ← Move this BEFORE /:id
router.get('/:id', getGalleryById)               // GET /api/gallery/:id ← This should be last

// POST/PUT/DELETE routes (for admin)
router.post('/', createGalleryItem)              // POST /api/gallery
router.put('/:id', updateGalleryItem)           // PUT /api/gallery/:id
router.delete('/:id', deleteGalleryItem)        // DELETE /api/gallery/:id

export default router
