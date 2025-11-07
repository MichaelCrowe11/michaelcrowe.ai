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
import { logEvent, logError } from "@/lib/observability"

// Feature flag to de-emphasize/remove Neural Network and Matrix phases (can be controlled via env)
const ENABLE_NEURAL_MATRIX = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_ENABLE_NEURAL_MATRIX === 'true'

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

type IntroPhase = "age-of-possibilities" | "big-bang" | "cosmos-expand" | "neural-network" | "matrix-code" | "solar-system" | "avatar-reveal" | "brand-message" | "complete"

export function CosmosIntro({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [webglSupported, setWebglSupported] = useState(true)
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

    // Detect WebGL capability and gracefully skip intro if unsupported
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl' as any)
      if (!gl) {
        setWebglSupported(false)
        setIsLoading(false)
        logEvent('intro-webgl-unsupported')
        setTimeout(() => onComplete(), 300)
        return
      }
    } catch {
      setWebglSupported(false)
      setIsLoading(false)
      logEvent('intro-webgl-unsupported')
      setTimeout(() => onComplete(), 300)
      return
    }

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
    let asteroids: THREE.Mesh[] = []
    let meteors: THREE.Group[] = []
    let dustClouds: THREE.Points[] = []
    let shockwave: THREE.Mesh | null = null
    // Planetary formation system
    let planetSystem: THREE.Group | null = null
    let accretionDisk: THREE.Mesh | null = null
    let planetsMesh: THREE.InstancedMesh | null = null
    
    // Solar system phase containers
    let starSystem: THREE.Group | null = null
    let solarPlanets: THREE.Mesh[] = []
    let orbitLines: THREE.LineLoop[] = []
    let animationId: number
    let startTime = Date.now()
    let vignette: HTMLDivElement | null = null
    const noise2D = createNoise2D()

    async function init() {
      logEvent('intro-init')
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
            varying float vSpeed;
            uniform float time;
            uniform float opacity;

            void main() {
              vColor = color;
              vSpeed = length(velocity);
              vec3 pos = position + velocity * time;
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              float lifeFade = 1.0 - smoothstep(0.0, 1.0, time * 0.8);
              gl_PointSize = size * (300.0 / -mvPosition.z) * opacity * (lifeFade + 0.2);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            varying float vSpeed;
            uniform float opacity;

            void main() {
              vec2 center = gl_PointCoord - vec2(0.5);
              float dist = length(center);
              if (dist > 0.5) discard;

              // Blackbody-inspired gradient based on particle speed
              float s = clamp(vSpeed / 80.0, 0.0, 1.0);
              vec3 hot = vec3(1.0, 1.0, 1.0);
              vec3 warm = vec3(1.0, 0.84, 0.2);
              vec3 orange = vec3(1.0, 0.5, 0.0);
              vec3 red = vec3(1.0, 0.2, 0.2);
              vec3 c1 = mix(hot, warm, s);
              vec3 c2 = mix(orange, red, s);
              vec3 bb = mix(c1, c2, s);

              float glow = pow(1.0 - smoothstep(0.0, 0.5, dist), 2.0);
              gl_FragColor = vec4(bb * glow, glow * opacity);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })

        particles = new THREE.Points(particleGeometry, particleMaterial)
        scene.add(particles)

        // Create explosive shockwave
        const shockwaveGeometry = new THREE.SphereGeometry(1, 64, 64)
        const shockwaveMaterial = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            opacity: { value: 0 },
            thickness: { value: 0.25 }
          },
          vertexShader: `
            varying vec3 vNormal;
            varying vec3 vPosition;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              vPosition = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform float time;
            uniform float opacity;
            uniform float thickness;
            varying vec3 vNormal;
            varying vec3 vPosition;

            void main() {
              // Strong rim via fresnel
              float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);

              // Ring thickness falloff from surface center (vPosition normalized on unit sphere)
              float r = length(normalize(vPosition));
              float ring = smoothstep(1.0, 1.0 - thickness, r) * (1.0 - smoothstep(1.0 - thickness, 1.0 - thickness * 0.5, r));

              vec3 color = mix(vec3(1.0, 0.45, 0.1), vec3(1.0, 0.95, 0.5), fresnel);
              float pulse = 0.7 + 0.3 * sin(time * 8.0);
              float alpha = fresnel * ring * opacity * pulse;
              gl_FragColor = vec4(color, alpha);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          side: THREE.BackSide,
          depthWrite: false
        })
        shockwave = new THREE.Mesh(shockwaveGeometry, shockwaveMaterial)
        scene.add(shockwave)

        // Create 3D asteroids/rocks
        const asteroidCount = 50
        for (let i = 0; i < asteroidCount; i++) {
          // Random jagged rock shape
          const asteroidGeometry = new THREE.DodecahedronGeometry(
            Math.random() * 2 + 0.5,
            Math.floor(Math.random() * 2)
          )
          
          // Deform vertices for irregular shape
          const positions = asteroidGeometry.attributes.position
          for (let j = 0; j < positions.count; j++) {
            const x = positions.getX(j)
            const y = positions.getY(j)
            const z = positions.getZ(j)
            const noise = Math.random() * 0.4
            positions.setXYZ(j, x * (1 + noise), y * (1 + noise), z * (1 + noise))
          }
          positions.needsUpdate = true
          asteroidGeometry.computeVertexNormals()

          const asteroidMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color().setHSL(0.05 + Math.random() * 0.1, 0.6, 0.3),
            roughness: 0.9,
            metalness: 0.2,
            emissive: new THREE.Color(0x331100),
            emissiveIntensity: 0.3
          })

          const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial)
          asteroid.position.set(0, 0, 0) // Start at center
          
          // Random explosion velocity
          const theta = Math.random() * Math.PI * 2
          const phi = Math.random() * Math.PI
          const speed = Math.random() * 40 + 20
          asteroid.userData = {
            velocity: new THREE.Vector3(
              Math.sin(phi) * Math.cos(theta) * speed,
              Math.sin(phi) * Math.sin(theta) * speed,
              Math.cos(phi) * speed
            ),
            rotationSpeed: new THREE.Vector3(
              (Math.random() - 0.5) * 0.1,
              (Math.random() - 0.5) * 0.1,
              (Math.random() - 0.5) * 0.1
            )
          }
          
          asteroids.push(asteroid)
          scene.add(asteroid)
        }

        // Create dust clouds with particles
        const dustCloudCount = 8
        for (let c = 0; c < dustCloudCount; c++) {
          const dustParticleCount = 2000
          const dustGeometry = new THREE.BufferGeometry()
          const dustPositions: number[] = []
          const dustColors: number[] = []
          const dustSizes: number[] = []

          for (let i = 0; i < dustParticleCount; i++) {
            dustPositions.push(0, 0, 0)
            
            // Brownish dust colors
            const brightness = 0.3 + Math.random() * 0.3
            dustColors.push(brightness * 0.8, brightness * 0.6, brightness * 0.4)
            dustSizes.push(Math.random() * 2 + 0.5)
          }

          dustGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dustPositions, 3))
          dustGeometry.setAttribute('color', new THREE.Float32BufferAttribute(dustColors, 3))
          dustGeometry.setAttribute('size', new THREE.Float32BufferAttribute(dustSizes, 1))

          const dustMaterial = new THREE.ShaderMaterial({
            uniforms: {
              time: { value: 0 },
              opacity: { value: 0 },
              cloudIndex: { value: c }
            },
            vertexShader: `
              attribute float size;
              attribute vec3 color;
              varying vec3 vColor;
              uniform float time;
              uniform float opacity;
              uniform float cloudIndex;

              void main() {
                vColor = color;
                
                // Expand outward in a specific direction per cloud
                float angle = cloudIndex * 0.785; // 45 degrees apart
                vec3 direction = vec3(cos(angle), sin(angle), sin(angle * 0.5));
                vec3 pos = position + direction * time * 30.0;
                
                // Add turbulence
                pos += vec3(
                  sin(time * 2.0 + cloudIndex) * 5.0,
                  cos(time * 1.5 + cloudIndex) * 5.0,
                  sin(time * 1.8 + cloudIndex) * 5.0
                );

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

                float soft = pow(1.0 - smoothstep(0.0, 0.5, dist), 1.5);
                float alpha = soft * opacity * 0.4;
                gl_FragColor = vec4(vColor, alpha);
              }
            `,
            transparent: true,
            blending: THREE.NormalBlending,
            depthWrite: false
          })

          const dustCloud = new THREE.Points(dustGeometry, dustMaterial)
          dustClouds.push(dustCloud)
          scene.add(dustCloud)
        }

        // Create meteors with trails
        const meteorCount = 15
        for (let i = 0; i < meteorCount; i++) {
          const meteorGroup = new THREE.Group()
          
          // Meteor head
          const meteorGeometry = new THREE.SphereGeometry(0.8, 16, 16)
          const meteorMaterial = new THREE.MeshStandardMaterial({
            color: 0xff6600,
            emissive: 0xff3300,
            emissiveIntensity: 2.0,
            roughness: 0.5
          })
          const meteorHead = new THREE.Mesh(meteorGeometry, meteorMaterial)
          meteorGroup.add(meteorHead)

          // Meteor trail
          const trailGeometry = new THREE.ConeGeometry(0.5, 8, 8)
          const trailMaterial = new THREE.ShaderMaterial({
            uniforms: {
              time: { value: 0 }
            },
            vertexShader: `
              varying float vHeight;
              void main() {
                vHeight = position.y / 8.0;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `,
            fragmentShader: `
              uniform float time;
              varying float vHeight;

              void main() {
                float pulse = sin(time * 10.0) * 0.5 + 0.5;
                vec3 color = mix(
                  vec3(1.0, 0.3, 0.0),
                  vec3(1.0, 0.8, 0.0),
                  vHeight
                );
                float alpha = (1.0 - vHeight) * 0.8 * pulse;
                gl_FragColor = vec4(color, alpha);
              }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
          })
          const trail = new THREE.Mesh(trailGeometry, trailMaterial)
          trail.rotation.x = Math.PI / 2
          trail.position.z = -4
          meteorGroup.add(trail)

          // Random direction and speed
          const theta = Math.random() * Math.PI * 2
          const phi = Math.random() * Math.PI
          const speed = Math.random() * 60 + 40
          meteorGroup.userData = {
            velocity: new THREE.Vector3(
              Math.sin(phi) * Math.cos(theta) * speed,
              Math.sin(phi) * Math.sin(theta) * speed,
              Math.cos(phi) * speed
            ),
            startTime: Math.random() * 0.5 // Stagger start times
          }

          meteors.push(meteorGroup)
          scene.add(meteorGroup)
        }

        // Add point lights for Big Bang illumination
        const explosionLight = new THREE.PointLight(0xffa500, 0, 200)
        explosionLight.position.set(0, 0, 0)
        scene.add(explosionLight)
        scene.userData.explosionLight = explosionLight

        // Add ambient light for asteroids
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3)
        scene.add(ambientLight)

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

  // Create Neural Network visualization (feature-flagged)
  if (ENABLE_NEURAL_MATRIX) {
  const network = new THREE.Group()
        
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
            network.add(neuron)
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
            network.add(glow)
            
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
                network.add(line)
                connections.push(line)
              }
            }
          }
        })
        
        network.visible = false
        scene.add(network)
  neuralNetwork = network

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

        // Planetary formation: accretion disk and proto-planets (instanced)
  planetSystem = new THREE.Group()
        planetSystem.visible = false
  // Place slightly off-center so it doesn't collide with network center visuals
  planetSystem.position.set(-14, -3, -5)

        // Accretion disk (ring with radial alpha gradient)
        const ringGeo = new THREE.RingGeometry(6, 20, 128, 1)
        const ringMat = new THREE.ShaderMaterial({
          uniforms: {
            opacity: { value: 0.0 },
            colorInner: { value: new THREE.Color(0x996633) },
            colorOuter: { value: new THREE.Color(0x221100) },
          },
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform float opacity;
            uniform vec3 colorInner;
            uniform vec3 colorOuter;
            varying vec2 vUv;
            void main() {
              float r = vUv.x; // ring UV uses x radial coordinate
              float edge = smoothstep(0.0, 0.1, r) * (1.0 - smoothstep(0.9, 1.0, r));
              vec3 col = mix(colorOuter, colorInner, r);
              gl_FragColor = vec4(col, edge * 0.6 * opacity);
            }
          `,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        })
        accretionDisk = new THREE.Mesh(ringGeo, ringMat)
        accretionDisk.rotation.x = -Math.PI / 2
        planetSystem.add(accretionDisk)

        // Instanced proto-planets
        const planetGeo = new THREE.SphereGeometry(0.5, 16, 16)
        const planetMat = new THREE.MeshStandardMaterial({
          color: 0x8899aa,
          metalness: 0.1,
          roughness: 0.8,
          emissive: new THREE.Color(0x111111),
          emissiveIntensity: 0.3,
          transparent: true,
          opacity: 0
        })
        const planetCount = 60
        planetsMesh = new THREE.InstancedMesh(planetGeo, planetMat, planetCount)
        planetsMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
        // Store orbital params on userData
        const radii: number[] = []
        const speeds: number[] = []
        const angles: number[] = []
        const tilts: number[] = []
        for (let i = 0; i < planetCount; i++) {
          const radius = 6 + Math.random() * 18
          const speed = (Math.random() * 0.5 + 0.1) * (20 / radius) // farther = slower
          const angle = Math.random() * Math.PI * 2
          const tilt = (Math.random() - 0.5) * 0.2
          radii.push(radius)
          speeds.push(speed)
          angles.push(angle)
          tilts.push(tilt)

          const m = new THREE.Matrix4()
          const p = new THREE.Vector3(
            Math.cos(angle) * radius,
            Math.sin(tilt) * 0.5,
            Math.sin(angle) * radius
          )
          const s = new THREE.Vector3(1, 1, 1).multiplyScalar(0.6 + Math.random() * 1.5)
          m.compose(p, new THREE.Quaternion(), s)
          planetsMesh.setMatrixAt(i, m)
        }
        planetsMesh.userData = { radii, speeds, angles, tilts }
        planetSystem.add(planetsMesh)

        // Soft key light for planets
        const planetLight = new THREE.PointLight(0xffddaa, 0.0, 100)
        planetLight.position.set(10, 10, 10)
        planetSystem.add(planetLight)

        scene.add(planetSystem)

        // Solar system: star + planets with orbit lines
        starSystem = new THREE.Group()
        starSystem.visible = false

        // Central star
        const starGeo = new THREE.SphereGeometry(2.5, 32, 32)
        const starMat = new THREE.MeshBasicMaterial({ color: 0xffee88 })
        const star = new THREE.Mesh(starGeo, starMat)
        starSystem.add(star)

        // Star glow (additive billboard-ish sphere)
        const starGlowGeo = new THREE.SphereGeometry(4.5, 32, 32)
        const starGlowMat = new THREE.MeshBasicMaterial({ color: 0xffcc66, transparent: true, opacity: 0.0 })
        const starGlow = new THREE.Mesh(starGlowGeo, starGlowMat)
        starSystem.add(starGlow)

        // Orbits + planets (4-5 bodies)
        const planetConfigs = [
          { radius: 7, size: 0.8, color: 0x88aaff, speed: 0.6 },
          { radius: 11, size: 1.2, color: 0xaaff88, speed: 0.4 },
          { radius: 16, size: 1.8, color: 0xffaa66, speed: 0.3, ring: true },
          { radius: 22, size: 1.4, color: 0x66ddff, speed: 0.25 }
        ]

        planetConfigs.forEach((cfg, idx) => {
          // Orbit line
          const orbitShape = new THREE.EllipseCurve(0, 0, cfg.radius, cfg.radius, 0, Math.PI * 2)
          const points = orbitShape.getPoints(128).map(p => new THREE.Vector3(p.x, 0, p.y))
          const orbitGeo = new THREE.BufferGeometry().setFromPoints(points)
          const orbitMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0 })
          const orbit = new THREE.LineLoop(orbitGeo, orbitMat)
          orbit.rotation.x = -Math.PI / 2
          starSystem!.add(orbit)
          orbitLines.push(orbit)

          // Planet mesh
          const pGeo = new THREE.SphereGeometry(cfg.size, 24, 24)
          const pMat = new THREE.MeshStandardMaterial({ color: cfg.color, roughness: 0.7, metalness: 0.1, transparent: true, opacity: 0.0 })
          const planet = new THREE.Mesh(pGeo, pMat)
          planet.userData = { angle: Math.random() * Math.PI * 2, speed: cfg.speed }
          starSystem!.add(planet)
          solarPlanets.push(planet)

          // Optional ring
          if (cfg.ring) {
            const ringG = new THREE.RingGeometry(cfg.size * 1.4, cfg.size * 2.2, 64)
            const ringM = new THREE.MeshBasicMaterial({ color: 0xffddaa, transparent: true, opacity: 0.0, side: THREE.DoubleSide })
            const ring = new THREE.Mesh(ringG, ringM)
            ring.rotation.x = -Math.PI / 2
            planet.add(ring)
          }
        })

        // Lights for solar system
        const sunLight = new THREE.PointLight(0xffeeaa, 0.0, 200)
        starSystem.add(sunLight)

        scene.add(starSystem)

        setIsLoading(false)
        logEvent('intro-loaded')
      } catch (error) {
        logError(error, 'intro-init-failed')
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

            // Animate shockwave
            if (shockwave) {
              const shockwaveMat = shockwave.material as THREE.ShaderMaterial
              shockwaveMat.uniforms.time.value = explosionProgress * 5
              shockwaveMat.uniforms.opacity.value = Math.sin(Math.min(1.0, explosionProgress) * 3.14159) * 0.8
              shockwaveMat.uniforms.thickness.value = THREE.MathUtils.lerp(0.35, 0.15, explosionProgress)
              shockwave.scale.setScalar(1 + explosionProgress * 40)
            }

            // Animate asteroids
            asteroids.forEach(asteroid => {
              const vel = asteroid.userData.velocity as THREE.Vector3
              asteroid.position.add(vel.clone().multiplyScalar(0.016 * explosionProgress))
              
              // Apply rotation
              const rotSpeed = asteroid.userData.rotationSpeed as THREE.Vector3
              asteroid.rotation.x += rotSpeed.x
              asteroid.rotation.y += rotSpeed.y
              asteroid.rotation.z += rotSpeed.z
              
              // Fade out as they move away
              const dist = asteroid.position.length()
              const mat = asteroid.material as THREE.MeshStandardMaterial
              mat.opacity = Math.max(0, 1 - dist / 50)
              mat.transparent = true
            })

            // Animate dust clouds
            dustClouds.forEach(dustCloud => {
              const dustMat = dustCloud.material as THREE.ShaderMaterial
              dustMat.uniforms.time.value = explosionProgress
              dustMat.uniforms.opacity.value = Math.min(1, explosionProgress * 2) * 
                                                (1 - Math.pow(explosionProgress, 1.5))
            })

            // Animate meteors
            meteors.forEach(meteor => {
              const startTime = meteor.userData.startTime as number
              const effectiveProgress = Math.max(0, explosionProgress - startTime)
              
              if (effectiveProgress > 0) {
                const vel = meteor.userData.velocity as THREE.Vector3
                meteor.position.copy(vel.clone().multiplyScalar(effectiveProgress * 0.03))
                
                // Point meteor in direction of travel
                meteor.lookAt(meteor.position.clone().add(vel))
                
                // Update trail animation
                const trailObj = meteor.children[1]
                if (trailObj && trailObj instanceof THREE.Mesh) {
                  const trailMat = trailObj.material as THREE.ShaderMaterial
                  trailMat.uniforms.time.value = elapsed
                }
                
                // Fade based on distance
                const dist = meteor.position.length()
                meteor.children.forEach(child => {
                  if (child instanceof THREE.Mesh) {
                    const mat = child.material as THREE.Material
                    mat.opacity = Math.max(0, 1 - dist / 60)
                    mat.transparent = true
                  } else if (child instanceof THREE.Line) {
                    const mat = child.material as THREE.Material
                    mat.opacity = Math.max(0, 1 - dist / 60)
                    mat.transparent = true
                  } else if (child instanceof THREE.Points) {
                    const mat = child.material as THREE.Material
                    mat.opacity = Math.max(0, 1 - dist / 60)
                    mat.transparent = true
                  }
                })
              }
            })

            // Explosion light
            if (scene.userData.explosionLight) {
              const light = scene.userData.explosionLight as THREE.PointLight
              light.intensity = Math.sin(Math.min(1.0, explosionProgress) * Math.PI) * 35
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

            // Fade out Big Bang effects
            if (shockwave) {
              const shockwaveMat = shockwave.material as THREE.ShaderMaterial
              shockwaveMat.uniforms.opacity.value = Math.max(0, 1 - (elapsed - 8) / 1.5)
            }

            asteroids.forEach(asteroid => {
              const mat = asteroid.material as THREE.MeshStandardMaterial
              mat.opacity = Math.max(0, 1 - (elapsed - 8) / 2)
            })

            dustClouds.forEach(dustCloud => {
              const dustMat = dustCloud.material as THREE.ShaderMaterial
              dustMat.uniforms.opacity.value = Math.max(0, 1 - (elapsed - 8) / 2)
            })

            meteors.forEach(meteor => {
              meteor.children.forEach(child => {
                if ((child as any).material) {
                  const mat = (child as any).material
                  mat.opacity = Math.max(0, 1 - (elapsed - 8) / 2)
                }
              })
            })

            if (scene.userData.explosionLight) {
              const light = scene.userData.explosionLight as THREE.PointLight
              light.intensity = Math.max(0, light.intensity - 1)
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

            // Planetary formation emerges near end of cosmos phase
            if (planetSystem && accretionDisk && planetsMesh) {
              const appearProgress = THREE.MathUtils.clamp((elapsed - 11) / 2, 0, 1)
              planetSystem.visible = appearProgress > 0

              // Accretion disk opacity and slow rotation
              const diskMat = accretionDisk.material as THREE.ShaderMaterial
              diskMat.uniforms.opacity.value = Math.min(0.9, appearProgress * 1.1)
              accretionDisk.rotation.z += 0.001

              // Planets opacity and orbits
              const pm = planetsMesh.material as THREE.MeshStandardMaterial
              pm.opacity = Math.min(0.85, appearProgress * 1.1)

              const { radii, speeds, angles, tilts } = planetsMesh.userData as {
                radii: number[]; speeds: number[]; angles: number[]; tilts: number[]
              }
              const m = new THREE.Matrix4()
              for (let i = 0; i < planetsMesh.count; i++) {
                angles[i] += speeds[i] * 0.016 // advance angle per frame
                const r = radii[i]
                const angle = angles[i]
                const tilt = tilts[i]
                const p = new THREE.Vector3(
                  Math.cos(angle) * r,
                  Math.sin(tilt) * 0.5,
                  Math.sin(angle) * r
                )
                const s = new THREE.Vector3(1, 1, 1).multiplyScalar(0.6 + ((i % 5) / 10))
                m.compose(p, new THREE.Quaternion(), s)
                planetsMesh.setMatrixAt(i, m)
              }
              planetsMesh.instanceMatrix.needsUpdate = true
            }
          } else if (elapsed < 19) {
            if (ENABLE_NEURAL_MATRIX) {
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

              // Maintain planet presence through ~20s at a low but visible opacity
              if (planetSystem && accretionDisk && planetsMesh) {
                const presence = THREE.MathUtils.clamp((20 - elapsed) / 7, 0, 1)
                const diskAlpha = Math.min(0.35, presence * 0.5)
                const planetAlpha = Math.min(0.5, presence * 0.7)
                const diskMat = accretionDisk.material as THREE.ShaderMaterial
                const pm = planetsMesh.material as THREE.MeshStandardMaterial
                planetSystem.visible = planetAlpha > 0.02 || diskAlpha > 0.02
                diskMat.uniforms.opacity.value = diskAlpha
                pm.opacity = planetAlpha
              }
              
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
              godRays.forEach((ray) => {
                const rayMat = ray.material as THREE.ShaderMaterial
                rayMat.uniforms.opacity.value = Math.min(0.8, (elapsed - 14) / 2)
                rayMat.uniforms.time.value = elapsed
                ray.rotation.z += 0.001
              })
            } else {
              // De-emphasized path: continue solar focus early (13–19s)
              setPhase("solar-system")
              controls.enabled = false
              // Keep stars bright
              material.uniforms.opacity.value = 0.95
              // Gently reduce nebula to highlight star radiation
              nebulaClouds.forEach(cloud => {
                const cloudMat = cloud.material as THREE.ShaderMaterial
                cloudMat.uniforms.opacity.value = Math.max(0, 0.8 - (elapsed - 13) * 0.1)
                cloudMat.uniforms.time.value = elapsed
              })
              // Maintain planet system presence
              if (planetSystem && accretionDisk && planetsMesh) {
                const presence = THREE.MathUtils.clamp((20 - elapsed) / 7, 0, 1)
                const diskAlpha = Math.min(0.45, presence * 0.6)
                const planetAlpha = Math.min(0.65, presence * 0.8)
                const diskMat = accretionDisk.material as THREE.ShaderMaterial
                const pm = planetsMesh.material as THREE.MeshStandardMaterial
                planetSystem.visible = planetAlpha > 0.02 || diskAlpha > 0.02
                diskMat.uniforms.opacity.value = diskAlpha
                pm.opacity = planetAlpha
              }
              // Begin fading in star system early
              const t = THREE.MathUtils.clamp((elapsed - 13) / 3, 0, 1)
              if (starSystem && orbitLines.length && solarPlanets.length) {
                starSystem.visible = true
                orbitLines.forEach(line => {
                  const lm = line.material as THREE.LineBasicMaterial
                  lm.opacity = t * 0.6
                })
                solarPlanets.forEach(planet => {
                  const pm = planet.material as THREE.MeshStandardMaterial
                  pm.opacity = t
                  const { angle, speed } = planet.userData as { angle: number; speed: number }
                  const newAngle = angle + speed * 0.016
                  planet.userData.angle = newAngle
                  const orbit = orbitLines[solarPlanets.indexOf(planet)]
                  const radius = Math.abs((orbit.geometry.getAttribute('position') as THREE.BufferAttribute).getX(0))
                  planet.position.set(Math.cos(newAngle) * radius, 0, Math.sin(newAngle) * radius)
                  planet.rotation.y += 0.01
                })
                // Radiating god rays
                godRays.forEach(ray => {
                  const rayMat = ray.material as THREE.ShaderMaterial
                  rayMat.uniforms.opacity.value = Math.min(0.85, t)
                  rayMat.uniforms.time.value = elapsed
                  ray.rotation.z += 0.001
                })
              }
              // Camera gentle drift
              camera.position.z = 50
              camera.position.x = Math.sin((elapsed - 13) * 0.25) * 4
              camera.position.y = Math.cos((elapsed - 13) * 0.2) * 3
              camera.lookAt(0, 0, 0)
            }
          } else if (elapsed < 23) {
            if (ENABLE_NEURAL_MATRIX) {
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
            } else {
              // Continue emphasizing solar system (19–23s)
              setPhase("solar-system")
              material.uniforms.opacity.value = 0.9 // keep stars bright
              const t2 = THREE.MathUtils.clamp((elapsed - 19) / 2, 0, 1)
              if (starSystem && orbitLines.length && solarPlanets.length) {
                starSystem.visible = true
                orbitLines.forEach(line => {
                  const lm = line.material as THREE.LineBasicMaterial
                  lm.opacity = Math.max(lm.opacity, 0.6)
                })
                solarPlanets.forEach(planet => {
                  const pm = planet.material as THREE.MeshStandardMaterial
                  pm.opacity = Math.max(pm.opacity, 1.0 * t2)
                  const { angle, speed } = planet.userData as { angle: number; speed: number }
                  const newAngle = angle + speed * 0.016
                  planet.userData.angle = newAngle
                  const orbit = orbitLines[solarPlanets.indexOf(planet)]
                  const radius = Math.abs((orbit.geometry.getAttribute('position') as THREE.BufferAttribute).getX(0))
                  planet.position.set(Math.cos(newAngle) * radius, 0, Math.sin(newAngle) * radius)
                })
                // Strengthen god rays
                godRays.forEach(ray => {
                  const rayMat = ray.material as THREE.ShaderMaterial
                  rayMat.uniforms.opacity.value = Math.max(rayMat.uniforms.opacity.value, 0.8)
                  rayMat.uniforms.time.value = elapsed
                })
              }
              // Camera easing back to center
              camera.position.z = 52
              camera.position.x *= 0.95
              camera.position.y *= 0.95
              camera.lookAt(0, 0, 0)
            }
          } else if (elapsed < 29) {
            // Phase 6: Solar System (23-29s)
            setPhase("solar-system")

            // Fade out matrix, fade in solar system
            const t = THREE.MathUtils.clamp((elapsed - 23) / 2, 0, 1)

            // Dim stars a bit for solar system highlight
            material.uniforms.opacity.value = 0.3 + 0.4 * (1 - t)

            if (starSystem && orbitLines.length && solarPlanets.length) {
              starSystem.visible = true

              // Fade in orbit lines and planets
              orbitLines.forEach(line => {
                const lm = line.material as THREE.LineBasicMaterial
                lm.opacity = t * 0.6
              })
              solarPlanets.forEach(planet => {
                const pm = planet.material as THREE.MeshStandardMaterial
                pm.opacity = t
                // Update orbit
                const { angle, speed } = planet.userData as { angle: number; speed: number }
                const newAngle = angle + speed * 0.016
                planet.userData.angle = newAngle
                const orbit = orbitLines[solarPlanets.indexOf(planet)]
                const radius = (orbit.geometry.getAttribute('position') as THREE.BufferAttribute).getX(0)
                planet.position.set(Math.cos(newAngle) * Math.abs(radius), 0, Math.sin(newAngle) * Math.abs(radius))

                // If has ring child, match opacity
                if (planet.children.length) {
                  planet.children.forEach(c => {
                    if (c instanceof THREE.Mesh) {
                      const cm = c.material as THREE.MeshBasicMaterial
                      cm.opacity = t * 0.7
                    }
                  })
                }
              })

              // Star glow and sun light
              const starGlow = starSystem.children.find(o => o !== starSystem!.children[0] && o instanceof THREE.Mesh) as THREE.Mesh | undefined
              if (starGlow) {
                const sgm = starGlow.material as THREE.MeshBasicMaterial
                sgm.opacity = t * 0.6
              }
              const sunLight = starSystem.children.find(o => o instanceof THREE.PointLight) as THREE.PointLight | undefined
              if (sunLight) sunLight.intensity = t * 1.2
            }

            // Camera subtle orbit around the system
            camera.position.z = 55
            camera.position.x = Math.sin((elapsed - 23) * 0.3) * 6
            camera.position.y = Math.cos((elapsed - 23) * 0.2) * 4
            camera.lookAt(0, 0, 0)

            // Soften god rays
            godRays.forEach(ray => {
              const rayMat = ray.material as THREE.ShaderMaterial
              rayMat.uniforms.opacity.value = Math.max(0, 0.3 * (1 - t))
            })
          } else if (elapsed < 37) {
            // Phase 7: Avatar reveal (29-37s) - Smooth star brightness increase
            setPhase("avatar-reveal")
            const brightnessProgress = Math.min(1, (elapsed - 23) / 2)
            material.uniforms.opacity.value = 0.4 + (brightnessProgress * 0.6) // 0.4 to 1.0
            
            // Camera settle into final position
            camera.position.z = 50
            camera.position.x *= 0.9
            camera.position.y *= 0.9
            camera.lookAt(0, 0, 0)
            // Fade out solar system as we move to avatar
            if (starSystem && orbitLines.length && solarPlanets.length) {
              const fade = THREE.MathUtils.clamp((elapsed - 29) / 2, 0, 1)
              orbitLines.forEach(line => {
                const lm = line.material as THREE.LineBasicMaterial
                lm.opacity = Math.max(0, (1 - fade) * 0.6)
              })
              solarPlanets.forEach(planet => {
                const pm = planet.material as THREE.MeshStandardMaterial
                pm.opacity = Math.max(0, 1 - fade)
                if (planet.children.length) {
                  planet.children.forEach(c => {
                    if (c instanceof THREE.Mesh) {
                      const cm = c.material as THREE.MeshBasicMaterial
                      cm.opacity = Math.max(0, 0.7 * (1 - fade))
                    }
                  })
                }
              })
              const starGlow = starSystem.children.find(o => o !== starSystem!.children[0] && o instanceof THREE.Mesh) as THREE.Mesh | undefined
              if (starGlow) {
                const sgm = starGlow.material as THREE.MeshBasicMaterial
                sgm.opacity = Math.max(0, 0.6 * (1 - fade))
              }
              const sunLight = starSystem.children.find(o => o instanceof THREE.PointLight) as THREE.PointLight | undefined
              if (sunLight) sunLight.intensity = Math.max(0, 1.2 * (1 - fade))
              if (fade === 1) starSystem.visible = false
            }
          } else if (elapsed < 42) {
            // Phase 8: Brand message (37-42s)
            setPhase("brand-message")
            material.uniforms.opacity.value = 1
          } else {
            // Phase 9: Complete - Fade to black
            setPhase("complete")
            const fadeOut = Math.min(1, (elapsed - 42) / 1)
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
        } else if (phase === "cosmos-expand") {
          bloomPass.strength = 1.8
          bloomPass.threshold = 0.45
        } else if (phase === "neural-network") {
          bloomPass.strength = 2.0
          bloomPass.threshold = 0.4
        } else if (phase === "matrix-code") {
          bloomPass.strength = 1.8
          bloomPass.threshold = 0.5
        } else if (phase === "solar-system") {
          bloomPass.strength = 1.6
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

  // Log phase transitions once per change
  useEffect(() => {
    if (phase) {
      logEvent('intro-phase', { phase })
    }
  }, [phase])

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      {!webglSupported && (
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <div className="space-y-6 max-w-lg">
            <h2 className="text-2xl font-bold text-gold">Cosmic Intro Unavailable</h2>
            <p className="text-white/70 text-sm leading-relaxed">
              Your browser or device doesn&apos;t fully support the advanced graphical features required for the interactive cosmic intro.
              You&apos;re being redirected directly to the experience without the opening sequence.
            </p>
            <div className="animate-pulse text-white/40 text-xs font-mono">Initializing fallback...</div>
          </div>
        </div>
      )}
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
                  {/* Planet formation inline cue */}
                  <div className="mt-10 inline-flex items-center gap-3 px-4 py-2 border border-gold/20 rounded-full backdrop-blur-sm bg-black/20">
                    <div className="w-2 h-2 rounded-full bg-gold animate-pulse"></div>
                    <span className="text-xs md:text-sm text-gold/70 font-mono tracking-widest uppercase">Planetary Accretion Begins</span>
                    <div className="w-2 h-2 rounded-full bg-gold animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
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

              {/* Phase 6: Solar System - COSMIC FORMATION SHOWCASE */}
              {phase === "solar-system" && (
                <div className="text-center space-y-8 px-4 animate-fade-in">
                  <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-3 text-sm text-white/30 font-mono tracking-wider mb-2">
                      <span className="w-8 h-px bg-white/30"></span>
                      <span>FORMATION · ORBITS · EMERGENCE</span>
                      <span className="w-8 h-px bg-white/30"></span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight">
                      From Chaos
                      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-200 to-gold mt-2">
                        Order Emerges
                      </span>
                    </h2>
                    <p className="text-xl md:text-2xl text-white/70 font-light leading-relaxed max-w-2xl mx-auto">
                      Accretion. Rotation. Harmony. Worlds take shape.
                    </p>
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
