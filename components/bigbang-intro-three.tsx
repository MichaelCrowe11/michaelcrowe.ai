"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { config } from "@/lib/config"

// Particle System Configuration
const CONFIG = {
  particleCount: {
    desktop: 5000,
    tablet: 2500,
    mobile: 1000,
  },
  colors: {
    hot: [0xff6b35, 0xff8c42, 0xffa600], // Orange/red stars
    cool: [0x4ecdc4, 0x45b7d1, 0x96ceb4], // Blue/teal stars
    nebula: [0xc44569, 0x9b59b6, 0x8e44ad], // Purple/pink nebula
    gold: [0xc9a961, 0xd4af37, 0xffd700], // Gold accents (matching avatar ring)
  },
  explosion: {
    radius: 0,
    maxRadius: 50,
    expansionSpeed: 0.02,
    particleSpeed: 0.005,
    rotationSpeed: 0.0002,
  },
  camera: {
    fov: 75,
    near: 0.1,
    far: 1000,
    positionZ: 30,
  },
}

// Device detection
function getDeviceType(): "desktop" | "tablet" | "mobile" {
  if (typeof window === "undefined") return "desktop"
  const width = window.innerWidth
  if (width < 768) return "mobile"
  if (width < 1024) return "tablet"
  return "desktop"
}

// Particles Component using Three.js (Memory Optimized)
function ParticleSystem({ phase }: { phase: string }) {
  const pointsRef = useRef<THREE.Points>(null)
  const velocitiesRef = useRef<number[]>([])
  const timeRef = useRef(0)
  const geometryRef = useRef<THREE.BufferGeometry | null>(null)
  const materialRef = useRef<THREE.PointsMaterial | null>(null)

  // Initialize particles
  useEffect(() => {
    if (!pointsRef.current) return

    const deviceType = getDeviceType()
    const particleCount = CONFIG.particleCount[deviceType]

    const positions: number[] = []
    const colors: number[] = []
    const sizes: number[] = []
    const velocities: number[] = []

    for (let i = 0; i < particleCount; i++) {
      // Spherical distribution
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const radius = Math.random() * 5

      // Initial position (near center - the singularity)
      positions.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      )

      // Color selection (weighted distribution)
      const colorType = Math.random()
      let color
      if (colorType < 0.4) {
        color = CONFIG.colors.hot[Math.floor(Math.random() * 3)]
      } else if (colorType < 0.7) {
        color = CONFIG.colors.cool[Math.floor(Math.random() * 3)]
      } else if (colorType < 0.95) {
        color = CONFIG.colors.nebula[Math.floor(Math.random() * 3)]
      } else {
        // Rare gold particles (matching brand colors)
        color = CONFIG.colors.gold[Math.floor(Math.random() * 3)]
      }

      const threeColor = new THREE.Color(color)
      colors.push(threeColor.r, threeColor.g, threeColor.b)

      // Size variation (some larger "star clusters")
      sizes.push(Math.random() * 3 + 1)

      // Velocity (radial expansion from center + randomization)
      velocities.push(
        Math.sin(phi) * Math.cos(theta) * (0.5 + Math.random() * 0.5),
        Math.sin(phi) * Math.sin(theta) * (0.5 + Math.random() * 0.5),
        Math.cos(phi) * (0.5 + Math.random() * 0.5)
      )
    }

    const geometry = pointsRef.current.geometry
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))
    geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1))

    // Store references for cleanup
    geometryRef.current = geometry
    if (pointsRef.current.material instanceof THREE.Material) {
      materialRef.current = pointsRef.current.material as THREE.PointsMaterial
    }

    velocitiesRef.current = velocities

    // Memory cleanup on unmount
    return () => {
      if (geometryRef.current) {
        geometryRef.current.dispose()
      }
      if (materialRef.current) {
        materialRef.current.dispose()
      }
    }
  }, [])

  // Animation loop
  useFrame(() => {
    if (!pointsRef.current) return

    timeRef.current += 0.016 // ~60fps

    const positions = pointsRef.current.geometry.attributes.position
    const velocities = velocitiesRef.current

    if (phase === "bigbang" || phase === "expansion") {
      for (let i = 0; i < positions.count; i++) {
        const i3 = i * 3

        // Radial expansion
        positions.array[i3] += velocities[i3] * CONFIG.explosion.particleSpeed
        positions.array[i3 + 1] += velocities[i3 + 1] * CONFIG.explosion.particleSpeed
        positions.array[i3 + 2] += velocities[i3 + 2] * CONFIG.explosion.particleSpeed

        // Add slight spiral motion (galactic rotation)
        const angle = timeRef.current * CONFIG.explosion.rotationSpeed
        const x = positions.array[i3]
        const z = positions.array[i3 + 2]
        positions.array[i3] = x * Math.cos(angle) - z * Math.sin(angle)
        positions.array[i3 + 2] = x * Math.sin(angle) + z * Math.cos(angle)
      }

      positions.needsUpdate = true
    }

    // Slow rotation of entire system
    pointsRef.current.rotation.y += 0.0001
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry />
      <pointsMaterial
        size={2}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

// Main Intro Component
interface BigBangIntroThreeProps {
  onComplete: () => void
}

export function BigBangIntroThree({ onComplete }: BigBangIntroThreeProps) {
  const [phase, setPhase] = useState<"intro" | "bigbang" | "expansion" | "avatar" | "complete">("intro")
  const [canSkip, setCanSkip] = useState(false)
  const avatarRef = useRef<HTMLDivElement>(null)

  // Phase progression
  useEffect(() => {
    setCanSkip(true)

    const timeouts = [
      setTimeout(() => setPhase("bigbang"), 1500),
      setTimeout(() => setPhase("expansion"), 3000),
      setTimeout(() => setPhase("avatar"), 4500),
      setTimeout(() => {
        setPhase("complete")
        setTimeout(onComplete, 1000)
      }, 8000),
    ]

    return () => timeouts.forEach(clearTimeout)
  }, [onComplete])

  // Mouse parallax effect for avatar
  useEffect(() => {
    if (!avatarRef.current || phase !== "avatar") return

    let ticking = false

    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!avatarRef.current) return
          const x = (e.clientX / window.innerWidth - 0.5) * 20
          const y = (e.clientY / window.innerHeight - 0.5) * 20

          avatarRef.current.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`
          ticking = false
        })
        ticking = true
      }
    }

    document.addEventListener("mousemove", handleMouseMove)
    return () => document.removeEventListener("mousemove", handleMouseMove)
  }, [phase])

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      {/* Three.js Canvas for 3D particles (Performance Optimized) */}
      <div className="absolute inset-0">
        <Canvas
          camera={{
            fov: CONFIG.camera.fov,
            near: CONFIG.camera.near,
            far: CONFIG.camera.far,
            position: [0, 0, CONFIG.camera.positionZ],
          }}
          gl={{
            alpha: true,
            antialias: false,
            powerPreference: "high-performance",
            stencil: false,
            depth: false
          }}
          dpr={Math.min(window.devicePixelRatio, 2)}
          performance={{ min: 0.5 }}
          frameloop="always"
        >
          <ParticleSystem phase={phase} />
        </Canvas>
      </div>

      {/* Big Bang Flash Effect */}
      <AnimatePresence>
        {phase === "bigbang" && (
          <motion.div
            className="absolute inset-0 bg-gradient-radial from-white via-blue-200/50 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.5, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          />
        )}
      </AnimatePresence>

      {/* Skip Button */}
      {canSkip && phase !== "complete" && (
        <motion.button
          onClick={onComplete}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-8 right-8 z-[60] px-6 py-3 bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 rounded-full text-white font-medium transition-all focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-black"
          aria-label="Skip introduction animation"
        >
          Skip Intro
        </motion.button>
      )}

      {/* Phase Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <AnimatePresence mode="wait">
          {/* Intro Phase */}
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 1 }}
              className="text-center space-y-4 px-4"
            >
              <motion.h1 className="text-5xl md:text-7xl font-bold text-white">
                <span className="inline-block" style={{ textShadow: "0 0 30px rgba(218, 165, 32, 0.8)" }}>
                  The Beginning
                </span>
              </motion.h1>
            </motion.div>
          )}

          {/* Big Bang Phase */}
          {phase === "bigbang" && (
            <motion.div
              key="bigbang"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-4 px-4"
            >
              <motion.h2
                className="text-4xl md:text-6xl font-bold text-white"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ textShadow: "0 0 40px rgba(255, 255, 255, 0.8)" }}
              >
                The Big Bang
              </motion.h2>
            </motion.div>
          )}

          {/* Avatar Phase */}
          {(phase === "avatar" || phase === "expansion") && (
            <motion.div
              key="avatar"
              ref={avatarRef}
              initial={{ opacity: 0, scale: 0.3, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 1.2, type: "spring", stiffness: 100 }}
              className="text-center space-y-8 px-4"
            >
              {/* Avatar Container with Gold Ring */}
              <motion.div
                className="relative w-[220px] h-[220px] mx-auto"
                initial={{ rotate: 0, scale: 0.5 }}
                animate={{ rotate: 360, scale: [0.5, 1.15, 1] }}
                transition={{ duration: 2, ease: "easeOut" }}
              >
                {/* Pulsing Glow Rings */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full"
                    style={{
                      boxShadow: "0 0 60px rgba(201, 169, 97, 0.4)",
                    }}
                    initial={{ scale: 1, opacity: 0 }}
                    animate={{ scale: [1, 2, 2.5], opacity: [0.8, 0.3, 0] }}
                    transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
                  />
                ))}

                {/* Rotating Gradient Background */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #C9A961 0%, #8B7355 100%)",
                    padding: "8px",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  {/* Inner Ring */}
                  <div
                    className="w-full h-full rounded-full"
                    style={{
                      background: "linear-gradient(135deg, #A0895C 0%, #6D5D48 100%)",
                      padding: "4px",
                    }}
                  >
                    {/* Avatar Image */}
                    <div className="w-full h-full rounded-full bg-black overflow-hidden">
                      <Image
                        src="/professional-headshot.png"
                        alt="Michael Crowe"
                        width={220}
                        height={220}
                        className="w-full h-full object-cover"
                        priority
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Sparkle Particles */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      background: "#D4AF37",
                      left: `${50 + Math.cos((i / 12) * Math.PI * 2) * 130}px`,
                      top: `${50 + Math.sin((i / 12) * Math.PI * 2) * 130}px`,
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </motion.div>

              {/* Brand Text */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
              >
                <h1
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-white"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    letterSpacing: "0.02em",
                    textShadow: "0 2px 20px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  Michael Crowe
                </h1>
                <p
                  className="text-lg md:text-xl lg:text-2xl text-gray-300"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 300,
                    letterSpacing: "0.05em",
                    textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  AI Systems Architect
                </p>
              </motion.div>

              {/* Optional: Enter Button */}
              {phase === "avatar" && (
                <motion.button
                  onClick={onComplete}
                  className="mt-8 px-8 py-4 rounded-full font-semibold transition-all pointer-events-auto transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-black"
                  style={{
                    background: "linear-gradient(135deg, #C9A961 0%, #D4AF37 100%)",
                    color: "#000",
                    boxShadow: "0 0 30px rgba(201, 169, 97, 0.5)",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 }}
                >
                  Enter Site
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
