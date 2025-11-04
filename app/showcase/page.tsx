"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, RotateCcw, Info, X } from "lucide-react"
import Link from "next/link"

interface Star {
  x: number
  y: number
  baseX: number
  baseY: number
  z: number
  size: number
  opacity: number
  speed: number
  color: { r: number; g: number; b: number }
}

export default function ShowcasePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const animationFrameRef = useRef<number>()
  const [isPlaying, setIsPlaying] = useState(true)
  const [showInfo, setShowInfo] = useState(true)
  const [phase, setPhase] = useState<"cosmic" | "bigbang" | "expansion" | "stars">("cosmic")
  const phaseTimeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) return

    // Set canvas size
    const updateSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    updateSize()
    window.addEventListener("resize", updateSize)

    // Generate 15,000 stars for epic cosmic density
    const starCount = 15000
    const stars: Star[] = []
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    for (let i = 0; i < starCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * Math.max(canvas.width, canvas.height) * 0.8
      const z = Math.random() * 1000

      // Create color variation (white, blue-white, gold-white)
      const colorType = Math.random()
      let color
      if (colorType < 0.7) {
        // White stars
        color = { r: 255, g: 255, b: 255 }
      } else if (colorType < 0.85) {
        // Blue-white stars
        color = { r: 200, g: 220, b: 255 }
      } else {
        // Gold-white stars
        color = { r: 255, g: 230, b: 180 }
      }

      stars.push({
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        baseX: centerX + Math.cos(angle) * distance,
        baseY: centerY + Math.sin(angle) * distance,
        z,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.6 + 0.4,
        speed: Math.random() * 0.5 + 0.3,
        color,
      })
    }

    starsRef.current = stars

    let time = 0
    let phaseTime = 0

    const animate = () => {
      if (!isPlaying) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }

      time += 0.016
      phaseTime += 0.016
      phaseTimeRef.current = phaseTime

      // Cycle through phases every 15 seconds
      if (phaseTime > 15) {
        phaseTime = 0
        const phases: typeof phase[] = ["cosmic", "bigbang", "expansion", "stars"]
        const currentIndex = phases.indexOf(phase)
        const nextPhase = phases[(currentIndex + 1) % phases.length]
        setPhase(nextPhase)
      }

      // Clear with deep space black
      ctx.fillStyle = "#000000"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Draw stars with phase-based effects
      stars.forEach((star) => {
        let x = star.baseX
        let y = star.baseY
        let scale = 1
        let alpha = star.opacity
        let glowSize = 3

        // Phase-based animations
        if (phase === "cosmic") {
          // Gentle rotation and twinkle
          const rotateAngle = time * 0.05
          const dx = star.baseX - centerX
          const dy = star.baseY - centerY
          x = centerX + dx * Math.cos(rotateAngle) - dy * Math.sin(rotateAngle)
          y = centerY + dx * Math.sin(rotateAngle) + dy * Math.cos(rotateAngle)
          alpha = star.opacity * (0.6 + Math.sin(time * star.speed + star.baseX) * 0.4)
          scale = 1 + Math.sin(time * star.speed * 2 + star.baseY) * 0.3
        } else if (phase === "bigbang") {
          // Explosive expansion from center
          const progress = Math.min(phaseTime / 3, 1)
          const explosionForce = progress * 8
          const distFromCenter = Math.sqrt(Math.pow(star.baseX - centerX, 2) + Math.pow(star.baseY - centerY, 2))
          const angle = Math.atan2(star.baseY - centerY, star.baseX - centerX)

          x = centerX + Math.cos(angle) * distFromCenter * explosionForce
          y = centerY + Math.sin(angle) * distFromCenter * explosionForce

          scale = 1 + progress * 3
          alpha = star.opacity * (1 - progress * 0.4)
          glowSize = 8 * (1 + progress * 2)
        } else if (phase === "expansion") {
          // Continued expansion with spiral
          const progress = phaseTime / 15
          const spiralAngle = time * 0.1 + (star.z / 1000) * Math.PI * 2
          const distFromCenter = Math.sqrt(Math.pow(star.baseX - centerX, 2) + Math.pow(star.baseY - centerY, 2))
          const expandDist = distFromCenter * (1 + progress * 2)

          x = centerX + Math.cos(spiralAngle) * expandDist
          y = centerY + Math.sin(spiralAngle) * expandDist

          scale = 1 + Math.sin(time * star.speed) * 0.5
          alpha = star.opacity * (0.8 + Math.sin(time * star.speed * 2) * 0.2)
          glowSize = 4
        } else if (phase === "stars") {
          // Twinkling starfield
          alpha = star.opacity * (0.5 + Math.sin(time * star.speed * 3 + star.baseX + star.baseY) * 0.5)
          scale = 1 + Math.sin(time * star.speed * 4 + star.z) * 0.4
          glowSize = 3 + Math.sin(time * star.speed * 2) * 1.5
        }

        // Apply 3D depth effect
        const depth = 1 - star.z / 1000
        const finalSize = star.size * scale * depth
        const finalAlpha = alpha * depth

        // Draw star glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, finalSize * glowSize)
        gradient.addColorStop(0, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${finalAlpha * 0.8})`)
        gradient.addColorStop(0.3, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${finalAlpha * 0.4})`)
        gradient.addColorStop(1, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, 0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, finalSize * glowSize, 0, Math.PI * 2)
        ctx.fill()

        // Draw star core
        ctx.fillStyle = `rgba(255, 255, 255, ${finalAlpha})`
        ctx.beginPath()
        ctx.arc(x, y, finalSize, 0, Math.PI * 2)
        ctx.fill()

        // Add sparkle effect for brightest stars
        if (finalAlpha > 0.8 && Math.random() > 0.98) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${finalAlpha * 0.6})`
          ctx.lineWidth = 0.5
          const sparkleSize = finalSize * 4
          ctx.beginPath()
          ctx.moveTo(x - sparkleSize, y)
          ctx.lineTo(x + sparkleSize, y)
          ctx.moveTo(x, y - sparkleSize)
          ctx.lineTo(x, y + sparkleSize)
          ctx.stroke()
        }
      })

      // Add phase-specific effects
      if (phase === "bigbang" && phaseTime < 2) {
        // Flash effect
        const flashAlpha = Math.max(0, 1 - phaseTime / 2) * 0.6
        const flashGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, canvas.width)
        flashGradient.addColorStop(0, `rgba(255, 255, 255, ${flashAlpha})`)
        flashGradient.addColorStop(0.3, `rgba(200, 220, 255, ${flashAlpha * 0.5})`)
        flashGradient.addColorStop(1, "rgba(255, 255, 255, 0)")
        ctx.fillStyle = flashGradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      window.removeEventListener("resize", updateSize)
    }
  }, [isPlaying, phase])

  const resetAnimation = () => {
    phaseTimeRef.current = 0
    setPhase("cosmic")
  }

  const phaseInfo = {
    cosmic: "Cosmic Formation",
    bigbang: "The Big Bang",
    expansion: "Universal Expansion",
    stars: "Stellar Formation"
  }

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ imageRendering: "crisp-edges" }}
      />

      {/* Info Overlay */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-8 left-1/2 -translate-x-1/2 z-10"
          >
            <div className="bg-black/60 backdrop-blur-md border border-gold/30 rounded-2xl px-8 py-4 shadow-2xl">
              <h1 className="text-3xl font-bold text-white text-center mb-2 text-glow-gold">
                Cosmic Animation Showcase
              </h1>
              <p className="text-gold text-center text-sm text-prismatic">
                15,000 Stars • Canvas Rendering • 60fps Performance
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase Indicator */}
      <div className="absolute top-8 left-8 z-10">
        <motion.div
          className="bg-black/60 backdrop-blur-md border border-gold/30 rounded-xl px-6 py-3"
          animate={{ borderColor: phase === "bigbang" ? "rgba(218, 165, 32, 0.8)" : "rgba(218, 165, 32, 0.3)" }}
        >
          <div className="text-xs text-muted-foreground mb-1">Current Phase</div>
          <div className="text-lg font-bold text-gold text-glow-gold">{phaseInfo[phase]}</div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-black/60 backdrop-blur-md border border-gold/30 rounded-2xl p-4 shadow-2xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 rounded-full bg-gold/20 hover:bg-gold/30 border border-gold/50 flex items-center justify-center transition-all"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-gold" />
              ) : (
                <Play className="w-5 h-5 text-gold" />
              )}
            </button>

            <button
              onClick={resetAnimation}
              className="w-12 h-12 rounded-full bg-gold/20 hover:bg-gold/30 border border-gold/50 flex items-center justify-center transition-all"
            >
              <RotateCcw className="w-5 h-5 text-gold" />
            </button>

            <button
              onClick={() => setShowInfo(!showInfo)}
              className="w-12 h-12 rounded-full bg-gold/20 hover:bg-gold/30 border border-gold/50 flex items-center justify-center transition-all"
            >
              {showInfo ? (
                <X className="w-5 h-5 text-gold" />
              ) : (
                <Info className="w-5 h-5 text-gold" />
              )}
            </button>

            <Link
              href="/"
              className="px-6 py-3 rounded-full bg-gold/20 hover:bg-gold/30 border border-gold/50 text-gold font-medium transition-all"
            >
              Back to Site
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Overlay */}
      <div className="absolute bottom-8 right-8 z-10">
        <div className="bg-black/60 backdrop-blur-md border border-gold/30 rounded-xl px-4 py-3 text-right">
          <div className="text-xs text-muted-foreground">Performance</div>
          <div className="text-sm text-gold">15,000 Stars</div>
          <div className="text-sm text-gold">Canvas API</div>
          <div className="text-sm text-gold">60 FPS</div>
        </div>
      </div>
    </div>
  )
}
