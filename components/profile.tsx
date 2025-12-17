"use client"

import type React from "react"
import { useState, useEffect } from "react"
import ProfileStats from "./profile-stats"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Pencil, Save, X, Trash2, Download, Cloud } from 'lucide-react'
import { doc, updateDoc, collection, getDocs, deleteDoc, writeBatch } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import { useLanguage } from "./language-context"

interface ProfileProps {
  user: any
  setUser: (user: any) => void
}

export default function Profile({ user, setUser }: ProfileProps) {
  const { language, setLanguage, t } = useLanguage()
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    height: "",
    weight: "",
    bmi: "",
    country: "India",
    cycleLength: "28",
    periodDuration: "5",
    conditions: [] as string[],
    pcosStatus: "unsure",
    coMorbidities: [] as string[],
    symptoms: [] as string[],
    goals: [] as string[],
  })

  // Data Stats
  const [cycles, setCycles] = useState<any[]>([])
  const [symptoms, setSymptoms] = useState<any[]>([])
  const [wellness, setWellness] = useState<any[]>([])

  const [notificationSettings, setNotificationSettings] = useState({
    periodReminder: true,
    symptomReminder: true,
    wellnessReminder: true,
    communityUpdates: false,
    emailNotifications: true,
  })

  const [privacySettings, setPrivacySettings] = useState({
    profilePrivate: false,
    dataSharing: false,
    analyticsTracking: true,
  })

  // Initial Data Load
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        age: user.age || "",
        height: user.height || "",
        weight: user.weight || "",
        bmi: user.bmi || "",
        country: user.country || "India",
        cycleLength: user.cycleLength || "28",
        periodDuration: user.periodDuration || "5",
        conditions: user.conditions || [],
        pcosStatus: user.pcosStatus || "unsure",
        coMorbidities: user.coMorbidities || [],
        symptoms: user.symptoms || [],
        goals: user.goals || [],
      })
    }

    // Fetch Stats from Firestore
    const fetchUserData = async () => {
      if (!auth.currentUser) return

      try {
        setIsLoading(true)
        const userId = auth.currentUser.uid

        // Fetch Cycles
        const cyclesRef = collection(db, "users", userId, "cycles")
        const cyclesSnap = await getDocs(cyclesRef)
        const cyclesData = cyclesSnap.docs.map(d => d.data())
        setCycles(cyclesData)

        // Fetch Symptoms
        const sxRef = collection(db, "users", userId, "symptoms")
        const sxSnap = await getDocs(sxRef)
        const sxData = sxSnap.docs.map(d => ({ date: d.id, ...d.data() }))
        setSymptoms(sxData)

        // Fetch Wellness
        // If you have a wellness collection, fetch here. For now defaulting to empty or matching symptoms logic
        // setWellness(...) 

        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching user stats:", err)
        setIsLoading(false)
      }
    }

    if (auth.currentUser) {
      fetchUserData()
    }
  }, [user])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (auth.currentUser) {
        await updateDoc(doc(db, "users", auth.currentUser.uid), formData)
      }
      localStorage.setItem("saukhya_user", JSON.stringify(formData))
      setUser(formData)
      setIsEditing(false)
      alert("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile")
    }
  }

  const handleDeleteData = async () => {
    if (!confirm("Are you sure? This will delete your account and all data PERMANENTLY.")) return

    if (auth.currentUser) {
      try {
        // Note: Client SDK cannot delete collections. 
        // We will delete the user doc and let basic retention policies (or manual cloud functions) handle the rest
        // Or physically delete what we've fetched.
        // For strict "Delete All", we should iterate what we know.

        const batch = writeBatch(db)
        // Delete Symptoms (limit 500)
        const sxRef = collection(db, "users", auth.currentUser.uid, "symptoms")
        const sxSnap = await getDocs(sxRef)
        sxSnap.docs.forEach(doc => batch.delete(doc.ref))

        // Delete Cycles
        const cyclesRef = collection(db, "users", auth.currentUser.uid, "cycles")
        const cyclesSnap = await getDocs(cyclesRef)
        cyclesSnap.docs.forEach(doc => batch.delete(doc.ref))

        // Delete User Doc
        const userRef = doc(db, "users", auth.currentUser.uid)
        batch.delete(userRef)

        await batch.commit()

        if (auth.currentUser) await auth.currentUser.delete()

        window.location.reload()
      } catch (e) {
        console.error("Delete failed", e)
        alert("Could not delete all data. Please contact support.")
      }
    }
  }

  const handleExportData = () => {
    const csvContent = [
      ["Date", "Type", "Details"],
      ...symptoms.map(s => [s.date, "Symptom", `Pain: ${s.painLevel}, Notes: ${s.notes || ''}`]),
      ...cycles.map(c => [c.startDate, "Period", `Length: ${c.flowIntensity}`])
    ].map(e => e.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `my_health_data_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const handleConditionToggle = (condition: string) => {
    setFormData((prev) => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter((c) => c !== condition)
        : [...prev.conditions, condition],
    }))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* NEW Header Card (Tier 1 Design) */}
      <div className="bg-gradient-to-br from-white to-purple-50/50 rounded-[2.5rem] p-6 md:p-10 shadow-xl shadow-purple-100/20 border border-white/60 mb-8 relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-28 h-28 md:w-32 md:h-32 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-indigo-500/30 border-4 border-white ring-1 ring-purple-100">
              {formData.name.charAt(0).toUpperCase()}
            </div>
            <div className="absolute bottom-1 right-1 bg-green-500 w-5 h-5 rounded-full border-4 border-white"></div>
          </div>

          {/* User Info */}
          <div className="text-center md:text-left flex-1 min-w-0">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight mb-2 truncate max-w-[250px] md:max-w-md">
                  {formData.name || "User"}
                </h1>
                <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2 text-sm md:text-base mb-3">
                  <span>{formData.age} years</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>{formData.country}</span>
                </p>
              </div>

              {/* Edit Button - No longer absolute/hidden */}
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)}
                  className="group flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all text-sm font-bold">
                  <Pencil className="w-4 h-4 text-slate-400 group-hover:text-violet-600 transition-colors" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 px-5 py-2.5 rounded-2xl border border-rose-100 transition-all text-sm font-bold">
                  <X className="w-4 h-4" /> Cancel
                </button>
              )}
            </div>

            {/* Badges/Tags */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
              {formData.bmi && (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100">
                  BMI {formData.bmi}
                </span>
              )}
              {formData.pcosStatus === 'yes' && (
                <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg border border-purple-100 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> PCOS Warrior
                </span>
              )}
              {formData.conditions.map(c => (
                c !== 'PCOS' && (
                  <span key={c} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg uppercase tracking-wider">
                    {c}
                  </span>
                )
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-white border border-primary/20 rounded-2xl p-6 shadow-lg relative">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Edit Details</h3>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                  <input type="number" value={formData.height} onChange={e => setFormData({ ...formData, height: e.target.value })} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                  <input type="number" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 ring-primary" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Conditions</label>
                  <div className="flex flex-wrap gap-2">
                    {["PCOS", "Endometriosis", "PMDD", "Fibroids"].map(c => (
                      <button key={c} type="button" onClick={() => handleConditionToggle(c)}
                        className={`px-4 py-2 rounded-lg border text-sm font-bold transition-all ${formData.conditions.includes(c) ? "bg-accent-purple text-white border-accent-purple" : "bg-white text-gray-500 border-gray-200"}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-light shadow-lg shadow-primary/20 flex items-center gap-2">
                  <Save className="w-5 h-5" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW Tabs (Segmented Control) */}
      <div className="flex bg-slate-100/80 p-1.5 rounded-2xl mb-8 overflow-x-auto no-scrollbar">
        {[
          { id: "profile", label: "Stats & Health" },
          { id: "history", label: "History" },
          { id: "data", label: "Data & Privacy" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm md:text-base transition-all whitespace-nowrap ${activeTab === tab.id
                ? "bg-white text-slate-800 shadow-sm ring-1 ring-black/5"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stats Tab */}
      {activeTab === "profile" && (
        <div className="animate-in fade-in zoom-in-95 duration-300">
          <ProfileStats cycles={cycles} symptoms={symptoms} wellness={wellness} />

          {/* Simple Graph Preview */}
          <div className="mt-8 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" /> Symptom Trends</h3>
            <div className="h-[200px] w-full">
              {symptoms.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={symptoms.slice(-14).reverse()}> {/* Last 14 entries */}
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={false} axisLine={false} />
                    <YAxis domain={[0, 10]} hide />
                    <Tooltip contentStyle={{ borderRadius: '12px' }} />
                    <Line type="monotone" dataKey="painLevel" stroke="#e11d48" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">No data to calculate trends yet.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <div className="space-y-4">
          {symptoms.length === 0 && cycles.length === 0 && (
            <div className="text-center py-10 text-gray-400">No history found. Start tracking!</div>
          )}

          {symptoms.map(s => (
            <div key={s.date} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-900">{new Date(s.date).toDateString()}</p>
                <p className="text-sm text-gray-500">{Object.keys(s.symptoms || {}).length} symptoms logged</p>
              </div>
              <div className="bg-red-50 text-red-600 px-3 py-1 rounded-lg font-bold text-sm">
                Pain: {s.painLevel}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Data Tab */}
      {activeTab === "data" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><Cloud className="w-5 h-5 text-blue-500" /> Cloud Sync</h3>
            <p className="text-sm text-gray-500 mb-4">Your data is securely stored in our encrypted cloud database (Firestore). You can access it from any device.</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 p-3 rounded-xl">
                <div className="text-2xl font-bold text-gray-900">{cycles.length}</div>
                <div className="text-xs text-gray-500 uppercase font-bold">Cycles</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <div className="text-2xl font-bold text-gray-900">{symptoms.length}</div>
                <div className="text-xs text-gray-500 uppercase font-bold">Logs</div>
              </div>
            </div>
          </div>

          <button onClick={handleExportData} className="w-full bg-white border-2 border-primary text-primary font-bold py-4 rounded-xl hover:bg-primary/5 transition-all flex items-center justify-center gap-2">
            <Download className="w-5 h-5" /> Export All Data (CSV)
          </button>

          <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
            <h3 className="font-bold text-red-700 mb-2 flex items-center gap-2"><Trash2 className="w-5 h-5" /> Danger Zone</h3>
            <p className="text-sm text-red-600/80 mb-4">Permanently delete your account and all associated data.</p>
            <button onClick={handleDeleteData} className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-all">
              Delete My Account & Data
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
