"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        // Show splash for 2.5 seconds, then fade out
        const timer = setTimeout(() => {
            setVisible(false)
            setTimeout(onFinish, 500) // Wait for fade transition
        }, 2500)
        return () => clearTimeout(timer)
    }, [onFinish])

    if (!visible) return null

    return (
        <div className={`fixed inset-0 z-50 bg-white flex flex-col items-center justify-center transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="relative w-48 h-48 animate-pulse">
                <Image
                    src="/intro/intro.png"
                    alt="HEAL Logo"
                    fill
                    className="object-contain"
                    priority
                />
            </div>
        </div>
    )
}
