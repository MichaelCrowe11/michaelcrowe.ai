"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { config } from "@/lib/config"

type IntroPhase = "age-of-possibilities" | "big-bang" | "avatar-reveal" | "brand-message" | "complete"

interface Star {
  id: number
  x: number
  y: number
  size: number
  delay: number
  duration: number
}

export function CosmosIntroSimplified({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<IntroPhase>("age-of-possibilities")
  const [canSkip, setCanSkip] = useState(false)
  const [stars, setStars] = useState<Star[]>([])

  // Generate stars on mount
  useEffect(() => {
    const generatedStars: Star[] = []
    for (let i = 0; i < 5000; i++) {
      generatedStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 0.5,
        delay: Math.random() * 3,
        duration: Math.random() * 25 + 15,
      })
    }
    setStars(generatedStars)
  }, [])

  // Phase progression
  useEffect(() => {
    setCanSkip(true)

    const timeouts = [
      setTimeout(() => setPhase("big-bang"), 3000),
      setTimeout(() => setPhase("avatar-reveal"), 5000),
      setTimeout(() => setPhase("brand-message"), 7500),
      setTimeout(() => {
        setPhase("complete")
        setTimeout(onComplete, 500)
      }, 10500),
    ]

    return () => timeouts.forEach(clearTimeout)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      {/* Animated Starfield */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: phase === "big-bang" ? [0, 2, 1, 0.5] : [0, 1, 1, 1],
              x: phase === "big-bang" ? [0, (star.x - 50) * 4, (star.x - 50) * 2] : 0,
              y: phase === "big-bang" ? [0, (star.y - 50) * 4, (star.y - 50) * 2] : 0,
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Flash effect for big bang */}
      <AnimatePresence>
        {phase === "big-bang" && (
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* Skip Button */}
      {canSkip && phase !== "complete" && (
        <motion.button
          onClick={onComplete}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-4 right-4 z-[60] px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white font-medium transition-all focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-black"
          aria-label="Skip introduction animation"
        >
          Skip Intro
        </motion.button>
      )}

      {/* Phase overlays */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <AnimatePresence mode="wait">
          {/* Phase 1: Age of Possibilities */}
          {phase === "age-of-possibilities" && (
            <motion.div
              key="age"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8 px-4"
            >
              <motion.div className="space-y-4">
                <p className="text-xl md:text-2xl text-white/60 font-light">
                  We live in
                </p>
                <h1 className="text-5xl md:text-7xl font-bold text-white">
                  The Age of Possibilities
                </h1>
                <p className="text-xl md:text-2xl text-gold/80 font-light">
                  Where innovation meets transformation
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* Phase 2: Big Bang */}
          {phase === "big-bang" && (
            <motion.div
              key="bang"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="text-center space-y-4 px-4"
            >
              <h2 className="text-4xl md:text-6xl font-bold text-white">
                And it all begins...
              </h2>
            </motion.div>
          )}

          {/* Phase 3: Avatar Reveal */}
          {phase === "avatar-reveal" && (
            <motion.div
              key="avatar"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-center space-y-8 px-4"
            >
              <motion.div
                className="relative w-48 h-48 mx-auto"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gold/20 via-accent/20 to-gold/20 animate-pulse" />
                <div className="absolute inset-2 rounded-full overflow-hidden border-4 border-gold shadow-2xl shadow-gold/50">
                  <Image
                    src={config.branding.logoUrl}
                    alt="Michael Crowe"
                    width={192}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Michael Crowe
                </h2>
                <p className="text-xl md:text-2xl text-gold">
                  AI Systems Architect
                </p>
              </div>
            </motion.div>
          )}

          {/* Phase 4: Brand Message */}
          {phase === "brand-message" && (
            <motion.div
              key="brand"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8 px-4 max-w-4xl"
            >
              <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Building AI That Actually Works
                <span className="block text-gold mt-2">For Small Business</span>
              </h2>
              <p className="text-xl md:text-2xl text-white/70 leading-relaxed">
                Self-taught developer who scaled a business from garage to serving millions.
                <span className="block text-white/90 mt-2">
                  Now helping small businesses do the same—but faster, with AI.
                </span>
              </p>
              <motion.button
                onClick={onComplete}
                className="mt-8 px-8 py-4 bg-gold hover:bg-gold/90 text-gold-foreground font-semibold rounded-full transition-all pointer-events-auto transform hover:scale-105 shadow-lg shadow-gold/50 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-black"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Enter
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
