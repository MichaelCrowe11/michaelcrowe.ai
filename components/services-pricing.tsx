"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight, Sparkles, Zap, Rocket, Crown, Search, Lightbulb } from "lucide-react"
import Link from "next/link"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
}

export function ServicesPricing() {
  const mainServices = [
    {
      icon: Sparkles,
      name: "AI Strategy & Roadmap",
      price: "$15,000",
      duration: "2 Weeks",
      tagline: "Know exactly where AI fits in your business",
      features: [
        "Full business & technical audit (2-3 days deep dive)",
        "Custom AI strategy aligned with your business goals",
        "Detailed 25-page implementation roadmap with ROI projections",
        "Technology stack recommendations",
        "Build vs. buy analysis",
        "2-hour executive presentation",
        "90 days of strategic support",
      ],
      outcome: "Know exactly where AI fits, what to build first, and what ROI to expect.",
      highlighted: false,
      borderColor: "border-gold/30",
      bgGradient: "from-gold/5 to-gold/10",
    },
    {
      icon: Zap,
      name: "AI Implementation Intensive",
      price: "$45,000",
      duration: "6 Weeks",
      tagline: "Get 5-7 automations built and deployed",
      features: [
        "Everything in Strategy & Roadmap, PLUS:",
        "Custom AI solution architecture leveraging Crowe Logic methodology",
        "5-7 high-impact automations built and deployed",
        "Integration with existing enterprise systems",
        "Team training and documentation",
        "60 days post-launch optimization",
        "Direct access to me throughout",
      ],
      outcome: "50-100+ hours/week saved across your organization. Systems that actually work.",
      highlighted: true,
      borderColor: "border-gold",
      bgGradient: "from-gold/10 to-accent/10",
    },
    {
      icon: Rocket,
      name: "Executive AI Advisory",
      price: "$15,000/mo",
      duration: "6-month minimum",
      tagline: "Your interim Chief AI Officer",
      features: [
        "15 hours/month of direct strategic guidance",
        "Unlimited async access (Slack/email, 12hr response time)",
        "Weekly 1-hour strategy calls",
        "Quarterly roadmap reviews",
        "Introduction to my network (vendors, partners, investors)",
        "Priority access for implementation projects",
        "Act as your interim Chief AI Officer",
      ],
      outcome: "Limited to 3 clients maximum",
      highlighted: false,
      borderColor: "border-accent/30",
      bgGradient: "from-accent/5 to-accent/10",
    },
    {
      icon: Crown,
      name: "Custom Platform Development",
      price: "$100,000+",
      duration: "3-6 months",
      tagline: "Enterprise-grade AI infrastructure",
      features: [
        "Industry-specific AI agent frameworks",
        "Custom Crowe Logic implementations",
        "Proprietary automation platforms",
        "Enterprise-grade AI infrastructure",
      ],
      outcome: "This is what I've built for my own companies. Now available for select clients.",
      highlighted: false,
      borderColor: "border-purple-500/30",
      bgGradient: "from-purple-500/5 to-purple-500/10",
    },
  ]

  const entryPoints = [
    {
      icon: Search,
      name: "Discovery Intensive",
      price: "$7,500",
      duration: "3 Days",
      features: [
        "3 full days of deep-dive consultation",
        "Immediate AI opportunity identification",
        "Quick-win implementation plan",
        "Proof-of-concept for one automation",
        "Fully credited toward Implementation Intensive if you upgrade within 30 days",
      ],
    },
    {
      icon: Lightbulb,
      name: "AI Audit",
      price: "$5,000",
      duration: "1 Week",
      features: [
        "Async audit of your current operations",
        "Video walkthrough of 3-5 AI opportunities specific to your business",
        "Prioritization matrix (effort vs. impact)",
        "60-minute live Q&A",
      ],
    },
  ]

  return (
    <section id="services-pricing" className="section-spacing relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-gold rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container-wide relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-headline gradient-text-simple mb-4">
            Services & Investment
          </h2>
          <p className="text-body-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            I don't build demos. I build AI systems that run real businesses generating real revenue.
          </p>
          <div className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-gold/10 to-accent/10 border border-gold/20">
            <p className="text-lg font-semibold text-foreground">
              Minimum engagement: <span className="text-gold">$5,000</span>
            </p>
          </div>
        </motion.div>

        {/* Main Services Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
        >
          {mainServices.map((service, idx) => (
            <motion.div
              key={service.name}
              variants={item}
              className={`relative ${service.highlighted ? "lg:col-span-2" : ""}`}
            >
              <div
                className={`glass-card rounded-2xl p-8 h-full border-2 ${service.borderColor} bg-gradient-to-br ${service.bgGradient} relative overflow-hidden group hover:scale-[1.02] transition-all duration-300`}
              >
                {service.highlighted && (
                  <div className="absolute top-4 right-4 px-4 py-1.5 rounded-full bg-gold/20 border border-gold/40">
                    <span className="text-sm font-bold text-gold">MOST POPULAR</span>
                  </div>
                )}

                {/* Icon */}
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold/30 to-accent/20 flex items-center justify-center">
                    <service.icon className="w-8 h-8 text-gold" />
                  </div>
                </div>

                {/* Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold glow-text mb-2">{service.name}</h3>
                  <p className="text-muted-foreground mb-4">{service.tagline}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gold">{service.price}</span>
                    <span className="text-muted-foreground">| {service.duration}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-foreground mb-4">What You Get:</p>
                  <ul className="space-y-3">
                    {service.features.map((feature, featureIdx) => (
                      <li key={featureIdx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Outcome */}
                <div className="pt-6 border-t border-border/50">
                  <p className="text-sm font-semibold text-gold mb-2">Outcome:</p>
                  <p className="text-sm text-muted-foreground italic">{service.outcome}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Alternative Entry Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-center mb-8 glow-text">
            Alternative Entry Points
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {entryPoints.map((entry, idx) => (
              <motion.div
                key={entry.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * idx }}
              >
                <div className="glass-card rounded-2xl p-8 h-full border border-gold/20 hover:border-gold/40 transition-all duration-300 hover:scale-[1.02]">
                  {/* Icon */}
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center">
                      <entry.icon className="w-6 h-6 text-gold" />
                    </div>
                  </div>

                  {/* Header */}
                  <div className="mb-4">
                    <h4 className="text-xl font-bold glow-text mb-2">{entry.name}</h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gold">{entry.price}</span>
                      <span className="text-sm text-muted-foreground">| {entry.duration}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2">
                    {entry.features.map((feature, featureIdx) => (
                      <li key={featureIdx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Positioning Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="glass-card rounded-2xl p-12 border-2 border-gold/30">
            <h3 className="text-3xl font-bold mb-6 gradient-text-simple">
              "I Don't Build Demos."
            </h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                I've built AI systems that run real businesses generating real revenue.
              </p>
              <p>
                <span className="text-gold font-semibold">Crowe Logic</span> powers production systems processing millions in transactions.{" "}
                <span className="text-accent font-semibold">CriOS Nova</span> compresses years of pharmaceutical research into weeks.
                My automation infrastructure scaled Southwest Mushrooms to serve customers on 7 continents.
              </p>
              <p className="text-foreground font-semibold text-lg">
                When you work with me, you're getting frameworks battle-tested in production - not theoretical consulting.
              </p>
              <p className="text-sm italic pt-4 border-t border-border/50 mt-6">
                If you want cheap AI experiments, there are plenty of options. If you want systems that actually work - let's talk.
              </p>
            </div>

            <div className="mt-8">
              <Button asChild size="lg" className="glass-button h-12 px-8 text-base font-semibold group">
                <Link href="/contact" className="flex items-center gap-2">
                  <span>Let's Talk</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
