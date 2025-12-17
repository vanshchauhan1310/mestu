"use client"

interface CycleRecommendationsProps {
  cycles: any[]
}

const PHASE_RECOMMENDATIONS = {
  menstrual: {
    phase: "Menstruation",
    emoji: "🔴",
    color: "bg-red-50 border-red-200",
    exercises: [
      "Gentle yoga and stretching",
      "Walking or light cardio",
      "Pelvic floor exercises",
      "Restorative pilates",
    ],
    nutrition: [
      "Iron-rich foods (spinach, lentils)",
      "Vitamin C for iron absorption",
      "Magnesium-rich foods (dark chocolate, nuts)",
      "Hydrating foods (watermelon, cucumber)",
    ],
    tips: ["Rest and prioritize sleep", "Stay hydrated", "Manage pain with heat therapy", "Listen to your body"],
  },
  follicular: {
    phase: "Follicular",
    emoji: "🟡",
    color: "bg-yellow-50 border-yellow-200",
    exercises: ["High-intensity interval training", "Strength training", "Running or cycling", "Group fitness classes"],
    nutrition: ["Lean proteins", "Complex carbohydrates", "Fresh vegetables", "Whole grains"],
    tips: ["Take advantage of high energy", "Start new projects", "Push your fitness limits", "Social activities"],
  },
  ovulation: {
    phase: "Ovulation",
    emoji: "🟠",
    color: "bg-orange-50 border-orange-200",
    exercises: ["Peak performance workouts", "Competitive sports", "High-intensity training", "Challenging yoga"],
    nutrition: ["Antioxidant-rich foods", "Berries and leafy greens", "Lean proteins", "Healthy fats"],
    tips: [
      "Peak confidence and energy",
      "Great time for important meetings",
      "Maximum strength and endurance",
      "Social engagement",
    ],
  },
  luteal: {
    phase: "Luteal",
    emoji: "🟣",
    color: "bg-purple-50 border-purple-200",
    exercises: ["Moderate-intensity workouts", "Yoga and pilates", "Swimming", "Walking"],
    nutrition: ["Complex carbohydrates", "Calcium-rich foods", "Magnesium supplements", "Omega-3 fatty acids"],
    tips: ["Prioritize self-care", "Plan and organize", "Reduce stress", "Get extra sleep"],
  },
}

export default function CycleRecommendations({ cycles }: CycleRecommendationsProps) {
  const getCurrentPhase = () => {
    if (cycles.length === 0) return null

    const lastCycle = cycles[cycles.length - 1]
    const lastStart = new Date(lastCycle.startDate)
    const today = new Date()
    const daysSinceStart = Math.floor((today.getTime() - lastStart.getTime()) / (1000 * 60 * 60 * 24))

    if (daysSinceStart < 0) return null

    if (daysSinceStart <= 5) return "menstrual"
    if (daysSinceStart <= 13) return "follicular"
    if (daysSinceStart <= 15) return "ovulation"
    return "luteal"
  }

  const phase = getCurrentPhase()
  if (!phase) return null

  const recommendations = PHASE_RECOMMENDATIONS[phase as keyof typeof PHASE_RECOMMENDATIONS]

  return (
    <div className={`${recommendations.color} border-2 rounded-lg p-6`}>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">{recommendations.emoji}</span>
        <h3 className="text-2xl font-bold text-foreground">{recommendations.phase} Phase</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Exercises */}
        <div>
          <h4 className="font-semibold text-foreground mb-3">Recommended Exercises</h4>
          <ul className="space-y-2">
            {recommendations.exercises.map((exercise, idx) => (
              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{exercise}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Nutrition */}
        <div>
          <h4 className="font-semibold text-foreground mb-3">Nutrition Focus</h4>
          <ul className="space-y-2">
            {recommendations.nutrition.map((food, idx) => (
              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{food}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tips */}
        <div>
          <h4 className="font-semibold text-foreground mb-3">Wellness Tips</h4>
          <ul className="space-y-2">
            {recommendations.tips.map((tip, idx) => (
              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
