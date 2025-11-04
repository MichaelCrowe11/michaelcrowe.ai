"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

export function ChatAvatar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Chat Button with Logo and Diamond Effects */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <motion.button
            onClick={() => setIsOpen(true)}
            className="relative h-20 w-20 rounded-full overflow-hidden group"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              y: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            {/* Diamond border with animation */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold via-white to-accent p-[3px]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold via-white to-accent opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
            </div>

            {/* Sparkle particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-white rounded-full"
                style={{
                  left: `${50 + Math.cos((i / 8) * Math.PI * 2) * 35}%`,
                  top: `${50 + Math.sin((i / 8) * Math.PI * 2) * 35}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.25,
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* Logo Container */}
            <div className="absolute inset-[3px] rounded-full bg-black flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(218,165,32,0.5),0_0_60px_rgba(218,165,32,0.3)]">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/crowe-logic-logo-87FZNrbBWYjPIm7AaAVgQ2TQIx435b.png"
                alt="Chat with Michael Crowe"
                width={64}
                height={64}
                className="w-14 h-14 object-contain transition-transform group-hover:scale-110"
              />

              {/* Rotating shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>

            {/* Pulsing ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-gold"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.7, 0, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          </motion.button>
        )}
      </div>

      {/* Chat Card */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-2xl animate-slide-up">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-border bg-muted/50 rounded-t-2xl">
            <div className="relative">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/crowe-logic-logo-87FZNrbBWYjPIm7AaAVgQ2TQIx435b.png"
                alt="Michael Crowe"
                className="w-12 h-12 rounded-full border-2 border-gold"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Michael Crowe</h3>
              <p className="text-xs text-muted-foreground">AI Systems Architect</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 rounded-full hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Message Content */}
          <div className="p-6 space-y-4">
            <div className="bg-muted/50 rounded-2xl rounded-tl-none p-4">
              <p className="text-sm leading-relaxed">
                Hey there! I&apos;m Michael. I help small businesses like yours implement AI automation that actually
                drives results.
              </p>
            </div>
            <div className="bg-muted/50 rounded-2xl rounded-tl-none p-4">
              <p className="text-sm leading-relaxed">
                Want to chat about how AI can help your business? Let&apos;s schedule a free consultation.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="p-4 border-t border-border space-y-2">
            <Button asChild className="w-full bg-gold text-gold-foreground hover:bg-gold/90">
              <Link href="#contact">Schedule Free Consultation</Link>
            </Button>
            <Button asChild variant="outline" className="w-full border-gold text-gold hover:bg-gold/10 bg-transparent">
              <Link href="#services">View Services</Link>
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
