import { Checkbox } from "@/components/ui/checkbox"

interface Addon {
  id: string
  title: string
  description: string
  price: string
}

interface AddonsSelectorProps {
  selectedAddons: string[]
  onAddonToggle: (addonId: string) => void
}

export default function AddonsSelector({ selectedAddons, onAddonToggle }: AddonsSelectorProps) {
  const addons: Addon[] = [
    {
      id: 'ea-support',
      title: 'Expert Advisor Support',
      description: 'Use automated trading systems',
      price: '+$25.00'
    },
    {
      id: 'weekend-hold',
      title: 'Weekend Holding',
      description: 'Hold positions over weekends',
      price: '+$15.00'
    },
    {
      id: 'reset-option',
      title: 'One-Time Reset',
      description: 'Reset your challenge once',
      price: '+$35.00'
    }
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Add-ons Selection</h3>
      <div className="space-y-3">
        {addons.map((addon) => (
          <div
            key={addon.id}
            className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-accent/50 transition-all duration-300"
          >
            <Checkbox
              id={addon.id}
              checked={selectedAddons.includes(addon.id)}
              onCheckedChange={() => onAddonToggle(addon.id)}
              className="mt-1 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
            />
            <div className="flex-1">
              <label
                htmlFor={addon.id}
                className="text-sm font-medium text-foreground cursor-pointer"
              >
                {addon.title}
              </label>
              <p className="text-xs text-muted-foreground mt-1">{addon.description}</p>
            </div>
            <div className="text-sm font-semibold text-accent">
              {addon.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}