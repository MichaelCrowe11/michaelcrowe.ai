"use client"

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

interface CroweAvatarProps {
  isStreaming?: boolean
  streamingIntensity?: number // 0-1, how actively it's streaming
  size?: number
  className?: string
}

/**
 * Crowe Logic Avatar - The Code Storm Raven
 * - Raven surrounded by swirling code matrix
 * - Code intensifies and glows during streaming
 * - Settles down when idle
 * - Epic storm effect when thinking/generating
 */
export function CroweAvatar({ 
  isStreaming = false, 
  streamingIntensity = 0,
  size = 120,
  className = "" 
}: CroweAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const codeParticlesRef = useRef<any[]>([])
  const timeRef = useRef(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    // Set canvas size for retina displays
    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const centerX = size / 2
    const centerY = size / 2

    // Code characters for the storm
    const codeChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン{}[]<>/\\|!@#$%^&*()'.split('')

    // Code particle system
    class CodeParticle {
      x: number
      y: number
      char: string
      angle: number
      radius: number
      speed: number
      opacity: number
      color: string
      size: number
      orbitSpeed: number

      constructor() {
        this.angle = Math.random() * Math.PI * 2
        this.radius = size * 0.3 + Math.random() * size * 0.3
        this.speed = 0.01 + Math.random() * 0.02
        this.orbitSpeed = (Math.random() > 0.5 ? 1 : -1) * (0.5 + Math.random() * 1.5)
        this.x = centerX + Math.cos(this.angle) * this.radius
        this.y = centerY + Math.sin(this.angle) * this.radius
        this.char = codeChars[Math.floor(Math.random() * codeChars.length)]
        this.opacity = 0.3 + Math.random() * 0.4
        this.color = Math.random() > 0.7 ? '#d4af37' : '#ffffff'
        this.size = 8 + Math.random() * 6
      }

      update(streamingActive: boolean, intensity: number) {
        // Orbit around the raven
        this.angle += this.speed * this.orbitSpeed * (streamingActive ? 3 : 1)
        
        // Pulsing radius during streaming
        const radiusPulse = streamingActive ? Math.sin(timeRef.current * 4) * size * 0.1 * intensity : 0
        const currentRadius = this.radius + radiusPulse
        
        this.x = centerX + Math.cos(this.angle) * currentRadius
        this.y = centerY + Math.sin(this.angle) * currentRadius
        
        // Flicker opacity during streaming
        if (streamingActive) {
          this.opacity = 0.5 + Math.random() * 0.5 * intensity
        } else {
          this.opacity = Math.max(0.2, this.opacity - 0.01)
        }

        // Randomly change character during intense streaming
        if (streamingActive && intensity > 0.5 && Math.random() > 0.95) {
          this.char = codeChars[Math.floor(Math.random() * codeChars.length)]
        }
      }

      draw(ctx: CanvasRenderingContext2D, glowIntensity: number) {
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.fillStyle = this.color
        ctx.font = `${this.size}px "Fira Code", monospace`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        
        // Glow effect during streaming
        if (glowIntensity > 0) {
          ctx.shadowBlur = 15 * glowIntensity
          ctx.shadowColor = this.color
        }
        
        ctx.fillText(this.char, this.x, this.y)
        ctx.restore()
      }
    }

    // Initialize code particles
    const particleCount = 30
    if (codeParticlesRef.current.length === 0) {
      for (let i = 0; i < particleCount; i++) {
        codeParticlesRef.current.push(new CodeParticle())
      }
    }

    const animate = () => {
      timeRef.current += 0.016 // ~60fps

      // Clear canvas with transparency
      ctx.clearRect(0, 0, size, size)

      // Calculate intensity based on streaming state
      const intensity = isStreaming ? (0.5 + Math.sin(timeRef.current * 3) * 0.5) : streamingIntensity

      // Draw outer energy ring during streaming
      if (isStreaming || intensity > 0.1) {
        const ringRadius = size * 0.45
        const gradient = ctx.createRadialGradient(
          centerX, centerY, ringRadius * 0.8,
          centerX, centerY, ringRadius
        )
        gradient.addColorStop(0, `rgba(212, 175, 55, ${intensity * 0.3})`)
        gradient.addColorStop(1, 'rgba(212, 175, 55, 0)')
        
        ctx.strokeStyle = gradient
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Draw code storm
      codeParticlesRef.current.forEach(particle => {
        particle.update(isStreaming, intensity)
        particle.draw(ctx, intensity)
      })

      // Add more particles during intense streaming
      if (isStreaming && intensity > 0.7 && codeParticlesRef.current.length < 50) {
        codeParticlesRef.current.push(new CodeParticle())
      }

      // Remove excess particles when calming down
      if (!isStreaming && codeParticlesRef.current.length > particleCount) {
        codeParticlesRef.current = codeParticlesRef.current.slice(0, particleCount)
      }

      // Draw connection lines between nearby particles during streaming
      if (isStreaming || intensity > 0.3) {
        ctx.strokeStyle = `rgba(212, 175, 55, ${intensity * 0.2})`
        ctx.lineWidth = 1
        
        for (let i = 0; i < codeParticlesRef.current.length; i++) {
          for (let j = i + 1; j < codeParticlesRef.current.length; j++) {
            const p1 = codeParticlesRef.current[i]
            const p2 = codeParticlesRef.current[j]
            const dx = p1.x - p2.x
            const dy = p1.y - p2.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            
            if (dist < size * 0.3) {
              const alpha = (1 - dist / (size * 0.3)) * intensity * 0.3
              ctx.globalAlpha = alpha
              ctx.beginPath()
              ctx.moveTo(p1.x, p1.y)
              ctx.lineTo(p2.x, p2.y)
              ctx.stroke()
              ctx.globalAlpha = 1
            }
          }
        }
      }

      // Center glow pulsing during streaming
      if (isStreaming || intensity > 0.1) {
        const glowSize = size * 0.25 * (1 + intensity * 0.3)
        const gradient = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, glowSize
        )
        gradient.addColorStop(0, `rgba(212, 175, 55, ${intensity * 0.4})`)
        gradient.addColorStop(0.5, `rgba(212, 175, 55, ${intensity * 0.2})`)
        gradient.addColorStop(1, 'rgba(212, 175, 55, 0)')
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(centerX, centerY, glowSize, 0, Math.PI * 2)
        ctx.fill()
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [size, isStreaming, streamingIntensity, mounted])

  if (!mounted) {
    return <div style={{ width: size, height: size }} className={className} />
  }

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Code storm canvas background */}
      <canvas
        ref={canvasRef}
        style={{ 
          width: size, 
          height: size,
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0
        }}
        className="block"
      />
      
      {/* Crowe Logic Raven in the center */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ 
          zIndex: 1,
          filter: `
            brightness(${isStreaming ? 1.8 : 1.3})
            drop-shadow(0 0 ${isStreaming ? '30px' : '15px'} rgba(218,165,32,${isStreaming ? 0.8 : 0.4}))
          `,
          transition: 'filter 0.3s ease-out'
        }}
      >
        <Image
          src="/crowe-logic-logo-transparent.png"
          alt="Crowe Logic"
          width={size * 0.6}
          height={size * 0.6}
          className={`object-contain transition-transform duration-300 ${
            isStreaming ? 'scale-110' : 'scale-100'
          }`}
          priority
        />
      </div>

      {/* Lightning flashes during intense streaming */}
      {isStreaming && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle, rgba(212,175,55,${Math.random() * 0.3}) 0%, transparent 70%)`,
            animation: 'lightning 0.1s infinite',
            zIndex: 2
          }}
        />
      )}

      <style jsx>{`
        @keyframes lightning {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
