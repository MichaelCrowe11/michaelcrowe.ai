"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface Star {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  opacity: number
}

export function StarfieldBackgroundSimple() {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    // Generate 11,111 stars for epic cosmic density
    const generatedStars: Star[] = []
    for (let i = 0; i < 11111; i++) {
      generatedStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.5 + 0.3,
        duration: Math.random() * 5 + 3,
        delay: Math.random() * 10,
        opacity: Math.random() * 0.5 + 0.1,
      })
    }
    setStars(generatedStars)
  }, [])

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, star.opacity, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
