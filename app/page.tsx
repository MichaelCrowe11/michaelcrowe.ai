"use client"

import { useState, useEffect, lazy, Suspense } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { HeroPolished } from "@/components/hero-polished"
import { PremiumOffers } from "@/components/premium-offers"
import { SocialProofPolished } from "@/components/social-proof-polished"
import { BookingSection } from "@/components/booking-section"

// Lazy load BigBangIntroThree (uses Three.js - client-side only)
const BigBangIntroThree = lazy(() => import("@/components/bigbang-intro-three").then(m => ({ default: m.BigBangIntroThree })))

// Only lazy load truly heavy or below-fold components
import { SideNavModern } from "@/components/side-nav-modern"
import { ChatAvatarFunctional } from "@/components/chat-avatar-functional"

const PortfolioShowcase = lazy(() => import("@/components/portfolio-showcase").then(m => ({ default: m.PortfolioShowcase })))
const ProcessSection = lazy(() => import("@/components/process-section").then(m => ({ default: m.ProcessSection })))
const StorySection = lazy(() => import("@/components/story-section").then(m => ({ default: m.StorySection })))
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
  const [showIntro, setShowIntro] = useState(false)
  const [introComplete, setIntroComplete] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    if (typeof window === 'undefined') return

    const hasSeenIntro = sessionStorage.getItem("hasSeenBigBangIntro")
    const enableIntro = false

    if (!hasSeenIntro && enableIntro) {
      setShowIntro(true)
      setIntroComplete(false)
    } else {
      sessionStorage.setItem("hasSeenBigBangIntro", "true")
    }

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
      {/* Big Bang Intro - Show on first visit if enabled */}
      {mounted && showIntro && !introComplete && (
        <Suspense fallback={<div className="fixed inset-0 bg-black" />}>
          <BigBangIntroThree onComplete={handleIntroComplete} />
        </Suspense>
      )}

      {/* Modern Side Navigation */}
      <SideNavModern />

      <main className="min-h-screen">
        {/* 1. Hero - Bold opening, clear value, immediate booking CTA */}
        <HeroPolished />

        {/* 2. Social Proof - Build trust early with results */}
        <SocialProofPolished />

        {/* 3. Story - Why Michael, what makes the approach different */}
        <Suspense fallback={<SectionLoader />}>
          <StorySection />
        </Suspense>

        {/* 4. Portfolio - Show the work */}
        <Suspense fallback={<SectionLoader />}>
          <PortfolioShowcase />
        </Suspense>

        {/* 5. Process - How working together looks */}
        <Suspense fallback={<SectionLoader />}>
          <ProcessSection />
        </Suspense>

        {/* 6. Offers - Now they're warm, present pricing with psychology */}
        <PremiumOffers />

        {/* 7. Booking - Direct path to action via Calendly */}
        <BookingSection />

        {/* 8. Final CTA - Last call to action */}
        <Suspense fallback={<SectionLoader />}>
          <FinalCTASection />
        </Suspense>

        {/* Chat Avatar - Always available */}
        <ChatAvatarFunctional />
      </main>
    </ErrorBoundary>
  )
}
