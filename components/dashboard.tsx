"use client"

import { useState } from "react"
import { Bell, User, Home, Heart, Calendar, Shield, ChevronRight, Leaf, Apple, Activity, CheckCircle2, Smile, Zap, Moon, ChevronDown, ChevronUp, Star, BookOpen, TrendingUp, Sparkles, Play, Plus, Flame, ArrowLeft, Utensils } from "lucide-react"
import HealTab from "./heal-tab"

type DashboardProps = {
    riskData?: {
        riskCategory: string
        totalScore: number
        action: string
    }
}

export default function Dashboard({ riskData }: DashboardProps) {
    const [activeTab, setActiveTab] = useState<'cycle' | 'heal' | 'track' | 'analysis' | 'profile'>('cycle')
    const [isCalendarCollapsed, setIsCalendarCollapsed] = useState(false)

    // Default risk data if not provided (for dev/preview)
    const risk = riskData || {
        riskCategory: "Medium Risk",
        totalScore: 15,
        action: "3-month HEAL guided journey"
    }

    // Map risk category to colors/styles
    const getRiskStyles = (category: string) => {
        if (category.includes("High")) return { bg: "bg-red-500", text: "text-red-50", label: "High Risk" }
        if (category.includes("Moderate") || category.includes("Medium")) return { bg: "bg-orange-500", text: "text-orange-50", label: "Medium Risk" }
        return { bg: "bg-green-500", text: "text-green-50", label: "Low Risk" }
    }

    const riskStyle = getRiskStyles(risk.riskCategory)

    const renderContent = () => {
        if (activeTab === 'cycle') {
            return (
                <div className="space-y-8 pb-24">

                    {/* 1. Greeting Card */}
                    <div className="relative overflow-hidden rounded-[2.5rem] h-48 shadow-lg">
                        {/* Background Image */}
                        <img
                            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop"
                            alt="Wellness"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-orange-900/40"></div>

                        {/* Glassmorphism Text Container */}
                        <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                            <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                                Hello, Sarah! <span className="text-amber-300">✨</span>
                            </h2>
                            <p className="text-white/80 text-[10px] font-medium">
                                Day 15 • Follicular Phase • Your energy is rising!
                            </p>
                        </div>

                        {/* Subtle decorative circle */}
                        <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/10"></div>
                    </div>

                    {/* 2. Cycle Card */}
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

                    {/* 3. Daily Check-in */}
                    <div>
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-[#1a4d2e]">How are you feeling today?</h3>
                            <p className="text-xs text-gray-400">Based on Day 15 • Follicular Phase</p>
                        </div>

                        <div className="space-y-3">
                            {[
                                { icon: Smile, color: "text-[#48A359]", bg: "bg-green-50", label: "Positive mood", sub: "Likelihood: High" },
                                { icon: Zap, color: "text-amber-500", bg: "bg-amber-50", label: "High energy", sub: "Likelihood: High" },
                                { icon: Activity, color: "text-blue-500", bg: "bg-blue-50", label: "Increased focus", sub: "Likelihood: Medium" },
                            ].map((item, i) => (
                                <div key={i} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-gray-50">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center ${item.color}`}>
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#1a4d2e] text-sm">{item.label}</h4>
                                            <p className="text-xs text-gray-400">{item.sub}</p>
                                        </div>
                                    </div>
                                    <div className="w-6 h-6 rounded-full border-2 border-gray-100"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 4. Risk Score Card */}
                    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-50 p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-[#c15824] flex items-center justify-center text-white shadow-lg shadow-orange-100">
                                <Shield className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#1a4d2e]">Medium Risk</h3>
                                <p className="text-xs text-gray-400">PCOS Risk Assessment</p>
                            </div>
                        </div>

                        <div className="bg-orange-50/50 rounded-2xl p-4 mb-6">
                            <p className="text-gray-600 leading-relaxed text-sm">
                                Consistency can bring meaningful improvement within months.
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="text-[#48A359]">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-[#1a4d2e] text-sm">Track your progress</p>
                                    <p className="text-[10px] text-gray-400">Monitor changes with daily habits</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* HEAL Journey Long Button */}
                    <button
                        onClick={() => setActiveTab('heal')}
                        className="w-full bg-gradient-to-r from-[#c15824] to-[#722062] p-6 rounded-[2rem] text-white flex items-center justify-between shadow-xl shadow-orange-100/50 group hover:scale-[1.02] transition-all"
                    >
                        <div className="text-left">
                            <p className="text-xs text-white/80 mb-1">Ready to transform?</p>
                            <h3 className="text-xl font-bold">Start Your 3-Month HEAL Journey</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                            <Sparkles className="w-6 h-6" />
                        </div>
                    </button>

                    {/* 5. Four Pillars */}
                    <div>
                        <h3 className="text-lg font-bold text-[#1a4d2e] mb-4 px-1">Four Pillars of HEAL</h3>
                        <div className="space-y-3">
                            {[
                                {
                                    title: "How to relieve PCOS symptoms with Guided Yoga",
                                    image: "https://images.unsplash.com/photo-1588286840104-8957b019727f?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                                    icon: Activity
                                },
                                {
                                    title: "what's the best diet plan for PCOS management?",
                                    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=200&auto=format&fit=crop",
                                    icon: Apple
                                },
                                {
                                    title: "Eco-friendly period products for sustainable care",
                                    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=200&auto=format&fit=crop",
                                    icon: Leaf
                                },
                                {
                                    title: "Daily habits to track for better PCOS outcomes",
                                    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=200&auto=format&fit=crop",
                                    icon: CheckCircle2
                                }
                            ].map((pillar, i) => (
                                <div
                                    key={i}
                                    className="bg-[#ede4d9] rounded-[2rem] p-3 flex items-center gap-4 cursor-pointer hover:bg-[#e5dacd] transition-colors group"
                                >
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
                                        <img
                                            src={pillar.image}
                                            alt={pillar.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h4 className="font-bold text-[#1a4d2e] text-xs flex-1 leading-snug">
                                        {pillar.title}
                                    </h4>
                                    <div className="w-8 h-8 flex items-center justify-center text-gray-400 group-hover:text-[#1a4d2e] transition-colors">
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Success Stories Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h3 className="text-lg font-bold text-[#1a4d2e]">Success Stories</h3>
                            <Heart className="w-5 h-5 text-pink-500" />
                        </div>
                        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6">
                            {[
                                { name: "Priya M., 28", location: "Mumbai", text: "After 3 months on the HEAL journey, my cycles became more regular and my symptoms reduced significantly. The personalized approach really works!", icon: "🌸" },
                                { name: "Anjali S., 32", location: "Bangalore", text: "The combination of yoga, diet tracking, and daily routine monitoring helped me understand my body better. I feel more in control now.", icon: "🌺" },
                                { name: "Riya K., 26", location: "Delhi", text: "Switching to reusable products and following the guided exercises made such a difference. I wish I had found this app sooner!", icon: "🌻" }
                            ].map((story, i) => (
                                <div key={i} className="min-w-[300px] bg-white rounded-3xl p-6 shadow-sm border border-gray-50 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-pink-50 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                                    <div className="text-purple-400 mb-4">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12C14.017 12.5523 13.5693 13 13.017 13H11.017C10.4647 13 10.017 12.5523 10.017 12V9C10.017 7.34315 11.3601 6 13.017 6H19.017C20.6738 6 22.017 7.34315 22.017 9V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM3.017 21L3.017 18C3.017 16.8954 3.91244 16 5.017 16H8.017C8.56928 16 9.017 15.5523 9.017 15V9C9.017 8.44772 8.56928 8 8.017 8H4.017C3.46472 8 3.017 8.44772 3.017 9V12C3.017 12.5523 2.56928 13 2.017 13H0.017C-0.535282 13 -1.017 12.5523 -1.017 12V9C-1.017 7.34315 0.326142 6 2.017 6H8.017C9.67386 6 11.017 7.34315 11.017 9V15C11.017 18.3137 8.33071 21 5.017 21H3.017Z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-600 text-sm italic mb-6 leading-relaxed">"{story.text}"</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-xl shadow-inner">
                                                {story.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[#1a4d2e] text-xs">{story.name}</h4>
                                                <p className="text-[10px] text-gray-400">{story.location}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star key={star} className="w-3 h-3 fill-amber-400 text-amber-400" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Learn & Explore Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4 px-1">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-purple-500" />
                                <h3 className="text-lg font-bold text-[#1a4d2e]">Learn & Explore</h3>
                            </div>
                            <TrendingUp className="w-5 h-5 text-[#48A359]" />
                        </div>
                        <div className="space-y-3">
                            {[
                                { title: "Understanding PCOS: Causes and Symptoms", category: "BASICS", time: "5 min read", icon: "🔬", color: "bg-purple-100 text-purple-600", border: "border-l-purple-500" },
                                { title: "How Yoga Helps Manage PCOS Naturally", category: "EXERCISE", time: "7 min read", icon: "🧘", color: "bg-pink-100 text-pink-600", border: "border-l-pink-500" },
                                { title: "PCOS-Friendly Diet: What to Eat and Avoid", category: "NUTRITION", time: "10 min read", icon: "🥗", color: "bg-green-100 text-green-600", border: "border-l-green-500" },
                                { title: "Benefits of Reusable Menstrual Products", category: "WELLNESS", time: "4 min read", icon: "🌿", color: "bg-teal-100 text-teal-600", border: "border-l-teal-500" },
                                { title: "Sleep and Stress: Impact on Hormonal Balance", category: "LIFESTYLE", time: "6 min read", icon: "😴", color: "bg-blue-100 text-blue-600", border: "border-l-blue-500" }
                            ].map((item, i) => (
                                <div key={i} className={`bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-gray-50 border-l-4 ${item.border} hover:bg-gray-50 transition-colors cursor-pointer group`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center text-2xl shadow-sm`}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold tracking-wider mb-0.5 opacity-80">{item.category}</p>
                                            <h4 className="font-bold text-[#1a4d2e] text-sm leading-tight group-hover:text-[#48A359] transition-colors">{item.title}</h4>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Moon className="w-3 h-3 text-gray-300" />
                                                <p className="text-[10px] text-gray-400">{item.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#1a4d2e] transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )
        }

        if (activeTab === 'heal') {
            return <HealTab />
        }

        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    {activeTab === 'track' && <Plus className="w-10 h-10 text-gray-400" />}
                    {activeTab === 'analysis' && <TrendingUp className="w-10 h-10 text-gray-400" />}
                    {activeTab === 'profile' && <User className="w-10 h-10 text-gray-400" />}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
                <p className="text-gray-500">This feature is currently under development.</p>
            </div>
        )
    }

    return (
        <div className="flex-1 bg-[#F8FAF9] flex flex-col relative overflow-hidden">
            {/* Header */}
            <header className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-20 border-b border-gray-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg overflow-hidden">
                        <img src="/intro/intro.png" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h1 className="font-bold text-[#1a4d2e] text-sm leading-none">HEAL</h1>
                        <p className="text-[10px] text-gray-400 font-medium">PCOS Wellness</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="relative text-gray-400 hover:text-[#1a4d2e] transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <button className="text-gray-400 hover:text-[#1a4d2e] transition-colors">
                        <User className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-y-auto pb-24 no-scrollbar">
                {renderContent()}
            </main>

            {/* Bottom Navigation */}
            <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-50 px-6 py-3 pb-8 z-30 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
                <button
                    onClick={() => setActiveTab('cycle')}
                    className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'cycle' ? 'text-[#48A359]' : 'text-gray-300 hover:text-gray-400'}`}
                >
                    <Home className="w-6 h-6" />
                    <span className="text-[10px] font-bold">Cycle</span>
                </button>

                <button
                    onClick={() => setActiveTab('heal')}
                    className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'heal' ? 'text-[#48A359]' : 'text-gray-300 hover:text-gray-400'}`}
                >
                    <Heart className="w-6 h-6" />
                    <span className="text-[10px] font-bold">HEAL</span>
                </button>

                <button
                    onClick={() => setActiveTab('track')}
                    className="relative -mt-12"
                >
                    <div className="w-16 h-16 rounded-full bg-[#48A359] flex items-center justify-center text-white shadow-lg shadow-green-200 active:scale-90 transition-transform">
                        <Plus className="w-8 h-8" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 absolute -bottom-6 left-1/2 -translate-x-1/2">Track</span>
                </button>

                <button
                    onClick={() => setActiveTab('analysis')}
                    className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'analysis' ? 'text-[#48A359]' : 'text-gray-300 hover:text-gray-400'}`}
                >
                    <TrendingUp className="w-6 h-6" />
                    <span className="text-[10px] font-bold">Analysis</span>
                </button>

                <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'profile' ? 'text-[#48A359]' : 'text-gray-300 hover:text-gray-400'}`}
                >
                    <User className="w-6 h-6" />
                    <span className="text-[10px] font-bold">Profile</span>
                </button>
            </div>
        </div>
    )
}
