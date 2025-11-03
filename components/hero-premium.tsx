"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, Rocket } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { PremiumGlassCard } from "./premium-glass-card"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export function HeroPremium() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/4 -left-48 w-[500px] h-[500px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(218, 165, 32, 0.4), transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, 50, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-1/4 -right-48 w-[500px] h-[500px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(65, 105, 225, 0.4), transparent 70%)",
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.2, 0.4],
          x: [0, -50, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <div className="container-wide relative z-10 py-12">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-6xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={item} className="flex justify-center mb-8">
            <motion.div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-xl bg-white/5 border border-gold/20 shadow-2xl"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(218, 165, 32, 0.3)" }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-gold" />
              </motion.div>
              <span className="text-sm font-semibold bg-gradient-to-r from-gold to-accent bg-clip-text text-transparent">
                Production AI Systems That Actually Work
              </span>
            </motion.div>
          </motion.div>

          {/* Main Heading */}
          <motion.div variants={item} className="text-center mb-8">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-tight">
              <motion.span
                className="block mb-3"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                I Build AI Systems
              </motion.span>

              <motion.span
                className="block mb-3 bg-gradient-to-r from-gold via-yellow-300 to-accent bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                style={{
                  textShadow: "0 0 80px rgba(218, 165, 32, 0.5)",
                }}
              >
                That Actually Work.
              </motion.span>

              <motion.span
                className="block"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                Now I'll Build Yours.
              </motion.span>
            </h1>
          </motion.div>

          {/* Subheading */}
          <motion.p
            variants={item}
            className="text-lg sm:text-xl lg:text-2xl text-center text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8"
          >
            I'm <span className="text-foreground font-bold">Michael Crowe</span> - founder of{" "}
            <span className="text-gold font-bold">Crowe Logic AI</span> and{" "}
            <span className="text-accent font-bold">CriOS Nova</span>. I scaled Southwest Mushrooms from my garage to serving millions across 7 continents, generating{" "}
            <span className="text-foreground font-bold">$470K annually</span>. I built{" "}
            <span className="text-foreground font-bold">150+ specialized AI agents</span> for pharmaceutical research.
          </motion.p>


          {/* CTA Buttons */}
          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                asChild
                size="lg"
                className="h-14 px-10 text-lg font-bold bg-gradient-to-r from-gold to-yellow-600 text-black shadow-2xl relative overflow-hidden group"
              >
                <Link href="/contact" className="flex items-center gap-3">
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <span className="relative z-10">Start Your AI Journey</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 px-10 text-lg font-semibold backdrop-blur-xl bg-white/5 border-2 border-white/20 hover:bg-white/10"
              >
                <Link href="#services-pricing">View Services & Pricing</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            variants={container}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            <PremiumGlassCard delay={0.2} glowColor="gold">
              <div className="text-center">
                <div className="mb-3">
                  <Zap className="w-8 h-8 text-gold mx-auto" />
                </div>
                <motion.div
                  className="text-4xl lg:text-5xl font-bold bg-gradient-to-br from-gold to-yellow-600 bg-clip-text text-transparent mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                >
                  $470K
                </motion.div>
                <div className="text-sm text-muted-foreground font-medium">Annual Revenue Generated</div>
              </div>
            </PremiumGlassCard>

            <PremiumGlassCard delay={0.4} glowColor="blue">
              <div className="text-center">
                <div className="mb-3">
                  <Rocket className="w-8 h-8 text-accent mx-auto" />
                </div>
                <motion.div
                  className="text-4xl lg:text-5xl font-bold bg-gradient-to-br from-accent to-blue-600 bg-clip-text text-transparent mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                >
                  150+
                </motion.div>
                <div className="text-sm text-muted-foreground font-medium">AI Agents Built</div>
              </div>
            </PremiumGlassCard>

            <PremiumGlassCard delay={0.6} glowColor="purple">
              <div className="text-center">
                <div className="mb-3">
                  <Sparkles className="w-8 h-8 text-purple-400 mx-auto" />
                </div>
                <motion.div
                  className="text-4xl lg:text-5xl font-bold bg-gradient-to-br from-purple-400 to-pink-600 bg-clip-text text-transparent mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.7 }}
                >
                  7
                </motion.div>
                <div className="text-sm text-muted-foreground font-medium">Continents Served</div>
              </div>
            </PremiumGlassCard>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex flex-col items-center gap-3 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
        >
          <span className="text-xs font-medium uppercase tracking-wider">Scroll to explore</span>
          <motion.div
            className="w-6 h-10 rounded-full border-2 border-current p-1"
            whileHover={{ scale: 1.1 }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-current mx-auto"
              animate={{ y: [0, 16, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
