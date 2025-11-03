"use client"

import { useState } from "react"
import { MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function ChatAvatar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            className="h-16 w-16 rounded-full bg-gold text-gold-foreground hover:bg-gold/90 shadow-2xl shadow-gold/30 animate-bounce-subtle"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
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
