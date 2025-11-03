"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ShootingStar {
  id: number
  x: number
  y: number
  angle: number
  length: number
  duration: number
}

export function ShootingStars() {
  const [stars, setStars] = useState<ShootingStar[]>([])

  useEffect(() => {
    const createShootingStar = () => {
      const star: ShootingStar = {
        id: Date.now() + Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 50,
        angle: Math.random() * 30 + 30, // 30-60 degrees
        length: Math.random() * 60 + 40,
        duration: Math.random() * 1 + 1,
      }

      setStars((prev) => [...prev, star])

      // Remove after animation
      setTimeout(() => {
        setStars((prev) => prev.filter((s) => s.id !== star.id))
      }, star.duration * 1000)
    }

    // Create shooting stars at random intervals
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance every 2 seconds
        createShootingStar()
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      <AnimatePresence>
        {stars.map((star) => (
          <motion.div
            key={star.id}
            initial={{
              x: `${star.x}%`,
              y: `${star.y}%`,
              opacity: 0,
            }}
            animate={{
              x: `${star.x + 20}%`,
              y: `${star.y + 20}%`,
              opacity: [0, 1, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: star.duration,
              ease: "linear",
            }}
            className="absolute"
          >
            <div
              className="bg-gradient-to-r from-transparent via-white to-transparent"
              style={{
                width: `${star.length}px`,
                height: "2px",
                transform: `rotate(${star.angle}deg)`,
                boxShadow: "0 0 4px 1px rgba(255, 255, 255, 0.5)",
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
