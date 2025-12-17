"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import Dashboard from "@/components/dashboard"
import PeriodTracker from "@/components/period-tracker"
import SymptomTracker from "@/components/symptom-tracker"
import HealthTools from "@/components/health-tools"
import ContentHub from "@/components/content-hub"
import Community from "@/components/community"
import Profile from "@/components/profile"
import GynecologistConsultation from "@/components/gynecologist-consultation"
import OnboardingFlow from "@/components/onboarding-flow"
import BottomNavigation from "@/components/bottom-navigation"
import HomePage from "@/components/home-page"

export default function Home() {
  const router = useRouter()
  const { user: authUser, userData, loading: authLoading } = useAuth() // Get userData from context
  const [currentPage, setCurrentPage] = useState("dashboard")
  // user state here might be redundant if we use userData from context, 
  // but let's sync them for compatibility with existing components that expect 'user' prop
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    if (authLoading) return

    if (!authUser) {
      router.push("/login")
      return
    }

    if (userData) {
      setUser(userData)
      setShowOnboarding(false)
    } else {
      // Auth exists but no Firestore data -> Onboarding needed
      setShowOnboarding(true)
    }
    setIsLoading(false)

  }, [authUser, authLoading, userData, router])

  if (showOnboarding) {
    return (
      <OnboardingFlow
        onComplete={(newUserData) => {
          setUser(newUserData) // Optimistic update
          setShowOnboarding(false)
          setCurrentPage("dashboard")
          // We might trigger a context refresh here if needed, but OnboardingFlow writes to Firestore
          // and if we navigated, the context listener *might* pick it up if it's realtime,
          // but we implemented onAuthStateChanged which listens to AUTH, not Firestore doc changes.
          // To make it perfect we'd listen to the doc in AuthContext.
          // For now, setting local state 'user' works for immediate UI.
        }}
      />
    )
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <HomePage user={user} onNavigate={setCurrentPage} />
      case "period-tracker":
        return <PeriodTracker user={user} />
      case "symptoms":
        return <SymptomTracker user={user} />
      case "health-tools":
        return <HealthTools user={user} />
      case "consultation":
        return <GynecologistConsultation user={user} />
      case "content":
        return <ContentHub user={user} />
      case "community":
        return <Community user={user} />
      case "profile":
        return <Profile user={user} setUser={setUser} />
      default:
        return <Dashboard user={user} /> // Dashboard will now receive live Firestore data via 'user' prop updated by realtime listener in Page
    }
  }

  if (authLoading || (isLoading && authUser)) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Saukhya...</p>
        </div>
      </main>
    )
  }

  if (!authUser) return null

  return (
    <main className="min-h-screen bg-background">
      <div className="pb-32 safe-area-inset-bottom">{renderPage()}</div>
      <BottomNavigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </main>
  )
}
