import { useEffect, useMemo, useState } from 'react'

// Lightweight, dependency-free confetti burst for a short, festive effect
export default function ConfettiBurst({ duration = 3000, pieceCount = 80 }) {
  const [active, setActive] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setActive(false), duration)
    return () => clearTimeout(t)
  }, [duration])

  const pieces = useMemo(() => {
    const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#B980F0', '#FF9F1C']
    return Array.from({ length: pieceCount }).map((_, i) => {
      const left = Math.random() * 100 // vw
      const size = 6 + Math.random() * 6 // px
      const rotate = Math.random() * 360
      const color = colors[i % colors.length]
      const delay = Math.random() * 300 // ms
      const fall = 2000 + Math.random() * 1200 // ms
      const drift = (Math.random() - 0.5) * 40 // px horizontal drift
      const shape = Math.random() < 0.5 ? 'square' : 'circle'
      return { id: i, left, size, rotate, color, delay, fall, drift, shape }
    })
  }, [pieceCount])

  if (!active) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 60,
      opacity: 1,
      transition: 'opacity 400ms ease-out'
    }}>
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translate3d(0, -10vh, 0) rotate(0deg); opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translate3d(var(--drift), 110vh, 0) rotate(360deg); opacity: 0; }
        }
        @keyframes confetti-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(720deg); }
        }
      `}</style>
      {pieces.map(p => (
        <div key={p.id}
          style={{
            position: 'absolute',
            top: '-10vh',
            left: `${p.left}vw`,
            width: p.size,
            height: p.size,
            background: p.shape === 'square' ? p.color : 'transparent',
            borderRadius: p.shape === 'circle' ? '9999px' : 2,
            border: p.shape === 'circle' ? `2px solid ${p.color}` : 'none',
            transform: `rotate(${p.rotate}deg)`,
            animation: `confetti-fall ${p.fall}ms ease-out ${p.delay}ms both`,
            // horizontal drift via CSS var
            ['--drift']: `${p.drift}px`
          }}
        />
      ))}
    </div>
  )
}
