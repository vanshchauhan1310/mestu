"use client"

import { useState } from "react"

export default function DoctorDirectory() {
  const [selectedSpecialty, setSelectedSpecialty] = useState("all")

  const doctors = [
    {
      id: 1,
      name: "Dr. Priya Sharma",
      specialty: "General Gynecology",
      experience: "12 years",
      rating: 4.8,
      reviews: 156,
      languages: ["English", "Hindi"],
      availability: "Mon-Fri, 10 AM - 6 PM",
      consultationFee: "₹500",
      bio: "Specialized in comprehensive women's health and preventive care.",
    },
    {
      id: 2,
      name: "Dr. Anjali Patel",
      specialty: "Reproductive Health",
      experience: "8 years",
      rating: 4.9,
      reviews: 203,
      languages: ["English", "Gujarati"],
      availability: "Tue-Sat, 11 AM - 7 PM",
      consultationFee: "₹600",
      bio: "Expert in fertility planning and reproductive health management.",
    },
    {
      id: 3,
      name: "Dr. Meera Singh",
      specialty: "PCOS Specialist",
      experience: "10 years",
      rating: 4.7,
      reviews: 189,
      languages: ["English", "Hindi", "Punjabi"],
      availability: "Mon-Thu, 9 AM - 5 PM",
      consultationFee: "₹550",
      bio: "Specialized in PCOS management and hormonal health.",
    },
    {
      id: 4,
      name: "Dr. Kavya Desai",
      specialty: "Endometriosis Expert",
      experience: "9 years",
      rating: 4.8,
      reviews: 142,
      languages: ["English", "Marathi"],
      availability: "Wed-Sun, 2 PM - 8 PM",
      consultationFee: "₹600",
      bio: "Dedicated to endometriosis diagnosis and pain management.",
    },
    {
      id: 5,
      name: "Dr. Neha Gupta",
      specialty: "Fertility Specialist",
      experience: "11 years",
      rating: 4.9,
      reviews: 267,
      languages: ["English", "Hindi"],
      availability: "Mon-Sat, 10 AM - 6 PM",
      consultationFee: "₹700",
      bio: "Expert in fertility treatments and family planning.",
    },
    {
      id: 6,
      name: "Dr. Ritu Verma",
      specialty: "General Gynecology",
      experience: "7 years",
      rating: 4.6,
      reviews: 98,
      languages: ["English", "Hindi"],
      availability: "Tue-Fri, 3 PM - 9 PM",
      consultationFee: "₹450",
      bio: "Compassionate care for all gynecological concerns.",
    },
  ]

  const specialties = [
    "all",
    "General Gynecology",
    "Reproductive Health",
    "PCOS Specialist",
    "Endometriosis Expert",
    "Fertility Specialist",
  ]

  const filteredDoctors =
    selectedSpecialty === "all" ? doctors : doctors.filter((doc) => doc.specialty === selectedSpecialty)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Filter by Specialty</h3>
        <div className="flex flex-wrap gap-2">
          {specialties.map((specialty) => (
            <button
              key={specialty}
              onClick={() => setSelectedSpecialty(specialty)}
              className={`px-4 py-2 rounded-full font-semibold transition-smooth ${
                selectedSpecialty === specialty
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-foreground hover:bg-gray-200"
              }`}
            >
              {specialty === "all" ? "All Doctors" : specialty}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="border border-border rounded-lg p-6 hover:shadow-lg transition-smooth">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-foreground">{doctor.name}</h4>
                <p className="text-sm text-primary font-semibold">{doctor.specialty}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end mb-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className="font-semibold text-foreground">{doctor.rating}</span>
                </div>
                <p className="text-xs text-muted-foreground">({doctor.reviews} reviews)</p>
              </div>
            </div>

            <p className="text-sm text-foreground mb-4">{doctor.bio}</p>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">📅</span>
                <span className="text-foreground">{doctor.experience} experience</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">🕐</span>
                <span className="text-foreground">{doctor.availability}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">💬</span>
                <span className="text-foreground">{doctor.languages.join(", ")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">💰</span>
                <span className="font-semibold text-foreground">{doctor.consultationFee}</span>
              </div>
            </div>

            <button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-lg transition-smooth">
              Book Consultation
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
