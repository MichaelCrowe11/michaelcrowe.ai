"use client"

import { useState, useEffect, lazy, Suspense } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { CosmicScrollController } from "@/components/cosmic-scroll-controller"
import { CosmicHeroEnhanced } from "@/components/cosmic-hero-enhanced"
import { WhyWorkSection } from "@/components/why-work-section"
import { ServicesPricing } from "@/components/services-pricing"

// Lazy load heavy components
const CosmosIntro = lazy(() => import("@/components/cosmos-intro-enhanced").then(m => ({ default: m.CosmosIntro })))
const SideNavModern = lazy(() => import("@/components/side-nav-modern").then(m => ({ default: m.SideNavModern })))
const PortfolioShowcase = lazy(() => import("@/components/portfolio-showcase").then(m => ({ default: m.PortfolioShowcase })))
const SkillsConstellation = lazy(() => import("@/components/skills-constellation").then(m => ({ default: m.SkillsConstellation })))
const DifferenceSection = lazy(() => import("@/components/difference-section").then(m => ({ default: m.DifferenceSection })))
const StorySection = lazy(() => import("@/components/story-section").then(m => ({ default: m.StorySection })))
const ProcessSection = lazy(() => import("@/components/process-section").then(m => ({ default: m.ProcessSection })))
const WhoThisIsForSection = lazy(() => import("@/components/who-this-is-for-section").then(m => ({ default: m.WhoThisIsForSection })))
const TestimonialsSection = lazy(() => import("@/components/testimonials-section").then(m => ({ default: m.TestimonialsSection })))
const FinalCTASection = lazy(() => import("@/components/final-cta-section").then(m => ({ default: m.FinalCTASection })))
const ChatAvatar = lazy(() => import("@/components/chat-avatar").then(m => ({ default: m.ChatAvatar })))

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
        <>
          {/* GSAP Cinematic Scroll Controller */}
          <CosmicScrollController />

          {/* Modern Side Navigation - floating in cosmos */}
          <Suspense fallback={null}>
            <SideNavModern />
          </Suspense>

          <main className="min-h-screen">
            {/* Enhanced Cosmic Hero with pixel dissolve effects */}
            <CosmicHeroEnhanced />
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
          <TestimonialsSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <FinalCTASection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <ChatAvatar />
        </Suspense>
      </main>
    </>
      )}
    </ErrorBoundary>
  )
}
