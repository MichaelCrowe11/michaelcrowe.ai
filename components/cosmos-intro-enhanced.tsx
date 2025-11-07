"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass.js"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js"
import Image from "next/image"
import { config } from "@/lib/config"
import { FloatingAvatar } from "@/components/floating-avatar"
import { createNoise2D } from "simplex-noise"

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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [cursorTrail, setCursorTrail] = useState<Array<{ x: number; y: number; id: number }>>([])

  // Interactive cursor tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
      
      // Add to cursor trail
      setCursorTrail(prev => {
        const newTrail = [...prev, { x: e.clientX, y: e.clientY, id: Date.now() }]
        return newTrail.slice(-15) // Keep last 15 points
      })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    let scene: THREE.Scene
    let camera: THREE.PerspectiveCamera
    let renderer: THREE.WebGLRenderer
    let composer: EffectComposer
    let bloomPass: UnrealBloomPass
    let controls: OrbitControls
    let stars: THREE.Points
    let neuralNetwork: THREE.Group | null = null
    let particles: THREE.Points | null = null
    let dataFlows: THREE.Line[] = []
    let nebulaClouds: THREE.Mesh[] = []
    let godRays: THREE.Mesh[] = []
    let lightOrbs: THREE.Mesh[] = []
    let animationId: number
    let startTime = Date.now()
    let vignette: HTMLDivElement | null = null
    const noise2D = createNoise2D()

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

      // Renderer with enhanced settings
      renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
      })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.2
      containerRef.current?.appendChild(renderer.domElement)

      // Post-processing setup
      composer = new EffectComposer(renderer)
      const renderPass = new RenderPass(scene, camera)
      composer.addPass(renderPass)

      // Bloom pass for professional glow
      bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5, // strength
        0.4, // radius
        0.85 // threshold
      )
      composer.addPass(bloomPass)

      // Film grain for cinematic look
      const filmPass = new FilmPass(0.15, false)
      composer.addPass(filmPass)

      // Custom chromatic aberration shader
      const chromaticAberrationShader = {
        uniforms: {
          tDiffuse: { value: null },
          amount: { value: 0.002 },
          angle: { value: 0.0 }
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D tDiffuse;
          uniform float amount;
          uniform float angle;
          varying vec2 vUv;

          void main() {
            vec2 offset = amount * vec2(cos(angle), sin(angle));
            vec4 cr = texture2D(tDiffuse, vUv + offset);
            vec4 cga = texture2D(tDiffuse, vUv);
            vec4 cb = texture2D(tDiffuse, vUv - offset);
            gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);
          }
        `
      }
      const chromaticPass = new ShaderPass(chromaticAberrationShader)
      composer.addPass(chromaticPass)

      // Custom vignette shader (more control than CSS)
      const vignetteShader = {
        uniforms: {
          tDiffuse: { value: null },
          darkness: { value: 1.2 },
          offset: { value: 0.95 }
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D tDiffuse;
          uniform float darkness;
          uniform float offset;
          varying vec2 vUv;

          void main() {
            vec4 texel = texture2D(tDiffuse, vUv);
            vec2 uv = (vUv - vec2(0.5)) * vec2(offset);
            float vignette = 1.0 - dot(uv, uv);
            vignette = clamp(pow(vignette, darkness), 0.0, 1.0);
            gl_FragColor = vec4(texel.rgb * vignette, texel.a);
          }
        `
      }
      const vignettePass = new ShaderPass(vignetteShader)
      composer.addPass(vignettePass)

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

        // Create volumetric god rays
        for (let i = 0; i < 12; i++) {
          const rayGeometry = new THREE.PlaneGeometry(0.3, 80)
          const rayMaterial = new THREE.ShaderMaterial({
            uniforms: {
              color: { value: new THREE.Color(0xdaa520) },
              opacity: { value: 0.0 },
              time: { value: 0.0 }
            },
            vertexShader: `
              varying vec2 vUv;
              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `,
            fragmentShader: `
              uniform vec3 color;
              uniform float opacity;
              uniform float time;
              varying vec2 vUv;
              
              void main() {
                float fade = smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
                float pulse = sin(time * 2.0 + vUv.y * 10.0) * 0.5 + 0.5;
                float alpha = fade * opacity * pulse * 0.3;
                gl_FragColor = vec4(color, alpha);
              }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            depthWrite: false
          })
          const ray = new THREE.Mesh(rayGeometry, rayMaterial)
          ray.position.z = -20
          ray.rotation.z = (i / 12) * Math.PI * 2
          godRays.push(ray)
          scene.add(ray)
        }

        // Create floating light orbs for ambient magic
        for (let i = 0; i < 25; i++) {
          const orbGeometry = new THREE.SphereGeometry(0.3, 16, 16)
          const orbMaterial = new THREE.MeshBasicMaterial({
            color: Math.random() > 0.5 ? 0xdaa520 : 0x4a90e2,
            transparent: true,
            opacity: 0
          })
          const orb = new THREE.Mesh(orbGeometry, orbMaterial)
          orb.position.set(
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 50
          )
          orb.userData = {
            baseY: orb.position.y,
            speed: Math.random() * 0.5 + 0.3,
            offset: Math.random() * Math.PI * 2
          }
          lightOrbs.push(orb)
          scene.add(orb)
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
        composer.setSize(window.innerWidth, window.innerHeight)
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
            
            // Animate god rays during neural network
            godRays.forEach((ray, i) => {
              const rayMat = ray.material as THREE.ShaderMaterial
              rayMat.uniforms.opacity.value = Math.min(0.8, (elapsed - 14) / 2)
              rayMat.uniforms.time.value = elapsed
              ray.rotation.z += 0.001
            })
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
            
            // Fade out god rays
            godRays.forEach(ray => {
              const rayMat = ray.material as THREE.ShaderMaterial
              rayMat.uniforms.opacity.value = Math.max(0, 1 - (elapsed - 19) / 2)
            })
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

        // Animate floating light orbs throughout
        lightOrbs.forEach((orb, i) => {
          const orbMat = orb.material as THREE.MeshBasicMaterial
          const data = orb.userData
          
          // Floating motion with noise
          const noiseValue = noise2D(i * 0.1, elapsed * 0.3)
          orb.position.y = data.baseY + Math.sin(elapsed * data.speed + data.offset) * 3 + noiseValue * 2
          orb.position.x += Math.sin(elapsed * 0.2 + i) * 0.02
          
          // Fade based on phase
          if (phase === "neural-network" || phase === "avatar-reveal") {
            orbMat.opacity = Math.min(0.6, (elapsed - 13) / 3)
          } else {
            orbMat.opacity = Math.max(0, orbMat.opacity - 0.01)
          }
          
          // Gentle rotation
          orb.rotation.x += 0.01
          orb.rotation.y += 0.01
        })

        // Dynamic bloom adjustment based on phase
        if (phase === "big-bang") {
          bloomPass.strength = 3.0
          bloomPass.threshold = 0.3
        } else if (phase === "neural-network") {
          bloomPass.strength = 2.0
          bloomPass.threshold = 0.4
        } else if (phase === "matrix-code") {
          bloomPass.strength = 1.8
          bloomPass.threshold = 0.5
        } else if (phase === "avatar-reveal") {
          bloomPass.strength = 2.5
          bloomPass.threshold = 0.3
        } else {
          bloomPass.strength = 1.5
          bloomPass.threshold = 0.5
        }

        composer.render()
      }

      animate()

      return () => {
        window.removeEventListener("resize", handleResize)
        cancelAnimationFrame(animationId)
        controls.dispose()
        composer.dispose()
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
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      {/* Interactive cursor trail */}
      {cursorTrail.map((point, i) => (
        <div
          key={point.id}
          className="fixed pointer-events-none rounded-full"
          style={{
            left: point.x,
            top: point.y,
            width: '8px',
            height: '8px',
            background: `radial-gradient(circle, rgba(218, 165, 32, ${0.6 - i * 0.04}), transparent)`,
            transform: 'translate(-50%, -50%)',
            zIndex: 5
          }}
        />
      ))}

      {/* Custom cursor */}
      <div
        className="fixed pointer-events-none z-50 mix-blend-screen"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="relative">
          <div className="absolute inset-0 w-8 h-8 border border-gold/50 rounded-full animate-ping-slow"></div>
          <div className="w-2 h-2 bg-gold rounded-full"></div>
        </div>
      </div>

      {/* Holographic scan lines */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-10" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(218, 165, 32, 0.1) 2px, rgba(218, 165, 32, 0.1) 4px)'
      }}></div>

      {/* Corner UI elements */}
      <div className="absolute top-6 left-6 z-30 pointer-events-none">
        <div className="flex items-center gap-2 text-xs text-gold/40 font-mono">
          <div className="w-2 h-2 rounded-full bg-gold animate-pulse"></div>
          <span>SYSTEM ONLINE</span>
        </div>
      </div>
      <div className="absolute top-6 right-6 z-30 pointer-events-none">
        <div className="text-xs text-gold/40 font-mono text-right">
          <div>CROWE LOGIC v2.0</div>
          <div className="text-[10px] text-gold/20">NEURAL INTERFACE</div>
        </div>
      </div>

      {/* Professional vignette overlay */}
      <div className="absolute inset-0 pointer-events-none z-10" style={{
        background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.7) 100%)'
      }}></div>
      
      {/* Subtle grain texture */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'
      }}></div>

      <div ref={containerRef} className="w-full h-full" />

      {/* Phase overlays */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-20">
        {isLoading ? (
          <div className="text-white text-xl">Initializing...</div>
        ) : (
          <>
            {/* Phase 1: Age of Possibilities */}
            {phase === "age-of-possibilities" && (
              <div className="text-center space-y-8 px-4 animate-fade-in">
                <div className="space-y-6 max-w-5xl mx-auto">
                  <div className="inline-block">
                    <p className="text-sm md:text-base text-white/40 font-light tracking-[0.3em] uppercase mb-6">
                      Michael Crowe presents
                    </p>
                  </div>
                  <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white leading-none tracking-tight">
                    The Age of
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-200 to-gold mt-2 text-glow-pulse">
                      Possibilities
                    </span>
                  </h1>
                  <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-gold to-transparent opacity-60 my-8"></div>
                  <p className="text-xl md:text-3xl text-white/70 font-light leading-relaxed max-w-3xl mx-auto">
                    Where <span className="text-white font-normal">innovation</span> meets{" "}
                    <span className="text-gold font-normal">transformation</span>
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
              <div className="text-center space-y-8 px-4 animate-fade-in">
                <div className="space-y-6 max-w-4xl mx-auto">
                  <div className="inline-flex items-center gap-3 text-sm text-white/30 font-mono tracking-wider mb-4">
                    <span className="w-8 h-px bg-white/30"></span>
                    <span>10,088 STARS RENDERED</span>
                    <span className="w-8 h-px bg-white/30"></span>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight">
                    Every Data Point
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-200 to-gold mt-3">
                      Tells a Story
                    </span>
                  </h2>
                  <div className="h-px w-48 mx-auto bg-gradient-to-r from-transparent via-gold/50 to-transparent my-6"></div>
                  <p className="text-2xl md:text-3xl text-white/60 font-light leading-relaxed max-w-3xl mx-auto">
                    From patterns in the cosmos to insights in your business
                  </p>
                  <p className="text-xl md:text-2xl text-white/90 font-normal max-w-2xl mx-auto mt-4">
                    I transform complexity into clarity
                  </p>
                </div>
                <div className="flex items-center justify-center gap-4 text-xs md:text-sm text-white/40 font-mono mt-12">
                  <span>DRAG TO EXPLORE</span>
                  <span className="w-1 h-1 rounded-full bg-white/40"></span>
                  <span>SCROLL TO ZOOM</span>
                </div>
              </div>
            )}

            {/* Phase 4: Neural Network - AI SHOWCASE */}
            {phase === "neural-network" && (
              <div className="text-center space-y-10 px-4 animate-fade-in-fast">
                <div className="space-y-8 max-w-5xl mx-auto">
                  <div className="inline-flex items-center gap-4 px-6 py-3 border border-gold/20 rounded-full backdrop-blur-sm bg-black/20">
                    <div className="w-2 h-2 rounded-full bg-gold animate-pulse"></div>
                    <span className="text-xs md:text-sm text-gold/80 font-mono tracking-widest uppercase">Artificial Intelligence</span>
                    <div className="w-2 h-2 rounded-full bg-gold animate-pulse"></div>
                  </div>
                  <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-none tracking-tight">
                    Neural Networks
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-gold to-green-400 mt-4 text-shimmer">
                      In Motion
                    </span>
                  </h2>
                  <div className="h-px w-64 mx-auto bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
                  <p className="text-xl md:text-3xl text-white/60 font-light leading-relaxed max-w-3xl mx-auto">
                    Watch AI <span className="text-white">learn</span>, <span className="text-white">adapt</span>, and <span className="text-white">evolve</span>
                  </p>
                  <p className="text-lg md:text-xl text-white/80 font-normal max-w-2xl mx-auto">
                    Building intelligence layer by layer
                  </p>
                </div>
                <div className="flex items-center justify-center gap-12 mt-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full"></div>
                      <div className="relative w-4 h-4 rounded-full bg-blue-400 animate-pulse"></div>
                    </div>
                    <span className="text-xs text-white/40 font-mono uppercase tracking-wider">Input Layer</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full"></div>
                      <div className="relative w-4 h-4 rounded-full bg-gold animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-white/40 font-mono uppercase tracking-wider">Hidden Layer</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-400/20 blur-xl rounded-full"></div>
                      <div className="relative w-4 h-4 rounded-full bg-green-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span className="text-xs text-white/40 font-mono uppercase tracking-wider">Output Layer</span>
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
              <div className="text-center space-y-12 px-4">
                <div className="relative w-96 h-96 mx-auto flex items-center justify-center">
                  {/* Enhanced multi-layer glow effects */}
                  <div className="absolute inset-0 -m-32 rounded-full bg-gold/20 blur-[160px] animate-pulse-slow"></div>
                  <div className="absolute inset-0 -m-20 rounded-full bg-gold/30 blur-[100px]"></div>
                  <div className="absolute inset-0 -m-12 rounded-full bg-gold/40 blur-[60px]"></div>
                  
                  {/* Animated hexagonal rings */}
                  <div className="absolute inset-0 rounded-full border-2 border-gold/40 animate-ping-slow"></div>
                  <div className="absolute inset-8 rounded-full border border-gold/30 animate-ping-slow" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute inset-16 rounded-full border border-gold/20 animate-ping-slow" style={{ animationDelay: '1s' }}></div>
                  
                  {/* Corner accents */}
                  <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-gold/50"></div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-gold/50"></div>
                  <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-gold/50"></div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-gold/50"></div>
                  
                  {/* Logo with METEOR entrance - TRANSPARENT VERSION */}
                  <div className="relative z-10 animate-meteor-entry" style={{ filter: 'drop-shadow(0 0 100px rgba(218, 165, 32, 1)) drop-shadow(0 0 50px rgba(218, 165, 32, 0.9))' }}>
                    <Image
                      src="/crowe-logic-logo-transparent.png"
                      alt="Crowe Logic"
                      width={384}
                      height={384}
                      className="w-full h-full object-contain"
                      priority
                    />
                  </div>
                  
                  {/* Enhanced meteor trail */}
                  <div className="absolute top-0 right-0 w-full h-full pointer-events-none animate-meteor-trail">
                    <div className="absolute top-0 right-0 w-[300%] h-2 bg-gradient-to-l from-transparent via-gold to-transparent blur-md"></div>
                    <div className="absolute top-4 right-4 w-[250%] h-1 bg-gradient-to-l from-transparent via-yellow-400/60 to-transparent blur-sm"></div>
                  </div>
                </div>
                
                <div className="space-y-6 animate-reveal-up animation-delay-1000 max-w-3xl mx-auto">
                  <div className="inline-block px-6 py-2 border border-gold/30 rounded-full backdrop-blur-sm bg-black/20">
                    <span className="text-xs md:text-sm text-gold/70 font-mono tracking-widest uppercase">Systems Architect</span>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
                    Michael Crowe
                  </h2>
                  <div className="h-px w-48 mx-auto bg-gradient-to-r from-transparent via-gold/50 to-transparent"></div>
                  <p className="text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-gold to-green-400 font-light">
                    Artificial Intelligence Specialist
                  </p>
                  <div className="flex items-center justify-center gap-3 text-sm text-white/50 mt-6 font-mono">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-400/20 blur-lg rounded-full"></div>
                      <div className="relative w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                    </div>
                    <span className="uppercase tracking-wider">Available Now</span>
                  </div>
                </div>
                
                <div className="animate-pulse font-light animation-delay-1500 mt-12">
                  <p className="text-sm md:text-base text-white/40 font-mono tracking-wide">
                    [ PRESS ENTER TO INITIATE CONVERSATION ]
                  </p>
                </div>
              </div>
            )}

            {/* Phase 7: Brand Message */}
            {phase === "brand-message" && (
              <div className="text-center space-y-12 px-4 max-w-6xl mx-auto animate-fade-in">
                <div className="space-y-8">
                  <div className="inline-flex items-center gap-3 px-4 py-2 border border-gold/20 rounded-full backdrop-blur-sm bg-black/20">
                    <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
                    <span className="text-xs md:text-sm text-gold/70 font-mono tracking-widest uppercase">Revolutionary Interface</span>
                    <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
                  </div>
                  
                  <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-none tracking-tight">
                    The Future of Websites
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-200 to-gold mt-4 text-shimmer">
                      Is Conversation
                    </span>
                  </h2>
                  
                  <div className="h-px w-96 mx-auto bg-gradient-to-r from-transparent via-gold/40 to-transparent"></div>
                  
                  <div className="space-y-6 max-w-4xl mx-auto">
                    <p className="text-2xl md:text-4xl text-white/70 leading-relaxed font-light">
                      No more clicking through pages
                    </p>
                    <p className="text-xl md:text-3xl text-white/90 font-normal leading-relaxed">
                      Just <span className="text-blue-400">talk</span> to Michael's AI.{" "}
                      <span className="text-gold">Ask anything.</span>{" "}
                      <span className="text-green-400">Get answers.</span>{" "}
                      <span className="text-white">Take action.</span>
                    </p>
                  </div>
                </div>
                
                <div className="relative inline-block mt-16">
                  <div className="absolute -inset-4 bg-gold/20 rounded-full blur-2xl animate-pulse-slow"></div>
                  <div className="absolute -inset-2 bg-gold/30 rounded-full blur-xl"></div>
                  <button
                    onClick={onComplete}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onComplete()
                      }
                    }}
                    aria-label="Enter and start conversation"
                    className="relative group px-12 py-6 bg-gradient-to-r from-gold via-yellow-400 to-gold hover:from-yellow-400 hover:via-gold hover:to-yellow-400 text-black font-bold rounded-full transition-all pointer-events-auto transform hover:scale-110 active:scale-95 shadow-2xl shadow-gold/60 focus:outline-none focus:ring-4 focus:ring-gold/50 focus:ring-offset-4 focus:ring-offset-black text-lg md:text-xl tracking-wide"
                  >
                    <span className="flex items-center gap-3">
                      Initiate Conversation
                      <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </button>
                </div>
                
                <p className="text-xs md:text-sm text-white/30 font-mono tracking-wider uppercase mt-8">
                  Press Enter or Click Above
                </p>
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
