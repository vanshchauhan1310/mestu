"use client"

import { useState, useMemo } from "react"
import { ArrowLeft, CheckCircle, Info, Stethoscope, AlertTriangle, ArrowRight } from "lucide-react"
import { doc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "./auth-context"

// --- TYPES ---
type Option = { label: string; score: number }
type Question = {
    id: string;
    text: string;
    options: Option[]
    sectionId?: string
    sectionTitle?: string
}
type Section = {
    id: string;
    title: string;
    subtitle: string;
    questions: Question[];
    maxScore: number;
}

// --- DATA ---
const SECTIONS: Section[] = [
    {
        id: "A",
        title: "Menstrual Cycle Pattern",
        subtitle: "Core Domain",
        maxScore: 9,
        questions: [
            {
                id: "Q1",
                text: "How long is your usual menstrual cycle?",
                options: [
                    { label: "Less than 21 days", score: 0 },
                    { label: "21–34 days", score: 0 },
                    { label: "35–45 days", score: 2 },
                    { label: "More than 45 days", score: 3 },
                    { label: "Periods come very irregularly", score: 3 }
                ]
            },
            {
                id: "Q2",
                text: "In the last 12 months, how many periods did you have?",
                options: [
                    { label: "10–12", score: 0 },
                    { label: "8–9", score: 1 },
                    { label: "6–7", score: 2 },
                    { label: "Fewer than 6", score: 3 }
                ]
            },
            {
                id: "Q3",
                text: "Do you often miss periods for 2 months or more?",
                options: [
                    { label: "No", score: 0 },
                    { label: "Sometimes", score: 1 },
                    { label: "Frequently", score: 3 }
                ]
            }
        ]
    },
    {
        id: "B",
        title: "Androgen-Related Symptoms",
        subtitle: "Physical Signs",
        maxScore: 8,
        questions: [
            {
                id: "Q4",
                text: "Have you noticed excess hair growth (chin, lip, chest, etc)?",
                options: [
                    { label: "No", score: 0 },
                    { label: "Mild", score: 1 },
                    { label: "Moderate", score: 2 },
                    { label: "Severe", score: 3 }
                ]
            },
            {
                id: "Q5",
                text: "Do you have persistent acne after age 18?",
                options: [
                    { label: "No", score: 0 },
                    { label: "Mild", score: 1 },
                    { label: "Moderate", score: 2 },
                    { label: "Severe", score: 3 }
                ]
            },
            {
                id: "Q6",
                text: "Have you experienced noticeable scalp hair thinning?",
                options: [
                    { label: "No", score: 0 },
                    { label: "Mild", score: 1 },
                    { label: "Moderate", score: 2 }
                ]
            }
        ]
    },
    {
        id: "C",
        title: "Metabolic Risk",
        subtitle: "Health Indicators",
        maxScore: 6,
        questions: [
            {
                id: "Q7",
                text: "Have you experienced unexplained rapid weight gain recently?",
                options: [
                    { label: "No", score: 0 },
                    { label: "Yes", score: 2 }
                ]
            },
            {
                id: "Q8",
                text: "Do you often feel fatigued or crave sugar?",
                options: [
                    { label: "No", score: 0 },
                    { label: "Sometimes", score: 1 },
                    { label: "Frequently", score: 2 }
                ]
            },
            {
                id: "Q9",
                text: "Family history of PCOS, diabetes, or thyroid issues?",
                options: [
                    { label: "No", score: 0 },
                    { label: "Yes", score: 2 }
                ]
            }
        ]
    },
    {
        id: "D",
        title: "Quality of Life",
        subtitle: "Daily Impact",
        maxScore: 5,
        questions: [
            {
                id: "Q10",
                text: "How much have these issues affected your daily life?",
                options: [
                    { label: "Not at all", score: 0 },
                    { label: "Mildly", score: 1 },
                    { label: "Moderately", score: 2 },
                    { label: "Severely", score: 3 }
                ]
            },
            {
                id: "Q11",
                text: "Do you experience mood changes linked to your cycle?",
                options: [
                    { label: "No", score: 0 },
                    { label: "Sometimes", score: 1 },
                    { label: "Often", score: 2 }
                ]
            }
        ]
    }
]

export default function PCOSScreener() {
    const { user } = useAuth()

    // Flatten questions
    const allQuestions = useMemo(() => {
        return SECTIONS.flatMap(section =>
            section.questions.map(q => ({
                ...q,
                sectionId: section.id,
                sectionTitle: section.title
            }))
        )
    }, [])

    const [viewState, setViewState] = useState<'intro' | 'questions' | 'results'>('intro')
    const [currentQIndex, setCurrentQIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<string, { label: string, score: number }>>({})
    const [saving, setSaving] = useState(false)
    const [animating, setAnimating] = useState(false)

    const handleAnswer = (option: Option) => {
        if (animating) return

        setAnswers(prev => ({ ...prev, [allQuestions[currentQIndex].id]: option }))

        // Auto advance
        setAnimating(true)
        setTimeout(() => {
            if (currentQIndex < allQuestions.length - 1) {
                setCurrentQIndex(prev => prev + 1)
                setAnimating(false)
            } else {
                finishAssessment()
            }
        }, 250)
    }

    const finishAssessment = async () => {
        setSaving(true)
        const results = calculateResults()
        if (user) {
            // Save to Firebase
            try {
                const screeningId = `pcos_${Date.now()}`
                await setDoc(doc(db, "users", user.uid, "screenings", screeningId), {
                    completedAt: new Date().toISOString(),
                    answers,
                    results,
                    version: "1.0"
                })
                await setDoc(doc(db, "users", user.uid), {
                    pcosRisk: results.riskCategory,
                    lastScreening: new Date().toISOString()
                }, { merge: true })
            } catch (e) {
                console.error(e)
            }
        }
        setSaving(false)
        setViewState('results')
        setAnimating(false)
    }

    const calculateResults = () => {
        let totalScore = 0
        let sectionScores: Record<string, number> = {}

        SECTIONS.forEach(sec => {
            let secScore = 0
            sec.questions.forEach(q => {
                secScore += (answers[q.id]?.score || 0)
            })
            sectionScores[sec.id] = secScore
            totalScore += secScore
        })

        let riskCategory = "Low Risk"
        let action = "Lifestyle guidance + monitoring"

        if (totalScore >= 14) {
            riskCategory = "High Risk"
            action = "HEAL + gynecologist referral"
        } else if (totalScore >= 7) {
            riskCategory = "Moderate Risk"
            action = "3-month HEAL guided journey"
        }

        return { totalScore, sectionScores, riskCategory, action }
    }

    // --- VIEWS ---

    if (viewState === 'intro') {
        return (
            <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded-3xl shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Stethoscope className="w-8 h-8 text-[#368241]" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">PCOS Risk Screener</h1>
                <p className="text-gray-500 mb-8 leading-relaxed">
                    Answer 11 quick questions to understand your menstrual health profile.
                </p>

                <div className="bg-amber-50 p-4 rounded-xl text-left flex gap-3 border border-amber-100 mb-8">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <p className="text-xs text-amber-800 leading-tight">
                        <strong>Disclaimer:</strong> This is an educational screening tool, not a medical diagnosis. Consult a doctor for professional advice.
                    </p>
                </div>

                <button
                    onClick={() => setViewState('questions')}
                    className="w-full bg-[#368241] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#2d6a35] transition-all"
                >
                    Start Assessment
                </button>
            </div>
        )
    }

    if (viewState === 'questions') {
        const currentQ = allQuestions[currentQIndex]
        const percent = ((currentQIndex + 1) / allQuestions.length) * 100

        return (
            <div className="max-w-lg mx-auto min-h-screen bg-white md:bg-gray-50 flex flex-col">
                {/* Header / Progress */}
                <div className="pt-6 pb-6 px-6 bg-white sticky top-0 z-10">
                    <div className="relative flex items-center justify-center mb-6">
                        <button
                            onClick={() => currentQIndex > 0 ? setCurrentQIndex(i => i - 1) : setViewState('intro')}
                            className="absolute left-0 p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <span className="text-[#368241] font-bold text-lg tracking-widest">
                            {currentQIndex + 1}<span className="text-gray-300 text-sm font-normal">/</span>{allQuestions.length}
                        </span>
                    </div>

                    {/* Thick Progress Bar */}
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#368241] rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${percent}%` }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <div className="flex-1 px-6 py-4 flex flex-col max-w-md mx-auto w-full">
                    <div className={`transition-all duration-300 ${animating ? 'opacity-0 translate-x-4' : 'opacity-100'}`}>

                        <h2 className="text-xl md:text-2xl font-medium text-gray-900 text-left mb-10 leading-snug">
                            {currentQ.text}
                        </h2>

                        <div className="space-y-4">
                            {currentQ.options.map(opt => {
                                const isSelected = answers[currentQ.id]?.label === opt.label
                                return (
                                    <button
                                        key={opt.label}
                                        onClick={() => handleAnswer(opt)}
                                        className={`w-full p-4.5 rounded-2xl border-2 text-left transition-all duration-200 flex items-center justify-between group
                                        ${isSelected
                                                ? "border-[#368241] bg-[#DCF5E6] text-[#1a4d2e]"
                                                : "border-green-600/30 bg-white text-gray-700 hover:border-[#368241] hover:bg-green-50"
                                            }
                                    `}
                                    >
                                        <span className="font-medium text-base">
                                            {opt.label}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>


            </div>
        )
    }

    if (viewState === 'results') {
        const { totalScore, riskCategory, action } = calculateResults()
        let color = "bg-green-100 text-green-800"
        if (riskCategory.includes("Moderate")) color = "bg-orange-100 text-orange-800"
        if (riskCategory.includes("High")) color = "bg-red-100 text-red-800"

        if (saving) return <div className="min-h-screen flex items-center justify-center">Saving...</div>

        return (
            <div className="max-w-md mx-auto p-6 mt-8 bg-white rounded-3xl shadow-sm border border-gray-100 text-center">
                <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide mb-6 ${color}`}>
                    {riskCategory}
                </span>

                <h1 className="text-5xl font-black text-gray-900 mb-2">{totalScore}</h1>
                <p className="text-gray-500 mb-8 font-medium">Risk Score (out of 28)</p>

                <div className="bg-[#368241] p-6 rounded-2xl text-white mb-8 shadow-lg shadow-green-900/20">
                    <h3 className="font-bold text-green-100 text-xs uppercase tracking-widest mb-2">Recommended Action</h3>
                    <p className="text-xl font-bold">{action}</p>
                </div>

                <button
                    onClick={() => window.location.reload()}
                    className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold"
                >
                    Start New Screening
                </button>
            </div>
        )
    }

    return null
}
