import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { DifferenceSection } from "@/components/difference-section"
import { ServicesSection } from "@/components/services-section"
import { StorySection } from "@/components/story-section"
import { ProcessSection } from "@/components/process-section"
import { WhoThisIsForSection } from "@/components/who-this-is-for-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { FinalCTASection } from "@/components/final-cta-section"
import { ChatAvatar } from "@/components/chat-avatar"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <DifferenceSection />
      <ServicesSection />
      <StorySection />
      <ProcessSection />
      <WhoThisIsForSection />
      <TestimonialsSection />
      <FinalCTASection />
      <ChatAvatar />
    </main>
  )
}
