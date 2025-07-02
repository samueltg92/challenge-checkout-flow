import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface PaymentMethod {
  id: string
  name: string
  description: string
  icon: string
}

interface PaymentMethodsProps {
  selectedMethod: string
  onMethodSelect: (method: string) => void
}

export default function PaymentMethods({ selectedMethod, onMethodSelect }: PaymentMethodsProps) {
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'credit-card',
      name: 'Credit Card',
      description: 'Visa, Mastercard, American Express',
      icon: '💳'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay with your PayPal account',
      icon: '🅿️'
    },
    {
      id: 'apple-pay',
      name: 'Apple Pay',
      description: 'Touch ID or Face ID',
      icon: '🍎'
    },
    {
      id: 'google-pay',
      name: 'Google Pay',
      description: 'Pay with Google',
      icon: '📱'
    }
  ]

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