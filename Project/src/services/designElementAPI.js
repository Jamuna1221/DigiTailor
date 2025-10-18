const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

class DesignElementAPI {
  // Get all available garment types
  static async getGarmentTypes() {
    try {
      const response = await fetch(`${API_BASE_URL}/garment-types`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        return data.data
      } else {
        throw new Error(data.message || 'Failed to fetch garment types')
      }
    } catch (error) {
      console.error('Error fetching garment types:', error)
      throw error
    }
  }

  // Get all unique design categories (without elements, just category info)
  static async getAllDesignCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/all-design-categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        return data.data
      } else {
        throw new Error(data.message || 'Failed to fetch design categories')
      }
    } catch (error) {
      console.error('Error fetching all design categories:', error)
      throw error
    }
  }

  // Get all design categories with their elements for a specific garment type
  static async getDesignCategories(garmentType = 'kurti') {
    try {
      const response = await fetch(`${API_BASE_URL}/design-categories?garmentType=${garmentType}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        return data.data
      } else {
        throw new Error(data.message || 'Failed to fetch design categories')
      }
    } catch (error) {
      console.error('Error fetching design categories:', error)
      throw error
    }
  }

  // Get designs by specific category and garment type
  static async getDesignsByCategory(categoryId, garmentType = 'kurti') {
    try {
      const response = await fetch(`${API_BASE_URL}/designs/${categoryId}?garmentType=${garmentType}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        return data.data
      } else {
        throw new Error(data.message || 'Failed to fetch designs')
      }
    } catch (error) {
      console.error('Error fetching designs by category:', error)
      throw error
    }
  }

  // Submit modular design order
  static async submitModularOrder(orderData) {
    try {
      const response = await fetch(`${API_BASE_URL}/modular-orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        return data
      } else {
        throw new Error(data.message || 'Failed to submit order')
      }
    } catch (error) {
      console.error('Error submitting modular order:', error)
      throw error
    }
  }

  // Get order by ID
  static async getOrderById(orderId) {
    try {
      const response = await fetch(`${API_BASE_URL}/modular-orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        return data.data
      } else {
        throw new Error(data.message || 'Failed to fetch order')
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      throw error
    }
  }
}

export default DesignElementAPI