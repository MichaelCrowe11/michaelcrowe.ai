"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"

interface CodeParticle {
  id: number
  code: string
  x: number
  y: number
  color: string
  speed: number
  angle: number
  radius: number
  opacity: number
  scale: number
}

type AvatarState = "idle" | "thinking" | "streaming"

interface CroweAvatarProps {
  state?: AvatarState
  size?: number
  className?: string
  cursorPosition?: { x: number; y: number } | null
}

export function CroweAvatar({ 
  state = "idle", 
  size = 80,
  className = "",
  cursorPosition = null
}: CroweAvatarProps) {
  const [particles, setParticles] = useState<CodeParticle[]>([])
  const [isBlinking, setIsBlinking] = useState(false)
  const [avatarOpacity, setAvatarOpacity] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Profound AI/ML code snippets with vibrant colors
  const codeSnippets = [
    { text: "import torch", color: "rgb(168, 85, 247)" }, // purple
    { text: "transformer", color: "rgb(236, 72, 153)" }, // pink
    { text: "neural_net", color: "rgb(59, 130, 246)" }, // blue
    { text: "GPT-4", color: "rgb(250, 204, 21)" }, // gold
    { text: "Claude", color: "rgb(250, 204, 21)" }, // gold
    { text: "embedding", color: "rgb(34, 211, 238)" }, // cyan
    { text: "vector_db", color: "rgb(74, 222, 128)" }, // green
    { text: "fine-tune", color: "rgb(251, 146, 60)" }, // orange
    { text: "inference", color: "rgb(239, 68, 68)" }, // red
    { text: "attention", color: "rgb(168, 85, 247)" }, // purple
    { text: "backprop", color: "rgb(236, 72, 153)" }, // pink
    { text: "gradient", color: "rgb(59, 130, 246)" }, // blue
    { text: "async", color: "rgb(34, 211, 238)" }, // cyan
    { text: "useState", color: "rgb(74, 222, 128)" }, // green
    { text: "useEffect", color: "rgb(74, 222, 128)" }, // green
    { text: "fetch()", color: "rgb(59, 130, 246)" }, // blue
    { text: "=> {}", color: "rgb(34, 211, 238)" }, // cyan
    { text: "import", color: "rgb(168, 85, 247)" }, // purple
  ]

  const colors = [
    "rgb(236, 72, 153)", // pink-500
    "rgb(168, 85, 247)", // purple-500
    "rgb(59, 130, 246)", // blue-500
    "rgb(34, 211, 238)", // cyan-400
    "rgb(74, 222, 128)", // green-400
    "rgb(250, 204, 21)", // yellow-400
    "rgb(251, 146, 60)", // orange-400
    "rgb(239, 68, 68)", // red-500
  ]

  // Smooth avatar movement to cursor position
  useEffect(() => {
    if (!cursorPosition) {
      setPosition({ x: 0, y: 0 })
      return
    }

    const smoothMove = () => {
      setPosition(prev => ({
        x: prev.x + (cursorPosition.x - prev.x) * 0.15,
        y: prev.y + (cursorPosition.y - prev.y) * 0.15,
      }))
    }

    const interval = setInterval(smoothMove, 16)
    return () => clearInterval(interval)
  }, [cursorPosition])

  // Blinking effect during thinking/streaming
  useEffect(() => {
    if (state === "thinking" || state === "streaming") {
      const blinkInterval = setInterval(
        () => {
          setIsBlinking(true)
          setAvatarOpacity(0.3)

          setTimeout(() => setAvatarOpacity(1), 150)
          setTimeout(() => setAvatarOpacity(0.5), 300)
          setTimeout(() => {
            setAvatarOpacity(1)
            setIsBlinking(false)
          }, 450)
        },
        state === "thinking" ? 1200 : 2000,
      )

      return () => clearInterval(blinkInterval)
    } else {
      setAvatarOpacity(1)
      setIsBlinking(false)
    }
  }, [state])

  // Initialize particles based on state
  useEffect(() => {
    const particleCount = state === "thinking" ? 24 : state === "streaming" ? 18 : 12
    const newParticles: CodeParticle[] = Array.from({ length: particleCount }, (_, i) => {
      const snippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)]
      return {
        id: i,
        code: snippet.text,
        x: 0,
        y: 0,
        color: snippet.color,
        speed:
          state === "thinking"
            ? 2 + Math.random() * 3
            : state === "streaming"
              ? 0.5 + Math.random() * 1
              : 0.5 + Math.random() * 1,
        angle: (i / particleCount) * Math.PI * 2,
        radius: size * 0.8 + Math.random() * (size * 0.4),
        opacity: 1,
        scale: 1,
      }
    })
    setParticles(newParticles)
  }, [state, size])

  // Animate particles
  useEffect(() => {
    let animationFrame: number
    let time = 0

    const animate = () => {
      time += state === "thinking" ? 0.05 : state === "streaming" ? 0.03 : 0.02

      setParticles((prev) =>
        prev.map((p, index) => {
          const newAngle = p.angle + p.speed * 0.02
          let wobble = 0
          let newRadius = p.radius
          let newOpacity = p.opacity
          let newScale = 1

          if (state === "thinking") {
            // Aggressive storm mode - chaotic movement with pulsing
            wobble = Math.sin(time * 3 + p.id) * (size * 0.3) + Math.cos(time * 2 + p.id * 0.5) * (size * 0.2)
            newRadius = p.radius + Math.sin(time * 4 + p.id) * (size * 0.3)
            newOpacity = 0.7 + Math.sin(time * 5 + p.id) * 0.3
            newScale = 1 + Math.sin(time * 3 + p.id) * 0.3
          } else if (state === "streaming") {
            // Flowing into center - particles spiral inward then shoot outward
            const spiralFactor = Math.sin(time * 2 + p.id * 0.5) * 0.3
            newRadius = p.radius * (0.8 + spiralFactor)
            newOpacity = 0.8 + Math.sin(time * 3 + p.id) * 0.2
            newScale = 1 + Math.sin(time * 4 + p.id) * 0.2
            wobble = Math.sin(time * 2 + p.id) * (size * 0.15)
          } else {
            // Idle mode - gentle rainbow swirl
            wobble = Math.sin(time * 2 + p.id) * (size * 0.15)
            newOpacity = 0.6 + Math.sin(time * 1.5 + p.id) * 0.4
            newScale = 1 + Math.sin(time * 2 + p.id) * 0.1
          }

          return {
            ...p,
            angle: newAngle,
            radius: newRadius,
            opacity: newOpacity,
            scale: newScale,
            x: Math.cos(newAngle) * (newRadius + wobble),
            y: Math.sin(newAngle) * (newRadius + wobble),
          }
        }),
      )
      animationFrame = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animationFrame)
  }, [state, size])

  return (
    <div 
      ref={containerRef}
      className={`relative transition-all duration-300 ease-out ${className}`}
      style={{ 
        width: size, 
        height: size,
        transform: cursorPosition 
          ? `translate(${position.x}px, ${position.y}px)` 
          : 'translate(0, 0)',
      }}
    >
      {/* Code particle swirl */}
      <div className="absolute inset-0 flex items-center justify-center">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute font-mono text-[8px] font-bold whitespace-nowrap transition-all duration-100 pointer-events-none"
            style={{
              transform: `translate(${particle.x}px, ${particle.y}px) scale(${particle.scale})`,
              color: particle.color,
              opacity: particle.opacity * (isBlinking ? 0.3 : 1),
              textShadow: `0 0 ${state === "thinking" ? "10px" : "6px"} currentColor, 0 0 ${state === "thinking" ? "20px" : "12px"} currentColor`,
              filter: `blur(${state === "thinking" ? "0.5px" : "0px"})`,
            }}
          >
            {particle.code}
          </div>
        ))}
      </div>

      {/* Crowe Logic raven in center */}
      <div
        className={`absolute inset-0 rounded-full p-0.5 transition-all duration-300 ${
          state === "thinking"
            ? "shadow-lg shadow-purple-500/50"
            : state === "streaming"
              ? "shadow-lg shadow-cyan-500/50"
              : "shadow-lg shadow-gold/30"
        }`}
        style={{
          transform: state === "thinking" ? "scale(1.05)" : "scale(1)",
          opacity: avatarOpacity,
        }}
      >
        <Image
          src="/crowe-logic-logo-transparent.png"
          alt="Crowe Logic AI"
          width={size}
          height={size}
          className="rounded-full border-2 border-gold/50"
          priority
        />
      </div>

      {/* Profound code flowing into streaming text */}
      {state === "streaming" && cursorPosition && (
        <div className="absolute pointer-events-none" style={{ 
          left: '50%', 
          top: '50%',
          width: '200px',
          height: '200px',
        }}>
          {[...Array(5)].map((_, i) => (
            <div
              key={`flow-${i}`}
              className="absolute font-mono text-[10px] font-bold animate-code-flow"
              style={{
                left: '50%',
                top: '50%',
                color: colors[i % colors.length],
                opacity: 0.8,
                textShadow: `0 0 8px currentColor`,
                animation: `codeFlow 1.5s ease-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              {codeSnippets[i % codeSnippets.length].text}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes codeFlow {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: translate(100px, -100px) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
