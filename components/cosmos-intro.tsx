"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

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

export function CosmosIntro({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [starCount, setStarCount] = useState(0)
  const [progress, setProgress] = useState(0)

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
      scene.fog = new THREE.Fog(0x000000, 50, 200)

      // Camera
      camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
      camera.position.set(0, 0, 30)

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

        data.stars.forEach((star) => {
          positions.push(star.x * 3, star.y * 3, star.z * 3)

          // Convert hex color to RGB
          const color = new THREE.Color(star.color)
          colors.push(color.r, color.g, color.b)

          // Size based on magnitude (lower magnitude = brighter = larger)
          // Magnitude scale is inverted (negative is brightest)
          const size = Math.max(0.1, 3.0 - star.magnitude * 0.3)
          sizes.push(size)
        })

        geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
        geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))
        geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1))

        // Custom shader material for better star rendering
        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            opacity: { value: 0 },
          },
          vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float opacity;

            void main() {
              vColor = color;
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              gl_PointSize = size * (300.0 / -mvPosition.z) * opacity;
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            uniform float opacity;

            void main() {
              // Create circular star with soft edges
              vec2 center = gl_PointCoord - vec2(0.5);
              float dist = length(center);

              if (dist > 0.5) discard;

              // Soft glow
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

      // Add ambient starlight
      const ambientLight = new THREE.AmbientLight(0x404040, 0.5)
      scene.add(ambientLight)

      // Handle window resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener("resize", handleResize)

      // Animation loop
      function animate() {
        animationId = requestAnimationFrame(animate)

        const elapsed = (Date.now() - startTime) / 1000
        controls.update()

        if (stars) {
          const material = stars.material as THREE.ShaderMaterial

          // Fade in stars over 3 seconds
          if (elapsed < 3) {
            material.uniforms.opacity.value = elapsed / 3
            setProgress((elapsed / 3) * 50) // 0-50%
          } else {
            material.uniforms.opacity.value = 1
          }

          // Gentle rotation
          stars.rotation.y += 0.0002

          // Update time uniform for any time-based effects
          material.uniforms.time.value = elapsed
        }

        // Auto-complete after 8 seconds (or user can skip)
        if (elapsed > 8) {
          setProgress(100)
          setTimeout(() => {
            onComplete()
          }, 500)
        } else if (elapsed >= 3) {
          // Progress from 50% to 100% over remaining 5 seconds
          setProgress(50 + ((elapsed - 3) / 5) * 50)
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

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
        {isLoading ? (
          <div className="text-white text-xl">Loading cosmos...</div>
        ) : (
          <div className="text-center space-y-6 px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white opacity-90 animate-fade-in">
              Navigating the Universe of Possibilities
            </h1>
            <p className="text-xl md:text-2xl text-white/70 animate-fade-in animation-delay-500">
              {starCount.toLocaleString()} stars • Infinite potential
            </p>
            <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden mx-auto animate-fade-in animation-delay-1000">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-gold transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <button
              onClick={onComplete}
              className="mt-8 px-6 py-3 bg-gold/20 hover:bg-gold/30 text-gold border border-gold/50 rounded-full transition-all pointer-events-auto animate-fade-in animation-delay-1500 backdrop-blur-sm"
            >
              Enter Site
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-8 right-8 text-white/50 text-sm pointer-events-none animate-fade-in animation-delay-2000">
        <p>Drag to explore • Scroll to zoom</p>
      </div>
    </div>
  )
}
