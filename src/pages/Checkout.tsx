import { useState, useEffect } from "react"
import ChallengeTypeSelector from "@/components/checkout/ChallengeTypeSelector"
import ChallengeAmountSelector from "@/components/checkout/ChallengeAmountSelector"
import PlatformSelector from "@/components/checkout/PlatformSelector"
import AddonsSelector from "@/components/checkout/AddonsSelector"
import ChallengeConditions from "@/components/checkout/ChallengeConditions"
import PersonalInfoForm from "@/components/checkout/PersonalInfoForm"
import DiscountCoupon from "@/components/checkout/DiscountCoupon"
import PaymentMethods from "@/components/checkout/PaymentMethods"
import OrderSummary from "@/components/checkout/OrderSummary"
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
  const [paymentMethod, setPaymentMethod] = useState('credit-card')
  const [appliedCoupon, setAppliedCoupon] = useState('')
  const [discount, setDiscount] = useState(0)

  // Product configuration mapping
  const productConfig: Record<string, Record<string, { price: number; name: string }>> = {
    'one-step': {
      '10k': { price: 82, name: 'One-Step Challenge $10,000' },
      '25k': { price: 149, name: 'One-Step Challenge $25,000' },
      '50k': { price: 299, name: 'One-Step Challenge $50,000' },
      '100k': { price: 549, name: 'One-Step Challenge $100,000' }
    },
    'two-step': {
      '10k': { price: 85, name: 'Two-Step Challenge $10,000' },
      '25k': { price: 159, name: 'Two-Step Challenge $25,000' },
      '50k': { price: 319, name: 'Two-Step Challenge $50,000' },
      '100k': { price: 579, name: 'Two-Step Challenge $100,000' }
    }
  }

  const addonPrices: Record<string, { name: string; price: number }> = {
    'ea-support': { name: 'Expert Advisor Support', price: 25 },
    'weekend-hold': { name: 'Weekend Holding', price: 15 },
    'reset-option': { name: 'One-Time Reset', price: 35 }
  }

  // Calculate order items
  const getOrderItems = (): OrderItem[] => {
    const items: OrderItem[] = []
    
    // Main challenge
    const challengeProduct = productConfig[challengeType]?.[challengeAmount]
    if (challengeProduct) {
      items.push({
        id: 'challenge',
        name: challengeProduct.name,
        price: challengeProduct.price
      })
    }
    
    // Add-ons
    selectedAddons.forEach(addonId => {
      const addon = addonPrices[addonId]
      if (addon) {
        items.push({
          id: addonId,
          name: addon.name,
          price: addon.price
        })
      }
    })
    
    return items
  }

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

  // Handle coupon application
  const handleCouponApply = (coupon: string) => {
    if (!coupon) {
      setAppliedCoupon('')
      setDiscount(0)
      toast({
        title: "Coupon Removed",
        description: "Discount has been removed from your order."
      })
      return
    }

    // Mock coupon validation
    const validCoupons: Record<string, number> = {
      'SAVE10': 10,
      'SAVE20': 20,
      'WELCOME15': 15
    }

    if (validCoupons[coupon.toUpperCase()]) {
      setAppliedCoupon(coupon.toUpperCase())
      setDiscount(validCoupons[coupon.toUpperCase()])
      toast({
        title: "Coupon Applied!",
        description: `You saved ${validCoupons[coupon.toUpperCase()]}% on your order.`
      })
    } else {
      toast({
        title: "Invalid Coupon",
        description: "The coupon code you entered is not valid.",
        variant: "destructive"
      })
    }
  }

  // Check if form is valid
  const isFormValid = Boolean(formData.firstName && formData.lastName && formData.email && paymentMethod)

  // Handle checkout
  const handleCheckout = () => {
    if (!isFormValid) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Processing Payment...",
      description: "Please wait while we process your payment."
    })

    // Mock payment processing
    setTimeout(() => {
      toast({
        title: "Payment Successful!",
        description: "Your challenge account will be set up within 24 hours."
      })
    }, 2000)
  }

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
              discount={discount}
            />
            
            <PaymentMethods
              selectedMethod={paymentMethod}
              onMethodSelect={setPaymentMethod}
            />
            
            <OrderSummary
              items={getOrderItems()}
              discount={discount}
              onCheckout={handleCheckout}
              isFormValid={isFormValid}
            />
          </div>
        </div>
      </div>
    </div>
  )
}