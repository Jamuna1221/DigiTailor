import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNotifications, getNotificationColor } from '../contexts/NotificationContext'

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

const formatFullDate = (date) => {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const Notifications = () => {
  const [filter, setFilter] = useState('all') // all, unread, read
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification,
    clearAllNotifications 
  } = useNotifications()

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead
    if (filter === 'read') return notification.isRead
    return true
  })

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id)
    }
  }

  const handleMarkAllAsRead = () => {
    markAllAsRead()
  }

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications? This action cannot be undone.')) {
      clearAllNotifications()
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">
              {notifications.length === 0 
                ? 'No notifications yet'
                : `${notifications.length} total notification${notifications.length !== 1 ? 's' : ''}`
              }
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-3">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-all"
                style={{ background: 'var(--theme-gradient)' }}
              >
                Mark All Read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === 'all'
                ? 'text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
            style={{
              background: filter === 'all' ? 'var(--theme-gradient)' : 'transparent'
            }}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === 'unread'
                ? 'text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
            style={{
              background: filter === 'unread' ? 'var(--theme-gradient)' : 'transparent'
            }}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === 'read'
                ? 'text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
            style={{
              background: filter === 'read' ? 'var(--theme-gradient)' : 'transparent'
            }}
          >
            Read ({notifications.length - unreadCount})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filter === 'all' 
                ? 'No notifications yet'
                : filter === 'unread'
                ? 'No unread notifications'
                : 'No read notifications'
              }
            </h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? "You're all caught up! New notifications will appear here."
                : filter === 'unread'
                ? "All your notifications have been read."
                : "No notifications have been read yet."
              }
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const colors = getNotificationColor(notification.type)
            return (
              <div
                key={notification.id}
                className={`bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 ${
                  !notification.isRead ? 'border-l-4 shadow-md' : 'border-gray-200'
                }`}
                style={{
                  borderLeftColor: !notification.isRead ? 'var(--theme-primary)' : undefined
                }}
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Notification Icon */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full ${colors.bg} ${colors.border} border-2 flex items-center justify-center`}>
                      <span className="text-xl">{notification.icon}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`text-lg font-semibold ${
                          notification.isRead ? 'text-gray-700' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h3>
                        
                        {/* Status Badge */}
                        {!notification.isRead && (
                          <span className="px-2 py-1 text-xs font-medium text-white rounded-full" style={{ background: 'var(--theme-primary)' }}>
                            New
                          </span>
                        )}
                      </div>

                      <p className={`text-base mb-3 ${
                        notification.isRead ? 'text-gray-600' : 'text-gray-800'
                      }`}>
                        {notification.message}
                      </p>

                      {/* Timestamp */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{formatTimeAgo(notification.createdAt)}</span>
                          <span>•</span>
                          <span>{formatFullDate(notification.createdAt)}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          {notification.linkTo && (
                            <Link
                              to={notification.linkTo}
                              onClick={() => handleNotificationClick(notification)}
                              className="px-3 py-1 text-sm font-medium text-white rounded-lg transition-colors hover:opacity-90"
                              style={{ background: 'var(--theme-gradient)' }}
                            >
                              View Details
                            </Link>
                          )}
                          
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="px-3 py-1 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Mark as Read
                            </button>
                          )}
                          
                          <button
                            onClick={() => removeNotification(notification.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            aria-label="Delete notification"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Notifications