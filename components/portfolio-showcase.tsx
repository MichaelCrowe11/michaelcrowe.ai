"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, Github, Play, Code2, Sparkles } from "lucide-react"
import Link from "next/link"

interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  image: string
  color: string
  category: string
  highlights: string[]
}

export function PortfolioShowcase() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const projects: Project[] = [
    {
      id: "southwest-mushrooms",
      title: "Southwest Mushrooms E-Commerce Platform",
      description: "Full-stack e-commerce system serving millions globally",
      longDescription:
        "Built from scratch a complete e-commerce platform that scaled to $470K annually, serving customers across 7 continents. Features include real-time inventory management, automated climate control integration, customer order processing, and analytics dashboard.",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "AWS", "IoT Integration"],
      image: "/placeholder-mushroom.jpg",
      color: "34, 197, 94",
      category: "Full-Stack",
      highlights: [
        "Scaled to serve millions of customers",
        "Automated inventory & climate control",
        "$470K annual revenue",
        "Multi-continent shipping logistics",
      ],
    },
    {
      id: "ai-restaurant-chatbot",
      title: "Restaurant AI Chatbot System",
      description: "Intelligent customer service automation for restaurants",
      longDescription:
        "AI-powered chatbot that handles customer inquiries, reservations, and orders 24/7. Reduced response time by 90% and increased customer satisfaction scores by 40%.",
      technologies: ["OpenAI GPT-4", "Python", "FastAPI", "React", "WebSockets"],
      liveUrl: "/portfolio/restaurant-ai-chatbot",
      image: "/placeholder-chatbot.jpg",
      color: "239, 68, 68",
      category: "AI/ML",
      highlights: [
        "24/7 automated customer service",
        "90% faster response times",
        "Natural language processing",
        "Multi-platform integration",
      ],
    },
    {
      id: "hvac-voice-ai",
      title: "HVAC Voice AI Receptionist",
      description: "AI phone system handling service calls automatically",
      longDescription:
        "Voice AI system that handles incoming service calls, schedules appointments, provides quotes, and escalates emergencies. Saves 15+ hours per week for HVAC businesses.",
      technologies: ["GPT-4", "Twilio", "Voice Recognition", "Calendar APIs", "CRM Integration"],
      liveUrl: "/portfolio/hvac-voice-ai",
      image: "/placeholder-voice.jpg",
      color: "59, 130, 246",
      category: "AI/ML",
      highlights: [
        "Handles 100+ calls/day",
        "Saves 15 hours/week",
        "Emergency call detection",
        "Auto-scheduling integration",
      ],
    },
    {
      id: "data-visualization",
      title: "Real-Time Business Analytics Dashboard",
      description: "Interactive dashboards for business intelligence",
      longDescription:
        "Custom analytics platform that transforms complex business data into actionable insights. Features real-time data streaming, predictive analytics, and customizable visualizations.",
      technologies: ["D3.js", "React", "Python", "Pandas", "WebSockets", "TimescaleDB"],
      image: "/placeholder-analytics.jpg",
      color: "236, 72, 153",
      category: "Data Science",
      highlights: [
        "Real-time data streaming",
        "Predictive analytics",
        "Custom visualization engine",
        "Multi-source data integration",
      ],
    },
    {
      id: "automation-framework",
      title: "Business Process Automation Framework",
      description: "No-code automation platform for small businesses",
      longDescription:
        "Built a visual automation builder that lets non-technical users create complex workflows. Integrates with 50+ popular business tools and services.",
      technologies: ["TypeScript", "Next.js", "Temporal", "PostgreSQL", "Redis"],
      githubUrl: "https://github.com/yourusername/automation",
      image: "/placeholder-automation.jpg",
      color: "139, 92, 246",
      category: "Full-Stack",
      highlights: [
        "Visual workflow builder",
        "50+ integrations",
        "Zero-code required",
        "Saves avg. 20hrs/week",
      ],
    },
    {
      id: "cosmic-portfolio",
      title: "This Website - Cosmic Portfolio",
      description: "Interactive 3D portfolio with WebGL cosmos visualization",
      longDescription:
        "You're experiencing it right now! Custom-built portfolio featuring Three.js cosmos intro with 10,088 stars, neural network navigation, and interactive UI elements that showcase the infinite possibilities of creative coding.",
      technologies: ["Next.js", "Three.js", "WebGL", "GLSL Shaders", "TypeScript", "Tailwind"],
      githubUrl: "https://github.com/yourusername/portfolio",
      liveUrl: "/",
      image: "/placeholder-cosmos.jpg",
      color: "218, 165, 32",
      category: "Creative",
      highlights: [
        "10,088 star particle system",
        "Custom GLSL shaders",
        "Neural network navigation",
        "Fully responsive design",
      ],
    },
  ]

  // Particle effect for selected project
  useEffect(() => {
    if (!selectedProject || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const particles: Array<{ x: number; y: number; vx: number; vy: number; life: number }> = []
    let animationFrame: number

    const createParticles = () => {
      for (let i = 0; i < 5; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: -Math.random() * 3 - 2,
          life: 1,
        })
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (Math.random() > 0.7) createParticles()

      particles.forEach((p, index) => {
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.01

        if (p.life <= 0) {
          particles.splice(index, 1)
          return
        }

        ctx.fillStyle = `rgba(${selectedProject.color}, ${p.life * 0.6})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [selectedProject])

  return (
    <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8 section-gradient-subtle ml-0 lg:ml-24">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            Projects From The <span className="gradient-text-gold">Infinite Mind</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Each project is a window into creative problem-solving. Hover to explore, click to dive deeper.
          </p>
        </div>

        {/* Project Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="group relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Card
                className="premium-card h-full cursor-pointer overflow-hidden transition-all duration-500 hover:scale-105"
                onClick={() => setSelectedProject(project)}
              >
                {/* Color accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 transition-all duration-500"
                  style={{
                    background: `rgb(${project.color})`,
                    boxShadow: hoveredIndex === index ? `0 0 20px rgb(${project.color})` : "none",
                  }}
                />

                <CardContent className="pt-8 pb-6 px-6">
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{
                        background: `rgba(${project.color}, 0.1)`,
                        color: `rgb(${project.color})`,
                      }}
                    >
                      {project.category}
                    </span>
                    <div className="flex gap-2">
                      {project.liveUrl && (
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors" />
                      )}
                      {project.githubUrl && (
                        <Github className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors" />
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold mb-3 group-hover:text-gold transition-colors">{project.title}</h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground"
                        style={{
                          transitionDelay: `${i * 50}ms`,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-xs px-2 py-1 rounded bg-gold/10 text-gold">+{project.technologies.length - 3}</span>
                    )}
                  </div>

                  {/* View Details */}
                  <div className="flex items-center gap-2 text-sm font-medium text-gold opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Play className="w-4 h-4" />
                    <span>Explore Project</span>
                  </div>
                </CardContent>

                {/* Animated border on hover */}
                <div
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, transparent 0%, rgba(${project.color}, 0.1) 50%, transparent 100%)`,
                  }}
                />
              </Card>
            </div>
          ))}
        </div>

        {/* Project Detail Modal */}
        {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

            <Card
              className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto premium-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="absolute top-0 left-0 right-0 h-2"
                style={{
                  background: `linear-gradient(90deg, rgb(${selectedProject.color}), transparent)`,
                }}
              />

              <CardContent className="pt-8 pb-8 px-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span
                      className="text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4"
                      style={{
                        background: `rgba(${selectedProject.color}, 0.1)`,
                        color: `rgb(${selectedProject.color})`,
                      }}
                    >
                      {selectedProject.category}
                    </span>
                    <h3 className="text-3xl font-bold mb-2">{selectedProject.title}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="text-muted-foreground hover:text-gold transition-colors text-2xl"
                  >
                    ×
                  </button>
                </div>

                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{selectedProject.longDescription}</p>

                {/* Highlights */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold" />
                    Key Highlights
                  </h4>
                  <ul className="grid md:grid-cols-2 gap-2">
                    {selectedProject.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-gold mt-1">•</span>
                        <span className="text-muted-foreground">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-gold" />
                    Technologies Used
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="text-sm px-3 py-1.5 rounded-lg bg-muted text-foreground font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4 border-t border-border">
                  {selectedProject.liveUrl && (
                    <Link
                      href={selectedProject.liveUrl}
                      className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gold text-gold-foreground hover:scale-105 transition-transform font-semibold"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Live Project
                    </Link>
                  )}
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gold text-gold hover:bg-gold/10 transition-colors font-semibold"
                    >
                      <Github className="w-4 h-4" />
                      View Code
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  )
}
