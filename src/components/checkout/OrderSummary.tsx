import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"

interface OrderItem {
  id: string
  name: string
  price: number
}

interface OrderSummaryProps {
  items: OrderItem[]
  discount?: number
  onCheckout: () => void
  isFormValid: boolean
}

export default function OrderSummary({ items, discount = 0, onCheckout, isFormValid }: OrderSummaryProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0)
  const discountAmount = (subtotal * discount) / 100
  const total = subtotal - discountAmount

  return (
    <Card className="p-6 bg-card border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">Order Summary</h3>
      
      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <span className="text-foreground">{item.name}</span>
            <span className="font-medium text-foreground">${item.price.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-4 space-y-2">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-success">
            <span>Discount ({discount}%)</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-lg font-bold text-foreground border-t border-border pt-2">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <Button
          variant="checkout"
          size="xl"
          onClick={onCheckout}
          disabled={!isFormValid}
          className="animate-scale-in"
        >
          <Lock className="w-5 h-5" />
          Complete Purchase
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          🔒 Secure Payment • SSL Encrypted
        </p>
      </div>
    </Card>
  )
}