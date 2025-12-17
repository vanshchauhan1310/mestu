"use client"

import { useState, useEffect } from "react"
import ConsultationBooking from "./consultation-booking"
import ConsultationHistory from "./consultation-history"
import DoctorDirectory from "./doctor-directory"

interface GynecologistConsultationProps {
  user: any
}

export default function GynecologistConsultation({ user }: GynecologistConsultationProps) {
  const [activeTab, setActiveTab] = useState("book")
  const [consultations, setConsultations] = useState<any[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem("saukhya_consultations")
      if (saved) {
        setConsultations(JSON.parse(saved))
      }
    } catch (error) {
      console.log("[v0] Error loading consultations:", error)
    }
  }, [])

  const handleBookingComplete = (newConsultation: any) => {
    const updated = [...consultations, newConsultation]
    setConsultations(updated)
    try {
      localStorage.setItem("saukhya_consultations", JSON.stringify(updated))
    } catch (error) {
      console.log("[v0] Error saving consultation:", error)
    }
    setActiveTab("history")
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">👨‍⚕️ Gynecologist Consultation</h2>
        <p className="text-muted-foreground">Connect with qualified gynecologists for professional guidance</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-border overflow-x-auto">
        <button
          onClick={() => setActiveTab("book")}
          className={`px-4 py-3 font-semibold whitespace-nowrap transition-smooth border-b-2 ${
            activeTab === "book"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          📅 Book Consultation
        </button>
        <button
          onClick={() => setActiveTab("doctors")}
          className={`px-4 py-3 font-semibold whitespace-nowrap transition-smooth border-b-2 ${
            activeTab === "doctors"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          👩‍⚕️ Find Doctors
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-3 font-semibold whitespace-nowrap transition-smooth border-b-2 ${
            activeTab === "history"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          📋 My Consultations ({consultations.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-border shadow-sm p-6">
        {activeTab === "book" && <ConsultationBooking onBookingComplete={handleBookingComplete} user={user} />}
        {activeTab === "doctors" && <DoctorDirectory />}
        {activeTab === "history" && <ConsultationHistory consultations={consultations} />}
      </div>
    </div>
  )
}
