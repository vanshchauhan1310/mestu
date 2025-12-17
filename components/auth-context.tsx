"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { type User, onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, onSnapshot } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

interface AuthContextType {
    user: User | null
    userData: any | null // Add userData to context
    loading: boolean
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    userData: null,
    loading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [userData, setUserData] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user)
            if (user) {
                try {
                    const docRef = doc(db, "users", user.uid)
                    const docSnap = await getDoc(docRef)
                    if (docSnap.exists()) {
                        setUserData(docSnap.data())
                    } else {
                        setUserData(null) // User exists in Auth but no profile in Firestore yet (needs onboarding)
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error)
                }
            } else {
                setUserData(null)
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    return (
        <AuthContext.Provider value={{ user, userData, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
