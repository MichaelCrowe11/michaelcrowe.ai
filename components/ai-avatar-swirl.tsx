"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

type AvatarState = "idle" | "thinking" | "responding"

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

export interface AIAvatarSwirlProps {
  state: AvatarState
  size?: number
}

export function AIAvatarSwirl({ state, size = 40 }: AIAvatarSwirlProps) {
  const [particles, setParticles] = useState<CodeParticle[]>([])
  const [isBlinking, setIsBlinking] = useState(false)
  const [avatarOpacity, setAvatarOpacity] = useState(1)
  const [reducedMotion, setReducedMotion] = useState(false)

  const codeSnippets = [
    "AI",
    "ML",
    "{}",
    "<>",
    "fn",
    "=>",
    "if",
    "&&",
    "||",
    "++",
    "==",
    "!=",
    "[]",
    "()",
    "//",
    "/*",
    "*/",
    ";;",
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

  useEffect(() => {
    // Respect reduced motion
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
      const apply = () => setReducedMotion(mq.matches)
      apply()
      mq.addEventListener?.('change', apply)
      return () => mq.removeEventListener?.('change', apply)
    }
  }, [])

  useEffect(() => {
    if (state === "thinking" || state === "responding") {
      const blinkInterval = setInterval(() => {
        if (!reducedMotion) {
          setIsBlinking(true)
          setAvatarOpacity(0.3)
        }

        setTimeout(() => {
          setAvatarOpacity(1)
        }, 150)

        setTimeout(() => {
          if (!reducedMotion) setAvatarOpacity(0.5)
        }, 300)

        setTimeout(() => {
          setAvatarOpacity(1)
          setIsBlinking(false)
        }, 450)
      }, state === "thinking" ? 1500 : 2200)

      return () => clearInterval(blinkInterval)
    } else {
      setAvatarOpacity(1)
      setIsBlinking(false)
    }
  }, [state, reducedMotion])

  useEffect(() => {
  const baseCount = state === "thinking" ? 24 : state === "responding" ? 18 : 12
  const particleCount = reducedMotion ? Math.ceil(baseCount * 0.5) : baseCount
    const newParticles: CodeParticle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      code: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
      x: 0,
      y: 0,
      color: colors[i % colors.length],
      speed: (reducedMotion ? 0.6 : 1) * (
        state === "thinking"
          ? 2 + Math.random() * 3
          : state === "responding"
          ? 0.5 + Math.random() * 1
          : 0.5 + Math.random() * 1
      ),
      angle: (i / particleCount) * Math.PI * 2,
      radius: size * 0.8 + Math.random() * (size * 0.4),
      opacity: 1,
      scale: 1,
    }))
    setParticles(newParticles)
  }, [state, size, reducedMotion])

  useEffect(() => {
    let animationFrame: number
    let time = 0

    const animate = () => {
  const speedFactor = reducedMotion ? 0.6 : 1
  time += speedFactor * (state === "thinking" ? 0.05 : state === "responding" ? 0.03 : 0.02)

      setParticles((prev) =>
        prev.map((p) => {
          const newAngle = p.angle + p.speed * 0.02
          let wobble = 0
          let newRadius = p.radius
          let newOpacity = p.opacity
          let newScale = 1

          if (state === "thinking") {
            // Aggressive storm mode - chaotic movement with pulsing
            const rm = reducedMotion ? 0.5 : 1
            wobble = Math.sin(time * 3 + p.id) * (size * 0.3 * rm) + Math.cos(time * 2 + p.id * 0.5) * (size * 0.2 * rm)
            newRadius = p.radius + Math.sin(time * 4 + p.id) * (size * 0.3 * rm)
            newOpacity = 0.75 + Math.sin(time * 5 + p.id) * (0.25 * rm)
            newScale = 1 + Math.sin(time * 3 + p.id) * (0.3 * rm)
          } else if (state === "responding") {
            // Flowing into center - particles spiral inward
            const spiralFactor = Math.sin(time * 2 + p.id * 0.5) * (reducedMotion ? 0.2 : 0.3)
            newRadius = p.radius * (0.8 + spiralFactor)
            newOpacity = 0.85 + Math.sin(time * 3 + p.id) * (reducedMotion ? 0.1 : 0.2)
            newScale = 1 + Math.sin(time * 4 + p.id) * (reducedMotion ? 0.1 : 0.2)
            wobble = Math.sin(time * 2 + p.id) * (size * (reducedMotion ? 0.1 : 0.15))
          } else {
            // Idle mode - gentle rainbow swirl
            wobble = Math.sin(time * 2 + p.id) * (size * (reducedMotion ? 0.1 : 0.15))
            newOpacity = 0.65 + Math.sin(time * 1.5 + p.id) * (reducedMotion ? 0.25 : 0.35)
            newScale = 1 + Math.sin(time * 2 + p.id) * (reducedMotion ? 0.06 : 0.1)
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
  }, [state, size, reducedMotion])

  return (
    <div className="relative" style={{ width: size, height: size }}>
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

      <div
        className={`absolute inset-0 rounded-full p-0.5 transition-all duration-300 ${
          state === "thinking"
            ? "shadow-lg shadow-purple-500/50"
            : state === "responding"
            ? "shadow-lg shadow-cyan-500/50"
            : "shadow-lg shadow-accent/30"
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
          className="rounded-full border-2 border-accent/50"
          priority
        />
      </div>
    </div>
  )
}
