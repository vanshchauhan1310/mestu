"use client"

import { useState } from "react"
import { Bell, User, Home, Heart, Shield, ChevronRight, ChevronLeft, Info, Leaf, Apple, Activity, CheckCircle2, Star, BookOpen, Sparkles, Plus, Users, Stethoscope } from "lucide-react"
import HealTab from "./heal-tab"
import TrackTab from "./track-tab"
import CommunityTab from "./community-tab"
import ConsultTab from "./consult-tab"
import ProfileTab from "./profile-tab"

type DashboardProps = {
    riskData?: {
        riskCategory?: string
        pcosRisk?: string
        totalScore?: number
        action?: string
    }
}

export default function Dashboard({ riskData }: DashboardProps) {
    const [activeTab, setActiveTab] = useState<'cycle' | 'heal' | 'track' | 'community' | 'consult' | 'profile'>('cycle')
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0)

    const successStories = [
        {
            name: "Priya M., 28",
            location: "Mumbai",
            text: "After 3 months on the HEAL journey, my cycles became more regular and my symptoms reduced significantly. The personalized approach really works!",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
        },
        {
            name: "Anjali S., 32",
            location: "Bangalore",
            text: "The combination of yoga, diet tracking, and daily routine monitoring helped me understand my body better. I feel more in control now.",
            image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200&auto=format&fit=crop"
        },
        {
            name: "Riya K., 26",
            location: "Delhi",
            text: "Switching to reusable products and following the guided exercises made such a difference. I wish I had found this app sooner!",
            image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop"
        }
    ]

    const nextStory = () => {
        setCurrentStoryIndex((prev) => (prev + 1) % successStories.length)
    }

    const prevStory = () => {
        setCurrentStoryIndex((prev) => (prev - 1 + successStories.length) % successStories.length)
    }

    const learnItems = [
        { title: "Understanding PCOS", time: "5 min", icon: "🔬" },
        { title: "Yoga for PCOS", time: "7 min", icon: "🧘" },
        { title: "PCOS-Friendly Diet", time: "10 min", icon: "🥗" }
    ]

    // Default risk data if not provided (for dev/preview)
    // Handle both Firestore data (pcosRisk) and local screener data (riskCategory)
    const risk = {
        riskCategory: riskData?.riskCategory || riskData?.pcosRisk || "Medium Risk",
        totalScore: riskData?.totalScore || 15,
        action: riskData?.action || "3-month HEAL guided journey"
    }

    // Map risk category to colors/styles
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const getRiskStyles = (category: string) => {
        if (!category) return { bg: "bg-green-500", text: "text-green-50", label: "Low Risk" }
        if (category.includes("High")) return { bg: "bg-red-500", text: "text-red-50", label: "High Risk" }
        if (category.includes("Moderate") || category.includes("Medium")) return { bg: "bg-orange-500", text: "text-orange-50", label: "Medium Risk" }
        return { bg: "bg-green-500", text: "text-green-50", label: "Low Risk" }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

                    {/* 4. Risk Score Card */}
                    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-50 p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-[#1a4d2e]">PCOS Risk Assessment</h3>
                            <Info className="w-5 h-5 text-gray-300" />
                        </div>

                        <div className="relative w-full max-w-[280px] mx-auto aspect-[2/1.2] mb-8">
                            <svg viewBox="0 0 200 100" className="w-full h-full">
                                {/* Background Arc */}
                                <path
                                    d="M 20,90 A 80,80 0 0 1 180,90"
                                    fill="none"
                                    stroke="#f3f4f6"
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                />
                                {/* Low segment (Green) */}
                                <path
                                    d="M 20,90 A 80,80 0 0 1 70,35"
                                    fill="none"
                                    stroke="#48A359"
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                />
                                {/* Medium segment (Orange) */}
                                <path
                                    d="M 70,35 A 80,80 0 0 1 130,35"
                                    fill="none"
                                    stroke="#c15824"
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                />
                                {/* High segment (Red) */}
                                <path
                                    d="M 130,35 A 80,80 0 0 1 180,90"
                                    fill="none"
                                    stroke="#ef4444"
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                />
                            </svg>
                            {/* Central Icon */}
                            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-[#c15824] flex items-center justify-center text-white shadow-lg border-4 border-white z-10">
                                    <Shield className="w-7 h-7" />
                                </div>
                            </div>

                            {/* Labels */}
                            <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4">
                                <span className="text-[10px] font-bold text-[#48A359]">Low</span>
                                <span className="text-[10px] font-bold text-[#c15824]">Medium</span>
                                <span className="text-[10px] font-bold text-[#ef4444]">High</span>
                            </div>
                        </div>

                        <div className="text-center space-y-2">
                            <h4 className="text-lg font-bold text-[#1a4d2e]">Medium Risk</h4>
                            <p className="text-sm text-gray-500 max-w-[240px] mx-auto leading-relaxed">
                                Consistency can bring meaningful improvement within months.
                            </p>
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
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 flex flex-col items-center text-center relative min-h-[400px]">
                            <div className="w-20 h-20 rounded-full border-2 border-[#48A359] p-1 mb-6 transition-all duration-500">
                                <img
                                    src={successStories[currentStoryIndex].image}
                                    alt="User"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                            <p className="text-gray-600 text-sm italic mb-4 leading-relaxed max-w-[280px] min-h-[80px] transition-all duration-500">
                                "{successStories[currentStoryIndex].text}"
                            </p>
                            <div className="flex gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <h4 className="font-bold text-[#1a4d2e] text-base mb-0.5 transition-all duration-500">{successStories[currentStoryIndex].name}</h4>
                            <p className="text-xs text-gray-400 mb-8 transition-all duration-500">{successStories[currentStoryIndex].location}</p>

                            <div className="flex items-center justify-between w-full mt-auto">
                                <button
                                    onClick={prevStory}
                                    className="text-[#48A359] hover:scale-110 transition-transform p-2"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <div className="flex gap-2">
                                    {successStories.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`transition-all duration-300 ${i === currentStoryIndex ? 'w-6 h-2 bg-[#48A359]' : 'w-2 h-2 bg-gray-200'} rounded-full`}
                                        ></div>
                                    ))}
                                </div>
                                <button
                                    onClick={nextStory}
                                    className="text-[#48A359] hover:scale-110 transition-transform p-2"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Learn & Explore Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-4 px-1">
                            <BookOpen className="w-5 h-5 text-[#722062]" />
                            <h3 className="text-lg font-bold text-[#1a4d2e]">Learn & Explore</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {learnItems.map((item, i) => (
                                <div key={i} className="bg-white p-4 rounded-2xl flex flex-col items-center text-center shadow-sm border border-gray-50 hover:border-[#48A359]/30 transition-all cursor-pointer">
                                    <div className="text-2xl mb-3">{item.icon}</div>
                                    <h4 className="font-bold text-[#1a4d2e] text-[10px] mb-1 leading-tight">{item.title}</h4>
                                    <p className="text-[8px] text-gray-400">{item.time}</p>
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

        if (activeTab === 'track') {
            return <TrackTab />
        }

        if (activeTab === 'community') {
            return <CommunityTab />
        }

        if (activeTab === 'consult') {
            return <ConsultTab />
        }

        if (activeTab === 'profile') {
            return <ProfileTab />
        }

        return <div />
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
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`text-gray-400 hover:text-[#1a4d2e] transition-colors p-1 rounded-full hover:bg-gray-100 ${activeTab === 'profile' ? 'text-[#1a4d2e] bg-green-50' : ''}`}
                    >
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
                    onClick={() => setActiveTab('community')}
                    className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'community' ? 'text-[#48A359]' : 'text-gray-300 hover:text-gray-400'}`}
                >
                    <Users className="w-6 h-6" />
                    <span className="text-[10px] font-bold">Community</span>
                </button>

                <button
                    onClick={() => setActiveTab('consult')}
                    className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'consult' ? 'text-[#48A359]' : 'text-gray-300 hover:text-gray-400'}`}
                >
                    <Stethoscope className="w-6 h-6" />
                    <span className="text-[10px] font-bold">Consult</span>
                </button>
            </div>
        </div>
    )
}
