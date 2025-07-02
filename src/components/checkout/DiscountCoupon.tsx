import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface DiscountCouponProps {
  onCouponApply: (coupon: string) => void
  appliedCoupon?: string
  discount?: number
}

export default function DiscountCoupon({ onCouponApply, appliedCoupon, discount }: DiscountCouponProps) {
  const [couponCode, setCouponCode] = useState('')

  const handleApply = () => {
    if (couponCode.trim()) {
      onCouponApply(couponCode.trim())
      setCouponCode('')
    }
  }

  return (
    <Card className="p-6 bg-card border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">Discount Coupon</h3>
      
      {appliedCoupon ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg">
            <span className="text-foreground font-medium">Coupon Applied: {appliedCoupon}</span>
            <span className="text-success font-semibold">{discount}% OFF</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCouponApply('')}
            className="w-full"
          >
            Remove Coupon
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="bg-background border-border focus:border-accent"
            onKeyPress={(e) => e.key === 'Enter' && handleApply()}
          />
          <Button
            onClick={handleApply}
            variant="pill"
            disabled={!couponCode.trim()}
            className="px-6"
          >
            Apply
          </Button>
        </div>
      )}
    </Card>
  )
}