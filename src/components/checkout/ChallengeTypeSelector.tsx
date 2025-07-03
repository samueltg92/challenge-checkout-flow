import { Button } from "@/components/ui/button"

interface ChallengeTypeSelectorProps {
  selectedType: string
  onTypeSelect: (type: string) => void
}

export default function ChallengeTypeSelector({ selectedType, onTypeSelect }: ChallengeTypeSelectorProps) {
  const challengeTypes = [
    { id: 'one-step', label: 'One-Step' },
    { id: 'two-step', label: 'Two-Step' }
  ]

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground">Challenge Type</h3>
      <div className="flex gap-3">
        {challengeTypes.map((type) => (
          <button
            key={type.id}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
              selectedType === type.id
                ? 'bg-selected-bg text-selected-text shadow-selected'
                : 'bg-unselected-bg text-unselected-text hover:bg-hover-bg border border-border'
            }`}
            onClick={() => onTypeSelect(type.id)}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>
  )
}