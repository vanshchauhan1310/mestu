"use client"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight, Info, Check, Plus } from "lucide-react"
import { format, subMonths, eachDayOfInterval, startOfMonth, endOfMonth, isSameMonth, isSameDay, addDays, isWithinInterval } from "date-fns"

// --- USER DETAILS STEP ---

export function UserDetailsStep({ onNext }: { onNext: (data: any) => void }) {
    const [name, setName] = useState('')
    const [dob, setDob] = useState('')

    const isValid = name.trim().length > 0 && dob.length > 0

    return (
        <div className="flex-1 w-full flex flex-col items-center h-full overflow-hidden">
            {/* Header */}
            <div className="shrink-0 pt-6 px-6 text-center w-full">
                <h2 className="text-2xl font-bold text-[#1a4d2e] mb-2">About You</h2>
                <p className="text-gray-500 text-sm mb-6">
                    We just need a few details to personalize your experience.
                </p>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 w-full overflow-y-auto px-6 pb-4 flex flex-col items-center">
                <div className="w-full max-w-sm space-y-6">
                    {/* Name Input */}
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">First Name</label>
                        <input
                            type="text"
                            className="w-full text-xl font-bold text-gray-800 outline-none placeholder-gray-200 bg-transparent"
                            placeholder="Jane"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* DOB Input */}
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Date of Birth</label>
                        <input
                            type="date"
                            className="w-full text-xl font-bold text-gray-800 outline-none placeholder-gray-200 bg-transparent"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            style={{ minHeight: '32px' }}
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="w-full px-6 py-4 bg-white/80 backdrop-blur-md border-t border-gray-100 shrink-0 z-20">
                <button
                    onClick={() => onNext({ name, dob })}
                    disabled={!isValid}
                    className="w-full bg-[#368241] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#2d6a35] transition-all shadow-lg shadow-green-900/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    Start Screener
                </button>
            </div>
        </div>
    )
}

// --- CALENDAR STEP ---

export function CalendarStep({ onNext }: { onNext: (data: any) => void }) {
    // State: all selected dates
    const [selectedDates, setSelectedDates] = useState<Date[]>([])

    // Last 4 months (Today back to -3 months)
    const months = useMemo(() => {
        const today = new Date()
        return [
            today,
            subMonths(today, 1),
            subMonths(today, 2),
            subMonths(today, 3)
        ]
    }, [])

    const toggleDate = (date: Date) => {
        // Find selected dates in this specific month
        const monthDates = selectedDates.filter(d => isSameMonth(d, date))
        const otherDates = selectedDates.filter(d => !isSameMonth(d, date))

        // If no dates selected in this month yet -> Select 5 days
        if (monthDates.length === 0) {
            const newRange = Array.from({ length: 5 }).map((_, i) => addDays(date, i))
            setSelectedDates([...otherDates, ...newRange])
            return
        }

        // If dates exist, check interaction
        // 1. Is the clicked date already selected? -> Toggle Off (Remove)
        if (monthDates.some(d => isSameDay(d, date))) {
            const newMonthDates = monthDates.filter(d => !isSameDay(d, date))
            setSelectedDates([...otherDates, ...newMonthDates])
            return
        }

        // 2. Is it a new period (far away)?
        // Sort existing to find range
        const sorted = monthDates.sort((a, b) => a.getTime() - b.getTime())
        const start = sorted[0]
        const end = sorted[sorted.length - 1]

        // Check proximity. If user clicks a date "close" to existing range, they likely want to extend/modify it.
        // Let's use a 4 day buffer as 'close'.

        const distToStart = (start.getTime() - date.getTime()) / (1000 * 60 * 60 * 24) // +ve if date is before start
        const distToEnd = (date.getTime() - end.getTime()) / (1000 * 60 * 60 * 24) // +ve if date is after end

        if (distToStart > 0 && distToStart <= 4) {
            // Extend Start
            setSelectedDates([...selectedDates, date])
        } else if (distToEnd > 0 && distToEnd <= 4) {
            // Extend End
            setSelectedDates([...selectedDates, date])
        } else if (date > start && date < end) {
            // Filling gap
            setSelectedDates([...selectedDates, date])
        } else {
            // Far away -> Assume new period, replace old selection in this month
            const newRange = Array.from({ length: 5 }).map((_, i) => addDays(date, i))
            setSelectedDates([...otherDates, ...newRange])
        }
    }

    return (
        <div className="flex-1 w-full flex flex-col items-center h-full overflow-hidden">
            <h2 className="text-2xl font-bold text-[#1a4d2e] mb-2 text-center shrink-0 pt-2">Track Your Cycle</h2>
            <p className="text-gray-500 text-sm mb-4 text-center max-w-xs shrink-0 px-4">
                Select your period dates for the last few months.
            </p>

            {/* Scrollable Months List */}
            <div className="flex-1 w-full overflow-y-auto px-4 pb-4 space-y-8">
                {months.map(month => (
                    <div key={month.toString()} className="w-full max-w-[340px] mx-auto">
                        <h3 className="text-lg font-bold text-gray-800 mb-3 sticky top-0 bg-white/95 backdrop-blur-sm p-2 z-10 border-b border-gray-100">
                            {format(month, 'MMMM yyyy')}
                        </h3>

                        <div className="grid grid-cols-7 mb-2">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                <div key={i} className="text-center text-[10px] font-bold text-gray-400">
                                    {d}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-y-1 relative">
                            {Array(eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) })[0].getDay()).fill(null).map((_, i) => (
                                <div key={`blank-${i}`} />
                            ))}
                            {eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) }).map(day => {
                                const isSelected = selectedDates.some(d => isSameDay(d, day))

                                return (
                                    <button
                                        key={day.toString()}
                                        onClick={() => toggleDate(day)}
                                        className={`w-9 h-9 flex items-center justify-center text-sm font-medium transition-all mx-auto rounded-full
                                            ${isSelected
                                                ? "bg-[#48A359] text-white shadow-md shadow-green-200"
                                                : "text-gray-700 hover:bg-green-50"
                                            }`}
                                    >
                                        {format(day, 'd')}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Fixed Bottom Button */}
            <div className="w-full px-6 py-4 bg-white/80 backdrop-blur-md border-t border-gray-100 shrink-0 z-20">
                <button
                    onClick={() => onNext({ periods: selectedDates })}
                    className="w-full bg-[#368241] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#2d6a35] transition-all shadow-lg shadow-green-900/10 flex items-center justify-center gap-2"
                >
                    Continue <Check className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}


// --- BMI STEP ---

export function BMIStep({ onNext }: { onNext: (data: any) => void }) {
    const [height, setHeight] = useState<string>('')
    const [weight, setWeight] = useState<string>('')
    const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')

    // Calculated BMI
    const bmi = useMemo(() => {
        const h = parseFloat(height)
        const w = parseFloat(weight)
        if (!h || !w || h <= 0 || w <= 0) return 0

        let val = 0
        if (unit === 'metric') {
            // cm, kg -> kg / (m^2)
            val = w / ((h / 100) * (h / 100))
        } else {
            // Metric default for MVP
            val = w / ((h / 100) * (h / 100))
        }
        return Math.round(val * 10) / 10
    }, [height, weight, unit])

    const category = useMemo(() => {
        if (bmi === 0) return ""
        if (bmi < 18.5) return "Underweight"
        if (bmi < 25) return "Healthy"
        if (bmi < 30) return "Overweight"
        return "Obese"
    }, [bmi])

    const gaugeColor = useMemo(() => {
        if (category === "Healthy") return "#48A359" // Green
        if (category === "Overweight") return "#eab308" // Yellow
        if (category === "Underweight") return "#3b82f6" // Blue
        return "#ef4444" // Red
    }, [category])

    const gaugePercentage = useMemo(() => {
        if (!bmi) return 0
        const min = 15
        const max = 40
        return Math.min(1, Math.max(0, (bmi - min) / (max - min)))
    }, [bmi])

    return (
        <div className="flex-1 w-full flex flex-col items-center h-full overflow-hidden">
            {/* Header */}
            <div className="shrink-0 pt-6 px-6 text-center w-full">
                <h2 className="text-2xl font-bold text-[#1a4d2e] mb-2">BMI Calculator</h2>
                <p className="text-gray-500 text-sm mb-6">
                    Knowing your BMI helps assessment accuracy.
                </p>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 w-full overflow-y-auto px-6 pb-4 flex flex-col items-center">
                {/* Inputs */}
                <div className="w-full max-w-sm space-y-6 mb-10">
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
                            H
                        </div>
                        <div className="flex-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Height (cm)</label>
                            <input
                                type="number"
                                className="w-full text-xl font-bold text-gray-800 outline-none placeholder-gray-200 bg-transparent"
                                placeholder="165"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                onWheel={(e) => (e.target as HTMLInputElement).blur()}
                            />
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 font-bold text-xs uppercase">
                            W
                        </div>
                        <div className="flex-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Weight (kg)</label>
                            <input
                                type="number"
                                className="w-full text-xl font-bold text-gray-800 outline-none placeholder-gray-200 bg-transparent"
                                placeholder="60"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                onWheel={(e) => (e.target as HTMLInputElement).blur()}
                            />
                        </div>
                    </div>
                </div>

                {/* Premium Gauge: Left-to-Right Fill */}
                <div className="relative w-72 h-40 mt-4 mb-4 flex items-end justify-center">
                    <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
                        {/* 1. Background Track (Gray) */}
                        <path
                            d="M 20 100 A 80 80 0 0 1 180 100"
                            fill="none"
                            stroke="#f3f4f6"
                            strokeWidth="24"
                            strokeLinecap="round"
                        />

                        {/* 2. Dynamic Fill (Colored) - Always fills from Left (Start) */}
                        <path
                            d="M 20 100 A 80 80 0 0 1 180 100"
                            fill="none"
                            stroke={gaugeColor || "#e5e7eb"}
                            strokeWidth="24"
                            strokeLinecap="round"
                            pathLength="100"
                            strokeDasharray="100 100"
                            strokeDashoffset={100 - (gaugePercentage * 100)}
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>

                    {/* Value Display - Centered */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 flex flex-col items-center">
                        <div className="text-6xl font-black text-slate-800 tracking-tight leading-none">
                            {bmi > 0 ? bmi : "--"}
                        </div>
                        <div
                            className={`mt-2 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm transition-all duration-300 transform
                                ${bmi > 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
                            `}
                            style={{
                                backgroundColor: bmi > 0 ? `${gaugeColor}15` : 'transparent',
                                color: gaugeColor || 'transparent'
                            }}
                        >
                            {category}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="w-full px-6 py-4 bg-white/80 backdrop-blur-md border-t border-gray-100 shrink-0 z-20">
                <button
                    onClick={() => onNext({ height, weight, bmi })}
                    disabled={!bmi}
                    className="w-full bg-[#368241] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#2d6a35] transition-all shadow-lg shadow-green-900/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    Next Step
                </button>
            </div>
        </div>
    )
}
