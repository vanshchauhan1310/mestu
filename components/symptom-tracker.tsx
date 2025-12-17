"use client"

import { useState, useEffect } from "react"
import SymptomTrends from "./symptom-trends"

interface SymptomTrackerProps {
  user: any
}

const SYMPTOM_CATEGORIES = {
  physical: {
    label: "Physical Symptoms",
    symptoms: [
      { id: "cramps", label: "Cramps", icon: "😣" },
      { id: "bloating", label: "Bloating", icon: "🤰" },
      { id: "fatigue", label: "Fatigue", icon: "😴" },
      { id: "headache", label: "Headache", icon: "🤕" },
      { id: "nausea", label: "Nausea", icon: "🤢" },
      { id: "acne", label: "Acne", icon: "🔴" },
    ],
  },
  emotional: {
    label: "Emotional Symptoms",
    symptoms: [
      { id: "mood", label: "Mood Changes", icon: "😔" },
      { id: "anxiety", label: "Anxiety", icon: "😰" },
      { id: "irritability", label: "Irritability", icon: "😠" },
      { id: "depression", label: "Low Mood", icon: "😞" },
    ],
  },
  lifestyle: {
    label: "Lifestyle Impact",
    symptoms: [
      { id: "sleep", label: "Sleep Issues", icon: "🛌" },
      { id: "appetite", label: "Appetite Changes", icon: "🍽️" },
      { id: "energy", label: "Low Energy", icon: "⚡" },
      { id: "concentration", label: "Concentration Issues", icon: "🧠" },
    ],
  },
}

export default function SymptomTracker({ user }: SymptomTrackerProps) {
  const [symptoms, setSymptoms] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedSymptoms, setSelectedSymptoms] = useState<{ [key: string]: number }>({})
  const [painLevel, setPainLevel] = useState(5)
  const [notes, setNotes] = useState("")

  useEffect(() => {
    try {
      const savedSymptoms = localStorage.getItem("saukhya_symptoms")
      if (savedSymptoms) {
        const parsed = JSON.parse(savedSymptoms)
        setSymptoms(parsed)
        const dateSymptoms = parsed.find((s: any) => s.date === selectedDate)
        if (dateSymptoms) {
          setSelectedSymptoms(dateSymptoms.symptoms || {})
          setPainLevel(dateSymptoms.painLevel || 5)
          setNotes(dateSymptoms.notes || "")
        } else {
          setSelectedSymptoms({})
          setPainLevel(5)
          setNotes("")
        }
      }
    } catch (error) {
      console.log("[v0] Error loading symptoms:", error)
    }
  }, [selectedDate])

  const handleSymptomSeverity = (symptomId: string, severity: number) => {
    setSelectedSymptoms((prev) => {
      if (severity === 0) {
        const { [symptomId]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [symptomId]: severity }
    })
  }

  const handleSave = () => {
    try {
      const newEntry = {
        date: selectedDate,
        symptoms: selectedSymptoms,
        painLevel,
        notes,
      }
      const updatedSymptoms = symptoms.filter((s) => s.date !== selectedDate)
      updatedSymptoms.push(newEntry)
      setSymptoms(updatedSymptoms)
      localStorage.setItem("saukhya_symptoms", JSON.stringify(updatedSymptoms))
      alert("Symptoms saved!")
    } catch (error) {
      console.log("[v0] Error saving symptoms:", error)
      alert("Error saving symptoms")
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Symptom Tracker</h2>
        <p className="text-muted-foreground">Log how you're feeling and track patterns</p>
      </div>

      {symptoms.length > 0 && (
        <div className="mb-8">
          <SymptomTrends symptoms={symptoms} />
        </div>
      )}

      {/* Date Selector */}
      <div className="mb-6 bg-white border border-border rounded-lg p-6 shadow-sm">
        <label className="block text-sm font-semibold text-foreground mb-2">Select Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full"
        />
      </div>

      {/* Pain Level */}
      <div className="mb-8 bg-white border border-border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Overall Pain Level</h3>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="0"
            max="10"
            value={painLevel}
            onChange={(e) => setPainLevel(Number.parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="text-2xl font-bold text-accent-red w-16 text-right">{painLevel}/10</span>
        </div>
        <div className="mt-4 flex gap-2 text-xs text-muted-foreground">
          <span>No pain</span>
          <span className="flex-1"></span>
          <span>Severe pain</span>
        </div>
      </div>

      {/* Symptoms by Category */}
      {Object.entries(SYMPTOM_CATEGORIES).map(([categoryKey, category]) => (
        <div key={categoryKey} className="mb-8 bg-white border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">{category.label}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {category.symptoms.map((symptom) => (
              <div key={symptom.id} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{symptom.icon}</span>
                    <span className="font-medium text-foreground">{symptom.label}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map((level) => (
                    <button
                      key={level}
                      onClick={() => handleSymptomSeverity(symptom.id, level)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-smooth ${
                        selectedSymptoms[symptom.id] === level
                          ? level === 0
                            ? "bg-muted text-muted-foreground"
                            : level === 1
                              ? "bg-yellow-200 text-yellow-800"
                              : level === 2
                                ? "bg-orange-200 text-orange-800"
                                : "bg-accent-red text-white"
                          : "bg-muted text-muted-foreground hover:bg-border"
                      }`}
                    >
                      {level === 0 ? "None" : level === 1 ? "Mild" : level === 2 ? "Moderate" : "Severe"}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Notes */}
      <div className="mb-8 bg-white border border-border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Additional Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          rows={4}
          placeholder="Any additional observations or notes about how you're feeling..."
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-smooth mb-8"
      >
        Save Symptoms
      </button>

      {/* History */}
      {symptoms.length > 0 && (
        <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent History</h3>
          <div className="space-y-3">
            {symptoms
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 10)
              .map((entry) => (
                <div key={entry.date} className="border border-border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-foreground">{new Date(entry.date).toLocaleDateString()}</p>
                      <p className="text-sm text-muted-foreground">Pain Level: {entry.painLevel}/10</p>
                      {Object.keys(entry.symptoms).length > 0 && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Symptoms: {Object.keys(entry.symptoms).length} logged
                        </p>
                      )}
                      {entry.notes && <p className="text-sm text-muted-foreground mt-1">{entry.notes}</p>}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
