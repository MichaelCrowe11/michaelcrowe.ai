"use client"

import { useEffect, useRef, useState } from 'react'

interface AnimatedAIAvatarProps {
  isStreaming?: boolean
  audioAmplitude?: number
  size?: number
  className?: string
}

/**
 * Spectacular AI Avatar with creative animations
 * - Responds to text streaming with particle bursts
 * - Audio-reactive pulsing during voice output
 * - Rotating energy rings with shimmer effects
 * - Neural network-style connection lines
 */
export function AnimatedAIAvatar({ 
  isStreaming = false, 
  audioAmplitude = 0,
  size = 120,
  className = "" 
}: AnimatedAIAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | undefined>()
  const particlesRef = useRef<any[]>([])
  const timeRef = useRef(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size for retina displays
    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const centerX = size / 2
    const centerY = size / 2

    // Particle system
    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      life: number
      maxLife: number
      color: string
      size: number

      constructor() {
        const angle = Math.random() * Math.PI * 2
        const velocity = 1 + Math.random() * 2
        this.x = centerX
        this.y = centerY
        this.vx = Math.cos(angle) * velocity
        this.vy = Math.sin(angle) * velocity
        this.maxLife = 60 + Math.random() * 40
        this.life = this.maxLife
        this.color = Math.random() > 0.5 ? '#d4af37' : '#ffffff'
        this.size = 1 + Math.random() * 2
      }

      update() {
        this.x += this.vx
        this.y += this.vy
        this.life--
        this.vy += 0.05 // Slight gravity
      }

      draw(ctx: CanvasRenderingContext2D) {
        const alpha = this.life / this.maxLife
        ctx.save()
        ctx.globalAlpha = alpha * 0.8
        ctx.fillStyle = this.color
        ctx.shadowBlur = 10
        ctx.shadowColor = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      isDead() {
        return this.life <= 0
      }
    }

    // Neural network nodes
    const nodes: { x: number; y: number; angle: number; radius: number; speed: number }[] = []
    for (let i = 0; i < 8; i++) {
      nodes.push({
        x: 0,
        y: 0,
        angle: (i / 8) * Math.PI * 2,
        radius: size * 0.3,
        speed: 0.01 + Math.random() * 0.01,
      })
    }

    const animate = () => {
      timeRef.current += 0.016 // ~60fps

      // Clear canvas
      ctx.clearRect(0, 0, size, size)

      // Calculate pulsing scale based on audio or streaming
      const basePulse = Math.sin(timeRef.current * 2) * 0.05
      const audioPulse = audioAmplitude * 0.3
      const streamPulse = isStreaming ? Math.sin(timeRef.current * 4) * 0.1 : 0
      const scale = 1 + basePulse + audioPulse + streamPulse

      // Draw outer rotating rings
      for (let ring = 0; ring < 3; ring++) {
        const ringRadius = (size * 0.4) * (1 + ring * 0.15)
        const rotation = timeRef.current * (0.5 + ring * 0.3)
        const segments = 12 + ring * 4

        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(rotation)

        for (let i = 0; i < segments; i++) {
          const angle = (i / segments) * Math.PI * 2
          const x = Math.cos(angle) * ringRadius
          const y = Math.sin(angle) * ringRadius
          
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, 3)
          gradient.addColorStop(0, ring === 1 ? '#d4af37' : 'rgba(212, 175, 55, 0.3)')
          gradient.addColorStop(1, 'rgba(212, 175, 55, 0)')
          
          ctx.fillStyle = gradient
          ctx.shadowBlur = 15
          ctx.shadowColor = '#d4af37'
          ctx.beginPath()
          ctx.arc(x, y, 2 + ring, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.restore()
      }

      // Draw neural network connections
      ctx.save()
      ctx.translate(centerX, centerY)
      
      // Update node positions
      nodes.forEach(node => {
        node.angle += node.speed
        node.x = Math.cos(node.angle) * node.radius
        node.y = Math.sin(node.angle) * node.radius
      })

      // Draw connections between nearby nodes
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)'
      ctx.lineWidth = 1
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          
          if (dist < size * 0.4) {
            const alpha = 1 - (dist / (size * 0.4))
            ctx.globalAlpha = alpha * 0.3
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }
      ctx.globalAlpha = 1

      // Draw nodes
      nodes.forEach(node => {
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 4)
        gradient.addColorStop(0, '#ffffff')
        gradient.addColorStop(1, '#d4af37')
        
        ctx.fillStyle = gradient
        ctx.shadowBlur = 10
        ctx.shadowColor = '#d4af37'
        ctx.beginPath()
        ctx.arc(node.x, node.y, 3, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.restore()

      // Draw core sphere with pulsing glow
      const coreRadius = (size * 0.2) * scale
      
      // Outer glow
      const glowGradient = ctx.createRadialGradient(
        centerX, centerY, coreRadius * 0.5,
        centerX, centerY, coreRadius * 2
      )
      glowGradient.addColorStop(0, 'rgba(212, 175, 55, 0.4)')
      glowGradient.addColorStop(0.5, 'rgba(212, 175, 55, 0.2)')
      glowGradient.addColorStop(1, 'rgba(212, 175, 55, 0)')
      
      ctx.fillStyle = glowGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, coreRadius * 2, 0, Math.PI * 2)
      ctx.fill()

      // Core sphere
      const coreGradient = ctx.createRadialGradient(
        centerX - coreRadius * 0.3, 
        centerY - coreRadius * 0.3, 
        0,
        centerX, 
        centerY, 
        coreRadius
      )
      coreGradient.addColorStop(0, '#ffffff')
      coreGradient.addColorStop(0.3, '#f4e4a6')
      coreGradient.addColorStop(0.7, '#d4af37')
      coreGradient.addColorStop(1, '#c9a22a')
      
      ctx.fillStyle = coreGradient
      ctx.shadowBlur = 20
      ctx.shadowColor = '#d4af37'
      ctx.beginPath()
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2)
      ctx.fill()

      // Core highlight
      const highlightGradient = ctx.createRadialGradient(
        centerX - coreRadius * 0.4,
        centerY - coreRadius * 0.4,
        0,
        centerX - coreRadius * 0.3,
        centerY - coreRadius * 0.3,
        coreRadius * 0.5
      )
      highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)')
      highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      
      ctx.fillStyle = highlightGradient
      ctx.beginPath()
      ctx.arc(
        centerX - coreRadius * 0.3,
        centerY - coreRadius * 0.3,
        coreRadius * 0.5,
        0,
        Math.PI * 2
      )
      ctx.fill()

      // Particle burst when streaming
      if (isStreaming && Math.random() > 0.7) {
        for (let i = 0; i < 3; i++) {
          particlesRef.current.push(new Particle())
        }
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.update()
        p.draw(ctx)
        return !p.isDead()
      })

      // Energy wave when streaming
      if (isStreaming) {
        const waveRadius = (size * 0.25) + Math.sin(timeRef.current * 3) * (size * 0.1)
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)'
        ctx.lineWidth = 2
        ctx.shadowBlur = 15
        ctx.shadowColor = '#d4af37'
        ctx.beginPath()
        ctx.arc(centerX, centerY, waveRadius, 0, Math.PI * 2)
        ctx.stroke()
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [size, isStreaming, audioAmplitude, mounted])

  if (!mounted) {
    return <div style={{ width: size, height: size }} className={className} />
  }

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="block"
      />
    </div>
  )
}
