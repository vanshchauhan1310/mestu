"use client"

interface HomeInsightsProps {
  user: any
}

export default function HomeInsights({ user }: HomeInsightsProps) {
  const getTip = () => {
    if (user?.painLevel > 7) {
      return "High pain days are common with your condition. Try gentle movement and heat therapy."
    }
    if (user?.conditions?.includes("PCOS")) {
      return "PCOS management: Regular exercise and balanced nutrition help regulate hormones."
    }
    if (user?.conditions?.includes("Endometriosis")) {
      return "Endometriosis tip: Track your pain patterns to identify effective management strategies."
    }
    return "Tracking your symptoms helps identify patterns specific to your condition."
  }

  return (
    <div className="bg-gradient-to-r from-primary/10 to-accent-warm/10 border-2 border-primary/20 rounded-xl p-4 mb-6">
      <div className="flex gap-3">
        <span className="text-2xl flex-shrink-0">💡</span>
        <div>
          <p className="text-xs font-semibold text-primary mb-1">Tip for Today</p>
          <p className="text-sm text-foreground leading-relaxed">{getTip()}</p>
        </div>
      </div>
    </div>
  )
}
