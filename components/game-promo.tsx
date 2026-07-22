"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, Gamepad2, Sparkles } from "lucide-react"
import Link from "next/link"

export function GamePromo() {
  return (
    <section id="game" className="section-spacing relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="relative group">
            {/* Glow behind card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-gold to-accent rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />

            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-card via-card/95 to-emerald-500/5 border border-emerald-500/20 backdrop-blur-xl">
              <div className="grid md:grid-cols-5 gap-0">

                {/* Left: Copy */}
                <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6 w-fit">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-300 tracking-wider uppercase">
                      Now Playing · Free
                    </span>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-[1.05]">
                    I built a game about{" "}
                    <span className="bg-gradient-to-r from-emerald-400 via-gold to-accent bg-clip-text text-transparent">
                      growing mushrooms
                    </span>
                  </h2>

                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    A commercial cultivation tycoon by <span className="text-tan font-medium">Southwest Mushrooms</span>.
                    Real cultivation science — 10 species, 6 substrates, 6 real contaminants — packaged into a browser game
                    that actually teaches you something.
                  </p>

                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div>
                      <div className="text-2xl font-bold text-gold mb-1">10</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">Species</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gold mb-1">5 min</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">To First Harvest</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gold mb-1">$0</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">To Play</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <Link
                      href="/game"
                      className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 to-gold text-black hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.02] group/btn"
                    >
                      <Gamepad2 className="w-4 h-4" />
                      Play Substrate to Harvest
                      <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </Link>

                    <span className="text-xs text-muted-foreground">
                      Mobile-friendly · Zero install
                    </span>
                  </div>
                </div>

                {/* Right: Mushroom illustration */}
                <div className="md:col-span-2 relative min-h-[280px] md:min-h-full bg-gradient-to-br from-emerald-950/40 via-black/40 to-amber-950/40 flex items-center justify-center overflow-hidden">
                  {/* Grid pattern overlay */}
                  <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                      backgroundImage: `linear-gradient(rgba(201,169,97,0.4) 1px, transparent 1px),
                                       linear-gradient(90deg, rgba(201,169,97,0.4) 1px, transparent 1px)`,
                      backgroundSize: "40px 40px",
                    }}
                  />

                  {/* Mushroom cluster SVG */}
                  <svg viewBox="0 0 300 300" className="w-full h-full max-w-[280px] relative z-10" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <radialGradient id="capA" cx="0.35" cy="0.3">
                        <stop offset="0%" stopColor="#e8c880" />
                        <stop offset="60%" stopColor="#c9a961" />
                        <stop offset="100%" stopColor="#8b6f47" />
                      </radialGradient>
                      <radialGradient id="capB" cx="0.35" cy="0.3">
                        <stop offset="0%" stopColor="#a05f3e" />
                        <stop offset="100%" stopColor="#4a2818" />
                      </radialGradient>
                      <radialGradient id="capC" cx="0.35" cy="0.3">
                        <stop offset="0%" stopColor="#f4e8d0" />
                        <stop offset="100%" stopColor="#a89170" />
                      </radialGradient>
                      <linearGradient id="stemGrad" x1="0" x2="1">
                        <stop offset="0%" stopColor="#d4c19a" />
                        <stop offset="100%" stopColor="#8b7355" />
                      </linearGradient>
                      <radialGradient id="glow" cx="0.5" cy="0.5">
                        <stop offset="0%" stopColor="#c9a961" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#c9a961" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Glow */}
                    <circle cx="150" cy="180" r="130" fill="url(#glow)" />

                    {/* Substrate log */}
                    <ellipse cx="150" cy="255" rx="110" ry="10" fill="#3a2820" opacity="0.6" />
                    <rect x="55" y="220" width="190" height="35" rx="8" fill="#5c4a30" />
                    <rect x="55" y="220" width="190" height="35" rx="8" fill="url(#capB)" opacity="0.15" />

                    {/* Mycelium texture */}
                    {Array.from({ length: 30 }).map((_, i) => (
                      <circle
                        key={i}
                        cx={60 + Math.random() * 180}
                        cy={224 + Math.random() * 28}
                        r={0.8 + Math.random() * 1.5}
                        fill="#f4e8d0"
                        opacity={0.6}
                      />
                    ))}

                    {/* Back small mushrooms */}
                    <g transform="translate(80, 165)">
                      <rect x="-2" y="15" width="4" height="45" fill="url(#stemGrad)" rx="2" />
                      <ellipse cx="0" cy="15" rx="18" ry="12" fill="url(#capC)" />
                    </g>
                    <g transform="translate(215, 155)">
                      <rect x="-2" y="18" width="4" height="50" fill="url(#stemGrad)" rx="2" />
                      <ellipse cx="0" cy="18" rx="20" ry="14" fill="url(#capB)" />
                    </g>

                    {/* Center hero mushroom */}
                    <g transform="translate(150, 110)">
                      <rect x="-5" y="30" width="10" height="80" fill="url(#stemGrad)" rx="4" />
                      <path d="M 5 40 Q 5 100 8 108 M -5 40 Q -5 100 -8 108" stroke="#3a2820" strokeWidth="0.5" opacity="0.4" fill="none" />
                      <ellipse cx="0" cy="30" rx="48" ry="34" fill="url(#capA)" />
                      <path d="M -46 42 Q 0 60 46 42 L 46 46 Q 0 62 -46 46 Z" fill="#4a3728" opacity="0.35" />
                    </g>

                    {/* Front small mushroom */}
                    <g transform="translate(115, 195)">
                      <rect x="-2.5" y="10" width="5" height="35" fill="url(#stemGrad)" rx="2" />
                      <ellipse cx="0" cy="10" rx="15" ry="10" fill="url(#capC)" />
                    </g>
                    <g transform="translate(190, 200)">
                      <rect x="-2" y="8" width="4" height="30" fill="url(#stemGrad)" rx="2" />
                      <ellipse cx="0" cy="8" rx="13" ry="9" fill="url(#capA)" />
                    </g>
                  </svg>

                  {/* Corner tag */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-gold/20">
                    <span className="text-[10px] font-mono text-gold tracking-wider uppercase">v1.0</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
