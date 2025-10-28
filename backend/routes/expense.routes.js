import express from 'express'
import {
  addExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
  getExpensesByDate,
  allocateSalary,
  getTailorsForSalary
} from '../controllers/expense.controller.js'
import { verifyAdminToken } from '../middlewares/auth.middleware.js'

const router = express.Router()

// All routes require admin authentication
router.use(verifyAdminToken)

// Expense CRUD routes
router.post('/', addExpense)
router.get('/', getAllExpenses)
router.get('/summary', getExpenseSummary)
router.get('/date/:date', getExpensesByDate)
router.get('/:id', getExpenseById)
router.put('/:id', updateExpense)
router.delete('/:id', deleteExpense)

// Salary routes
router.post('/salary/allocate', allocateSalary)
router.get('/salary/tailors', getTailorsForSalary)

export default router
