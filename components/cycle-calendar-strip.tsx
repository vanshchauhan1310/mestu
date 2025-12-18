"use client"

import { useMemo } from "react"
import { format, addDays, startOfWeek, isSameDay } from "date-fns"

interface CycleCalendarStripProps {
    currentDate?: Date
    selectedDate: Date
    onSelectDate: (date: Date) => void
    periodDays?: Date[] // Array of dates that are "period" days
}

export default function CycleCalendarStrip({
    currentDate = new Date(),
    selectedDate,
    onSelectDate,
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
                const isSelected = isSameDay(date, selectedDate)
                const isFutureDate = date > new Date() && !isSameDay(date, new Date())
                const isPeriodDay = periodDays.some(p => isSameDay(p, date))

                const dayNum = format(date, "d")
                const dayName = format(date, "EEEEE")

                return (
                    <button
                        key={date.toString()}
                        onClick={() => !isFutureDate && onSelectDate(date)}
                        disabled={isFutureDate}
                        className={`flex flex-col items-center justify-center min-w-[40px] h-[60px] rounded-full transition-all relative ${isSelected
                                ? "bg-white text-[#2D6A4F] shadow-lg scale-110 font-bold"
                                : isFutureDate ? "opacity-30 cursor-not-allowed text-white" : "text-white/80 hover:bg-white/10"
                            }`}
                    >
                        <span className="text-[10px] uppercase opacity-80">{dayName}</span>
                        <span className="text-lg">{dayNum}</span>

                        {/* Period Indicator Dot */}
                        {isPeriodDay && !isSelected && (
                            <div className="absolute -bottom-1 w-1.5 h-1.5 bg-green-300 rounded-full shadow-sm"></div>
                        )}
                        {isPeriodDay && isSelected && (
                            <div className="absolute -bottom-1 w-1.5 h-1.5 bg-[#2D6A4F] rounded-full"></div>
                        )}
                    </button>
                )
            })}
        </div>
    )
}
