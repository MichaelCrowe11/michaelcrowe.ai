"use client"

import Link from "next/link"
import Image from "next/image"
import { useRef, useState, useEffect } from "react"
import { gsap } from "gsap"
import { ArrowRight, Sparkles, Zap, Rocket, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { config } from "@/lib/config"

export function CosmicHeroEnhanced() {
  const cardRef = useRef<HTMLDivElement>(null)
  const pixelGridRef = useRef<HTMLDivElement>(null)
  const techTagsRef = useRef<HTMLDivElement>(null)
  const customCursorRef = useRef<HTMLDivElement>(null)
  const [showCustomCursor, setShowCustomCursor] = useState(false)

  // Custom star cursor effect
  useEffect(() => {
    const techTagsElement = techTagsRef.current
    const cursorElement = customCursorRef.current

    if (!techTagsElement || !cursorElement) return

    let cursorX = 0
    let cursorY = 0

    const handleMouseMove = (e: MouseEvent) => {
      cursorX = e.clientX
      cursorY = e.clientY

      gsap.to(cursorElement, {
        x: cursorX - 20,
        y: cursorY - 20,
        duration: 0.2,
        ease: "power2.out",
      })
    }

    const handleMouseEnter = () => {
      setShowCustomCursor(true)
      gsap.to(cursorElement, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: "back.out(1.7)",
      })
    }

    const handleMouseLeave = () => {
      gsap.to(cursorElement, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => setShowCustomCursor(false),
      })
    }

    techTagsElement.addEventListener("mouseenter", handleMouseEnter)
    techTagsElement.addEventListener("mouseleave", handleMouseLeave)
    techTagsElement.addEventListener("mousemove", handleMouseMove)

    return () => {
      techTagsElement.removeEventListener("mouseenter", handleMouseEnter)
      techTagsElement.removeEventListener("mouseleave", handleMouseLeave)
      techTagsElement.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  // Cosmic pixel dissolve effect
  const handleCardMouseLeave = () => {
    if (!cardRef.current || !pixelGridRef.current) return

    const gridSize = 5 // Larger grid for more detail
    const pixelSize = 100 / gridSize

    pixelGridRef.current.innerHTML = ""

    const totalPixels = gridSize * gridSize
    const clearIndices = new Set<number>()
    while (clearIndices.size < 4) {
      clearIndices.add(Math.floor(Math.random() * totalPixels))
    }

    let pixelIndex = 0
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (clearIndices.has(pixelIndex)) {
          pixelIndex++
          continue
        }

        const pixel = document.createElement("div")
        const cosmicColors = ["bg-gold/40", "bg-purple-600/40", "bg-blue-500/40", "bg-black/60"]
        const randomColor = cosmicColors[Math.floor(Math.random() * cosmicColors.length)]

        const normalizedPosition = (col + (gridSize - 1 - row)) / ((gridSize - 1) * 2)
        const targetOpacity = 0.3 + normalizedPosition * 0.7

        pixel.className = `absolute ${randomColor} backdrop-blur-sm`
        pixel.style.width = `${pixelSize}%`
        pixel.style.height = `${pixelSize}%`
        pixel.style.left = `${col * pixelSize}%`
        pixel.style.top = `${row * pixelSize}%`
        pixel.style.opacity = "0"
        pixel.style.display = "block"
        pixel.setAttribute("data-target-opacity", targetOpacity.toString())
        pixelGridRef.current.appendChild(pixel)

        pixelIndex++
      }
    }

    const pixels = Array.from(pixelGridRef.current.children)
    const animationStepDuration = 0.5
    const actualPixelCount = pixels.length
    const staggerDuration = animationStepDuration / actualPixelCount

    const tl = gsap.timeline()

    tl.to(cardRef.current, {
      scale: 0.98,
      duration: 0.15,
      ease: "power2.in",
    })

    tl.to(
      pixels,
      {
        opacity: (index, target) => {
          const el = target as HTMLElement
          return el.getAttribute("data-target-opacity") || "1"
        },
        duration: 0.5,
        ease: "power2.in",
        stagger: {
          each: staggerDuration,
          from: "random",
        },
      },
      "<",
    )

    tl.to(
      pixels,
      {
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
      },
      `+=${animationStepDuration}`,
    )

    tl.to(
      cardRef.current,
      {
        scale: 1,
        duration: 0.3,
        ease: "back.out(1.2)",
      },
      "<",
    )

    tl.set(pixels, {
      display: "none",
    })
  }

  return (
    <section className="relative min-h-screen">
      {/* SVG Mask for cosmic shape */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <mask id="cosmicHeroMask" maskContentUnits="objectBoundingBox">
            <rect width="1" height="1" fill="black" />
            <path
              d="M0 0.15 V0.98 C0 0.99 0.004 1 0.009 1 H0.991 C0.996 1 1 0.99 1 0.98 V0.06 C1 0.05 0.996 0.04 0.991 0.04 H0.92 C0.915 0.04 0.91 0.03 0.91 0.02 V0.01 C0.91 0.005 0.906 0 0.901 0 L0.2 0 C0.195 0 0.19 0.005 0.19 0.01 V0.025 C0.19 0.03 0.186 0.04 0.181 0.04 H0.09 C0.085 0.04 0.08 0.05 0.08 0.06 V0.12 C0.08 0.13 0.076 0.14 0.071 0.14 H0.009 C0.004 0.14 0 0.145 0 0.15 Z"
              fill="white"
            />
          </mask>

          {/* Glow filter for cursor */}
          <filter id="starGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>

      <div className="relative isolate w-full min-h-screen p-[1.5%]">
        <div
          className="absolute inset-0 overflow-hidden rounded-3xl"
          style={{
            mask: "url(#cosmicHeroMask)",
            WebkitMask: "url(#cosmicHeroMask)",
          }}
        >
          {/* Starfield shines through here - no need for video since we have the 3D stars */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-black" />

          {/* Cosmic gradients overlay */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-purple-900/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-transparent to-blue-900/10" />
            <div className="absolute inset-0 [background:radial-gradient(90%_60%_at_10%_70%,rgba(218,165,32,0.15)_0%,transparent_70%)]" />
            <div className="absolute inset-0 [background:radial-gradient(80%_50%_at_90%_30%,rgba(138,43,226,0.1)_0%,transparent_70%)]" />
          </div>

          {/* Main content card */}
          <div className="absolute bottom-8 left-8 right-8 max-w-[min(52rem,90vw)] z-10">
            <div
              ref={cardRef}
              onMouseLeave={handleCardMouseLeave}
              className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/[0.02] border-2 border-white/20 rounded-3xl p-8 md:p-12 transition-all duration-500 ease-out hover:scale-[1.01] hover:border-gold/40 shadow-2xl hover:shadow-gold/20"
            >
              <div ref={pixelGridRef} className="absolute inset-0 pointer-events-none z-10 rounded-3xl overflow-hidden" />

              {/* Animated corner accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gold/20 to-transparent rounded-bl-full opacity-50 animate-pulse" />

              <div className="relative z-20">
                <h1 className="text-balance text-4xl/tight sm:text-5xl/tight md:text-6xl/tight lg:text-7xl/tight font-bold tracking-tight">
                  <span className="block mb-2 text-white">
                    I Build AI Systems
                  </span>
                  <span className="block mb-2 bg-gradient-to-r from-gold via-yellow-300 to-gold bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                    That Actually Work.
                  </span>
                  <span className="block text-white/90">
                    Now I'll Build Yours.
                  </span>
                </h1>

                <p className="mt-6 text-base/7 sm:text-lg/8 text-white/80 max-w-2xl">
                  I'm <span className="text-gold font-semibold">Michael Crowe</span> – self-taught developer who scaled Southwest Mushrooms to{" "}
                  <span className="text-gold font-semibold">$470K annually</span>. Built{" "}
                  <span className="text-purple-400 font-semibold">150+ AI agents</span> for pharmaceutical research.
                </p>

                {/* CTA Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link href="/contact">
                    <Button
                      size="lg"
                      className="h-14 px-8 text-base font-bold bg-gradient-to-r from-gold via-yellow-500 to-gold text-black shadow-2xl hover:shadow-gold/50 hover:scale-105 transition-all duration-300 group bg-[length:200%_100%] hover:bg-right animate-shimmer"
                    >
                      Start Your AI Journey
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>

                  <Link href="#services-pricing">
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-14 px-8 text-base font-semibold backdrop-blur-xl bg-white/10 border-2 border-white/30 hover:bg-white/20 hover:border-gold/50 text-white transition-all duration-300"
                    >
                      View Services & Pricing
                    </Button>
                  </Link>
                </div>

                {/* Stats */}
                <div className="mt-10 grid grid-cols-3 gap-4 max-w-2xl">
                  <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-gold/40 transition-all duration-300">
                    <div className="text-3xl font-bold bg-gradient-to-br from-gold to-yellow-600 bg-clip-text text-transparent">$470K</div>
                    <div className="text-xs text-white/60 mt-1">Revenue Generated</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-400/40 transition-all duration-300">
                    <div className="text-3xl font-bold bg-gradient-to-br from-purple-400 to-pink-600 bg-clip-text text-transparent">150+</div>
                    <div className="text-xs text-white/60 mt-1">AI Agents Built</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-400/40 transition-all duration-300">
                    <div className="text-3xl font-bold bg-gradient-to-br from-blue-400 to-cyan-600 bg-clip-text text-transparent">7</div>
                    <div className="text-xs text-white/60 mt-1">Continents Served</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="absolute left-8 top-8 z-20">
          <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-gold/30 hover:ring-gold/60 transition-all duration-300 hover:scale-110">
            <Image
              src={config.branding.logoUrl}
              alt="Michael Crowe"
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Tech stack tags with custom cursor */}
        <div ref={techTagsRef} className="absolute top-8 left-1/2 -translate-x-1/2 z-20 cursor-none">
          <div className="flex items-center gap-2 text-sm backdrop-blur-md bg-white/5 px-6 py-3 rounded-full border border-white/20">
            <span className="text-white/80 font-medium">Built with</span>
            <button className="rounded-full bg-gold/20 border border-gold/40 px-3 py-1 text-xs font-bold text-gold hover:bg-gold/30 transition-all">
              GSAP
            </button>
            <Sparkles className="w-3 h-3 text-gold" />
            <button className="rounded-full bg-purple-600/20 border border-purple-400/40 px-3 py-1 text-xs font-bold text-purple-300 hover:bg-purple-600/30 transition-all">
              Next.js
            </button>
            <Sparkles className="w-3 h-3 text-purple-400" />
            <button className="rounded-full bg-blue-600/20 border border-blue-400/40 px-3 py-1 text-xs font-bold text-blue-300 hover:bg-blue-600/30 transition-all">
              Three.js
            </button>
            <span className="text-white/80 font-medium">by</span>
            <button className="rounded-full bg-gradient-to-r from-gold/30 to-purple-600/30 border border-gold/50 px-3 py-1 text-xs font-bold text-white hover:from-gold/40 hover:to-purple-600/40 transition-all">
              Michael Crowe
            </button>
          </div>
        </div>

        {/* Custom star cursor */}
        <div
          ref={customCursorRef}
          className={`fixed w-[40px] h-[40px] pointer-events-none z-[100] transition-opacity duration-200 ${
            showCustomCursor ? "opacity-100" : "opacity-0"
          }`}
          style={{ left: 0, top: 0, transform: "scale(0)" }}
        >
          <Sparkles
            className="w-full h-full text-gold drop-shadow-[0_0_10px_rgba(218,165,32,0.8)]"
            style={{ filter: "url(#starGlow)" }}
          />
        </div>

        {/* CTA Button - Top Right */}
        <div className="absolute right-8 top-8 z-20">
          <Link href="/contact">
            <Button
              className="rounded-full bg-gradient-to-r from-gold to-yellow-600 px-6 py-3 text-sm font-mono font-semibold uppercase tracking-wide text-black shadow-lg hover:shadow-gold/50 hover:scale-105 transition-all duration-300"
            >
              Let's Talk
            </Button>
          </Link>
        </div>
      </div>

      {/* Add shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 200% center;
          }
          100% {
            background-position: -200% center;
          }
        }
        .animate-shimmer {
          animation: shimmer 8s linear infinite;
        }
      `}</style>
    </section>
  )
}
