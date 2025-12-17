"use client"

interface HomeQuickActionsProps {
  onNavigate: (page: string) => void
}

export default function HomeQuickActions({ onNavigate }: HomeQuickActionsProps) {
  const actions = [
    { id: "period-tracker", label: "Log Period", icon: "📅", color: "bg-primary hover:bg-primary/90" },
    { id: "symptoms", label: "Log Symptoms", icon: "💭", color: "bg-accent-warm hover:bg-accent-warm/90" },
    { id: "consultation", label: "Book Doctor", icon: "👨‍⚕️", color: "bg-accent-purple hover:bg-accent-purple/90" },
    { id: "content", label: "Learn More", icon: "📚", color: "bg-primary-light hover:bg-primary-light/90" },
  ]

  return (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-foreground mb-3">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onNavigate(action.id)}
            className={`${action.color} text-white rounded-xl p-4 transition-all active:scale-95 flex flex-col items-center gap-2 shadow-md`}
          >
            <span className="text-2xl">{action.icon}</span>
            <span className="text-xs font-semibold text-center leading-tight">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
