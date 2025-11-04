"use client"

import { useState, useEffect, lazy, Suspense } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { HeroPremium } from "@/components/hero-premium"
import { WhyWorkSection } from "@/components/why-work-section"
import { ServicesPricing } from "@/components/services-pricing"

// Only lazy load truly heavy or below-fold components
import { SideNavModern } from "@/components/side-nav-modern"
import { ChatAvatarFunctional } from "@/components/chat-avatar-functional"

const PortfolioShowcase = lazy(() => import("@/components/portfolio-showcase").then(m => ({ default: m.PortfolioShowcase })))
const SkillsConstellation = lazy(() => import("@/components/skills-constellation").then(m => ({ default: m.SkillsConstellation })))
const InteractiveSkillsShowcase = lazy(() => import("@/components/interactive-skills-showcase").then(m => ({ default: m.InteractiveSkillsShowcase })))
const DifferenceSection = lazy(() => import("@/components/difference-section").then(m => ({ default: m.DifferenceSection })))
const StorySection = lazy(() => import("@/components/story-section").then(m => ({ default: m.StorySection })))
const ProcessSection = lazy(() => import("@/components/process-section").then(m => ({ default: m.ProcessSection })))
const WhoThisIsForSection = lazy(() => import("@/components/who-this-is-for-section").then(m => ({ default: m.WhoThisIsForSection })))
const FinalCTASection = lazy(() => import("@/components/final-cta-section").then(m => ({ default: m.FinalCTASection })))

// Loading fallback component
function SectionLoader() {
  return (
    <div className="w-full h-32 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
    </div>
  )
}

export default function Home() {
  // Skip intro by default for better performance
  const [showIntro, setShowIntro] = useState(false)
  const [introComplete, setIntroComplete] = useState(true)

  useEffect(() => {
    // Intro disabled by default for performance
    // Users can view it at /showcase instead
    sessionStorage.setItem("hasSeenCosmosIntro", "true")

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
      {/* Intro disabled by default - view at /showcase */}

      {/* Modern Side Navigation - No lazy loading */}
      <SideNavModern />

      <main className="min-h-screen">
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

        {/* Chat Avatar - No lazy loading for instant availability */}
        <ChatAvatarFunctional />
      </main>
    </ErrorBoundary>
  )
}
