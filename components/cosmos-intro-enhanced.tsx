"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import Image from "next/image"
import { config } from "@/lib/config"
import { FloatingAvatar } from "@/components/floating-avatar"

interface Star {
  id: number
  x: number
  y: number
  z: number
  magnitude: number
  color: string
  name?: string
}

interface StarCatalog {
  metadata: {
    catalog: string
    total_stars: number
    coordinate_system: string
    magnitude_range: number[]
    description: string
  }
  stars: Star[]
}

type IntroPhase = "age-of-possibilities" | "big-bang" | "cosmos-expand" | "avatar-reveal" | "brand-message" | "complete"

export function CosmosIntro({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [phase, setPhase] = useState<IntroPhase>("age-of-possibilities")

  useEffect(() => {
    if (!containerRef.current) return

    let scene: THREE.Scene
    let camera: THREE.PerspectiveCamera
    let renderer: THREE.WebGLRenderer
    let controls: OrbitControls
    let stars: THREE.Points
    let animationId: number
    let startTime = Date.now()

    async function init() {
      // Scene setup
      scene = new THREE.Scene()
      scene.background = new THREE.Color(0x000000)

      // Camera
      camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
      camera.position.set(0, 0, 50)

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      containerRef.current?.appendChild(renderer.domElement)

      // Controls
      controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.05
      controls.enableZoom = true
      controls.enablePan = false
      controls.minDistance = 10
      controls.maxDistance = 100
      controls.autoRotate = true
      controls.autoRotateSpeed = 0.3
      controls.enabled = false // Start disabled

      // Load star data
      try {
        const response = await fetch(config.site.starDataUrl)
        const data: StarCatalog = await response.json()

        // Create star field
        const geometry = new THREE.BufferGeometry()
        const positions: number[] = []
        const colors: number[] = []
        const sizes: number[] = []
        const velocities: number[] = []

        data.stars.forEach((star) => {
          // Initial position at center for big bang effect
          positions.push(0, 0, 0)

          // Store target position in velocity array temporarily
          velocities.push(star.x * 3, star.y * 3, star.z * 3)

          const color = new THREE.Color(star.color)
          colors.push(color.r, color.g, color.b)

          const size = Math.max(0.1, 3.0 - star.magnitude * 0.3)
          sizes.push(size)
        })

        geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
        geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))
        geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1))
        geometry.setAttribute("targetPosition", new THREE.Float32BufferAttribute(velocities, 3))

        // Enhanced shader material with better glow and twinkle
        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            opacity: { value: 0 },
            explosionFactor: { value: 0 },
          },
          vertexShader: `
            attribute float size;
            attribute vec3 color;
            attribute vec3 targetPosition;
            varying vec3 vColor;
            varying float vDistance;
            uniform float opacity;
            uniform float explosionFactor;
            uniform float time;

            void main() {
              vColor = color;

              // Interpolate between center (0,0,0) and target position
              vec3 pos = mix(vec3(0.0), targetPosition, explosionFactor);

              // Add subtle twinkle during expansion
              float twinkle = sin(time * 2.0 + length(targetPosition) * 0.5) * 0.2 + 0.8;

              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              vDistance = -mvPosition.z;

              // Larger stars with better scaling
              gl_PointSize = size * (400.0 / -mvPosition.z) * opacity * twinkle;
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            varying float vDistance;
            uniform float opacity;
            uniform float time;

            void main() {
              vec2 center = gl_PointCoord - vec2(0.5);
              float dist = length(center);

              if (dist > 0.5) discard;

              // Enhanced glow with multiple layers
              float innerGlow = 1.0 - (dist * 2.0);
              innerGlow = pow(innerGlow, 1.5);

              float outerGlow = 1.0 - smoothstep(0.0, 0.5, dist);
              outerGlow = pow(outerGlow, 3.0);

              float finalGlow = mix(outerGlow, innerGlow, 0.6);

              // Add chromatic shimmer
              vec3 shimmer = vColor + vec3(
                sin(time * 3.0 + vDistance * 0.1) * 0.1,
                sin(time * 2.0 + vDistance * 0.1) * 0.1,
                sin(time * 4.0 + vDistance * 0.1) * 0.1
              );

              gl_FragColor = vec4(shimmer * finalGlow, finalGlow * opacity);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })

        stars = new THREE.Points(geometry, material)
        scene.add(stars)

        setIsLoading(false)
      } catch (error) {
        // TODO: Implement proper error tracking (e.g., Sentry)
        // Fallback: Set loading to false to prevent infinite loading state
        setIsLoading(false)
      }

      // Handle window resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener("resize", handleResize)

      // Animation loop with phases
      function animate() {
        animationId = requestAnimationFrame(animate)

        const elapsed = (Date.now() - startTime) / 1000
        controls.update()

        if (stars) {
          const material = stars.material as THREE.ShaderMaterial

          // Phase timeline
          if (elapsed < 6) {
            // Phase 1: "Age of Possibilities" (0-6s) - DOUBLED
            setPhase("age-of-possibilities")
          } else if (elapsed < 9) {
            // Phase 2: Big Bang explosion (6-9s) - DOUBLED for more drama
            setPhase("big-bang")
            const explosionProgress = (elapsed - 6) / 3

            // Eased explosion with acceleration
            const easedProgress = explosionProgress < 0.5
              ? 2 * explosionProgress * explosionProgress
              : 1 - Math.pow(-2 * explosionProgress + 2, 2) / 2

            material.uniforms.explosionFactor.value = easedProgress
            material.uniforms.opacity.value = 1

            // Enhanced flash effect with color gradation
            if (elapsed < 6.3) {
              scene.background = new THREE.Color(0xffffff)
            } else if (elapsed < 6.8) {
              const flashFade = (elapsed - 6.3) / 0.5
              scene.background = new THREE.Color().lerpColors(
                new THREE.Color(0xffffff),
                new THREE.Color(0x1a1a2e),
                flashFade
              )
            } else {
              scene.background = new THREE.Color(0x000000)
            }

            // Camera shake effect during explosion
            camera.position.x = Math.sin(elapsed * 20) * 0.5
            camera.position.y = Math.cos(elapsed * 20) * 0.5
          } else if (elapsed < 15) {
            // Phase 3: Cosmos expansion (9-15s) - DOUBLED
            setPhase("cosmos-expand")
            material.uniforms.explosionFactor.value = 1
            material.uniforms.opacity.value = 1
            controls.enabled = true

            // Reset camera shake
            camera.position.x = 0
            camera.position.y = 0

            // Smoother zoom in
            if (camera.position.z > 25) {
              camera.position.z -= 0.06
            }
          } else if (elapsed < 24) {
            // Phase 4: Avatar reveal - DOUBLED (15-24s)
            setPhase("avatar-reveal")
          } else if (elapsed < 30) {
            // Phase 5: Brand message - DOUBLED (24-30s)
            setPhase("brand-message")
          } else {
            // Phase 6: Complete
            setPhase("complete")
            setTimeout(() => {
              onComplete()
            }, 500)
          }

          material.uniforms.time.value = elapsed
        }

        renderer.render(scene, camera)
      }

      animate()

      return () => {
        window.removeEventListener("resize", handleResize)
        cancelAnimationFrame(animationId)
        controls.dispose()
        renderer.dispose()
        containerRef.current?.removeChild(renderer.domElement)
      }
    }

    init()

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div ref={containerRef} className="w-full h-full" />

      {/* Phase overlays */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
        {isLoading ? (
          <div className="text-white text-xl">Initializing...</div>
        ) : (
          <>
            {/* Phase 1: Age of Possibilities */}
            {phase === "age-of-possibilities" && (
              <div className="text-center space-y-8 px-4 animate-fade-in">
                <div className="space-y-4">
                  <p className="text-xl md:text-2xl text-white/60 font-light">
                    We live in
                  </p>
                  <h1 className="text-5xl md:text-7xl font-bold text-white">
                    The Age of Possibilities
                  </h1>
                  <p className="text-xl md:text-2xl text-gold/80 font-light">
                    Where innovation meets transformation
                  </p>
                </div>
              </div>
            )}

            {/* Phase 2: Big Bang */}
            {phase === "big-bang" && (
              <div className="text-center space-y-4 px-4">
                <h2 className="text-4xl md:text-6xl font-bold text-white animate-pulse">
                  And it all begins...
                </h2>
              </div>
            )}

            {/* Phase 3: Cosmos Expansion */}
            {phase === "cosmos-expand" && (
              <div className="text-center space-y-6 px-4 animate-fade-in">
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                    Every Data Point
                    <span className="block text-gold/90">Tells a Story</span>
                  </h2>
                  <p className="text-xl md:text-2xl text-white/70 font-light max-w-2xl mx-auto">
                    From patterns in the cosmos to insights in your business—
                    <span className="block text-white/90 mt-2">
                      I transform complexity into clarity
                    </span>
                  </p>
                </div>
                <p className="text-sm md:text-base text-white/50 mt-8">
                  Drag to explore • Scroll to zoom
                </p>
              </div>
            )}

            {/* Phase 4: Avatar Reveal - METEOR ENTRANCE */}
            {phase === "avatar-reveal" && (
              <div className="text-center space-y-10 px-4">
                <div className="relative w-80 h-80 mx-auto flex items-center justify-center">
                  {/* Multi-layer glow effects */}
                  <div className="absolute inset-0 -m-20 rounded-full bg-gold/20 blur-[120px] animate-pulse-slow"></div>
                  <div className="absolute inset-0 -m-12 rounded-full bg-gold/25 blur-[80px]"></div>
                  
                  {/* Animated rings */}
                  <div className="absolute inset-0 rounded-full border border-gold/30 animate-ping-slow"></div>
                  <div className="absolute inset-4 rounded-full border border-gold/20 animate-ping-slow" style={{ animationDelay: '1s' }}></div>
                  
                  {/* Logo with METEOR entrance - WHITE BACKGROUND REMOVED */}
                  <svg className="absolute inset-0 w-0 h-0">
                    <defs>
                      <filter id="remove-white">
                        <feColorMatrix
                          type="matrix"
                          values="1 0 0 0 0
                                  0 1 0 0 0
                                  0 0 1 0 0
                                  -1 -1 -1 1 0"
                        />
                      </filter>
                    </defs>
                  </svg>
                  <div className="relative z-10 animate-meteor-entry" style={{ filter: 'url(#remove-white) drop-shadow(0 0 80px rgba(218, 165, 32, 1)) drop-shadow(0 0 40px rgba(218, 165, 32, 0.8))' }}>
                    <Image
                      src={config.branding.logoUrl}
                      alt="Crowe Logic"
                      width={320}
                      height={320}
                      className="w-full h-full object-contain"
                      priority
                    />
                  </div>
                  
                  {/* Meteor trail effect */}
                  <div className="absolute top-0 right-0 w-full h-full pointer-events-none animate-meteor-trail">
                    <div className="absolute top-0 right-0 w-[200%] h-1 bg-gradient-to-l from-transparent via-gold/60 to-transparent blur-sm"></div>
                  </div>
                </div>
                <div className="space-y-3 animate-reveal-up animation-delay-1000">
                  <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                    Michael Crowe
                  </h2>
                  <p className="text-xl md:text-2xl text-gold font-light">AI Systems Architect</p>
                  <div className="flex items-center justify-center gap-2 text-sm text-white/50 mt-4">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span>Online & Ready</span>
                  </div>
                </div>
                <p className="text-sm text-white/60 animate-pulse font-light animation-delay-1500">Press Enter to begin your conversation</p>
              </div>
            )}

            {/* Phase 5: Brand Message */}
            {phase === "brand-message" && (
              <div className="text-center space-y-8 px-4 max-w-4xl animate-fade-in">
                <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight">
                  The Future of Websites
                  <span className="block text-gold mt-3 text-shimmer">Is Conversation</span>
                </h2>
                <p className="text-xl md:text-2xl text-white/70 leading-relaxed font-light">
                  No more clicking through pages.
                  <span className="block text-white/90 mt-3 font-normal">
                    Just talk to Michael's AI. Ask anything. Get answers. Take action.
                  </span>
                </p>
                <div className="relative inline-block mt-8">
                  <div className="absolute -inset-2 bg-gold/20 rounded-full blur-xl animate-pulse-slow"></div>
                  <button
                    onClick={onComplete}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onComplete()
                      }
                    }}
                    aria-label="Enter and start conversation"
                    className="relative px-10 py-5 bg-gradient-to-r from-gold to-gold/90 hover:from-gold/90 hover:to-gold text-black font-bold rounded-full transition-all pointer-events-auto transform hover:scale-110 active:scale-95 shadow-2xl shadow-gold/50 focus:outline-none focus:ring-4 focus:ring-gold/50 focus:ring-offset-4 focus:ring-offset-black text-lg"
                  >
                    Start Conversation →
                  </button>
                </div>
              </div>
            )}

            {/* Phase 6: Complete (fading out) */}
            {phase === "complete" && (
              <div className="animate-fade-out">
                <p className="text-white/50">Welcome</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
