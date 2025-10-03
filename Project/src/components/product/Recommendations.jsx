// src/components/product/Recommendations.jsx
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const API_BASE = 'http://localhost:5000/api'

function normalizeItems(items = []) {
  return (items || []).map((c) => ({
    id: c._id || c.id,
    name: c.name,
    image:
      c.primaryImage ||
      (Array.isArray(c.additionalImages) ? c.additionalImages[0] : null) ||
      'https://via.placeholder.com/400x300?text=No+Image',
    price: c.basePrice || 0,
    link: `/product/${c._id || c.id}`,
    category: c.category,
  }))
}

export default function Recommendations({ productId, category, tags = [] }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const tagQuery = useMemo(() => {
    if (!Array.isArray(tags) || tags.length === 0) return ''
    // Prefer the first descriptive tag; you can extend this to try multiple
    return String(tags[0] || '').trim()
  }, [tags])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        setLoading(true)

        // 1) Try category + tag search
        let firstUrl = `${API_BASE}/catalog?limit=12`
        if (category) firstUrl += `&category=${encodeURIComponent(category)}`
        if (tagQuery) firstUrl += `&search=${encodeURIComponent(tagQuery)}`
        let res = await fetch(firstUrl)
        let data = await res.json()

        let list = Array.isArray(data?.data) ? data.data : []
        // Exclude the current product
        list = list.filter((x) => String(x._id || x.id) !== String(productId))

        // 2) Fallback: category only
        if (list.length < 1 && category) {
          const url = `${API_BASE}/catalog?category=${encodeURIComponent(category)}&limit=12`
          res = await fetch(url)
          data = await res.json()
          list = Array.isArray(data?.data) ? data.data : []
          list = list.filter((x) => String(x._id || x.id) !== String(productId))
        }

        // 3) Fallback: top-items
        if (list.length < 1) {
          const url = `${API_BASE}/catalog/top-items?type=views&limit=12`
          res = await fetch(url)
          data = await res.json()
          list = Array.isArray(data?.data) ? data.data : []
          list = list.filter((x) => String(x._id || x.id) !== String(productId))
        }

        if (cancelled) return
        setItems(normalizeItems(list).slice(0, 12))
      } catch (_) {
        if (!cancelled) setItems([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [productId, category, tagQuery])

  // Hide the section if nothing to recommend
  if (loading && items.length === 0) return null
  if (!loading && items.length === 0) return null

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-2">
              <span>Discover More</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Recommended for you
            </h2>
            <p className="text-gray-600 mt-2">Explore designs similar to what you just viewed</p>
          </div>
          <Link
            to="/catalog"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-purple-200 text-purple-700 bg-white hover:bg-purple-50 hover:border-purple-300 transition-all"
          >
            <span>Explore all</span>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {(loading ? Array.from({ length: 10 }) : items).map((p, idx) => (
            <div
              key={p?.id || idx}
              className="group relative rounded-2xl overflow-hidden bg-white shadow ring-1 ring-gray-100 hover:shadow-xl transition-all"
            >
              {loading ? (
                <div className="aspect-[4/3] w-full animate-pulse bg-gray-200" />
              ) : (
                <Link to={p.link}>
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image'
                      }}
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/50 to-transparent">
                    <div className="flex items-center justify-between">
                      <div className="text-white font-semibold text-sm line-clamp-1 drop-shadow">
                        {p.name}
                      </div>
                      <div className="px-2 py-1 rounded-full text-xs font-bold bg-white/90 text-purple-700">
                        ₹{(p.price || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Explore all button */}
        <div className="sm:hidden text-center mt-8">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-purple-200 text-purple-700 bg-white hover:bg-purple-50 hover:border-purple-300 transition-all"
          >
            <span>Explore all</span>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
