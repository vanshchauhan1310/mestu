"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./auth-context"
import { doc, getDoc, collection, getDocs } from "firebase/firestore"
import { signOut } from "firebase/auth"
import { db, auth } from "@/lib/firebase"
import { User, Calendar, Shield, Heart, Bookmark, MessageCircle, MoreHorizontal, ChevronRight, ChevronLeft, LogOut } from "lucide-react"

export default function ProfileTab() {
    const { user } = useAuth()
    const [userData, setUserData] = useState<any>(null)
    const [activeTab, setActiveTab] = useState<'liked' | 'saved' | 'commented'>('liked')
    const [view, setView] = useState<'main' | 'activity'>('main')
    const [activityPosts, setActivityPosts] = useState<any[]>([])
    const [isLoadingActivity, setIsLoadingActivity] = useState(false)
    const [showReportModal, setShowReportModal] = useState(false)

    // Fetch User Data & Risk Score
    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                const docRef = doc(db, "users", user.uid)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    setUserData(docSnap.data())
                }
            }
        }
        fetchUserData()
    }, [user])

    // Fetch Activity Data
    useEffect(() => {
        const fetchActivity = async () => {
            if (!user || view !== 'activity') return

            setIsLoadingActivity(true)
            try {
                if (activeTab === 'liked') {
                    const snap = await getDocs(collection(db, "users", user.uid, "likes"))
                    const posts = snap.docs.map(d => ({ id: d.id, ...d.data(), action: 'Liked' }))
                    setActivityPosts(posts)
                } else if (activeTab === 'saved') {
                    const snap = await getDocs(collection(db, "users", user.uid, "saved"))
                    const posts = snap.docs.map(d => ({ id: d.id, ...d.data(), action: 'Saved' }))
                    setActivityPosts(posts)
                } else {
                    // Commented: Placeholder as comments separate collection not fully linked yet
                    setActivityPosts([])
                }
            } catch (err) {
                console.error("Error fetching activity:", err)
            } finally {
                setIsLoadingActivity(false)
            }
        }
        fetchActivity()
    }, [user, view, activeTab])

    const calculateAge = (dob: string) => {
        if (!dob) return ""
        const birthDate = new Date(dob)
        const ageDifMs = Date.now() - birthDate.getTime()
        const ageDate = new Date(ageDifMs)
        return Math.abs(ageDate.getUTCFullYear() - 1970)
    }

    const handleLogout = async () => {
        try {
            await signOut(auth)
        } catch (error) {
            console.error("Error signing out:", error)
        }
    }

    if (view === 'activity') {
        return (
            <div className="space-y-6 pb-24">
                <div className="flex items-center gap-4 pt-2">
                    <button
                        onClick={() => setView('main')}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-50 text-gray-500 hover:text-[#1a4d2e] hover:border-[#1a4d2e] transition-all"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-bold text-[#1a4d2e]">Community Activity</h2>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-white rounded-2xl border border-gray-50 mb-4 overflow-hidden">
                    {(['liked', 'saved', 'commented'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2
                                ${activeTab === tab
                                    ? "bg-[#1a4d2e] text-white shadow-md shadow-green-900/10"
                                    : "text-gray-400 hover:bg-gray-50"}
                            `}
                        >
                            {tab === 'liked' && <Heart className={`w-3 h-3 ${activeTab === tab ? "fill-current" : ""}`} />}
                            {tab === 'saved' && <Bookmark className={`w-3 h-3 ${activeTab === tab ? "fill-current" : ""}`} />}
                            {tab === 'commented' && <MessageCircle className="w-3 h-3" />}
                            <span className="capitalize">{tab}</span>
                        </button>
                    ))}
                </div>

                {/* Activity List */}
                <div className="space-y-3">
                    {isLoadingActivity ? (
                        <div className="text-center py-10 text-gray-400">Loading...</div>
                    ) : activityPosts.length === 0 ? (
                        <div className="text-center py-10 text-gray-400 text-sm">
                            No {activeTab} posts yet.
                        </div>
                    ) : (
                        activityPosts.map(post => (
                            <div key={post.id} className="bg-white p-4 rounded-2xl border border-gray-50 flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                                    <User className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] text-gray-400 mb-1">
                                        You <span className="font-bold text-[#1a4d2e]">{post.action}</span> this post
                                    </p>
                                    <p className="text-xs text-gray-700 font-medium line-clamp-2 mb-2">
                                        "{post.content}"
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-bold text-[#48A359] bg-green-50 px-2 py-0.5 rounded-full">
                                            {post.category}
                                        </span>
                                        <span className="text-[10px] text-gray-400">• {post.user}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 pb-24">
            {/* Header / Info Card */}
            <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-50 flex flex-col items-center text-center mt-4">
                <div className="w-24 h-24 rounded-full bg-green-50 p-1 mb-4 relative">
                    {user?.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                        <div className="w-full h-full rounded-full bg-[#E8F5E9] flex items-center justify-center">
                            <User className="w-10 h-10 text-[#48A359]" />
                        </div>
                    )}
                    <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-100 text-gray-400 hover:text-[#1a4d2e]">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>

                <h2 className="text-xl font-bold text-[#1a4d2e] mb-1">
                    {userData?.name || user?.displayName || "User"}
                </h2>
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-6">
                    {userData?.dateOfBirth && (
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {calculateAge(userData.dateOfBirth)} years old
                        </span>
                    )}
                    <span>{user?.email && user.email.includes('guest_') ? 'Guest Account' : user?.email}</span>
                </div>

                {/* Risk Score Widget */}
                {userData?.pcosRisk && (
                    <div className={`w-full p-4 rounded-2xl flex items-center justify-between mb-2
                        ${userData.pcosRisk.includes("High") ? "bg-red-50 border border-red-100 text-red-800" :
                            userData.pcosRisk.includes("Moderate") ? "bg-orange-50 border border-orange-100 text-orange-800" :
                                "bg-green-50 border border-green-100 text-green-800"}
                    `}>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center
                                ${userData.pcosRisk.includes("High") ? "bg-red-100 text-red-600" :
                                    userData.pcosRisk.includes("Moderate") ? "bg-orange-100 text-orange-600" :
                                        "bg-green-100 text-green-600"}
                            `}>
                                <Shield className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Assessment Result</p>
                                <p className="font-bold text-sm">{userData.pcosRisk}</p>
                            </div>
                        </div>
                        <span onClick={() => setShowReportModal(true)} className="text-xs font-bold underline cursor-pointer hover:opacity-80">View Report</span>
                    </div>
                )}
            </div>

            {/* Menu Items */}
            <div className="space-y-4">
                <button
                    onClick={() => setView('activity')}
                    className="w-full bg-white p-4 rounded-2xl border border-gray-50 flex items-center justify-between hover:border-[#48A359] transition-all group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#1a4d2e]">
                            <MessageCircle className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-[#1a4d2e]">Community Activity</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#48A359]" />
                </button>

                <button
                    onClick={handleLogout}
                    className="w-full bg-white p-4 rounded-2xl border border-gray-50 flex items-center justify-between hover:border-red-200 transition-all group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                            <LogOut className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-red-500">Log Out</span>
                    </div>
                </button>
            </div>

            {/* Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] p-6 w-full max-w-sm animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-[#1a4d2e]">Risk Assessment</h3>
                            <button onClick={() => setShowReportModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <ChevronRight className="w-5 h-5 rotate-90" />
                            </button>
                        </div>

                        <div className={`p-4 rounded-2xl mb-4 ${userData?.pcosRisk?.includes("High") ? "bg-red-50 text-red-800" :
                                userData?.pcosRisk?.includes("Moderate") ? "bg-orange-50 text-orange-800" :
                                    "bg-green-50 text-green-800"
                            }`}>
                            <p className="font-bold text-lg mb-1">{userData?.pcosRisk}</p>
                            <p className="text-xs opacity-80">Based on your reported symptoms.</p>
                        </div>

                        <div className="space-y-3 text-sm text-gray-600 mb-6">
                            <p><strong>Recommendation:</strong></p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Consult a gynecologist for a formal diagnosis.</li>
                                <li>Track your cycle irregularities in the Cycle tab.</li>
                                <li>Maintain a balanced diet and regular exercise.</li>
                            </ul>
                        </div>

                        <button
                            onClick={() => setShowReportModal(false)}
                            className="w-full py-3 bg-[#1a4d2e] text-white rounded-xl font-bold hover:bg-[#143d24]"
                        >
                            Close Report
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
