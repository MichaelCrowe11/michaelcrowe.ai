"use client"

import { useState, useEffect, lazy, Suspense } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { HeroClean } from "@/components/hero-clean"
import { ServicesClean } from "@/components/services-clean"

// Lazy load heavy components
const CosmosIntro = lazy(() => import("@/components/cosmos-intro-enhanced").then(m => ({ default: m.CosmosIntro })))

export default function Home() {
  const [showIntro, setShowIntro] = useState(true)
  const [introComplete, setIntroComplete] = useState(false)

  useEffect(() => {
    // Check if user has seen intro in this session
    const hasSeenIntro = sessionStorage.getItem("hasSeenCosmosIntro")
    if (hasSeenIntro) {
      setShowIntro(false)
      setIntroComplete(true)
    }
  }, [])

  const handleIntroComplete = () => {
    sessionStorage.setItem("hasSeenCosmosIntro", "true")
    setIntroComplete(true)
    setTimeout(() => {
      setShowIntro(false)
    }, 500)
  }

  return (
    <ErrorBoundary>
      {/* Cosmic Intro - First time only */}
      {showIntro && (
        <Suspense fallback={<div className="fixed inset-0 bg-black flex items-center justify-center"><div className="text-white">Initializing...</div></div>}>
          <CosmosIntro onComplete={handleIntroComplete} />
        </Suspense>
      )}

      {/* Main site content - shown after intro */}
      {introComplete && (
        <main className="min-h-screen">
          {/* Clean, minimal, beautiful sections */}
          <HeroClean />
          <ServicesClean />
        </main>
      )}
    </ErrorBoundary>
  )
}
