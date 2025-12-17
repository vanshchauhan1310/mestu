"use client"

import { useState, useEffect } from "react"

interface WellnessTrackerProps {
  date: string
}

export default function WellnessTracker({ date }: WellnessTrackerProps) {
  const [wellnessData, setWellnessData] = useState<any>(null)
  const [hydration, setHydration] = useState(0)
  const [sleep, setSleep] = useState("")
  const [exercise, setExercise] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem(`saukhya_wellness_${date}`)
    if (saved) {
      const data = JSON.parse(saved)
      setWellnessData(data)
      setHydration(data.hydration || 0)
      setSleep(data.sleep || "")
      setExercise(data.exercise || "")
    }
  }, [date])

  const handleSave = () => {
    const data = { hydration, sleep, exercise, date }
    localStorage.setItem(`saukhya_wellness_${date}`, JSON.stringify(data))
    setWellnessData(data)
    alert("Wellness data saved!")
  }

  const addWater = () => {
    setHydration(hydration + 1)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Hydration */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4">Hydration</h3>
        <div className="text-4xl font-bold text-blue-600 mb-4">{hydration}</div>
        <p className="text-sm text-muted-foreground mb-4">glasses of water</p>
        <button
          onClick={addWater}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-smooth"
        >
          + Add Water
        </button>
      </div>

      {/* Sleep */}
      <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4">Sleep</h3>
        <input
          type="number"
          min="0"
          max="24"
          step="0.5"
          value={sleep}
          onChange={(e) => setSleep(e.target.value)}
          placeholder="Hours"
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
        />
        <p className="text-sm text-muted-foreground">hours last night</p>
      </div>

      {/* Exercise */}
      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4">Exercise</h3>
        <input
          type="number"
          min="0"
          max="180"
          step="5"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          placeholder="Minutes"
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-2"
        />
        <p className="text-sm text-muted-foreground">minutes today</p>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="md:col-span-3 bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-smooth"
      >
        Save Wellness Data
      </button>
    </div>
  )
}
