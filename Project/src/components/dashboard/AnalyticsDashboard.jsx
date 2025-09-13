function AnalyticsDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">#{i}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Order #DT100{i}</p>
                  <p className="text-sm text-gray-500">Traditional Blouse</p>
                </div>
              </div>
              <span className="text-green-600 font-medium">${Math.floor(Math.random() * 200) + 50}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Designs */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Designs</h3>
        <div className="space-y-4">
          {['Traditional Silk Saree', 'Modern Cotton Kurti', 'Fusion Party Dress', 'Bridal Lehenga'].map((design, i) => (
            <div key={design} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">{i + 1}</span>
                </div>
                <span className="text-gray-900">{design}</span>
              </div>
              <span className="text-gray-500">{Math.floor(Math.random() * 50) + 10} orders</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard
