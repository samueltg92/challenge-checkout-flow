import { useState } from "react"
import ChallengeTypeSelector from "@/components/checkout/ChallengeTypeSelector"
import ChallengeAmountSelector from "@/components/checkout/ChallengeAmountSelector"
import PlatformSelector from "@/components/checkout/PlatformSelector"
import AddonsSelector from "@/components/checkout/AddonsSelector"
import ChallengeConditions from "@/components/checkout/ChallengeConditions"
import PersonalInfoForm from "@/components/checkout/PersonalInfoForm"
import DiscountCoupon from "@/components/checkout/DiscountCoupon"
import PaymentMethods from "@/components/checkout/PaymentMethods"
import OrderSummary from "@/components/checkout/OrderSummary"
import { useWooCommerce } from "@/hooks/useWooCommerce"
import { useToast } from "@/hooks/use-toast"

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
  
  // WooCommerce integration
  const {
    cart,
    isLoading,
    challengeRules,
    applyCoupon: wooApplyCoupon,
    removeCoupon: wooRemoveCoupon,
    processCheckout,
    getOrderSummary
  } = useWooCommerce({
    challengeType,
    challengeAmount,
    selectedAddons
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

    try {
      await processCheckout(formData, paymentMethod)
    } catch (error) {
      // Error handling is done in the hook
      console.error('Checkout failed:', error)
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
            
            <ChallengeConditions
              challengeType={challengeType}
              challengeAmount={challengeAmount}
            />
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
            />
          </div>
        </div>
      </div>
    </div>
  )
}