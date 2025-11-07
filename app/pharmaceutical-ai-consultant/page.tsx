"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Microscope, FlaskConical, Pill, TrendingUp, Clock, DollarSign } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { PremiumGlassCard } from "@/components/premium-glass-card"

export default function PharmaceuticalAIConsultant() {
  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden py-20">
        <div className="container-wide relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Microscope className="w-4 h-4 text-gold" />
              <span className="text-sm font-semibold bg-gradient-to-r from-gold to-accent bg-clip-text text-transparent">
                Pharmaceutical AI Specialist
              </span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6">
              <span className="block mb-3">
                Pharmaceutical AI Consultant
              </span>
              <span className="block bg-gradient-to-r from-gold via-yellow-300 to-accent bg-clip-text text-transparent">
                From 15 Years to 12 Weeks
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12">
              I built <span className="text-gold font-bold">CriOS Nova</span> - 150+ specialized AI agents that compress drug discovery from 15 years to 12 weeks.
              Now I'm helping pharmaceutical companies implement production AI systems that actually work.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <motion.div whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  size="lg"
                  className="h-14 px-10 text-lg font-bold bg-gradient-to-r from-gold to-yellow-600 text-black shadow-2xl"
                >
                  <Link href="/contact" className="flex items-center gap-3">
                    <span>Schedule Discovery Call</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-14 px-10 text-lg font-semibold backdrop-blur-xl bg-white/5 border-2 border-white/20 hover:bg-white/10"
                >
                  <Link href="#case-study">View CriOS Nova Case Study</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 relative">
        <div className="container-wide">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                The Pharmaceutical AI <span className="text-gold">Challenge</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Drug discovery takes 15+ years and costs $2.6B per approved drug. Your competitors are implementing AI.
                You need production systems, not research projects.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PremiumGlassCard delay={0.1} glowColor="gold">
                <div className="text-center">
                  <Clock className="w-12 h-12 text-gold mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-3">15+ Years</h3>
                  <p className="text-muted-foreground">
                    Average drug development timeline - from discovery to FDA approval
                  </p>
                </div>
              </PremiumGlassCard>

              <PremiumGlassCard delay={0.2} glowColor="blue">
                <div className="text-center">
                  <DollarSign className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-3">$2.6B Cost</h3>
                  <p className="text-muted-foreground">
                    Per approved drug - including failed candidates and clinical trials
                  </p>
                </div>
              </PremiumGlassCard>

              <PremiumGlassCard delay={0.3} glowColor="purple">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-3">90% Failure</h3>
                  <p className="text-muted-foreground">
                    Of drug candidates fail in clinical trials - AI can predict earlier
                  </p>
                </div>
              </PremiumGlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* CriOS Nova Case Study */}
      <section id="case-study" className="py-20 relative">
        <div className="container-wide">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-center mb-6">
                CriOS Nova: <span className="text-gold">150+ AI Agents</span> for Drug Discovery
              </h2>
              <p className="text-xl text-muted-foreground text-center max-w-3xl mx-auto">
                A multi-agent system that compresses 15 years of drug discovery into 12 weeks through specialized AI agents
                handling target identification, compound screening, and clinical trial optimization.
              </p>
            </motion.div>

            <PremiumGlassCard glowColor="gold">
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <FlaskConical className="w-6 h-6 text-gold" />
                    The Challenge
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    Traditional drug discovery requires manual analysis of millions of compounds, extensive wet lab testing,
                    and iterative clinical trial design. Each phase takes years and costs hundreds of millions.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <Microscope className="w-6 h-6 text-accent" />
                    The Solution
                  </h3>
                  <ul className="space-y-3 text-lg text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="text-gold">•</span>
                      <span><strong className="text-foreground">Target Identification Agents:</strong> Screen 100M+ compounds against disease targets in hours</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-gold">•</span>
                      <span><strong className="text-foreground">Molecular Design Agents:</strong> Generate novel drug candidates with optimized properties</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-gold">•</span>
                      <span><strong className="text-foreground">Safety Prediction Agents:</strong> Predict toxicity and side effects before synthesis</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-gold">•</span>
                      <span><strong className="text-foreground">Clinical Trial Optimization:</strong> Design adaptive trials with real-time analysis</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <Pill className="w-6 h-6 text-purple-400" />
                    The Results
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-3xl font-bold text-gold mb-2">12 Weeks</div>
                      <div className="text-sm text-muted-foreground">Discovery Timeline</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-3xl font-bold text-accent mb-2">150+</div>
                      <div className="text-sm text-muted-foreground">Specialized Agents</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-3xl font-bold text-purple-400 mb-2">100M+</div>
                      <div className="text-sm text-muted-foreground">Compounds Screened</div>
                    </div>
                  </div>
                </div>
              </div>
            </PremiumGlassCard>
          </div>
        </div>
      </section>

      {/* Services for Pharma */}
      <section className="py-20 relative">
        <div className="container-wide">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                How I Help <span className="text-gold">Pharmaceutical Companies</span>
              </h2>
            </motion.div>

            <div className="space-y-6">
              <PremiumGlassCard delay={0.1} glowColor="gold">
                <div>
                  <h3 className="text-2xl font-bold mb-3">Drug Discovery Acceleration</h3>
                  <p className="text-lg text-muted-foreground mb-4">
                    Implement AI agents for target identification, compound screening, and molecular design.
                    Screen millions of compounds in hours instead of months.
                  </p>
                  <div className="text-gold font-semibold">$45,000 - 6 weeks</div>
                </div>
              </PremiumGlassCard>

              <PremiumGlassCard delay={0.2} glowColor="blue">
                <div>
                  <h3 className="text-2xl font-bold mb-3">Clinical Trial Optimization</h3>
                  <p className="text-lg text-muted-foreground mb-4">
                    AI-powered patient recruitment, adaptive trial design, and real-time analysis.
                    Reduce trial timelines by 40% while improving patient outcomes.
                  </p>
                  <div className="text-accent font-semibold">$100,000+ - 3 months</div>
                </div>
              </PremiumGlassCard>

              <PremiumGlassCard delay={0.3} glowColor="purple">
                <div>
                  <h3 className="text-2xl font-bold mb-3">Research Automation Platform</h3>
                  <p className="text-lg text-muted-foreground mb-4">
                    Build custom AI platforms that automate literature review, experimental design,
                    and data analysis. Free your researchers for high-value work.
                  </p>
                  <div className="text-purple-400 font-semibold">$200,000+ - 6 months</div>
                </div>
              </PremiumGlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 relative">
        <div className="container-wide">
          <PremiumGlassCard glowColor="gold">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                Ready to Accelerate Your <span className="text-gold">Drug Discovery?</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Schedule a 30-minute discovery call to discuss your pharmaceutical AI implementation.
              </p>
              <motion.div whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  size="lg"
                  className="h-14 px-10 text-lg font-bold bg-gradient-to-r from-gold to-yellow-600 text-black shadow-2xl"
                >
                  <Link href="/contact" className="flex items-center gap-3">
                    <span>Schedule Discovery Call</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>
              <p className="text-sm text-muted-foreground mt-6">
                Michael Crowe | <a href="mailto:Michael@crowelogic.com" className="text-gold hover:underline">Michael@crowelogic.com</a> | (480) 322-5761
              </p>
            </div>
          </PremiumGlassCard>
        </div>
      </section>
    </main>
  )
}
