"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { config } from "@/lib/config"

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

export function StarfieldBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    let scene: THREE.Scene
    let camera: THREE.PerspectiveCamera
    let renderer: THREE.WebGLRenderer
    let stars: THREE.Points
    let animationId: number

    async function init() {
      // Scene setup
      scene = new THREE.Scene()
      scene.background = null // Transparent background

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

      // Load star data
      try {
        const response = await fetch(config.site.starDataUrl)
        const data: StarCatalog = await response.json()

        // Create star field with all 10,088 stars
        const geometry = new THREE.BufferGeometry()
        const positions: number[] = []
        const colors: number[] = []
        const sizes: number[] = []

        data.stars.forEach((star) => {
          // Position stars in their actual locations
          positions.push(star.x * 3, star.y * 3, star.z * 3)

          // Star color
          const color = new THREE.Color(star.color)
          colors.push(color.r, color.g, color.b)

          // Size based on magnitude (brighter = larger)
          const size = Math.max(0.5, (6 - star.magnitude) * 0.5)
          sizes.push(size)
        })

        geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
        geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))
        geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1))

        // Star material
        const material = new THREE.PointsMaterial({
          size: 1.5,
          vertexColors: true,
          transparent: true,
          opacity: 0.8,
          sizeAttenuation: true,
          blending: THREE.AdditiveBlending,
        })

        stars = new THREE.Points(geometry, material)
        scene.add(stars)

        setIsLoaded(true)

        // Animation loop
        function animate() {
          animationId = requestAnimationFrame(animate)

          // Gentle rotation
          if (stars) {
            stars.rotation.y += 0.0002
            stars.rotation.x += 0.0001
          }

          renderer.render(scene, camera)
        }

        animate()
      } catch (error) {
        // TODO: Add proper error tracking service integration
        console.error("Failed to load star data:", error)
      }
    }

    init()

    // Handle window resize
    function handleResize() {
      if (!camera || !renderer) return
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationId) cancelAnimationFrame(animationId)
      if (renderer) {
        containerRef.current?.removeChild(renderer.domElement)
        renderer.dispose()
      }
      if (stars) {
        stars.geometry.dispose()
        ;(stars.material as THREE.Material).dispose()
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: isLoaded ? 0.6 : 0 }}
    />
  )
}
