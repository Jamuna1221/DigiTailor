import { useState, useEffect } from 'react'

function ExpenseReports() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [daily, setDaily] = useState({ expenses: [], total: 0, count: 0 })
  const [range, setRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
    groupBy: 'day'
  })
  const [summary, setSummary] = useState({ total: { totalAmount: 0, count: 0 }, byType: [], byCategory: [], timeline: [] })
  const [loadingDaily, setLoadingDaily] = useState(false)
  const [loadingSummary, setLoadingSummary] = useState(false)

  const token = localStorage.getItem('token')

  const fetchDaily = async () => {
    try {
      setLoadingDaily(true)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses/date/${selectedDate}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) setDaily(data.data)
    } catch (e) {
      console.error('Failed to fetch daily expenses', e)
    } finally {
      setLoadingDaily(false)
    }
  }

  const fetchSummary = async () => {
    try {
      setLoadingSummary(true)
      const params = new URLSearchParams({ startDate: range.start, endDate: range.end, groupBy: range.groupBy })
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses/summary?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) setSummary(data.data)
    } catch (e) {
      console.error('Failed to fetch expense summary', e)
    } finally {
      setLoadingSummary(false)
    }
  }

  useEffect(() => {
    (async () => { await fetchDaily() })()
  }, [selectedDate])
  useEffect(() => {
    (async () => { await fetchSummary() })()
  }, [range.start, range.end, range.groupBy])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expense Reports</h1>
          <p className="text-gray-600">View daily and range-based expense analytics</p>
        </div>
      </div>

      {/* Daily picker */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Pick a date</label>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="border rounded px-3 py-2" />
        </div>
        <div className="mt-4">
          {loadingDaily ? (
            <p className="text-gray-500">Loading daily expenses...</p>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">{selectedDate} — ₹{(daily.total || 0).toLocaleString()}</h3>
                <span className="text-sm text-gray-500">{daily.count || 0} items</span>
              </div>
              {daily.expenses?.length ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {daily.expenses.map(e => (
                        <tr key={e._id}>
                          <td className="px-4 py-2 capitalize">{e.type}</td>
                          <td className="px-4 py-2">{e.category}</td>
                          <td className="px-4 py-2">{e.description}</td>
                          <td className="px-4 py-2 font-semibold">₹{e.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No expenses recorded for this date.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Range summary */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start</label>
            <input type="date" value={range.start} onChange={e => setRange(r => ({ ...r, start: e.target.value }))} className="border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End</label>
            <input type="date" value={range.end} onChange={e => setRange(r => ({ ...r, end: e.target.value }))} className="border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group by</label>
            <select value={range.groupBy} onChange={e => setRange(r => ({ ...r, groupBy: e.target.value }))} className="border rounded px-3 py-2">
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-sm text-gray-600">Total Expense</div>
            <div className="text-2xl font-bold">₹{(summary.total.totalAmount || 0).toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">{summary.total.count || 0} records</div>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <div className="text-sm font-medium mb-2">By Type</div>
            <ul className="space-y-1 max-h-40 overflow-auto">
              {summary.byType.map(t => (
                <li key={t._id} className="flex justify-between text-sm">
                  <span className="capitalize">{t._id}</span>
                  <span className="font-medium">₹{t.totalAmount.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <div className="text-sm font-medium mb-2">Top Categories</div>
            <ul className="space-y-1 max-h-40 overflow-auto">
              {summary.byCategory.map(c => (
                <li key={c._id} className="flex justify-between text-sm">
                  <span>{c._id}</span>
                  <span className="font-medium">₹{c.totalAmount.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Simple timeline bars */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Timeline</h3>
          <div className="space-y-2">
            {summary.timeline.map((pt) => (
              <div key={pt._id || pt.period} className="flex items-center gap-3">
                <div className="w-32 text-xs text-gray-600">{pt._id || pt.period}</div>
                <div className="flex-1 bg-gray-100 h-2 rounded">
                  <div className="h-2 bg-purple-600 rounded" style={{ width: `${Math.min(100, (pt.totalAmount || pt.amount || 0) / (summary.total.totalAmount || 1) * 100)}%` }} />
                </div>
                <div className="w-24 text-right text-xs font-medium">₹{(pt.totalAmount || pt.amount || 0).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpenseReports