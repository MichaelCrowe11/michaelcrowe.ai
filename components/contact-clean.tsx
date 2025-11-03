"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Mail, Github, Linkedin, Twitter } from "lucide-react"
import Link from "next/link"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function ContactClean() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    gsap.fromTo(
      sectionRef.current.querySelector(".contact-content"),
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      }
    )
  }, [])

  return (
    <section ref={sectionRef} className="py-32 px-6 border-t border-white/10">
      <div className="max-w-4xl mx-auto text-center contact-content">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Let's Build Something
          </h2>
          <p className="text-xl text-white/70">
            Have a project in mind? Let's talk about how AI can transform your business.
          </p>
        </div>

        {/* CTA */}
        <div className="mb-12">
          <Link
            href="/contact"
            className="inline-block px-12 py-5 bg-gold hover:bg-gold/90 text-black text-lg font-bold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gold/50"
          >
            Get In Touch
          </Link>
        </div>

        {/* Divider */}
        <div className="my-12 flex items-center gap-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/50 text-sm">or connect with me</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Social links */}
        <div className="flex justify-center gap-6">
          <a
            href="mailto:hello@michaelcrowe.ai"
            className="p-4 rounded-full bg-white/5 border border-white/10 hover:border-gold/50 hover:bg-white/10 transition-all duration-300 group"
          >
            <Mail className="w-6 h-6 text-white/70 group-hover:text-gold transition-colors" />
          </a>
          <a
            href="https://linkedin.com/in/michaelcrowe"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-full bg-white/5 border border-white/10 hover:border-gold/50 hover:bg-white/10 transition-all duration-300 group"
          >
            <Linkedin className="w-6 h-6 text-white/70 group-hover:text-gold transition-colors" />
          </a>
          <a
            href="https://github.com/michaelcrowe"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-full bg-white/5 border border-white/10 hover:border-gold/50 hover:bg-white/10 transition-all duration-300 group"
          >
            <Github className="w-6 h-6 text-white/70 group-hover:text-gold transition-colors" />
          </a>
          <a
            href="https://twitter.com/michaelcrowe"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-full bg-white/5 border border-white/10 hover:border-gold/50 hover:bg-white/10 transition-all duration-300 group"
          >
            <Twitter className="w-6 h-6 text-white/70 group-hover:text-gold transition-colors" />
          </a>
        </div>

        {/* Footer note */}
        <p className="mt-16 text-white/40 text-sm">
          Based in [Your Location] • Working with clients worldwide
        </p>
      </div>
    </section>
  )
}
