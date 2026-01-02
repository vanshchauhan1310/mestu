"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"

const SLIDES = [
    {
        id: 1,
        image: "/intro/intro1.jpg",
        title: "Welcome to ",
        highlight: "Heal",
        text: "Your trusted companion for a healthier, happier you.",
        button: "Next",
    },
    {
        id: 2,
        image: "/intro/intro2.jpg",
        title: "Track Your ",
        highlight: "Health",
        text: "Cycles, symptoms, and wellness insights — everything you need, all in one place.",
        button: "Next",
    },
    {
        id: 3,
        image: "/intro/intro3.jpg",
        title: "Personalized ",
        highlight: "Insights",
        text: "Discover tailored recommendations built around your unique health patterns.",
        button: "Get Started",
    },
]

export default function IntroCarousel({ onFinish }: { onFinish: () => void }) {
    const [currentSlide, setCurrentSlide] = useState(0)

    const handleNext = () => {
        if (currentSlide < SLIDES.length - 1) {
            setCurrentSlide((prev) => prev + 1)
        } else {
            onFinish()
        }
    }

    const slide = SLIDES[currentSlide]

    return (
        <div className="fixed inset-0 z-40 bg-[#1a4d2e] md:bg-white flex flex-col md:items-center md:justify-center transition-colors duration-500">

            {/* --- MOBILE: Top Image Section --- */}
            <div className="flex-1 relative overflow-hidden w-full md:hidden">
                <div
                    className="absolute inset-0 bg-cover bg-top transition-all duration-500 ease-out"
                    style={{ backgroundImage: `url(${slide.image})` }}
                />
                <div className="absolute inset-bottom-0 w-full h-24 bg-gradient-to-t from-[#E5F9E9] to-transparent bottom-0"></div>
            </div>

            {/* --- LAPTOP: Centered Image --- */}
            <div className="hidden md:block relative w-[450px] h-[450px] mb-10 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-out hover:scale-105 transform"
                    style={{ backgroundImage: `url(${slide.image})` }}
                />
            </div>

            {/* --- CONTENT SECTION --- */}
            <div className="bg-[#E5F9E9] md:bg-transparent rounded-t-[2.5rem] md:rounded-none -mt-6 md:mt-0 relative z-10 px-8 pt-12 pb-10 md:p-0 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-none min-h-[35%] md:min-h-0 flex flex-col items-center text-center w-full md:max-w-xl">

                {/* Title */}
                <h2 className="text-3xl font-serif font-bold text-[#1a4d2e] mb-4 tracking-wide md:text-4xl">
                    {slide.title}
                    <span className="text-[#48A359]">
                        {slide.highlight}
                    </span>
                </h2>

                {/* Text */}
                <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-[80%] mx-auto md:text-base md:max-w-lg">
                    {slide.text}
                </p>

                {/* Dots Indicator */}
                <div className="flex gap-2 mb-8">
                    {SLIDES.map((_, idx) => (
                        <div
                            key={idx}
                            className={`nav-dot w-2 h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? "bg-[#48A359] w-6" : "bg-gray-300"}`}
                        />
                    ))}
                </div>

                {/* Button */}
                <button
                    onClick={handleNext}
                    className="w-full max-w-xs bg-[#48A359] text-white py-4 rounded-full font-bold text-lg shadow-lg hover:bg-[#3d8b4b] transition-all flex items-center justify-center gap-2 group md:w-full md:py-3"
                >
                    {slide.button}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

            </div>
        </div>
    )
}
