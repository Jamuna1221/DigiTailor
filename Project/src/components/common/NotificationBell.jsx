import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useNotifications, getNotificationColor } from '../../contexts/NotificationContext'

// Helper function to format time ago
const formatTimeAgo = (date) => {
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)
  
  if (diffInSeconds < 60) {
    return 'Just now'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  }
  
  return date.toLocaleDateString()
}

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification,
    clearAllNotifications 
  } = useNotifications()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id)
    }
    setIsOpen(false)
  }

  const handleMarkAllAsRead = () => {
    markAllAsRead()
  }

  const handleClearAll = () => {
    clearAllNotifications()
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={toggleDropdown}
        className="relative p-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 dark:from-slate-700 dark:to-slate-600 dark:hover:from-slate-600 dark:hover:to-slate-500 transition-all duration-300 group hover:scale-105 shadow-md hover:shadow-xl"
        aria-label={`Notifications (${unreadCount} unread)`}
      >
        {/* Bell Icon */}
        <svg 
          className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
          />
        </svg>
        
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-r" style={{ background: 'var(--theme-gradient)' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Notifications</h3>
              <div className="flex space-x-2">
                {notifications.length > 0 && (
                  <>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-white/80 hover:text-white px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={handleClearAll}
                      className="text-xs text-white/80 hover:text-white px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      Clear all
                    </button>
                  </>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <p className="text-sm text-white/80 mt-1">{unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</p>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6">
                <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No notifications</h4>
                <p className="text-gray-500 dark:text-slate-400 text-center">You're all caught up! New notifications will appear here.</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const colors = getNotificationColor(notification.type)
                return (
                  <div
                    key={notification.id}
                    className={`relative px-6 py-4 border-b border-gray-100 dark:border-slate-700 last:border-b-0 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-slate-700/50 ${
                      !notification.isRead ? 'bg-blue-50/30 dark:bg-blue-900/10 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    {/* Unread indicator dot */}
                    {!notification.isRead && (
                      <div className="absolute top-6 left-2 w-2 h-2 rounded-full" style={{ background: 'var(--theme-primary)' }}></div>
                    )}

                    {notification.linkTo ? (
                      <Link 
                        to={notification.linkTo}
                        onClick={() => handleNotificationClick(notification)}
                        className="block"
                      >
                        <NotificationContent notification={notification} colors={colors} />
                      </Link>
                    ) : (
                      <div onClick={() => handleNotificationClick(notification)} className="cursor-pointer">
                        <NotificationContent notification={notification} colors={colors} />
                      </div>
                    )}

                    {/* Remove button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        removeNotification(notification.id)
                      }}
                      className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      aria-label="Remove notification"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-6 py-3 bg-gray-50 dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700">
              <Link 
                to="/notifications"
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium hover:underline transition-colors"
                style={{ color: 'var(--theme-primary)' }}
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Separate component for notification content to avoid repetition
const NotificationContent = ({ notification, colors }) => (
  <div className="flex items-start space-x-3">
    {/* Icon */}
    <div className={`flex-shrink-0 w-10 h-10 rounded-full ${colors.bg} ${colors.border} border flex items-center justify-center`}>
      <span className="text-lg">{notification.icon}</span>
    </div>

    {/* Content */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-1">
        <h4 className={`text-sm font-semibold ${notification.isRead ? 'text-gray-700 dark:text-slate-300' : 'text-gray-900 dark:text-white'}`}>
          {notification.title}
        </h4>
        <span className="text-xs text-gray-500 dark:text-slate-400 flex-shrink-0 ml-2">
          {formatTimeAgo(notification.createdAt)}
        </span>
      </div>
      <p className={`text-sm ${notification.isRead ? 'text-gray-600 dark:text-slate-400' : 'text-gray-800 dark:text-slate-200'}`}>
        {notification.message}
      </p>
      {notification.linkTo && (
        <div className="mt-2">
          <span className="text-xs font-medium" style={{ color: 'var(--theme-primary)' }}>
            Click to view details →
          </span>
        </div>
      )}
    </div>
  </div>
)

export default NotificationBell