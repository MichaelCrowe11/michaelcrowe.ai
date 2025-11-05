"use client"

import { useState, useEffect, lazy, Suspense } from "react"
import { useRouter } from "next/navigation"

// Lazy load BigBangIntroThree (uses Three.js - client-side only)
const BigBangIntroThree = lazy(() => import("@/components/bigbang-intro-three").then(m => ({ default: m.BigBangIntroThree })))

// Disable static generation for this fully client-side page
export const dynamic = 'force-dynamic'

export default function IntroPage() {
  const router = useRouter()
  const [showIntro, setShowIntro] = useState(true)
  const [mounted, setMounted] = useState(false)

  const handleComplete = () => {
    setShowIntro(false)
    // Navigate to home page
    setTimeout(() => {
      router.push("/")
    }, 500)
  }

  useEffect(() => {
    setMounted(true)
    // Mark intro as seen in session storage (only on client)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem("hasSeenBigBangIntro", "true")
    }
  }, [])

  // Don't render until mounted on client
  if (!mounted) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!showIntro) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <Suspense fallback={<div className="fixed inset-0 bg-black" />}>
      <BigBangIntroThree onComplete={handleComplete} />
    </Suspense>
  )
}
