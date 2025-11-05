"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calculator, Zap, Clock, DollarSign, ArrowRight, Check } from "lucide-react"

interface PricingInputs {
  projectType: string
  complexity: string
  timeline: string
  features: string[]
}

interface PricingEstimate {
  price: {
    low: number
    high: number
  }
  timeline: string
  deliverables: string[]
  nextStep: string
}

const projectTypes = [
  { value: "ai-agent", label: "AI Agent/Chatbot", icon: "🤖" },
  { value: "web-app", label: "Web Application", icon: "💻" },
  { value: "advanced-platform", label: "Advanced Platform", icon: "🚀" },
  { value: "consultation", label: "Strategy Consultation", icon: "💡" }
]

const complexityLevels = [
  { value: "simple", label: "Simple", description: "Basic functionality, quick turnaround" },
  { value: "medium", label: "Medium", description: "Standard features, moderate complexity" },
  { value: "complex", label: "Complex", description: "Advanced features, custom integrations" },
  { value: "enterprise", label: "Enterprise", description: "Large-scale, mission-critical systems" }
]

const timelineOptions = [
  { value: "asap", label: "ASAP (Rush)", note: "Rush fees apply" },
  { value: "1-2-months", label: "1-2 Months" },
  { value: "2-3-months", label: "2-3 Months", recommended: true },
  { value: "3-6-months", label: "3-6 Months" },
  { value: "flexible", label: "Flexible" }
]

export function PricingCalculator({ onBookCall }: { onBookCall?: () => void }) {
  const [inputs, setInputs] = useState<PricingInputs>({
    projectType: "ai-agent",
    complexity: "medium",
    timeline: "2-3-months",
    features: []
  })

  const [estimate, setEstimate] = useState<PricingEstimate | null>(null)
  const [showEstimate, setShowEstimate] = useState(false)

  const calculateEstimate = () => {
    const basePrices: Record<string, { price: number; weeks: number; deliverables: string[] }> = {
      "ai-agent": {
        price: 25000,
        weeks: 6,
        deliverables: ["Custom AI agent/chatbot", "API integrations", "Training & documentation", "30-day support"]
      },
      "web-app": {
        price: 30000,
        weeks: 8,
        deliverables: [
          "Full-stack web application",
          "User authentication",
          "Database design & setup",
          "API development",
          "Responsive design"
        ]
      },
      "advanced-platform": {
        price: 100000,
        weeks: 16,
        deliverables: [
          "Complex platform architecture",
          "Advanced features & integrations",
          "Real-time capabilities",
          "Admin dashboard",
          "Documentation & training",
          "3 months support"
        ]
      },
      consultation: {
        price: 1000,
        weeks: 0.5,
        deliverables: ["Strategy session (2 hours)", "Technical roadmap", "Implementation guidance", "Q&A support"]
      }
    }

    const complexityMultipliers: Record<string, number> = {
      simple: 0.6,
      medium: 1.0,
      complex: 1.6,
      enterprise: 2.5
    }

    const timelineMultipliers: Record<string, number> = {
      asap: 1.3,
      "1-2-months": 1.1,
      "2-3-months": 1.0,
      "3-6-months": 0.95,
      flexible: 0.9
    }

    const base = basePrices[inputs.projectType]
    const complexityMultiplier = complexityMultipliers[inputs.complexity]
    const timelineMultiplier = timelineMultipliers[inputs.timeline]

    const totalMultiplier = complexityMultiplier * timelineMultiplier
    const estimatedPrice = base.price * totalMultiplier
    const estimatedWeeks = Math.ceil(base.weeks * complexityMultiplier)

    setEstimate({
      price: {
        low: Math.round(estimatedPrice * 0.8),
        high: Math.round(estimatedPrice * 1.3)
      },
      timeline: `${estimatedWeeks} weeks`,
      deliverables: base.deliverables,
      nextStep: "discovery_call"
    })

    setShowEstimate(true)
  }

  const handleBookCall = () => {
    if (onBookCall) {
      onBookCall()
    } else {
      window.open("https://calendly.com/michaelcrowe/discovery", "_blank")
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center">
            <Calculator className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Project Estimator</h3>
            <p className="text-muted-foreground">Get a rough estimate in 60 seconds</p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Project Type */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">What do you need?</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {projectTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setInputs({ ...inputs, projectType: type.value })}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    inputs.projectType === type.value
                      ? "border-gold bg-gold/10"
                      : "border-border bg-muted/20 hover:border-gold/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{type.icon}</span>
                    <span className="font-medium text-foreground">{type.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Complexity */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Complexity Level</label>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {complexityLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setInputs({ ...inputs, complexity: level.value })}
                  className={`p-4 rounded-xl border transition-all ${
                    inputs.complexity === level.value
                      ? "border-gold bg-gold/10"
                      : "border-border bg-muted/20 hover:border-gold/50"
                  }`}
                >
                  <div className="text-center space-y-1">
                    <div className="font-medium text-foreground">{level.label}</div>
                    <div className="text-xs text-muted-foreground">{level.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Desired Timeline</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {timelineOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setInputs({ ...inputs, timeline: option.value })}
                  className={`p-4 rounded-xl border transition-all relative ${
                    inputs.timeline === option.value
                      ? "border-gold bg-gold/10"
                      : "border-border bg-muted/20 hover:border-gold/50"
                  }`}
                >
                  {option.recommended && (
                    <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full">
                      Recommended
                    </div>
                  )}
                  <div className="text-center space-y-1">
                    <div className="font-medium text-foreground">{option.label}</div>
                    {option.note && <div className="text-xs text-muted-foreground">{option.note}</div>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Calculate Button */}
          <button
            onClick={calculateEstimate}
            className="w-full py-4 bg-gold hover:bg-gold/90 text-gold-foreground rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold/30"
          >
            <Zap className="w-5 h-5" />
            Calculate Estimate
          </button>
        </div>

        {/* Estimate Result */}
        <AnimatePresence>
          {showEstimate && estimate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8 space-y-6"
            >
              {/* Price Range */}
              <div className="bg-gradient-to-br from-gold/20 to-accent/20 rounded-2xl p-6 border border-gold/30">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-gold" />
                  <h4 className="text-lg font-semibold text-white">Estimated Investment</h4>
                </div>
                <div className="flex items-center justify-center gap-4 mb-2">
                  <span className="text-3xl md:text-4xl font-bold text-gold">
                    ${estimate.price.low.toLocaleString()}
                  </span>
                  <span className="text-2xl text-muted-foreground">-</span>
                  <span className="text-3xl md:text-4xl font-bold text-gold">
                    ${estimate.price.high.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Timeline: {estimate.timeline}</span>
                </div>
              </div>

              {/* Deliverables */}
              <div className="bg-muted/20 rounded-xl p-6 border border-border">
                <h4 className="text-lg font-semibold text-white mb-4">What You Get</h4>
                <div className="space-y-2">
                  {estimate.deliverables.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-accent/10 rounded-xl p-4 border border-accent/30">
                <p className="text-sm text-accent flex items-start gap-2">
                  <span className="text-lg">⚡</span>
                  <span>
                    This is a rough estimate. Actual pricing depends on specific requirements. Let's discuss your
                    project in detail.
                  </span>
                </p>
              </div>

              {/* CTA */}
              <button
                onClick={handleBookCall}
                className="w-full py-4 bg-gradient-to-r from-gold to-accent hover:opacity-90 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-xl"
              >
                Book Free Discovery Call
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
