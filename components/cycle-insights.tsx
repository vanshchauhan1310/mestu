"use client"

interface CycleInsightsProps {
  cycles: any[]
}

export default function CycleInsights({ cycles }: CycleInsightsProps) {
  const calculateCycleStats = () => {
    if (cycles.length < 2) return null

    const cycleLengths = []
    for (let i = 1; i < cycles.length; i++) {
      const prevStart = new Date(cycles[i - 1].startDate)
      const currStart = new Date(cycles[i].startDate)
      const diff = Math.floor((currStart.getTime() - prevStart.getTime()) / (1000 * 60 * 60 * 24))
      cycleLengths.push(diff)
    }

    const avgCycleLength = Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
    const minCycleLength = Math.min(...cycleLengths)
    const maxCycleLength = Math.max(...cycleLengths)

    return { avgCycleLength, minCycleLength, maxCycleLength }
  }

  const getNextPeriodPrediction = () => {
    if (cycles.length === 0) return null

    const lastCycle = cycles[cycles.length - 1]
    const lastStart = new Date(lastCycle.startDate)
    const stats = calculateCycleStats()
    const avgLength = stats?.avgCycleLength || 28

    const nextPeriod = new Date(lastStart.getTime() + avgLength * 24 * 60 * 60 * 1000)
    const today = new Date()
    const daysUntil = Math.ceil((nextPeriod.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    return { nextPeriod, daysUntil }
  }

  const getCyclePhase = () => {
    if (cycles.length === 0) return null

    const lastCycle = cycles[cycles.length - 1]
    const lastStart = new Date(lastCycle.startDate)
    const today = new Date()
    const daysSinceStart = Math.floor((today.getTime() - lastStart.getTime()) / (1000 * 60 * 60 * 24))

    if (daysSinceStart < 0) return null

    // Simplified cycle phases (28-day cycle)
    if (daysSinceStart <= 5) return { phase: "Menstruation", emoji: "🔴", color: "bg-accent-red" }
    if (daysSinceStart <= 13) return { phase: "Follicular", emoji: "🟡", color: "bg-yellow-500" }
    if (daysSinceStart <= 15) return { phase: "Ovulation", emoji: "🟠", color: "bg-orange-500" }
    return { phase: "Luteal", emoji: "🟣", color: "bg-accent-purple" }
  }

  const stats = calculateCycleStats()
  const prediction = getNextPeriodPrediction()
  const phase = getCyclePhase()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Current Phase */}
      {phase && (
        <div className={`${phase.color} text-white rounded-lg p-6 shadow-sm`}>
          <div className="text-4xl mb-2">{phase.emoji}</div>
          <h3 className="font-semibold mb-1">Current Phase</h3>
          <p className="text-sm opacity-90">{phase.phase}</p>
        </div>
      )}

      {/* Next Period */}
      {prediction && (
        <div className="bg-primary/10 border-2 border-primary rounded-lg p-6">
          <div className="text-4xl mb-2">📅</div>
          <h3 className="font-semibold text-foreground mb-1">Next Period</h3>
          <p className="text-sm text-muted-foreground">
            {prediction.nextPeriod.toLocaleDateString()} ({prediction.daysUntil} days away)
          </p>
        </div>
      )}

      {/* Cycle Statistics */}
      {stats && (
        <div className="bg-primary-light/10 border-2 border-primary-light rounded-lg p-6">
          <div className="text-4xl mb-2">📊</div>
          <h3 className="font-semibold text-foreground mb-3">Cycle Statistics</h3>
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              Average: <span className="font-semibold text-foreground">{stats.avgCycleLength} days</span>
            </p>
            <p className="text-muted-foreground">
              Range:{" "}
              <span className="font-semibold text-foreground">
                {stats.minCycleLength}-{stats.maxCycleLength} days
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Total Cycles Tracked */}
      <div className="bg-accent-warm/10 border-2 border-accent-warm rounded-lg p-6">
        <div className="text-4xl mb-2">✓</div>
        <h3 className="font-semibold text-foreground mb-1">Cycles Tracked</h3>
        <p className="text-sm text-muted-foreground">{cycles.length} cycles logged</p>
      </div>
    </div>
  )
}
