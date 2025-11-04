"use client"

import { useState, useEffect, lazy, Suspense } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { HeroPremium } from "@/components/hero-premium"
import { WhyWorkSection } from "@/components/why-work-section"
import { ServicesPricing } from "@/components/services-pricing"

// Lazy load heavy components
const CosmosIntro = lazy(() => import("@/components/cosmos-intro-simplified").then(m => ({ default: m.CosmosIntroSimplified })))
const SideNavModern = lazy(() => import("@/components/side-nav-modern").then(m => ({ default: m.SideNavModern })))
const PortfolioShowcase = lazy(() => import("@/components/portfolio-showcase").then(m => ({ default: m.PortfolioShowcase })))
const SkillsConstellation = lazy(() => import("@/components/skills-constellation").then(m => ({ default: m.SkillsConstellation })))
const InteractiveSkillsShowcase = lazy(() => import("@/components/interactive-skills-showcase").then(m => ({ default: m.InteractiveSkillsShowcase })))
const DifferenceSection = lazy(() => import("@/components/difference-section").then(m => ({ default: m.DifferenceSection })))
const StorySection = lazy(() => import("@/components/story-section").then(m => ({ default: m.StorySection })))
const ProcessSection = lazy(() => import("@/components/process-section").then(m => ({ default: m.ProcessSection })))
const WhoThisIsForSection = lazy(() => import("@/components/who-this-is-for-section").then(m => ({ default: m.WhoThisIsForSection })))
const FinalCTASection = lazy(() => import("@/components/final-cta-section").then(m => ({ default: m.FinalCTASection })))
const ChatAvatar = lazy(() => import("@/components/chat-avatar").then(m => ({ default: m.ChatAvatar })))
const FloatingParticles = lazy(() => import("@/components/floating-particles").then(m => ({ default: m.FloatingParticles })))

// Loading fallback component
function SectionLoader() {
  return (
    <div className="w-full h-32 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
    </div>
  )
}

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

    // Safety fallback: Force show main content after 15 seconds if intro hasn't completed
    const safetyTimeout = setTimeout(() => {
      if (!introComplete) {
        sessionStorage.setItem("hasSeenCosmosIntro", "true")
        setIntroComplete(true)
        setShowIntro(false)
      }
    }, 15000)

    return () => clearTimeout(safetyTimeout)
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
      {showIntro && (
        <Suspense fallback={<div className="fixed inset-0 bg-black flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
          <CosmosIntro onComplete={handleIntroComplete} />
        </Suspense>
      )}

      {/* Floating Particles - Always visible */}
      {introComplete && (
        <Suspense fallback={null}>
          <FloatingParticles />
        </Suspense>
      )}

      {/* Modern Side Navigation */}
      {introComplete && (
        <Suspense fallback={null}>
          <SideNavModern />
        </Suspense>
      )}

      <main
        className={`min-h-screen transition-opacity duration-1000 ${
          introComplete ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Above-the-fold content - not lazy loaded */}
        <HeroPremium />
        <WhyWorkSection />
        <ServicesPricing />

        {/* Below-the-fold content - lazy loaded */}
        <Suspense fallback={<SectionLoader />}>
          <PortfolioShowcase />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <SkillsConstellation />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <InteractiveSkillsShowcase />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <DifferenceSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <StorySection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <ProcessSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <WhoThisIsForSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <FinalCTASection />
        </Suspense>

        <Suspense fallback={null}>
          <ChatAvatar />
        </Suspense>
      </main>
    </ErrorBoundary>
  )
}
