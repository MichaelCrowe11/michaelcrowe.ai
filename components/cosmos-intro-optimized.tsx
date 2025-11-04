"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { config } from "@/lib/config"

type IntroPhase = "age-of-possibilities" | "big-bang" | "avatar-reveal" | "brand-message" | "complete"

interface Star {
  x: number
  y: number
  baseX: number
  baseY: number
  size: number
  opacity: number
  speed: number
  distanceFromCenter: number
}

export function CosmosIntroOptimized({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<IntroPhase>("age-of-possibilities")
  const [canSkip, setCanSkip] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const animationFrameRef = useRef<number>()

  // Initialize canvas starfield
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    // Set canvas size
    const updateSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    updateSize()
    window.addEventListener("resize", updateSize)

    // Generate stars with better performance - use 8,888 stars (still looks epic but better performance)
    const starCount = 8888
    const stars: Star[] = []
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    for (let i = 0; i < starCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * Math.min(canvas.width, canvas.height) * 0.6
      const x = centerX + Math.cos(angle) * distance
      const y = centerY + Math.sin(angle) * distance
      const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))

      stars.push({
        x,
        y,
        baseX: x,
        baseY: y,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.6 + 0.4,
        speed: Math.random() * 0.5 + 0.5,
        distanceFromCenter,
      })
    }

    starsRef.current = stars

    let time = 0
    let phaseProgress = 0

    const animate = () => {
      time += 0.016 // ~60fps
      phaseProgress += 0.016

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Draw stars with phase-based effects
      stars.forEach((star) => {
        let x = star.baseX
        let y = star.baseY
        let scale = 1
        let alpha = star.opacity

        // Phase-based animations
        if (phase === "big-bang") {
          const progress = Math.min(phaseProgress / 2, 1)
          const flyMultiplier = (star.distanceFromCenter / 300) * progress
          x += (star.baseX - centerX) * flyMultiplier * 4
          y += (star.baseY - centerY) * flyMultiplier * 4
          scale = 1 + progress * 2
          alpha = star.opacity * (1 - progress * 0.3)
        } else if (phase === "avatar-reveal") {
          const progress = Math.min(phaseProgress / 2.5, 1)
          const flyMultiplier = (star.distanceFromCenter / 400) * progress
          x += (star.baseX - centerX) * flyMultiplier * 1.5
          y += (star.baseY - centerY) * flyMultiplier * 1.5
          scale = 1 + Math.sin(progress * Math.PI) * 0.5
        } else {
          // Gentle twinkle
          alpha = star.opacity * (0.7 + Math.sin(time * star.speed + star.baseX) * 0.3)
          scale = 1 + Math.sin(time * star.speed * 2 + star.baseY) * 0.2
        }

        // Draw star glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, star.size * scale * 3)
        gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.8})`)
        gradient.addColorStop(0.5, `rgba(200, 200, 255, ${alpha * 0.4})`)
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, star.size * scale * 3, 0, Math.PI * 2)
        ctx.fill()

        // Draw star core
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.beginPath()
        ctx.arc(x, y, star.size * scale, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      window.removeEventListener("resize", updateSize)
    }
  }, [phase])

  // Reset phase progress when phase changes
  useEffect(() => {
    // Reset animation time for phase transitions
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        // This will be picked up by the animation loop
      }
    }
  }, [phase])

  // Phase progression
  useEffect(() => {
    setCanSkip(true)

    const timeouts = [
      setTimeout(() => setPhase("big-bang"), 2500),
      setTimeout(() => setPhase("avatar-reveal"), 4500),
      setTimeout(() => setPhase("brand-message"), 7000),
      setTimeout(() => {
        setPhase("complete")
        setTimeout(onComplete, 500)
      }, 10000),
    ]

    return () => timeouts.forEach(clearTimeout)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      {/* Canvas Starfield - Much better performance than DOM elements */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ imageRendering: "crisp-edges" }}
      />

      {/* Flash effect for big bang */}
      <AnimatePresence>
        {phase === "big-bang" && (
          <motion.div
            className="absolute inset-0 bg-gradient-radial from-white via-blue-200 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
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
              transition={{ duration: 0.8 }}
              className="text-center space-y-8 px-4"
            >
              <motion.div className="space-y-4">
                <motion.p
                  className="text-xl md:text-2xl text-white/60 font-light"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  We live in
                </motion.p>
                <motion.h1
                  className="text-5xl md:text-7xl font-bold text-white text-glow-gold"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  The Age of Possibilities
                </motion.h1>
                <motion.p
                  className="text-xl md:text-2xl text-gold/80 font-light text-prismatic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Where innovation meets transformation
                </motion.p>
              </motion.div>
            </motion.div>
          )}

          {/* Phase 2: Big Bang */}
          {phase === "big-bang" && (
            <motion.div
              key="bang"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-4 px-4"
            >
              <motion.h2
                className="text-4xl md:text-6xl font-bold text-white text-glow-gold"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                And it all begins...
              </motion.h2>
            </motion.div>
          )}

          {/* Phase 3: Avatar Reveal with Enhanced Effects */}
          {phase === "avatar-reveal" && (
            <motion.div
              key="avatar"
              initial={{ opacity: 0, scale: 0.3, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 1, type: "spring" }}
              className="text-center space-y-8 px-4"
            >
              {/* Enhanced Light Streaks */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(16)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent"
                    style={{
                      left: `${50 + Math.cos((i / 16) * Math.PI * 2) * 45}%`,
                      top: `${50 + Math.sin((i / 16) * Math.PI * 2) * 45}%`,
                      width: "70%",
                      transform: `rotate(${(i / 16) * 360}deg)`,
                      filter: "blur(1px)",
                    }}
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{
                      opacity: [0, 1, 0.5, 0],
                      scaleX: [0, 1.5, 1, 0],
                    }}
                    transition={{ duration: 2, delay: i * 0.05 }}
                  />
                ))}
              </div>

              <motion.div
                className="relative w-48 h-48 mx-auto"
                initial={{ rotate: 0, scale: 0.5 }}
                animate={{ rotate: 360, scale: [0.5, 1.15, 1] }}
                transition={{ duration: 2, ease: "easeOut" }}
              >
                {/* Outer pulsing rings */}
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border-2 border-gold/40"
                    initial={{ scale: 1, opacity: 0 }}
                    animate={{ scale: [1, 2.5, 3.5], opacity: [0.8, 0.3, 0] }}
                    transition={{ duration: 2.5, delay: i * 0.3, repeat: Infinity }}
                  />
                ))}

                {/* Rotating glow aura */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-gold/40 via-accent/40 to-gold/40 blur-2xl"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />

                {/* Avatar container - NO white background */}
                <motion.div
                  className="absolute inset-2 rounded-full overflow-hidden border-4 border-gold shadow-[0_0_60px_rgba(218,165,32,0.9)] bg-black"
                  initial={{ clipPath: "inset(100% 0 0 0)" }}
                  animate={{ clipPath: "inset(0% 0 0 0)" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                >
                  <Image
                    src={config.branding.logoUrl}
                    alt="Michael Crowe"
                    width={192}
                    height={192}
                    className="w-full h-full object-contain"
                    style={{ mixBlendMode: "lighten" }}
                  />
                </motion.div>

                {/* Sparkle particles around avatar */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-gold rounded-full"
                    style={{
                      left: `${50 + Math.cos((i / 12) * Math.PI * 2) * 60}%`,
                      top: `${50 + Math.sin((i / 12) * Math.PI * 2) * 60}%`,
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white text-glow-gold">
                  Michael Crowe
                </h2>
                <p className="text-xl md:text-2xl text-gold text-prismatic">
                  AI Systems Architect
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* Phase 4: Brand Message */}
          {phase === "brand-message" && (
            <motion.div
              key="brand"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-8 px-4 max-w-4xl"
            >
              <motion.h2
                className="text-4xl md:text-6xl font-bold text-white leading-tight"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-glow-gold">Building AI That Actually Works</span>
                <span className="block text-gold mt-2 text-prismatic">For Small Business</span>
              </motion.h2>
              <motion.p
                className="text-xl md:text-2xl text-white/70 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Self-taught developer who scaled a business from garage to serving millions.
                <span className="block text-white/90 mt-2">
                  Now helping small businesses do the same—but faster, with AI.
                </span>
              </motion.p>
              <motion.button
                onClick={onComplete}
                className="mt-8 px-8 py-4 bg-gold hover:bg-gold/90 text-gold-foreground font-semibold rounded-full transition-all pointer-events-auto transform hover:scale-105 shadow-lg shadow-gold/50 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-black"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
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
