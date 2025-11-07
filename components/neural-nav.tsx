"use client"

import { useEffect, useRef, useState } from "react"
import { Home, Briefcase, Code, Mail, User, Sparkles, Brain } from "lucide-react"

interface NavItem {
  id: string
  label: string
  icon: React.ElementType
  section: string
  color: string
}

interface Neuron {
  x: number
  y: number
  baseY: number
  vx: number
  vy: number
  size: number
  pulsePhase: number
  activity: number
  connections: number[]
}

// Move navItems outside component to prevent re-renders
const NAV_ITEMS: NavItem[] = [
  { id: "hero", label: "Home", icon: Home, section: "hero", color: "218, 165, 32" },
  { id: "services", label: "Services", icon: Briefcase, section: "services", color: "139, 92, 246" },
  { id: "portfolio", label: "Portfolio", icon: Code, section: "portfolio", color: "59, 130, 246" },
  { id: "skills", label: "Skills", icon: Sparkles, section: "skills", color: "236, 72, 153" },
  { id: "about", label: "About", icon: User, section: "about", color: "34, 197, 94" },
  { id: "contact", label: "Contact", icon: Mail, section: "contact", color: "239, 68, 68" },
]

export function NeuralNav() {
  const [activeSection, setActiveSection] = useState("hero")
  const [isExpanded, setIsExpanded] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const neuronsRef = useRef<Neuron[]>([])

  // Neural network animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const updateSize = () => {
      canvas.width = 120
      canvas.height = window.innerHeight
    }
    updateSize()
    window.addEventListener("resize", updateSize)

    // Initialize neurons
    const neurons: Neuron[] = []
    const neuronCount = 50

    for (let i = 0; i < neuronCount; i++) {
      const y = (i / neuronCount) * canvas.height
      neurons.push({
        x: 30 + Math.random() * 60,
        y,
        baseY: y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 3 + 1,
        pulsePhase: Math.random() * Math.PI * 2,
        activity: Math.random(),
        connections: [],
      })
    }

    // Create neural connections
    neurons.forEach((neuron, i) => {
      const nearbyNeurons = neurons
        .map((n, idx) => ({ neuron: n, idx, distance: Math.abs(n.baseY - neuron.baseY) }))
        .filter((n) => n.distance < 150 && n.idx !== i)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3)

      neuron.connections = nearbyNeurons.map((n) => n.idx)
    })

    neuronsRef.current = neurons

    let time = 0
    let animationFrame: number

    const animate = () => {
      time += 0.02
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update neurons
      neurons.forEach((neuron, i) => {
        // Gentle floating motion
        neuron.x += Math.sin(time + neuron.pulsePhase) * 0.2
        neuron.y = neuron.baseY + Math.cos(time * 0.5 + neuron.pulsePhase) * 10

        // Pulse activity
        neuron.activity = 0.3 + Math.sin(time * 2 + neuron.pulsePhase) * 0.3

        // Constrain
        if (neuron.x < 10) neuron.x = 10
        if (neuron.x > canvas.width - 10) neuron.x = canvas.width - 10
      })

      // Draw connections first (behind neurons)
      neurons.forEach((neuron, i) => {
        neuron.connections.forEach((connIdx) => {
          const connected = neurons[connIdx]
          const dx = connected.x - neuron.x
          const dy = connected.y - neuron.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          // Synapse pulse effect
          const pulseIntensity = (Math.sin(time * 3 + i * 0.5) + 1) / 2
          const activity = (neuron.activity + connected.activity) / 2

          // Create gradient for neural signal
          const gradient = ctx.createLinearGradient(neuron.x, neuron.y, connected.x, connected.y)
          gradient.addColorStop(0, `rgba(218, 165, 32, ${activity * pulseIntensity * 0.3})`)
          gradient.addColorStop(0.5, `rgba(139, 92, 246, ${activity * pulseIntensity * 0.5})`)
          gradient.addColorStop(1, `rgba(218, 165, 32, ${activity * pulseIntensity * 0.3})`)

          ctx.strokeStyle = gradient
          ctx.lineWidth = 1 + activity * pulseIntensity
          ctx.beginPath()
          ctx.moveTo(neuron.x, neuron.y)

          // Curved connection for organic feel
          const cpX = (neuron.x + connected.x) / 2 + Math.sin(time + i) * 15
          const cpY = (neuron.y + connected.y) / 2
          ctx.quadraticCurveTo(cpX, cpY, connected.x, connected.y)
          ctx.stroke()

          // Signal traveling along synapse
          if (Math.random() > 0.97) {
            const t = (Math.sin(time * 5 + i) + 1) / 2
            const signalX = neuron.x + (connected.x - neuron.x) * t
            const signalY = neuron.y + (connected.y - neuron.y) * t

            ctx.fillStyle = `rgba(255, 255, 255, 0.8)`
            ctx.beginPath()
            ctx.arc(signalX, signalY, 2, 0, Math.PI * 2)
            ctx.fill()
          }
        })
      })

      // Draw neurons with glow
      neurons.forEach((neuron, i) => {
        const pulse = Math.sin(time * 2 + neuron.pulsePhase) * 0.5 + 0.5

        // Outer glow
        const glowGradient = ctx.createRadialGradient(neuron.x, neuron.y, 0, neuron.x, neuron.y, neuron.size * 6)
        glowGradient.addColorStop(0, `rgba(218, 165, 32, ${neuron.activity * 0.4})`)
        glowGradient.addColorStop(0.5, `rgba(139, 92, 246, ${neuron.activity * 0.2})`)
        glowGradient.addColorStop(1, "rgba(218, 165, 32, 0)")

        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(neuron.x, neuron.y, neuron.size * 6, 0, Math.PI * 2)
        ctx.fill()

        // Core neuron
        const coreGradient = ctx.createRadialGradient(neuron.x, neuron.y, 0, neuron.x, neuron.y, neuron.size)
        coreGradient.addColorStop(0, `rgba(255, 255, 255, ${neuron.activity})`)
        coreGradient.addColorStop(0.5, `rgba(218, 165, 32, ${neuron.activity * 0.8})`)
        coreGradient.addColorStop(1, `rgba(139, 92, 246, ${neuron.activity * 0.5})`)

        ctx.fillStyle = coreGradient
        ctx.beginPath()
        ctx.arc(neuron.x, neuron.y, neuron.size * (1 + pulse * 0.3), 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener("resize", updateSize)
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

    NAV_ITEMS.forEach((item) => {
      const element = document.getElementById(item.section)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, []) // Empty dependency array - NAV_ITEMS is constant

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
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      }}
    >
      {/* Neural Network Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute left-0 top-0 pointer-events-none"
        style={{ width: "120px", height: "100vh" }}
      />

      {/* Navigation Bar */}
      <div
        className={`relative h-full bg-black/40 backdrop-blur-2xl border-r border-gold/10 transition-all duration-700 ease-out overflow-hidden ${
          isExpanded ? "w-72" : "w-24"
        }`}
      >
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-purple-500/5 to-blue-500/10 opacity-50 animate-pulse-slow pointer-events-none" />

        {/* Brain Icon Header */}
        <div className="relative flex items-center justify-center py-8 border-b border-gold/10">
          <div className="relative">
            <Brain className="w-8 h-8 text-gold animate-pulse" />
            <div className="absolute inset-0 blur-xl bg-gold/50 animate-pulse" />
          </div>
          <span
            className={`ml-4 text-sm font-bold gradient-text-gold transition-all duration-700 ${
              isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            Neural Navigation
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="relative flex flex-col items-start justify-center flex-1 py-8 px-3 space-y-1">
          {NAV_ITEMS.map((item, index) => {
            const IconComponent = item.icon as React.ComponentType<{ className?: string; style?: React.CSSProperties }>
            const isActive = activeSection === item.section

            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.section)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    scrollToSection(item.section)
                  }
                }}
                aria-label={`Navigate to ${item.label} section`}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-500 group/item relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-background ${
                  isActive
                    ? "bg-gradient-to-r from-gold/20 via-purple-500/10 to-transparent text-gold shadow-2xl shadow-gold/20 scale-105"
                    : "text-muted-foreground hover:text-white hover:bg-white/5 hover:scale-102"
                }`}
                style={{
                  transitionDelay: `${index * 50}ms`,
                }}
              >
                {/* Morphing background blob */}
                {isActive && (
                  <div
                    className="absolute inset-0 opacity-30 blur-2xl animate-morph"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, rgb(${item.color}) 0%, transparent 70%)`,
                    }}
                  />
                )}

                {/* Icon with 3D effect */}
                <div className="relative z-10">
                  <IconComponent
                    className={`w-6 h-6 transition-all duration-500 ${
                      isActive ? "scale-125 rotate-12" : "group-hover/item:scale-110 group-hover/item:rotate-6"
                    }`}
                    style={{
                      filter: isActive ? `drop-shadow(0 0 8px rgb(${item.color}))` : "none",
                    } as React.CSSProperties}
                  />
                </div>

                {/* Label with stagger effect */}
                <div className="relative z-10 overflow-hidden">
                  <span
                    className={`text-sm font-semibold whitespace-nowrap block transition-all duration-700 ${
                      isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                    }`}
                    style={{
                      transitionDelay: isExpanded ? `${index * 30}ms` : "0ms",
                    }}
                  >
                    {item.label}
                  </span>
                </div>

                {/* Energy pulse on hover */}
                <div
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover/item:h-full transition-all duration-300 rounded-full opacity-0 group-hover/item:opacity-100"
                  style={{
                    background: `linear-gradient(to bottom, transparent, rgb(${item.color}), transparent)`,
                  }}
                />

                {/* Ripple effect on active */}
                {isActive && (
                  <>
                    <div className="absolute inset-0 rounded-xl border-2 opacity-50 animate-ping-slow" style={{ borderColor: `rgb(${item.color})` }} />
                    <div className="absolute inset-0 rounded-xl border opacity-30" style={{ borderColor: `rgb(${item.color})` }} />
                  </>
                )}
              </button>
            )
          })}
        </nav>

        {/* Bottom Thought Cloud */}
        <div className="relative px-4 pb-8">
          <div
            className={`relative p-4 rounded-xl bg-gradient-to-br from-gold/10 to-purple-500/10 border border-gold/20 backdrop-blur-sm transition-all duration-700 ${
              isExpanded ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          >
            <p className="text-xs text-center leading-relaxed">
              <span className="gradient-text-gold font-bold block mb-1">Infinite Mind</span>
              <span className="text-white/60">Every scroll reveals new possibilities</span>
            </p>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-gold rounded-full animate-pulse" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse animation-delay-300" />
          </div>
        </div>
      </div>
    </div>
  )
}
