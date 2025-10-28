import Order from '../models/order.model.js'
import ModularOrder from '../models/modularOrder.model.js'
import Expense from '../models/expense.model.js'
import IncomeAnalytics from '../models/incomeAnalytics.model.js'
import moment from 'moment'

// Calculate and store income analytics
export const calculateIncomeAnalytics = async (req, res) => {
  try {
    const { period = 'daily', date } = req.body
    
    const targetDate = date ? new Date(date) : new Date()
    let startDate, endDate, periodKey

    switch (period) {
      case 'daily':
        startDate = moment(targetDate).startOf('day').toDate()
        endDate = moment(targetDate).endOf('day').toDate()
        periodKey = `daily_${moment(targetDate).format('YYYY-MM-DD')}`
        break
      case 'weekly':
        startDate = moment(targetDate).startOf('week').toDate()
        endDate = moment(targetDate).endOf('week').toDate()
        periodKey = `weekly_${moment(targetDate).format('YYYY')}-${moment(targetDate).week()}`
        break
      case 'monthly':
        startDate = moment(targetDate).startOf('month').toDate()
        endDate = moment(targetDate).endOf('month').toDate()
        periodKey = `monthly_${moment(targetDate).format('YYYY-MM')}`
        break
      case 'annual':
        startDate = moment(targetDate).startOf('year').toDate()
        endDate = moment(targetDate).endOf('year').toDate()
        periodKey = `annual_${moment(targetDate).format('YYYY')}`
        break
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid period. Use: daily, weekly, monthly, or annual'
        })
    }

    // Fetch orders in date range (both regular and modular)
    const regularOrders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate }
    }).populate('items')

    const modularOrders = await ModularOrder.find({
      createdAt: { $gte: startDate, $lte: endDate }
    })

    // Combine orders
    const allOrders = [
      ...regularOrders.map(o => ({
        total: o.pricing?.total || 0,
        status: o.status,
        paymentMethod: o.payment?.method || 'cod',
        items: o.items || []
      })),
      ...modularOrders.map(o => ({
        total: o.totalPrice || 0,
        status: o.status,
        paymentMethod: o.paymentMethod || 'cod',
        items: o.selections || []
      }))
    ]

    // Calculate metrics
    const totalOrders = allOrders.length
    const completedOrders = allOrders.filter(o => 
      ['delivered', 'shipped', 'completed'].includes(o.status)
    ).length
    const cancelledOrders = allOrders.filter(o => o.status === 'cancelled').length
    
    // Only count income from delivered/completed orders
    const completedOrdersList = allOrders.filter(o => 
      ['delivered', 'shipped', 'completed'].includes(o.status)
    )
    const totalIncome = completedOrdersList.reduce((sum, o) => sum + o.total, 0)
    const averageOrderValue = completedOrders > 0 ? totalIncome / completedOrders : 0

    // Order status breakdown
    const ordersByStatus = {
      placed: allOrders.filter(o => o.status === 'placed').length,
      confirmed: allOrders.filter(o => o.status === 'confirmed').length,
      assigned: allOrders.filter(o => o.status === 'assigned').length,
      in_progress: allOrders.filter(o => o.status === 'in_progress').length,
      completed: allOrders.filter(o => o.status === 'completed').length,
      shipped: allOrders.filter(o => o.status === 'shipped').length,
      delivered: allOrders.filter(o => o.status === 'delivered').length,
      cancelled: cancelledOrders
    }

    // Payment methods breakdown
    const paymentMethods = {
      cod: allOrders.filter(o => o.paymentMethod === 'cod').length,
      razorpay: allOrders.filter(o => o.paymentMethod === 'razorpay').length
    }

    // Category-wise income
    const categoryMap = new Map()
    completedOrdersList.forEach(order => {
      order.items.forEach(item => {
        const category = item.category || 'Uncategorized'
        const amount = item.price * (item.quantity || 1)
        
        if (categoryMap.has(category)) {
          const existing = categoryMap.get(category)
          categoryMap.set(category, {
            category,
            amount: existing.amount + amount,
            orderCount: existing.orderCount + 1
          })
        } else {
          categoryMap.set(category, {
            category,
            amount,
            orderCount: 1
          })
        }
      })
    })
    const categoryIncome = Array.from(categoryMap.values())

    // Save or update analytics
    const analyticsData = {
      period,
      date: startDate,
      periodKey,
      totalIncome,
      totalOrders,
      completedOrders,
      cancelledOrders,
      averageOrderValue,
      ordersByStatus,
      paymentMethods,
      categoryIncome,
      lastCalculated: new Date()
    }

    const analytics = await IncomeAnalytics.findOneAndUpdate(
      { periodKey },
      analyticsData,
      { upsert: true, new: true }
    )

    res.status(200).json({
      success: true,
      message: 'Income analytics calculated successfully',
      data: analytics
    })
  } catch (error) {
    console.error('Error calculating income analytics:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to calculate income analytics',
      error: error.message
    })
  }
}

// Get income analytics for a period
export const getIncomeAnalytics = async (req, res) => {
  try {
    const { period, startDate, endDate } = req.query

    let filter = {}

    if (period) {
      filter.period = period
    }

    if (startDate || endDate) {
      filter.date = {}
      if (startDate) filter.date.$gte = new Date(startDate)
      if (endDate) filter.date.$lte = new Date(endDate)
    }

    const analytics = await IncomeAnalytics.find(filter)
      .sort({ date: -1 })
      .limit(100)

    res.status(200).json({
      success: true,
      data: analytics
    })
  } catch (error) {
    console.error('Error fetching income analytics:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch income analytics',
      error: error.message
    })
  }
}

// Get real-time income stats (without storing)
export const getIncomeStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      })
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)

    // Fetch orders in date range
    const regularOrders = await Order.find({
      createdAt: { $gte: start, $lte: end }
    })

    const modularOrders = await ModularOrder.find({
      createdAt: { $gte: start, $lte: end }
    })

    // Calculate income only from completed/delivered orders
    const completedRegular = regularOrders.filter(o => 
      ['delivered', 'shipped', 'completed'].includes(o.status)
    )
    const completedModular = modularOrders.filter(o => 
      ['delivered', 'shipped', 'completed'].includes(o.status)
    )

    const totalIncome = completedRegular.reduce((sum, o) => sum + (o.pricing?.total || 0), 0) +
                       completedModular.reduce((sum, o) => sum + (o.totalPrice || 0), 0)

    const totalOrders = regularOrders.length + modularOrders.length
    const completedOrders = completedRegular.length + completedModular.length

    res.status(200).json({
      success: true,
      data: {
        totalIncome,
        totalOrders,
        completedOrders,
        averageOrderValue: completedOrders > 0 ? totalIncome / completedOrders : 0
      }
    })
  } catch (error) {
    console.error('Error fetching income stats:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch income stats',
      error: error.message
    })
  }
}

// Get profit/loss analysis
export const getProfitLossAnalysis = async (req, res) => {
  try {
    const { startDate, endDate, period = 'daily' } = req.query

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      })
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)

    // Get income from completed orders
    const regularOrders = await Order.find({
      createdAt: { $gte: start, $lte: end },
      status: { $in: ['delivered', 'shipped', 'completed'] }
    })

    const modularOrders = await ModularOrder.find({
      createdAt: { $gte: start, $lte: end },
      status: { $in: ['delivered', 'shipped', 'completed'] }
    })

    const totalIncome = regularOrders.reduce((sum, o) => sum + (o.pricing?.total || 0), 0) +
                       modularOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0)

    // Get expenses
    const expenses = await Expense.find({
      expenseDate: { $gte: start, $lte: end }
    })

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)

    // Calculate profit/loss
    const profitLoss = totalIncome - totalExpenses
    const profitMargin = totalIncome > 0 ? (profitLoss / totalIncome) * 100 : 0

    // Group by time period
    let groupByFormat
    switch (period) {
      case 'weekly':
        groupByFormat = (date) => moment(date).format('YYYY-[W]WW')
        break
      case 'monthly':
        groupByFormat = (date) => moment(date).format('YYYY-MM')
        break
      default:
        groupByFormat = (date) => moment(date).format('YYYY-MM-DD')
    }

    // Timeline data
    const incomeByPeriod = new Map()
    const expensesByPeriod = new Map()

    regularOrders.forEach(order => {
      const key = groupByFormat(order.createdAt)
      incomeByPeriod.set(key, (incomeByPeriod.get(key) || 0) + (order.pricing?.total || 0))
    })

    modularOrders.forEach(order => {
      const key = groupByFormat(order.createdAt)
      incomeByPeriod.set(key, (incomeByPeriod.get(key) || 0) + (order.totalPrice || 0))
    })

    expenses.forEach(expense => {
      const key = groupByFormat(expense.expenseDate)
      expensesByPeriod.set(key, (expensesByPeriod.get(key) || 0) + expense.amount)
    })

    // Combine timeline data
    const allPeriods = new Set([...incomeByPeriod.keys(), ...expensesByPeriod.keys()])
    const timeline = Array.from(allPeriods).sort().map(period => {
      const income = incomeByPeriod.get(period) || 0
      const expense = expensesByPeriod.get(period) || 0
      const profit = income - expense

      return {
        period,
        income,
        expense,
        profit,
        profitMargin: income > 0 ? ((profit / income) * 100).toFixed(2) : 0
      }
    })

    // Expense breakdown by type
    const expensesByType = {}
    expenses.forEach(expense => {
      const type = expense.type || 'other'
      expensesByType[type] = (expensesByType[type] || 0) + expense.amount
    })

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalIncome,
          totalExpenses,
          profitLoss,
          profitMargin: profitMargin.toFixed(2),
          isProfitable: profitLoss > 0
        },
        timeline,
        expensesByType
      }
    })
  } catch (error) {
    console.error('Error generating profit/loss analysis:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to generate profit/loss analysis',
      error: error.message
    })
  }
}

// Get comprehensive dashboard analytics
export const getDashboardAnalytics = async (req, res) => {
  try {
    const today = moment().startOf('day').toDate()
    const endOfToday = moment().endOf('day').toDate()
    const startOfWeek = moment().startOf('week').toDate()
    const startOfMonth = moment().startOf('month').toDate()
    const startOfYear = moment().startOf('year').toDate()

    // Helper function to get stats for a period
    const getStats = async (startDate, endDate) => {
      const orders = await Order.find({
        createdAt: { $gte: startDate, $lte: endDate }
      })

      const modularOrders = await ModularOrder.find({
        createdAt: { $gte: startDate, $lte: endDate }
      })

      const completedOrders = [...orders, ...modularOrders].filter(o => 
        ['delivered', 'shipped', 'completed'].includes(o.status)
      )

      const income = completedOrders.reduce((sum, o) => {
        return sum + (o.pricing?.total || o.totalPrice || 0)
      }, 0)

      const expenses = await Expense.find({
        expenseDate: { $gte: startDate, $lte: endDate }
      })

      const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)

      return {
        income,
        expenses: totalExpenses,
        profit: income - totalExpenses,
        orders: orders.length + modularOrders.length,
        completedOrders: completedOrders.length
      }
    }

    const [daily, weekly, monthly, annual] = await Promise.all([
      getStats(today, endOfToday),
      getStats(startOfWeek, endOfToday),
      getStats(startOfMonth, endOfToday),
      getStats(startOfYear, endOfToday)
    ])

    res.status(200).json({
      success: true,
      data: {
        daily,
        weekly,
        monthly,
        annual
      }
    })
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard analytics',
      error: error.message
    })
  }
}
