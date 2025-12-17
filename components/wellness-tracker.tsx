"use client"

import { useState, useEffect } from "react"
import { Droplets, Moon, Activity, Plus, Minus, Save, Flame, BedDouble } from "lucide-react"

interface WellnessTrackerProps {
  date: string
}

export default function WellnessTracker({ date }: WellnessTrackerProps) {
  const [hydration, setHydration] = useState(0)
  const [sleep, setSleep] = useState(7)
  const [exercise, setExercise] = useState(0)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(`saukhya_wellness_${date}`)
    if (saved) {
      const data = JSON.parse(saved)
      setHydration(data.hydration || 0)
      setSleep(data.sleep ? parseFloat(data.sleep) : 7)
      setExercise(data.exercise ? parseInt(data.exercise) : 0)
    } else {
      // Reset defaults for new date
      setHydration(0)
      setSleep(7)
      setExercise(0)
    }
    setIsSaved(false)
  }, [date])

  const handleSave = () => {
    const data = { hydration, sleep, exercise, date }
    localStorage.setItem(`saukhya_wellness_${date}`, JSON.stringify(data))
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Hydration Card - Visual Water Tracking */}
        <div className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-20"><Droplets className="w-24 h-24" /></div>

          <h3 className="font-bold text-lg mb-1 flex items-center gap-2 relative z-10"><Droplets className="w-5 h-5" /> Hydration</h3>
          <p className="text-blue-100 text-xs font-medium mb-6 relative z-10">Daily Goal: 8 Glasses</p>

          <div className="flex items-center justify-between relative z-10">
            <div className="text-5xl font-black">{hydration}</div>
            <div className="flex flex-col gap-2">
              <button onClick={() => setHydration(h => h + 1)} className="bg-white text-blue-500 p-3 rounded-xl hover:scale-105 transition-transform shadow-lg">
                <Plus className="w-6 h-6" />
              </button>
              <button onClick={() => setHydration(h => Math.max(0, h - 1))} className="bg-blue-600/50 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors">
                <Minus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Visual Drops */}
          <div className="mt-6 flex gap-1 flex-wrap relative z-10 h-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`h-8 flex-1 rounded-full transition-all duration-500 ${i < hydration ? "bg-white" : "bg-blue-900/20"}`}></div>
            ))}
          </div>
        </div>

        {/* Sleep Card - Slider Interactive */}
        <div className="bg-white border border-indigo-50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>

          <div className="relative z-10">
            <h3 className="font-bold text-gray-800 text-lg mb-1 flex items-center gap-2"><Moon className="w-5 h-5 text-indigo-500" /> Sleep</h3>
            <p className="text-gray-400 text-xs mb-6">Last Night's Rest</p>

            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-4xl font-black text-indigo-900">{sleep}</span>
              <span className="text-sm font-bold text-gray-400">hours</span>
            </div>

            <input
              type="range"
              min="4" max="12" step="0.5"
              value={sleep}
              onChange={(e) => setSleep(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
              <span>4h</span>
              <span>8h</span>
              <span>12h</span>
            </div>
          </div>
        </div>

        {/* Exercise Card - Activity Ring Style */}
        <div className="bg-white border border-emerald-50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-tl-full -mr-8 -mb-8 z-0"></div>

          <div className="relative z-10">
            <h3 className="font-bold text-gray-800 text-lg mb-1 flex items-center gap-2"><Flame className="w-5 h-5 text-emerald-500" /> Activity</h3>
            <p className="text-gray-400 text-xs mb-6">Movement Today</p>

            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 flex items-center justify-center">
                {/* Simple SVG Ring */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-emerald-50" />
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * Math.min(exercise, 60)) / 60} className="text-emerald-500 transition-all duration-1000 ease-out" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-bold text-emerald-900">{exercise}</span>
                  <span className="text-[10px] uppercase font-bold text-emerald-400">Min</span>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <button onClick={() => setExercise(e => e + 15)} className="w-full py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-100 transition-colors">+ 15 min</button>
                <button onClick={() => setExercise(e => Math.max(0, e - 15))} className="w-full py-2 border border-gray-100 text-gray-400 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors">- 15 min</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 ${isSaved
            ? "bg-green-500 text-white shadow-green-500/30 scale-[0.99]"
            : "bg-gray-900 text-white hover:bg-gray-800 shadow-gray-900/20 hover:-translate-y-0.5"
          }`}
      >
        {isSaved ? "Saved Successfully!" : "Save Wellness Data"}
      </button>
    </div>
  )
}
