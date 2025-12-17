"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
    const [isPresent, setIsPresent] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsPresent(false)
            setTimeout(onComplete, 500)
        }, 2500)

        return () => clearTimeout(timer)
    }, [onComplete])

    return (
        <AnimatePresence>
            {isPresent && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-green-50 via-green-100 to-emerald-50"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Glow */}
                    <motion.div
                        className="absolute h-72 w-72 rounded-full bg-green-300/30 blur-3xl"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 1 }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut",
                        }}
                    />

                    {/* Logo */}
                    <motion.div
                        className="relative flex flex-col items-center"
                        initial={{ scale: 0.9, opacity: 0, filter: "blur(10px)" }}
                        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <span className="text-6xl md:text-8xl font-bold tracking-wide text-green-700">
                            Saukhya
                        </span>

                        {/* Underline sweep */}
                        <motion.div
                            className="mt-4 h-1 w-24 rounded-full bg-green-600"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{
                                delay: 0.6,
                                duration: 0.8,
                                ease: "easeOut",
                            }}
                            style={{ transformOrigin: "left" }}
                        />

                        {/* Tagline (optional – remove if not needed) */}
                        <motion.span
                            className="mt-4 text-sm tracking-widest text-green-600/80 uppercase"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                        >
                            Wellness • Balance • Care
                        </motion.span>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
