# Conversational AI Implementation Guide
**MichaelCrowe.ai - Complete System Documentation**

## Overview

This guide shows you how to implement the complete conversational AI system for michaelcrowe.ai, combining all the components we've created into a cohesive, voice-first web experience.

---

## What's Been Built

### ✅ Core Components (Ready to Use)

1. **3D Big Bang Intro** (`components/bigbang-intro-three.tsx`)
   - Three.js particle system with 5000 particles
   - Immersive brand reveal animation
   - Accessible at `/intro` route

2. **Enhanced AI Chat System** (`app/api/chat/route.ts`)
   - Sales-focused conversation engine using DeepSeek
   - Lead qualification framework
   - Service tier matching
   - Portfolio showcasing capabilities

3. **Service Components**
   - **Portfolio Showcase** (`components/portfolio-showcase-enhanced.tsx`)
   - **Pricing Calculator** (`components/pricing-calculator.tsx`)
   - **Testimonials** (`components/testimonials-enhanced.tsx`)

4. **Conversational UI Components**
   - **Voice Interface** (`components/voice-interface.tsx`)
   - **Chat Interface** (`components/chat-interface-enhanced.tsx`)
   - **Avatar Interface** (`components/avatar-interface.tsx`)

5. **API Routes**
   - **Lead Capture** (`app/api/capture-lead/route.ts`)
   - Chat endpoint with agentic capabilities

6. **Demo Page** (`app/demo/page.tsx`)
   - Showcases all service components
   - Interactive examples

---

## Complete Implementation Example

### Full Conversational AI Page

Here's how to create a complete conversational AI experience similar to the vision document:

```tsx
// app/ai/page.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { BigBangIntroThree } from "@/components/bigbang-intro-three"
import { AvatarInterface } from "@/components/avatar-interface"
import { VoiceInterface, VoiceInterfaceHandle } from "@/components/voice-interface"
import { ChatInterfaceEnhanced } from "@/components/chat-interface-enhanced"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: number
  emotion?: string
}

export default function AIPage() {
  // State
  const [showIntro, setShowIntro] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showChat, setShowChat] = useState(false)

  // Refs
  const voiceRef = useRef<VoiceInterfaceHandle>(null)

  // Initial greeting
  useEffect(() => {
    if (!showIntro) {
      const greeting =
        "Hi! I'm Michael Crowe's AI assistant. I can help you with AI development, web projects, or answer any questions about my services. What brings you here today?"

      setMessages([
        {
          role: "assistant",
          content: greeting,
          timestamp: Date.now()
        }
      ])

      // Auto-speak greeting after a delay
      setTimeout(() => {
        voiceRef.current?.speak(greeting)
      }, 1000)
    }
  }, [showIntro])

  // Handle intro completion
  const handleIntroComplete = () => {
    setShowIntro(false)
  }

  // Handle user message
  const handleUserMessage = async (text: string) => {
    // Add user message to UI
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: text,
        timestamp: Date.now()
      }
    ])

    setIsProcessing(true)

    try {
      // Call chat API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...messages,
            { role: "user", content: text, timestamp: Date.now() }
          ]
        })
      })

      const data = await response.json()

      // Add assistant response
      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        timestamp: Date.now(),
        emotion: detectEmotion(data.message)
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Speak response
      voiceRef.current?.speak(data.message)
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize for the technical difficulty. Please try again or email michael@crowelogic.com",
          timestamp: Date.now()
        }
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  // Simple emotion detection
  const detectEmotion = (text: string): string => {
    if (text.includes("!") || text.includes("amazing") || text.includes("great")) {
      return "excited"
    }
    if (text.includes("?")) {
      return "curious"
    }
    return "neutral"
  }

  // Show intro on first visit
  if (showIntro) {
    return <BigBangIntroThree onComplete={handleIntroComplete} />
  }

  return (
    <main className="relative w-screen h-screen bg-black overflow-hidden">
      {/* 3D Background (optional - can use BigBang background component) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />

      {/* Central Avatar */}
      <AvatarInterface
        isSpeaking={isSpeaking}
        emotion={messages[messages.length - 1]?.emotion as any}
      />

      {/* Voice Controls */}
      <VoiceInterface
        ref={voiceRef}
        onTranscript={handleUserMessage}
        onSpeechEnd={() => setIsSpeaking(false)}
      />

      {/* Chat Interface */}
      <ChatInterfaceEnhanced
        messages={messages}
        onSendMessage={handleUserMessage}
        isProcessing={isProcessing}
        isVisible={showChat}
        onToggle={() => setShowChat(!showChat)}
      />

      {/* Toggle Chat Button (when hidden) */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-4 right-4 z-40 px-6 py-3 bg-gold hover:bg-gold/90 text-gold-foreground rounded-full font-semibold shadow-lg shadow-gold/30 transition-all"
        >
          Open Chat
        </button>
      )}

      {/* Info Badge */}
      <div className="fixed top-4 left-4 z-40 flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-lg border border-border rounded-full">
        <span className="text-xl">🤖</span>
        <span className="text-sm text-muted-foreground">AI-Powered Experience</span>
      </div>
    </main>
  )
}
```

---

## Integration Steps

### Step 1: Add Conversational AI Route

1. Create `/app/ai/page.tsx` using the example above
2. This gives you a dedicated conversational AI experience at `/ai`

### Step 2: Update Main Page

Add the intro and service components to your main page:

```tsx
// app/page.tsx
"use client"

import { useState, useEffect } from "react"
import { BigBangIntroThree } from "@/components/bigbang-intro-three"
import { HeroPremium } from "@/components/hero-premium"
import { PortfolioShowcaseEnhanced } from "@/components/portfolio-showcase-enhanced"
import { PricingCalculator } from "@/components/pricing-calculator"
import { TestimonialsEnhanced } from "@/components/testimonials-enhanced"
// ... other imports

export default function Home() {
  const [showIntro, setShowIntro] = useState(false)

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("hasSeenBigBangIntro")
    if (!hasSeenIntro) {
      setShowIntro(true)
    }
  }, [])

  const handleIntroComplete = () => {
    sessionStorage.setItem("hasSeenBigBangIntro", "true")
    setShowIntro(false)
  }

  if (showIntro) {
    return <BigBangIntroThree onComplete={handleIntroComplete} />
  }

  return (
    <main>
      <HeroPremium />

      {/* Add service components */}
      <PortfolioShowcaseEnhanced />
      <PricingCalculator />
      <TestimonialsEnhanced />

      {/* ... rest of your content */}
    </main>
  )
}
```

### Step 3: Set Up External Integrations

#### Calendly Integration

```tsx
// lib/integrations/calendly.ts
export function openCalendlyPopup(meetingType = "discovery") {
  const url = `https://calendly.com/michaelcrowe/${meetingType}`

  // Option 1: Open in new tab
  window.open(url, "_blank")

  // Option 2: Use Calendly widget (requires Calendly script)
  // @ts-ignore
  if (window.Calendly) {
    // @ts-ignore
    window.Calendly.initPopupWidget({ url })
  }
}
```

Add to your HTML head (in `app/layout.tsx`):

```tsx
<Script src="https://assets.calendly.com/assets/external/widget.js" />
<link
  href="https://assets.calendly.com/assets/external/widget.css"
  rel="stylesheet"
/>
```

#### Stripe Integration

```typescript
// app/api/create-checkout/route.ts
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia"
})

export async function POST(req: NextRequest) {
  try {
    const { productId, priceId } = await req.json()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error("Stripe error:", error)
    return NextResponse.json({ error: "Payment session creation failed" }, { status: 500 })
  }
}
```

Usage:

```tsx
const handlePayment = async (priceId: string) => {
  const response = await fetch("/api/create-checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId: "ai-project", priceId })
  })

  const { url } = await response.json()
  window.location.href = url
}
```

---

## Environment Variables Setup

Create `.env.local`:

```bash
# AI API Keys
DEEPSEEK_API_KEY=your_deepseek_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here (if using Claude)

# Voice (Optional - for ElevenLabs premium voice)
ELEVENLABS_API_KEY=your_elevenlabs_key_here

# Payment Processing
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Scheduling
CALENDLY_API_KEY=your_calendly_key_here (optional)

# CRM (Optional)
HUBSPOT_API_KEY=your_hubspot_key_here

# Email
RESEND_API_KEY=your_resend_key_here

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Advanced Features

### ElevenLabs Voice Cloning

To use premium voice cloning instead of Web Speech API:

1. Sign up at elevenlabs.io
2. Clone your voice
3. Get your voice ID
4. Create API route:

```typescript
// app/api/text-to-speech/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { text, voiceId = "your_voice_id" } = await req.json()

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY!
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      }
    )

    const audioBlob = await response.blob()
    return new NextResponse(audioBlob, {
      headers: {
        "Content-Type": "audio/mpeg"
      }
    })
  } catch (error) {
    return NextResponse.json({ error: "TTS failed" }, { status: 500 })
  }
}
```

Update VoiceInterface to use it:

```tsx
const speak = async (text: string) => {
  const response = await fetch("/api/text-to-speech", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  })

  const audioBlob = await response.blob()
  const audioUrl = URL.createObjectURL(audioBlob)
  const audio = new Audio(audioUrl)

  setIsSpeaking(true)
  audio.onended = () => setIsSpeaking(false)
  await audio.play()
}
```

### Analytics Integration

```typescript
// lib/analytics.ts
export const trackEvent = (eventName: string, properties?: any) => {
  // Mixpanel
  if (window.mixpanel) {
    window.mixpanel.track(eventName, properties)
  }

  // Google Analytics
  if (window.gtag) {
    window.gtag("event", eventName, properties)
  }
}

// Usage in components
trackEvent("lead_captured", {
  email: lead.email,
  budget: lead.budget,
  source: "ai_chat"
})
```

---

## Testing Checklist

### Functionality Tests

- [ ] Voice input works in Chrome, Firefox, Safari
- [ ] Speech output is clear and properly timed
- [ ] Chat interface sends/receives messages
- [ ] Lead capture saves to database
- [ ] Calendly link opens correctly
- [ ] Pricing calculator shows accurate estimates
- [ ] Portfolio showcase displays all projects
- [ ] Testimonials render properly

### User Experience Tests

- [ ] Intro animation plays smoothly
- [ ] Avatar animations sync with speech
- [ ] Chat is responsive on mobile
- [ ] Voice controls are intuitive
- [ ] Page loads in under 3 seconds
- [ ] All interactions feel smooth (60fps)

### Edge Cases

- [ ] Browser doesn't support Web Speech API
- [ ] Network error during API call
- [ ] User denies microphone permission
- [ ] Very long messages handle well
- [ ] Multiple rapid messages queue properly

---

## Deployment Checklist

### Pre-Launch

- [ ] All environment variables set in Vercel
- [ ] Stripe in live mode with real keys
- [ ] Calendly connected to real calendar
- [ ] Email service configured
- [ ] Analytics tracking active
- [ ] Domain configured (michaelcrowe.ai)
- [ ] SSL certificate active
- [ ] Test payment flow end-to-end

### Post-Launch Monitoring

- [ ] Set up error tracking (Sentry)
- [ ] Monitor API usage/costs
- [ ] Track conversion rates
- [ ] Review chat transcripts
- [ ] Analyze user flows
- [ ] A/B test variations

---

## Component Reference

### Available Components

| Component | Path | Purpose |
|-----------|------|---------|
| BigBangIntroThree | `components/bigbang-intro-three.tsx` | 3D particle intro animation |
| AvatarInterface | `components/avatar-interface.tsx` | Animated avatar with status |
| VoiceInterface | `components/voice-interface.tsx` | Voice input/output controls |
| ChatInterfaceEnhanced | `components/chat-interface-enhanced.tsx` | Modern chat UI |
| PortfolioShowcaseEnhanced | `components/portfolio-showcase-enhanced.tsx` | Interactive portfolio |
| PricingCalculator | `components/pricing-calculator.tsx` | Project estimator |
| TestimonialsEnhanced | `components/testimonials-enhanced.tsx` | Client testimonials |

### API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/chat` | POST | AI conversation endpoint |
| `/api/capture-lead` | POST | Save lead to CRM |
| `/api/text-to-speech` | POST | ElevenLabs voice synthesis |
| `/api/create-checkout` | POST | Stripe payment session |

---

## Next Steps

1. **Week 1**: Integrate all components into main page
2. **Week 2**: Set up external services (Calendly, Stripe, etc.)
3. **Week 3**: Test and refine user experience
4. **Week 4**: Launch and monitor

---

## Support & Resources

- **Demo**: Visit `/demo` to see all components
- **Service Guide**: `SERVICE_OFFERING_GUIDE.md`
- **Intro Docs**: `BIG_BANG_INTRO_README.md`
- **Contact**: michael@crowelogic.com

---

## Conclusion

You now have a complete conversational AI system ready for deployment. The components work together to create an immersive, voice-first web experience that showcases your services while actively selling them.

The site itself becomes the portfolio - demonstrating your AI capabilities in real-time while converting visitors into high-value clients.

**Ready to transform web interaction!** 🚀
