"use client"

import { useState } from "react"
import { Play, Apple, Leaf, CheckCircle2, ChevronRight, ArrowLeft, Flame, Activity, Star, Calendar, Plus, TrendingUp, User, Moon } from "lucide-react"

type HealTabProps = {
    onStartJourney?: () => void
}

export default function HealTab() {
    const [isJourneyStarted, setIsJourneyStarted] = useState(false)

    if (!isJourneyStarted) {
        return (
            <div className="space-y-6 pb-24">
                {/* Hero Section */}
                <div className="relative h-64 rounded-[2.5rem] overflow-hidden shadow-xl">
                    <img
                        src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop"
                        alt="Meditation"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
                            Your Personalized HEAL Journey
                        </h2>
                        <p className="text-white/80 text-sm">
                            Transform your PCOS management in 3 months
                        </p>
                    </div>
                </div>

                {/* Feature List */}
                <div className="space-y-4">
                    {[
                        { title: "Daily cycle-synced yoga sessions", icon: Play, color: "from-purple-500 to-pink-500" },
                        { title: "Personalized PCOS-friendly meal plans", icon: Apple, color: "from-emerald-400 to-teal-500" },
                        { title: "Eco-friendly product guidance", icon: Leaf, color: "from-cyan-400 to-blue-500" },
                        { title: "Comprehensive routine tracking", icon: CheckCircle2, color: "from-blue-500 to-indigo-600" }
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-4 rounded-3xl flex items-center gap-4 shadow-sm border border-gray-50 hover:scale-[1.01] transition-transform cursor-pointer">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg`}>
                                <item.icon className="w-7 h-7" />
                            </div>
                            <h4 className="font-bold text-[#1a4d2e] text-sm flex-1">
                                {item.title}
                            </h4>
                        </div>
                    ))}
                </div>

                {/* Start Button */}
                <button
                    onClick={() => setIsJourneyStarted(true)}
                    className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 p-5 rounded-3xl text-white font-bold text-lg shadow-xl shadow-pink-100 flex items-center justify-center gap-2 group active:scale-95 transition-all"
                >
                    Start Your HEAL Journey
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        )
    }

    {/* Active Journey Dashboard */ }
    return (
        <div className="space-y-6 pb-24">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4 -mt-2 mb-2">
                <button
                    onClick={() => setIsJourneyStarted(false)}
                    className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-[#1a4d2e] transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold text-[#1a4d2e]">My HEAL Journey</h2>
            </div>

            {/* Progress Card */}
            <div className="bg-gradient-to-br from-purple-600 to-[#d946ef] rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <p className="text-purple-100 text-xs font-medium mb-1">HEAL Journey Progress</p>
                            <h3 className="text-3xl font-bold">Week 4 of 12</h3>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-1">
                                <Flame className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-[10px] font-bold">12 day streak</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-white rounded-full w-[33%] shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Today's Yoga Session */}
            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-50">
                <div className="relative h-48">
                    <img
                        src="https://images.unsplash.com/photo-1599447421416-3414500d18a5?q=80&w=1000&auto=format&fit=crop"
                        alt="Yoga"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30"></div>
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">New</div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                        <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center mb-3 border border-white/30 group cursor-pointer hover:scale-110 transition-transform">
                            <Play className="w-8 h-8 fill-white" />
                        </div>
                        <h4 className="text-xl font-bold">Gentle Flow Yoga</h4>
                        <p className="text-xs text-white/80">15 min • Follicular Phase</p>
                    </div>
                </div>
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <Play className="w-4 h-4 text-purple-500" />
                        <h5 className="font-bold text-[#1a4d2e]">Today's Yoga Session</h5>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed mb-6">
                        This gentle sequence is designed for your current cycle phase to support hormonal balance and boost energy.
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-purple-50 p-3 rounded-2xl text-center">
                            <p className="text-[10px] text-gray-400 font-medium mb-1">Calories</p>
                            <p className="text-purple-600 font-bold">~80</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-2xl text-center">
                            <p className="text-[10px] text-gray-400 font-medium mb-1">Level</p>
                            <p className="text-purple-600 font-bold">Beginner</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-2xl text-center">
                            <p className="text-[10px] text-gray-400 font-medium mb-1">Focus</p>
                            <p className="text-purple-600 font-bold">Balance</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Today's Meal Plan */}
            <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-50">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                            <Apple className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-[#1a4d2e]">Today's Meal Plan</h4>
                            <p className="text-[10px] text-gray-400">1,650 cal • Low GI</p>
                        </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                        <Star className="w-4 h-4 fill-amber-500" />
                    </div>
                </div>

                <div className="space-y-4 mb-6">
                    {[
                        { type: "BREAKFAST", time: "8:00 AM", title: "Oats with berries & flaxseeds", desc: "Anti-inflammatory, high in fiber", color: "bg-orange-400" },
                        { type: "LUNCH", time: "1:00 PM", title: "Quinoa salad with leafy greens", desc: "Balanced protein and complex carbs", color: "bg-emerald-400" },
                        { type: "DINNER", time: "7:00 PM", title: "Grilled fish with roasted vegetables", desc: "Omega-3 rich, supports hormones", color: "bg-blue-400" }
                    ].map((meal, i) => (
                        <div key={i} className="p-4 rounded-3xl border border-gray-50 shadow-sm relative overflow-hidden group hover:border-emerald-100 transition-colors">
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-bold tracking-wider ${i === 0 ? 'text-orange-500' : i === 1 ? 'text-emerald-500' : 'text-blue-500'}`}>{meal.type}</span>
                                    <span className="text-[10px] text-gray-300">• {meal.time}</span>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${meal.color}`}></div>
                            </div>
                            <h5 className="font-bold text-[#1a4d2e] text-sm mb-1">{meal.title}</h5>
                            <p className="text-[10px] text-gray-400">{meal.desc}</p>
                        </div>
                    ))}
                </div>

                <button className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-50 hover:bg-emerald-700 transition-all">
                    View Full Nutrition Details
                </button>
            </div>

            {/* Eco-Friendly Switch */}
            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-50">
                <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-6 text-white relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leaf.png')] opacity-10"></div>
                    <div className="flex justify-between items-center relative z-10">
                        <div className="flex items-center gap-3">
                            <Leaf className="w-6 h-6" />
                            <div>
                                <h4 className="font-bold">Eco-Friendly Switch</h4>
                                <p className="text-[10px] text-teal-50">Week 2 Challenge</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold">40%</p>
                            <p className="text-[10px] text-teal-50">Complete</p>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <p className="text-gray-500 text-xs leading-relaxed mb-6">
                        Reusable menstrual products reduce chemical exposure and are better for your body and the planet. Make the switch this week! 🌿
                    </p>
                    <div className="flex gap-3">
                        <button className="flex-1 border-2 border-teal-500 text-teal-600 py-3 rounded-2xl font-bold text-xs hover:bg-teal-50 transition-all">
                            Learn More
                        </button>
                        <button className="flex-1 bg-teal-600 text-white py-3 rounded-2xl font-bold text-xs shadow-lg shadow-teal-50 hover:bg-teal-700 transition-all">
                            Shop Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Daily Habits */}
            <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-50">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-[#1a4d2e]">Daily Habits</h4>
                    </div>
                    <p className="text-xs font-bold text-blue-500">2/3 <span className="text-gray-300 font-normal">completed</span></p>
                </div>

                <div className="space-y-3 mb-6">
                    {[
                        { title: "Morning yoga session", time: "7:00 AM", done: true },
                        { title: "Log all meals", time: "9:00 PM", done: true },
                        { title: "Evening meditation", time: "9:30 PM", done: false }
                    ].map((habit, i) => (
                        <div key={i} className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${habit.done ? 'bg-green-50/50 border-green-100' : 'bg-white border-gray-100'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${habit.done ? 'bg-green-500 border-green-500 text-white' : 'border-gray-200'}`}>
                                    {habit.done && <CheckCircle2 className="w-4 h-4" />}
                                </div>
                                <div>
                                    <h5 className={`text-sm font-bold ${habit.done ? 'text-green-700 line-through opacity-50' : 'text-[#1a4d2e]'}`}>{habit.title}</h5>
                                    <p className="text-[10px] text-gray-400">{habit.time}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-blue-50 hover:bg-blue-700 transition-all">
                    Open Full Tracker
                </button>
            </div>

            {/* Track Your Day Card */}
            <div className="bg-gradient-to-br from-white to-purple-50 rounded-[2.5rem] p-6 shadow-sm border border-purple-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100/50 rounded-full -mr-8 -mt-8 blur-2xl"></div>
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-[#1a4d2e]">Track Your Day</h4>
                            <p className="text-[10px] text-gray-400">Day 15 • Follicular Phase</p>
                        </div>
                    </div>
                    <div className="relative">
                        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#f3e8ff" strokeWidth="8" />
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#a855f7" strokeWidth="8" strokeDasharray="251" strokeDashoffset="60" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <Flame className="w-4 h-4 text-purple-600" />
                            <span className="text-[8px] font-bold text-purple-600">12 days</span>
                        </div>
                    </div>
                </div>

                <p className="text-gray-500 text-xs leading-relaxed mb-6 relative z-10">
                    Keep your streak going! Daily tracking helps personalize your HEAL journey.
                </p>

                <div className="flex gap-3 relative z-10">
                    <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 rounded-2xl font-bold text-xs shadow-lg shadow-pink-100 hover:scale-[1.02] transition-all">
                        Log Today
                    </button>
                    <button className="flex-1 border-2 border-purple-500 text-purple-600 py-4 rounded-2xl font-bold text-xs hover:bg-purple-50 transition-all">
                        View History
                    </button>
                </div>
            </div>
        </div>
    )
}
