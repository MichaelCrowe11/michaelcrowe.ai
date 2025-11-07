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

type IntroPhase = "age-of-possibilities" | "big-bang" | "cosmos-expand" | "neural-network" | "matrix-code" | "avatar-reveal" | "brand-message" | "complete"

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
    let neuralNetwork: THREE.Group | null = null
    let particles: THREE.Points | null = null
    let dataFlows: THREE.Line[] = []
    let nebulaClouds: THREE.Mesh[] = []
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

        // Create explosion particles for Big Bang
        const particleCount = 2000
        const particleGeometry = new THREE.BufferGeometry()
        const particlePositions: number[] = []
        const particleColors: number[] = []
        const particleSizes: number[] = []
        const particleVelocities: number[] = []

        for (let i = 0; i < particleCount; i++) {
          particlePositions.push(0, 0, 0) // Start at center
          
          // Random direction for explosion
          const theta = Math.random() * Math.PI * 2
          const phi = Math.random() * Math.PI
          const speed = Math.random() * 50 + 30
          particleVelocities.push(
            Math.sin(phi) * Math.cos(theta) * speed,
            Math.sin(phi) * Math.sin(theta) * speed,
            Math.cos(phi) * speed
          )
          
          // Hot colors: white, yellow, orange, red
          const colorChoice = Math.random()
          if (colorChoice < 0.3) {
            particleColors.push(1, 1, 1) // White
          } else if (colorChoice < 0.6) {
            particleColors.push(1, 0.8, 0.2) // Yellow
          } else if (colorChoice < 0.8) {
            particleColors.push(1, 0.5, 0) // Orange
          } else {
            particleColors.push(1, 0.2, 0.2) // Red
          }
          
          particleSizes.push(Math.random() * 3 + 1)
        }

        particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3))
        particleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(particleColors, 3))
        particleGeometry.setAttribute('size', new THREE.Float32BufferAttribute(particleSizes, 1))
        particleGeometry.setAttribute('velocity', new THREE.Float32BufferAttribute(particleVelocities, 3))

        const particleMaterial = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            opacity: { value: 0 }
          },
          vertexShader: `
            attribute float size;
            attribute vec3 color;
            attribute vec3 velocity;
            varying vec3 vColor;
            uniform float time;
            uniform float opacity;

            void main() {
              vColor = color;
              vec3 pos = position + velocity * time;
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
              
              float glow = 1.0 - smoothstep(0.0, 0.5, dist);
              gl_FragColor = vec4(vColor * glow, glow * opacity);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })

        particles = new THREE.Points(particleGeometry, particleMaterial)
        scene.add(particles)

        // Create volumetric nebula clouds
        for (let i = 0; i < 5; i++) {
          const cloudGeometry = new THREE.SphereGeometry(30, 32, 32)
          const cloudMaterial = new THREE.ShaderMaterial({
            uniforms: {
              color1: { value: new THREE.Color(0x4a90e2) },
              color2: { value: new THREE.Color(0xdaa520) },
              time: { value: 0 },
              opacity: { value: 0 }
            },
            vertexShader: `
              varying vec3 vPosition;
              void main() {
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `,
            fragmentShader: `
              uniform vec3 color1;
              uniform vec3 color2;
              uniform float time;
              uniform float opacity;
              varying vec3 vPosition;

              float noise(vec3 p) {
                return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
              }

              void main() {
                float n = noise(vPosition * 0.05 + time * 0.1);
                vec3 color = mix(color1, color2, n);
                float alpha = n * 0.15 * opacity;
                gl_FragColor = vec4(color, alpha);
              }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            depthWrite: false
          })
          const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial)
          cloud.position.set(
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100 - 50
          )
          cloud.scale.setScalar(Math.random() * 2 + 1)
          nebulaClouds.push(cloud)
          scene.add(cloud)
        }

        // Create Neural Network visualization
        neuralNetwork = new THREE.Group()
        
        // Create 3 layers of neurons
        const layers = [6, 8, 6] // Input, hidden, output
        const layerSpacing = 20
        const neuronSpacing = 8
        const neurons: THREE.Mesh[] = []
        const connections: THREE.Line[] = []
        
        layers.forEach((neuronCount, layerIndex) => {
          const x = (layerIndex - 1) * layerSpacing
          
          for (let i = 0; i < neuronCount; i++) {
            const y = (i - neuronCount / 2) * neuronSpacing
            
            // Neuron sphere
            const neuronGeometry = new THREE.SphereGeometry(1.5, 16, 16)
            const neuronMaterial = new THREE.MeshBasicMaterial({
              color: 0xdaa520,
              transparent: true,
              opacity: 0
            })
            const neuron = new THREE.Mesh(neuronGeometry, neuronMaterial)
            neuron.position.set(x, y, 0)
            neuralNetwork.add(neuron)
            neurons.push(neuron)
            
            // Glow effect
            const glowGeometry = new THREE.SphereGeometry(2, 16, 16)
            const glowMaterial = new THREE.MeshBasicMaterial({
              color: 0xdaa520,
              transparent: true,
              opacity: 0,
              side: THREE.BackSide
            })
            const glow = new THREE.Mesh(glowGeometry, glowMaterial)
            glow.position.set(x, y, 0)
            neuralNetwork.add(glow)
            
            // Connect to previous layer
            if (layerIndex > 0) {
              const prevLayerNeuronCount = layers[layerIndex - 1]
              for (let j = 0; j < prevLayerNeuronCount; j++) {
                const prevY = (j - prevLayerNeuronCount / 2) * neuronSpacing
                const prevX = (layerIndex - 2) * layerSpacing
                
                const points = [
                  new THREE.Vector3(prevX, prevY, 0),
                  new THREE.Vector3(x, y, 0)
                ]
                const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
                const lineMaterial = new THREE.LineBasicMaterial({
                  color: 0x4a90e2,
                  transparent: true,
                  opacity: 0
                })
                const line = new THREE.Line(lineGeometry, lineMaterial)
                neuralNetwork.add(line)
                connections.push(line)
              }
            }
          }
        })
        
        neuralNetwork.visible = false
        scene.add(neuralNetwork)

        // Create animated data flows through neural network
        const flowCount = 20
        for (let i = 0; i < flowCount; i++) {
          const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-20, (Math.random() - 0.5) * 30, 0),
            new THREE.Vector3(0, (Math.random() - 0.5) * 30, 0),
            new THREE.Vector3(20, (Math.random() - 0.5) * 30, 0)
          ])
          const points = curve.getPoints(50)
          const flowGeometry = new THREE.BufferGeometry().setFromPoints(points)
          const flowMaterial = new THREE.LineBasicMaterial({
            color: 0x00ff88,
            transparent: true,
            opacity: 0,
            linewidth: 2
          })
          const flow = new THREE.Line(flowGeometry, flowMaterial)
          dataFlows.push(flow)
          scene.add(flow)
        }

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

          // Phase timeline with smooth transitions
          if (elapsed < 5) {
            // Phase 1: "Age of Possibilities" (0-5s)
            setPhase("age-of-possibilities")
          } else if (elapsed < 8) {
            // Phase 2: Big Bang explosion (5-8s)
            setPhase("big-bang")
            const explosionProgress = (elapsed - 5) / 3

            // Eased explosion with acceleration
            const easedProgress = explosionProgress < 0.5
              ? 2 * explosionProgress * explosionProgress
              : 1 - Math.pow(-2 * explosionProgress + 2, 2) / 2

            material.uniforms.explosionFactor.value = easedProgress
            material.uniforms.opacity.value = 1

            // Animate explosion particles
            if (particles) {
              const particleMat = particles.material as THREE.ShaderMaterial
              particleMat.uniforms.time.value = explosionProgress * 2
              particleMat.uniforms.opacity.value = Math.min(1, explosionProgress * 2) * 
                                                    (1 - explosionProgress) // Fade out as they expand
            }

            // Enhanced flash effect with color gradation
            if (elapsed < 5.3) {
              scene.background = new THREE.Color(0xffffff)
            } else if (elapsed < 5.8) {
              const flashFade = (elapsed - 5.3) / 0.5
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
          } else if (elapsed < 13) {
            // Phase 3: Cosmos expansion (8-13s)
            setPhase("cosmos-expand")
            material.uniforms.explosionFactor.value = 1
            material.uniforms.opacity.value = 1
            controls.enabled = true

            // Fade out particles
            if (particles) {
              const particleMat = particles.material as THREE.ShaderMaterial
              particleMat.uniforms.opacity.value = Math.max(0, 1 - (elapsed - 8) / 2)
            }

            // Fade in nebula clouds
            nebulaClouds.forEach(cloud => {
              const cloudMat = cloud.material as THREE.ShaderMaterial
              cloudMat.uniforms.opacity.value = Math.min(1, (elapsed - 9) / 2)
              cloudMat.uniforms.time.value = elapsed
              cloud.rotation.y += 0.001
              cloud.rotation.x += 0.0005
            })

            // Reset camera shake
            camera.position.x = 0
            camera.position.y = 0

            // Smooth zoom in to prepare for neural network
            const zoomProgress = (elapsed - 8) / 5
            camera.position.z = 50 - (zoomProgress * 15) // Zoom from 50 to 35
          } else if (elapsed < 19) {
            // Phase 4: Neural Network AI Showcase (13-19s)
            setPhase("neural-network")
            
            // Smooth crossfade: stars fade out as network fades in
            const transitionProgress = (elapsed - 13) / 2 // 2 second crossfade
            material.uniforms.opacity.value = Math.max(0, 1 - Math.min(1, transitionProgress))
            controls.enabled = false
            
            // Fade out nebula clouds
            nebulaClouds.forEach(cloud => {
              const cloudMat = cloud.material as THREE.ShaderMaterial
              cloudMat.uniforms.opacity.value = Math.max(0, 1 - transitionProgress)
            })
            
            // Show neural network with smooth fade
            if (neuralNetwork) {
              neuralNetwork.visible = true
              const networkProgress = Math.max(0, (elapsed - 13) / 6) // Full duration
              
              // Animate network appearance with cascading effect
              neuralNetwork.children.forEach((child, index) => {
                if (child instanceof THREE.Mesh) {
                  const delay = index * 0.015
                  const opacity = Math.min(1, Math.max(0, (networkProgress - delay) * 2.5))
                  ;(child.material as THREE.MeshBasicMaterial).opacity = opacity
                  
                  // Pulsing glow effect on neurons
                  const glowPulse = Math.sin(elapsed * 4 + index * 0.5) * 0.3 + 0.7
                  ;(child.material as THREE.MeshBasicMaterial).opacity = opacity * glowPulse
                } else if (child instanceof THREE.Line) {
                  const delay = index * 0.008
                  const opacity = Math.min(0.6, Math.max(0, (networkProgress - delay) * 1.8))
                  ;(child.material as THREE.LineBasicMaterial).opacity = opacity
                }
              })
              
              // Smooth rotation
              neuralNetwork.rotation.y = (elapsed - 13) * 0.4
              
              // Subtle pulse effect
              const pulse = Math.sin((elapsed - 13) * 2) * 0.05 + 1
              neuralNetwork.scale.setScalar(pulse)
            }
            
            // Animate data flows through network
            dataFlows.forEach((flow, index) => {
              const flowMat = flow.material as THREE.LineBasicMaterial
              const flowProgress = ((elapsed - 14 + index * 0.1) % 2) / 2 // Cycle every 2 seconds
              flowMat.opacity = Math.sin(flowProgress * Math.PI) * 0.8
              flow.visible = elapsed > 14
            })
            
            // Camera slowly orbits around network
            camera.position.z = 35
            camera.position.x = Math.sin((elapsed - 13) * 0.2) * 5
            camera.position.y = Math.cos((elapsed - 13) * 0.15) * 3
            camera.lookAt(0, 0, 0)
          } else if (elapsed < 23) {
            // Phase 5: Matrix Code Rain (19-23s) - Smooth transition
            setPhase("matrix-code")
            
            // Smooth fade out neural network over 1.5 seconds
            if (neuralNetwork) {
              const fadeOut = Math.max(0, 1 - (elapsed - 19) / 1.5)
              neuralNetwork.children.forEach((child) => {
                if (child instanceof THREE.Mesh) {
                  ;(child.material as THREE.MeshBasicMaterial).opacity *= fadeOut
                } else if (child instanceof THREE.Line) {
                  ;(child.material as THREE.LineBasicMaterial).opacity *= fadeOut
                }
              })
              if (fadeOut === 0) {
                neuralNetwork.visible = false
              }
            }
            
            // Stars fade back in smoothly
            const fadeProgress = Math.min(1, (elapsed - 19.5) / 2)
            material.uniforms.opacity.value = fadeProgress * 0.4 // Dimmer for matrix effect
            
            // Camera smooth zoom out
            camera.position.z = 35 + ((elapsed - 19) / 4) * 15 // 35 to 50
            camera.position.x *= 0.95 // Return to center
            camera.position.y *= 0.95
          } else if (elapsed < 31) {
            // Phase 6: Avatar reveal (23-31s) - Smooth star brightness increase
            setPhase("avatar-reveal")
            const brightnessProgress = Math.min(1, (elapsed - 23) / 2)
            material.uniforms.opacity.value = 0.4 + (brightnessProgress * 0.6) // 0.4 to 1.0
            
            // Camera settle into final position
            camera.position.z = 50
            camera.position.x *= 0.9
            camera.position.y *= 0.9
            camera.lookAt(0, 0, 0)
          } else if (elapsed < 36) {
            // Phase 7: Brand message (31-36s)
            setPhase("brand-message")
            material.uniforms.opacity.value = 1
          } else {
            // Phase 8: Complete - Fade to black
            setPhase("complete")
            const fadeOut = Math.min(1, (elapsed - 36) / 1)
            material.uniforms.opacity.value = 1 - fadeOut
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

            {/* Phase 4: Neural Network - AI SHOWCASE */}
            {phase === "neural-network" && (
              <div className="text-center space-y-8 px-4 animate-fade-in-fast">
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="h-px w-20 bg-gradient-to-r from-transparent to-gold/50"></div>
                    <span className="text-sm text-gold/60 font-mono tracking-widest">AI SYSTEMS</span>
                    <div className="h-px w-20 bg-gradient-to-l from-transparent to-gold/50"></div>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                    Neural Networks
                    <span className="block text-gold text-shimmer mt-2">In Motion</span>
                  </h2>
                  <p className="text-xl md:text-2xl text-white/70 font-light max-w-2xl mx-auto">
                    Watch AI learn, adapt, and evolve—
                    <span className="block text-white/90 mt-2">
                      Building intelligence layer by layer
                    </span>
                  </p>
                </div>
                <div className="flex items-center justify-center gap-8 mt-8">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse mb-2"></div>
                    <span className="text-xs text-white/50 font-mono">INPUT</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-gold animate-pulse mb-2" style={{ animationDelay: '0.2s' }}></div>
                    <span className="text-xs text-white/50 font-mono">HIDDEN</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse mb-2" style={{ animationDelay: '0.4s' }}></div>
                    <span className="text-xs text-white/50 font-mono">OUTPUT</span>
                  </div>
                </div>
              </div>
            )}

            {/* Phase 5: Matrix Code Rain - WEB ANIMATION SHOWCASE */}
            {phase === "matrix-code" && (
              <div className="text-center space-y-8 px-4 animate-fade-in-fast">
                <div className="scanline"></div>
                <div className="space-y-4">
                  {/* Enhanced Matrix Rain with multiple columns */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                    <div className="matrix-column" style={{ left: '10%' }}>
                      <div className="matrix-rain-text animate-scroll-up font-mono text-green-400 text-xs">
                        AI・機械学習・深層学習<br/>
                        01001001 01101110<br/>
                        NEURAL・NETWORK<br/>
                        01110110 01100001<br/>
                        データ・分析・予測<br/>
                        01110100 01101111<br/>
                      </div>
                    </div>
                    <div className="matrix-column" style={{ left: '25%', animationDelay: '0.5s' }}>
                      <div className="matrix-rain-text animate-scroll-up font-mono text-green-400 text-xs">
                        PYTHON・REACT・AI<br/>
                        01110011 00100000<br/>
                        アルゴリズム・最適化<br/>
                        01000011 01101111<br/>
                        INNOVATION・CODE<br/>
                        01100100 01100101<br/>
                      </div>
                    </div>
                    <div className="matrix-column" style={{ left: '45%', animationDelay: '1s' }}>
                      <div className="matrix-rain-text animate-scroll-up font-mono text-green-400 text-xs">
                        三次元・可視化<br/>
                        01110011 01110100<br/>
                        WEBGL・SHADER<br/>
                        01110010 01100001<br/>
                        フレームワーク<br/>
                        01101110 01110011<br/>
                      </div>
                    </div>
                    <div className="matrix-column" style={{ left: '65%', animationDelay: '1.5s' }}>
                      <div className="matrix-rain-text animate-scroll-up font-mono text-green-400 text-xs">
                        TRANSFORM・CLOUD<br/>
                        01100110 01101111<br/>
                        クラウド・API<br/>
                        01110010 01101101<br/>
                        NEXT.JS・VERCEL<br/>
                        01100001 01101110<br/>
                      </div>
                    </div>
                    <div className="matrix-column" style={{ left: '85%', animationDelay: '2s' }}>
                      <div className="matrix-rain-text animate-scroll-up font-mono text-green-400 text-xs">
                        自動化・効率化<br/>
                        01100011 01100101<br/>
                        OPTIMIZATION<br/>
                        01101001 01101110<br/>
                        データサイエンス<br/>
                        01110100 01101111<br/>
                      </div>
                    </div>
                  </div>
                  
                  {/* Center content above the matrix rain */}
                  <div className="relative z-10 mt-32">
                    <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                      <span className="text-green-400">Innovation</span> Is Code
                      <span className="block text-gold text-shimmer mt-2">Excellence Is Execution</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-white/70 font-light max-w-2xl mx-auto mt-6">
                      From elegant algorithms to stunning interfaces—
                      <span className="block text-white/90 mt-2">
                        Every pixel, every line, crafted with purpose
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Phase 6: Avatar Reveal - METEOR ENTRANCE */}
            {phase === "avatar-reveal" && (
              <div className="text-center space-y-10 px-4">
                <div className="relative w-80 h-80 mx-auto flex items-center justify-center">
                  {/* Multi-layer glow effects */}
                  <div className="absolute inset-0 -m-20 rounded-full bg-gold/20 blur-[120px] animate-pulse-slow"></div>
                  <div className="absolute inset-0 -m-12 rounded-full bg-gold/25 blur-[80px]"></div>
                  
                  {/* Animated rings */}
                  <div className="absolute inset-0 rounded-full border border-gold/30 animate-ping-slow"></div>
                  <div className="absolute inset-4 rounded-full border border-gold/20 animate-ping-slow" style={{ animationDelay: '1s' }}></div>
                  
                  {/* Logo with METEOR entrance - TRANSPARENT VERSION */}
                  <div className="relative z-10 animate-meteor-entry" style={{ filter: 'drop-shadow(0 0 80px rgba(218, 165, 32, 1)) drop-shadow(0 0 40px rgba(218, 165, 32, 0.8))' }}>
                    <Image
                      src="/crowe-logic-logo-transparent.png"
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

            {/* Phase 7: Brand Message */}
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

            {/* Phase 8: Complete (fading out) */}
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
