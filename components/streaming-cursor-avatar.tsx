"use client"

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'

interface StreamingCursorAvatarProps {
  isStreaming: boolean
  streamingText: string
  messageElement?: HTMLElement | null
}

/**
 * Crowe Logic Avatar Following Cursor During Text Streaming
 * - Avatar appears at the cursor position as text streams in
 * - Follows the text cursor perfectly in real-time
 * - Glows and pulses during active streaming
 * - Fades out when streaming completes
 */
export function StreamingCursorAvatar({ 
  isStreaming, 
  streamingText,
  messageElement 
}: StreamingCursorAvatarProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)
  const animationFrameRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!isStreaming || !messageElement) {
      setVisible(false)
      return
    }

    setVisible(true)

    const updatePosition = () => {
      // Find the last text node in the streaming message
      const range = document.createRange()
      const textNodes: Node[] = []
      
      const getTextNodes = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
          textNodes.push(node)
        } else {
          node.childNodes.forEach(getTextNodes)
        }
      }
      
      getTextNodes(messageElement)
      
      if (textNodes.length > 0) {
        const lastTextNode = textNodes[textNodes.length - 1]
        const textContent = lastTextNode.textContent || ''
        
        try {
          range.setStart(lastTextNode, Math.max(0, textContent.length - 1))
          range.setEnd(lastTextNode, textContent.length)
          
          const rect = range.getBoundingClientRect()
          
          // Position avatar at the end of the text (cursor position)
          setPosition({
            x: rect.right + 5, // Slightly offset from cursor
            y: rect.top + (rect.height / 2)
          })
        } catch (e) {
          // Fallback to element position
          const rect = messageElement.getBoundingClientRect()
          setPosition({
            x: rect.right,
            y: rect.top + (rect.height / 2)
          })
        }
      } else {
        // Fallback to element position if no text nodes found
        const rect = messageElement.getBoundingClientRect()
        setPosition({
          x: rect.left,
          y: rect.top + (rect.height / 2)
        })
      }

      animationFrameRef.current = requestAnimationFrame(updatePosition)
    }

    updatePosition()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isStreaming, streamingText, messageElement])

  if (!visible) return null

  return (
    <div
      className="fixed pointer-events-none transition-all duration-100 ease-out z-50"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Code particles swirling around cursor */}
      <div className="absolute inset-0 animate-spin-slow" style={{ width: '60px', height: '60px', marginLeft: '-30px', marginTop: '-30px' }}>
        {['useState', 'torch', 'GPT-4', 'async'].map((code, i) => (
          <div
            key={i}
            className="absolute text-gold text-xs font-mono font-semibold"
            style={{
              left: '50%',
              top: '50%',
              transform: `rotate(${i * 90}deg) translateY(-25px)`,
              textShadow: '0 0 8px rgba(212,175,55,0.8)',
              opacity: 0.6 + Math.sin(Date.now() / 200 + i) * 0.2,
              animation: `pulse-${i} 2s ease-in-out infinite`
            }}
          >
            {code}
          </div>
        ))}
      </div>

      {/* Crowe Logic Avatar */}
      <div 
        className="relative"
        style={{
          filter: 'brightness(1.8) drop-shadow(0 0 20px rgba(212,175,55,0.9))',
          animation: 'pulse-glow 1s ease-in-out infinite'
        }}
      >
        <Image
          src="/crowe-logic-logo-transparent.png"
          alt="Streaming"
          width={35}
          height={35}
          className="object-contain"
          style={{
            animation: 'float 2s ease-in-out infinite'
          }}
        />
      </div>

      {/* Pulsing glow ring */}
      <div 
        className="absolute inset-0"
        style={{
          width: '50px',
          height: '50px',
          marginLeft: '-25px',
          marginTop: '-25px',
          background: 'radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 70%)',
          animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
        }}
      />

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes pulse-glow {
          0%, 100% { filter: brightness(1.6) drop-shadow(0 0 15px rgba(212,175,55,0.8)); }
          50% { filter: brightness(2.0) drop-shadow(0 0 30px rgba(212,175,55,1)); }
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
