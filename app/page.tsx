"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-context"
import { useRouter } from "next/navigation"
import SplashScreen from "@/components/splash-screen"
import IntroCarousel from "@/components/intro-carousel" // Import Carousel
import PCOSScreener from "@/components/pcos-screener"
import Dashboard from "@/components/dashboard"
import { auth } from "@/lib/firebase"

export default function Page() {
  const { user, userData, loading } = useAuth()
  const router = useRouter()
  // detailed check: if user is logged in, skip splash/intro
  const [appState, setAppState] = useState<'splash' | 'intro' | 'app'>('splash')
  const [view, setView] = useState<'screener' | 'dashboard'>('screener')
  const [riskData, setRiskData] = useState<any>(null)

  // 1. Bypass Intro if already logged in
  useEffect(() => {
    if (!loading && user) {
      setAppState('app')
    }
  }, [user, loading])

  // 2. Auth Protection Logic
  useEffect(() => {
    if (appState === 'app' && !loading && !user) {
      router.push("/login")
    }
  }, [user, loading, appState, router])

  // 3. Check for existing risk data to skip screener
  useEffect(() => {
    if (user && userData?.pcosRisk) {
      setRiskData(userData)
      setView('dashboard')
    }
  }, [user, userData])

  if (loading) {
    return <div className="flex-1 flex items-center justify-center bg-white text-[#48A359] font-medium">Loading HEAL...</div>
  }

  // If we are authenticated, we forced 'app' state above, so we can skip splash/intro render logic if user is present
  if (appState === 'splash' && !user) {
    return <SplashScreen onFinish={() => setAppState('intro')} />
  }

  if (appState === 'intro' && !user) {
    return <IntroCarousel onFinish={() => setAppState('app')} />
  }

  if (!user) {
    return null // Will redirect logic handles this
  }

  // Authenticated Area

  const handleScreenerComplete = (results: any) => {
    setRiskData(results)
    setView('dashboard')
  }

  // Authenticated Area
  if (view === 'dashboard') {
    return <Dashboard riskData={riskData} />
  }

  return (
    <div className="h-full bg-gray-50 flex flex-col overflow-hidden">
      <main className="flex-1 flex flex-col overflow-hidden">
        <PCOSScreener onComplete={handleScreenerComplete} />
      </main>
    </div>
  )
}
