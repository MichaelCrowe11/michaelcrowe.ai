"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface Orb {
  id: number
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  blur: number
}

export function GlassmorphismOrbs() {
  const containerRef = useRef<HTMLDivElement>(null)
  const orbsRef = useRef<Orb[]>([])
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Initialize orbs with varied properties for realism
    orbsRef.current = [
      {
        id: 1,
        x: width * 0.2,
        y: height * 0.3,
        size: 400,
        speedX: 0.3,
        speedY: 0.2,
        color: "rgba(201, 169, 97, 0.15)", // Gold
        blur: 80,
      },
      {
        id: 2,
        x: width * 0.7,
        y: height * 0.6,
        size: 350,
        speedX: -0.25,
        speedY: 0.35,
        color: "rgba(78, 205, 196, 0.12)", // Teal
        blur: 90,
      },
      {
        id: 3,
        x: width * 0.5,
        y: height * 0.5,
        size: 450,
        speedX: 0.2,
        speedY: -0.3,
        color: "rgba(156, 89, 182, 0.1)", // Purple
        blur: 100,
      },
      {
        id: 4,
        x: width * 0.15,
        y: height * 0.75,
        size: 300,
        speedX: -0.35,
        speedY: -0.25,
        color: "rgba(69, 183, 209, 0.13)", // Blue
        blur: 70,
      },
      {
        id: 5,
        x: width * 0.85,
        y: height * 0.25,
        size: 380,
        speedX: 0.28,
        speedY: 0.32,
        color: "rgba(255, 107, 53, 0.08)", // Orange
        blur: 85,
      },
    ]

    const animate = () => {
      const orbs = orbsRef.current
      const container = containerRef.current
      if (!container) return

      const width = container.clientWidth
      const height = container.clientHeight

      orbs.forEach((orb) => {
        // Update position
        orb.x += orb.speedX
        orb.y += orb.speedY

        // Bounce off edges with smooth deceleration
        if (orb.x <= -orb.size / 2 || orb.x >= width + orb.size / 2) {
          orb.speedX *= -1
          orb.x = Math.max(-orb.size / 2, Math.min(width + orb.size / 2, orb.x))
        }
        if (orb.y <= -orb.size / 2 || orb.y >= height + orb.size / 2) {
          orb.speedY *= -1
          orb.y = Math.max(-orb.size / 2, Math.min(height + orb.size / 2, orb.y))
        }

        // Apply the transform to DOM element
        const element = container.querySelector(`[data-orb-id="${orb.id}"]`) as HTMLElement
        if (element) {
          element.style.transform = `translate(${orb.x}px, ${orb.y}px)`
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbsRef.current.map((orb) => (
        <motion.div
          key={orb.id}
          data-orb-id={orb.id}
          className="absolute rounded-full will-change-transform"
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle at 30% 30%, ${orb.color.replace("0.15)", "0.25)")}, ${orb.color.replace("0.15)", "0.05)")})`,
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            filter: `blur(${orb.blur}px)`,
            boxShadow: `
              inset 0 0 60px ${orb.color.replace("0.15)", "0.3)")},
              0 0 80px ${orb.color.replace("0.15)", "0.2)")},
              0 20px 40px ${orb.color.replace("0.15)", "0.15)")}
            `,
            border: `1px solid ${orb.color.replace("0.15)", "0.3)")}`,
            transform: `translate(${orb.x}px, ${orb.y}px)`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: [1, 1.05, 1],
          }}
          transition={{
            opacity: { duration: 2 },
            scale: {
              duration: 8 + orb.id * 2,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />
      ))}

      {/* Additional ambient glow layer for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(201, 169, 97, 0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(78, 205, 196, 0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(156, 89, 182, 0.02) 0%, transparent 50%)
          `,
          mixBlendMode: "screen",
        }}
      />
    </div>
  )
}
