"use client"

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface ChatStarsConfig {
  enabled?: boolean
  layerCount?: number
  starsPerLayer?: number
  twinkleSpeed?: number
  parallaxStrength?: number
  reducedMotion?: boolean
}

export function ChatStars({
  enabled = true,
  layerCount = 4,
  starsPerLayer = 400,
  twinkleSpeed = 1.0,
  parallaxStrength = 0.3,
  reducedMotion = false,
}: ChatStarsConfig) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [webglSupported, setWebglSupported] = useState(true)
  const mousePos = useRef({ x: 0, y: 0 })
  const scrollOffset = useRef(0)

  useEffect(() => {
    if (!enabled || !containerRef.current) return

    // Detect WebGL capability
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl' as any)
      if (!gl) {
        setWebglSupported(false)
        return
      }
    } catch {
      setWebglSupported(false)
      return
    }

    // Check for reduced motion preference
    const prefersReducedMotion = reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let scene: THREE.Scene
    let camera: THREE.PerspectiveCamera
    let renderer: THREE.WebGLRenderer
    let starLayers: THREE.Points[] = []
    let animationId: number
    let isVisible = true

    function init() {
      // Scene
      scene = new THREE.Scene()

      // Camera
      camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
      camera.position.z = 50

      // Renderer with performance settings
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false, // Disable for performance
        powerPreference: 'high-performance',
      })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)) // Cap for performance
      renderer.setClearColor(0x000000, 0)
      containerRef.current?.appendChild(renderer.domElement)

      // Create star layers with varying depth
      const layerDepths = [
        { z: -100, size: 0.8, speed: 0.05, density: 0.6 },  // Far
        { z: -50, size: 1.2, speed: 0.15, density: 0.8 },   // Mid-far
        { z: -20, size: 1.8, speed: 0.3, density: 1.0 },    // Mid-near
        { z: 0, size: 2.5, speed: 0.5, density: 1.2 },      // Near
      ]

      for (let layerIdx = 0; layerIdx < Math.min(layerCount, layerDepths.length); layerIdx++) {
        const layer = layerDepths[layerIdx]
        const starCount = Math.floor(starsPerLayer * layer.density)
        
        const geometry = new THREE.BufferGeometry()
        const positions: number[] = []
        const colors: number[] = []
        const sizes: number[] = []
        const seeds: number[] = []

        // Generate stars for this layer
        for (let i = 0; i < starCount; i++) {
          // Position spread across viewport
          const x = (Math.random() - 0.5) * 200
          const y = (Math.random() - 0.5) * 150
          const z = layer.z + (Math.random() - 0.5) * 20

          positions.push(x, y, z)

          // Color variation (subtle blues, whites, golds)
          const colorChoice = Math.random()
          if (colorChoice < 0.7) {
            // White-ish stars
            const brightness = 0.8 + Math.random() * 0.2
            colors.push(brightness, brightness, brightness)
          } else if (colorChoice < 0.9) {
            // Blue-ish stars
            colors.push(0.7, 0.8, 1.0)
          } else {
            // Gold-ish stars
            colors.push(1.0, 0.9, 0.7)
          }

          // Size with variation
          sizes.push(layer.size * (0.5 + Math.random() * 1.5))

          // Random seed for twinkle phase
          seeds.push(Math.random() * 100)
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))
        geometry.setAttribute('seed', new THREE.Float32BufferAttribute(seeds, 1))

        // Shader material with twinkle
        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            twinkleSpeed: { value: prefersReducedMotion ? 0.1 : twinkleSpeed },
            opacity: { value: 0.8 },
          },
          vertexShader: `
            attribute float size;
            attribute float seed;
            attribute vec3 color;
            varying vec3 vColor;
            varying float vSeed;
            
            void main() {
              vColor = color;
              vSeed = seed;
              
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              
              // Size scaling with depth
              float depthScale = 300.0 / -mvPosition.z;
              gl_PointSize = size * depthScale;
              
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            uniform float time;
            uniform float twinkleSpeed;
            uniform float opacity;
            varying vec3 vColor;
            varying float vSeed;
            
            void main() {
              // Circular point sprite
              vec2 center = gl_PointCoord - vec2(0.5);
              float dist = length(center);
              
              if (dist > 0.5) discard;
              
              // Twinkle effect with per-star phase offset
              float twinkle = 0.6 + 0.4 * sin(time * twinkleSpeed + vSeed * 12.566);
              
              // Soft glow
              float glow = 1.0 - smoothstep(0.0, 0.5, dist);
              glow = pow(glow, 1.5);
              
              // Final color with twinkle and glow
              vec3 finalColor = vColor * twinkle;
              float alpha = glow * opacity * twinkle;
              
              gl_FragColor = vec4(finalColor, alpha);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          vertexColors: true,
        })

        const points = new THREE.Points(geometry, material)
        points.userData = { layer: layerIdx, speed: layer.speed }
        starLayers.push(points)
        scene.add(points)
      }

      // Window resize handler
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener('resize', handleResize)

      // Mouse movement for parallax (if not reduced motion)
      let handleMouseMove: ((e: MouseEvent) => void) | null = null
      if (!prefersReducedMotion) {
        handleMouseMove = (e: MouseEvent) => {
          mousePos.current = {
            x: (e.clientX / window.innerWidth - 0.5) * 2,
            y: (e.clientY / window.innerHeight - 0.5) * 2,
          }
        }
        window.addEventListener('mousemove', handleMouseMove)
      }

      // Scroll tracking
      const handleScroll = () => {
        scrollOffset.current = window.scrollY
      }
      window.addEventListener('scroll', handleScroll, { passive: true })

      // Visibility change to pause when hidden
      const handleVisibilityChange = () => {
        isVisible = !document.hidden
      }
      document.addEventListener('visibilitychange', handleVisibilityChange)

      // Animation loop
      const startTime = Date.now()
      function animate() {
        if (!isVisible) {
          animationId = requestAnimationFrame(animate)
          return
        }

        const elapsed = (Date.now() - startTime) / 1000

        // Update each layer
        starLayers.forEach((layer, idx) => {
          const material = layer.material as THREE.ShaderMaterial
          material.uniforms.time.value = elapsed

          // Parallax effect based on mouse and scroll (if not reduced motion)
          if (!prefersReducedMotion && parallaxStrength > 0) {
            const speed = layer.userData.speed as number
            const parallaxX = mousePos.current.x * parallaxStrength * speed * 5
            const parallaxY = (mousePos.current.y * parallaxStrength * speed * 5) - (scrollOffset.current * 0.01 * speed)
            
            layer.position.x = parallaxX
            layer.position.y = parallaxY
          }
        })

        renderer.render(scene, camera)
        animationId = requestAnimationFrame(animate)
      }
      animate()

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize)
        if (handleMouseMove) {
          window.removeEventListener('mousemove', handleMouseMove)
        }
        window.removeEventListener('scroll', handleScroll)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        cancelAnimationFrame(animationId)
        
        starLayers.forEach((layer) => {
          layer.geometry.dispose()
          ;(layer.material as THREE.Material).dispose()
        })
        
        renderer.dispose()
        containerRef.current?.removeChild(renderer.domElement)
      }
    }

    const cleanup = init()

    return () => {
      if (cleanup) cleanup()
    }
  }, [enabled, layerCount, starsPerLayer, twinkleSpeed, parallaxStrength, reducedMotion])

  if (!enabled || !webglSupported) {
    return null
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
