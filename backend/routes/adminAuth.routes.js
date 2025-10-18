import express from 'express'
import {
  adminLogin,
  getCurrentAdmin,
  adminLogout
} from '../controllers/adminAuth.controller.js'
import {
  getAllDesignElements,
  getDesignElementById,
  createDesignElement,
  updateDesignElement,
  deleteDesignElement,
  bulkUpdateDesignElements,
  getOrders
} from '../controllers/admin.controller.js'
import {
  getDashboardStats,
  getRecentOrders,
  getRevenueChartData,
  getOrderStatusBreakdown
} from '../controllers/adminDashboard.controller.js'
import { protect, adminOnly } from '../middlewares/auth.middleware.js'

const router = express.Router()

// ------------------
// PUBLIC ADMIN ROUTES
// ------------------
router.post('/login', adminLogin)
router.get('/dashboard/stats', getDashboardStats)

// Recent orders
router.get('/dashboard/recent-orders', getRecentOrders)

// Revenue chart data
router.get('/dashboard/revenue-chart', getRevenueChartData)

// Order status breakdown
router.get('/dashboard/order-status', getOrderStatusBreakdown)
// ------------------
// PROTECTED ADMIN ROUTES
// ------------------

// Apply authentication & adminOnly middleware to all routes below
router.use(protect, adminOnly)

// Current admin info
router.get('/me', getCurrentAdmin)

// Logout
router.post('/logout', adminLogout)

// Dashboard statistics
router.get('/dashboard/stats', getDashboardStats)

// Recent orders
router.get('/dashboard/recent-orders', getRecentOrders)

// Revenue chart data
router.get('/dashboard/revenue-chart', getRevenueChartData)

// Order status breakdown
router.get('/order-status', getOrderStatusBreakdown)

// Design Elements Routes
// GET /api/admin/design-elements - Get all design elements with filtering and pagination
router.get('/design-elements', getAllDesignElements)

// GET /api/admin/design-elements/:id - Get single design element by ID
router.get('/design-elements/:id', getDesignElementById)

// POST /api/admin/design-elements - Create new design element
router.post('/design-elements', createDesignElement)

// PUT /api/admin/design-elements/:id - Update design element
router.put('/design-elements/:id', updateDesignElement)

// DELETE /api/admin/design-elements/:id - Delete design element (soft delete by default)
router.delete('/design-elements/:id', deleteDesignElement)

// PUT /api/admin/design-elements/bulk - Bulk update design elements
router.put('/design-elements/bulk', bulkUpdateDesignElements)

// Orders Routes
// GET /api/admin/orders - Get all orders with filtering and pagination
router.get('/orders', getOrders)

export default router
