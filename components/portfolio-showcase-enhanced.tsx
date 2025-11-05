"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Award, TrendingUp, Clock, DollarSign } from "lucide-react"
import Image from "next/image"

interface ProjectMetrics {
  [key: string]: string | number | boolean
}

interface PortfolioProject {
  id: string
  title: string
  category: string
  description: string
  tech: string[]
  metrics: ProjectMetrics
  image?: string
  link?: string
  isLive?: boolean
  featured?: boolean
}

const portfolioProjects: PortfolioProject[] = [
  {
    id: "crios-nova",
    title: "CriOS Nova",
    category: "AI Systems",
    description: "150+ specialized AI agents for drug discovery. Compresses 15-year research timelines to 12 weeks.",
    tech: ["Python", "Claude API", "Multi-Agent Systems", "Quantum Computing"],
    metrics: {
      timeSaved: "92%",
      agents: "150+",
      valuation: "$100M+",
      impact: "Revolutionary"
    },
    image: "/portfolio/crios-nova.png",
    link: "https://crios-nova.com",
    featured: true
  },
  {
    id: "crowe-logic",
    title: "Crowe Logic Platform",
    category: "AI Framework",
    description: "Advanced AI reasoning framework with multi-agent orchestration capabilities.",
    tech: ["TypeScript", "React", "Node.js", "LangChain"],
    metrics: {
      valuation: "$40M",
      users: "1000+",
      accuracy: "95%"
    },
    image: "/portfolio/crowe-logic.png",
    link: "https://crowelogic.com",
    featured: true
  },
  {
    id: "michaelcrowe-ai",
    title: "MichaelCrowe.ai",
    category: "Web Experience",
    description: "This website - conversational AI interface with 3D visuals and voice interaction.",
    tech: ["Next.js", "Three.js", "Claude", "ElevenLabs"],
    metrics: {
      conversionRate: "35%",
      engagementTime: "4.5 min",
      voiceEnabled: "Yes"
    },
    isLive: true,
    featured: true
  },
  {
    id: "dealer-logic",
    title: "Dealer Logic",
    category: "Enterprise SaaS",
    description: "Multi-tier automotive dealership automation platform.",
    tech: ["Next.js", "PostgreSQL", "Stripe", "AI Automation"],
    metrics: {
      timeSaved: "60%",
      revenue: "$100K MRR",
      dealerships: "50+"
    },
    image: "/portfolio/dealer-logic.png",
    link: "https://dealerlogic.io"
  },
  {
    id: "southwest-mushrooms",
    title: "Southwest Mushrooms",
    category: "E-commerce + Operations",
    description: "Global mushroom cultivation business with full automation stack.",
    tech: ["React", "Node.js", "Notion API", "IoT Integration"],
    metrics: {
      revenue: "$470K/year",
      continents: "7",
      automation: "80%"
    },
    image: "/portfolio/sw-mushrooms.png",
    link: "https://southwestmushrooms.com"
  }
]

const categories = ["all", "AI Systems", "AI Framework", "Web Experience", "Enterprise SaaS", "E-commerce + Operations"]

export function PortfolioShowcaseEnhanced() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [activeProject, setActiveProject] = useState<PortfolioProject | null>(null)

  const filteredProjects = selectedCategory === "all"
    ? portfolioProjects
    : portfolioProjects.filter((p) => p.category === selectedCategory)

  return (
    <div className="w-full py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-glow-gold">Portfolio</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real projects with real results. From multi-agent AI systems to enterprise platforms.
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? "bg-gold text-gold-foreground shadow-lg shadow-gold/30"
                  : "bg-card/50 text-muted-foreground hover:bg-card border border-border"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveProject(project)}
                className="group relative bg-card/50 backdrop-blur-sm rounded-2xl border border-border overflow-hidden hover:border-gold/50 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-gold/20"
              >
                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-gold/20 backdrop-blur-sm border border-gold/50 rounded-full px-3 py-1 flex items-center gap-1">
                      <Award className="w-3 h-3 text-gold" />
                      <span className="text-xs text-gold font-medium">Featured</span>
                    </div>
                  </div>
                )}

                {/* Live Badge */}
                {project.isLive && (
                  <div className="absolute top-4 left-4 z-10">
                    <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/50 rounded-full px-3 py-1 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs text-green-400 font-medium">Live Now</span>
                    </div>
                  </div>
                )}

                {/* Project Image */}
                <div className="relative w-full h-48 bg-gradient-to-br from-gold/10 to-accent/10 overflow-hidden">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-6xl opacity-20">🚀</div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-gold transition-colors">
                        {project.title}
                      </h3>
                      {project.link && (
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors" />
                      )}
                    </div>
                    <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-xs rounded-full border border-accent/30">
                      {project.category}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2">
                    {project.tech.slice(0, 3).map((tech) => (
                      <span key={tech} className="px-2 py-1 bg-muted/30 text-xs rounded-md text-muted-foreground">
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 3 && (
                      <span className="px-2 py-1 text-xs text-muted-foreground">+{project.tech.length - 3}</span>
                    )}
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
                    {Object.entries(project.metrics)
                      .slice(0, 2)
                      .map(([key, value]) => (
                        <div key={key} className="space-y-1">
                          <div className="text-xs text-muted-foreground capitalize">{key}</div>
                          <div className="text-lg font-bold text-gold">{value}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Project Detail Modal */}
        <AnimatePresence>
          {activeProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveProject(null)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-card border border-border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-8 space-y-6">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">{activeProject.title}</h2>
                      <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent rounded-full border border-accent/30">
                        {activeProject.category}
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveProject(null)}
                      className="text-muted-foreground hover:text-white transition-colors text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-lg text-muted-foreground">{activeProject.description}</p>

                  {/* All Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(activeProject.metrics).map(([key, value]) => (
                      <div key={key} className="bg-muted/20 rounded-xl p-4 border border-border">
                        <div className="text-sm text-muted-foreground capitalize mb-1">{key}</div>
                        <div className="text-2xl font-bold text-gold">{value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Tech Stack */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Technology Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {activeProject.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-4 py-2 bg-muted/30 rounded-lg text-sm font-medium text-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  {activeProject.link && (
                    <a
                      href={activeProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gold hover:bg-gold/90 text-gold-foreground rounded-full font-semibold transition-all"
                    >
                      View Project <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
