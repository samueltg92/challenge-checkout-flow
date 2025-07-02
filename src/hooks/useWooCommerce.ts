import { useState, useEffect, useCallback } from 'react'
import { wooService, CartResponse } from '@/lib/woocommerce-service'
import { productConfig, addonsConfig, getCurrentProductSelection } from '@/lib/woocommerce'
import { useToast } from '@/hooks/use-toast'

interface UseWooCommerceProps {
  challengeType: string
  challengeAmount: string
  selectedAddons: string[]
}

export const useWooCommerce = ({ challengeType, challengeAmount, selectedAddons }: UseWooCommerceProps) => {
  const { toast } = useToast()
  const [cart, setCart] = useState<CartResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [challengeRules, setChallengeRules] = useState<any>(null)

  // Get current product selection
  const productSelection = getCurrentProductSelection(challengeType, challengeAmount, selectedAddons)

  // Load cart on mount
  useEffect(() => {
    loadCart()
  }, [])

  // Update cart when selection changes
  useEffect(() => {
    updateCartWithCurrentSelection()
  }, [challengeType, challengeAmount, selectedAddons])

  // Load challenge rules when type/amount changes
  useEffect(() => {
    if (productSelection.mainProduct?.rulesKey) {
      loadChallengeRules(productSelection.mainProduct.rulesKey)
    }
  }, [challengeType, challengeAmount])

  const loadCart = async () => {
    try {
      const cartData = await wooService.getCart()
      setCart(cartData)
    } catch (error) {
      console.error('Error loading cart:', error)
      toast({
        title: "Error",
        description: "Failed to load cart data",
        variant: "destructive"
      })
    }
  }

  const loadChallengeRules = async (rulesKey: string) => {
    try {
      const rules = await wooService.getChallengeRules(rulesKey)
      setChallengeRules(rules)
    } catch (error) {
      console.error('Error loading challenge rules:', error)
      // Fallback to static rules if API fails
      setChallengeRules(null)
    }
  }

  const updateCartWithCurrentSelection = async () => {
    if (!productSelection.mainProduct) return

    setIsLoading(true)
    try {
      // Clear existing cart first
      await wooService.clearCart()

      // Add main challenge product
      await wooService.addToCart(productSelection.mainProduct.productId)

      // Add selected addons
      for (const addon of productSelection.addonProducts) {
        await wooService.addToCart(addon.productId)
      }

      // Reload cart to get updated totals
      await loadCart()

      toast({
        title: "Cart Updated",
        description: "Your selection has been updated in the cart"
      })
    } catch (error) {
      console.error('Error updating cart:', error)
      toast({
        title: "Error",
        description: "Failed to update cart",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const applyCoupon = async (couponCode: string) => {
    if (!couponCode.trim()) return false

    setIsLoading(true)
    try {
      await wooService.applyCoupon(couponCode)
      await loadCart() // Reload to see discount applied
      
      toast({
        title: "Coupon Applied",
        description: `Discount applied successfully!`
      })
      return true
    } catch (error) {
      console.error('Error applying coupon:', error)
      toast({
        title: "Invalid Coupon",
        description: "The coupon code is not valid or has expired",
        variant: "destructive"
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const removeCoupon = async (couponCode: string) => {
    setIsLoading(true)
    try {
      await wooService.removeCoupon(couponCode)
      await loadCart()
      
      toast({
        title: "Coupon Removed",
        description: "Discount has been removed"
      })
    } catch (error) {
      console.error('Error removing coupon:', error)
      toast({
        title: "Error",
        description: "Failed to remove coupon",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const processCheckout = async (billingData: any, paymentMethod: string) => {
    setIsLoading(true)
    try {
      const checkoutData = {
        billing_address: {
          first_name: billingData.firstName,
          last_name: billingData.lastName,
          email: billingData.email,
          phone: billingData.phone,
          country: billingData.country
        },
        payment_method: paymentMethod
      }

      const result = await wooService.processCheckout(checkoutData)
      
      if (result.payment_result?.redirect_url) {
        // Redirect to payment gateway
        window.location.href = result.payment_result.redirect_url
      } else if (result.redirect_url) {
        // Redirect to thank you page
        window.location.href = result.redirect_url
      }

      return result
    } catch (error) {
      console.error('Error processing checkout:', error)
      toast({
        title: "Checkout Error",
        description: "Failed to process checkout. Please try again.",
        variant: "destructive"
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate order totals from WooCommerce cart
  const getOrderSummary = () => {
    if (!cart) return { items: [], subtotal: 0, discount: 0, total: 0 }

    const items = cart.items.map(item => ({
      id: item.key,
      name: item.name,
      price: parseFloat(item.price)
    }))

    const subtotal = parseFloat(cart.totals.total_price) + parseFloat(cart.totals.total_discount || '0')
    const discount = parseFloat(cart.totals.total_discount || '0')
    const total = parseFloat(cart.totals.total_price)

    return { items, subtotal, discount, total }
  }

  return {
    cart,
    isLoading,
    challengeRules,
    productSelection,
    applyCoupon,
    removeCoupon,
    processCheckout,
    getOrderSummary,
    refreshCart: loadCart
  }
}