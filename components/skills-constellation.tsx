"use client"

import { useEffect, useRef, useState } from "react"
import { Brain, Code, Database, Sparkles, Zap, Cpu } from "lucide-react"

interface Skill {
  name: string
  level: number
  category: string
  icon: React.ElementType
  color: string
  description: string
}

interface Star {
  x: number
  y: number
  baseX: number
  baseY: number
  size: number
  opacity: number
  pulsePhase: number
  skill: Skill
}

export function SkillsConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const starsRef = useRef<Star[]>([])

  const skills: Skill[] = [
    // AI/ML
    {
      name: "AI/Machine Learning",
      level: 95,
      category: "AI/ML",
      icon: Brain,
      color: "139, 92, 246",
      description: "GPT-4, Claude, custom AI systems, prompt engineering",
    },
    {
      name: "Natural Language Processing",
      level: 90,
      category: "AI/ML",
      icon: Sparkles,
      color: "236, 72, 153",
      description: "Chatbots, voice AI, sentiment analysis, text generation",
    },

    // Full-Stack Development
    {
      name: "React & Next.js",
      level: 95,
      category: "Frontend",
      icon: Code,
      color: "59, 130, 246",
      description: "Advanced React patterns, SSR, performance optimization",
    },
    {
      name: "TypeScript",
      level: 90,
      category: "Frontend",
      icon: Code,
      color: "14, 165, 233",
      description: "Type-safe development, advanced patterns, tooling",
    },
    {
      name: "Node.js & APIs",
      level: 90,
      category: "Backend",
      icon: Cpu,
      color: "34, 197, 94",
      description: "RESTful APIs, GraphQL, microservices, serverless",
    },
    {
      name: "Database Design",
      level: 85,
      category: "Backend",
      icon: Database,
      color: "22, 163, 74",
      description: "PostgreSQL, MongoDB, Redis, data modeling",
    },

    // Creative & Design
    {
      name: "WebGL & Three.js",
      level: 85,
      category: "Creative",
      icon: Sparkles,
      color: "218, 165, 32",
      description: "3D graphics, shaders, particle systems, animations",
    },
    {
      name: "UI/UX Design",
      level: 88,
      category: "Creative",
      icon: Sparkles,
      color: "251, 191, 36",
      description: "Figma, design systems, user research, prototyping",
    },

    // Data & Analytics
    {
      name: "Data Science",
      level: 80,
      category: "Data",
      icon: Brain,
      color: "168, 85, 247",
      description: "Python, Pandas, data visualization, predictive models",
    },
    {
      name: "Business Analytics",
      level: 85,
      category: "Data",
      icon: Zap,
      color: "217, 70, 239",
      description: "Metrics, KPIs, dashboards, actionable insights",
    },

    // Automation & Integration
    {
      name: "Process Automation",
      level: 92,
      category: "Automation",
      icon: Zap,
      color: "239, 68, 68",
      description: "Workflow automation, API integrations, task scheduling",
    },
    {
      name: "DevOps & Cloud",
      level: 80,
      category: "Automation",
      icon: Cpu,
      color: "234, 88, 12",
      description: "AWS, Docker, CI/CD, infrastructure as code",
    },
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const updateSize = () => {
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }
    updateSize()

    // Create constellation stars from skills
    const stars: Star[] = []
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(canvas.width, canvas.height) * 0.35

    skills.forEach((skill, index) => {
      const angle = (index / skills.length) * Math.PI * 2 - Math.PI / 2
      const distance = radius * (0.7 + Math.random() * 0.3)
      const x = centerX + Math.cos(angle) * distance
      const y = centerY + Math.sin(angle) * distance

      stars.push({
        x,
        y,
        baseX: x,
        baseY: y,
        size: 2 + (skill.level / 100) * 3,
        opacity: 0.6 + (skill.level / 100) * 0.4,
        pulsePhase: Math.random() * Math.PI * 2,
        skill,
      })
    })

    starsRef.current = stars

    let time = 0
    let animationFrame: number

    const animate = () => {
      time += 0.01
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw constellation lines
      stars.forEach((star, i) => {
        // Connect to nearby stars in same or related categories
        stars.slice(i + 1).forEach((otherStar) => {
          const dx = star.x - otherStar.x
          const dy = star.y - otherStar.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          const sameCategory = star.skill.category === otherStar.skill.category
          const maxDistance = sameCategory ? 250 : 150

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.3
            const gradient = ctx.createLinearGradient(star.x, star.y, otherStar.x, otherStar.y)
            gradient.addColorStop(0, `rgba(${star.skill.color}, ${opacity})`)
            gradient.addColorStop(1, `rgba(${otherStar.skill.color}, ${opacity})`)

            ctx.strokeStyle = gradient
            ctx.lineWidth = sameCategory ? 1.5 : 0.5
            ctx.beginPath()
            ctx.moveTo(star.x, star.y)
            ctx.lineTo(otherStar.x, otherStar.y)
            ctx.stroke()
          }
        })
      })

      // Update and draw stars
      stars.forEach((star) => {
        // Gentle orbital motion
        const orbitSpeed = 0.1
        const angle = time * orbitSpeed + star.pulsePhase
        star.x = star.baseX + Math.cos(angle) * 5
        star.y = star.baseY + Math.sin(angle) * 5

        // Mouse interaction
        const dx = mousePos.x - star.x
        const dy = mousePos.y - star.y
        const distToMouse = Math.sqrt(dx * dx + dy * dy)

        if (distToMouse < 100) {
          const force = (100 - distToMouse) / 100
          star.x -= (dx / distToMouse) * force * 20
          star.y -= (dy / distToMouse) * force * 20
        }

        // Pulse effect
        const pulse = Math.sin(time * 2 + star.pulsePhase) * 0.3 + 0.7

        // Draw glow
        const glowGradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 8)
        glowGradient.addColorStop(0, `rgba(${star.skill.color}, ${star.opacity * 0.5 * pulse})`)
        glowGradient.addColorStop(1, `rgba(${star.skill.color}, 0)`)

        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * 8, 0, Math.PI * 2)
        ctx.fill()

        // Draw star core
        const coreGradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size)
        coreGradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`)
        coreGradient.addColorStop(0.5, `rgba(${star.skill.color}, ${star.opacity * 0.8})`)
        coreGradient.addColorStop(1, `rgba(${star.skill.color}, ${star.opacity * 0.5})`)

        ctx.fillStyle = coreGradient
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * pulse, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      updateSize()
      // Recalculate star positions on resize
      const newCenterX = canvas.width / 2
      const newCenterY = canvas.height / 2
      const newRadius = Math.min(canvas.width, canvas.height) * 0.35

      stars.forEach((star, index) => {
        const angle = (index / skills.length) * Math.PI * 2 - Math.PI / 2
        const distance = newRadius * (0.7 + Math.random() * 0.3)
        star.baseX = newCenterX + Math.cos(angle) * distance
        star.baseY = newCenterY + Math.sin(angle) * distance
      })
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener("resize", handleResize)
    }
  }, [mousePos, skills])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })

    // Check if hovering over a skill star
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    let foundSkill: Skill | null = null
    starsRef.current.forEach((star) => {
      const dx = x - star.x
      const dy = y - star.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < star.size * 8) {
        foundSkill = star.skill
      }
    })

    setHoveredSkill(foundSkill)
  }

  // Group skills by category for the legend
  const categories = Array.from(new Set(skills.map((s) => s.category)))

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-background ml-0 lg:ml-24">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            Skills <span className="gradient-text-gold">Constellation</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Each star represents a skill in my universe. Hover to explore the connections.
          </p>
        </div>

        {/* Interactive Constellation */}
        <div
          ref={containerRef}
          className="relative w-full h-[600px] rounded-2xl bg-gradient-to-br from-black via-gray-900 to-black border border-gold/20 overflow-hidden mb-12"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredSkill(null)}
        >
          <canvas ref={canvasRef} className="absolute inset-0" />

          {/* Hovered Skill Tooltip */}
          {hoveredSkill && (
            <div
              className="absolute pointer-events-none transition-all duration-200"
              style={{
                left: mousePos.x + 20,
                top: mousePos.y + 20,
              }}
            >
              <div className="bg-black/90 backdrop-blur-xl border rounded-lg p-4 shadow-2xl max-w-xs" style={{ borderColor: `rgb(${hoveredSkill.color})` }}>
                <div className="flex items-center gap-3 mb-2">
                  <hoveredSkill.icon className="w-5 h-5" style={{ color: `rgb(${hoveredSkill.color})` }} />
                  <h4 className="font-bold text-white">{hoveredSkill.name}</h4>
                </div>
                <p className="text-sm text-gray-300 mb-3">{hoveredSkill.description}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${hoveredSkill.level}%`,
                        background: `linear-gradient(90deg, rgb(${hoveredSkill.color}), rgba(${hoveredSkill.color}, 0.6))`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold" style={{ color: `rgb(${hoveredSkill.color})` }}>
                    {hoveredSkill.level}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Category Legend */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-3 justify-center">
            {categories.map((category) => {
              const categorySkill = skills.find((s) => s.category === category)!
              return (
                <div
                  key={category}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border text-xs font-medium"
                  style={{ borderColor: `rgba(${categorySkill.color}, 0.3)` }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: `rgb(${categorySkill.color})`, boxShadow: `0 0 8px rgb(${categorySkill.color})` }}
                  />
                  <span className="text-white">{category}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Skill Categories Breakdown */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const categorySkills = skills.filter((s) => s.category === category)
            const firstSkill = categorySkills[0]

            return (
              <div
                key={category}
                className="premium-card p-6 hover:scale-105 transition-transform duration-300"
                style={{
                  borderTop: `2px solid rgb(${firstSkill.color})`,
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: `rgba(${firstSkill.color}, 0.1)` }}
                  >
                    <firstSkill.icon className="w-5 h-5" style={{ color: `rgb(${firstSkill.color})` }} />
                  </div>
                  <h3 className="font-bold text-lg">{category}</h3>
                </div>
                <ul className="space-y-2">
                  {categorySkills.map((skill) => (
                    <li key={skill.name} className="text-sm text-muted-foreground flex items-center justify-between">
                      <span>{skill.name}</span>
                      <span className="font-semibold" style={{ color: `rgb(${skill.color})` }}>
                        {skill.level}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
