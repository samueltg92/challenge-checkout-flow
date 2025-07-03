import { useState, useMemo } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import ChallengeTypeSelector from "@/components/checkout/ChallengeTypeSelector"
import ChallengeAmountSelector from "@/components/checkout/ChallengeAmountSelector"
import PlatformSelector from "@/components/checkout/PlatformSelector"
import AddonsSelector from "@/components/checkout/AddonsSelector"
import PersonalInfoForm from "@/components/checkout/PersonalInfoForm"
import DiscountCoupon from "@/components/checkout/DiscountCoupon"
import PaymentMethods from "@/components/checkout/PaymentMethods"
import OrderSummary from "@/components/checkout/OrderSummary"
import { useWooCommerce } from "@/hooks/useWooCommerce"
import { useToast } from "@/hooks/use-toast"
import { productConfig } from "@/lib/woocommerce"
import { updateCart } from "@/lib/woocommerce-api"

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string
}

interface OrderItem {
  id: string
  name: string
  price: number
}

export default function Checkout() {
  const { toast } = useToast()
  
  // Selection states
  const [challengeType, setChallengeType] = useState('one-step')
  const [challengeAmount, setChallengeAmount] = useState('10k')
  const [platform, setPlatform] = useState('mt4')
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  
  // Form states
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: ''
  })
  
  // Payment states
  const [paymentMethod, setPaymentMethod] = useState('stripe') // Default to stripe for WooCommerce
  
  // Calculate current product configuration
  const currentProduct = useMemo(() => {
    return productConfig[challengeType]?.[challengeAmount]
  }, [challengeType, challengeAmount])

  const rulesKey = currentProduct?.rulesKey

  // Fetch challenge rules dynamically
  const { 
    data: challengeRules, 
    isLoading: isLoadingRules, 
    isError: isErrorRules 
  } = useQuery({
    queryKey: ['challenge-rules', rulesKey],
    queryFn: async () => {
      const response = await fetch(`https://tu-sitio.com/wp-json/custom/v1/challenge-rules/${rulesKey}`)
      if (!response.ok) {
        throw new Error('Failed to fetch challenge rules')
      }
      return response.json()
    },
    enabled: !!rulesKey
  })

  // WooCommerce integration
  const {
    cart,
    isLoading,
    applyCoupon: wooApplyCoupon,
    removeCoupon: wooRemoveCoupon,
    processCheckout,
    getOrderSummary
  } = useWooCommerce({
    challengeType,
    challengeAmount,
    selectedAddons
  })

  // Cart update mutation
  const updateCartMutation = useMutation({
    mutationFn: updateCart,
    onSuccess: (response) => {
      if (response.success) {
        toast({
          title: "Success!",
          description: "Product added to cart successfully",
        })
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update cart",
          variant: "destructive"
        })
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update cart",
        variant: "destructive"
      })
    }
  })

  // Get order summary from WooCommerce cart
  const orderSummary = getOrderSummary()

  // Handle form changes
  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Handle addon toggle
  const handleAddonToggle = (addonId: string) => {
    setSelectedAddons(prev =>
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    )
  }

  // Handle coupon application using WooCommerce
  const handleCouponApply = async (coupon: string) => {
    if (!coupon) {
      // Get applied coupons from cart and remove them
      if (cart?.coupons && cart.coupons.length > 0) {
        for (const appliedCoupon of cart.coupons) {
          await wooRemoveCoupon(appliedCoupon.code)
        }
      }
      return
    }

    await wooApplyCoupon(coupon)
  }

  // Check if form is valid
  const isFormValid = Boolean(formData.firstName && formData.lastName && formData.email && paymentMethod)

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!currentProduct?.productId) {
      toast({
        title: "Error",
        description: "No product selected",
        variant: "destructive"
      })
      return
    }

    updateCartMutation.mutate(currentProduct.productId)
  }

  // Handle checkout using WooCommerce
  const handleCheckout = async () => {
    if (!isFormValid) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    // First add product to cart, then proceed to checkout
    if (currentProduct?.productId && !updateCartMutation.isPending) {
      await handleAddToCart()
      
      try {
        await processCheckout(formData, paymentMethod)
      } catch (error) {
        // Error handling is done in the hook
        console.error('Checkout failed:', error)
      }
    }
  }

  // Get applied coupon info for display
  const appliedCoupon = cart?.coupons?.[0]?.code || ''
  const discountAmount = cart?.coupons?.[0] ? parseFloat(cart.coupons[0].totals.total_discount) : 0
  const discountPercentage = orderSummary.subtotal > 0 ? Math.round((discountAmount / orderSummary.subtotal) * 100) : 0

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Challenge</h1>
          <p className="text-muted-foreground">Configure your trading challenge and secure your spot</p>
        </div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Column - Challenge Configuration */}
          <div className="lg:col-span-3 space-y-6">
            <ChallengeTypeSelector
              selectedType={challengeType}
              onTypeSelect={setChallengeType}
            />
            
            <ChallengeAmountSelector
              selectedAmount={challengeAmount}
              onAmountSelect={setChallengeAmount}
              challengeType={challengeType}
            />
            
            <PlatformSelector
              selectedPlatform={platform}
              onPlatformSelect={setPlatform}
            />
            
            <AddonsSelector
              selectedAddons={selectedAddons}
              onAddonToggle={handleAddonToggle}
            />
            
            {/* Challenge Conditions Section */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Challenge Conditions</h3>
              
              {isLoadingRules && (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">Cargando reglas...</p>
                </div>
              )}
              
              {isErrorRules && (
                <div className="text-center py-4">
                  <p className="text-destructive">Error al cargar las reglas del challenge</p>
                </div>
              )}
              
              {challengeRules && (
                <div className="space-y-3">
                  {Object.entries(challengeRules).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-border last:border-b-0">
                      <span className="text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                      </span>
                      <span className="font-medium text-foreground">{value as string}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - User Info & Payment */}
          <div className="lg:col-span-2 space-y-6">
            <PersonalInfoForm
              formData={formData}
              onFormChange={handleFormChange}
            />
            
            <DiscountCoupon
              onCouponApply={handleCouponApply}
              appliedCoupon={appliedCoupon}
              discount={discountPercentage}
            />
            
            <PaymentMethods
              selectedMethod={paymentMethod}
              onMethodSelect={setPaymentMethod}
            />
            
            <OrderSummary
              items={orderSummary.items}
              discount={discountPercentage}
              onCheckout={handleCheckout}
              isFormValid={isFormValid}
              isLoading={updateCartMutation.isPending || isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}