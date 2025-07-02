import { Card } from "@/components/ui/card"
import { Check, X } from "lucide-react"

interface ChallengeConditionsProps {
  challengeType: string
  challengeAmount: string
}

export default function ChallengeConditions({ challengeType, challengeAmount }: ChallengeConditionsProps) {
  const getConditions = () => {
    const baseConditions = {
      'one-step': {
        '10k': {
          accountSize: '$10,000',
          profitTarget: '$800 (8%)',
          maxDrawdown: '$1,000 (10%)',
          dailyDrawdown: '$500 (5%)',
          tradingPeriod: 'Unlimited',
          minTradingDays: '5 days'
        },
        '25k': {
          accountSize: '$25,000',
          profitTarget: '$2,000 (8%)',
          maxDrawdown: '$2,500 (10%)',
          dailyDrawdown: '$1,250 (5%)',
          tradingPeriod: 'Unlimited',
          minTradingDays: '5 days'
        }
      },
      'two-step': {
        '10k': {
          accountSize: '$10,000',
          profitTarget: '$800 (8%) → $500 (5%)',
          maxDrawdown: '$1,000 (10%)',
          dailyDrawdown: '$500 (5%)',
          tradingPeriod: '30 days → Unlimited',
          minTradingDays: '5 days → 5 days'
        }
      }
    }

    return baseConditions[challengeType as keyof typeof baseConditions]?.[challengeAmount as keyof typeof baseConditions['one-step']] ||
           baseConditions['one-step']['10k']
  }

  const conditions = getConditions()

  const tradingRules = [
    { rule: 'Expert Advisors Allowed', allowed: true },
    { rule: 'News Trading Allowed', allowed: true },
    { rule: 'Weekend Gap Trading', allowed: false },
    { rule: 'Hedging Allowed', allowed: true },
    { rule: 'Martingale Strategy', allowed: false },
    { rule: 'Copy Trading', allowed: false }
  ]

  return (
    <Card className="p-6 bg-gradient-card border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Check className="w-5 h-5 text-success" />
        <h3 className="text-lg font-semibold text-foreground">Challenge Conditions</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-3">
          <div>
            <span className="text-sm text-muted-foreground">Account Size</span>
            <p className="font-semibold text-foreground">{conditions.accountSize}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Profit Target</span>
            <p className="font-semibold text-foreground">{conditions.profitTarget}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Max Drawdown</span>
            <p className="font-semibold text-foreground">{conditions.maxDrawdown}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <span className="text-sm text-muted-foreground">Daily Drawdown</span>
            <p className="font-semibold text-foreground">{conditions.dailyDrawdown}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Trading Period</span>
            <p className="font-semibold text-foreground">{conditions.tradingPeriod}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Min Trading Days</span>
            <p className="font-semibold text-foreground">{conditions.minTradingDays}</p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-foreground mb-3">Trading Rules</h4>
        <div className="grid grid-cols-2 gap-2">
          {tradingRules.map((rule, index) => (
            <div key={index} className="flex items-center gap-2">
              {rule.allowed ? (
                <Check className="w-4 h-4 text-success" />
              ) : (
                <X className="w-4 h-4 text-destructive" />
              )}
              <span className={`text-sm ${rule.allowed ? 'text-foreground' : 'text-muted-foreground'}`}>
                {rule.rule}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}