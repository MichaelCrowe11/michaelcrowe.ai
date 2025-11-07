"use client"

import { useState, useEffect, useRef } from "react"
import { Send, Mic, MicOff } from "lucide-react"
import { AIAvatarSwirl } from "@/components/ai-avatar-swirl"
import { AIAvatar } from "@/components/ai-avatar"
import Image from "next/image"
import { useElevenLabsTTS } from "@/lib/use-elevenlabs-tts"
import { useTTS } from "@/lib/use-tts"
import { useMemo } from "react"
import { ChatStars } from "@/components/chat-stars"
import { salesEngine } from "@/lib/sales-engine"

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
      content: "Hey! Michael Crowe here—great to meet you. I help small businesses implement AI that actually drives results, not just buzzwords. Most people come to me frustrated because they've tried tools that don't work or consultants who overcharge and underdeliver. I'm different: I build real systems that make you money. Quick question to get started: what's the biggest bottleneck in your business right now?",
    }
  ])
  const [input, setInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    try {
      const v = localStorage.getItem('voiceEnabled')
      return v ? v === 'true' : false
    } catch { return false }
  })
  const [avatarMode, setAvatarMode] = useState<'swirl' | 'classic' | 'minimal'>(() => {
    if (typeof window === 'undefined') return 'swirl'
    return (localStorage.getItem('avatarMode') as 'swirl' | 'classic' | 'minimal') || 'swirl'
  })
  const recognitionRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const idCounterRef = useRef(1)
  
  // Try ElevenLabs first, fallback to Web Speech API
  const elevenLabs = useElevenLabsTTS({ 
    // Voice ID will be pulled from ELEVENLABS_VOICE_ID env var on server
    // This is just a fallback if not set
    voiceId: '21m00Tcm4TlvDq8ikWAM',
    stability: 0.5,
    similarityBoost: 0.75,
  })
  const webSpeech = useTTS({ rate: 0.9, pitch: 1 })
  
  // Use ElevenLabs if available, otherwise fallback
  const { speaking, speak, cancel: cancelTTS } = elevenLabs.hasApiKey ? elevenLabs : webSpeech
  const ttsSupported = elevenLabs.hasApiKey || webSpeech.isSupported
  
  const intervalsRef = useRef<number[]>([])
  const [liveText, setLiveText] = useState("")
  const [audioAmplitude, setAudioAmplitude] = useState(0)

  // Feature flag for enhanced starfield
  const enhancedStarsEnabled = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_CHAT_STARS_ENHANCED === 'true'

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

  // Persist avatar mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try { localStorage.setItem('avatarMode', avatarMode) } catch {}
    }
  }, [avatarMode])

  // Persist voice toggle and stop any ongoing TTS when turned off
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try { localStorage.setItem('voiceEnabled', String(voiceEnabled)) } catch {}
    }
    if (!voiceEnabled) cancelTTS()
  }, [voiceEnabled, cancelTTS])

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
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
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

    // Keep in 'thinking' until audio playback actually starts
    const interval = window.setInterval(() => {
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

        if (voiceEnabled && ttsSupported) {
          speak(text, {
            onStart: () => setAvatarState('responding'),
            onEnd: () => {
              setAvatarState('completed' as any)
              setTimeout(() => setAvatarState('idle'), 1000)
            },
            onError: () => {
              setAvatarState('completed' as any)
              setTimeout(() => setAvatarState('idle'), 1000)
            }
          })
        } else {
          // No TTS: finish visually
          setAvatarState('completed' as any)
          setTimeout(() => setAvatarState('idle'), 1000)
        }
      }
    }, 50)
    intervalsRef.current.push(interval)
  }

  const handleSend = (textArg?: string) => {
    const textToSend = (typeof textArg === 'string' ? textArg : input || '').trim()
    if (!textToSend) return

    const userMsgId = idCounterRef.current++
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', content: textToSend }])
    setInput('')

    setTimeout(() => {
      // Use sales engine to generate high-converting response
      const reply = salesEngine.generateResponse(textToSend)

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

  const TypingDots = () => {
    return (
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
      </div>
    )
  }

  // Accessibility: announce assistant message updates
  useEffect(() => {
    const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant')
    if (lastAssistant) setLiveText(lastAssistant.content)
  }, [messages])

  // Animate audio amplitude for starfield audio-reactive effects
  useEffect(() => {
    if (!speaking) {
      // Fade out smoothly
      const fadeOut = setInterval(() => {
        setAudioAmplitude(prev => {
          const next = Math.max(0, prev - 0.05)
          if (next === 0) clearInterval(fadeOut)
          return next
        })
      }, 20) // ~400ms to fade from 1 to 0
      return () => clearInterval(fadeOut)
    } else {
      // Fade in quickly
      const fadeIn = setInterval(() => {
        setAudioAmplitude(prev => {
          const next = Math.min(1, prev + 0.1)
          if (next === 1) clearInterval(fadeIn)
          return next
        })
      }, 20) // ~200ms to fade from 0 to 1
      return () => clearInterval(fadeIn)
    }
  }, [speaking])

  // Cleanup streaming intervals on unmount
  useEffect(() => {
    return () => {
      intervalsRef.current.forEach(id => clearInterval(id))
      intervalsRef.current = []
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Enhanced starfield background (optional via feature flag) */}
      {enhancedStarsEnabled && (
        <ChatStars
          enabled={true}
          layerCount={4}
          starsPerLayer={2778} // 11,111 total stars (2778 × 4 = 11,112)
          twinkleSpeed={1.2}
          parallaxStrength={0.4}
          shootingStarRate={5}
          audioAmplitude={audioAmplitude}
        />
      )}

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
        <div className="absolute top-6 right-6 z-10 pointer-events-none" aria-hidden="true">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-gold/30 bg-black/30 backdrop-blur-sm shadow-glow-gold">
            <div className="w-2 h-2 rounded-full bg-gold animate-pulse"></div>
            <span className="text-xs sm:text-sm font-mono tracking-widest text-gold/90 uppercase">Orbital Interface Online</span>
            <div className="w-2 h-2 rounded-full bg-gold/70 animate-pulse animation-delay-500"></div>
          </div>
        </div>

        {/* AI Avatar section */}
        <div className="relative z-10 flex items-center justify-center animate-float" aria-label="AI Avatar">
          {/* Multi-layer outer glow */}
          <div className="absolute inset-0 -m-20 rounded-full bg-gold/20 blur-[120px] animate-pulse-slow"></div>
          <div className="absolute inset-0 -m-12 rounded-full bg-gold/15 blur-[60px]"></div>
          <div className="relative" style={{ filter: 'drop-shadow(0 0 50px rgba(218,165,32,0.55)) drop-shadow(0 0 25px rgba(218,165,32,0.4))' }}>
            {avatarMode === 'swirl' ? (
              <AIAvatarSwirl state={avatarState} size={220} />
            ) : avatarMode === 'minimal' ? (
              <AIAvatar state={avatarState === 'responding' ? 'streaming' : avatarState === 'thinking' ? 'thinking' : avatarState === 'idle' ? 'idle' : 'completed'} size="lg" />
            ) : (
              <Image
                src="/crowe-logic-logo-transparent.png"
                alt="Crowe Logic"
                width={288}
                height={288}
                className="w-72 h-72 object-contain"
                priority
              />
            )}
          </div>
          <div className="absolute inset-4 rounded-full border border-gold/20 animate-ping-slow"></div>
          <div className="absolute inset-10 rounded-full border border-gold/10 animate-ping-slow" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>

      {/* Chat Interface - Bottom half with premium polish */}
      <div className="absolute bottom-0 left-0 w-full h-[45vh] bg-gradient-to-t from-black via-black/98 to-transparent backdrop-blur-sm">
        <div className="max-w-4xl mx-auto h-full flex flex-col px-4 sm:px-6 pt-16">
          
          {/* Live region for screen readers */}
          <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{liveText}</div>

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
                <div className="flex items-end gap-3 max-w-[85%] w-full">
                  {msg.role === 'assistant' && (
                    <div className="mt-1">
                      <AIAvatar state={msg.streaming ? 'streaming' : 'completed'} size="sm" />
                    </div>
                  )}

                  <div className={`relative flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} w-full`}>
                    <div className={`chat-bubble px-5 py-3 rounded-2xl transition-all duration-300 ${
                      msg.role === 'user'
                        ? 'from-user'
                        : 'from-assistant'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className="text-xs font-medium text-white/70 mr-1">{msg.role === 'user' ? 'You' : 'Assistant'}</div>
                        <div className="text-sm leading-relaxed break-words">{msg.content || (msg.streaming ? '' : '')}</div>
                        {msg.streaming && (
                          <div className="ml-2">
                            <TypingDots />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-1 text-[11px] text-white/40">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
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
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAvatarMode('swirl')}
                  className={`px-3 py-1.5 rounded-full border transition ${avatarMode==='swirl' ? 'border-gold/40 text-gold' : 'border-white/15 text-white/70 hover:text-white/90 hover:border-white/30'}`}
                  title="Animated Swirl"
                  aria-pressed={avatarMode==='swirl'}
                >Swirl</button>
                <button
                  onClick={() => setAvatarMode('classic')}
                  className={`px-3 py-1.5 rounded-full border transition ${avatarMode==='classic' ? 'border-gold/40 text-gold' : 'border-white/15 text-white/70 hover:text-white/90 hover:border-white/30'}`}
                  title="Classic Logo"
                  aria-pressed={avatarMode==='classic'}
                >Classic</button>
                <button
                  onClick={() => setAvatarMode('minimal')}
                  className={`px-3 py-1.5 rounded-full border transition ${avatarMode==='minimal' ? 'border-gold/40 text-gold' : 'border-white/15 text-white/70 hover:text-white/90 hover:border-white/30'}`}
                  title="Minimal"
                  aria-pressed={avatarMode==='minimal'}
                >Minimal</button>
              </div>
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`px-3 py-1.5 rounded-full transition-all duration-300 ${
                  voiceEnabled 
                    ? 'bg-gold/20 text-gold border border-gold/30' 
                    : 'text-white/40 hover:text-white/60 border border-white/10'
                }`}
                title={ttsSupported ? (voiceEnabled ? 'Disable voice' : 'Enable voice') : 'Voice not supported in this browser'}
                aria-disabled={!ttsSupported}
                aria-pressed={voiceEnabled}
                disabled={!ttsSupported}
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
