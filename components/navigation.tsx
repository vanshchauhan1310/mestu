"use client"

import { useState } from "react"

interface NavigationProps {
  currentPage: string
  setCurrentPage: (page: string) => void
  user: any
}

export default function Navigation({ currentPage, setCurrentPage, user }: NavigationProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "period-tracker", label: "Period", icon: "📅" },
    { id: "symptoms", label: "Symptoms", icon: "💭" },
    { id: "health-tools", label: "Health", icon: "🏥" },
    { id: "consultation", label: "Consult", icon: "👨‍⚕️" },
    { id: "content", label: "Learn", icon: "📚" },
    { id: "community", label: "Community", icon: "👥" },
    { id: "profile", label: "Profile", icon: "👤" },
  ]

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-primary text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-primary font-bold text-lg">S</span>
            </div>
            <h1 className="text-xl font-bold">Saukhya</h1>
          </div>
          <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden text-white text-2xl">
            ☰
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      {showMobileMenu && (
        <nav className="md:hidden bg-primary-light text-white p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id)
                setShowMobileMenu(false)
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition-smooth ${
                currentPage === item.id ? "bg-primary text-white" : "hover:bg-primary/20"
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      )}

      {/* Desktop Navigation */}
      <nav className="hidden md:flex bg-primary-light text-white shadow-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto w-full flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex-1 px-4 py-3 text-center transition-smooth border-b-2 ${
                currentPage === item.id ? "border-white bg-primary" : "border-transparent hover:bg-primary/20"
              }`}
            >
              <span className="mr-1">{item.icon}</span>
              <span className="hidden lg:inline">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  )
}
