import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'

const RoleSelection = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { switchUserCart } = useCart()
  const [selectedRole, setSelectedRole] = useState('customer')
  const [loading, setLoading] = useState(false)

  const updateUserRole = async () => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    const userStr = params.get('user')
    
    if (!token || !userStr) {
      navigate('/login')
      return
    }

    setLoading(true)

    try {
      const user = JSON.parse(decodeURIComponent(userStr))
      
      // Update user role via API
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/update-role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: selectedRole })
      })

      if (response.ok) {
        const updatedUser = { ...user, role: selectedRole }
        
        // Store updated user data
        localStorage.setItem('token', token)
        localStorage.setItem('digitailor_user', JSON.stringify(updatedUser))
        switchUserCart(updatedUser)
        
        // Redirect based on role
        if (selectedRole === 'tailor') {
          navigate('/tailor-dashboard')
        } else {
          navigate('/')
        }
      } else {
        throw new Error('Failed to update role')
      }
    } catch (error) {
      console.error('Error updating role:', error)
      // Fallback: continue with default role
      const user = JSON.parse(decodeURIComponent(userStr))
      localStorage.setItem('token', token)
      localStorage.setItem('digitailor_user', JSON.stringify(user))
      navigate('/')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to DigiTailor!</h2>
          <p className="text-gray-600">Please select your account type to continue</p>
        </div>

        <div className="space-y-4">
          <label className={`block p-4 rounded-lg border-2 cursor-pointer transition-colors ${
            selectedRole === 'customer' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          }`}>
            <input
              type="radio"
              name="role"
              value="customer"
              checked={selectedRole === 'customer'}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="sr-only"
            />
            <div className="flex items-center">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Customer</h3>
                <p className="text-sm text-gray-600">Browse and order custom tailoring services</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedRole === 'customer' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
              }`}>
                {selectedRole === 'customer' && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
            </div>
          </label>

          <label className={`block p-4 rounded-lg border-2 cursor-pointer transition-colors ${
            selectedRole === 'tailor' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
          }`}>
            <input
              type="radio"
              name="role"
              value="tailor"
              checked={selectedRole === 'tailor'}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="sr-only"
            />
            <div className="flex items-center">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Tailor</h3>
                <p className="text-sm text-gray-600">Provide tailoring services to customers</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedRole === 'tailor' ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
              }`}>
                {selectedRole === 'tailor' && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
            </div>
          </label>
        </div>

        <button
          onClick={updateUserRole}
          disabled={loading}
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Setting up your account...' : 'Continue'}
        </button>
      </div>
    </div>
  )
}

export default RoleSelection
