"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Brain, Zap, Rocket, Check } from "lucide-react"
import Link from "next/link"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function ServicesClean() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const cards = sectionRef.current.querySelectorAll(".service-card")

    gsap.fromTo(
      cards,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
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
    <section ref={sectionRef} className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            What I Build
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Production AI systems that generate real revenue
          </p>
        </div>

        {/* Service cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="service-card group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/50 transition-all duration-500 hover:bg-white/10">
            <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors">
              <Brain className="w-7 h-7 text-gold" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-4">AI Strategy</h3>
            <p className="text-white/70 mb-6 leading-relaxed">
              Know exactly where AI fits in your business and how to implement it
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                <span className="text-white/80 text-sm">Business & technical audit</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                <span className="text-white/80 text-sm">Custom AI roadmap</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                <span className="text-white/80 text-sm">ROI projections</span>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <div className="text-3xl font-bold text-gold mb-1">$15,000</div>
              <div className="text-white/50 text-sm">2 weeks</div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="service-card group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/50 transition-all duration-500 hover:bg-white/10">
            <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors">
              <Zap className="w-7 h-7 text-gold" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-4">MVP Build</h3>
            <p className="text-white/70 mb-6 leading-relaxed">
              Launch your first AI feature and start seeing results
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                <span className="text-white/80 text-sm">Single AI feature</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                <span className="text-white/80 text-sm">Production deployment</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                <span className="text-white/80 text-sm">2 weeks support</span>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <div className="text-3xl font-bold text-gold mb-1">$25,000</div>
              <div className="text-white/50 text-sm">4-6 weeks</div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="service-card group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/50 transition-all duration-500 hover:bg-white/10">
            <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors">
              <Rocket className="w-7 h-7 text-gold" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-4">Full System</h3>
            <p className="text-white/70 mb-6 leading-relaxed">
              Complete AI infrastructure that scales with your business
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                <span className="text-white/80 text-sm">Multiple AI agents</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                <span className="text-white/80 text-sm">Custom infrastructure</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                <span className="text-white/80 text-sm">Ongoing support</span>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <div className="text-3xl font-bold text-gold mb-1">$50,000+</div>
              <div className="text-white/50 text-sm">8-12 weeks</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-gold hover:bg-gold/90 text-black font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gold/50"
          >
            Let's Talk About Your Project
          </Link>
        </div>
      </div>
    </section>
  )
}
