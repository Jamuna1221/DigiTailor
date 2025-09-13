import { useState } from 'react';

const mockOrders = [
  {
    id: 'ORD1001',
    customer: 'Priya Sharma',
    email: 'priya@example.com',
    date: '2025-08-16',
    status: 'In Progress',
    items: [
      { name: 'Kurta Design', qty: 2, price: 2400 },
      { name: 'AI Lehenga', qty: 1, price: 5600 }
    ],
    total: 10400,
    address: '123 Fashion District, Mumbai'
  },
  {
    id: 'ORD1002',
    customer: 'Sarah Johnson',
    email: 'customer@example.com',
    date: '2025-08-14',
    status: 'Dispatched',
    items: [
      { name: 'AI Saree', qty: 1, price: 3500 }
    ],
    total: 3500,
    address: '789 Design Lane, Pune'
  },
  {
    id: 'ORD1003',
    customer: 'Arjun Patel',
    email: 'arjun.p@digitailor.com',
    date: '2025-08-10',
    status: 'Delivered',
    items: [
      { name: 'Blazer Set', qty: 1, price: 4800 }
    ],
    total: 4800,
    address: '456 Tailor Avenue, Delhi'
  }
];

const statuses = ['Received', 'In Progress', 'Dispatched', 'Delivered', 'Cancelled'];

function OrderManagement({ user }) {
  const [orders, setOrders] = useState(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filter orders by user if not admin
  const visibleOrders =
    user?.role === 'admin' ? orders : orders.filter(o => o.email === user?.email);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-indigo-700 mb-10">Order Management</h1>

        <div className="bg-white rounded-2xl shadow-xl border p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-400">No orders found.</td>
                  </tr>
                )}
                {visibleOrders.map(order => (
                  <tr key={order.id} className="border-t">
                    <td className="px-4 py-2 font-mono text-indigo-600">{order.id}</td>
                    <td className="px-4 py-2">{order.date}</td>
                    <td className="px-4 py-2">{order.customer}</td>
                    <td className="px-4 py-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700'
                          : order.status === 'Cancelled' ? 'bg-red-100 text-red-700'
                          : order.status === 'Dispatched' ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 font-semibold">₹{order.total}</td>
                    <td className="px-4 py-2">
                      <button
                        className="text-indigo-600 underline hover:text-indigo-900"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-lg relative">
              <button
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-900"
                onClick={() => setSelectedOrder(null)}
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">
                Order Details: <span className="font-mono">{selectedOrder.id}</span>
              </h2>
              <div className="mb-4"><b>Date:</b> {selectedOrder.date}</div>
              <div className="mb-4"><b>Customer:</b> {selectedOrder.customer}</div>
              <div className="mb-4"><b>Email:</b> {selectedOrder.email}</div>
              <div className="mb-4"><b>Delivery Address:</b> {selectedOrder.address}</div>
              <div className="mb-4">
                <b>Status:</b>{' '}
                {user?.role === 'admin' ? (
                  <select
                    value={selectedOrder.status}
                    className="px-3 py-2 border rounded-lg"
                    onChange={e => handleStatusChange(selectedOrder.id, e.target.value)}
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedOrder.status === 'Delivered' ? 'bg-green-100 text-green-700'
                      : selectedOrder.status === 'Cancelled' ? 'bg-red-100 text-red-700'
                      : selectedOrder.status === 'Dispatched' ? 'bg-blue-100 text-blue-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {selectedOrder.status}
                  </span>
                )}
              </div>
              <div className="mb-4">
                <b>Items:</b>
                <ul className="list-disc ml-6 mt-2 text-gray-700">
                  {selectedOrder.items.map((item, idx) => (
                    <li key={idx}>
                      {item.name} x {item.qty} — <span className="font-semibold">₹{item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-xl font-bold text-indigo-700 mt-6">
                Total: ₹{selectedOrder.total}
              </div>
              <div className="flex justify-end mt-8">
                <button
                  className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default OrderManagement;
