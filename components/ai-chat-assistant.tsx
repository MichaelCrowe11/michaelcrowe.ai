"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Send, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [sessionId] = useState(() => crypto.randomUUID())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Send initial greeting when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greetings = [
        "Hi! I'm Michael's AI assistant. I help businesses discover how AI can transform their operations. What brings you here today?",
        "Hello! I work with Michael to help companies implement AI automation. What's your biggest business challenge right now?",
        "Hey there! I'm here to help you explore AI solutions for your business. What industry are you in?"
      ]
      const greeting = greetings[Math.floor(Math.random() * greetings.length)]

      setMessages([{
        id: crypto.randomUUID(),
        role: "assistant",
        content: greeting,
        timestamp: new Date()
      }])
    }
  }, [isOpen])

  async function handleSendMessage() {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          conversationId,
          sessionId,
          metadata: {
            // You can add user info here if collected
          }
        })
      })

      if (!response.ok) throw new Error('Failed to send message')

      const data = await response.json()

      setConversationId(data.conversationId)

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

      // If dev mode, show helpful hint
      if (data.metadata?.devMode) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "💡 Tip: This is running in demo mode. Add your Anthropic API key to .env.local to enable real AI conversations!",
            timestamp: new Date()
          }])
        }, 1000)
      }

    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting right now. Please try again or email hello@michaelcrowe.ai directly.",
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 group"
          aria-label="Open AI Assistant"
        >
          <div className="relative">
            {/* Pulsing ring effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-gold via-yellow-400 to-gold rounded-full opacity-75 blur-md group-hover:opacity-100 animate-pulse" />

            {/* Button */}
            <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gold to-yellow-600 rounded-full shadow-2xl transition-transform group-hover:scale-110">
              <Sparkles className="w-8 h-8 text-black" />
            </div>

            {/* Badge */}
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 border-2 border-black rounded-full animate-pulse" />
          </div>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-white text-black text-sm font-medium rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Ask AI Michael anything
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white" />
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-md h-[600px] bg-black border border-gold/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-gold/10 via-yellow-400/10 to-gold/10 border-b border-gold/20 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-gold to-yellow-600 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-black" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-black rounded-full" />
                </div>
                <div>
                  <h3 className="font-bold text-white">AI Michael</h3>
                  <p className="text-xs text-gray-400">AI Sales Assistant</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 bg-gradient-to-br from-gold to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-black" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] px-4 py-2 rounded-2xl",
                    message.role === "user"
                      ? "bg-gradient-to-r from-gold to-yellow-600 text-black font-medium"
                      : "bg-white/5 text-white border border-white/10"
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={cn(
                    "text-xs mt-1",
                    message.role === "user" ? "text-black/60" : "text-gray-500"
                  )}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-gradient-to-br from-gold to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-black" />
                </div>
                <div className="bg-white/5 px-4 py-3 rounded-2xl border border-white/10">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gold/20 p-4 bg-black/50 backdrop-blur-sm">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gold focus:ring-gold"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="bg-gradient-to-r from-gold to-yellow-600 text-black hover:from-yellow-600 hover:to-gold font-bold disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by Claude AI • Built by Michael Crowe
            </p>
          </div>
        </div>
      )}
    </>
  )
}
