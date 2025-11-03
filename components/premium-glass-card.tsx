"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface PremiumGlassCardProps {
  children: ReactNode
  className?: string
  delay?: number
  glowColor?: "gold" | "blue" | "purple"
}

export function PremiumGlassCard({
  children,
  className = "",
  delay = 0,
  glowColor = "gold"
}: PremiumGlassCardProps) {
  const glowColors = {
    gold: "rgba(218, 165, 32, 0.3)",
    blue: "rgba(65, 105, 225, 0.3)",
    purple: "rgba(138, 43, 226, 0.3)",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        scale: 1.03,
        y: -8,
        transition: { duration: 0.3 },
      }}
      className={`relative group ${className}`}
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at center, ${glowColors[glowColor]}, transparent 70%)`,
        }}
      />

      {/* Glass card */}
      <div className="relative glass-card rounded-2xl p-8 backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 shadow-2xl overflow-hidden">
        {/* Animated border gradient */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${glowColors[glowColor]}, transparent, ${glowColors[glowColor]})`,
            backgroundSize: "200% 200%",
          }}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100"
          initial={{ x: "-100%" }}
          whileHover={{
            x: "100%",
            transition: { duration: 0.6, ease: "easeInOut" },
          }}
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)",
          }}
        />

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    </motion.div>
  )
}
