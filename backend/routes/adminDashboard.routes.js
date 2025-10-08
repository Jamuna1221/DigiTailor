import express from 'express'
import {
  getDashboardStats,
  getRecentOrders,
  getRevenueChartData,
  getOrderStatusBreakdown
} from '../controllers/adminDashboard.controller.js'
import { protect, adminOnly } from '../middlewares/auth.middleware.js'

const router = express.Router()

// All routes require admin authentication
router.use(protect, adminOnly)

// Dashboard statistics
router.get('/stats', getDashboardStats)

// Recent orders
router.get('/recent-orders', getRecentOrders)

// Revenue chart data
router.get('/revenue-chart', getRevenueChartData)

// Order status breakdown
router.get('/order-status', getOrderStatusBreakdown)

export default router
