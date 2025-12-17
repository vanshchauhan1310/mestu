"use client"

interface ProfileStatsProps {
  cycles: any[]
  symptoms: any[]
  wellness: any[]
}

export default function ProfileStats({ cycles, symptoms, wellness }: ProfileStatsProps) {
  const totalCyclesTracked = cycles.length
  const totalSymptomEntries = symptoms.length
  const totalWellnessEntries = wellness.length

  const getStreak = () => {
    if (symptoms.length === 0) return 0
    const today = new Date()
    let streak = 0
    const currentDate = new Date(today)

    for (let i = 0; i < 365; i++) {
      const dateStr = currentDate.toISOString().split("T")[0]
      const hasEntry = symptoms.some((s) => s.date === dateStr)
      if (hasEntry) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }
    return streak
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-primary/10 border-2 border-primary rounded-lg p-4">
        <p className="text-sm text-muted-foreground mb-1">Cycles Tracked</p>
        <p className="text-3xl font-bold text-primary">{totalCyclesTracked}</p>
      </div>
      <div className="bg-accent-warm/10 border-2 border-accent-warm rounded-lg p-4">
        <p className="text-sm text-muted-foreground mb-1">Symptom Entries</p>
        <p className="text-3xl font-bold text-accent-warm">{totalSymptomEntries}</p>
      </div>
      <div className="bg-primary-light/10 border-2 border-primary-light rounded-lg p-4">
        <p className="text-sm text-muted-foreground mb-1">Wellness Logs</p>
        <p className="text-3xl font-bold text-primary-light">{totalWellnessEntries}</p>
      </div>
      <div className="bg-accent-purple/10 border-2 border-accent-purple rounded-lg p-4">
        <p className="text-sm text-muted-foreground mb-1">Tracking Streak</p>
        <p className="text-3xl font-bold text-accent-purple">{getStreak()} days</p>
      </div>
    </div>
  )
}
