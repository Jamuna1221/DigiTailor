import { Link, useLocation } from 'react-router-dom'

function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation()

  const menuItems = [
    { path: '/admin', icon: '📊', label: 'Dashboard', exact: true },
    { path: '/admin/catalog', icon: '👗', label: 'Manage Catalog' },
    { path: '/admin/custom-designs', icon: '🎨', label: 'Manage Custom Designs' },
    { path: '/admin/gallery', icon: '🖼️', label: 'Manage Gallery' },
    { path: '/admin/orders', icon: '📦', label: 'Manage Orders' },
    { path: '/admin/users', icon: '👥', label: 'Manage Users' },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center space-x-2">
            <div className="bg-white/20 p-2 rounded-lg">
              <span className="text-white font-bold text-lg">DT</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-blue-100">DigiTailor</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8">
          {menuItems.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path)

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-medium' : ''
                }`}
              >
                <span className="mr-3 text-xl">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 w-full p-4">
          <Link
            to="/"
            className="flex items-center justify-center w-full px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Website
          </Link>
        </div>
      </div>
    </>
  )
}

export default AdminSidebar
