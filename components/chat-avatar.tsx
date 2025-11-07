"use client"

import { useEffect, useRef, useState } from "react"
import { MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function ChatAvatar() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ id: number; role: 'user' | 'bot'; text: string }[]>([])
  const [input, setInput] = useState("")
  const [listening, setListening] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const recognitionRef = useRef<any>(null)
  const idRef = useRef(1)

  function pushBotMessage(text: string) {
    const id = idRef.current++
    setMessages((prev) => [...prev, { id, role: 'bot', text }])

    if (voiceEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        const utter = new SpeechSynthesisUtterance(text)
        window.speechSynthesis.cancel()
        window.speechSynthesis.speak(utter)
      } catch (e) {
        // ignore speech errors
      }
    }
  }

  function handleSend(textArg?: string) {
    const textToSend = (typeof textArg === 'string' ? textArg : input || '').trim()
    if (!textToSend) return

    const id = idRef.current++
    setMessages((prev) => [...prev, { id, role: 'user', text: textToSend }])
    setInput('')

    // Simulated bot response (placeholder for real AI integration)
    setTimeout(() => {
      const lower = textToSend.toLowerCase()
      let reply = "Thanks for that question — I can help. Tell me more about your goals."

      if (lower.includes('price') || lower.includes('cost') || lower.includes('sell') || lower.includes('pricing')) {
        reply = "I offer consulting, custom development and managed AI. For pricing, I like to start with a short discovery call — schedule one and I'll send a tailored proposal."
      } else if (lower.includes('portfolio') || lower.includes('work') || lower.includes('projects')) {
        reply = "You can view my projects in the portfolio section. I build production-grade AI systems across web and backend."
      } else if (lower.includes('hello') || lower.includes('hi')) {
        reply = "Hey! I'm Michael. What's your business and what result would you like?"
      }

      pushBotMessage(reply)
    }, 700)
  }

  useEffect(() => {
    // Open chat when avatar dispatches 'open-chat'
    function onOpen() {
      setIsOpen(true)
    }

    window.addEventListener('open-chat', onOpen as EventListener)

    // Setup simple speech recognition if available
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
      r.onend = () => setListening(false)
      recognitionRef.current = r
    }

    return () => {
      window.removeEventListener('open-chat', onOpen as EventListener)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // focus last message when opened
    if (isOpen) {
      // small welcome message if empty
      if (messages.length === 0) {
        pushBotMessage(
          "Hi — I\'m Michael. Ask me anything about AI, projects, or how I can help grow your business."
        )
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            className="h-16 w-16 rounded-full bg-gold text-gold-foreground hover:bg-gold/90 shadow-2xl shadow-gold/30 animate-bounce-subtle"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Chat Card */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-2xl animate-slide-up">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-border bg-muted/50 rounded-t-2xl">
            <div className="relative">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/crowe-logic-logo-87FZNrbBWYjPIm7AaAVgQ2TQIx435b.png"
                alt="Michael Crowe"
                className="w-12 h-12 rounded-full border-2 border-gold"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Michael Crowe</h3>
              <p className="text-xs text-muted-foreground">AI Systems Architect</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 rounded-full hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Message Content */}
          <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
            {messages.map((m) => (
              <div key={m.id} className={`p-3 rounded-2xl ${m.role === 'user' ? 'bg-gold/10 self-end' : 'bg-muted/50'}`}>
                <p className="text-sm leading-relaxed">{m.text}</p>
              </div>
            ))}
          </div>

          {/* Input area */}
          <div className="p-4 border-t border-border space-y-2">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleSend(input)
                  }
                }}
                className="flex-1 px-3 py-2 rounded-lg bg-card border border-border text-sm"
                placeholder="Ask Michael anything..."
                aria-label="Chat input"
              />
              <button
                onClick={() => {
                  if (recognitionRef.current && !listening) {
                    recognitionRef.current.start()
                    setListening(true)
                  } else if (recognitionRef.current && listening) {
                    recognitionRef.current.stop()
                    setListening(false)
                  }
                }}
                className={`h-10 w-10 rounded-full ${listening ? 'bg-red-500' : 'bg-muted'} flex items-center justify-center`}
                aria-label="Toggle microphone"
              >
                <MessageCircle className="h-4 w-4 text-white" />
              </button>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => handleSend(input)} className="flex-1 bg-gold text-gold-foreground">
                Send
              </Button>
              <Button variant="outline" onClick={() => setVoiceEnabled((v) => !v)} className="w-20">
                {voiceEnabled ? 'Voice On' : 'Voice Off'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
 
