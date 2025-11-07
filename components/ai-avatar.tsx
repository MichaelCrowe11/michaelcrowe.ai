"use client"

import React from "react"

interface AIAvatarProps {
  state: "idle" | "thinking" | "streaming" | "completed"
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeClasses: Record<NonNullable<AIAvatarProps["size"]>, string> = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
}

export function AIAvatar({ state, size = "md", className = "" }: AIAvatarProps) {
  const animationClass = {
    idle: "animate-logo-breathe",
    thinking: "animate-logo-pulse",
    streaming: "animate-logo-glow",
    completed: "animate-logo-success",
  }[state]

  return (
    <img
      src="/crowe-logic-logo-transparent.png"
      alt="Crowe Logic AI"
      className={`${sizeClasses[size]} rounded-full ring-2 ring-gold/30 ${animationClass} transition-all duration-300 select-none ${className}`}
      draggable={false}
    />
  )
}

export default AIAvatar
