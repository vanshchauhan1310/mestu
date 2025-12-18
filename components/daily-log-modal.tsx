"use client"

import { useState, useEffect } from "react"
import { X, Droplets, Smile, Frown, Meh, Zap, CloudFog, BatteryLow, Theater, Brain, Check, Save } from "lucide-react"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import { format } from "date-fns"

interface DailyLogModalProps {
    isOpen: boolean
    onClose: () => void
    date: Date
    currentData?: any
    onSave?: () => void
}

const SYMPTOMS_LIST = [
    { id: "cramps", label: "Cramps", icon: Droplets },
    { id: "bloating", label: "Bloating", icon: CloudFog },
    { id: "fatigue", label: "Fatigue", icon: BatteryLow },
    { id: "mood_swings", label: "Mood Swings", icon: Theater },
    { id: "headache", label: "Headache", icon: Brain },
    { id: "acne", label: "Acne", icon: Zap },
]

const MOODS = [
    { id: "happy", label: "Happy", icon: Smile, color: "text-green-500 bg-green-50" },
    { id: "neutral", label: "Neutral", icon: Meh, color: "text-gray-500 bg-gray-50" },
    { id: "sad", label: "Sad", icon: Frown, color: "text-blue-500 bg-blue-50" },
    { id: "irritated", label: "Irritated", icon: Zap, color: "text-red-500 bg-red-50" },
]

export default function DailyLogModal({ isOpen, onClose, date, currentData, onSave }: DailyLogModalProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        flowIntensity: "", // light, medium, heavy
        symptoms: [] as string[],
        mood: "",
        notes: ""
    })

    // Load initial data
    useEffect(() => {
        if (isOpen) {
            if (currentData) {
                setFormData({
                    flowIntensity: currentData.flowIntensity || "",
                    symptoms: currentData.symptoms || [],
                    mood: currentData.mood || "",
                    notes: currentData.notes || ""
                })
            } else {
                // Reset if no data passed, or fetch specifically if needed (but parent usually passes it)
                setFormData({ flowIntensity: "", symptoms: [], mood: "", notes: "" })
            }
        }
    }, [isOpen, currentData])

    const handleSymptomToggle = (id: string) => {
        setFormData(prev => ({
            ...prev,
            symptoms: prev.symptoms.includes(id)
                ? prev.symptoms.filter(s => s !== id)
                : [...prev.symptoms, id]
        }))
    }

    const handleSave = async () => {
        if (!auth.currentUser) return
        setLoading(true)
        try {
            const dateKey = format(date, 'yyyy-MM-dd')
            await setDoc(doc(db, "users", auth.currentUser.uid, "wellness_logs", dateKey), {
                ...formData,
                date: dateKey
            }, { merge: true })

            if (onSave) onSave()
            onClose()
        } catch (e) {
            console.error("Error saving log", e)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Daily Log</h2>
                        <p className="text-sm text-gray-500">{format(date, "EEEE, MMMM do")}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-8">

                    {/* Flow Section */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Flow Intensity</h3>
                        <div className="grid grid-cols-4 gap-2">
                            {["None", "Light", "Medium", "Heavy"].map(level => {
                                const val = level.toLowerCase()
                                const isSelected = formData.flowIntensity === val || (val === 'none' && !formData.flowIntensity)
                                return (
                                    <button
                                        key={level}
                                        onClick={() => setFormData({ ...formData, flowIntensity: val === 'none' ? '' : val })}
                                        className={`p-3 rounded-xl border text-sm font-medium transition-all ${isSelected ? 'bg-pink-50 border-pink-500 text-pink-700' : 'border-gray-100 text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        {level}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Symptoms Section */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Symptoms</h3>
                        <div className="flex flex-wrap gap-2">
                            {SYMPTOMS_LIST.map(sym => {
                                const Icon = sym.icon
                                const isSelected = formData.symptoms.includes(sym.id)
                                return (
                                    <button
                                        key={sym.id}
                                        onClick={() => handleSymptomToggle(sym.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-all ${isSelected ? 'bg-purple-600 text-white border-purple-600 shadow-md transform scale-105' : 'bg-white border-gray-200 text-gray-600 hover:border-purple-300'}`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {sym.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Mood Section */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Mood</h3>
                        <div className="grid grid-cols-4 gap-3">
                            {MOODS.map(m => {
                                const Icon = m.icon
                                const isSelected = formData.mood === m.id
                                return (
                                    <button
                                        key={m.id}
                                        onClick={() => setFormData({ ...formData, mood: m.id })}
                                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${isSelected ? `ring-2 ring-offset-2 ring-gray-900 ${m.color}` : 'border-gray-100 hover:bg-gray-50'}`}
                                    >
                                        <Icon className={`w-8 h-8 ${isSelected ? 'scale-110' : 'text-gray-400'}`} />
                                        <span className="text-xs font-medium text-gray-600">{m.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Notes</h3>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Anything else noted today?"
                            className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm min-h-[100px]"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 disabled:opacity-50"
                    >
                        {loading ? <span className="animate-spin">⌛</span> : <Save className="w-5 h-5" />}
                        Save Entry
                    </button>
                </div>

            </div>
        </div>
    )
}
