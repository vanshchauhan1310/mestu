"use client"

import { useState, useEffect } from "react"

interface HomeQuickStatsProps {
  user: any
}

export default function HomeQuickStats({ user }: HomeQuickStatsProps) {
  const [cycleData, setCycleData] = useState({
    phase: "",
    dayInCycle: 0,
    nextPeriod: "",
    daysUntilPeriod: 0,
  })

  useEffect(() => {
    try {
      if (user?.lastPeriodDate) {
        const lastPeriodDate = new Date(user.lastPeriodDate)
        const cycleLength = Number.parseInt(user?.cycleLength || "28")
        const periodDuration = Number.parseInt(user?.periodDuration || "5")

        const nextPeriod = new Date(lastPeriodDate.getTime() + cycleLength * 24 * 60 * 60 * 1000)
        const today = new Date()
        const daysElapsed = Math.floor((today.getTime() - lastPeriodDate.getTime()) / (24 * 60 * 60 * 1000))
        const dayInCycle = daysElapsed % cycleLength
        const daysUntilPeriod = cycleLength - dayInCycle

        let phase = ""
        if (dayInCycle < periodDuration) {
          phase = "Menstruation"
        } else if (dayInCycle < periodDuration + 8) {
          phase = "Follicular"
        } else if (dayInCycle < periodDuration + 13) {
          phase = "Ovulation"
        } else {
          phase = "Luteal"
        }

        setCycleData({
          phase,
          dayInCycle,
          nextPeriod: nextPeriod.toLocaleDateString(),
          daysUntilPeriod,
        })
      }
    } catch (error) {
      console.log("[v0] Error calculating cycle data:", error)
    }
  }, [user])

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      <div className="bg-gradient-to-br from-primary to-primary-light rounded-xl p-4 text-white shadow-md">
        <div className="text-2xl mb-2">📅</div>
        <p className="text-xs text-white/80 mb-1 font-medium">Current Phase</p>
        <p className="font-bold text-sm">{cycleData.phase || "Loading..."}</p>
        <p className="text-xs text-white/70 mt-1">Day {cycleData.dayInCycle + 1}</p>
      </div>

      <div className="bg-gradient-to-br from-accent-warm to-orange-600 rounded-xl p-4 text-white shadow-md">
        <div className="text-2xl mb-2">📊</div>
        <p className="text-xs text-white/80 mb-1 font-medium">Next Period</p>
        <p className="font-bold text-sm">{cycleData.daysUntilPeriod} days</p>
        <p className="text-xs text-white/70 mt-1">{cycleData.nextPeriod}</p>
      </div>

      <div className="bg-gradient-to-br from-accent-purple to-purple-700 rounded-xl p-4 text-white shadow-md">
        <div className="text-2xl mb-2">💭</div>
        <p className="text-xs text-white/80 mb-1 font-medium">Flow</p>
        <p className="font-bold text-sm capitalize">{user?.flowIntensity || "Not set"}</p>
        <p className="text-xs text-white/70 mt-1">{user?.conditions?.length || 0} conditions</p>
      </div>

      <div className="bg-gradient-to-br from-primary-light to-green-700 rounded-xl p-4 text-white shadow-md">
        <div className="text-2xl mb-2">🎯</div>
        <p className="text-xs text-white/80 mb-1 font-medium">Pain Level</p>
        <p className="font-bold text-sm">{user?.painLevel || "0"}/10</p>
        <p className="text-xs text-white/70 mt-1">Typical</p>
      </div>
    </div>
  )
}
