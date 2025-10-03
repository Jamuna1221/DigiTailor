// src/utils/recentlyViewed.js

const STORAGE_KEY = 'recently_viewed_products'
const MAX_ITEMS = 10

function safeParse(json, fallback) {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

export function getRecentlyViewed() {
  if (typeof window === 'undefined') return []
  const raw = window.localStorage.getItem(STORAGE_KEY)
  const items = safeParse(raw, [])
  return Array.isArray(items) ? items : []
}

export function clearRecentlyViewed() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEY)
  dispatchRecentlyViewedEvent()
}

function save(items) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function addRecentlyViewed(item) {
  if (typeof window === 'undefined' || !item) return

  const required = ['id', 'name', 'price', 'image', 'link']
  const isValid = required.every((k) => item[k] !== undefined && item[k] !== null)
  if (!isValid) return

  const current = getRecentlyViewed()
  // Remove any existing item with same id
  const filtered = current.filter((x) => String(x.id) !== String(item.id))
  // Put newest at the front
  const next = [item, ...filtered].slice(0, MAX_ITEMS)
  save(next)
  dispatchRecentlyViewedEvent()
}

function dispatchRecentlyViewedEvent() {
  try {
    const ev = new CustomEvent('recentlyViewed:update')
    window.dispatchEvent(ev)
  } catch {
    // Ignore if CustomEvent is not supported
  }
}