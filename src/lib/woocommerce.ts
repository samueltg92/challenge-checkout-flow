// WooCommerce Integration Configuration
// This object maps frontend selections to WooCommerce Product IDs

export interface ProductMapping {
  productId: number
  rulesKey: string
}

export interface WooCommerceConfig {
  [challengeType: string]: {
    [amount: string]: ProductMapping
  }
}

// Product configuration mapping - Update these IDs with your actual WooCommerce Product IDs
export const productConfig: WooCommerceConfig = {
  'one-step': {
    '10k': { productId: 101, rulesKey: 'one_step_10k' },
    '25k': { productId: 102, rulesKey: 'one_step_25k' },
    '50k': { productId: 103, rulesKey: 'one_step_50k' },
    '100k': { productId: 104, rulesKey: 'one_step_100k' }
  },
  'two-step': {
    '10k': { productId: 105, rulesKey: 'two_step_10k' },
    '25k': { productId: 106, rulesKey: 'two_step_25k' },
    '50k': { productId: 107, rulesKey: 'two_step_50k' },
    '100k': { productId: 108, rulesKey: 'two_step_100k' }
  }
}

// Add-ons mapping to WooCommerce Product IDs
export const addonsConfig: Record<string, { productId: number; name: string; price: number }> = {
  'ea-support': { productId: 201, name: 'Expert Advisor Support', price: 25 },
  'weekend-hold': { productId: 202, name: 'Weekend Holding', price: 15 },
  'reset-option': { productId: 203, name: 'One-Time Reset', price: 35 }
}

// WooCommerce API Configuration
export const wooConfig = {
  // Replace with your actual WooCommerce site URL
  baseUrl: process.env.REACT_APP_WOO_BASE_URL || 'https://your-site.com',
  
  // WooCommerce REST API endpoints
  endpoints: {
    addToCart: '/wp-json/wc/store/cart/add-item',
    updateCart: '/wp-json/wc/store/cart/update-item',
    removeFromCart: '/wp-json/wc/store/cart/remove-item',
    applyCoupon: '/wp-json/wc/store/cart/apply-coupon',
    removeCoupon: '/wp-json/wc/store/cart/remove-coupon',
    getCart: '/wp-json/wc/store/cart',
    checkout: '/wp-json/wc/store/checkout',
    getRules: '/wp-json/custom/v1/challenge-rules', // Custom endpoint for challenge rules
  },
  
  // Consumer key and secret for WooCommerce API (if needed for server-side calls)
  // Note: For frontend calls, use the Store API which doesn't require authentication
  consumerKey: process.env.REACT_APP_WOO_CONSUMER_KEY,
  consumerSecret: process.env.REACT_APP_WOO_CONSUMER_SECRET
}

// Helper function to get the current product selection
export const getCurrentProductSelection = (
  challengeType: string,
  challengeAmount: string,
  selectedAddons: string[]
) => {
  // Get main challenge product
  const mainProduct = productConfig[challengeType]?.[challengeAmount]
  
  // Get addon products
  const addonProducts = selectedAddons.map(addonId => addonsConfig[addonId]).filter(Boolean)
  
  return {
    mainProduct,
    addonProducts,
    allProductIds: [
      mainProduct?.productId,
      ...addonProducts.map(addon => addon.productId)
    ].filter(Boolean)
  }
}