"use client"

import { useState, useEffect } from "react"
import { format, addDays, differenceInDays, isAfter, isSameDay } from "date-fns"
import CycleCalendarStrip from "./cycle-calendar-strip"
import MonthCalendarModal from "./month-calendar-modal"
import { Droplets, Calendar as CalendarIcon, Activity, Plus, Edit2 } from "lucide-react"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"

interface HomeHeroSectionProps {
    user: any
}

export default function HomeHeroSection({ user }: HomeHeroSectionProps) {
    // State
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const [dayLogs, setDayLogs] = useState<any>(null)

    // Cycle Calculations (Dynamic based on selected Date)
    const [cycleDisplay, setCycleDisplay] = useState({
        title: "Day 1 of Cycle",
        phase: "Follicular"
    })

    // Derived state
    const isToday = isSameDay(selectedDate, new Date())
    const isFuture = isAfter(selectedDate, new Date()) && !isToday

    // Fetch Logs for Selected Date
    useEffect(() => {
        const fetchDayLogs = async () => {
            if (!auth.currentUser) return
            const dateKey = format(selectedDate, 'yyyy-MM-dd')
            try {
                const snap = await getDoc(doc(db, "users", auth.currentUser.uid, "wellness_logs", dateKey))
                if (snap.exists()) {
                    setDayLogs(snap.data())
                } else {
                    setDayLogs(null)
                }
            } catch (e) {
                console.error("Error fetching logs", e)
            }
        }
        fetchDayLogs()
    }, [selectedDate, user])

    // Calculate Phase for Selected Date
    useEffect(() => {
        if (user?.lastPeriodDate) {
            const lastPeriod = new Date(user.lastPeriodDate)
            const cycleLen = parseInt(user.cycleLength || "28")
            const periodLen = parseInt(user.periodDuration || "5")

            const diffTime = Math.abs(selectedDate.getTime() - lastPeriod.getTime())
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            const currentDay = (diffDays % cycleLen) || 1

            // If selected date is BEFORE last period, logic might need adjustment, 
            // but for simplicity assuming we look forward from the referenced LMP or just standard modulo
            // Ideally we'd look effectively at the cycle that covers this date. 

            let phase = "Follicular"
            let title = `Day ${currentDay} of Cycle`

            if (currentDay <= periodLen) {
                phase = "Menstruation"
                title = `Day ${currentDay} of Period`
            } else if (currentDay >= (cycleLen - 14) && currentDay <= (cycleLen - 12)) {
                phase = "Ovulation"
                title = "Ovulation Window"
            } else if (currentDay > (cycleLen - 12)) {
                phase = "Luteal"
            }

            setCycleDisplay({ title, phase })
        }
    }, [selectedDate, user])

    const handleAddDetails = () => {
        // Logic to open a form modal or expand inline
        // For now, let's just log a dummy "Symptom: Cramps" as a demo if empty
        // In real code, this would open the specific log sheet
        const dateKey = format(selectedDate, 'yyyy-MM-dd')
        if (!dayLogs) {
            // Create empty
            setDayLogs({ weight: "", symptoms: [] })
        }
        alert(`Opening logger for ${dateKey}\n(Feature placeholder)`)
    }

    return (
        <div className="w-full mb-8">
            {/* Green Header Section */}
            <div className="bg-[#2D6A4F] text-white rounded-[32px] p-6 pb-24 relative overflow-hidden shadow-2xl shadow-emerald-900/20">

                {/* Top Info */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Hey, {user?.name?.split(' ')[0] || "Friend"}</h1>
                        <p className="text-sm opacity-80">{format(selectedDate, "EEEE, MMM d")}</p>
                    </div>

                    {/* Calendar Toggle Button (Replaces Day 1 Badge) */}
                    <button
                        onClick={() => setIsCalendarOpen(true)}
                        className="bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/30 transition-all text-white"
                    >
                        <CalendarIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Interactive Calendar Strip */}
                <CycleCalendarStrip
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                />

            </div>

            {/* Floating Main Card (Daily Detail) */}
            <div className="mx-4 -mt-20 relative z-10">
                <div className="bg-white rounded-[24px] p-6 shadow-xl border border-gray-100 text-center min-h-[200px] flex flex-col justify-center">

                    {isFuture ? (
                        <div className="text-gray-400 py-8">
                            <p>Cannot view data for future dates.</p>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-2">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{cycleDisplay.phase} PHASE</span>
                            <h2 className="text-3xl font-bold text-[#1B4332] mt-2 mb-6">{cycleDisplay.title}</h2>

                            {/* Dynamic Data Content */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {/* Weight/BMI */}
                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <span className="block text-xs text-gray-400 uppercase font-bold mb-1">BMI</span>
                                    <span className="text-lg font-bold text-[#2D6A4F]">{dayLogs?.bmi || "--"}</span>
                                </div>
                                {/* Symptoms */}
                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <span className="block text-xs text-gray-400 uppercase font-bold mb-1">Symptoms</span>
                                    <span className="text-sm font-medium text-gray-700 truncate">
                                        {dayLogs?.symptoms?.length > 0 ? dayLogs.symptoms.join(", ") : "--"}
                                    </span>
                                </div>
                            </div>

                            {/* Action Button */}
                            {!dayLogs ? (
                                <button
                                    onClick={handleAddDetails}
                                    className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-emerald-600/30 transition-transform active:scale-95 flex items-center justify-center gap-2 mx-auto w-full"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add Details
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button className="flex-1 bg-emerald-50 text-emerald-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                                        <Activity className="w-4 h-4" /> Details Logged
                                    </button>
                                    <button onClick={handleAddDetails} className="p-3 bg-gray-100 rounded-xl text-gray-600">
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Month Modal */}
            <MonthCalendarModal
                isOpen={isCalendarOpen}
                onClose={() => setIsCalendarOpen(false)}
                onSelectDate={setSelectedDate}
                selectedDate={selectedDate}
            />

        </div>
    )
}
