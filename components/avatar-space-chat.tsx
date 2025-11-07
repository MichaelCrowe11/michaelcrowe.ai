"use client"

import { useState, useEffect, useRef } from "react"
import { Send, Mic, MicOff } from "lucide-react"
import { AIAvatarSwirl } from "@/components/ai-avatar-swirl"
import Image from "next/image"

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  streaming?: boolean
}

export function AvatarSpaceChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'assistant',
      content: "Hello! I'm Michael Crowe's AI assistant. Ask me anything about AI consulting, my portfolio, services, or how I can help transform your business.",
    }
  ])
  const [input, setInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const recognitionRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const idCounterRef = useRef(1)

  // Responsive + dynamic overlay opacity
  const [overlayBaseOpacity, setOverlayBaseOpacity] = useState(0.9)
  const [overlayFade, setOverlayFade] = useState(1)
  const [overlayParallax, setOverlayParallax] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const win = window as any
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition
    if (SpeechRecognition) {
      const r = new SpeechRecognition()
      r.lang = 'en-US'
      r.interimResults = false
      r.maxAlternatives = 1
      r.onresult = (event: any) => {
        const text = event.results[0][0].transcript
        setInput(text)
        handleSend(text)
      }
      r.onend = () => setIsListening(false)
      recognitionRef.current = r
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Set base overlay opacity based on viewport width
  useEffect(() => {
    const computeBase = () => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 1920
      if (w >= 1024) return 0.9 // lg+
      if (w >= 640) return 0.8  // sm–md
      return 0.65               // xs
    }
    const applyBase = () => setOverlayBaseOpacity(computeBase())
    applyBase()
    window.addEventListener('resize', applyBase)
    return () => window.removeEventListener('resize', applyBase)
  }, [])

  // Fade overlay as chat scroll increases (keeps focus on content)
  useEffect(() => {
    let raf: number | null = null
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = null
        const el = messagesContainerRef.current
        if (!el) return
        const t = el.scrollTop
        // fade up to ~60% by 240px scroll; clamp mins by breakpoint
        const w = window.innerWidth
        const minXs = 0.35
        const minSmMd = 0.45
        const minLg = 0.5
        const min = w >= 1024 ? minLg : w >= 640 ? minSmMd : minXs
        const f = Math.max(min, 1 - Math.min(t / 240, 0.6))
        setOverlayFade(f)
      })
    }
    const el = messagesContainerRef.current
    if (el) {
      el.addEventListener('scroll', onScroll)
      // initialize once
      onScroll()
    }
    return () => {
      if (el) el.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // Subtle parallax for overlay based on pointer movement
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const w = window.innerWidth
      const h = window.innerHeight
      const nx = (e.clientX / w) * 2 - 1 // -1..1
      const ny = (e.clientY / h) * 2 - 1 // -1..1
      // Max translate ~10px on lg, ~6px on sm-md, ~4px on xs
      const max = w >= 1024 ? 10 : w >= 640 ? 6 : 4
      setOverlayParallax({ x: nx * max, y: ny * max })
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  type AvatarState = 'idle' | 'thinking' | 'responding'
  const [avatarState, setAvatarState] = useState<AvatarState>('idle')

  const streamText = (text: string, messageId: number) => {
    const words = text.split(' ')
    let currentIndex = 0

    setAvatarState('responding')
    const interval = setInterval(() => {
      if (currentIndex < words.length) {
        const partialText = words.slice(0, currentIndex + 1).join(' ')
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, content: partialText, streaming: true }
              : msg
          )
        )
        currentIndex++
      } else {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, streaming: false }
              : msg
          )
        )
        clearInterval(interval)

        if (voiceEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
          try {
            const utter = new SpeechSynthesisUtterance(text)
            utter.rate = 0.9
            utter.pitch = 1
            window.speechSynthesis.cancel()
            window.speechSynthesis.speak(utter)
          } catch (e) {
            // ignore
          }
        }
        setAvatarState('idle')
      }
    }, 50)
  }

  const handleSend = (textArg?: string) => {
    const textToSend = (typeof textArg === 'string' ? textArg : input || '').trim()
    if (!textToSend) return

    const userMsgId = idCounterRef.current++
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', content: textToSend }])
    setInput('')

    setTimeout(() => {
      const lower = textToSend.toLowerCase()
      let reply = "That's a great question. I specialize in building practical AI solutions for small businesses. What specific challenge are you looking to solve?"

      if (lower.includes('price') || lower.includes('cost') || lower.includes('pricing')) {
        reply = "My pricing is tailored to your needs. I offer three main tiers: Consultation ($2,500-5,000), Custom Development ($10,000-50,000+), and Managed AI Services ($3,000-10,000/month). Let's schedule a discovery call to discuss your specific requirements and I'll provide a detailed proposal."
      } else if (lower.includes('portfolio') || lower.includes('work') || lower.includes('project')) {
        reply = "I've built AI systems across multiple industries: restaurant chatbots that handle 24/7 customer service, pharmaceutical compliance automation, e-commerce recommendation engines, and custom analytics dashboards. Each project focuses on measurable ROI. What industry are you in?"
      } else if (lower.includes('service') || lower.includes('help') || lower.includes('do')) {
        reply = "I offer three core services: AI Strategy & Consulting (audit your business and identify AI opportunities), Custom AI Development (build production-ready systems), and Managed AI Services (ongoing optimization and support). Which area interests you most?"
      } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        reply = "Hey there! Great to meet you. I'm Michael Crowe—I help small businesses implement AI that actually drives results. What brings you here today?"
      } else if (lower.includes('who') || lower.includes('about') || lower.includes('you')) {
        reply = "I'm a self-taught developer who scaled a business from a garage to serving millions. Now I focus on helping small businesses leverage AI without the enterprise complexity. I believe in practical solutions that deliver ROI, not buzzwords. What would you like to know?"
      } else if (lower.includes('contact') || lower.includes('schedule') || lower.includes('call') || lower.includes('meeting')) {
        reply = "I'd love to chat! The best way to get started is to schedule a free 30-minute discovery call. During this call, we'll discuss your business challenges, explore potential AI solutions, and see if we're a good fit. Ready to book a time?"
      }

      const assistantMsgId = idCounterRef.current++
      setMessages(prev => [...prev, { id: assistantMsgId, role: 'assistant', content: '', streaming: true }])
      setAvatarState('thinking')
      streamText(reply, assistantMsgId)
    }, 800)
  }

  const toggleMic = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start()
      setIsListening(true)
    } else if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">


      {/* Avatar Logo - Top half */}
      <div className="absolute top-0 left-0 w-full h-[55vh] flex items-center justify-center">
        {/* Starfield background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="stars-layer-1"></div>
          <div className="stars-layer-2"></div>
          <div className="stars-layer-3"></div>
        </div>

        {/* Subtle Solar System Overlay (responsive + scroll-fades) */}
        <div
          className="absolute inset-0 pointer-events-none will-change-transform"
          style={{
            opacity: overlayBaseOpacity * overlayFade,
            transform: `translate3d(${overlayParallax.x}px, ${overlayParallax.y}px, 0)`
          }}
        >
          <div className="solar-center glow"></div>
          {/* Orbits */}
          <div className="orbit-ring orbit-r1">
            <div className="planet-dot planet-p1"></div>
          </div>
          <div className="orbit-ring orbit-r2">
            <div className="planet-dot planet-p2"></div>
          </div>
          <div className="orbit-ring orbit-r3">
            <div className="planet-dot planet-p3"></div>
          </div>
          <div className="orbit-ring orbit-r4">
            <div className="planet-dot planet-p4"></div>
          </div>
        </div>

        {/* Top-right UI label */}
        <div className="absolute top-6 right-6 z-10 pointer-events-none">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-gold/30 bg-black/30 backdrop-blur-sm shadow-glow-gold">
            <div className="w-2 h-2 rounded-full bg-gold animate-pulse"></div>
            <span className="text-xs sm:text-sm font-mono tracking-widest text-gold/90 uppercase">Orbital Interface Online</span>
            <div className="w-2 h-2 rounded-full bg-gold/70 animate-pulse animation-delay-500"></div>
          </div>
        </div>

        {/* AI Avatar Swirl Replaces Static Logo */}
        <div className="relative z-10 flex items-center justify-center animate-float" aria-label="AI Avatar">
          {/* Multi-layer outer glow */}
          <div className="absolute inset-0 -m-20 rounded-full bg-gold/20 blur-[120px] animate-pulse-slow"></div>
          <div className="absolute inset-0 -m-12 rounded-full bg-gold/15 blur-[60px]"></div>
          <div className="relative" style={{ filter: 'drop-shadow(0 0 50px rgba(218,165,32,0.55)) drop-shadow(0 0 25px rgba(218,165,32,0.4))' }}>
            <AIAvatarSwirl state={avatarState} size={220} />
          </div>
          <div className="absolute inset-4 rounded-full border border-gold/20 animate-ping-slow"></div>
          <div className="absolute inset-10 rounded-full border border-gold/10 animate-ping-slow" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>

      {/* Chat Interface - Bottom half with premium polish */}
      <div className="absolute bottom-0 left-0 w-full h-[45vh] bg-gradient-to-t from-black via-black/98 to-transparent backdrop-blur-sm">
        <div className="max-w-4xl mx-auto h-full flex flex-col px-4 sm:px-6 pt-16">
          
          {/* Messages with smooth scrolling */}
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto space-y-4 pb-4 scroll-smooth" style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(218, 165, 32, 0.3) transparent'
          }}>
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-reveal-up`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={`max-w-[85%] px-6 py-4 rounded-2xl backdrop-blur-md transition-all duration-300 hover:scale-[1.02] ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-gold/25 to-gold/15 text-white border border-gold/40 shadow-lg shadow-gold/10'
                      : 'bg-gradient-to-br from-white/10 to-white/5 text-white/95 border border-white/20 shadow-xl shadow-black/20'
                  }`}
                >
                  <p className="text-sm sm:text-base leading-relaxed">
                    {msg.content}
                    {msg.streaming && (
                      <span className="inline-block w-0.5 h-5 ml-1 bg-gold animate-pulse" />
                    )}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Premium Input Area */}
          <div className="pb-8 pt-4">
            <div className="relative">
              {/* Glow effect behind input */}
              <div className="absolute -inset-1 bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20 rounded-3xl blur-xl opacity-50"></div>
              
              <div className="relative flex items-center gap-3 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-3 backdrop-blur-xl shadow-2xl">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  placeholder="Ask Michael anything..."
                  className="flex-1 bg-transparent px-4 py-3 text-white placeholder-white/50 focus:outline-none text-sm sm:text-base font-light"
                  aria-label="Chat input"
                />
                
                <button
                  onClick={toggleMic}
                  className={`p-3 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50 animate-pulse' 
                      : 'bg-white/10 hover:bg-white/20 border border-white/20'
                  }`}
                  aria-label="Toggle microphone"
                  title={isListening ? 'Stop recording' : 'Start voice input'}
                >
                  {isListening ? (
                    <MicOff className="w-5 h-5 text-white" />
                  ) : (
                    <Mic className="w-5 h-5 text-white/90" />
                  )}
                </button>

                <button
                  onClick={() => handleSend()}
                  className="bg-gradient-to-r from-gold to-gold/90 hover:from-gold/90 hover:to-gold text-black font-semibold px-6 py-3 rounded-2xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-gold/30 transform hover:scale-105 active:scale-95"
                  aria-label="Send message"
                >
                  <span className="hidden sm:inline">Send</span>
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Footer info */}
            <div className="flex items-center justify-center gap-4 mt-4 text-xs">
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`px-3 py-1.5 rounded-full transition-all duration-300 ${
                  voiceEnabled 
                    ? 'bg-gold/20 text-gold border border-gold/30' 
                    : 'text-white/40 hover:text-white/60 border border-white/10'
                }`}
              >
                🎤 Voice {voiceEnabled ? 'ON' : 'OFF'}
              </button>
              <span className="text-white/30">•</span>
              <span className="text-white/40">Powered by Michael Crowe AI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
