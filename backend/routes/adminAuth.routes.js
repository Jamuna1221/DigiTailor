import express from 'express'
import {
  adminLogin,
  getCurrentAdmin,
  adminLogout
} from '../controllers/adminAuth.controller.js'
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
router.get('/dashboard/order-status', getOrderStatusBreakdown)

export default router
