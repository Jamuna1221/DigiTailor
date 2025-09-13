import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/common/Header.jsx'
import Footer from './components/common/Footer.jsx'
import Home from './pages/Home.jsx'
import Catalog from './pages/Catalog.jsx'
import AIStudio from './pages/AIStudio.jsx'
import Profile from './pages/Profile.jsx'
import OrderTracking from './pages/OrderTracking.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Gallery from './pages/Gallery.jsx'
import LoadingSpinner from './components/common/LoadingSpinner.jsx'

// Import the existing admin components
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageCatalog from './pages/admin/ManageCatalog.jsx'
import ManageGallery from './pages/admin/ManageGallery.jsx'
import ManageUsers from './pages/admin/ManageUsers.jsx' // ✅ Added this import

// Import new components for role-based routing
import TailorDashboard from './pages/TailorDashboard.jsx'

// Import the existing widgets
import WhatsAppWidget from './components/widgets/WhatsAppWidget.jsx'
import ChatbotWidget from './components/widgets/ChatbotWidget.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import Contact from './pages/Contact.jsx'
import { CartProvider } from './contexts/CartProvider'
import Cart from './pages/cart.jsx'
import ProductDetails from './components/product/ProductDetails.jsx'
import ManageOrders from './pages/admin/ManageOrders.jsx'
import Checkout from './pages/checkout.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'

// Role-based Route Protection Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('digitailor_user') || 'null')
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <button
            onClick={() => window.history.back()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }
  
  return children
}

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('digitailor_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  // Sign In function (you can call this from login page)
  const handleSignIn = (userData) => {
    setUser(userData)
    localStorage.setItem('digitailor_user', JSON.stringify(userData))
    
    // Role-based redirection after login
    if (userData.role === 'admin') {
      window.location.href = '/admin'
    } else if (userData.role === 'tailor') {
      window.location.href = '/tailor/dashboard'
    } else {
      window.location.href = '/dashboard'
    }
  }

  // Sign Out function
  const handleSignOut = () => {
    setUser(null)
    localStorage.removeItem('digitailor_user')
    localStorage.removeItem('token') // Also remove token if stored separately
    // Optional: Redirect to home page after sign out
    window.location.href = '/'
  }

  // Demo Sign In function (updated to use new role system)
  const demoSignIn = () => {
    const demoUser = {
      id: 1,
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'priya@example.com',
      role: 'customer', // Updated to use 'role' instead of 'userType'
      loyaltyPoints: 1250,
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100'
    }
    handleSignIn(demoUser)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          
          <Header user={user} onSignOut={handleSignOut} onSignIn={handleSignIn} />

          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home user={user} onDemoSignIn={demoSignIn} />} />
              <Route path="/login" element={<Login onSignIn={handleSignIn} />} />
              <Route path="/signup" element={<SignUp onSignIn={handleSignIn} />} />
              <Route path="/catalog" element={<Catalog user={user} />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/ai-studio" element={<AIStudio user={user} />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/gallery" element={<Gallery />} />
              
             <Route path="/forgot-password" element={<ForgotPassword/>} />
             <Route path="/reset-password" element={<ResetPassword />}/>
              <Route path="/checkout" element={<Checkout />} />
              {/* Customer Routes */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute allowedRoles={['customer', 'tailor', 'admin']}>
                    <Profile user={user} />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/orders" 
                element={
                  <ProtectedRoute allowedRoles={['customer', 'tailor', 'admin']}>
                    <OrderTracking user={user} />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout user={user} />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="catalog" element={<ManageCatalog />} />
                <Route path="gallery" element={<ManageGallery />} />
                <Route path="users" element={<ManageUsers />} /> {/* ✅ Added this route */}
                <Route path="orders" element={<ManageOrders />} />
              </Route>

              {/* Tailor Routes */}
              <Route 
                path="/tailor/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['tailor']}>
                    <TailorDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
          <Cart />

          {/* Add the widgets here - they'll appear on all pages */}
          <WhatsAppWidget 
            phoneNumber="918608737147" // Replace with your business WhatsApp number
            message="Hi! I'm interested in your tailoring services. Can you help me?"
            position="bottom-right"
          />
          <ChatbotWidget />
        </div>
      </Router>
    </CartProvider>
  )
}

export default App
