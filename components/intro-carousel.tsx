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
        <div className="flex-1 bg-white flex flex-col items-center p-6 pt-12 transition-colors duration-500">
            {/* Image Section */}
            <div className="relative w-full aspect-square mb-10 rounded-[3rem] overflow-hidden shadow-xl transition-all duration-500">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-out"
                    style={{ backgroundImage: `url(${slide.image})` }}
                />
                {/* Subtle sparkle icon in corner like in image */}
                <div className="absolute bottom-4 right-4 text-white/50">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                    </svg>
                </div>
            </div>

            {/* CONTENT SECTION */}
            <div className="flex-1 flex flex-col items-center text-center w-full">
                {/* Title */}
                <h2 className="text-3xl font-serif font-bold text-[#1a4d2e] mb-2 tracking-tight">
                    {slide.title}
                    <span className="text-[#48A359]">
                        {slide.highlight}
                    </span>
                </h2>

                {/* Text */}
                <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-[90%]">
                    {slide.text}
                </p>

                {/* Dots Indicator */}
                <div className="flex gap-2 mb-10">
                    {SLIDES.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? "bg-[#48A359] w-6" : "bg-gray-200 w-1.5"}`}
                        />
                    ))}
                </div>

                {/* Button */}
                <button
                    onClick={handleNext}
                    className="w-full bg-[#48A359] text-white py-4 rounded-full font-bold text-lg shadow-lg shadow-green-200 hover:bg-[#3d8b4b] transition-all flex items-center justify-center gap-2 group mt-auto mb-4"
                >
                    {slide.button}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    )
}
