function StatsCard({ stats }) {
  const statItems = [
    {
      name: 'Total Orders',
      value: stats.totalOrders,
      icon: '📦',
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Today\'s Revenue',
      value: `$${stats.revenueToday.toFixed(2)}`,
      icon: '💰',
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'Pending Orders',
      value: stats.pendingOrders,
      icon: '⏳',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      name: 'Urgent Orders',
      value: stats.urgentOrders,
      icon: '🚨',
      color: 'from-red-500 to-red-600'
    },
    {
      name: 'New Customers',
      value: stats.newCustomersToday,
      icon: '👥',
      color: 'from-purple-500 to-purple-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {statItems.map((item) => (
        <div key={item.name} className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{item.name}</p>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            </div>
            <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center text-white text-xl`}>
              {item.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsCard
