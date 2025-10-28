import { useState, useEffect } from 'react'

function ManageSalaries() {
  const [tailors, setTailors] = useState([])
  const [salaries, setSalaries] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAllocateForm, setShowAllocateForm] = useState(false)
  
  const [formData, setFormData] = useState({
    tailorId: '',
    amount: '',
    salaryMonth: new Date().toISOString().slice(0, 7), // YYYY-MM format
    salaryType: 'monthly',
    paymentMethod: 'bank_transfer',
    paymentStatus: 'paid',
    paidAmount: '',
    notes: ''
  })

  useEffect(() => {
    fetchTailors()
    fetchSalaries()
  }, [])

  const fetchTailors = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/expenses/salary/tailors', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.success) {
        setTailors(data.data)
      }
    } catch (error) {
      console.error('Error fetching tailors:', error)
    }
  }

  const fetchSalaries = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/expenses?type=salary&limit=100', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.success) {
        setSalaries(data.data)
      }
    } catch (error) {
      console.error('Error fetching salaries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Auto-fill paid amount when amount changes
    if (name === 'amount') {
      setFormData(prev => ({
        ...prev,
        paidAmount: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/expenses/salary/allocate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          paidAmount: parseFloat(formData.paidAmount)
        })
      })

      const data = await response.json()
      
      if (data.success) {
        alert('Salary allocated successfully!')
        setShowAllocateForm(false)
        setFormData({
          tailorId: '',
          amount: '',
          salaryMonth: new Date().toISOString().slice(0, 7),
          salaryType: 'monthly',
          paymentMethod: 'bank_transfer',
          paymentStatus: 'paid',
          paidAmount: '',
          notes: ''
        })
        fetchSalaries()
      } else {
        alert(data.message || 'Failed to allocate salary')
      }
    } catch (error) {
      console.error('Error allocating salary:', error)
      alert('Failed to allocate salary')
    }
  }

  const getTotalSalaries = () => {
    return salaries.reduce((sum, sal) => sum + sal.amount, 0)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Salaries</h1>
            <p className="text-gray-600">Allocate and track tailor salaries</p>
          </div>
          <button
            onClick={() => setShowAllocateForm(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <span className="text-lg">+</span>
            <span>Allocate Salary</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl text-white p-6">
          <h3 className="text-sm font-medium mb-1 opacity-90">Total Salaries Paid</h3>
          <p className="text-3xl font-bold">₹{getTotalSalaries().toLocaleString()}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Active Tailors</h3>
          <p className="text-3xl font-bold text-gray-900">{tailors.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Payments This Month</h3>
          <p className="text-3xl font-bold text-gray-900">
            {salaries.filter(s => {
              const month = new Date().toISOString().slice(0, 7)
              return s.salaryMonth === month
            }).length}
          </p>
        </div>
      </div>

      {/* Salaries Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Salary Records</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="ml-3 text-gray-600">Loading salaries...</p>
          </div>
        ) : salaries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No salary records found</p>
            <button
              onClick={() => setShowAllocateForm(true)}
              className="text-green-600 hover:text-green-700"
            >
              Allocate first salary
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tailor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {salaries.map(salary => (
                  <tr key={salary._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-green-600 font-semibold">
                            {salary.tailorName?.charAt(0) || 'T'}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{salary.tailorName}</div>
                          <div className="text-xs text-gray-500">{salary.tailorId?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(salary.salaryMonth + '-01').toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long' 
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm capitalize text-gray-700">{salary.salaryType}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">
                        ₹{salary.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      ₹{salary.paidAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700 capitalize">
                        {salary.paymentMethod.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        salary.paymentStatus === 'paid' 
                          ? 'bg-green-100 text-green-800'
                          : salary.paymentStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {salary.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Allocate Salary Modal */}
      {showAllocateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Allocate Salary</h2>
                <button
                  onClick={() => setShowAllocateForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Select Tailor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Tailor *
                </label>
                <select
                  name="tailorId"
                  value={formData.tailorId}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Choose a tailor...</option>
                  {tailors.map(tailor => (
                    <option key={tailor._id} value={tailor._id}>
                      {tailor.firstName} {tailor.lastName} - {tailor.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary Amount *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    step="0.01"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0.00"
                  />
                </div>

                {/* Salary Month */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary Month *
                  </label>
                  <input
                    type="month"
                    name="salaryMonth"
                    value={formData.salaryMonth}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Salary Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary Type
                  </label>
                  <select
                    name="salaryType"
                    value={formData.salaryType}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="daily">Daily</option>
                    <option value="bonus">Bonus</option>
                    <option value="advance">Advance</option>
                  </select>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Payment Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="partial">Partial</option>
                  </select>
                </div>

                {/* Paid Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Paid Amount
                  </label>
                  <input
                    type="number"
                    name="paidAmount"
                    value={formData.paidAmount}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Additional notes..."
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAllocateForm(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Allocate Salary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageSalaries
