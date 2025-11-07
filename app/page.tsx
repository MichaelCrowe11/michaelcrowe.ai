"use client"

import { useState, useEffect } from "react"
import { CosmosIntro } from "@/components/cosmos-intro-enhanced"
import { AvatarSpaceChat } from "@/components/avatar-space-chat"

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
    <>
      {showIntro && <CosmosIntro onComplete={handleIntroComplete} />}

      {introComplete && (
        <div className="transition-opacity duration-1000 opacity-100">
          <AvatarSpaceChat />
        </div>
      )}
    </>
  )
}
