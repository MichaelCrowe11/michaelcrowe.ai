"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { PortfolioShowcaseEnhanced } from "@/components/portfolio-showcase-enhanced"
import { PricingCalculator } from "@/components/pricing-calculator"
import { TestimonialsEnhanced } from "@/components/testimonials-enhanced"
import { Rocket, Sparkles, Target, Users } from "lucide-react"

export default function DemoPage() {
  const [activeSection, setActiveSection] = useState<string>("overview")

  const sections = [
    { id: "overview", label: "Overview", icon: Sparkles },
    { id: "portfolio", label: "Portfolio", icon: Rocket },
    { id: "pricing", label: "Pricing Calculator", icon: Target },
    { id: "testimonials", label: "Testimonials", icon: Users }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gold">Service Components Demo</h1>
              <p className="text-sm text-muted-foreground">
                Premium AI/Web Development Services Platform
              </p>
            </div>
            <a
              href="/"
              className="px-4 py-2 bg-gold hover:bg-gold/90 text-gold-foreground rounded-lg font-medium transition-colors"
            >
              Back to Site
            </a>
          </div>
        </div>
      </nav>

      {/* Section Navigation */}
      <div className="sticky top-[73px] z-40 bg-card/60 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-3">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeSection === section.id
                      ? "bg-gold text-gold-foreground"
                      : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {section.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Overview Section */}
        {activeSection === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* Header */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Service-Focused Platform Components
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Complete system for converting visitors into high-value clients through AI-powered
                conversations, portfolio showcases, and interactive pricing.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border">
                <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-gold" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Portfolio Showcase</h3>
                <p className="text-muted-foreground">
                  Interactive project cards with metrics, categories, and detailed case studies.
                  Shows $40M+ in value created.
                </p>
              </div>

              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Pricing Calculator</h3>
                <p className="text-muted-foreground">
                  Real-time project estimation tool. Helps qualify leads and set expectations.
                  $10K-$250K+ project ranges.
                </p>
              </div>

              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Client Testimonials</h3>
                <p className="text-muted-foreground">
                  Social proof with quantified results. Features 92% time savings, $2M+ funding
                  raised, etc.
                </p>
              </div>
            </div>

            {/* Service Tiers Summary */}
            <div className="bg-gradient-to-br from-gold/10 to-accent/10 rounded-2xl p-8 border border-gold/30">
              <h3 className="text-2xl font-bold text-white mb-6">Service Offering Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gold mb-3">AI Development</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Starter: $10K-$25K (2-4 weeks)</li>
                    <li>• Advanced: $25K-$75K (1-3 months)</li>
                    <li>• Enterprise: $75K-$250K+ (3-6 months)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gold mb-3">Web Development</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Landing Page: $5K-$15K (2-3 weeks)</li>
                    <li>• Web App: $15K-$50K (1-2 months)</li>
                    <li>• Advanced Platform: $50K-$150K+ (2-4 months)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gold mb-3">Consulting</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Discovery: FREE (30 min)</li>
                    <li>• Strategy: $500/hour (2 hr min)</li>
                    <li>• Audit: $2K-$10K</li>
                    <li>• Retainer: $5K-$20K/month</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gold mb-3">Training</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Team Workshop: $3K-$10K</li>
                    <li>• Executive Briefing: $2K</li>
                    <li>• Custom curriculum available</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* AI System Enhancements */}
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-8 border border-border">
              <h3 className="text-2xl font-bold text-white mb-4">Enhanced AI Chat System</h3>
              <p className="text-muted-foreground mb-4">
                The AI chat has been upgraded with a comprehensive sales-focused system prompt
                including:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-gold">Lead Qualification</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>✓ Budget range assessment</li>
                    <li>✓ Timeline evaluation</li>
                    <li>✓ Decision maker identification</li>
                    <li>✓ Green/red flag detection</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gold">Sales Capabilities</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>✓ Service tier matching</li>
                    <li>✓ Portfolio showcasing</li>
                    <li>✓ Objection handling</li>
                    <li>✓ Call-to-action generation</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <p className="text-lg text-muted-foreground mb-4">
                Explore each section using the navigation above
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setActiveSection("portfolio")}
                  className="px-6 py-3 bg-gold hover:bg-gold/90 text-gold-foreground rounded-lg font-semibold transition-colors"
                >
                  View Portfolio
                </button>
                <button
                  onClick={() => setActiveSection("pricing")}
                  className="px-6 py-3 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg font-semibold transition-colors"
                >
                  Try Calculator
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Portfolio Section */}
        {activeSection === "portfolio" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <PortfolioShowcaseEnhanced />
          </motion.div>
        )}

        {/* Pricing Section */}
        {activeSection === "pricing" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-white mb-4">Interactive Pricing Calculator</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Get instant project estimates based on your requirements. This tool helps qualify
                  leads and set clear expectations.
                </p>
              </div>
              <PricingCalculator
                onBookCall={() => {
                  alert("In production, this would open Calendly booking")
                  window.open("https://calendly.com/michaelcrowe/discovery", "_blank")
                }}
              />
            </div>
          </motion.div>
        )}

        {/* Testimonials Section */}
        {activeSection === "testimonials" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <TestimonialsEnhanced />
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              These components are ready for integration into your main site
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="/SERVICE_OFFERING_GUIDE.md"
                target="_blank"
                className="text-gold hover:text-gold/80 underline"
              >
                View Service Guide
              </a>
              <a
                href="/BIG_BANG_INTRO_README.md"
                target="_blank"
                className="text-gold hover:text-gold/80 underline"
              >
                View Intro Docs
              </a>
              <a href="/intro" className="text-gold hover:text-gold/80 underline">
                View 3D Intro
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
