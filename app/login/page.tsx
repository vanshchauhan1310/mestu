"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import { useAuth } from "@/components/auth-context"
import { toast } from "sonner"
import Image from "next/image"

export default function LoginPage() {
    // Phone Auth State
    const [phoneNumber, setPhoneNumber] = useState("")
    const [otp, setOtp] = useState("")
    const [step, setStep] = useState<"PHONE" | "OTP">("PHONE")
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (user) {
            router.push("/")
        }
    }, [user, router])

    const handleSendOtp = async () => {
        if (!phoneNumber || phoneNumber.length < 10) {
            toast.error("Please enter a valid number")
            return
        }
        setLoading(true)
        // Simulate API call
        setTimeout(() => {
            setStep("OTP")
            toast.success("OTP sent! Use 123455")
            setLoading(false)
        }, 800)
    }

    const handleVerifyOtp = async () => {
        setLoading(true)
        try {
            if (otp !== "123455") {
                throw new Error("Invalid OTP")
            }

            // DUMMY FLOW: Log in as Guest/Anonymous
            const { signInAnonymously, createUserWithEmailAndPassword, signInWithEmailAndPassword } = await import("firebase/auth")

            try {
                await signInAnonymously(auth)
            } catch (anonErr: any) {
                // Return to Email/Pass if Anon is disabled
                const randomId = Math.floor(Math.random() * 1000000)
                const guestEmail = `guest_${randomId}@heal.com`
                const guestPass = "TestUser123!"
                try {
                    await createUserWithEmailAndPassword(auth, guestEmail, guestPass)
                } catch (e) {
                    // login if exists?
                }
            }

            toast.success("Successfully logged in!")
        } catch (error) {
            console.error(error)
            toast.error("Invalid OTP. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full bg-[#DCF5E6] flex items-center justify-center p-4">
            <div className="w-full max-w-[400px] bg-[#DCF5E6] md:bg-white md:p-8 md:rounded-3xl md:shadow-xl md:border md:border-green-50 transition-all">

                {/* Logo Section */}
                <div className="flex justify-center mb-12 mt-8 md:mt-0">
                    <div className="relative w-24 h-24">
                        <Image
                            src="/intro/intro.png"
                            alt="HEAL Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>

                {/* Content */}
                <h1 className="text-2xl font-serif font-bold text-[#1a4d2e] mb-8 tracking-wide">
                    {step === "PHONE" ? "Enter your number" : "Enter Verification Code"}
                </h1>

                {step === "PHONE" ? (
                    <div className="space-y-8">
                        {/* Styled Input Group */}
                        <div className="relative">
                            <label className="absolute -top-2.5 left-4 bg-[#DCF5E6] md:bg-white px-2 text-[#48A359] font-bold text-xs uppercase tracking-wider z-10 transition-colors">
                                Mobile Number
                            </label>
                            <div className="border border-[#48A359] rounded-xl overflow-hidden bg-transparent h-14 flex items-center px-4 relative">
                                <span className="text-gray-500 font-medium mr-2">+91</span>
                                <input
                                    type="tel"
                                    className="flex-1 bg-transparent border-none outline-none text-gray-800 font-medium text-lg placeholder-gray-400"
                                    placeholder="9876543210"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSendOtp}
                            disabled={loading}
                            className="w-full bg-[#40914d] text-white py-4 rounded-full font-bold text-lg shadow-lg hover:bg-[#347840] hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? "Sending..." : "Continue"}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="relative">
                            <label className="absolute -top-2.5 left-4 bg-[#DCF5E6] md:bg-white px-2 text-[#48A359] font-bold text-xs uppercase tracking-wider z-10 transition-colors">
                                OTP Code
                            </label>
                            <div className="border border-[#48A359] rounded-xl overflow-hidden bg-transparent h-14 flex items-center px-4 relative">
                                <input
                                    type="text"
                                    className="flex-1 bg-transparent border-none outline-none text-gray-800 font-medium text-lg placeholder-gray-400 text-center tracking-[0.5em]"
                                    placeholder="123455"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleVerifyOtp}
                            disabled={loading}
                            className="w-full bg-[#40914d] text-white py-4 rounded-full font-bold text-lg shadow-lg hover:bg-[#347840] hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? "Verifying..." : "Verify & Continue"}
                        </button>

                        <button
                            onClick={() => setStep("PHONE")}
                            className="w-full text-center text-sm text-[#40914d] font-bold hover:underline"
                        >
                            Change Number
                        </button>
                    </div>
                )}

                {/* Footer Terms */}
                <p className="text-center text-[10px] text-gray-500 mt-8 max-w-xs mx-auto leading-relaxed">
                    By clicking, I accept the <span className="font-bold text-gray-800">terms of service</span> and <span className="font-bold text-gray-800">privacy policy</span>
                </p>

                {/* Num pad placeholder visual for Mobile Feel (Optional, browser keyboard is better functionally, but keeping space empty at bottom mimics the design) */}
                <div className="h-20" />
            </div>
        </div>
    )
}
