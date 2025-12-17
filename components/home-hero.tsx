"use client"

export default function HomeHero() {
  return (
    <div className="bg-gradient-to-br from-primary via-primary-light to-primary/80 text-white py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Take Control of Your Difficult Periods
            </h1>
            <p className="text-lg text-white/90 mb-8">
              Saukhya is built specifically for people with PCOS, endometriosis, PMDD, and other complex menstrual
              conditions. Track, understand, and manage your health with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-primary hover:bg-white/90 font-semibold py-3 px-8 rounded-lg transition-smooth">
                Start Free
              </button>
              <button className="border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-lg transition-smooth">
                Learn More
              </button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl">📊</div>
                  <div>
                    <div className="font-semibold">Track Everything</div>
                    <div className="text-sm text-white/70">Periods, symptoms, pain, mood</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl">🧠</div>
                  <div>
                    <div className="font-semibold">Get Insights</div>
                    <div className="text-sm text-white/70">Predictions & patterns</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl">👥</div>
                  <div>
                    <div className="font-semibold">Find Support</div>
                    <div className="text-sm text-white/70">Community & professionals</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
