import express from 'express'
import {
  getDesignCategories,
  getAllDesignCategories,
  getDesignsByCategory,
  getGarmentTypes,
  submitModularOrder,
  getOrderById,
  getAllModularOrders
} from '../controllers/designElement.controller.js'

const router = express.Router()

// GET /api/garment-types - Get all available garment types
router.get('/garment-types', getGarmentTypes)

// GET /api/all-design-categories - Get all unique design categories across garment types
router.get('/all-design-categories', getAllDesignCategories)

// GET /api/design-categories - Get all design categories with elements
router.get('/design-categories', getDesignCategories)

// GET /api/designs/:categoryId - Get designs by category
router.get('/designs/:categoryId', getDesignsByCategory)

// POST /api/modular-orders - Submit modular design order
router.post('/modular-orders', submitModularOrder)

// GET /api/modular-orders - Get all modular orders
router.get('/modular-orders', getAllModularOrders)

// GET /api/modular-orders/:orderId - Get order by ID
router.get('/modular-orders/:orderId', getOrderById)

export default router
