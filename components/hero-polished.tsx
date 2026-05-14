"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, ArrowUpRight, Play } from "lucide-react"
import Link from "next/link"
import { useRef, useState, useEffect } from "react"
import { CalendlyBooking } from "./calendly-booking"

export function HeroPolished() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const y = useTransform(scrollYProgress, [0, 1], [0, 100])

  // Time-based greeting
  const [greeting, setGreeting] = useState("Hello")
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hour = now.getHours()

      if (hour < 12) setGreeting("Good morning")
      else if (hour < 18) setGreeting("Good afternoon")
      else setGreeting("Good evening")

      const time = now.toLocaleTimeString("en-US", {
        timeZone: "America/Phoenix",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      setCurrentTime(`${time} AZ`)
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.section
      ref={containerRef}
      id="hero"
      style={{ opacity, y }}
      className="relative min-h-screen flex flex-col justify-between overflow-hidden pt-24 pb-12"
    >
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(218, 165, 32, 0.5) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(218, 165, 32, 0.5) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Ambient gradient orbs */}
      <div className="absolute top-1/3 -left-32 w-[700px] h-[700px] rounded-full bg-gold/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-[700px] h-[700px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      {/* Top Bar - Status indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 container-wide flex items-center justify-between mb-12"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <span className="text-xs font-medium text-emerald-300">
              Available for projects
            </span>
          </div>
          {currentTime && (
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {currentTime}
            </span>
          )}
        </div>

        <div className="text-xs text-muted-foreground hidden md:flex items-center gap-4">
          <span>v3.0</span>
          <span>•</span>
          <span>Phoenix, AZ</span>
        </div>
      </motion.div>

      {/* Main Hero Content */}
      <div className="relative z-10 container-wide flex-1 flex flex-col justify-center">
        <div className="max-w-6xl">
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3">
              <div className="w-12 h-px bg-gold" />
              <span className="text-sm font-medium tracking-wider uppercase text-gold">
                {greeting} — I'm Michael
              </span>
            </div>
          </motion.div>

          {/* Main Heading - Massive, confident, unique */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-[clamp(3rem,8vw,8rem)] font-bold tracking-[-0.04em] leading-[0.95] mb-10"
          >
            <motion.span
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              I build AI systems
            </motion.span>
            <motion.span
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              that print{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-br from-gold via-yellow-300 to-accent bg-clip-text text-transparent">
                  revenue
                </span>
                {/* Underline decoration */}
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 1.2 }}
                  className="absolute -bottom-2 left-0 w-full"
                  height="12"
                  viewBox="0 0 200 12"
                  fill="none"
                >
                  <motion.path
                    d="M2 8 Q 50 2 100 6 T 198 4"
                    stroke="url(#goldGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <defs>
                    <linearGradient id="goldGradient">
                      <stop offset="0%" stopColor="#C9A961" />
                      <stop offset="100%" stopColor="#4ECDC4" />
                    </linearGradient>
                  </defs>
                </motion.svg>
              </span>
            </motion.span>
            <motion.span
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="block text-muted-foreground"
            >
              while you sleep.
            </motion.span>
          </motion.h1>

          {/* Subheading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="grid md:grid-cols-2 gap-8 mb-12 max-w-5xl"
          >
            <p className="text-xl md:text-2xl leading-relaxed text-foreground/90 font-light">
              I've built systems that{" "}
              <span className="font-medium text-gold">created $40M+ in value</span>,
              compressed{" "}
              <span className="font-medium text-gold">15 years of research into 12 weeks</span>,
              and deployed{" "}
              <span className="font-medium text-gold">150+ AI agents across 7 continents</span>.
            </p>
            <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
              Now I work with a handful of founders each quarter to do the same for their businesses.
              No demos. No "experiments." Just production systems with measurable ROI in 90 days.
            </p>
          </motion.div>

          {/* Quick stats inline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            className="flex flex-wrap items-center gap-x-8 gap-y-3 mb-12 text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gold">5</span>
              <span className="text-muted-foreground">clients/quarter max</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gold">90</span>
              <span className="text-muted-foreground">day ROI guarantee</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gold">$2.5K</span>
              <span className="text-muted-foreground">starting investment</span>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.3 }}
            className="flex flex-col sm:flex-row items-start gap-4"
          >
            <CalendlyBooking
              buttonLabel="Book Strategy Call"
              size="lg"
              variant="primary"
              eventName="AI Strategy Call"
              duration="30 min"
            />

            <Link
              href="#offers"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base text-foreground hover:text-gold transition-colors"
            >
              <span>View investment options</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bottom Section - Credentials Strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="relative z-10 container-wide mt-16"
      >
        <div className="border-t border-border/40 pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="text-xs text-muted-foreground mb-2 tracking-wider uppercase">
                Notable Build
              </p>
              <p className="font-semibold text-foreground">Crowe Logic</p>
              <p className="text-xs text-muted-foreground">$40M valuation</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2 tracking-wider uppercase">
                Drug Discovery
              </p>
              <p className="font-semibold text-foreground">CriOS Nova</p>
              <p className="text-xs text-muted-foreground">150+ AI agents</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2 tracking-wider uppercase">
                Business Built
              </p>
              <p className="font-semibold text-foreground">Southwest Mushrooms</p>
              <p className="text-xs text-muted-foreground">$470K/year scaled</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2 tracking-wider uppercase">
                Available For
              </p>
              <p className="font-semibold text-foreground">5 clients/quarter</p>
              <p className="text-xs text-emerald-400">Currently accepting</p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center gap-2 mt-12 text-xs text-muted-foreground"
        >
          <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent" />
          <span>Scroll to explore</span>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
