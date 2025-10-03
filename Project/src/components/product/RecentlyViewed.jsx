// src/components/product/RecentlyViewed.jsx
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getRecentlyViewed } from '../../utils/recentlyViewed'
import { formatPrice } from '../../utils/formatPrice'

export default function RecentlyViewed() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef(null)

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(max-width: 768px)').matches
  }, [])

  const fetchServerItems = async (token) => {
    try {
      if (!token) return []
      const res = await fetch('http://localhost:5000/api/recently-viewed', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (data?.success && Array.isArray(data.data)) {
        return data.data.map((i) => ({
          id: i.productId || i.id,
          name: i.name,
          price: i.price,
          image: i.image,
          link: i.link || (i.productId ? `/product/${i.productId}` : '#'),
        }))
      }
    } catch (_) {}
    return []
  }

  const loadItems = async () => {
    setLoading(true)
    const token = localStorage.getItem('token')
    const server = await fetchServerItems(token)
    const local = getRecentlyViewed()
    const localNormalized = (local || []).map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      image: i.image,
      link: i.link,
    }))
    let base = server.length > 0 ? server : localNormalized

    // Cap to 10 without filling with recommendations; remain empty if nothing viewed yet
    base = base.slice(0, 10)

    setItems(base)
    setLoading(false)
  }

  useEffect(() => {
    loadItems()

    const onUpdate = () => {
      // Re-load based on latest state (handles both guest and logged-in)
      loadItems()
    }
    window.addEventListener('recentlyViewed:update', onUpdate)
    window.addEventListener('focus', onUpdate)
    return () => {
      window.removeEventListener('recentlyViewed:update', onUpdate)
      window.removeEventListener('focus', onUpdate)
    }
  }, [])

  const scrollByAmount = (dir) => {
    const el = scrollRef.current
    if (!el) return
    const amount = isMobile ? el.clientWidth * 0.9 : el.clientWidth
    el.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  // Drag-to-scroll support
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    let isDown = false
    let startX = 0
    let scrollLeft = 0

    const onDown = (e) => {
      isDown = true
      el.classList.add('cursor-grabbing')
      startX = (e.pageX || e.touches?.[0]?.pageX || 0) - el.offsetLeft
      scrollLeft = el.scrollLeft
    }
    const onLeave = () => {
      isDown = false
      el.classList.remove('cursor-grabbing')
    }
    const onUp = () => {
      isDown = false
      el.classList.remove('cursor-grabbing')
    }
    const onMove = (e) => {
      if (!isDown) return
      e.preventDefault()
      const x = (e.pageX || e.touches?.[0]?.pageX || 0) - el.offsetLeft
      const walk = (x - startX) * 1
      el.scrollLeft = scrollLeft - walk
    }

    el.addEventListener('mousedown', onDown)
    el.addEventListener('mouseleave', onLeave)
    el.addEventListener('mouseup', onUp)
    el.addEventListener('mousemove', onMove)
    el.addEventListener('touchstart', onDown, { passive: true })
    el.addEventListener('touchend', onUp)
    el.addEventListener('touchmove', onMove, { passive: false })

    return () => {
      el.removeEventListener('mousedown', onDown)
      el.removeEventListener('mouseleave', onLeave)
      el.removeEventListener('mouseup', onUp)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('touchstart', onDown)
      el.removeEventListener('touchend', onUp)
      el.removeEventListener('touchmove', onMove)
    }
  }, [isMobile])

  // Hide the section entirely until there are items to show
  if (loading || !items || items.length === 0) return null

  return (
    <section className="py-14 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Recently Viewed</h2>
          <div className="hidden md:flex items-center gap-2">
            
          </div>
        </div>

        {/* Desktop grid (>= lg): 5 columns with attractive cards */}
        <div className="hidden lg:grid grid-cols-5 gap-5">
          {items.map((p, idx) => (
            <div key={p?.id || idx} className="group relative rounded-xl overflow-hidden bg-white shadow ring-1 ring-gray-100 hover:shadow-lg transition-all">
              <Link to={p?.link || '#'}>
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image' }}
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/50 to-transparent">
                  <div className="flex items-center justify-between">
                    <div className="text-white font-semibold text-sm line-clamp-1 drop-shadow">
                      {p.name}
                    </div>
                    <div className="px-2 py-1 rounded-full text-xs font-bold bg-white/90 text-purple-700">
                      {formatPrice(p.price)}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Mobile/tablet: horizontal scroll with drag/swipe */}
        <div className="lg:hidden relative">
          <div className="absolute right-0 -top-12 flex items-center gap-2">
            <button
              aria-label="Scroll left"
              onClick={() => scrollByAmount(-1)}
              className="p-2 rounded-full bg-white/90 border border-gray-200 shadow"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button
              aria-label="Scroll right"
              onClick={() => scrollByAmount(1)}
              className="p-2 rounded-full bg-white/90 border border-gray-200 shadow"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth cursor-grab select-none"
            style={{ scrollBehavior: 'smooth' }}
          >
            {items.map((p, idx) => (
              <div key={p?.id || idx} className="min-w-[70%] sm:min-w-[55%]">
                <Link to={p?.link || '#'} className="block rounded-xl overflow-hidden bg-white shadow hover:shadow-lg transition">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image' }}
                    />
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-semibold text-gray-900 line-clamp-1">
                      {p.name}
                    </div>
                    <div className="text-sm text-purple-700 mt-1">
                      {formatPrice(p.price)}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
