"use client"

interface HomePageProps {
  user: any
  onNavigate: (page: string) => void
}

import HomeQuickActions from "./home-quick-actions"
import HomeInsights from "./home-insights"
import HomeHeroSection from "./home-hero-section"

export default function HomePage({ user, onNavigate }: HomePageProps) {
  return (
    <div className="max-w-md mx-auto pb-28 bg-gray-50/50 min-h-screen">

      {/* New Hero Section (Includes Greeting, Calendar, Stats, Weight, Forecast) */}
      <HomeHeroSection user={user} />

      <div className="px-4">
        {/* Insights */}
        <HomeInsights user={user} />

        {/* Quick Actions */}
        <HomeQuickActions onNavigate={onNavigate} />
      </div>
    </div>
  )
}
