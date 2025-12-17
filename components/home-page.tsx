"use client"

interface HomePageProps {
  user: any
  onNavigate: (page: string) => void
}

import HomeQuickStats from "./home-quick-stats"
import HomeQuickActions from "./home-quick-actions"
import HomeInsights from "./home-insights"
import HomeConditions from "./home-conditions"

export default function HomePage({ user, onNavigate }: HomePageProps) {
  return (
    <div className="max-w-md mx-auto px-4 py-6 pb-28">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
        <p className="text-sm text-muted-foreground">{user?.name || "Friend"}</p>
      </div>

      {/* Quick Stats */}
      <HomeQuickStats user={user} />

      {/* Conditions */}
      <HomeConditions user={user} />

      {/* Insights */}
      <HomeInsights user={user} />

      {/* Quick Actions */}
      <HomeQuickActions onNavigate={onNavigate} />
    </div>
  )
}
