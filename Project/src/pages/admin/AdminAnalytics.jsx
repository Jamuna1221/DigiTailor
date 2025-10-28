import { useEffect, useState, useMemo } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  Line
} from 'recharts'

function AdminAnalytics() {
  const [period, setPeriod] = useState('monthly')
  const [range, setRange] = useState({
    start: new Date(new Date().setDate(1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const token = localStorage.getItem('token')

  const computeAutoStart = (p, endStr) => {
    const end = new Date(endStr)
    const pad = (n) => String(n).padStart(2, '0')
    const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
    if (p === 'daily') {
      // show last 14 days by default
      const s = new Date(end)
      s.setDate(s.getDate() - 13)
      return iso(s)
    } else if (p === 'weekly') {
      // show last 8 weeks (including current week)
      const s = new Date(end)
      const diff = s.getDay() // Sunday start like backend
      s.setDate(s.getDate() - diff - (7 * 7)) // go back 7 full weeks before current week
      return iso(s)
    } else if (p === 'monthly') {
      // show month-to-date by default
      const s = new Date(end.getFullYear(), end.getMonth(), 1)
      return iso(s)
    } else if (p === 'annual') {
      // show year-to-date
      const s = new Date(end.getFullYear(), 0, 1)
      return iso(s)
    }
    return iso(end)
  }

  // Auto-adjust start when period or end changes
  useEffect(() => {
    setRange(r => ({ ...r, start: computeAutoStart(period, r.end) }))
  }, [period, range.end])

  const fetchData = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ startDate: range.start, endDate: range.end, period })
      const res = await fetch(`http://localhost:5000/api/analytics/profit-loss?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const json = await res.json()
      if (json.success) setData(json.data)
    } catch (e) {
      console.error('Failed to fetch analytics', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    (async () => { await fetchData() })()
  }, [period, range.start, range.end])

  // Build simple SVG line path
  const buildPath = (timeline) => {
    if (!timeline || timeline.length === 0) return ''
    const values = timeline.map(t => t.profit)
    const max = Math.max(1, ...values)
    const min = Math.min(0, ...values)
    const width = 800
    const height = 200
    const stepX = width / Math.max(1, timeline.length - 1)

    return timeline.map((t, i) => {
      const x = i * stepX
      const y = height - ((t.profit - min) / (max - min)) * height
      return `${i === 0 ? 'M' : 'L'}${x},${y}`
    }).join(' ')
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Income vs Expense and Profit/Loss over time</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-4 flex flex-wrap gap-4 items-end">
        <div className="text-xs text-gray-500">Tip: Weekly shows last 8 weeks, Daily shows last 14 days. Adjust dates to compare custom ranges.</div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
          <select value={period} onChange={e => setPeriod(e.target.value)} className="border rounded px-3 py-2">
            <option value="daily">Daily (Last 14d)</option>
            <option value="weekly">Weekly (Last 8w)</option>
            <option value="monthly">Monthly (MTD)</option>
            <option value="annual">Annual (YTD)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start</label>
          <input type="date" value={range.start} onChange={e => setRange(r => ({ ...r, start: e.target.value }))} className="border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End</label>
          <input type="date" value={range.end} onChange={e => setRange(r => ({ ...r, end: e.target.value }))} className="border rounded px-3 py-2" />
        </div>
        <button onClick={fetchData} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Refresh</button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading analytics...</p>
      ) : data ? (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-sm text-gray-600">Income</div>
              <div className="text-2xl font-bold text-green-700">₹{data.summary.totalIncome.toLocaleString()}</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-sm text-gray-600">Expenses</div>
              <div className="text-2xl font-bold text-red-700">₹{data.summary.totalExpenses.toLocaleString()}</div>
            </div>
            <div className={`rounded-lg p-4 border ${data.summary.isProfitable ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
              <div className="text-sm text-gray-600">Profit/Loss</div>
              <div className={`text-2xl font-bold ${data.summary.isProfitable ? 'text-emerald-700' : 'text-rose-700'}`}>₹{data.summary.profitLoss.toLocaleString()}</div>
            </div>
            <div className="bg-white border rounded-lg p-4">
              <div className="text-sm text-gray-600">Profit Margin</div>
              <div className="text-2xl font-bold">{data.summary.profitMargin}%</div>
            </div>
          </div>

          {/* Timeline Graph (Interactive) */}
          <div className="bg-white border rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Profit/Loss Timeline</h3>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <AreaChart data={data.timeline.map(t => ({
                  period: t.period,
                  income: t.income || 0,
                  expense: t.expense || 0,
                  profit: t.profit || 0,
                  posProfit: (t.profit || 0) > 0 ? t.profit : 0,
                  negProfit: (t.profit || 0) < 0 ? t.profit : 0
                }))} margin={{ left: 8, right: 16, top: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="pos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="neg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v, n) => [
                    `₹${Number(v).toLocaleString()}`,
                    n === 'posProfit' ? 'Profit' : n === 'negProfit' ? 'Loss' : n
                  ]} />
                  <ReferenceLine y={0} stroke="#9CA3AF" strokeDasharray="4 4" />
                  {/* Income vs Expense lines */}
                  <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} dot={false} name="Income" />
                  <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} dot={false} name="Expense" />
                  {/* Profit/Loss shading */}
                  <Area type="monotone" dataKey="posProfit" stroke="#10b981" fillOpacity={0.2} fill="url(#pos)" dot={false} name="Profit" />
                  <Area type="monotone" dataKey="negProfit" stroke="#ef4444" fillOpacity={0.2} fill="url(#neg)" dot={false} name="Loss" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expense breakdown (Pie) */}
          <div className="bg-white border rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Expenses by Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={Object.entries(data.expensesByType).map(([k,v]) => ({ name: k, value: v }))}
                         dataKey="value" nameKey="name" outerRadius={100} label>
                      {Object.entries(data.expensesByType).map(([k], idx) => (
                        <Cell key={k} fill={["#6366f1","#10b981","#f59e0b","#ef4444","#06b6d4","#8b5cf6"][idx % 6]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(v) => `₹${Number(v).toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {Object.entries(data.expensesByType).map(([k,v]) => (
                  <div key={k} className="flex items-center justify-between bg-gray-50 rounded p-3">
                    <span className="capitalize text-sm text-gray-700">{k}</span>
                    <span className="text-sm font-semibold">₹{Number(v).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No data.</p>
      )}
    </div>
  )
}

export default AdminAnalytics