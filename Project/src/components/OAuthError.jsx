import { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'

const OAuthError = () => {
  const location = useLocation()
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const message = params.get('message')
    setErrorMessage(message || 'Authentication failed')
  }, [location])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Authentication Failed</h2>
          <p className="text-red-600 mb-4">{errorMessage}</p>
          <Link to="/login" className="bg-red-600 text-white px-4 py-2 rounded">
            Try Again
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OAuthError
