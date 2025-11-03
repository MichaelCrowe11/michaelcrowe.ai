"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ExternalLink, Github } from "lucide-react"
import Link from "next/link"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const projects = [
  {
    title: "Southwest Mushrooms",
    description: "Scaled from garage operation to $470K annually serving 7 continents. Built complete automation infrastructure.",
    tags: ["E-commerce", "Automation", "Scaling"],
    link: "#",
    impact: "$470K Revenue",
  },
  {
    title: "CriOS Nova",
    description: "150+ PhD-level AI agents that compress drug discovery from 15 years to 12 weeks for pharmaceutical research.",
    tags: ["AI Agents", "Healthcare", "Research"],
    link: "#",
    impact: "150+ Agents",
  },
  {
    title: "Crowe Logic AI",
    description: "AI reasoning framework powering multiple production systems for small businesses and enterprises.",
    tags: ["Framework", "Production", "Enterprise"],
    link: "#",
    impact: "Multiple Clients",
  },
]

export function PortfolioClean() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const projects = sectionRef.current.querySelectorAll(".portfolio-item")

    gsap.fromTo(
      projects,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      }
    )
  }, [])

  return (
    <section ref={sectionRef} id="work" className="py-32 px-6 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Featured Work
          </h2>
          <p className="text-xl text-white/70 max-w-2xl">
            Real projects. Real results. Real revenue.
          </p>
        </div>

        {/* Project list */}
        <div className="space-y-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="portfolio-item group p-8 md:p-10 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/50 transition-all duration-500 hover:bg-white/10"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <h3 className="text-3xl font-bold text-white group-hover:text-gold transition-colors">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-white/70 leading-relaxed mb-6 text-lg">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-sm bg-gold/10 text-gold rounded-full border border-gold/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Impact stat */}
                <div className="md:text-right">
                  <div className="inline-block px-6 py-3 rounded-xl bg-gold/10 border border-gold/30">
                    <div className="text-2xl font-bold text-gold">{project.impact}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-gold hover:bg-gold/90 text-black font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gold/50"
          >
            Start Your Project
          </Link>
        </div>
      </div>
    </section>
  )
}
