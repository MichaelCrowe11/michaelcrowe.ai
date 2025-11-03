"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function HeroClean() {
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!heroRef.current) return

    // Simple, elegant entrance
    gsap.fromTo(
      ".hero-line",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.2,
        delay: 0.3,
      }
    )

    gsap.fromTo(
      ".hero-cta",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 1.2,
      }
    )
  }, [])

  return (
    <section ref={heroRef} className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-5xl mx-auto text-center">
        {/* Clean, minimal headline */}
        <div className="space-y-4 mb-12">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
            <div className="hero-line">
              <span className="text-white">AI Systems</span>
            </div>
            <div className="hero-line">
              <span className="bg-gradient-to-r from-gold via-yellow-400 to-gold bg-clip-text text-transparent">
                That Work
              </span>
            </div>
          </h1>

          <p className="hero-line text-xl md:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Scaled Southwest Mushrooms to <span className="text-gold font-medium">$470K annually</span>.
            Built <span className="text-gold font-medium">150+ AI agents</span>.
            Now I'll build yours.
          </p>
        </div>

        {/* Simple CTA */}
        <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/contact"
            className="group px-8 py-4 bg-gold hover:bg-gold/90 text-black font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gold/50 flex items-center gap-2"
          >
            Start Your Project
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="#work"
            className="px-8 py-4 border-2 border-white/20 hover:border-gold/50 text-white font-semibold rounded-full transition-all duration-300 hover:bg-white/5"
          >
            View My Work
          </Link>
        </div>

        {/* Minimal stats */}
        <div className="hero-line mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="border-l-2 border-gold/30 pl-4 text-left">
            <div className="text-4xl font-bold text-gold">$470K</div>
            <div className="text-sm text-white/50 mt-1">Annual Revenue</div>
          </div>
          <div className="border-l-2 border-gold/30 pl-4 text-left">
            <div className="text-4xl font-bold text-gold">150+</div>
            <div className="text-sm text-white/50 mt-1">AI Agents</div>
          </div>
          <div className="border-l-2 border-gold/30 pl-4 text-left">
            <div className="text-4xl font-bold text-gold">7</div>
            <div className="text-sm text-white/50 mt-1">Continents</div>
          </div>
        </div>
      </div>
    </section>
  )
}
