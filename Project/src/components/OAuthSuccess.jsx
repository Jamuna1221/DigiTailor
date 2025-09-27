import { useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'

const OAuthSuccess = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { switchUserCart } = useCart()

  // ✅ Memoize the function to prevent recreations
  const processOAuth = useCallback(async () => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    const userStr = params.get('user')
    
    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr))
        
        localStorage.setItem('token', token)
        localStorage.setItem('digitailor_user', JSON.stringify(user))
        
        switchUserCart(user)
        
        console.log(`Welcome ${user.firstName}! You've been signed in successfully.`)
        
        setTimeout(() => {
          if (user.role === 'tailor') {
            navigate('/tailor-dashboard', { replace: true })
          } else {
            navigate('/', { replace: true })
          }
        }, 1000)
        
      } catch (error) {
        console.error('Error processing OAuth success:', error)
        navigate('/login', { replace: true })
      }
    } else {
      navigate('/login', { replace: true })
    }
  }, [location.search, navigate, switchUserCart])

  useEffect(() => {
    processOAuth()
  }, [processOAuth]) // ✅ Only depend on the memoized function

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="text-center bg-white rounded-lg p-8 shadow-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Sign In Successful!</h2>
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  )
}

export default OAuthSuccess
