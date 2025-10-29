// API service functions for backend integration
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api` // Using environment variable for API URL

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('API call failed:', error)
    throw error
  }
}

// User API calls
export const userAPI = {
  getProfile: (userId) => apiCall(`/users/${userId}`),
  updateProfile: (userId, data) => apiCall(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  saveMeasurements: (userId, measurements) => apiCall(`/users/${userId}/measurements`, {
    method: 'POST',
    body: JSON.stringify(measurements)
  })
}

// Design API calls
export const designAPI = {
  getDesigns: (filters) => apiCall(`/designs?${new URLSearchParams(filters)}`),
  getDesignById: (id) => apiCall(`/designs/${id}`),
  generateAIDesign: (prompt, category, style) => apiCall('/ai/generate-design', {
    method: 'POST',
    body: JSON.stringify({ prompt, category, style })
  })
}

// Order API calls
export const orderAPI = {
  getUserOrders: (userId) => apiCall(`/orders?userId=${userId}`),
  createOrder: (orderData) => apiCall('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  }),
  updateOrderStatus: (orderId, status) => apiCall(`/orders/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  })
}

// Dashboard API calls
export const dashboardAPI = {
  getStats: () => apiCall('/dashboard/stats'),
  getAnalytics: (dateRange) => apiCall(`/dashboard/analytics?range=${dateRange}`)
}
