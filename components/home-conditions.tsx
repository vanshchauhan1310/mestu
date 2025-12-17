"use client"

interface HomeConditionsProps {
  user: any
}

export default function HomeConditions({ user }: HomeConditionsProps) {
  if (!user?.conditions || user.conditions.length === 0) {
    return null
  }

  const conditionEmojis: Record<string, string> = {
    PCOS: "🔄",
    Endometriosis: "⚡",
    PMDD: "😔",
    "Heavy Bleeding": "🩸",
    Fibroids: "🎯",
    Adenomyosis: "💔",
    "Irregular Cycles": "❓",
  }

  return (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-foreground mb-3">Your Conditions</h3>
      <div className="flex flex-wrap gap-2">
        {user.conditions.map((condition: string) => (
          <div
            key={condition}
            className="bg-primary/10 border-2 border-primary/30 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-sm"
          >
            <span className="text-lg">{conditionEmojis[condition] || "🏥"}</span>
            <span className="text-xs font-medium text-foreground">{condition}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
