"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { DifferenceSection } from "@/components/difference-section"
import { StorySection } from "@/components/story-section"
import { ProcessSection } from "@/components/process-section"
import { WhoThisIsForSection } from "@/components/who-this-is-for-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { FinalCTASection } from "@/components/final-cta-section"
import { ChatAvatar } from "@/components/chat-avatar"
import { CosmosIntro } from "@/components/cosmos-intro-enhanced"
import { SideNavModern } from "@/components/side-nav-modern"
import { HeroModern } from "@/components/hero-modern"
import { ServicesModern } from "@/components/services-modern"
import { PortfolioShowcase } from "@/components/portfolio-showcase"
import { SkillsConstellation } from "@/components/skills-constellation"

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

      {/* Modern Side Navigation */}
      {introComplete && <SideNavModern />}

      <main
        className={`min-h-screen transition-opacity duration-1000 ${
          introComplete ? "opacity-100" : "opacity-0"
        }`}
      >
        <Header />
        <HeroModern />
        <ServicesModern />
        <PortfolioShowcase />
        <SkillsConstellation />
        <DifferenceSection />
        <StorySection />
        <ProcessSection />
        <WhoThisIsForSection />
        <TestimonialsSection />
        <FinalCTASection />
        <ChatAvatar />
      </main>
    </>
  )
}
