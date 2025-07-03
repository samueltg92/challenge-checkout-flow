import { Card } from "@/components/ui/card"

interface ChallengeAmount {
  id: string
  amount: string
  price: string
  originalPrice?: string
}

interface ChallengeAmountSelectorProps {
  selectedAmount: string
  onAmountSelect: (amount: string) => void
  challengeType: string
}

export default function ChallengeAmountSelector({ selectedAmount, onAmountSelect, challengeType }: ChallengeAmountSelectorProps) {
  const amounts: Record<string, ChallengeAmount[]> = {
    'one-step': [
      { id: '10k', amount: '$10,000', price: '$82.00' },
      { id: '25k', amount: '$25,000', price: '$149.00' },
      { id: '50k', amount: '$50,000', price: '$299.00' },
      { id: '100k', amount: '$100,000', price: '$549.00' }
    ],
    'two-step': [
      { id: '10k', amount: '$10,000', price: '$85.00' },
      { id: '25k', amount: '$25,000', price: '$159.00' },
      { id: '50k', amount: '$50,000', price: '$319.00' },
      { id: '100k', amount: '$100,000', price: '$579.00' }
    ]
  }

  const currentAmounts = amounts[challengeType] || amounts['one-step']

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Challenge Amount</h3>
      <div className="grid grid-cols-2 gap-3">
        {currentAmounts.map((amount) => (
          <div
            key={amount.id}
            className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 rounded-lg border ${
              selectedAmount === amount.id
                ? 'bg-selected-bg text-selected-text shadow-selected border-selected-bg'
                : 'bg-unselected-bg text-unselected-text hover:bg-hover-bg border-border'
            }`}
            onClick={() => onAmountSelect(amount.id)}
          >
            <div className="text-center space-y-1">
              <div className="text-xl font-bold">{amount.amount}</div>
              <div className={`text-sm font-medium ${
                selectedAmount === amount.id ? 'text-selected-text/80' : 'text-unselected-text/70'
              }`}>
                {amount.price}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}