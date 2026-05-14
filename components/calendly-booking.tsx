"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, X, Clock, Video, Loader2 } from "lucide-react"

interface CalendlyBookingProps {
  url?: string
  eventName?: string
  duration?: string
  buttonLabel?: string
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
  className?: string
  prefill?: {
    name?: string
    email?: string
    customAnswers?: Record<string, string>
  }
}

declare global {
  interface Window {
    Calendly: any
  }
}

export function CalendlyBooking({
  url = "https://calendly.com/michaelcrowe/discovery-call",
  eventName = "Discovery Call",
  duration = "30 min",
  buttonLabel = "Book Discovery Call",
  variant = "primary",
  size = "md",
  className = "",
  prefill,
}: CalendlyBookingProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      // Load Calendly script if not already loaded
      if (!document.querySelector('script[src*="calendly.com"]')) {
        const script = document.createElement("script")
        script.src = "https://assets.calendly.com/assets/external/widget.js"
        script.async = true
        script.onload = () => setIsLoading(false)
        document.body.appendChild(script)

        const link = document.createElement("link")
        link.href = "https://assets.calendly.com/assets/external/widget.css"
        link.rel = "stylesheet"
        document.head.appendChild(link)
      } else {
        setIsLoading(false)
      }
    }
  }, [isOpen])

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  const variantClasses = {
    primary: "bg-gradient-to-r from-gold to-accent text-black hover:shadow-2xl hover:shadow-gold/30",
    secondary: "bg-foreground/5 text-foreground hover:bg-gold/10 hover:text-gold border border-border hover:border-gold/40",
    ghost: "text-gold hover:bg-gold/10",
  }

  // Build Calendly URL with prefill data
  const buildCalendlyUrl = () => {
    const params = new URLSearchParams()
    if (prefill?.name) params.append("name", prefill.name)
    if (prefill?.email) params.append("email", prefill.email)
    if (prefill?.customAnswers) {
      Object.entries(prefill.customAnswers).forEach(([key, value]) => {
        params.append(`a${key}`, value)
      })
    }

    // Hide event details for cleaner embed
    params.append("hide_event_type_details", "0")
    params.append("hide_landing_page_details", "0")
    params.append("background_color", "0a0a0a")
    params.append("text_color", "ffffff")
    params.append("primary_color", "c9a961")

    const queryString = params.toString()
    return queryString ? `${url}?${queryString}` : url
  }

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`inline-flex items-center gap-2 rounded-xl font-semibold transition-all duration-300 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      >
        <Calendar className="w-4 h-4" />
        {buttonLabel}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-card border border-gold/20 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-gradient-to-r from-card to-gold/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{eventName}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        Zoom
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-xl hover:bg-muted/30 flex items-center justify-center transition-colors"
                  aria-label="Close booking widget"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="absolute inset-0 top-[73px] flex items-center justify-center bg-card">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-gold animate-spin" />
                    <p className="text-sm text-muted-foreground">Loading calendar...</p>
                  </div>
                </div>
              )}

              {/* Calendly Inline Widget */}
              <div
                className="calendly-inline-widget"
                data-url={buildCalendlyUrl()}
                style={{ minWidth: "320px", height: "700px" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Inline embedded version (no modal)
export function CalendlyInline({
  url = "https://calendly.com/michaelcrowe/discovery-call",
  height = 700,
  prefill,
}: {
  url?: string
  height?: number
  prefill?: CalendlyBookingProps["prefill"]
}) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!document.querySelector('script[src*="calendly.com"]')) {
      const script = document.createElement("script")
      script.src = "https://assets.calendly.com/assets/external/widget.js"
      script.async = true
      script.onload = () => setIsLoading(false)
      document.body.appendChild(script)

      const link = document.createElement("link")
      link.href = "https://assets.calendly.com/assets/external/widget.css"
      link.rel = "stylesheet"
      document.head.appendChild(link)
    } else {
      setIsLoading(false)
    }
  }, [])

  const buildUrl = () => {
    const params = new URLSearchParams()
    if (prefill?.name) params.append("name", prefill.name)
    if (prefill?.email) params.append("email", prefill.email)

    params.append("background_color", "0a0a0a")
    params.append("text_color", "ffffff")
    params.append("primary_color", "c9a961")

    const qs = params.toString()
    return qs ? `${url}?${qs}` : url
  }

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-border/50 bg-card">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-card z-10">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-gold animate-spin" />
            <p className="text-sm text-muted-foreground">Loading calendar...</p>
          </div>
        </div>
      )}

      <div
        className="calendly-inline-widget"
        data-url={buildUrl()}
        style={{ minWidth: "320px", height: `${height}px` }}
      />
    </div>
  )
}
