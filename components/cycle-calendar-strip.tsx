"use client"

import { useMemo } from "react"
import { format, addDays, startOfWeek, isSameDay } from "date-fns"

interface CycleCalendarStripProps {
    currentDate?: Date
    periodDays?: Date[] // Array of dates that are "period" days
}

export default function CycleCalendarStrip({
    currentDate = new Date(),
    periodDays = []
}: CycleCalendarStripProps) {

    // Generate a 2-week window centered on current date (or just current week)
    // Let's do a sliding window of -3 to +3 days for the visible strip
    const days = useMemo(() => {
        // Start from 3 days ago
        const start = addDays(currentDate, -3)
        return Array.from({ length: 7 }).map((_, i) => addDays(start, i))
    }, [currentDate])

    return (
        <div className="flex justify-between items-center gap-2 py-4 overflow-x-auto no-scrollbar">
            {days.map((date) => {
                const isSelected = isSameDay(date, currentDate)
                const dayNum = format(date, "d")
                const dayName = format(date, "EEEEE") // S, M, T, W, T, F, S

                return (
                    <div
                        key={date.toString()}
                        className={`flex flex-col items-center justify-center min-w-[40px] h-[60px] rounded-full transition-all ${isSelected
                                ? "bg-white text-[#2D6A4F] shadow-lg scale-110 font-bold"
                                : "text-white/80 hover:bg-white/10"
                            }`}
                    >
                        <span className="text-[10px] uppercase opacity-80">{dayName}</span>
                        <span className="text-lg">{dayNum}</span>

                        {/* Dot indicator (optional, maybe for period days) */}
                        {/* {periodDays.some(p => isSameDay(p, date)) && (
               <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1"></div>
            )} */}
                    </div>
                )
            })}
        </div>
    )
}
