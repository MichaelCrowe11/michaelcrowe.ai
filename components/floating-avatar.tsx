"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useLoader } from "@react-three/fiber"
import { Float, OrbitControls } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

function AvatarMesh({ onClick }: { onClick?: () => void }) {
  const ref = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  
  // Load the Crowe Logic logo as texture
  const texture = useLoader(
    THREE.TextureLoader,
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/crowe-logic-logo-87FZNrbBWYjPIm7AaAVgQ2TQIx435b.png"
  )

  useFrame((state, delta) => {
    if (ref.current) {
      // slow idle rotation
      ref.current.rotation.y += delta * 0.2
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05
    }

    // Pulse the glow
    if (glowRef.current) {
      const scale = 1.15 + Math.sin(state.clock.elapsedTime * 1.5) * 0.08
      glowRef.current.scale.set(scale, scale, scale)
      const material = glowRef.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 1.5) * 0.15
    }
  })

  return (
    <group>
      {/* Outer glow sphere */}
      <mesh ref={glowRef} onClick={onClick}>
        <sphereGeometry args={[1.35, 32, 32]} />
        <meshBasicMaterial
          color="#daa520"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Main avatar sphere with logo texture */}
      <mesh ref={ref} onClick={onClick} castShadow receiveShadow>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          metalness={0.3}
          roughness={0.4}
          emissive="#daa520"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Rim light effect */}
      <mesh position={[0, 0, 0]} onClick={onClick}>
        <sphereGeometry args={[1.22, 64, 64]} />
        <meshBasicMaterial
          color="#daa520"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}

function Particles() {
  const count = 50
  const particlesRef = useRef<THREE.Points>(null)
  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const radius = 2.5 + Math.random() * 1.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = radius * Math.cos(phi)
    }
    return pos
  })

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#daa520"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export function FloatingAvatar({ size = 320 }: { size?: number }) {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }} style={{ width: size, height: size }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, 3, -5]} intensity={0.5} color="#daa520" />
        <Float floatIntensity={0.8} rotationIntensity={0.4} speed={1}>
          <AvatarMesh onClick={() => window.dispatchEvent(new CustomEvent('open-chat'))} />
        </Float>
        <Particles />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>

      {/* HTML overlay CTA */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full flex justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-chat'))}
            className="px-5 py-2 rounded-full bg-gold text-black font-semibold shadow-lg"
            aria-label="Talk to Michael"
          >
            Talk to Michael
          </button>
        </div>
      </div>
    </div>
  )
}
