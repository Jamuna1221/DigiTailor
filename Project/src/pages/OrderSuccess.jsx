import { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ConfettiBurst from '../components/common/ConfettiBurst.jsx'
import { useCart } from '../contexts/CartContext'

export default function OrderSuccess() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { clearCart } = useCart()
  const orderNumber = state?.orderNumber || 'N/A'
  const orderId = state?.orderId || 'N/A'

  const [showConfetti, setShowConfetti] = useState(true)
  const confettiTimerRef = useRef(null)
  const redirectTimerRef = useRef(null)

  useEffect(() => {
    // Clear the cart now that we're safely on the success page
    clearCart()

    confettiTimerRef.current = setTimeout(() => setShowConfetti(false), 3200)
    // Auto-redirect to orders shortly after
    redirectTimerRef.current = setTimeout(() => navigate('/orders'), 3800)

    return () => {
      if (confettiTimerRef.current) clearTimeout(confettiTimerRef.current)
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current)
    }
  }, [navigate, clearCart])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 bg-gray-50 relative">
      {showConfetti && (
        <>
          <ConfettiBurst duration={3500} pieceCount={160} />
          <ConfettiBurst duration={3000} pieceCount={120} />
        </>
      )}

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-9 h-9 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Order placed successfully!</h1>
        <p className="mt-2 text-gray-600">Thank you for your purchase. We7re getting your order ready.</p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="font-semibold text-gray-900">{orderNumber}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="font-semibold text-gray-900 break-all">{orderId}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              if (confettiTimerRef.current) clearTimeout(confettiTimerRef.current)
              if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current)
              if (orderId && orderId !== 'N/A') {
                navigate(`/orders/${orderId}`)
              } else {
                navigate('/orders')
              }
            }}
            className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-5 py-2.5 text-white font-medium hover:bg-purple-700 transition"
          >
            View details
          </button>
          <button
            onClick={() => {
              if (confettiTimerRef.current) clearTimeout(confettiTimerRef.current)
              if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current)
              navigate('/catalog')
            }}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-50"
          >
            Continue shopping
          </button>
        </div>
        <p className="mt-4 text-xs text-gray-500">You will be redirected to your orders shortly.</p>
      </div>
    </div>
  )
}
