import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

interface CreditsContextValue {
  credits: number
  spend: (amount: number) => boolean
  addCredits: (amount: number) => void
}

const CreditsContext = createContext<CreditsContextValue | null>(null)

const STORAGE_KEY = 'aigen_credits'
const DEFAULT_CREDITS = 100

export function CreditsProvider({ children }: { children: ReactNode }) {
  const [credits, setCredits] = useState<number>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? parseInt(stored, 10) : DEFAULT_CREDITS
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, credits.toString())
  }, [credits])

  const spend = (amount: number): boolean => {
    if (credits < amount) return false
    setCredits(c => c - amount)
    return true
  }

  const addCredits = (amount: number) => {
    setCredits(c => c + amount)
  }

  return (
    <CreditsContext.Provider value={{ credits, spend, addCredits }}>
      {children}
    </CreditsContext.Provider>
  )
}

export function useCredits() {
  const ctx = useContext(CreditsContext)
  if (!ctx) throw new Error('useCredits must be used within CreditsProvider')
  return ctx
}
