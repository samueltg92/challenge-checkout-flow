import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"

interface Platform {
  id: string
  name: string
  description: string
  logo?: string
}

interface PlatformSelectorProps {
  selectedPlatform: string
  onPlatformSelect: (platform: string) => void
}

export default function PlatformSelector({ selectedPlatform, onPlatformSelect }: PlatformSelectorProps) {
  const platforms: Platform[] = [
    {
      id: 'mt4',
      name: 'MetaTrader 4',
      description: 'Most popular trading platform'
    },
    {
      id: 'mt5',
      name: 'MetaTrader 5',
      description: 'Advanced trading features'
    },
    {
      id: 'ctrader',
      name: 'cTrader',
      description: 'Professional trading platform'
    }
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Platform Selection</h3>
      <div className="grid grid-cols-1 gap-3">
        {platforms.map((platform) => (
          <Card
            key={platform.id}
            className={`p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
              selectedPlatform === platform.id
                ? 'border-2 border-accent bg-card shadow-selected'
                : 'border border-border bg-card hover:border-accent/50'
            }`}
            onClick={() => onPlatformSelect(platform.id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-foreground">{platform.name}</h4>
                <p className="text-sm text-muted-foreground">{platform.description}</p>
              </div>
              {selectedPlatform === platform.id && (
                <div className="flex items-center gap-2 text-accent">
                  <Check className="w-5 h-5" />
                  <span className="font-medium text-sm">Selected</span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}