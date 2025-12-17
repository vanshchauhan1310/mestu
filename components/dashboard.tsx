"use client"

import { useState, useEffect } from "react"

interface DashboardProps {
  user: any
}

export default function Dashboard({ user }: DashboardProps) {
  const [upcomingPeriod, setUpcomingPeriod] = useState<string>("")
  const [cyclePhase, setCyclePhase] = useState<string>("")
  const [daysInCycle, setDaysInCycle] = useState<number>(0)
  const [symptoms, setSymptoms] = useState<any[]>([])

  useEffect(() => {
    try {
      if (user?.lastPeriodDate) {
        const lastPeriodDate = new Date(user.lastPeriodDate)
        const cycleLength = Number.parseInt(user?.cycleLength || "28")
        const periodDuration = Number.parseInt(user?.periodDuration || "5")

        // Calculate next period
        const nextPeriod = new Date(lastPeriodDate.getTime() + cycleLength * 24 * 60 * 60 * 1000)
        setUpcomingPeriod(nextPeriod.toLocaleDateString())

        // Calculate current position in cycle
        const today = new Date()
        const daysElapsed = Math.floor((today.getTime() - lastPeriodDate.getTime()) / (24 * 60 * 60 * 1000))
        const dayInCycle = daysElapsed % cycleLength

        setDaysInCycle(dayInCycle)

        // Determine cycle phase
        if (dayInCycle < periodDuration) {
          setCyclePhase("Menstruation")
        } else if (dayInCycle < periodDuration + 8) {
          setCyclePhase("Follicular")
        } else if (dayInCycle < periodDuration + 13) {
          setCyclePhase("Ovulation")
        } else {
          setCyclePhase("Luteal")
        }
      }

      // Load symptoms from localStorage
      const savedSymptoms = localStorage.getItem("saukya_symptoms")
      if (savedSymptoms) {
        const allSymptoms = JSON.parse(savedSymptoms)
        setSymptoms(allSymptoms.slice(-7)) // Last 7 days
      }
    } catch (error) {
      console.log("[v0] Error loading dashboard data:", error)
    }
  }, [user])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user?.name || "Friend"}</h2>
        <p className="text-muted-foreground">
          {user?.conditions?.length > 0
            ? `Managing ${user.conditions.join(", ")} - You're doing great`
            : "Your menstrual health companion"}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-primary/10 border-2 border-primary rounded-lg p-6">
          <div className="text-primary text-4xl mb-2">📅</div>
          <h3 className="font-semibold text-foreground mb-2">Current Phase</h3>
          <p className="text-muted-foreground text-sm">
            {cyclePhase} - Day {daysInCycle + 1} of {user?.cycleLength || "28"}
          </p>
        </div>

        <div className="bg-accent-warm/10 border-2 border-accent-warm rounded-lg p-6">
          <div className="text-accent-warm text-4xl mb-2">📊</div>
          <h3 className="font-semibold text-foreground mb-2">Next Period</h3>
          <p className="text-muted-foreground text-sm">
            {upcomingPeriod ? `Predicted: ${upcomingPeriod}` : "Add last period date"}
          </p>
        </div>

        <div className="bg-accent-purple/10 border-2 border-accent-purple rounded-lg p-6">
          <div className="text-accent-purple text-4xl mb-2">💭</div>
          <h3 className="font-semibold text-foreground mb-2">Flow Intensity</h3>
          <p className="text-muted-foreground text-sm">
            {user?.flowIntensity ? user.flowIntensity.charAt(0).toUpperCase() + user.flowIntensity.slice(1) : "Not set"}
          </p>
        </div>
      </div>

      <div className="bg-white border border-border rounded-lg p-6 shadow-sm mb-8">
        <h3 className="text-xl font-bold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-lg transition-smooth">
            Log Period
          </button>
          <button className="bg-accent-warm hover:bg-accent-warm/90 text-white font-semibold py-3 px-4 rounded-lg transition-smooth">
            Log Symptoms & Pain
          </button>
          <button className="bg-accent-purple hover:bg-accent-purple/90 text-white font-semibold py-3 px-4 rounded-lg transition-smooth">
            Book Doctor Consultation
          </button>
          <button className="bg-primary-light hover:bg-primary-light/90 text-white font-semibold py-3 px-4 rounded-lg transition-smooth">
            Find Community Support
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary to-primary-light rounded-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-2">💡 Tip for Today</h3>
        <p className="text-sm">
          {user?.painLevel > 7
            ? "High pain days are common with your condition. Try gentle movement and heat therapy to manage discomfort."
            : "Tracking your symptoms helps identify patterns and triggers specific to your condition."}
        </p>
      </div>
    </div>
  )
}
