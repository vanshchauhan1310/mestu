"use client"

interface CalendarViewProps {
  cycles: any[]
  currentMonth: Date
  onMonthChange: (date: Date) => void
}

export default function CalendarView({ cycles, currentMonth, onMonthChange }: CalendarViewProps) {
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const isPeriodDay = (day: number) => {
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return cycles.some((cycle) => {
      const startDate = new Date(cycle.startDate)
      const endDate = cycle.endDate ? new Date(cycle.endDate) : new Date(startDate.getTime() + 5 * 24 * 60 * 60 * 1000)
      return checkDate >= startDate && checkDate <= endDate
    })
  }

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const days = []

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // Days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  return (
    <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">{monthName}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="px-3 py-2 border border-border rounded-lg hover:bg-muted transition-smooth"
          >
            ←
          </button>
          <button
            onClick={() => onMonthChange(new Date())}
            className="px-3 py-2 border border-border rounded-lg hover:bg-muted transition-smooth text-sm"
          >
            Today
          </button>
          <button
            onClick={() => onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="px-3 py-2 border border-border rounded-lg hover:bg-muted transition-smooth"
          >
            →
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-semibold text-sm text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => (
          <div
            key={index}
            className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-smooth ${
              day === null
                ? "bg-transparent"
                : isPeriodDay(day)
                  ? "bg-accent-red text-white"
                  : "bg-muted text-foreground hover:bg-border"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-accent-red rounded"></div>
          <span className="text-muted-foreground">Period Days</span>
        </div>
      </div>
    </div>
  )
}
