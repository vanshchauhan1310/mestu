"use client"

import { useState, useEffect } from "react"
import { format, addDays, differenceInDays } from "date-fns"
import CycleCalendarStrip from "./cycle-calendar-strip"
import { Droplets, Calendar as CalendarIcon, Activity, Check, Info } from "lucide-react"
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"

interface HomeHeroSectionProps {
    user: any
}

export default function HomeHeroSection({ user }: HomeHeroSectionProps) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [cycleData, setCycleData] = useState({
        phase: "Follicular",
        daysInCycle: 1,
        periodIn: 0,
        fertileIn: 0,
        ovulationIn: 0,
        predictionTitle: "Day of cycle"
    })

    // Weight State
    const [weight, setWeight] = useState(user?.weight || "")
    const [currentBMI, setCurrentBMI] = useState(user?.bmi || "")
    const [isSavingWeight, setIsSavingWeight] = useState(false)

    useEffect(() => {
        if (user?.lastPeriodDate) {
            const lastPeriod = new Date(user.lastPeriodDate)
            const cycleLen = parseInt(user.cycleLength || "28")
            const periodLen = parseInt(user.periodDuration || "5")

            const today = new Date()
            // Diff in days
            const diffTime = Math.abs(today.getTime() - lastPeriod.getTime())
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            const currentDay = (diffDays % cycleLen) || 1

            // Next Period
            const nextPeriodDate = addDays(lastPeriod, cycleLen)
            const daysUntilPeriod = differenceInDays(nextPeriodDate, today)

            // Phase calculation
            let phase = "Follicular"
            let prediction = `Day ${currentDay} of Follicular`

            if (currentDay <= periodLen) {
                phase = "Menstruation"
                prediction = `Day ${currentDay} of Period`
            } else if (currentDay > periodLen && currentDay < (cycleLen - 14)) {
                phase = "Follicular"
                prediction = `Day ${currentDay} - Follicular Phase`
            } else if (currentDay >= (cycleLen - 14) && currentDay <= (cycleLen - 12)) {
                phase = "Ovulation"
                prediction = `Ovulation Window`
            } else {
                phase = "Luteal"
                prediction = `Luteal Phase`
            }

            setCycleData({
                phase,
                daysInCycle: currentDay,
                periodIn: daysUntilPeriod,
                fertileIn: Math.max(0, (cycleLen - 16) - currentDay), // Rough estimate
                ovulationIn: Math.max(0, (cycleLen - 14) - currentDay),
                predictionTitle: prediction
            })
        }
    }, [user])

    const handleLogPeriod = async () => {
        if (!auth.currentUser) return
        const todayStr = format(new Date(), 'yyyy-MM-dd')
        const confirmLog = window.confirm("Log period start for today?")
        if (confirmLog) {
            try {
                await updateDoc(doc(db, "users", auth.currentUser.uid), {
                    lastPeriodDate: todayStr
                })
                alert("Period updated!")
                window.location.reload() // Simple refresh to sync calc
            } catch (e) {
                console.error(e)
            }
        }
    }

    const handleSaveWeight = async () => {
        if (!auth.currentUser || !weight) return
        setIsSavingWeight(true)
        try {
            // Calc BMI
            let bmi = currentBMI
            if (user?.height) {
                const h_m = parseFloat(user.height) / 100
                const w_kg = parseFloat(weight)
                if (h_m > 0 && w_kg > 0) bmi = (w_kg / (h_m * h_m)).toFixed(1)
            }
            setCurrentBMI(bmi)

            const today = format(new Date(), 'yyyy-MM-dd')

            // Save to logs
            await setDoc(doc(db, "users", auth.currentUser.uid, "wellness_logs", today), {
                weight: weight,
                bmi: bmi,
                date: today,
                timestamp: new Date().toISOString()
            }, { merge: true })

            // Update Profile
            await updateDoc(doc(db, "users", auth.currentUser.uid), {
                weight: weight,
                bmi: bmi
            })

            setIsSavingWeight(false)
            // alert("Weight saved") 
        } catch (e) {
            console.error(e)
            setIsSavingWeight(false)
        }
    }

    return (
        <div className="w-full mb-8">
            {/* Green Header Section */}
            <div className="bg-[#2D6A4F] text-white rounded-[32px] p-6 pb-24 relative overflow-hidden shadow-2xl shadow-emerald-900/20">

                {/* Top Info */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Hey, {user?.name?.split(' ')[0] || "there"}</h1>
                        <p className="text-sm opacity-80">{format(currentDate, "EEEE, MMMM d")}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                        Day {cycleData.daysInCycle}
                    </div>
                </div>

                {/* Calendar Strip */}
                <CycleCalendarStrip currentDate={currentDate} />

            </div>

            {/* Floating Prediction Card */}
            <div className="mx-4 -mt-20 relative z-10">
                <div className="bg-white rounded-[24px] p-6 shadow-xl border border-gray-100 text-center">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Prediction</span>
                    <h2 className="text-3xl font-bold text-[#1B4332] mt-2 mb-4">{cycleData.predictionTitle}</h2>

                    <button
                        onClick={handleLogPeriod}
                        className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-emerald-600/30 transition-transform active:scale-95 flex items-center gap-2 mx-auto"
                    >
                        <Droplets className="w-5 h-5" />
                        Log period
                    </button>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-2 mt-8 pt-6 border-t border-gray-100">
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] uppercase text-gray-400 font-bold mb-1">Period in</span>
                            <span className="text-xl font-bold text-[#2D6A4F]">{cycleData.periodIn} days</span>
                        </div>
                        <div className="flex flex-col items-center border-l border-gray-100">
                            <span className="text-[10px] uppercase text-gray-400 font-bold mb-1">Fertile Window</span>
                            <span className="text-xl font-bold text-[#2D6A4F]">{cycleData.fertileIn} days</span>
                        </div>
                        <div className="flex flex-col items-center border-l border-gray-100">
                            <span className="text-[10px] uppercase text-gray-400 font-bold mb-1">Ovulation in</span>
                            <span className="text-xl font-bold text-[#2D6A4F]">{cycleData.ovulationIn} days</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid for Weight & Forecast */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-4 mt-6">

                {/* Setup/Status Card (Top Left in Screenshot 2) */}
                <div className="bg-[#00B4D8] text-white p-6 rounded-[24px] shadow-lg shadow-cyan-500/10 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-8">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                            <CalendarIcon className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold bg-black/20 px-2 py-1 rounded">PHASE</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-1">{cycleData.phase} Phase</h3>
                        <p className="opacity-80 text-sm">Day {cycleData.daysInCycle}</p>
                    </div>
                </div>

                {/* Next Period Card (Top Right in Screenshot 2) */}
                <div className="bg-[#FF9F1C] text-white p-6 rounded-[24px] shadow-lg shadow-orange-500/10 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-8">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                            <Activity className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold bg-black/20 px-2 py-1 rounded">NEXT</span>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold mb-1">{cycleData.periodIn} <span className="text-lg font-medium opacity-80">days</span></h3>
                        <p className="opacity-80 text-sm">Expected Period</p>
                    </div>
                </div>

                {/* Daily Weight Card (Middle in Screenshot 2) */}
                <div className="md:col-span-2 bg-blue-50/50 p-6 rounded-[24px] border border-blue-100">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                                <Activity className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#1a237e] uppercase text-sm">Daily Weight</h4>
                                <p className="text-xs text-blue-400">Update to track BMI</p>
                            </div>
                        </div>
                        <div className="bg-white px-3 py-2 rounded-xl text-center shadow-sm">
                            <span className="block text-xl font-bold text-[#1a237e]">{currentBMI || "--"}</span>
                            <span className="text-[10px] font-bold text-blue-400 uppercase">BMI</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="flex-1 bg-white border-none rounded-xl px-4 py-3 text-lg font-bold text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="kg"
                        />
                        <button
                            onClick={handleSaveWeight}
                            className="bg-[#2962FF] hover:bg-blue-700 text-white rounded-xl px-6 transition-all shadow-lg shadow-blue-600/20"
                            disabled={isSavingWeight}
                        >
                            {isSavingWeight ? <Activity className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Forecast Card (Bottom in Screenshot 2) */}
                <div className="md:col-span-2 bg-[#F3E5F5] p-6 rounded-[24px] border border-purple-100 flex items-center gap-4">
                    <div className="p-3 bg-white text-purple-500 rounded-xl shadow-sm">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-purple-900 uppercase text-xs mb-1">Today's Forecast</h4>
                        <p className="text-purple-700 font-medium">
                            {cycleData.phase === 'Menstruation' ? 'Rest and hydrate. Low energy is normal.' :
                                cycleData.phase === 'Ovulation' ? 'High energy! Great day for exercise.' :
                                    cycleData.phase === 'Luteal' ? 'Listen to your body. PMS symptoms may appear.' :
                                        'You are in the Follicular phase. Energy is rising!'}
                        </p>
                    </div>
                </div>

            </div>

        </div>
    )
}
