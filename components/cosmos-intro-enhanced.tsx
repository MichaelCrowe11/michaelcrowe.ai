"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import Image from "next/image"

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
  const [starCount, setStarCount] = useState(0)

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
        const response = await fetch("/data.json")
        const data: StarCatalog = await response.json()
        setStarCount(data.stars.length)

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

        // Custom shader material
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
            uniform float opacity;
            uniform float explosionFactor;

            void main() {
              vColor = color;

              // Interpolate between center (0,0,0) and target position
              vec3 pos = mix(vec3(0.0), targetPosition, explosionFactor);

              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (300.0 / -mvPosition.z) * opacity;
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            uniform float opacity;

            void main() {
              vec2 center = gl_PointCoord - vec2(0.5);
              float dist = length(center);

              if (dist > 0.5) discard;

              float intensity = 1.0 - (dist * 2.0);
              intensity = pow(intensity, 2.0);

              gl_FragColor = vec4(vColor * intensity, intensity * opacity);
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
        console.error("Error loading star data:", error)
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
          if (elapsed < 3) {
            // Phase 1: "Age of Possibilities" (0-3s)
            setPhase("age-of-possibilities")
          } else if (elapsed < 4) {
            // Phase 2: Big Bang explosion (3-4s)
            setPhase("big-bang")
            const explosionProgress = (elapsed - 3) / 1
            material.uniforms.explosionFactor.value = explosionProgress
            material.uniforms.opacity.value = 1

            // Flash effect at start of explosion
            if (elapsed < 3.2) {
              scene.background = new THREE.Color(0xffffff)
            } else {
              scene.background = new THREE.Color(0x000000)
            }
          } else if (elapsed < 7) {
            // Phase 3: Cosmos expansion (4-7s)
            setPhase("cosmos-expand")
            material.uniforms.explosionFactor.value = 1
            material.uniforms.opacity.value = 1
            controls.enabled = true

            // Zoom in camera
            if (camera.position.z > 30) {
              camera.position.z -= 0.15
            }
          } else if (elapsed < 9) {
            // Phase 4: Avatar reveal (7-9s)
            setPhase("avatar-reveal")
          } else if (elapsed < 12) {
            // Phase 5: Brand message (9-12s)
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
                <p className="text-2xl md:text-3xl text-white/80">
                  {starCount.toLocaleString()} possibilities
                </p>
                <p className="text-xl md:text-2xl text-white/60">
                  Drag to explore • Scroll to zoom
                </p>
              </div>
            )}

            {/* Phase 4: Avatar Reveal */}
            {phase === "avatar-reveal" && (
              <div className="text-center space-y-8 px-4 animate-fade-in">
                <div className="relative w-48 h-48 mx-auto">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gold/20 via-accent/20 to-gold/20 animate-pulse" />
                  <div className="absolute inset-2 rounded-full overflow-hidden border-4 border-gold shadow-2xl shadow-gold/50">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/crowe-logic-logo-87FZNrbBWYjPIm7AaAVgQ2TQIx435b.png"
                      alt="Michael Crowe"
                      width={192}
                      height={192}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    Michael Crowe
                  </h2>
                  <p className="text-xl md:text-2xl text-gold">
                    AI Systems Architect
                  </p>
                </div>
              </div>
            )}

            {/* Phase 5: Brand Message */}
            {phase === "brand-message" && (
              <div className="text-center space-y-8 px-4 max-w-4xl animate-fade-in">
                <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                  Building AI That Actually Works
                  <span className="block text-gold mt-2">For Small Business</span>
                </h2>
                <p className="text-xl md:text-2xl text-white/70 leading-relaxed">
                  Self-taught developer who scaled a business from garage to serving millions.
                  <span className="block text-white/90 mt-2">
                    Now helping small businesses do the same—but faster, with AI.
                  </span>
                </p>
                <button
                  onClick={onComplete}
                  className="mt-8 px-8 py-4 bg-gold hover:bg-gold/90 text-gold-foreground font-semibold rounded-full transition-all pointer-events-auto transform hover:scale-105 shadow-lg shadow-gold/50"
                >
                  Enter
                </button>
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
