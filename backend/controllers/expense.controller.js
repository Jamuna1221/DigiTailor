import Expense from '../models/expense.model.js'
import User from '../models/user.model.js'
import moment from 'moment'

// Add new expense
export const addExpense = async (req, res) => {
  try {
    const {
      type,
      category,
      description,
      amount,
      quantity,
      unitPrice,
      tailorId,
      salaryMonth,
      salaryType,
      paymentMethod,
      paymentStatus,
      paidAmount,
      invoiceNumber,
      vendorName,
      expenseDate,
      notes
    } = req.body

    // Validation
    if (!type || !category || !description || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: type, category, description, amount'
      })
    }

    // If it's a salary expense, validate tailor info
    if (type === 'salary' && !tailorId) {
      return res.status(400).json({
        success: false,
        message: 'Tailor ID is required for salary expenses'
      })
    }

    // Get tailor name if salary expense
    let tailorName = null
    if (type === 'salary' && tailorId) {
      const tailor = await User.findById(tailorId)
      if (!tailor) {
        return res.status(404).json({
          success: false,
          message: 'Tailor not found'
        })
      }
      tailorName = `${tailor.firstName} ${tailor.lastName}`
    }

    const expenseData = {
      type,
      category,
      description,
      amount: Number(amount),
      quantity: quantity || 1,
      unitPrice: unitPrice || amount,
      tailorId: tailorId || null,
      tailorName,
      salaryMonth: salaryMonth || null,
      salaryType: salaryType || null,
      paymentMethod: paymentMethod || 'cash',
      paymentStatus: paymentStatus || 'paid',
      paidAmount: paidAmount || amount,
      invoiceNumber: invoiceNumber || null,
      vendorName: vendorName || null,
      expenseDate: expenseDate ? new Date(expenseDate) : new Date(),
      addedBy: req.user.id || req.user._id,
      notes: notes || ''
    }

    const expense = new Expense(expenseData)
    await expense.save()

    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: expense
    })
  } catch (error) {
    console.error('Error adding expense:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to add expense',
      error: error.message
    })
  }
}

// Get all expenses with filters
export const getAllExpenses = async (req, res) => {
  try {
    const { 
      type, 
      startDate, 
      endDate, 
      category,
      tailorId,
      paymentStatus,
      limit,
      page = 1
    } = req.query

    let filter = {}

    if (type) filter.type = type
    if (category) filter.category = category
    if (tailorId) filter.tailorId = tailorId
    if (paymentStatus) filter.paymentStatus = paymentStatus

    // Date range filter
    if (startDate || endDate) {
      filter.expenseDate = {}
      if (startDate) filter.expenseDate.$gte = new Date(startDate)
      if (endDate) {
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        filter.expenseDate.$lte = end
      }
    }

    const pageSize = limit ? parseInt(limit) : 50
    const skip = (parseInt(page) - 1) * pageSize

    const expenses = await Expense.find(filter)
      .populate('tailorId', 'firstName lastName email phone')
      .populate('addedBy', 'firstName lastName email')
      .sort({ expenseDate: -1 })
      .skip(skip)
      .limit(pageSize)

    const total = await Expense.countDocuments(filter)

    res.status(200).json({
      success: true,
      data: expenses,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / pageSize),
        limit: pageSize
      }
    })
  } catch (error) {
    console.error('Error fetching expenses:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch expenses',
      error: error.message
    })
  }
}

// Get expense by ID
export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate('tailorId', 'firstName lastName email phone')
      .populate('addedBy', 'firstName lastName email')

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      })
    }

    res.status(200).json({
      success: true,
      data: expense
    })
  } catch (error) {
    console.error('Error fetching expense:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch expense',
      error: error.message
    })
  }
}

// Update expense
export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      })
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        expense[key] = req.body[key]
      }
    })

    await expense.save()

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: expense
    })
  } catch (error) {
    console.error('Error updating expense:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update expense',
      error: error.message
    })
  }
}

// Delete expense
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id)

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting expense:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete expense',
      error: error.message
    })
  }
}

// Get expense summary by date range
export const getExpenseSummary = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      })
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)

    // Total expenses
    const totalResult = await Expense.aggregate([
      {
        $match: {
          expenseDate: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ])

    // Expenses by type
    const byType = await Expense.aggregate([
      {
        $match: {
          expenseDate: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ])

    // Expenses by category
    const byCategory = await Expense.aggregate([
      {
        $match: {
          expenseDate: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { totalAmount: -1 }
      }
    ])

    // Daily/Weekly/Monthly breakdown
    let groupByFormat
    switch (groupBy) {
      case 'week':
        groupByFormat = { $week: '$expenseDate' }
        break
      case 'month':
        groupByFormat = { $month: '$expenseDate' }
        break
      default:
        groupByFormat = { $dateToString: { format: '%Y-%m-%d', date: '$expenseDate' } }
    }

    const timeline = await Expense.aggregate([
      {
        $match: {
          expenseDate: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: groupByFormat,
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ])

    res.status(200).json({
      success: true,
      data: {
        total: totalResult[0] || { totalAmount: 0, count: 0 },
        byType,
        byCategory,
        timeline
      }
    })
  } catch (error) {
    console.error('Error generating expense summary:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to generate expense summary',
      error: error.message
    })
  }
}

// Get expenses by specific date
export const getExpensesByDate = async (req, res) => {
  try {
    const { date } = req.params

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required'
      })
    }

    const targetDate = new Date(date)
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0))
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999))

    const expenses = await Expense.find({
      expenseDate: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    })
      .populate('tailorId', 'firstName lastName email')
      .populate('addedBy', 'firstName lastName')
      .sort({ expenseDate: -1 })

    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0)

    res.status(200).json({
      success: true,
      data: {
        date,
        expenses,
        total,
        count: expenses.length
      }
    })
  } catch (error) {
    console.error('Error fetching expenses by date:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch expenses',
      error: error.message
    })
  }
}

// Allocate salary to tailor
export const allocateSalary = async (req, res) => {
  try {
    const {
      tailorId,
      amount,
      salaryMonth,
      salaryType,
      paymentMethod,
      paymentStatus,
      paidAmount,
      notes
    } = req.body

    if (!tailorId || !amount || !salaryMonth) {
      return res.status(400).json({
        success: false,
        message: 'Tailor ID, amount, and salary month are required'
      })
    }

    // Get tailor info
    const tailor = await User.findById(tailorId)
    if (!tailor) {
      return res.status(404).json({
        success: false,
        message: 'Tailor not found'
      })
    }

    // Check if salary already exists for this month
    const existingSalary = await Expense.findOne({
      tailorId,
      salaryMonth,
      type: 'salary'
    })

    if (existingSalary) {
      return res.status(400).json({
        success: false,
        message: 'Salary already allocated for this tailor for this month'
      })
    }

    const salaryExpense = new Expense({
      type: 'salary',
      category: 'tailor_salary',
      description: `Salary for ${tailor.firstName} ${tailor.lastName} - ${salaryMonth}`,
      amount: Number(amount),
      tailorId,
      tailorName: `${tailor.firstName} ${tailor.lastName}`,
      salaryMonth,
      salaryType: salaryType || 'monthly',
      paymentMethod: paymentMethod || 'bank_transfer',
      paymentStatus: paymentStatus || 'paid',
      paidAmount: paidAmount || amount,
      expenseDate: new Date(),
      addedBy: req.user.id || req.user._id,
      notes: notes || ''
    })

    await salaryExpense.save()

    res.status(201).json({
      success: true,
      message: 'Salary allocated successfully',
      data: salaryExpense
    })
  } catch (error) {
    console.error('Error allocating salary:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to allocate salary',
      error: error.message
    })
  }
}

// Get all tailors for salary allocation
export const getTailorsForSalary = async (req, res) => {
  try {
    const tailors = await User.find({ role: 'tailor' })
      .select('firstName lastName email phone specialties')

    res.status(200).json({
      success: true,
      data: tailors
    })
  } catch (error) {
    console.error('Error fetching tailors:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tailors',
      error: error.message
    })
  }
}
