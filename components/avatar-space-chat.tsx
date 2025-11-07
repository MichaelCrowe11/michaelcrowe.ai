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

  const handleSend = async (textArg?: string) => {
    const textToSend = (typeof textArg === 'string' ? textArg : input || '').trim()
    if (!textToSend) return

    const userMsgId = idCounterRef.current++
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', content: textToSend }])
    setInput('')

    const assistantMsgId = idCounterRef.current++
    setMessages(prev => [...prev, { id: assistantMsgId, role: 'assistant', content: '', streaming: true }])
    setAvatarState('thinking')

    try {
      // Try AI API first (OpenAI/Anthropic if keys are set)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          conversationHistory: messages.slice(-6).map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        streamText(data.message, assistantMsgId)
      } else {
        // Fallback to sales engine
        const reply = salesEngine.generateResponse(textToSend)
        streamText(reply, assistantMsgId)
      }
    } catch (error) {
      console.error('Chat error:', error)
      // Fallback to sales engine
      const reply = salesEngine.generateResponse(textToSend)
      streamText(reply, assistantMsgId)
    }
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

      {/* Main Chat Container - ChatGPT/Claude Style */}
      <div className="relative z-10 h-full flex flex-col max-w-4xl mx-auto">
        {/* Header with Avatar */}
        <div className="flex-shrink-0 py-6 px-4 sm:px-6 flex items-center justify-between border-b border-gold/20 bg-black/40 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            {/* Bright, visible avatar */}
            <div className="relative" style={{ 
              filter: 'drop-shadow(0 0 40px rgba(218,165,32,0.8)) brightness(1.5)' 
            }}>
              {avatarMode === 'swirl' ? (
                <AIAvatarSwirl state={avatarState} size={60} />
              ) : avatarMode === 'minimal' ? (
                <AIAvatar state={avatarState === 'responding' ? 'streaming' : avatarState === 'thinking' ? 'thinking' : avatarState === 'idle' ? 'idle' : 'completed'} size="md" />
              ) : (
                <Image
                  src="/crowe-logic-logo-transparent.png"
                  alt="Crowe Logic"
                  width={60}
                  height={60}
                  className="w-15 h-15 object-contain brightness-150"
                  priority
                />
              )}
              <div className="absolute inset-0 rounded-full border-2 border-gold/30 animate-ping-slow"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white brightness-150">Michael Crowe AI</h1>
              <p className="text-sm text-gold/80 brightness-125">AI Strategy & Development Expert</p>
            </div>
          </div>

          {/* Avatar Mode Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAvatarMode('swirl')}
              className={`px-3 py-1.5 rounded-lg text-xs transition ${avatarMode==='swirl' ? 'bg-gold/20 text-gold border border-gold/40' : 'text-white/60 hover:text-white/90 border border-white/10'}`}
              title="Animated Swirl"
            >Swirl</button>
            <button
              onClick={() => setAvatarMode('minimal')}
              className={`px-3 py-1.5 rounded-lg text-xs transition ${avatarMode==='minimal' ? 'bg-gold/20 text-gold border border-gold/40' : 'text-white/60 hover:text-white/90 border border-white/10'}`}
              title="Minimal"
            >Minimal</button>
          </div>
        </div>

        {/* Live region for screen readers */}
        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{liveText}</div>

        {/* Messages Area - ChatGPT Style */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 scroll-smooth" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(218, 165, 32, 0.4) transparent'
        }}>
          <div className="space-y-6 max-w-3xl mx-auto">
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex gap-4 animate-reveal-up ${msg.role === 'assistant' ? 'items-start' : 'items-start'}`}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {msg.role === 'assistant' && (
                  <div className="flex-shrink-0 mt-1" style={{ 
                    filter: 'drop-shadow(0 0 20px rgba(218,165,32,0.6)) brightness(1.4)' 
                  }}>
                    <AIAvatar state={msg.streaming ? 'streaming' : 'completed'} size="sm" />
                  </div>
                )}

                <div className={`flex-1 ${msg.role === 'user' ? 'ml-12' : ''}`}>
                  {/* Gold-framed message bubble */}
                  <div className={`relative rounded-2xl p-4 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-gold/10 to-gold/5 border-2 border-gold/40 shadow-lg shadow-gold/20'
                      : 'bg-gradient-to-br from-white/5 to-white/2 border-2 border-gold/30 shadow-lg shadow-gold/10'
                  }`}>
                    {/* Glow effect */}
                    <div className={`absolute -inset-1 rounded-2xl blur-xl opacity-30 ${
                      msg.role === 'user' ? 'bg-gold/40' : 'bg-gold/20'
                    }`} style={{ zIndex: -1 }}></div>
                    
                    {/* Content */}
                    <div className="relative">
                      <div className={`text-xs font-semibold mb-2 ${
                        msg.role === 'user' ? 'text-gold brightness-125' : 'text-gold/90 brightness-110'
                      }`}>
                        {msg.role === 'user' ? 'You' : 'Michael Crowe'}
                      </div>
                      
                      <div className={`text-base leading-relaxed ${
                        msg.role === 'user' 
                          ? 'text-white brightness-150 font-medium' 
                          : 'text-white/95 brightness-140'
                      }`}>
                        {msg.content || ''}
                        {msg.streaming && !msg.content && (
                          <TypingDots />
                        )}
                      </div>

                      {msg.streaming && msg.content && (
                        <span className="inline-block w-2 h-5 ml-1 bg-gold animate-pulse"></span>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-white/40 brightness-110 px-1">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 border-2 border-gold/50 flex items-center justify-center mt-1 shadow-lg shadow-gold/20">
                    <span className="text-white text-sm font-bold brightness-150">You</span>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area - Fixed at Bottom */}
        <div className="flex-shrink-0 border-t border-gold/20 bg-black/60 backdrop-blur-xl">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
            <div className="relative">
              {/* Gold glow behind input */}
              <div className="absolute -inset-2 bg-gradient-to-r from-gold/20 via-gold/30 to-gold/20 rounded-3xl blur-2xl opacity-50"></div>
              
              <div className="relative flex items-end gap-3 bg-gradient-to-br from-white/10 to-white/5 border-2 border-gold/40 rounded-3xl p-3 shadow-2xl shadow-gold/20">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  placeholder="Ask Michael anything about AI solutions..."
                  className="flex-1 bg-transparent px-4 py-3 text-white brightness-150 placeholder-white/60 focus:outline-none text-base font-normal resize-none max-h-32"
                  aria-label="Chat input"
                  rows={1}
                  style={{ 
                    minHeight: '24px',
                    textShadow: '0 0 10px rgba(0,0,0,0.5)'
                  }}
                />
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMic}
                    className={`p-3 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                      isListening 
                        ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50 animate-pulse' 
                        : 'bg-white/10 hover:bg-white/20 border border-gold/30'
                    }`}
                    aria-label="Toggle microphone"
                    title={isListening ? 'Stop recording' : 'Start voice input'}
                  >
                    {isListening ? (
                      <MicOff className="w-5 h-5 text-white brightness-150" />
                    ) : (
                      <Mic className="w-5 h-5 text-gold brightness-125" />
                    )}
                  </button>

                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim()}
                    className="bg-gradient-to-r from-gold to-gold/90 hover:from-gold/90 hover:to-gold text-black font-semibold px-6 py-3 rounded-2xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-gold/40 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Controls */}
            <div className="flex items-center justify-between mt-3 px-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all duration-300 ${
                    voiceEnabled 
                      ? 'bg-gold/20 text-gold border border-gold/40 shadow-lg shadow-gold/20' 
                      : 'text-white/50 hover:text-white/80 border border-white/10'
                  }`}
                  title={ttsSupported ? (voiceEnabled ? 'Disable voice' : 'Enable voice') : 'Voice not supported in this browser'}
                  disabled={!ttsSupported}
                >
                  🎤 Voice {voiceEnabled ? 'ON' : 'OFF'}
                </button>
              </div>
              <span className="text-xs text-white/40 brightness-110">Powered by Michael Crowe AI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
