"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Particle {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  life: number
  size: number
  color: string
}

interface Firework {
  id: string
  x: number
  y: number
  particles: Particle[]
}

export function FireworkStars() {
  const [fireworks, setFireworks] = useState<Firework[]>([])

  useEffect(() => {
    const createFirework = () => {
      // Random position on screen
      const x = Math.random() * 100
      const y = Math.random() * 60 + 10 // Keep in upper 70% of screen

      // Create particle burst
      const particleCount = 20 + Math.floor(Math.random() * 15) // 20-35 particles
      const particles: Particle[] = []

      const colors = [
        "rgba(218, 165, 32, ", // Gold
        "rgba(255, 255, 255, ", // White
        "rgba(135, 206, 250, ", // Light blue
        "rgba(255, 215, 0, ", // Bright gold
      ]

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount
        const velocity = 2 + Math.random() * 3

        particles.push({
          id: `${Date.now()}-${i}`,
          x: 0,
          y: 0,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          life: 1,
          size: 2 + Math.random() * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }

      const firework: Firework = {
        id: `firework-${Date.now()}`,
        x,
        y,
        particles,
      }

      setFireworks((prev) => [...prev, firework])

      // Remove after animation completes
      setTimeout(() => {
        setFireworks((prev) => prev.filter((f) => f.id !== firework.id))
      }, 1500)
    }

    // Create fireworks at random intervals
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        // 40% chance every 3 seconds
        createFirework()
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      <AnimatePresence>
        {fireworks.map((firework) => (
          <div
            key={firework.id}
            className="absolute"
            style={{
              left: `${firework.x}%`,
              top: `${firework.y}%`,
            }}
          >
            {firework.particles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: 1,
                }}
                animate={{
                  x: particle.vx * 50,
                  y: particle.vy * 50 + 20, // Gravity effect
                  opacity: 0,
                  scale: 0,
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeOut",
                }}
                className="absolute rounded-full"
                style={{
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  backgroundColor: `${particle.color}1)`,
                  boxShadow: `0 0 ${particle.size * 2}px ${particle.color}0.8)`,
                }}
              />
            ))}
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
