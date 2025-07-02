// WooCommerce API Service
// Handles all AJAX calls to WooCommerce endpoints

import { wooConfig } from './woocommerce'

export interface CartItem {
  key: string
  id: number
  quantity: number
  name: string
  price: string
}

export interface CartResponse {
  items: CartItem[]
  totals: {
    total_price: string
    currency_code: string
    total_discount: string
  }
  coupons: Array<{
    code: string
    discount_type: string
    totals: {
      total_discount: string
    }
  }>
}

export interface CheckoutData {
  billing_address: {
    first_name: string
    last_name: string
    email: string
    phone: string
    country: string
  }
  payment_method: string
}

class WooCommerceService {
  private baseUrl: string

  constructor() {
    this.baseUrl = wooConfig.baseUrl
  }

  // Helper method to make API calls
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers
        },
        credentials: 'include' // Important for WooCommerce sessions
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('WooCommerce API Error:', error)
      throw error
    }
  }

  // Add item to cart
  async addToCart(productId: number, quantity: number = 1) {
    return this.makeRequest(wooConfig.endpoints.addToCart, {
      method: 'POST',
      body: JSON.stringify({
        id: productId,
        quantity: quantity
      })
    })
  }

  // Add multiple items to cart (for main product + addons)
  async addMultipleToCart(items: Array<{ productId: number; quantity?: number }>) {
    const promises = items.map(item => 
      this.addToCart(item.productId, item.quantity || 1)
    )
    
    return Promise.all(promises)
  }

  // Update cart item quantity
  async updateCartItem(itemKey: string, quantity: number) {
    return this.makeRequest(wooConfig.endpoints.updateCart, {
      method: 'POST',
      body: JSON.stringify({
        key: itemKey,
        quantity: quantity
      })
    })
  }

  // Remove item from cart
  async removeFromCart(itemKey: string) {
    return this.makeRequest(wooConfig.endpoints.removeFromCart, {
      method: 'POST',
      body: JSON.stringify({
        key: itemKey
      })
    })
  }

  // Clear entire cart
  async clearCart() {
    const cart = await this.getCart()
    const removePromises = cart.items.map(item => this.removeFromCart(item.key))
    return Promise.all(removePromises)
  }

  // Apply coupon
  async applyCoupon(couponCode: string) {
    return this.makeRequest(wooConfig.endpoints.applyCoupon, {
      method: 'POST',
      body: JSON.stringify({
        code: couponCode
      })
    })
  }

  // Remove coupon
  async removeCoupon(couponCode: string) {
    return this.makeRequest(wooConfig.endpoints.removeCoupon, {
      method: 'POST',
      body: JSON.stringify({
        code: couponCode
      })
    })
  }

  // Get current cart
  async getCart(): Promise<CartResponse> {
    return this.makeRequest(wooConfig.endpoints.getCart)
  }

  // Process checkout
  async processCheckout(checkoutData: CheckoutData) {
    return this.makeRequest(wooConfig.endpoints.checkout, {
      method: 'POST',
      body: JSON.stringify(checkoutData)
    })
  }

  // Get challenge rules (custom endpoint)
  async getChallengeRules(rulesKey: string) {
    return this.makeRequest(`${wooConfig.endpoints.getRules}/${rulesKey}`)
  }

  // Alternative method using query parameter
  async getChallengeRulesByQuery(rulesKey: string) {
    return this.makeRequest(`${wooConfig.endpoints.getRules}?rules=${rulesKey}`)
  }
}

// Export singleton instance
export const wooService = new WooCommerceService()

// Export the class for potential custom instances
export default WooCommerceService