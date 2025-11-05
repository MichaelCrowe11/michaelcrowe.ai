"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BigBangIntroThree } from "@/components/bigbang-intro-three"

export default function IntroPage() {
  const router = useRouter()
  const [showIntro, setShowIntro] = useState(true)

  const handleComplete = () => {
    setShowIntro(false)
    // Navigate to home page
    setTimeout(() => {
      router.push("/")
    }, 500)
  }

  useEffect(() => {
    // Mark intro as seen in session storage
    sessionStorage.setItem("hasSeenBigBangIntro", "true")
  }, [])

  if (!showIntro) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return <BigBangIntroThree onComplete={handleComplete} />
}
