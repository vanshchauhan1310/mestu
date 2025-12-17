"use client"

export default function HomeCTA() {
  return (
    <div className="bg-gradient-to-r from-primary to-primary-light text-white py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Take Control?</h2>
        <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
          Join thousands of people managing their menstrual health with Saukhya. Start tracking today, completely free.
        </p>
        <button className="bg-white text-primary hover:bg-white/90 font-semibold py-4 px-10 rounded-lg transition-smooth text-lg">
          Get Started Now
        </button>
      </div>
    </div>
  )
}
