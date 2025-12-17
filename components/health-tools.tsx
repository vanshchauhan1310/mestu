"use client"

import { useState, useEffect } from "react"
import WellnessTracker from "./wellness-tracker"
import CycleRecommendations from "./cycle-recommendations"

interface HealthToolsProps {
  user: any
}

export default function HealthTools({ user }: HealthToolsProps) {
  const [activeTab, setActiveTab] = useState("wellness")
  const [cycles, setCycles] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  useEffect(() => {
    const savedCycles = localStorage.getItem("saukhya_cycles")
    if (savedCycles) {
      setCycles(JSON.parse(savedCycles))
    }
  }, [])

  const exercises = [
    {
      id: 1,
      name: "Gentle Yoga for Menstrual Phase",
      phase: "menstrual",
      duration: "15 min",
      difficulty: "Easy",
      description: "Restorative poses to ease cramps and promote relaxation",
    },
    {
      id: 2,
      name: "Follicular Phase Strength Training",
      phase: "follicular",
      duration: "30 min",
      difficulty: "Moderate",
      description: "Build strength during your high-energy phase",
    },
    {
      id: 3,
      name: "Pelvic Floor Exercises",
      phase: "all",
      duration: "10 min",
      difficulty: "Easy",
      description: "Strengthen pelvic floor muscles for better health",
    },
    {
      id: 4,
      name: "HIIT Workout",
      phase: "ovulation",
      duration: "20 min",
      difficulty: "Hard",
      description: "High-intensity interval training during peak energy",
    },
  ]

  const meals = [
    {
      id: 1,
      name: "Iron-Rich Buddha Bowl",
      phase: "menstrual",
      prep: "15 min",
      description: "Spinach, quinoa, chickpeas, and tahini dressing",
    },
    {
      id: 2,
      name: "Anti-Inflammatory Smoothie",
      phase: "all",
      prep: "5 min",
      description: "Berries, turmeric, ginger, and almond milk",
    },
    {
      id: 3,
      name: "Hormone-Balancing Salad",
      phase: "luteal",
      prep: "10 min",
      description: "Leafy greens, seeds, and omega-3 rich dressing",
    },
    {
      id: 4,
      name: "Energy Protein Bowl",
      phase: "follicular",
      prep: "12 min",
      description: "Grilled chicken, sweet potato, and broccoli",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Health Management Tools</h2>
        <p className="text-muted-foreground">Exercise, nutrition, wellness, and cycle-based recommendations</p>
      </div>

      {/* Cycle Recommendations */}
      {cycles.length > 0 && (
        <div className="mb-8">
          <CycleRecommendations cycles={cycles} />
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8 border-b border-border overflow-x-auto">
        <button
          onClick={() => setActiveTab("wellness")}
          className={`px-4 py-3 font-semibold transition-smooth border-b-2 whitespace-nowrap ${activeTab === "wellness"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
        >
          💪 Wellness
        </button>
        <button
          onClick={() => setActiveTab("exercise")}
          className={`px-4 py-3 font-semibold transition-smooth border-b-2 whitespace-nowrap ${activeTab === "exercise"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
        >
          🏃 Exercise
        </button>
        <button
          onClick={() => setActiveTab("nutrition")}
          className={`px-4 py-3 font-semibold transition-smooth border-b-2 whitespace-nowrap ${activeTab === "nutrition"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
        >
          🥗 Nutrition
        </button>
        <button
          onClick={() => setActiveTab("stress")}
          className={`px-4 py-3 font-semibold transition-smooth border-b-2 whitespace-nowrap ${activeTab === "stress"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
        >
          🧘 Stress Relief
        </button>
      </div>

      {/* Wellness Tab */}
      {activeTab === "wellness" && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-4">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-6"
            />
          </div>
          <WellnessTracker date={selectedDate} />
        </div>
      )}

      {/* Exercise Tab */}
      {activeTab === "exercise" && (
        <div className="space-y-4">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-white border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-smooth"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-foreground">{exercise.name}</h3>
                <span className="text-2xl">🏃</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{exercise.description}</p>
              <div className="flex gap-4 text-sm flex-wrap">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">{exercise.duration}</span>
                <span className="bg-accent-warm/10 text-accent-warm px-3 py-1 rounded-full">{exercise.difficulty}</span>
                <span className="bg-primary-light/10 text-primary-light px-3 py-1 rounded-full capitalize">
                  {exercise.phase === "all" ? "All Phases" : exercise.phase}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Nutrition Tab */}
      {activeTab === "nutrition" && (
        <div className="space-y-4">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="bg-white border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-smooth"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-foreground">{meal.name}</h3>
                <span className="text-2xl">🥗</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{meal.description}</p>
              <div className="flex gap-4 text-sm flex-wrap">
                <span className="bg-primary-light/10 text-primary-light px-3 py-1 rounded-full">{meal.prep}</span>
                <span className="bg-accent-warm/10 text-accent-warm px-3 py-1 rounded-full capitalize">
                  {meal.phase === "all" ? "All Phases" : meal.phase}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stress Relief Tab */}
      {activeTab === "stress" && (
        <div className="space-y-4">
          <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">Breathing Exercises</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-4 bg-accent-purple/10 hover:bg-accent-purple/20 rounded-lg transition-smooth">
                <p className="font-semibold text-foreground">Box Breathing (4-4-4-4)</p>
                <p className="text-sm text-muted-foreground">
                  Inhale for 4, hold for 4, exhale for 4, hold for 4. Repeat 5 times.
                </p>
              </button>
              <button className="w-full text-left p-4 bg-accent-purple/10 hover:bg-accent-purple/20 rounded-lg transition-smooth">
                <p className="font-semibold text-foreground">4-7-8 Breathing</p>
                <p className="text-sm text-muted-foreground">Inhale for 4, hold for 7, exhale for 8. Repeat 4 times.</p>
              </button>
              <button className="w-full text-left p-4 bg-accent-purple/10 hover:bg-accent-purple/20 rounded-lg transition-smooth">
                <p className="font-semibold text-foreground">Diaphragmatic Breathing</p>
                <p className="text-sm text-muted-foreground">
                  Deep belly breathing to activate the parasympathetic nervous system.
                </p>
              </button>
            </div>
          </div>

          <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">Guided Meditations</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-4 bg-accent-purple/10 hover:bg-accent-purple/20 rounded-lg transition-smooth">
                <p className="font-semibold text-foreground">Pain Management Meditation</p>
                <p className="text-sm text-muted-foreground">
                  10 minutes - Reduce period pain through guided visualization
                </p>
              </button>
              <button className="w-full text-left p-4 bg-accent-purple/10 hover:bg-accent-purple/20 rounded-lg transition-smooth">
                <p className="font-semibold text-foreground">Sleep Meditation</p>
                <p className="text-sm text-muted-foreground">15 minutes - Relax and prepare for restful sleep</p>
              </button>
              <button className="w-full text-left p-4 bg-accent-purple/10 hover:bg-accent-purple/20 rounded-lg transition-smooth">
                <p className="font-semibold text-foreground">Stress Relief Meditation</p>
                <p className="text-sm text-muted-foreground">8 minutes - Calm your mind and reduce anxiety</p>
              </button>
              <button className="w-full text-left p-4 bg-accent-purple/10 hover:bg-accent-purple/20 rounded-lg transition-smooth">
                <p className="font-semibold text-foreground">Body Scan Meditation</p>
                <p className="text-sm text-muted-foreground">12 minutes - Release tension from your body</p>
              </button>
            </div>
          </div>

          <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Wellness Tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Take short breaks every hour to stretch and breathe</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Practice progressive muscle relaxation before bed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Limit caffeine intake, especially during luteal phase</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Spend time in nature for stress relief</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Practice journaling to process emotions</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
