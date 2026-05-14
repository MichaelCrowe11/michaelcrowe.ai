"use client"

import { motion } from "framer-motion"
import { Check, ArrowRight, Crown, Zap, Trophy, Sparkles, Lock, Calendar, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

// High-converting offer structure with price psychology
const offers = [
  {
    id: "ai-roadmap-call",
    tier: "STRATEGIC ENTRY",
    name: "AI Roadmap Intensive",
    tagline: "Get clarity on your AI strategy in 90 minutes",
    price: 2500,
    originalPrice: 5000,
    duration: "90-min intensive + 7-day deliverable",
    spotsLeft: 4,
    icon: Zap,
    valuePropositioning: "Most consultants charge $500/hour with no deliverable. You get a 25-page roadmap.",
    keyOutcome: "Walk away knowing EXACTLY what AI to build first, in what order, and the ROI of each",
    features: [
      "90-minute deep-dive strategy call with Michael personally",
      "Custom 25-page AI implementation roadmap delivered in 7 days",
      "Prioritized list of 5-7 high-ROI AI opportunities specific to your business",
      "Technology stack recommendations + build vs. buy analysis",
      "ROI projections with conservative and aggressive scenarios",
      "30-day Slack access for follow-up questions",
      "100% credited toward AI System Sprint if you upgrade within 30 days",
    ],
    perfectFor: "Business owners 6-figures+ who know AI is coming but need clarity on where to start",
    notFor: "Tire-kickers, idea-stage startups, or anyone looking for free consulting",
    cta: "Book Your Roadmap Call",
    productId: "ai-roadmap-call",
    highlighted: false,
    badge: null,
  },
  {
    id: "ai-system-sprint",
    tier: "MOST POPULAR",
    name: "AI System Sprint",
    tagline: "One production-ready AI system in 4 weeks",
    price: 25000,
    duration: "4 weeks, 1 system, infinite leverage",
    spotsLeft: 2,
    icon: Trophy,
    valuePropositioning: "Replaces 2-4 FTEs. Pays for itself in 60-90 days. Most popular choice.",
    keyOutcome: "Launch a production AI system that saves 40+ hours/week (or generates equivalent revenue)",
    features: [
      "Discovery sprint: Define exact system, KPIs, and integration points (Week 1)",
      "Custom AI architecture leveraging Crowe Logic methodology",
      "Production-grade build with monitoring, logging, error handling",
      "Full integration with your existing tools (CRM, ERP, comms)",
      "Team training: 2 sessions for adoption and self-sufficiency",
      "60 days post-launch optimization included",
      "Direct Slack access to Michael throughout build",
      "Lifetime access to source code (yours forever)",
    ],
    perfectFor: "Established businesses ($1M+) ready to move fast on a specific automation",
    notFor: "Businesses still validating their model or wanting throwaway prototypes",
    cta: "Lock In My Sprint",
    productId: "ai-system-sprint",
    highlighted: true,
    badge: "MOST POPULAR",
  },
  {
    id: "crowe-logic-implementation",
    tier: "TRANSFORMATIONAL",
    name: "Crowe Logic Implementation",
    tagline: "5-7 connected AI systems in 12 weeks",
    price: 75000,
    duration: "12 weeks of intensive transformation",
    spotsLeft: 1,
    icon: Crown,
    valuePropositioning: "Equivalent to hiring 3-5 senior AI engineers. Compressed into one engagement.",
    keyOutcome: "Become an AI-native business. 5-7 connected systems running 24/7, generating compounding ROI",
    features: [
      "Everything in System Sprint, PLUS:",
      "Full enterprise AI architecture design",
      "5-7 production AI systems built and integrated",
      "Crowe Logic agent orchestration framework",
      "Enterprise integrations (Salesforce, HubSpot, custom APIs)",
      "Team training: 6 sessions with leadership and operators",
      "Quarterly optimization included for 12 months",
      "Priority access (12hr response) for 6 months",
      "Co-development of internal AI playbook for your team",
    ],
    perfectFor: "Companies $5M-$50M ready to make AI a core competitive advantage",
    notFor: "Anyone who wants to dabble or test waters with small budgets",
    cta: "Schedule Strategy Call",
    productId: "crowe-logic-implementation",
    highlighted: false,
    badge: "LIMITED: 1 spot left",
  },
]

const subscriptionOffers = [
  {
    id: "executive-ai-partnership",
    name: "Executive AI Partnership",
    tagline: "Your fractional Chief AI Officer",
    price: 15000,
    originalPrice: 25000,
    period: "/month",
    minCommitment: "6-month minimum",
    icon: Sparkles,
    description: "For founders/CEOs who want strategic AI leadership without hiring a $400K/year CAIO",
    features: [
      "20 hours/month of strategic guidance",
      "Weekly 60-min executive sessions",
      "Unlimited async access (Slack, 12hr SLA)",
      "Board-level AI presentations and reporting",
      "Vendor evaluation and contract negotiation support",
      "Network introductions (engineers, partners, investors)",
      "Quarterly AI strategy reviews and roadmap updates",
      "First-call rights on new implementation projects",
    ],
    benefits: [
      "Save $200K+/year vs. hiring",
      "Immediate expertise on demand",
      "No equity dilution required",
    ],
    spotsLeft: 2,
    productId: "executive-ai-partnership",
  },
]

const microOffers = [
  {
    id: "ai-audit",
    name: "AI Opportunity Audit",
    price: 5000,
    description: "Async deep-dive identifying 3-5 highest-ROI AI opportunities in your business",
    deliverable: "Video walkthrough + prioritization matrix",
    timeframe: "1 week",
    productId: "ai-audit",
  },
  {
    id: "ai-playbook",
    name: "The Crowe Logic Playbook",
    price: 1997,
    originalPrice: 4997,
    description: "Self-paced course: The exact framework I use with $25K+ clients",
    deliverable: "12-hour video course + templates + community",
    timeframe: "Self-paced",
    productId: "ai-playbook",
    digital: true,
  },
]

export function PremiumOffers() {
  const [billingMode] = useState<"once" | "monthly">("once")

  return (
    <section id="offers" className="section-spacing relative overflow-hidden">
      {/* Subtle background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container-wide relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 max-w-4xl mx-auto"
        >
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6">
            <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-sm font-semibold text-gold tracking-wider uppercase">
              Investment Options
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-gold via-yellow-300 to-accent bg-clip-text text-transparent">
              Path Forward
            </span>
          </h2>

          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            I work with a maximum of <span className="text-gold font-semibold">5 clients per quarter</span>.
            Every engagement is structured to deliver measurable ROI within 90 days,
            or I work for free until it does.
          </p>

          {/* Risk Reversal */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30">
            <Lock className="w-5 h-5 text-emerald-400" />
            <p className="text-sm text-emerald-300 font-medium">
              <strong>90-Day ROI Guarantee:</strong> Your engagement pays for itself within 90 days, or I keep working for free until it does.
            </p>
          </div>
        </motion.div>

        {/* Main Tiered Offers */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20"
        >
          {offers.map((offer, idx) => (
            <motion.div
              key={offer.id}
              variants={item}
              className={`relative group ${offer.highlighted ? "lg:-mt-6 lg:-mb-6 z-10" : ""}`}
            >
              {/* Glow effect for highlighted */}
              {offer.highlighted && (
                <div className="absolute -inset-1 bg-gradient-to-br from-gold via-yellow-400 to-accent rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
              )}

              <div
                className={`relative h-full rounded-3xl p-8 border backdrop-blur-xl transition-all duration-300 ${
                  offer.highlighted
                    ? "bg-gradient-to-br from-card via-card/95 to-gold/5 border-gold/40 shadow-2xl"
                    : "bg-card/40 border-border/50 hover:border-gold/30"
                }`}
              >
                {/* Badge */}
                {offer.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase ${
                      offer.highlighted
                        ? "bg-gradient-to-r from-gold to-accent text-black"
                        : "bg-red-500/90 text-white"
                    }`}>
                      {offer.badge}
                    </div>
                  </div>
                )}

                {/* Spots Left Indicator */}
                <div className="flex items-center justify-between mb-6">
                  <div className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                    {offer.tier}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <AlertTriangle className="w-3 h-3 text-orange-400" />
                    <span className="text-orange-400 font-semibold">{offer.spotsLeft} spots left</span>
                  </div>
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                  offer.highlighted
                    ? "bg-gradient-to-br from-gold/30 to-accent/20"
                    : "bg-gold/10"
                }`}>
                  <offer.icon className="w-7 h-7 text-gold" />
                </div>

                {/* Name & Tagline */}
                <h3 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">
                  {offer.name}
                </h3>
                <p className="text-muted-foreground mb-6 text-base leading-relaxed">
                  {offer.tagline}
                </p>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-border/50">
                  <div className="flex items-baseline gap-2 mb-2">
                    {offer.originalPrice && (
                      <span className="text-2xl text-muted-foreground line-through">
                        ${offer.originalPrice.toLocaleString()}
                      </span>
                    )}
                    <span className="text-5xl font-bold bg-gradient-to-r from-gold to-accent bg-clip-text text-transparent">
                      ${offer.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{offer.duration}</p>
                </div>

                {/* Key Outcome */}
                <div className="mb-6 p-4 rounded-xl bg-gold/5 border border-gold/20">
                  <p className="text-xs font-bold tracking-wider uppercase text-gold mb-2">
                    What You Walk Away With
                  </p>
                  <p className="text-sm leading-relaxed text-foreground">
                    {offer.keyOutcome}
                  </p>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <p className="text-xs font-bold tracking-wider uppercase text-muted-foreground mb-3">
                    Everything Included
                  </p>
                  <ul className="space-y-2.5">
                    {offer.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm">
                        <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                          offer.highlighted ? "text-gold" : "text-emerald-500"
                        }`} />
                        <span className={i === 0 && feature.includes("PLUS:") ? "font-semibold text-foreground" : "text-muted-foreground"}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Perfect For */}
                <div className="mb-6 space-y-3 text-sm">
                  <div>
                    <span className="text-emerald-400 font-semibold">✓ Perfect for: </span>
                    <span className="text-muted-foreground">{offer.perfectFor}</span>
                  </div>
                  <div>
                    <span className="text-red-400 font-semibold">✗ Not for: </span>
                    <span className="text-muted-foreground">{offer.notFor}</span>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href={`/checkout?product=${offer.productId}`}
                  className={`block w-full text-center px-6 py-4 rounded-xl font-semibold text-base transition-all duration-300 group ${
                    offer.highlighted
                      ? "bg-gradient-to-r from-gold to-accent text-black hover:shadow-2xl hover:shadow-gold/30 hover:scale-[1.02]"
                      : "bg-foreground/5 text-foreground hover:bg-gold/10 hover:text-gold border border-border hover:border-gold/40"
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    {offer.cta}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Subscription Offer - Recurring Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-3">
              Ongoing Partnership
            </h3>
            <p className="text-lg text-muted-foreground">
              For founders who need a fractional AI executive on their team
            </p>
          </div>

          {subscriptionOffers.map((offer) => (
            <div key={offer.id} className="max-w-4xl mx-auto">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-gold to-accent rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />

                <div className="relative rounded-3xl p-10 bg-gradient-to-br from-card via-card/95 to-purple-500/5 border border-purple-500/30 backdrop-blur-xl">
                  <div className="grid md:grid-cols-2 gap-10">
                    {/* Left: Info */}
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 mb-4">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-xs font-bold tracking-wider uppercase text-purple-300">
                          Fractional CAIO
                        </span>
                      </div>

                      <h4 className="text-3xl font-bold mb-3">{offer.name}</h4>
                      <p className="text-muted-foreground mb-6 leading-relaxed">{offer.description}</p>

                      <div className="space-y-4 mb-6">
                        <div className="flex items-baseline gap-3">
                          {offer.originalPrice && (
                            <span className="text-2xl text-muted-foreground line-through">
                              ${offer.originalPrice.toLocaleString()}
                            </span>
                          )}
                          <span className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-gold bg-clip-text text-transparent">
                            ${offer.price.toLocaleString()}
                          </span>
                          <span className="text-xl text-muted-foreground">{offer.period}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{offer.minCommitment}</p>
                      </div>

                      <div className="space-y-2 mb-6">
                        {offer.benefits.map((benefit, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                            <span className="text-foreground font-medium">{benefit}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 mb-6 text-sm">
                        <AlertTriangle className="w-4 h-4 text-orange-400" />
                        <span className="text-orange-400 font-semibold">Only {offer.spotsLeft} partnership spots available</span>
                      </div>

                      <Link
                        href={`/checkout?product=${offer.productId}`}
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-gold text-white hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-[1.02] group"
                      >
                        Apply for Partnership
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>

                    {/* Right: Features */}
                    <div className="space-y-3">
                      <p className="text-xs font-bold tracking-wider uppercase text-muted-foreground mb-4">
                        What's Included Each Month
                      </p>
                      {offer.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm">
                          <Check className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                          <span className="text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Micro Offers - Lower Commitment */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-3">
              Self-Service Options
            </h3>
            <p className="text-lg text-muted-foreground">
              Not ready for a full engagement? Start here.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {microOffers.map((offer) => (
              <motion.div
                key={offer.id}
                whileHover={{ y: -4 }}
                className="rounded-2xl p-8 bg-card/40 border border-border/50 hover:border-gold/30 backdrop-blur-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <h4 className="text-2xl font-bold">{offer.name}</h4>
                  {offer.digital && (
                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold">
                      DIGITAL
                    </span>
                  )}
                </div>

                <p className="text-muted-foreground mb-6">{offer.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Deliverable</p>
                    <p className="font-semibold">{offer.deliverable}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Timeframe</p>
                    <p className="font-semibold">{offer.timeframe}</p>
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    {offer.originalPrice && (
                      <p className="text-sm text-muted-foreground line-through">
                        ${offer.originalPrice.toLocaleString()}
                      </p>
                    )}
                    <p className="text-3xl font-bold text-gold">
                      ${offer.price.toLocaleString()}
                    </p>
                  </div>

                  <Link
                    href={`/checkout?product=${offer.productId}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm bg-foreground/5 hover:bg-gold/10 hover:text-gold border border-border hover:border-gold/40 transition-all duration-300"
                  >
                    Get Started
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 max-w-3xl mx-auto text-center"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="text-4xl font-bold text-gold mb-2">$40M+</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Value Created</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gold mb-2">150+</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">AI Agents Deployed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gold mb-2">7</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Continents Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gold mb-2">100%</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Client Satisfaction</div>
            </div>
          </div>

          <p className="text-lg text-muted-foreground italic leading-relaxed">
            "I don't build demos. I build AI systems that run real businesses generating real revenue.
            If you want cheap experiments, there are plenty of options. If you want production-ready
            systems with proven results — let's talk."
          </p>
          <p className="mt-4 text-sm font-semibold text-gold">— Michael Crowe</p>
        </motion.div>
      </div>
    </section>
  )
}
