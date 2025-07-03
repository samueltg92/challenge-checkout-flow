// WooCommerce Store API functions

const WOO_BASE_URL = 'https://tu-sitio.com' // Update with your actual WooCommerce site URL

interface ApiResponse {
  success: boolean
  message?: string
  data?: any
}

/**
 * Updates the cart by clearing it and adding a new product
 * @param productId - The WooCommerce product ID to add to cart
 * @returns Promise with success status and confirmation message
 */
export async function updateCart(productId: number): Promise<ApiResponse> {
  try {
    // Step 1: Clear the cart
    const clearResponse = await fetch(`${WOO_BASE_URL}/wp-json/wc/store/v1/cart/clear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for session
    })

    if (!clearResponse.ok) {
      throw new Error(`Failed to clear cart: ${clearResponse.status}`)
    }

    // Step 2: Add the new product to cart
    const addResponse = await fetch(`${WOO_BASE_URL}/wp-json/wc/store/v1/cart/add-item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for session
      body: JSON.stringify({
        id: productId,
        quantity: 1,
      }),
    })

    if (!addResponse.ok) {
      throw new Error(`Failed to add product to cart: ${addResponse.status}`)
    }

    const addData = await addResponse.json()

    return {
      success: true,
      message: 'Product added to cart successfully',
      data: addData,
    }
  } catch (error) {
    console.error('Cart update error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update cart',
    }
  }
}

/**
 * Get current cart contents
 * @returns Promise with cart data
 */
export async function getCart(): Promise<ApiResponse> {
  try {
    const response = await fetch(`${WOO_BASE_URL}/wp-json/wc/store/v1/cart`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`Failed to get cart: ${response.status}`)
    }

    const data = await response.json()

    return {
      success: true,
      message: 'Cart retrieved successfully',
      data,
    }
  } catch (error) {
    console.error('Get cart error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to get cart',
    }
  }
}