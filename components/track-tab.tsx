"use client"

import { useState } from "react"
import { Calendar, ChevronDown, ChevronUp, Zap, BarChart3 } from "lucide-react"

export default function TrackTab() {
    const [isCalendarCollapsed, setIsCalendarCollapsed] = useState(false)

    return (
        <div className="space-y-8 pb-24">
            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-[#48A359]">Track Your Cycle</h2>
                <p className="text-sm text-gray-500">Monitor your menstrual health and symptoms</p>
            </div>

            {/* Cycle Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden">
                <div
                    className="bg-[#48A359] p-6 text-white relative overflow-hidden cursor-pointer"
                    onClick={() => setIsCalendarCollapsed(!isCalendarCollapsed)}
                >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>

                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                <Calendar className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Your Cycle</h3>
                                <p className="text-green-100 text-xs">December 2024</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <div className="text-2xl font-bold">Day 15</div>
                                <p className="text-green-100 text-[10px]">of 28</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                {isCalendarCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 relative z-10">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-full border-4 border-white/10 flex items-center justify-center">
                                <div className="w-10 h-10 rounded-full bg-white text-[#48A359] flex items-center justify-center">
                                    <Zap className="w-6 h-6" />
                                </div>
                            </div>
                            <svg className="absolute inset-0 w-14 h-14 -rotate-90" viewBox="0 0 100 100">
                                <circle
                                    cx="50" cy="50" r="45"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="8"
                                    strokeDasharray="141"
                                    strokeDashoffset="70"
                                    strokeLinecap="round"
                                    className="opacity-40"
                                />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">Ovulation Phase</h4>
                            <p className="text-green-100 text-xs">Energy levels are rising, great time for activity</p>
                        </div>
                    </div>
                </div>

                {/* Calendar Grid - Collapsible */}
                {!isCalendarCollapsed && (
                    <div className="p-4 transition-all duration-300 ease-in-out">
                        <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                                <div key={d} className="text-xs text-gray-300 font-bold">{d}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium">
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                                let bgClass = "bg-gray-50 text-gray-400"
                                if (day >= 1 && day <= 5) bgClass = "bg-red-300 text-white" // Menstrual
                                if (day >= 6 && day <= 12) bgClass = "bg-green-200 text-[#1a4d2e]" // Follicular
                                if (day >= 13 && day <= 16) bgClass = "bg-[#48A359] text-white" // Ovulation
                                if (day >= 17 && day <= 28) bgClass = "bg-green-100 text-[#1a4d2e]" // Luteal
                                if (day >= 29) bgClass = "bg-green-100 text-[#1a4d2e]" // Luteal cont.

                                const isToday = day === 15

                                return (
                                    <div key={day} className={`aspect-square flex items-center justify-center rounded-xl text-[10px] ${bgClass} ${isToday ? 'ring-2 ring-[#48A359] ring-offset-2 font-bold' : ''}`}>
                                        {day}
                                    </div>
                                )
                            })}
                        </div>

                        {/* Legend */}
                        <div className="grid grid-cols-2 gap-2 mt-6">
                            <div className="flex items-center gap-2 bg-red-50/50 p-2 rounded-xl">
                                <div className="w-2 h-2 rounded-full bg-red-300"></div>
                                <span className="text-[10px] text-gray-500 font-medium">Menstrual</span>
                            </div>
                            <div className="flex items-center gap-2 bg-purple-50/50 p-2 rounded-xl">
                                <div className="w-2 h-2 rounded-full bg-purple-300"></div>
                                <span className="text-[10px] text-gray-500 font-medium">Follicular</span>
                            </div>
                            <div className="flex items-center gap-2 bg-green-50 p-2 rounded-xl">
                                <div className="w-2 h-2 rounded-full bg-[#48A359]"></div>
                                <span className="text-[10px] text-gray-500 font-medium">Ovulation</span>
                            </div>
                            <div className="flex items-center gap-2 bg-blue-50/50 p-2 rounded-xl">
                                <div className="w-2 h-2 rounded-full bg-blue-300"></div>
                                <span className="text-[10px] text-gray-500 font-medium">Luteal</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* More Tracking Tools */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-[#48A359]" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-[#1a4d2e]">More Tracking Tools</h3>
                    <p className="text-sm text-gray-400">Advanced symptom tracking coming soon...</p>
                </div>
            </div>
        </div>
    )
}
