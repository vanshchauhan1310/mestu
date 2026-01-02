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
  const { user, loading } = useAuth()
  const router = useRouter()
  const [appState, setAppState] = useState<'splash' | 'intro' | 'app'>('splash')
  const [view, setView] = useState<'screener' | 'dashboard'>('screener')
  const [riskData, setRiskData] = useState<any>(null)

  // Auth Protection Logic (Only check after intro)
  useEffect(() => {
    if (appState === 'app' && !loading && !user) {
      router.push("/login")
    }
  }, [user, loading, appState, router])

  if (appState === 'splash') {
    return <SplashScreen onFinish={() => setAppState('intro')} />
  }

  if (appState === 'intro') {
    return <IntroCarousel onFinish={() => setAppState('app')} />
  }

  if (loading) {
    return <div className="flex-1 flex items-center justify-center bg-white text-[#48A359] font-medium">Loading HEAL...</div>
  }

  if (!user) {
    return null // Will redirect
  }

  // Authenticated Area

  // Check if user already has risk data (optional, but good for UX)
  // For now, we'll start with screener as requested, but if we had the data we could skip it.

  const handleScreenerComplete = (results: any) => {
    setRiskData(results)
    setView('dashboard')
  }

  // Authenticated Area
  if (view === 'dashboard') {
    return <Dashboard riskData={riskData} />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 p-4">
        <PCOSScreener onComplete={handleScreenerComplete} />
      </main>
    </div>
  )
}
