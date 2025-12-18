"use client"

import { useState } from "react"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isSameDay, isFuture } from "date-fns"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface MonthCalendarModalProps {
    isOpen: boolean
    onClose: () => void
    onSelectDate: (date: Date) => void
    selectedDate: Date
}

export default function MonthCalendarModal({ isOpen, onClose, onSelectDate, selectedDate }: MonthCalendarModalProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date())

    if (!isOpen) return null

    const days = eachDayOfInterval({
        start: startOfWeek(startOfMonth(currentMonth)),
        end: endOfWeek(endOfMonth(currentMonth))
    })

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-[#1B4332]">{format(currentMonth, 'MMMM yyyy')}</h2>
                    <div className="flex gap-2">
                        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-gray-100 rounded-full">
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-gray-100 rounded-full">
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-red-50 rounded-full text-red-500 ml-2">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                        <div key={d} className="text-xs font-bold text-gray-400 uppercase">{d}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {days.map((day) => {
                        const isSelected = isSameDay(day, selectedDate)
                        const isCurrentMonth = isSameMonth(day, currentMonth)
                        const isFutureDate = isFuture(day)

                        return (
                            <button
                                key={day.toString()}
                                onClick={() => {
                                    if (!isFutureDate) {
                                        onSelectDate(day)
                                        onClose()
                                    }
                                }}
                                disabled={isFutureDate}
                                className={`
                    h-10 w-10 text-sm rounded-full flex items-center justify-center transition-all
                    ${!isCurrentMonth ? 'text-gray-300' : ''}
                    ${isSelected ? 'bg-[#2D6A4F] text-white font-bold shadow-lg' : 'hover:bg-gray-100 text-gray-700'}
                    ${isFutureDate ? 'opacity-30 cursor-not-allowed' : ''}
                 `}
                            >
                                {format(day, 'd')}
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
