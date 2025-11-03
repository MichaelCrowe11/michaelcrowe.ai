"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1], // Custom easing curve (easeOutExpo)
    },
  },
}

const float = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
}

export function HeroModern() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-background/80"
    >
      {/* Subtle gradient orbs in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-48 w-96 h-96 bg-gold/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-48 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(218, 165, 32, 0.5) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(218, 165, 32, 0.5) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20 pb-12">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-5xl mx-auto text-center space-y-8"
        >
          {/* Badge */}
          <motion.div variants={item} className="flex justify-center">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-background/50 backdrop-blur-sm shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium">AI Systems Architect</span>
            </motion.div>
          </motion.div>

          {/* Main Heading */}
          <motion.div variants={item} className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="block">I Build AI Systems</span>
              <span className="block mt-2 bg-gradient-to-r from-gold via-gold to-accent bg-clip-text text-transparent">
                That Actually Work.
              </span>
              <span className="block mt-2">Now I'll Build Yours.</span>
            </h1>
          </motion.div>

          {/* Subheading */}
          <motion.p
            variants={item}
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            I'm <span className="text-foreground font-semibold">Michael Crowe</span> - founder of{" "}
            <span className="text-gold font-semibold">Crowe Logic AI</span> and{" "}
            <span className="text-accent font-semibold">CriOS Nova</span>. I scaled Southwest Mushrooms from my garage to serving millions across 7 continents, generating{" "}
            <span className="text-foreground font-semibold">$470K annually</span>. I built{" "}
            <span className="text-foreground font-semibold">150+ specialized AI agents</span> for pharmaceutical research.
            I've automated real businesses with real revenue. Now I help you do the same.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild size="lg" className="group relative overflow-hidden bg-gold text-gold-foreground h-12 px-8 text-base font-semibold shadow-lg shadow-gold/20">
                <Link href="/contact" className="flex items-center gap-2">
                  <span>Start Your AI Journey</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base font-semibold border-border/50 bg-background/50 backdrop-blur-sm hover:bg-accent/5"
              >
                <Link href="#portfolio">View Portfolio</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Social Proof */}
          <motion.div variants={item} className="flex flex-col sm:flex-row gap-8 justify-center items-center pt-8">
            <div className="flex flex-col items-center gap-1">
              <div className="text-3xl font-bold text-foreground">$470K</div>
              <div className="text-sm text-muted-foreground">Annual Revenue</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-border/50" />
            <div className="flex flex-col items-center gap-1">
              <div className="text-3xl font-bold text-foreground">7</div>
              <div className="text-sm text-muted-foreground">Continents Served</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-border/50" />
            <div className="flex flex-col items-center gap-1">
              <div className="text-3xl font-bold text-foreground">20+</div>
              <div className="text-sm text-muted-foreground">Hours Saved/Week</div>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-muted-foreground pt-4">
            <a
              href="tel:+14803225761"
              className="flex items-center gap-2 hover:text-gold transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span className="font-medium">480-322-5761</span>
            </a>
            <a
              href="mailto:Michael@crowelogic.com"
              className="flex items-center gap-2 hover:text-gold transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-medium">Michael@crowelogic.com</span>
            </a>
          </motion.div>

          {/* Floating visual element */}
          <motion.div variants={float} initial="initial" animate="animate" className="pt-12">
            <div className="relative mx-auto w-full max-w-2xl h-64 sm:h-80">
              {/* Glassmorphic card showcasing tech */}
              <div className="absolute inset-0 rounded-2xl border border-border/50 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl shadow-2xl p-8">
                <div className="grid grid-cols-3 gap-4 h-full">
                  {[
                    { label: "Next.js", color: "from-gray-400 to-gray-600" },
                    { label: "React", color: "from-blue-400 to-blue-600" },
                    { label: "TypeScript", color: "from-blue-500 to-blue-700" },
                    { label: "AI/GPT-4", color: "from-purple-400 to-purple-600" },
                    { label: "Three.js", color: "from-gold to-yellow-600" },
                    { label: "Node.js", color: "from-green-400 to-green-600" },
                  ].map((tech, i) => (
                    <motion.div
                      key={tech.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="flex items-center justify-center"
                    >
                      <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-border/20 to-border/5 backdrop-blur-sm border border-border/30 flex items-center justify-center group hover:shadow-lg transition-shadow">
                        <span className={`text-xs font-semibold bg-gradient-to-br ${tech.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform`}>
                          {tech.label}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Floating dots decoration */}
              <motion.div
                className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-gold/20 backdrop-blur-sm"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full bg-accent/20 backdrop-blur-sm"
                animate={{
                  y: [0, 10, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs font-medium">Scroll to explore</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
