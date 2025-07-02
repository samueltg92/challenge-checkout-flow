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
          <Button
            key={type.id}
            variant={selectedType === type.id ? "pill-selected" : "pill"}
            onClick={() => onTypeSelect(type.id)}
            className="animate-fade-in"
          >
            {type.label}
          </Button>
        ))}
      </div>
    </div>
  )
}