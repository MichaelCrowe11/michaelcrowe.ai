"use client"

import { useEffect, useRef, useState } from "react"
import { Home, Briefcase, Code, Mail, User, Sparkles } from "lucide-react"

interface NavItem {
  id: string
  label: string
  icon: React.ElementType
  section: string
}

export function SideNav() {
  const [activeSection, setActiveSection] = useState("hero")
  const [isExpanded, setIsExpanded] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const navItems: NavItem[] = [
    { id: "hero", label: "Home", icon: Home, section: "hero" },
    { id: "services", label: "Services", icon: Briefcase, section: "services" },
    { id: "portfolio", label: "Portfolio", icon: Code, section: "portfolio" },
    { id: "skills", label: "Skills", icon: Sparkles, section: "skills" },
    { id: "about", label: "About", icon: User, section: "about" },
    { id: "contact", label: "Contact", icon: Mail, section: "contact" },
  ]

  // Particle animation for canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 100
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
    }> = []

    // Create particles
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      })
    }

    let animationFrame: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, i) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Draw particle
        ctx.fillStyle = `rgba(218, 165, 32, ${particle.opacity})`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        // Draw connections
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 80) {
            ctx.strokeStyle = `rgba(218, 165, 32, ${0.1 * (1 - distance / 80)})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
          }
        })
      })

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  // Intersection Observer for active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute("id")
            if (sectionId) {
              setActiveSection(sectionId)
            }
          }
        })
      },
      { threshold: 0.3 }
    )

    navItems.forEach((item) => {
      const element = document.getElementById(item.section)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [navItems])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div
      className="fixed left-0 top-0 h-screen z-50 group"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Particle Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute left-0 top-0 pointer-events-none opacity-60"
        style={{ width: "100px", height: "100vh" }}
      />

      {/* Navigation Bar */}
      <div
        className={`relative h-full bg-background/80 backdrop-blur-xl border-r border-gold/20 transition-all duration-500 ease-out ${
          isExpanded ? "w-64" : "w-20"
        }`}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-accent/5 pointer-events-none" />

        {/* Navigation Items */}
        <nav className="relative flex flex-col items-start justify-center h-full py-8 px-4 space-y-2">
          {navItems.map((item) => {
            const IconComponent = item.icon as React.ComponentType<{ className?: string }>
            const isActive = activeSection === item.section

            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.section)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 group/item relative overflow-hidden ${
                  isActive
                    ? "bg-gold/20 text-gold shadow-lg shadow-gold/20"
                    : "text-muted-foreground hover:text-gold hover:bg-gold/10"
                }`}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gold via-gold to-transparent" />
                )}

                {/* Icon */}
                <div className="relative">
                  <IconComponent className={`w-6 h-6 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover/item:scale-110"}`} />
                  {isActive && (
                    <div className="absolute inset-0 blur-md bg-gold/50 animate-pulse" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-sm font-medium whitespace-nowrap transition-all duration-500 ${
                    isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  }`}
                >
                  {item.label}
                </span>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 translate-x-[-100%] group-hover/item:translate-x-[100%] transition-transform duration-700" />
              </button>
            )
          })}
        </nav>

        {/* Bottom Branding */}
        <div className="absolute bottom-8 left-0 right-0 px-4">
          <div
            className={`text-xs text-muted-foreground text-center transition-all duration-500 ${
              isExpanded ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="gradient-text-gold font-semibold">Infinite Possibilities</span>
          </div>
        </div>
      </div>
    </div>
  )
}
