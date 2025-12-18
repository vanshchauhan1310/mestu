"use client"

import { useState, useEffect } from "react"
import { collection, query, getDocs, orderBy, limit } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import { TrendingUp, Activity, Smile, AlertCircle } from "lucide-react"

export default function TrendsWidget() {
    const [logs, setLogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchLogs = async () => {
            if (!auth.currentUser) return
            try {
                // Fetch last 30 logs
                const q = query(
                    collection(db, "users", auth.currentUser.uid, "wellness_logs"),
                    orderBy("date", "desc"),
                    limit(30)
                )
                const snapshot = await getDocs(q)
                const fetchedLogs = snapshot.docs.map(doc => doc.data())
                setLogs(fetchedLogs)
            } catch (e) {
                console.error("Error fetching logs for trends", e)
            } finally {
                setLoading(false)
            }
        }
        fetchLogs()
    }, [])

    // 1. Symptom Frequency
    const symptomCounts: Record<string, number> = {}
    logs.forEach(log => {
        if (log.symptoms && Array.isArray(log.symptoms)) {
            log.symptoms.forEach((s: string) => {
                symptomCounts[s] = (symptomCounts[s] || 0) + 1
            })
        }
    })

    const topSymptoms = Object.entries(symptomCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)

    // 2. Mood Dominance
    const moodCounts: Record<string, number> = {}
    logs.forEach(log => {
        if (log.mood) {
            moodCounts[log.mood] = (moodCounts[log.mood] || 0) + 1
        }
    })
    const topMood = Object.entries(moodCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "No Data"

    if (loading) return <div className="p-8 text-center text-gray-400">Loading insights...</div>

    return (
        <div className="space-y-6 animate-in fade-in duration-300">

            {/* Top Stat Chart */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg">
                    <div className="flex items-center gap-2 mb-2 opacity-80">
                        <Smile className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Dominant Mood</span>
                    </div>
                    <div className="text-2xl font-bold capitalize">{topMood}</div>
                    <div className="text-xs mt-1 opacity-70">Over last 30 days</div>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-gray-400">
                        <Activity className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Logged Days</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{logs.length}</div>
                    <div className="text-xs mt-1 text-gray-400">Total entries</div>
                </div>
            </div>

            {/* Symptom Trends */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-pink-500" />
                    Top Symptoms
                </h3>

                {topSymptoms.length === 0 ? (
                    <div className="text-gray-400 text-sm py-4 text-center bg-gray-50 rounded-xl">
                        No symptoms logged yet.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {topSymptoms.map(([symptom, count]) => (
                            <div key={symptom}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700 capitalize">{symptom.replace('_', ' ')}</span>
                                    <span className="text-gray-400">{count} times</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-pink-500 rounded-full"
                                        style={{ width: `${(count / logs.length) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Insight Alert example */}
            {logs.length < 5 && (
                <div className="bg-blue-50 text-blue-700 p-4 rounded-xl flex items-start gap-3 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>keep logging daily! The more you log, the smarter your insights regarding mood and symptom patterns will become.</p>
                </div>
            )}

        </div>
    )
}
