import express from 'express'
import {
  calculateIncomeAnalytics,
  getIncomeAnalytics,
  getIncomeStats,
  getProfitLossAnalysis,
  getDashboardAnalytics
} from '../controllers/analytics.controller.js'
import { verifyAdminToken } from '../middlewares/auth.middleware.js'

const router = express.Router()

// All routes require admin authentication
router.use(verifyAdminToken)

// Income analytics routes
router.post('/income/calculate', calculateIncomeAnalytics)
router.get('/income', getIncomeAnalytics)
router.get('/income/stats', getIncomeStats)

// Profit/Loss analysis
router.get('/profit-loss', getProfitLossAnalysis)

// Dashboard analytics
router.get('/dashboard', getDashboardAnalytics)

export default router
