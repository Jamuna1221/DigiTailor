import { useNotifications, NOTIFICATION_TYPES, createOrderNotification, createSystemNotification } from '../contexts/NotificationContext'

// Custom hook for easier notification management
export const useNotificationHelpers = () => {
  const { addNotification } = useNotifications()

  // Order-related notifications
  const notifyOrderConfirmed = (orderId) => {
    const notification = createOrderNotification(
      orderId,
      NOTIFICATION_TYPES.ORDER_CONFIRMED,
      'Your order has been confirmed and is being processed.',
      `/orders/${orderId}`
    )
    return addNotification(notification)
  }

  const notifyOrderShipped = (orderId, trackingNumber = null) => {
    const message = 'Your order is out for delivery.'
    
    const notification = createOrderNotification(
      orderId,
      NOTIFICATION_TYPES.ORDER_SHIPPED,
      message,
      `/orders/${orderId}`
    )
    return addNotification(notification)
  }

  const notifyOrderDelivered = (orderId) => {
    const notification = createOrderNotification(
      orderId,
      NOTIFICATION_TYPES.ORDER_DELIVERED,
      'Your order has been delivered.',
      `/orders/${orderId}`
    )
    return addNotification(notification)
  }

  // Additional Order Status Helpers
  const notifyOrderPlaced = (orderId, orderDetails = {}) => {
    const notification = createOrderNotification(
      orderId,
      NOTIFICATION_TYPES.ORDER_PLACED,
      'Your order has been placed successfully.',
      `/orders/${orderId}`
    )
    return addNotification(notification)
  }

  const notifyOrderAssigned = (orderId, tailorInfo = {}) => {
    const tailorName = tailorInfo.firstName && tailorInfo.lastName 
      ? `${tailorInfo.firstName} ${tailorInfo.lastName}` 
      : tailorInfo.name || 'Selvi K'
    
    const message = `Your order has been assigned to ${tailorName}.`
    
    const notification = createOrderNotification(
      orderId,
      NOTIFICATION_TYPES.ORDER_ASSIGNED,
      message,
      `/orders/${orderId}`
    )
    return addNotification(notification)
  }

  const notifyStitchingCompleted = (orderId, estimatedDelivery = '') => {
    const message = 'Your stitching is completed.'
    
    const notification = createOrderNotification(
      orderId,
      NOTIFICATION_TYPES.ORDER_STITCHING_COMPLETED,
      message,
      `/orders/${orderId}`
    )
    return addNotification(notification)
  }

  const notifyOrderPacked = (orderId, trackingNumber = '') => {
    const message = 'Your order has been packed.'
    
    const notification = createOrderNotification(
      orderId,
      NOTIFICATION_TYPES.ORDER_PACKED,
      message,
      `/orders/${orderId}`
    )
    return addNotification(notification)
  }

  // Enhanced order status change handler
  const handleOrderStatusChange = (orderId, newStatus, additionalInfo = {}) => {
    const statusKey = newStatus.toLowerCase().replace(/\s+/g, '_')
    
    switch (statusKey) {
      case 'placed':
        return notifyOrderPlaced(orderId, additionalInfo)
      case 'confirmed':
        return notifyOrderConfirmed(orderId)
      case 'assigned':
        return notifyOrderAssigned(orderId, additionalInfo.tailorInfo || {})
      case 'completed':
      case 'stitching_completed':
        return notifyStitchingCompleted(orderId, additionalInfo.estimatedDelivery)
      case 'packed':
        return notifyOrderPacked(orderId, additionalInfo.trackingNumber)
      case 'shipped':
      case 'out_for_delivery':
        return notifyOrderShipped(orderId, additionalInfo.trackingNumber)
      case 'delivered':
        return notifyOrderDelivered(orderId)
      default:
        // Generic order update notification
        const notification = createOrderNotification(
          orderId,
          NOTIFICATION_TYPES.SYSTEM,
          `Your order status has been updated to: ${newStatus}`,
          `/orders/${orderId}`
        )
        return addNotification(notification)
    }
  }

  // Measurement-related notifications
  const notifyMeasurementSaved = () => {
    const notification = {
      type: NOTIFICATION_TYPES.MEASUREMENT_SAVED,
      title: 'Measurements Saved',
      message: 'Your body measurements have been saved successfully.',
      linkTo: '/profile',
      icon: '📏'
    }
    return addNotification(notification)
  }

  // Design-related notifications
  const notifyDesignReady = (designName) => {
    const notification = {
      type: NOTIFICATION_TYPES.DESIGN_READY,
      title: 'Design Ready',
      message: `Your custom design "${designName}" is ready for review!`,
      linkTo: '/ai-studio',
      icon: '🎨'
    }
    return addNotification(notification)
  }

  // Account-related notifications
  const notifyAccountUpdate = (updateType = 'profile') => {
    const messages = {
      profile: 'Your profile information has been updated successfully.',
      password: 'Your password has been changed successfully.',
      email: 'Your email address has been updated.',
      preferences: 'Your preferences have been saved.'
    }
    
    const notification = {
      type: NOTIFICATION_TYPES.ACCOUNT_UPDATE,
      title: 'Account Updated',
      message: messages[updateType] || messages.profile,
      linkTo: '/profile',
      icon: '👤'
    }
    return addNotification(notification)
  }

  // System notifications
  const notifySystem = (title, message, linkTo = null) => {
    const notification = createSystemNotification(title, message, linkTo)
    return addNotification(notification)
  }

  // Promotion notifications
  const notifyPromotion = (title, message, linkTo = '/catalog') => {
    const notification = {
      type: NOTIFICATION_TYPES.PROMOTION,
      title,
      message,
      linkTo,
      icon: '🎉'
    }
    return addNotification(notification)
  }

  // Welcome notification for new users
  const notifyWelcome = (userName) => {
    const notification = createSystemNotification(
      'Welcome to DigiTailor!',
      `Hi ${userName}! Welcome to DigiTailor. Start by exploring our AI-powered design studio or browse our catalog.`,
      '/ai-studio'
    )
    return addNotification(notification)
  }

  return {
    // Order Status Notifications
    notifyOrderPlaced,
    notifyOrderConfirmed,
    notifyOrderAssigned,
    notifyStitchingCompleted,
    notifyOrderPacked,
    notifyOrderShipped,
    notifyOrderDelivered,
    handleOrderStatusChange,
    
    // Other Notifications
    notifyMeasurementSaved,
    notifyDesignReady,
    notifyAccountUpdate,
    notifySystem,
    notifyPromotion,
    notifyWelcome
  }
}

// Sample function to generate demo notifications (for testing)
export const generateSampleNotifications = (addNotification) => {
  // Complete order status flow notifications
  addNotification(createOrderNotification(
    'ORD-2024-001234',
    NOTIFICATION_TYPES.ORDER_PLACED,
    'Your custom saree order has been placed successfully and is being processed.',
    '/orders/ORD-2024-001234'
  ))

  addNotification(createOrderNotification(
    'ORD-2024-001235',
    NOTIFICATION_TYPES.ORDER_ASSIGNED,
    'Your designer kurti order has been assigned to Selvi K. Work will begin shortly.',
    '/orders/ORD-2024-001235'
  ))

  addNotification(createOrderNotification(
    'ORD-2024-001236',
    NOTIFICATION_TYPES.ORDER_STITCHING_COMPLETED,
    'Great news! The stitching for your wedding lehenga is now complete. Estimated delivery: Dec 25.',
    '/orders/ORD-2024-001236'
  ))

  addNotification(createOrderNotification(
    'ORD-2024-001237',
    NOTIFICATION_TYPES.ORDER_PACKED,
    'Your blouse order has been carefully packed and is ready for shipment. Tracking: DT2024001237',
    '/orders/ORD-2024-001237'
  ))

  addNotification(createOrderNotification(
    'ORD-2024-001233',
    NOTIFICATION_TYPES.ORDER_SHIPPED,
    'Your designer kurti is out for delivery! Expected arrival: Tomorrow. Tracking: DT2024001233',
    '/orders/ORD-2024-001233'
  ))

  addNotification(createOrderNotification(
    'ORD-2024-001232',
    NOTIFICATION_TYPES.ORDER_DELIVERED,
    '🎉 Your custom churidar has been delivered successfully! We hope you love it.',
    '/orders/ORD-2024-001232'
  ))

  // Sample design notification
  addNotification({
    type: NOTIFICATION_TYPES.DESIGN_READY,
    title: 'AI Design Ready',
    message: 'Your custom wedding lehenga design "Golden Elegance" is ready for review!',
    linkTo: '/ai-studio',
    icon: '🎨'
  })

  // Sample measurement notification
  addNotification({
    type: NOTIFICATION_TYPES.MEASUREMENT_SAVED,
    title: 'Measurements Updated',
    message: 'Your body measurements have been updated successfully.',
    linkTo: '/profile',
    icon: '📏'
  })

  // Sample promotion notification
  addNotification({
    type: NOTIFICATION_TYPES.PROMOTION,
    title: 'Special Offer!',
    message: '🎉 Get 20% off on all custom designs this week. Limited time offer!',
    linkTo: '/catalog',
    icon: '🎉'
  })

  // Sample system notification
  addNotification(createSystemNotification(
    'Profile Update',
    'Your profile information has been updated successfully.',
    '/profile'
  ))
}