"use client"

export default function HomeFeatures() {
  const features = [
    {
      icon: "📅",
      title: "Smart Period Tracking",
      description:
        "Log periods with flow intensity, predict cycles, and understand your patterns with AI-powered insights.",
    },
    {
      icon: "💭",
      title: "Comprehensive Symptom Logging",
      description: "Track physical and emotional symptoms, correlate them with your cycle, and identify triggers.",
    },
    {
      icon: "⚕️",
      title: "Connect with Gynecologists",
      description: "Book consultations, share your data with doctors, and get professional guidance in one place.",
    },
    {
      icon: "📚",
      title: "Condition-Specific Education",
      description: "Learn about PCOS, endometriosis, PMDD, and other conditions with evidence-based resources.",
    },
    {
      icon: "🏥",
      title: "Health Management Tools",
      description: "Exercise plans, nutrition guides, stress relief, and medication tracking tailored to your cycle.",
    },
    {
      icon: "👥",
      title: "Supportive Community",
      description: "Connect with others, share experiences, and find support in moderated forums and groups.",
    },
  ]

  return (
    <div className="py-16 md:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Everything You Need</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete platform designed specifically for managing difficult menstrual health conditions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white border border-border rounded-xl p-6 hover:shadow-lg transition-smooth">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
