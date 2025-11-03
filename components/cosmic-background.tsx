"use client"

import { useEffect, useRef } from "react"

interface Star {
  x: number
  y: number
  z: number
  size: number
  opacity: number
  twinkleSpeed: number
  twinklePhase: number
}

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Generate stars (fewer than intro for performance)
    const generateStars = () => {
      const stars: Star[] = []
      const starCount = Math.min(1000, Math.floor((canvas.width * canvas.height) / 2000))

      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random(),
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.3,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinklePhase: Math.random() * Math.PI * 2,
        })
      }
      return stars
    }

    starsRef.current = generateStars()

    // Animation loop
    let time = 0
    const animate = () => {
      time += 0.5

      // Clear with deep space background
      ctx.fillStyle = "rgba(9, 9, 11, 1)" // Very dark background
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw stars
      starsRef.current.forEach((star) => {
        // Twinkle effect
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7
        const opacity = star.opacity * twinkle

        // Star color with slight variation
        const colorVariation = star.z * 50
        ctx.fillStyle = `rgba(${200 + colorVariation}, ${200 + colorVariation}, ${255}, ${opacity})`

        // Draw star
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * star.z, 0, Math.PI * 2)
        ctx.fill()

        // Add glow for brighter stars
        if (star.size > 1.5) {
          ctx.shadowBlur = 4
          ctx.shadowColor = `rgba(218, 165, 32, ${opacity * 0.3})`
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * star.z, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0
        }
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  )
}
