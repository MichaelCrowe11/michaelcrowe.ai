"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

interface AvatarInterfaceProps {
  isSpeaking?: boolean
  emotion?: "neutral" | "excited" | "curious"
  avatarUrl?: string
}

export function AvatarInterface({
  isSpeaking = false,
  emotion = "neutral",
  avatarUrl = "/professional-headshot.png"
}: AvatarInterfaceProps) {
  const [currentEmotion, setCurrentEmotion] = useState(emotion)

  useEffect(() => {
    setCurrentEmotion(emotion)
  }, [emotion])

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center">
      {/* Avatar Container */}
      <motion.div
        className="relative w-[280px] h-[280px] mx-auto"
        animate={{
          scale: isSpeaking ? [1, 1.02, 1] : 1
        }}
        transition={{
          duration: 0.5,
          repeat: isSpeaking ? Infinity : 0,
          ease: "easeInOut"
        }}
      >
        {/* Pulsing Glow Rings */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(135deg, #C9A961 0%, #8B7355 100%)",
            padding: "10px",
            boxShadow: isSpeaking
              ? "0 0 120px rgba(201, 169, 97, 0.8)"
              : "0 0 80px rgba(201, 169, 97, 0.5)"
          }}
          animate={{
            boxShadow: isSpeaking
              ? [
                  "0 0 80px rgba(201, 169, 97, 0.5)",
                  "0 0 120px rgba(201, 169, 97, 0.8)",
                  "0 0 80px rgba(201, 169, 97, 0.5)"
                ]
              : "0 0 80px rgba(201, 169, 97, 0.5)"
          }}
          transition={{
            duration: 2,
            repeat: isSpeaking ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          {/* Inner Ring */}
          <div
            className="w-full h-full rounded-full"
            style={{
              background: "linear-gradient(135deg, #A0895C 0%, #6D5D48 100%)",
              padding: "4px"
            }}
          >
            {/* Avatar Image */}
            <div className="w-full h-full rounded-full bg-black overflow-hidden relative">
              <Image
                src={avatarUrl}
                alt="Michael Crowe"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </motion.div>

        {/* Outer Pulsing Rings (when speaking) */}
        {isSpeaking && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border-2 border-gold/40"
                initial={{ scale: 1, opacity: 0 }}
                animate={{ scale: [1, 1.3, 1.5], opacity: [0.8, 0.3, 0] }}
                transition={{
                  duration: 2,
                  delay: i * 0.4,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            ))}
          </>
        )}

        {/* Audio Visualizer Bars (when speaking) */}
        {isSpeaking && (
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-end gap-1 h-8">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-gold rounded-full"
                animate={{
                  height: ["8px", "28px", "12px", "28px", "8px"]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Status Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-lg border border-border rounded-full"
      >
        <div className="relative">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <motion.div
            className="absolute inset-0 w-2 h-2 rounded-full bg-green-500"
            animate={{ scale: [1, 1.5], opacity: [1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <span className="text-sm font-medium text-foreground">
          {isSpeaking ? "Speaking..." : "Online & Ready"}
        </span>
      </motion.div>

      {/* Brand Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-6 space-y-2"
      >
        <h1
          className="text-2xl md:text-3xl font-bold text-white"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            textShadow: "0 2px 20px rgba(0, 0, 0, 0.5)"
          }}
        >
          Michael Crowe
        </h1>
        <p
          className="text-base md:text-lg text-muted-foreground"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300
          }}
        >
          AI Systems Architect
        </p>
      </motion.div>
    </div>
  )
}
