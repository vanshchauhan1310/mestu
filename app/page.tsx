"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-context"
import { useRouter } from "next/navigation"
import SplashScreen from "@/components/splash-screen"
import IntroCarousel from "@/components/intro-carousel" // Import Carousel
import PCOSScreener from "@/components/pcos-screener"
import { auth } from "@/lib/firebase"

export default function Page() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [appState, setAppState] = useState<'splash' | 'intro' | 'app'>('splash')

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
    return <div className="flex items-center justify-center min-h-screen bg-gray-50 text-[#368241]">Loading HEAL...</div>
  }

  if (!user) {
    return null // Will redirect
  }

  // Authenticated Area
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Simple Header */}


      <main className="flex-1 p-4">
        <PCOSScreener />
      </main>
    </div>
  )
}
