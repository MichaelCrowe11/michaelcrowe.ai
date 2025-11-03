"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, Rocket } from "lucide-react"
import Link from "next/link"

export function HeroPremium() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      <div className="container-wide relative z-10 py-12">
        <div className="max-w-6xl mx-auto hero-content">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-xl bg-white/5 border border-gold/20 shadow-2xl glass-panel">
              <Sparkles className="w-4 h-4 text-gold animate-spin" style={{ animationDuration: '3s' }} />
              <span className="text-sm font-semibold bg-gradient-to-r from-gold to-accent bg-clip-text text-transparent">
                Production AI Systems That Actually Work
              </span>
            </div>
          </div>

          {/* Main Heading */}
          <div className="text-center mb-8">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-tight">
              <span className="block mb-3">
                I Build AI Systems
              </span>

              <span className="block mb-3 bg-gradient-to-r from-gold via-yellow-300 to-accent bg-clip-text text-transparent"
                style={{
                  textShadow: "0 0 80px rgba(218, 165, 32, 0.5)",
                }}
              >
                That Actually Work.
              </span>

              <span className="block">
                Now I'll Build Yours.
              </span>
            </h1>
          </div>

          {/* Subheading */}
          <p className="text-lg sm:text-xl lg:text-2xl text-center text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
            I'm <span className="text-foreground font-bold">Michael Crowe</span> - founder of{" "}
            <span className="text-gold font-bold">Crowe Logic AI</span> and{" "}
            <span className="text-accent font-bold">CriOS Nova</span>. I scaled Southwest Mushrooms from my garage to serving millions across 7 continents, generating{" "}
            <span className="text-foreground font-bold">$470K annually</span>. I built{" "}
            <span className="text-foreground font-bold">150+ specialized AI agents</span> for pharmaceutical research.
          </motion.p>


          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <div className="transform transition-transform hover:scale-105 hover:-translate-y-1">
              <Button
                asChild
                size="lg"
                className="h-14 px-10 text-lg font-bold bg-gradient-to-r from-gold to-yellow-600 text-black shadow-2xl relative overflow-hidden group"
              >
                <Link href="/contact" className="flex items-center gap-3">
                  <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">Start Your AI Journey</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
            </div>

            <div className="transform transition-transform hover:scale-105 hover:-translate-y-1">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 px-10 text-lg font-semibold backdrop-blur-xl bg-white/5 border-2 border-white/20 hover:bg-white/10"
              >
                <Link href="#services-pricing">View Services & Pricing</Link>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="hero-stat cosmic-card glass-card rounded-2xl p-8 backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 shadow-2xl hover:border-gold/60 transition-all duration-500">
              <div className="text-center">
                <div className="mb-3">
                  <Zap className="w-8 h-8 text-gold mx-auto" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-br from-gold to-yellow-600 bg-clip-text text-transparent mb-2">
                  $470K
                </div>
                <div className="text-sm text-muted-foreground font-medium">Annual Revenue Generated</div>
              </div>
            </div>

            <div className="hero-stat cosmic-card glass-card rounded-2xl p-8 backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 shadow-2xl hover:border-accent/60 transition-all duration-500">
              <div className="text-center">
                <div className="mb-3">
                  <Rocket className="w-8 h-8 text-accent mx-auto" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-br from-accent to-blue-600 bg-clip-text text-transparent mb-2">
                  150+
                </div>
                <div className="text-sm text-muted-foreground font-medium">AI Agents Built</div>
              </div>
            </div>

            <div className="hero-stat cosmic-card glass-card rounded-2xl p-8 backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 shadow-2xl hover:border-purple-400/60 transition-all duration-500">
              <div className="text-center">
                <div className="mb-3">
                  <Sparkles className="w-8 h-8 text-purple-400 mx-auto" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-br from-purple-400 to-pink-600 bg-clip-text text-transparent mb-2">
                  7
                </div>
                <div className="text-sm text-muted-foreground font-medium">Continents Served</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-fade-in animation-delay-2000">
        <div className="flex flex-col items-center gap-3 text-muted-foreground cursor-pointer hover:text-foreground transition-colors animate-bounce-subtle">
          <span className="text-xs font-medium uppercase tracking-wider">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-current p-1 hover:scale-110 transition-transform">
            <div className="w-1.5 h-1.5 rounded-full bg-current mx-auto animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
