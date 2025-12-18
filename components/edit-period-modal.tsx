"use client"

import { useState, useEffect } from "react"
import { X, Trash2, Save, Calendar as CalendarIcon, ArrowRight } from "lucide-react"
import { doc, updateDoc, deleteDoc } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import { format, parseISO } from "date-fns"

interface EditPeriodModalProps {
    isOpen: boolean
    onClose: () => void
    cycle: any // The cycle document object { id, startDate, endDate, type }
    onSave?: () => void
}

export default function EditPeriodModal({ isOpen, onClose, cycle, onSave }: EditPeriodModalProps) {
    const [loading, setLoading] = useState(false)
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")

    useEffect(() => {
        if (cycle && isOpen) {
            setStartDate(cycle.startDate)
            setEndDate(cycle.endDate)
        }
    }, [cycle, isOpen])

    const handleSave = async () => {
        if (!auth.currentUser || !cycle?.id) return

        // Basic Validation
        if (startDate > endDate) {
            alert("End date cannot be before start date")
            return
        }

        setLoading(true)
        try {
            await updateDoc(doc(db, "users", auth.currentUser.uid, "cycles", cycle.id), {
                startDate,
                endDate
            })
            if (onSave) onSave()
            onClose()
        } catch (e) {
            console.error("Error updating period", e)
            alert("Failed to update period")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!auth.currentUser || !cycle?.id) return
        if (!confirm("Are you sure you want to delete this period entry?")) return

        setLoading(true)
        try {
            await deleteDoc(doc(db, "users", auth.currentUser.uid, "cycles", cycle.id))
            // Trigger a refresh indirectly or callback
            window.location.reload() // Fastest way to clear state for now, or rely on snapshot listener in parent
        } catch (e) {
            console.error("Error deleting period", e)
        } finally {
            setLoading(false)
            onClose()
        }
    }

    if (!isOpen || !cycle) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 p-6">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Edit Period</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Date Inputs */}
                <div className="space-y-4 mb-8">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                        <div className="bg-white p-2 rounded-xl text-pink-500 shadow-sm">
                            <CalendarIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full bg-transparent font-bold text-gray-900 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-center text-gray-300">
                        <ArrowRight className="w-5 h-5 rotate-90" />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                        <div className="bg-white p-2 rounded-xl text-pink-500 shadow-sm">
                            <CalendarIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full bg-transparent font-bold text-gray-900 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="p-4 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-1 bg-gray-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 disabled:opacity-50"
                    >
                        {loading ? <span className="animate-spin">⌛</span> : <Save className="w-5 h-5" />}
                        Save Changes
                    </button>
                </div>

            </div>
        </div>
    )
}
