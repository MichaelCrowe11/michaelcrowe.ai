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

    // Real AI/ML/Web Dev code snippets with syntax highlighting colors
    const codeSnippets = [
      // Python AI/ML - Purple for imports, Blue for libraries
      { text: 'import torch', color: '#C678DD' },
      { text: 'import tensorflow', color: '#C678DD' },
      { text: 'np.array()', color: '#61AFEF' },
      { text: 'model.fit()', color: '#61AFEF' },
      { text: 'df.head()', color: '#98C379' },
      { text: 'sklearn', color: '#E06C75' },
      { text: 'pandas', color: '#E5C07B' },
      { text: 'numpy', color: '#56B6C2' },
      { text: 'keras', color: '#C678DD' },
      { text: 'pytorch', color: '#61AFEF' },
      { text: 'train_test_split', color: '#98C379' },
      { text: 'from transformers', color: '#C678DD' },
      { text: 'import openai', color: '#D19A66' },
      { text: 'import anthropic', color: '#E06C75' },
      { text: '.predict()', color: '#61AFEF' },
      // React/Next.js - Green for hooks, Yellow for keywords
      { text: 'useState', color: '#98C379' },
      { text: 'useEffect', color: '#98C379' },
      { text: 'onClick', color: '#E5C07B' },
      { text: 'className', color: '#D19A66' },
      { text: 'return', color: '#C678DD' },
      { text: 'export default', color: '#C678DD' },
      { text: 'async', color: '#56B6C2' },
      { text: 'await', color: '#56B6C2' },
      { text: 'fetch()', color: '#61AFEF' },
      { text: 'const', color: '#C678DD' },
      { text: 'function', color: '#C678DD' },
      { text: '=>', color: '#56B6C2' },
      { text: 'import', color: '#C678DD' },
      { text: 'React.FC', color: '#E5C07B' },
      { text: '<Component/>', color: '#E06C75' },
      { text: 'props', color: '#D19A66' },
      { text: 'map()', color: '#61AFEF' },
      { text: 'filter()', color: '#61AFEF' },
      // Node.js/JavaScript - Orange for methods, Cyan for keywords
      { text: 'require()', color: '#C678DD' },
      { text: 'module.exports', color: '#E5C07B' },
      { text: 'app.get()', color: '#61AFEF' },
      { text: 'res.json()', color: '#98C379' },
      { text: 'req.body', color: '#D19A66' },
      { text: 'express', color: '#E06C75' },
      { text: 'next', color: '#56B6C2' },
      { text: 'api', color: '#E5C07B' },
      { text: 'POST', color: '#98C379' },
      { text: 'GET', color: '#61AFEF' },
      { text: 'console.log()', color: '#C678DD' },
      // AI specific - Gold for AI names, vibrant for terms
      { text: 'GPT-4', color: '#d4af37' },
      { text: 'Claude', color: '#d4af37' },
      { text: 'embedding', color: '#61AFEF' },
      { text: 'vector', color: '#98C379' },
      { text: 'neural', color: '#E06C75' },
      { text: 'training', color: '#56B6C2' },
      { text: 'inference', color: '#E5C07B' },
      { text: 'tokens', color: '#D19A66' },
      { text: 'prompt', color: '#C678DD' },
      { text: 'completion', color: '#98C379' },
      { text: 'fine-tune', color: '#61AFEF' }
    ]

    // Code particle system with organic spiral motion
    class CodeParticle {
      x: number
      y: number
      text: string
      angle: number
      baseRadius: number
      radiusOffset: number
      speed: number
      opacity: number
      baseOpacity: number
      color: string
      size: number
      orbitSpeed: number
      spiralPhase: number
      layer: number // depth layer for parallax effect

      constructor() {
        const snippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)]
        this.text = snippet.text
        this.color = snippet.color
        
        // Create layered spiral pattern instead of square
        this.layer = Math.floor(Math.random() * 3) // 0, 1, or 2
        this.angle = Math.random() * Math.PI * 2
        this.baseRadius = size * (0.35 + this.layer * 0.15) // Layers at different radii
        this.radiusOffset = 0
        this.speed = 0.008 + Math.random() * 0.015
        this.orbitSpeed = (Math.random() > 0.5 ? 1 : -1) * (0.3 + Math.random() * 0.8)
        this.spiralPhase = Math.random() * Math.PI * 2
        
        this.x = centerX + Math.cos(this.angle) * this.baseRadius
        this.y = centerY + Math.sin(this.angle) * this.baseRadius
        
        this.baseOpacity = 0.4 + Math.random() * 0.3
        this.opacity = this.baseOpacity
        this.size = 9 + Math.random() * 4 - this.layer // Smaller particles in outer layers
      }

      update(streamingActive: boolean, intensity: number) {
        // Smooth spiral orbit with organic wave motion
        this.angle += this.speed * this.orbitSpeed * (streamingActive ? 2.5 : 1)
        this.spiralPhase += 0.02
        
        // Create organic breathing motion
        const breathe = Math.sin(timeRef.current * 1.5 + this.spiralPhase) * size * 0.08
        const streamingPulse = streamingActive ? Math.sin(timeRef.current * 4 + this.angle) * size * 0.15 * intensity : 0
        
        this.radiusOffset = breathe + streamingPulse
        const currentRadius = this.baseRadius + this.radiusOffset
        
        // Organic spiral pattern (not circular, more natural)
        const spiralWave = Math.sin(this.angle * 3 + this.spiralPhase) * size * 0.05
        this.x = centerX + Math.cos(this.angle) * currentRadius + spiralWave
        this.y = centerY + Math.sin(this.angle) * currentRadius + spiralWave * 0.7
        
        // Smooth opacity transitions
        if (streamingActive) {
          const targetOpacity = 0.6 + Math.sin(timeRef.current * 3 + this.angle) * 0.4 * intensity
          this.opacity = this.opacity * 0.9 + targetOpacity * 0.1
        } else {
          this.opacity = this.opacity * 0.95 + this.baseOpacity * 0.05
        }

        // Occasionally change character during intense streaming
        if (streamingActive && intensity > 0.6 && Math.random() > 0.97) {
          const snippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)]
          this.text = snippet.text
          this.color = snippet.color
        }
      }

      draw(ctx: CanvasRenderingContext2D, glowIntensity: number) {
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.fillStyle = this.color
        ctx.font = `${this.size}px "Fira Code", monospace`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        
        // Vibrant glow effect with color-matched shadows
        if (glowIntensity > 0.2) {
          ctx.shadowBlur = 20 * glowIntensity
          ctx.shadowColor = this.color
        }
        
        // Add subtle rotation based on velocity for dynamic feel
        const rotation = this.angle * 0.1
        ctx.translate(this.x, this.y)
        ctx.rotate(rotation)
        ctx.fillText(this.text, 0, 0)
        
        ctx.restore()
      }
    }

    // Initialize code particles - more for richer swirl
    const particleCount = 40
    if (codeParticlesRef.current.length === 0) {
      for (let i = 0; i < particleCount; i++) {
        codeParticlesRef.current.push(new CodeParticle())
      }
    }

    const animate = () => {
      timeRef.current += 0.016 // ~60fps

      // Clear canvas with subtle fade for particle trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
      ctx.fillRect(0, 0, size, size)

      // Calculate intensity based on streaming state
      const intensity = isStreaming ? (0.5 + Math.sin(timeRef.current * 3) * 0.5) : streamingIntensity

      // Draw outer energy rings during streaming - organic shape
      if (isStreaming || intensity > 0.1) {
        for (let ring = 0; ring < 3; ring++) {
          const ringRadius = size * (0.4 + ring * 0.08)
          const ringOpacity = intensity * (0.15 - ring * 0.04)
          
          // Create organic ring with sine wave distortion
          ctx.strokeStyle = `rgba(212, 175, 55, ${ringOpacity})`
          ctx.lineWidth = 2
          ctx.beginPath()
          
          for (let i = 0; i <= 360; i += 5) {
            const angle = (i * Math.PI) / 180
            const wave = Math.sin(angle * 4 + timeRef.current + ring) * size * 0.03
            const r = ringRadius + wave
            const x = centerX + Math.cos(angle) * r
            const y = centerY + Math.sin(angle) * r
            
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.closePath()
          ctx.stroke()
        }
      }

      // Sort particles by layer for proper depth rendering
      const sortedParticles = [...codeParticlesRef.current].sort((a, b) => b.layer - a.layer)

      // Draw code storm with vibrant colors
      sortedParticles.forEach(particle => {
        particle.update(isStreaming, intensity)
        particle.draw(ctx, intensity)
      })

      // Add more particles during intense streaming
      if (isStreaming && intensity > 0.7 && codeParticlesRef.current.length < 60) {
        codeParticlesRef.current.push(new CodeParticle())
      }

      // Remove excess particles when calming down
      if (!isStreaming && codeParticlesRef.current.length > particleCount) {
        codeParticlesRef.current = codeParticlesRef.current.slice(0, particleCount)
      }

      // Draw flowing connection lines between nearby particles
      if (isStreaming || intensity > 0.3) {
        for (let i = 0; i < codeParticlesRef.current.length; i++) {
          for (let j = i + 1; j < codeParticlesRef.current.length; j++) {
            const p1 = codeParticlesRef.current[i]
            const p2 = codeParticlesRef.current[j]
            
            // Only connect particles in same or adjacent layers
            if (Math.abs(p1.layer - p2.layer) > 1) continue
            
            const dx = p1.x - p2.x
            const dy = p1.y - p2.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            
            if (dist < size * 0.25) {
              const alpha = (1 - dist / (size * 0.25)) * intensity * 0.4
              // Blend colors of connected particles
              const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y)
              gradient.addColorStop(0, p1.color)
              gradient.addColorStop(1, p2.color)
              
              ctx.globalAlpha = alpha
              ctx.strokeStyle = gradient
              ctx.lineWidth = 1.5
              ctx.beginPath()
              ctx.moveTo(p1.x, p1.y)
              ctx.lineTo(p2.x, p2.y)
              ctx.stroke()
              ctx.globalAlpha = 1
            }
          }
        }
      }

      // Center glow pulsing during streaming - organic breathing
      if (isStreaming || intensity > 0.1) {
        const glowSize = size * 0.3 * (1 + intensity * 0.4)
        const gradient = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, glowSize
        )
        gradient.addColorStop(0, `rgba(212, 175, 55, ${intensity * 0.5})`)
        gradient.addColorStop(0.4, `rgba(212, 175, 55, ${intensity * 0.25})`)
        gradient.addColorStop(0.7, `rgba(100, 150, 255, ${intensity * 0.1})`) // Blue accent
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
