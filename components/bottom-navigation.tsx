"use client"

interface BottomNavigationProps {
  currentPage: string
  setCurrentPage: (page: string) => void
}

export default function BottomNavigation({ currentPage, setCurrentPage }: BottomNavigationProps) {
  const navItems = [
    { id: "dashboard", label: "Home", icon: "🏠" },
    { id: "health-tools", label: "Health", icon: "💚" },
    { id: "consultation", label: "Consult", icon: "👨‍⚕️" },
    { id: "community", label: "Community", icon: "👥" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-primary/20 shadow-2xl z-50 safe-area-inset-bottom">
      <div className="flex justify-around items-center h-20 max-w-7xl mx-auto w-full">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors active:scale-95 ${
              currentPage === item.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-xs font-semibold">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
