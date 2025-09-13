import { useState, useEffect } from 'react'
import StatsCard from '../components/dashboard/StatsCard.jsx'
import AnalyticsDashboard from '../components/dashboard/AnalyticsDashboard.jsx'

function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    revenueToday: 0,
    pendingOrders: 0,
    urgentOrders: 0,
    newCustomersToday: 0
  })

  useEffect(() => {
    // Simulate API call for dashboard stats
    setTimeout(() => {
      setStats({
        totalOrders: 342,
        revenueToday: 2450.75,
        pendingOrders: 18,
        urgentOrders: 5,
        newCustomersToday: 12
      })
    }, 500)
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your business today.</p>
      </div>

      <StatsCard stats={stats} />
      <AnalyticsDashboard />
    </div>
  )
}

export default Dashboard
