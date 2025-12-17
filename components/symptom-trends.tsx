"use client"

interface SymptomTrendsProps {
  symptoms: any[]
}

export default function SymptomTrends({ symptoms }: SymptomTrendsProps) {
  const getSymptomFrequency = () => {
    const frequency: { [key: string]: number } = {}
    symptoms.forEach((entry) => {
      entry.symptoms.forEach((symptom: string) => {
        frequency[symptom] = (frequency[symptom] || 0) + 1
      })
    })
    return Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
  }

  const getAveragePainLevel = () => {
    if (symptoms.length === 0) return 0
    const total = symptoms.reduce((sum, entry) => sum + (entry.painLevel || 0), 0)
    return Math.round(total / symptoms.length)
  }

  const getRecentTrend = () => {
    if (symptoms.length < 2) return null
    const recent = symptoms.slice(-7)
    const avgRecent = Math.round(recent.reduce((sum, entry) => sum + (entry.painLevel || 0), 0) / recent.length)
    const older = symptoms.slice(-14, -7)
    const avgOlder =
      older.length > 0
        ? Math.round(older.reduce((sum, entry) => sum + (entry.painLevel || 0), 0) / older.length)
        : avgRecent

    const trend = avgRecent > avgOlder ? "increasing" : avgRecent < avgOlder ? "decreasing" : "stable"
    return { trend, avgRecent, avgOlder }
  }

  const frequentSymptoms = getSymptomFrequency()
  const avgPain = getAveragePainLevel()
  const recentTrend = getRecentTrend()

  const SYMPTOM_LABELS: { [key: string]: string } = {
    cramps: "Cramps",
    bloating: "Bloating",
    fatigue: "Fatigue",
    headache: "Headache",
    mood: "Mood Changes",
    acne: "Acne",
    nausea: "Nausea",
    anxiety: "Anxiety",
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Average Pain Level */}
      <div className="bg-accent-red/10 border-2 border-accent-red rounded-lg p-6">
        <div className="text-4xl mb-2">📊</div>
        <h3 className="font-semibold text-foreground mb-1">Average Pain Level</h3>
        <p className="text-3xl font-bold text-accent-red">{avgPain}/10</p>
        <p className="text-sm text-muted-foreground mt-2">Based on {symptoms.length} entries</p>
      </div>

      {/* Trend */}
      {recentTrend && (
        <div
          className={`${recentTrend.trend === "increasing" ? "bg-accent-warm/10 border-accent-warm" : recentTrend.trend === "decreasing" ? "bg-primary/10 border-primary" : "bg-primary-light/10 border-primary-light"} border-2 rounded-lg p-6`}
        >
          <div className="text-4xl mb-2">
            {recentTrend.trend === "increasing" ? "📈" : recentTrend.trend === "decreasing" ? "📉" : "➡️"}
          </div>
          <h3 className="font-semibold text-foreground mb-1">Recent Trend</h3>
          <p className="text-sm text-muted-foreground">
            Last 7 days: <span className="font-semibold text-foreground">{recentTrend.avgRecent}/10</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Previous 7 days: <span className="font-semibold text-foreground">{recentTrend.avgOlder}/10</span>
          </p>
        </div>
      )}

      {/* Most Common Symptoms */}
      <div className="md:col-span-2 bg-white border border-border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4">Most Common Symptoms</h3>
        {frequentSymptoms.length === 0 ? (
          <p className="text-muted-foreground text-sm">No symptoms logged yet</p>
        ) : (
          <div className="space-y-3">
            {frequentSymptoms.map(([symptomId, count]) => (
              <div key={symptomId} className="flex items-center justify-between">
                <span className="text-foreground font-medium">{SYMPTOM_LABELS[symptomId] || symptomId}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${(count / Math.max(...frequentSymptoms.map(([, c]) => c))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground w-8 text-right">{count}x</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
