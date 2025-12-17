"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle, Info } from "lucide-react"

// Mock Knowledge Base
const CONDITIONS_KB = [
    {
        id: "pcos",
        name: "PCOS (Polycystic Ovary Syndrome)",
        required: ["irregular_periods"],
        min_match: 2,
        symptoms: ["acne", "hirsutism", "weight_gain", "hair_loss", "pelvic_pain"]
    },
    {
        id: "endo",
        name: "Endometriosis",
        required: ["pelvic_pain"],
        min_match: 2,
        symptoms: ["painful_periods", "painful_intercourse", "heavy_bleeding", "fatigue", "nausea"]
    },
    {
        id: "pmdd",
        name: "PMDD (Premenstrual Dysphoric Disorder)",
        required: ["mood_swings"],
        min_match: 3,
        symptoms: ["depression", "anxiety", "irritability", "insomnia", "fatigue", "bloating"]
    }
]

const ALL_SYMPTOMS = [
    { id: "irregular_periods", label: "Irregular Periods" },
    { id: "pelvic_pain", label: "Chronic Pelvic Pain" },
    { id: "painful_periods", label: "Severe Period Cramps" },
    { id: "heavy_bleeding", label: "Heavy Bleeding" },
    { id: "mood_swings", label: "Severe Mood Swings" },
    { id: "acne", label: "Cystic Acne" },
    { id: "hirsutism", label: "Excess Hair Growth (Face/Body)" },
    { id: "weight_gain", label: "Unexplained Weight Gain" },
    { id: "hair_loss", label: "Hair Thinning/Loss" },
    { id: "painful_intercourse", label: "Painful Intercourse" },
    { id: "fatigue", label: "Extreme Fatigue" },
    { id: "depression", label: "Depression/Hopelessness" },
    { id: "anxiety", label: "Severe Anxiety" },
]

export default function AISymptomChecker() {
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
    const [results, setResults] = useState<any[]>([])
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    const toggleSymptom = (id: string) => {
        if (selectedSymptoms.includes(id)) {
            setSelectedSymptoms(selectedSymptoms.filter(s => s !== id))
        } else {
            setSelectedSymptoms([...selectedSymptoms, id])
        }
    }

    const analyzeSymptoms = () => {
        setIsAnalyzing(true)
        setTimeout(() => {
            const matches = CONDITIONS_KB.map(condition => {
                const matchedSymptoms = condition.symptoms.filter(s => selectedSymptoms.includes(s))
                const hasRequired = condition.required.some(r => selectedSymptoms.includes(r))
                const score = (matchedSymptoms.length + (hasRequired ? 1 : 0))

                // Simple Heuristic: Must have required symptom + at least min_match other symptoms
                const isMatch = hasRequired && matchedSymptoms.length >= condition.min_match

                return { ...condition, matchedSymptoms, isMatch, score }
            }).filter(c => c.isMatch).sort((a, b) => b.score - a.score)

            setResults(matches)
            setIsAnalyzing(false)
        }, 1500) // Fake AI delay
    }

    return (
        <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">🤖 AI Health Logic</h3>
                <p className="text-muted-foreground text-sm">Select your ongoing symptoms to run a preliminary check based on clinical guidelines. This is NOT a medical diagnosis.</p>
            </div>

            {/* Symptom Selection */}
            <div className="flex flex-wrap gap-3 mb-8">
                {ALL_SYMPTOMS.map(symptom => (
                    <button
                        key={symptom.id}
                        onClick={() => toggleSymptom(symptom.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-smooth border ${selectedSymptoms.includes(symptom.id)
                                ? "bg-primary text-white border-primary"
                                : "bg-white text-foreground border-border hover:border-primary/50"
                            }`}
                    >
                        {symptom.label}
                    </button>
                ))}
            </div>

            {/* Analyze Button */}
            <div className="flex justify-center mb-8">
                <button
                    onClick={analyzeSymptoms}
                    disabled={selectedSymptoms.length < 2 || isAnalyzing}
                    className={`px-8 py-3 rounded-lg font-bold text-white transition-smooth ${selectedSymptoms.length < 2
                            ? "bg-muted cursor-not-allowed"
                            : "bg-gradient-to-r from-primary to-accent-purple hover:opacity-90 shadow-lg"
                        }`}
                >
                    {isAnalyzing ? "Analyzing Patterns..." : "Run Analysis"}
                </button>
            </div>

            {/* Results */}
            {results.length > 0 && !isAnalyzing && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    <h4 className="font-semibold text-lg text-foreground">Analysis Results</h4>
                    {results.map(match => (
                        <div key={match.id} className="border-l-4 border-accent-red bg-accent-red/5 p-4 rounded-r-lg">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-accent-red flex-shrink-0 mt-1" />
                                <div>
                                    <h5 className="font-bold text-foreground">{match.name}</h5>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Your symptoms match common patterns for this condition.
                                    </p>
                                    <div className="mt-2 text-xs flex gap-2">
                                        {match.matchedSymptoms.map((s: string) => (
                                            <span key={s} className="px-2 py-1 bg-white rounded border border-accent-red/20 text-accent-red">
                                                {ALL_SYMPTOMS.find(as => as.id === s)?.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm flex gap-3 mt-4">
                        <Info className="w-5 h-5 flex-shrink-0" />
                        <p><strong>Disclaimer:</strong> This tool uses algorithmic pattern matching. It cannot diagnose you. Please consult a gynecologist for a proper evaluation.</p>
                    </div>
                </div>
            )}

            {/* No Results State */}
            {!isAnalyzing && results.length === 0 && selectedSymptoms.length > 0 && (
                <div className="text-center p-8 text-muted-foreground">
                    No specific clinical patterns detected based on these symptoms alone. Continue tracking!
                </div>
            )}
        </div>
    )
}
