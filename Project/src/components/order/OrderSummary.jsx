import { Link } from 'react-router-dom'

function OrderSummary({ order }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'In_Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Confirmed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatStatus = (status) => {
    return status.replace('_', ' ')
  }

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Order #{order.orderNumber}
          </h3>
          <p className="text-gray-600">{order.designName}</p>
        </div>
        <div className="mt-2 sm:mt-0">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
            {formatStatus(order.status)}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Order Date:</span>
          <div className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</div>
        </div>
        <div>
          <span className="text-gray-500">Total Amount:</span>
          <div className="font-medium text-green-600">${order.totalAmount.toFixed(2)}</div>
        </div>
        <div className="flex justify-start sm:justify-end">
          <Link
            to={`/order-details/${order.id}`}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
