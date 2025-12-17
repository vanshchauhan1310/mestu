"use client"

import { useState } from "react"

interface OnboardingFlowProps {
  onComplete: (userData: any) => void
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0)
  const [userData, setUserData] = useState({
    name: "",
    age: "",
    cycleLength: "28",
    periodDuration: "5",
    flowIntensity: "moderate",
    lastPeriodDate: "",
    conditions: [] as string[],
    symptoms: [] as string[],
    painLevel: "5",
    goals: [] as string[],
  })

  const conditions = [
    { id: "pcos", label: "PCOS", icon: "🔬" },
    { id: "endometriosis", label: "Endometriosis", icon: "⚕️" },
    { id: "pmdd", label: "PMDD", icon: "🧠" },
    { id: "fibroids", label: "Fibroids", icon: "💔" },
    { id: "adenomyosis", label: "Adenomyosis", icon: "🩺" },
    { id: "heavy-bleeding", label: "Heavy Bleeding", icon: "🩸" },
    { id: "irregular", label: "Irregular Cycles", icon: "📊" },
    { id: "none", label: "Not Diagnosed", icon: "❓" },
  ]

  const symptoms = [
    "Severe cramping",
    "Heavy bleeding",
    "Fatigue",
    "Mood changes",
    "Bloating",
    "Headaches",
    "Nausea",
    "Back pain",
    "Brain fog",
    "Acne",
  ]

  const goals = [
    "Track symptoms to discuss with doctor",
    "Manage pain better",
    "Understand my cycle patterns",
    "Find community support",
    "Learn about my condition",
    "Improve overall wellbeing",
  ]

  const handleConditionToggle = (conditionId: string) => {
    setUserData((prev) => ({
      ...prev,
      conditions: prev.conditions.includes(conditionId)
        ? prev.conditions.filter((c) => c !== conditionId)
        : [...prev.conditions, conditionId],
    }))
  }

  const handleSymptomToggle = (symptom: string) => {
    setUserData((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter((s) => s !== symptom)
        : [...prev.symptoms, symptom],
    }))
  }

  const handleGoalToggle = (goal: string) => {
    setUserData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal) ? prev.goals.filter((g) => g !== goal) : [...prev.goals, goal],
    }))
  }

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1)
    } else {
      localStorage.setItem("saukhya_user", JSON.stringify(userData))
      localStorage.setItem("saukhya_onboarding_complete", "true")
      onComplete(userData)
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const progressPercent = ((step + 1) / 7) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Progress Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">Welcome to Saukhya</h2>
            <span className="text-sm text-muted-foreground">Step {step + 1} of 7</span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-6">🌿</div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Welcome to Saukhya</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Your comprehensive companion for managing difficult menstrual health. Let's get to know you better.
            </p>
            <button
              onClick={handleNext}
              className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-8 rounded-lg transition-smooth"
            >
              Get Started
            </button>
          </div>
        )}

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">What's your name?</label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">How old are you?</label>
              <input
                type="number"
                value={userData.age}
                onChange={(e) => setUserData({ ...userData, age: e.target.value })}
                placeholder="Enter your age"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        )}

        {/* Step 2: Cycle Info */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Average cycle length (days)</label>
              <input
                type="number"
                value={userData.cycleLength}
                onChange={(e) => setUserData({ ...userData, cycleLength: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Average period duration (days)</label>
              <input
                type="number"
                value={userData.periodDuration}
                onChange={(e) => setUserData({ ...userData, periodDuration: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Last period start date</label>
              <input
                type="date"
                value={userData.lastPeriodDate}
                onChange={(e) => setUserData({ ...userData, lastPeriodDate: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">Flow intensity</label>
              <div className="grid grid-cols-2 gap-3">
                {["light", "moderate", "heavy", "very-heavy"].map((intensity) => (
                  <button
                    key={intensity}
                    onClick={() => setUserData({ ...userData, flowIntensity: intensity })}
                    className={`py-3 px-4 rounded-lg font-medium transition-smooth ${
                      userData.flowIntensity === intensity
                        ? "bg-primary text-white"
                        : "bg-border text-foreground hover:bg-border/80"
                    }`}
                  >
                    {intensity.charAt(0).toUpperCase() + intensity.slice(1).replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Conditions */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Do you have any diagnosed conditions?</h3>
              <p className="text-sm text-muted-foreground mb-6">Select all that apply</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {conditions.map((condition) => (
                <button
                  key={condition.id}
                  onClick={() => handleConditionToggle(condition.id)}
                  className={`p-4 rounded-lg border-2 transition-smooth text-center ${
                    userData.conditions.includes(condition.id)
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-2xl mb-2">{condition.icon}</div>
                  <div className="text-sm font-medium text-foreground">{condition.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Symptoms */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">What symptoms do you experience?</h3>
              <p className="text-sm text-muted-foreground mb-6">Select all that apply</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {symptoms.map((symptom) => (
                <button
                  key={symptom}
                  onClick={() => handleSymptomToggle(symptom)}
                  className={`p-3 rounded-lg border-2 transition-smooth text-left ${
                    userData.symptoms.includes(symptom)
                      ? "border-accent-warm bg-accent-warm/10"
                      : "border-border hover:border-accent-warm/50"
                  }`}
                >
                  <div className="text-sm font-medium text-foreground">{symptom}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Pain Level */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">What's your typical pain level?</h3>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">No pain</span>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={userData.painLevel}
                  onChange={(e) => setUserData({ ...userData, painLevel: e.target.value })}
                  className="flex-1 h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <span className="text-sm text-muted-foreground">Severe pain</span>
              </div>
              <div className="text-center mt-4">
                <div className="text-4xl font-bold text-primary">{userData.painLevel}</div>
                <div className="text-sm text-muted-foreground">out of 10</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Goals */}
        {step === 6 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">What are your goals?</h3>
              <p className="text-sm text-muted-foreground mb-6">Select all that apply</p>
            </div>
            <div className="space-y-3">
              {goals.map((goal) => (
                <button
                  key={goal}
                  onClick={() => handleGoalToggle(goal)}
                  className={`w-full p-4 rounded-lg border-2 transition-smooth text-left ${
                    userData.goals.includes(goal)
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-sm font-medium text-foreground">{goal}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-12">
          {step > 0 && (
            <button
              onClick={handleBack}
              className="flex-1 bg-border hover:bg-border/80 text-foreground font-semibold py-3 px-4 rounded-lg transition-smooth"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-lg transition-smooth"
          >
            {step === 6 ? "Complete Setup" : "Next"}
          </button>
        </div>
      </div>
    </div>
  )
}
