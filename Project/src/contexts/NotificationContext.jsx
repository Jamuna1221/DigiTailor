import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const NotificationContext = createContext({ 
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  removeNotification: () => {},
  clearAllNotifications: () => {}
})

// Notification types for different scenarios
export const NOTIFICATION_TYPES = {
  ORDER_PLACED: 'order_placed',
  ORDER_CONFIRMED: 'order_confirmed',
  ORDER_ASSIGNED: 'order_assigned',
  ORDER_STITCHING_COMPLETED: 'order_stitching_completed',
  ORDER_PACKED: 'order_packed',
  ORDER_SHIPPED: 'order_shipped',
  ORDER_DELIVERED: 'order_delivered',
  MEASUREMENT_SAVED: 'measurement_saved',
  DESIGN_READY: 'design_ready',
  ACCOUNT_UPDATE: 'account_update',
  SYSTEM: 'system',
  PROMOTION: 'promotion'
}

// Helper function to generate notification icons
export const getNotificationIcon = (type) => {
  switch (type) {
    case NOTIFICATION_TYPES.ORDER_PLACED:
      return '📋'
    case NOTIFICATION_TYPES.ORDER_CONFIRMED:
      return '✅'
    case NOTIFICATION_TYPES.ORDER_ASSIGNED:
      return '👨‍🎨'
    case NOTIFICATION_TYPES.ORDER_STITCHING_COMPLETED:
      return '👕'
    case NOTIFICATION_TYPES.ORDER_PACKED:
      return '📦'
    case NOTIFICATION_TYPES.ORDER_SHIPPED:
      return '🚚'
    case NOTIFICATION_TYPES.ORDER_DELIVERED:
      return '🎉'
    case NOTIFICATION_TYPES.MEASUREMENT_SAVED:
      return '📏'
    case NOTIFICATION_TYPES.DESIGN_READY:
      return '🎨'
    case NOTIFICATION_TYPES.ACCOUNT_UPDATE:
      return '👤'
    case NOTIFICATION_TYPES.PROMOTION:
      return '🎉'
    case NOTIFICATION_TYPES.SYSTEM:
    default:
      return '🔔'
  }
}

// Helper function to generate notification colors
export const getNotificationColor = (type) => {
  switch (type) {
    case NOTIFICATION_TYPES.ORDER_PLACED:
      return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' }
    case NOTIFICATION_TYPES.ORDER_CONFIRMED:
      return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' }
    case NOTIFICATION_TYPES.ORDER_ASSIGNED:
      return { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' }
    case NOTIFICATION_TYPES.ORDER_STITCHING_COMPLETED:
      return { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700' }
    case NOTIFICATION_TYPES.ORDER_PACKED:
      return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' }
    case NOTIFICATION_TYPES.ORDER_SHIPPED:
      return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' }
    case NOTIFICATION_TYPES.ORDER_DELIVERED:
      return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' }
    case NOTIFICATION_TYPES.MEASUREMENT_SAVED:
      return { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' }
    case NOTIFICATION_TYPES.DESIGN_READY:
      return { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700' }
    case NOTIFICATION_TYPES.ACCOUNT_UPDATE:
      return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' }
    case NOTIFICATION_TYPES.PROMOTION:
      return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' }
    case NOTIFICATION_TYPES.SYSTEM:
    default:
      return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' }
  }
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    // Load notifications from localStorage on mount
    const saved = localStorage.getItem('digitailor_notifications')
    if (saved) {
      try {
        return JSON.parse(saved).map(notification => ({
          ...notification,
          createdAt: new Date(notification.createdAt) // Convert back to Date object
        }))
      } catch (error) {
        console.error('Error loading notifications:', error)
        return []
      }
    }
    return []
  })

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('digitailor_notifications', JSON.stringify(notifications))
  }, [notifications])

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now() + Math.random(), // Simple ID generation
      createdAt: new Date(),
      isRead: false,
      ...notification
    }
    
    setNotifications(prev => [newNotification, ...prev])
    return newNotification.id
  }

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    )
  }

  const removeNotification = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    )
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  // Calculate unread count
  const unreadCount = useMemo(() => {
    return notifications.filter(notification => !notification.isRead).length
  }, [notifications])

  const value = useMemo(() => ({
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications
  }), [notifications, unreadCount])

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

// Utility function to create common notification types
export const createOrderNotification = (orderId, type, message, linkTo = null) => {
  return {
    type,
    title: `Order #${orderId.slice(-6)}`,
    message,
    linkTo: linkTo || `/orders/${orderId}`,
    icon: getNotificationIcon(type)
  }
}

export const createSystemNotification = (title, message, linkTo = null) => {
  return {
    type: NOTIFICATION_TYPES.SYSTEM,
    title,
    message,
    linkTo,
    icon: getNotificationIcon(NOTIFICATION_TYPES.SYSTEM)
  }
}