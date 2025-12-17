import { useState, useEffect } from "react"
import { Calendar, Activity, Zap, Droplets } from "lucide-react"

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
    <div className="grid grid-cols-2 gap-4 mb-8">
      {/* Current Phase */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg shadow-emerald-500/20 group transition-transform hover:scale-[1.02]">
        <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
        <div className="flex justify-between items-start mb-3">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-black/10 px-2 py-1 rounded-md">Phase</span>
        </div>
        <div>
          <p className="font-bold text-lg leading-tight">{cycleData.phase || "Loading..."}</p>
          <p className="text-sm text-emerald-100 font-medium">Day {cycleData.dayInCycle + 1}</p>
        </div>
      </div>

      {/* Next Period */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-5 text-white shadow-lg shadow-orange-500/20 group transition-transform hover:scale-[1.02]">
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
        <div className="flex justify-between items-start mb-3">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-black/10 px-2 py-1 rounded-md">Next</span>
        </div>
        <div>
          <p className="font-bold text-2xl">{cycleData.daysUntilPeriod} <span className="text-sm font-medium opacity-80">days</span></p>
          <p className="text-xs text-orange-100 mt-1">Expected {cycleData.nextPeriod}</p>
        </div>
      </div>

      {/* Flow & Symptoms */}
      <div className="relative overflow-hidden bg-white border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-purple-100 p-2 rounded-full">
            <Droplets className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-xs font-semibold text-muted-foreground uppercase">Flow</span>
        </div>
        <p className="font-bold text-foreground capitalize text-lg">{user?.flowIntensity || "Not set"}</p>
        <p className="text-xs text-muted-foreground mt-1">{user?.conditions?.length || 0} conditions logged</p>
      </div>

      {/* Pain Level */}
      <div className="relative overflow-hidden bg-white border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-red-100 p-2 rounded-full">
            <Zap className="w-4 h-4 text-red-500" />
          </div>
          <span className="text-xs font-semibold text-muted-foreground uppercase">Pain</span>
        </div>
        <div className="flex items-baseline gap-1">
          <p className="font-bold text-foreground text-2xl">{user?.painLevel || "0"}</p>
          <span className="text-xs text-muted-foreground font-medium">/ 10</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Typical level</p>
      </div>
    </div>
  )
}
