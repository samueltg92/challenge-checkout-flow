import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface PaymentMethod {
  id: string
  name: string
  description: string
  icon: string
  woocommerceId?: string // WooCommerce payment method ID
}

interface PaymentMethodsProps {
  selectedMethod: string
  onMethodSelect: (method: string) => void
  availableMethods?: PaymentMethod[] // Allow custom payment methods from WooCommerce
}

export default function PaymentMethods({ selectedMethod, onMethodSelect, availableMethods }: PaymentMethodsProps) {
  // Default payment methods - can be overridden by WooCommerce available methods
  const defaultPaymentMethods: PaymentMethod[] = [
    {
      id: 'bacs',
      name: 'Bank Transfer',
      description: 'Direct bank transfer',
      icon: '🏦',
      woocommerceId: 'bacs'
    },
    {
      id: 'stripe',
      name: 'Credit Card',
      description: 'Visa, Mastercard, American Express',
      icon: '💳',
      woocommerceId: 'stripe'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay with your PayPal account',
      icon: '🅿️',
      woocommerceId: 'paypal'
    },
    {
      id: 'razorpay',
      name: 'Razorpay',
      description: 'Credit/Debit Cards, UPI, Wallets',
      icon: '💰',
      woocommerceId: 'razorpay'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive',
      icon: '💵',
      woocommerceId: 'cod'
    }
  ]

  // Use provided methods or fall back to defaults
  const paymentMethods = availableMethods || defaultPaymentMethods

  return (
    <Card className="p-6 bg-card border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">Payment Method</h3>
      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <Button
            key={method.id}
            variant={selectedMethod === method.id ? "payment-selected" : "payment"}
            onClick={() => onMethodSelect(method.id)}
            className="h-auto p-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{method.icon}</span>
              <div className="text-left">
                <div className="font-semibold text-foreground">{method.name}</div>
                <div className="text-sm text-muted-foreground">{method.description}</div>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  )
}