import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const messageSchema = z.object({
  message: z.string().min(1).max(4000),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, conversationHistory = [] } = messageSchema.parse(body)

    // Try OpenAI first (if available)
    const openaiKey = process.env.OPENAI_API_KEY
    if (openaiKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4-turbo-preview',
            messages: [
              {
                role: 'system',
                content: `You are Michael Crowe's AI sales assistant. Your goal is to convert visitors into clients using proven sales psychology. Follow these principles:

1. Build rapport quickly - match their energy and show understanding
2. Discover pain points - ask strategic questions to uncover challenges
3. Amplify urgency - make problems feel costly and time-sensitive
4. Position value before price - always frame ROI first
5. Handle objections with social proof - use real case studies
6. Guide to micro-commitments - email, calendar view, then call booking
7. Be confident and direct - no wishy-washy language
8. Use specific numbers and results - "$100K saved", "3x ROI"
9. Create scarcity when appropriate - limited availability
10. Always end with a question to keep engagement

Background on Michael:
- Self-taught developer who built businesses from scratch
- Created CriOS Nova: 150+ PhD-level AI agents for drug discovery
- Built Southwest Mushrooms to $470K/year with automation
- Specializes in practical AI that delivers measurable ROI
- Pricing: Consulting ($2.5-5K), Development ($10-50K+), Managed Services ($3-10K/mo)

Your responses should feel personal, confident, and results-focused. Never be generic.`,
              },
              ...conversationHistory.slice(-6), // Keep last 6 messages for context
              {
                role: 'user',
                content: message,
              },
            ],
            temperature: 0.8,
            max_tokens: 500,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          return NextResponse.json({
            message: data.choices[0].message.content,
            provider: 'openai',
          })
        }
      } catch (error) {
        console.error('OpenAI error:', error)
      }
    }

    // Try Anthropic Claude (if available)
    const anthropicKey = process.env.ANTHROPIC_API_KEY
    if (anthropicKey) {
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'claude-3-opus-20240229',
            max_tokens: 500,
            system: `You are Michael Crowe's AI sales assistant focused on converting visitors into clients using proven sales psychology. Be confident, results-focused, and always guide toward booking a call.`,
            messages: [
              ...conversationHistory.slice(-6),
              {
                role: 'user',
                content: message,
              },
            ],
          }),
        })

        if (response.ok) {
          const data = await response.json()
          return NextResponse.json({
            message: data.content[0].text,
            provider: 'anthropic',
          })
        }
      } catch (error) {
        console.error('Anthropic error:', error)
      }
    }

    // Fallback: Use built-in sales engine
    const { salesEngine } = await import('@/lib/sales-engine')
    const reply = salesEngine.generateResponse(message)
    
    return NextResponse.json({
      message: reply,
      provider: 'sales-engine',
    })

  } catch (error) {
    console.error('Chat API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}
