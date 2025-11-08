"use client"

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

interface FlyingRavenProps {
  isActive: boolean // When text is streaming
  targetElement?: HTMLElement | null // The text box to fly to
  onCharacterThrown?: () => void
}

/**
 * Flying Raven Animation
 * - Flies across screen when text is streaming
 * - Throws characters into the text box
 * - Epic flight path with trailing effect
 */
export function FlyingRaven({ isActive, targetElement, onCharacterThrown }: FlyingRavenProps) {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [rotation, setRotation] = useState(0)
  const [visible, setVisible] = useState(false)
  const animationRef = useRef<number | undefined>(undefined)
  const characterTrailRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive || !targetElement) {
      setVisible(false)
      return
    }

    setVisible(true)
    const startTime = Date.now()
    const duration = 2000 // 2 seconds flight time

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Get target position
      const targetRect = targetElement.getBoundingClientRect()
      const targetX = targetRect.left + targetRect.width / 2
      const targetY = targetRect.top + targetRect.height / 2

      // Start from top-left, fly in arc to target
      const startX = window.innerWidth * 0.1
      const startY = window.innerHeight * 0.1
      
      // Bezier curve for smooth flight path
      const t = progress
      const controlX = window.innerWidth * 0.5
      const controlY = window.innerHeight * 0.3
      
      const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * controlX + t * t * targetX
      const y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * controlY + t * t * targetY

      setPosition({ x, y })
      
      // Calculate rotation based on velocity
      const angle = Math.atan2(
        y - position.y,
        x - position.x
      ) * (180 / Math.PI)
      setRotation(angle)

      // Throw character every 100ms
      if (Math.floor(elapsed / 100) > Math.floor((elapsed - 16) / 100)) {
        onCharacterThrown?.()
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setVisible(false)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive, targetElement, onCharacterThrown])

  if (!visible) return null

  return (
    <>
      {/* Flying Raven */}
      <div
        className="fixed pointer-events-none transition-transform duration-75 ease-linear"
        style={{
          left: position.x,
          top: position.y,
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          zIndex: 9999,
          filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.8)) brightness(1.5)',
        }}
      >
        <Image
          src="/crowe-logic-logo-transparent.png"
          alt="Flying Raven"
          width={60}
          height={60}
          className="object-contain"
        />
        
        {/* Trailing glow */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle, rgba(212,175,55,0.6) 0%, transparent 70%)',
            filter: 'blur(10px)',
          }}
        />
      </div>

      {/* Character trail particles */}
      <div ref={characterTrailRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 9998 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-gold font-mono font-bold animate-fade-out"
            style={{
              left: position.x - (i * 20),
              top: position.y + Math.sin(i) * 10,
              fontSize: '16px',
              opacity: 1 - (i * 0.2),
              textShadow: '0 0 10px rgba(212,175,55,0.8)',
            }}
          >
            {String.fromCharCode(65 + Math.floor(Math.random() * 26))}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fade-out {
          to {
            opacity: 0;
            transform: translateY(20px);
          }
        }
        .animate-fade-out {
          animation: fade-out 0.5s ease-out forwards;
        }
      `}</style>
    </>
  )
}
