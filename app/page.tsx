"use client"

import { lazy, Suspense } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { HeroPremium } from "@/components/hero-premium"
import { WhyWorkSection } from "@/components/why-work-section"
import { ServicesPricing } from "@/components/services-pricing"

// Lazy load heavy components
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
  return (
    <ErrorBoundary>
      {/* Modern Side Navigation - floating in cosmos */}
      <Suspense fallback={null}>
        <SideNavModern />
      </Suspense>

      <main className="min-h-screen">
        {/* All sections now float in the cosmic starfield */}
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

        <Suspense fallback={null}>
          <ChatAvatar />
        </Suspense>
      </main>
    </ErrorBoundary>
  )
}
