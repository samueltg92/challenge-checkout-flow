import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

interface PersonalInfoFormProps {
  formData: {
    firstName: string
    lastName: string
    email: string
    phone: string
    country: string
  }
  onFormChange: (field: string, value: string) => void
}

export default function PersonalInfoForm({ formData, onFormChange }: PersonalInfoFormProps) {
  return (
    <Card className="p-6 bg-card border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">Personal Information</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-foreground">First Name</Label>
            <Input
              id="firstName"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={(e) => onFormChange('firstName', e.target.value)}
              className="bg-background border-border focus:border-accent"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-foreground">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={(e) => onFormChange('lastName', e.target.value)}
              className="bg-background border-border focus:border-accent"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={(e) => onFormChange('email', e.target.value)}
            className="bg-background border-border focus:border-accent"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={(e) => onFormChange('phone', e.target.value)}
            className="bg-background border-border focus:border-accent"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country" className="text-foreground">Country</Label>
          <Input
            id="country"
            placeholder="Enter your country"
            value={formData.country}
            onChange={(e) => onFormChange('country', e.target.value)}
            className="bg-background border-border focus:border-accent"
          />
        </div>
      </div>
    </Card>
  )
}