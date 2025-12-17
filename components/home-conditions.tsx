import { AlertCircle, Zap, Frown, Droplets, Target, Hash, HelpCircle } from "lucide-react"

interface HomeConditionsProps {
  user: any
}

export default function HomeConditions({ user }: HomeConditionsProps) {
  if (!user?.conditions || user.conditions.length === 0) {
    return null
  }

  const conditionIcons: Record<string, any> = {
    PCOS: AlertCircle,
    Endometriosis: Zap,
    PMDD: Frown,
    "Heavy Bleeding": Droplets,
    Fibroids: Target,
    Adenomyosis: Hash,
    "Irregular Cycles": HelpCircle,
  }

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-foreground mb-4">Your Conditions</h3>
      <div className="flex flex-wrap gap-2">
        {user.conditions.map((condition: string) => {
          const Icon = conditionIcons[condition] || AlertCircle
          return (
            <div
              key={condition}
              className="bg-primary/5 text-primary border border-primary/20 rounded-full pl-3 pr-4 py-2 flex items-center gap-2 transition-transform hover:-translate-y-0.5"
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs font-semibold">{condition}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
