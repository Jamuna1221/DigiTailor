// src/components/checkout/CheckoutRecommendations.jsx
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'

const API_BASE = `${import.meta.env.VITE_API_URL}/api`

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

export default function CheckoutRecommendations({ cartItems = [] }) {
  const { addToCart } = useCart()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [dismissed, setDismissed] = useState(false)

  const excludeIds = useMemo(() => new Set((cartItems || []).map((i) => String(i.id || i._id))), [cartItems])
  const categories = useMemo(() => {
    const unique = Array.from(new Set((cartItems || []).map((i) => i.category).filter(Boolean)))
    // Keep up to 3 categories to limit requests
    return unique.slice(0, 3)
  }, [cartItems])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        setLoading(true)
        let results = []

        // Try fetching by category buckets
        for (const cat of categories) {
          try {
            const url = `${API_BASE}/catalog?category=${encodeURIComponent(cat)}&limit=12`
            const res = await fetch(url)
            const data = await res.json()
            if (Array.isArray(data?.data)) {
              results = results.concat(data.data)
            }
          } catch {
            // Intentionally ignored
          }
        }

        // Fallback to top-items if nothing
        if (results.length === 0) {
          try {
            const res = await fetch(`${API_BASE}/catalog/top-items?type=views&limit=12`)
            const data = await res.json()
            if (Array.isArray(data?.data)) results = data.data
          } catch {
            // Error intentionally ignored
          }

        }

        // Exclude items already in cart and deduplicate
        const filtered = []
        const seen = new Set()
        for (const x of results) {
          const id = String(x._id || x.id)
          if (excludeIds.has(id)) continue
          if (seen.has(id)) continue
          seen.add(id)
          filtered.push(x)
        }

        if (cancelled) return
        setItems(normalizeItems(filtered).slice(0, 10))
      } catch {
        if (!cancelled) setItems([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [categories, excludeIds])

  const handleBuy = (p) => {
    addToCart({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      category: p.category,
      quantity: 1,
    })
  }

  if (dismissed) return null
  if (loading && items.length === 0) return null
  if (!loading && items.length === 0) return null

  return (
    <section className="mt-8">
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg md:text-xl font-extrabold text-gray-900">People who bought this also bought…</h3>
            <p className="text-sm text-gray-600">Add popular picks before you complete your order</p>
          </div>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-all text-sm"
          >
            Skip
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {(loading ? Array.from({ length: 6 }) : items).map((p, idx) => (
            <div key={p?.id || idx} className="group relative rounded-xl overflow-hidden bg-white ring-1 ring-gray-100 hover:shadow-md transition-all">
              {loading ? (
                <div className="aspect-[4/3] w-full animate-pulse bg-gray-200" />
              ) : (
                <div>
                  <Link to={p.link} className="block">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image' }}
                      />
                    </div>
                  </Link>
                  <div className="p-3">
                    <div className="text-sm font-semibold text-gray-900 line-clamp-1">{p.name}</div>
                    <div className="text-xs text-purple-700 mt-1">₹{(p.price || 0).toLocaleString()}</div>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleBuy(p)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-transform"
                        aria-label={`Buy ${p.name}`}
                      >
                        Buy 
                      </button>
                      <Link
                        to={p.link}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                      >
                        View 
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
