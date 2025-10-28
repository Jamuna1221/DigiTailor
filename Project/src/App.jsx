import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Header from './components/common/Header.jsx'
import Footer from './components/common/Footer.jsx'
import Home from './pages/Home.jsx'
import Catalog from './pages/Catalog.jsx'
import CustomStudio from './pages/CustomStudio.jsx'
import ModularCheckout from './pages/ModularCheckout.jsx'
import Profile from './pages/Profile.jsx'
import OrderTracking from './pages/OrderTracking.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Gallery from './pages/Gallery.jsx'
import LoadingSpinner from './components/common/LoadingSpinner.jsx'
import OrderDetails from './pages/OrderDetails'
import Notifications from './pages/Notifications.jsx'
import NotificationTest from './pages/NotificationTest.jsx'
// Import the existing admin components
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageCatalog from './pages/admin/ManageCatalog.jsx'
import ManageCustomDesigns from './pages/admin/ManageCustomDesigns.jsx'
import ManageGallery from './pages/admin/ManageGallery.jsx'
import ManageUsers from './pages/admin/ManageUsers.jsx'
import AdminSignup from './pages/admin/AdminSignup.jsx'

// Import new components for role-based routing
import TailorDashboard from './pages/TailorDashboard.jsx'

// Import the existing widgets
import WhatsAppWidget from './components/widgets/WhatsAppWidget.jsx'
import ChatbotWidget from './components/widgets/ChatbotWidget.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import Contact from './pages/Contact.jsx'

// ✅ FIXED: Import context providers correctly
import CartProvider from './contexts/CartContext' // Default export
import { WishlistProvider } from './contexts/WishlistContext' // Named export
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import { LanguageProvider } from './contexts/LanguageContext.jsx'
import { FontProvider } from './contexts/FontContext.jsx'
import { ColorThemeProvider } from './contexts/ColorThemeContext.jsx'
import { TextSizeProvider } from './contexts/TextSizeContext.jsx'
import { NotificationProvider } from './contexts/NotificationContext.jsx'

// ✅ FIXED: Import Cart with correct path (lowercase)
import Cart from './pages/Cart.jsx'
import ProductDetails from './components/product/ProductDetails.jsx'
import ManageOrders from './pages/admin/ManageOrders.jsx'
import ManageExpenses from './pages/admin/ManageExpenses.jsx'
import ManageSalaries from './pages/admin/ManageSalaries.jsx'
import ExpenseReports from './pages/admin/ExpenseReports.jsx'
import AdminAnalytics from './pages/admin/AdminAnalytics.jsx'
import Checkout from './pages/checkout.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import OAuthError from './components/OAuthError.jsx'
import OAuthSuccess from './components/OAuthSuccess.jsx'
import RoleSelection from './components/RoleSelection.jsx'
import OrderSuccess from './pages/OrderSuccess.jsx'

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

// Create a wrapper component that has access to navigate
function AppContent() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('digitailor_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('digitailor_user')
      }
    }
    setLoading(false)
  }, [])

  // Sign In function
  const handleSignIn = (userData) => {
    setUser(userData)
    localStorage.setItem('digitailor_user', JSON.stringify(userData))
    
    // Role-based redirection after login
    if (userData.role === 'admin') {
      navigate('/admin')
    } else if (userData.role === 'tailor') {
      navigate('/tailor/dashboard')
    } else {
      navigate('/dashboard')
    }
  }

  // Sign Out function - ✅ ONLY CHANGE: Don't clear cart on logout
  const handleSignOut = () => {
    setUser(null)
    localStorage.removeItem('digitailor_user')
    localStorage.removeItem('token')
    // ✅ Keep cart items after logout - removed this line:
    // localStorage.removeItem('digitailor_cart')
    navigate('/')
  }

  // Demo Sign In function
  const demoSignIn = () => {
    const demoUser = {
      id: 1,
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'priya@example.com',
      role: 'customer',
      loyaltyPoints: 1250,
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100'
    }
    handleSignIn(demoUser)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-[#0B1220] dark:via-[#0B1220] dark:to-[#0B1220] dark:text-white">
            
            <Header user={user} onSignOut={handleSignOut} onSignIn={handleSignIn} />

            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home user={user} onDemoSignIn={demoSignIn} />} />
                <Route path="/login" element={<Login onSignIn={handleSignIn} />} />
                <Route path="/signup" element={<SignUp onSignIn={handleSignIn} />} />
                <Route path="/admin-signup" element={<AdminSignup />} />
                <Route path="/catalog" element={<Catalog user={user} />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/ai-studio" element={<CustomStudio user={user} />} />
                <Route path="/custom-studio" element={<CustomStudio user={user} />} />
                <Route path="/modular-checkout" element={<ModularCheckout />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/test-notifications" element={<NotificationTest />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders/:orderId" element={<OrderDetails />} />
                <Route path="/auth/error" element={<OAuthError/>}/>
                <Route path="/oauth-success" element={<OAuthSuccess/>}/>
                <Route path="/role-selection" element={<RoleSelection/>}/>
                <Route 
                  path="/order-success" 
                  element={
                    <ProtectedRoute allowedRoles={['customer', 'tailor', 'admin']}>
                      <OrderSuccess />
                    </ProtectedRoute>
                  }
                />
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
                <Route 
                  path="/notifications" 
                  element={
                    <ProtectedRoute allowedRoles={['customer', 'tailor', 'admin']}>
                      <Notifications />
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
                  <Route path="custom-designs" element={<ManageCustomDesigns />} />
                  <Route path="gallery" element={<ManageGallery />} />
                  <Route path="orders" element={<ManageOrders />} />
                  <Route path="expenses" element={<ManageExpenses />} />
                  <Route path="salaries" element={<ManageSalaries />} />
                  <Route path="expense-reports" element={<ExpenseReports />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="users" element={<ManageUsers />} />
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
            
            {/* ✅ Cart component - will show when isCartOpen is true */}
            <Cart />

            {/* Widgets */}
            <WhatsAppWidget 
              phoneNumber="918608737147"
              message="Hi! I'm interested in your tailoring services. Can you help me?"
              position="bottom-right"
            />
            <ChatbotWidget />
            
            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  style: {
                    background: '#059669',
                  },
                },
                error: {
                  duration: 5000,
                  style: {
                    background: '#DC2626',
                  },
                },
              }}
            />
    </div>
  )
}

// Main App component that wraps AppContent with Router
function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <ThemeProvider>
          <LanguageProvider>
            <FontProvider>
              <ColorThemeProvider>
                <TextSizeProvider>
                  <NotificationProvider>
                    <Router>
                      <AppContent />
                    </Router>
                  </NotificationProvider>
                </TextSizeProvider>
              </ColorThemeProvider>
            </FontProvider>
          </LanguageProvider>
        </ThemeProvider>
      </WishlistProvider>
    </CartProvider>
  )
}

export default App
