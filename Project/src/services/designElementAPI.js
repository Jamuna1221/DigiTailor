// src/services/designElementAPI.js

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

class DesignElementAPI {
  // ✅ Helper: Get auth headers if user is logged in
  static getAuthHeaders() {
    const token = localStorage.getItem('token')
    return token
      ? {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      : { 'Content-Type': 'application/json' }
  }

  // ✅ Get all available garment types
  static async getGarmentTypes() {
    try {
      const response = await fetch(`${API_BASE_URL}/garment-types`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()

      if (data.success) return data.data
      throw new Error(data.message || 'Failed to fetch garment types')
    } catch (error) {
      console.error('Error fetching garment types:', error)
      throw error
    }
  }

  // ✅ Get all unique design categories (without elements)
  static async getAllDesignCategories(garmentType = null) {
    try {
      const url = garmentType 
        ? `${API_BASE_URL}/all-design-categories?garmentType=${garmentType}`
        : `${API_BASE_URL}/all-design-categories`
        
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()

      if (data.success) return data.data
      throw new Error(data.message || 'Failed to fetch design categories')
    } catch (error) {
      console.error('Error fetching all design categories:', error)
      throw error
    }
  }

  // ✅ Get all design categories with their elements for a specific garment type
  static async getDesignCategories(garmentType = 'kurti') {
    try {
      const response = await fetch(
        `${API_BASE_URL}/design-categories?garmentType=${garmentType}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
        }
      )

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()

      if (data.success) return data.data
      throw new Error(data.message || 'Failed to fetch design categories')
    } catch (error) {
      console.error('Error fetching design categories:', error)
      throw error
    }
  }

  // ✅ Get designs by specific category and garment type
  static async getDesignsByCategory(categoryId, garmentType = 'kurti') {
    try {
      const response = await fetch(
        `${API_BASE_URL}/designs/${categoryId}?garmentType=${garmentType}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
        }
      )

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()

      if (data.success) return data.data
      throw new Error(data.message || 'Failed to fetch designs')
    } catch (error) {
      console.error('Error fetching designs by category:', error)
      throw error
    }
  }

  // 🚨 Submit modular design order (MUST require authentication)
  static async submitModularOrder(orderData) {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('You must be logged in to place an order.')

      const response = await fetch(`${API_BASE_URL}/modular-orders`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(orderData),
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()

      if (data.success) return data
      throw new Error(data.message || 'Failed to submit modular order')
    } catch (error) {
      console.error('Error submitting modular order:', error)
      throw error
    }
  }

  // ✅ Get modular order by ID (protected)
  static async getOrderById(orderId) {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('You must be logged in to view order details.')

      const response = await fetch(`${API_BASE_URL}/modular-orders/${orderId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()

      if (data.success) return data.data
      throw new Error(data.message || 'Failed to fetch order details')
    } catch (error) {
      console.error('Error fetching order by ID:', error)
      throw error
    }
  }
}

export default DesignElementAPI
 