"use client"

import { useEffect, useState } from 'react'

export function SocialProofFooter() {
  const [currentProof, setCurrentProof] = useState(0)
  
  const proofPoints = [
    { icon: "REVENUE", text: "$470K/year proven results", color: "text-green-400" },
    { icon: "AGENTS", text: "150+ AI agents deployed", color: "text-blue-400" },
    { icon: "REACH", text: "300K+ social following", color: "text-gold" },
    { icon: "PHARMA", text: "Pharmaceutical AI systems", color: "text-purple-400" },
    { icon: "EXPERT", text: "18+ years mycology expertise", color: "text-emerald-400" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProof((prev) => (prev + 1) % proofPoints.length)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden h-10 flex items-center justify-center">
      {proofPoints.map((proof, index) => (
        <div
          key={index}
          className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
            index === currentProof
              ? 'opacity-100 translate-y-0'
              : index === (currentProof + proofPoints.length - 1) % proofPoints.length
              ? 'opacity-0 -translate-y-full'
              : 'opacity-0 translate-y-full'
          }`}
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="text-2xl font-bold mr-3 text-gold">
              {proof.icon}
            </span>
            <span className={`${proof.color} brightness-125`}>{proof.text}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
