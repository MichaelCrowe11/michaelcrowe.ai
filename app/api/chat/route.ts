import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { generateSystemPrompt } from '@/lib/knowledge-base'

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

    // Generate system prompt from knowledge base
    const systemPrompt = generateSystemPrompt('sales')

    // Try Anthropic Claude FIRST (primary provider)
    // Support both direct Anthropic API and Vercel AI Gateway
    const anthropicKey = process.env.ANTHROPIC_API_KEY
    const vercelAIGatewayKey = process.env.VERCEL_AI_GATEWAY_KEY
    
    if (anthropicKey || vercelAIGatewayKey) {
      try {
        // Use Vercel AI Gateway if available, otherwise direct Anthropic API
        const apiUrl = vercelAIGatewayKey 
          ? 'https://gateway.ai.cloudflare.com/v1/anthropic/messages'
          : 'https://api.anthropic.com/v1/messages'
        
        const apiKey = vercelAIGatewayKey || anthropicKey
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'x-api-key': apiKey!,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022', // Latest Claude 3.5 Sonnet
            max_tokens: 1024,
            temperature: 0.8,
            system: systemPrompt,
            messages: [
              ...conversationHistory.slice(-8), // Keep last 8 messages for better context
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
            provider: 'anthropic-claude',
          })
        } else {
          const errorData = await response.text()
          console.error('Anthropic API error:', response.status, errorData)
        }
      } catch (error) {
        console.error('Anthropic error:', error)
      }
    }

    // Fallback to OpenAI if Anthropic fails
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
                content: systemPrompt,
              },
              ...conversationHistory.slice(-8),
              {
                role: 'user',
                content: message,
              },
            ],
            temperature: 0.8,
            max_tokens: 1024,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          return NextResponse.json({
            message: data.choices[0].message.content,
            provider: 'openai-fallback',
          })
        }
      } catch (error) {
        console.error('OpenAI error:', error)
      }
    }

    // Final fallback: Use built-in sales engine
    const { salesEngine } = await import('@/lib/sales-engine')
    const reply = salesEngine.generateResponse(message)

    return NextResponse.json({
      message: reply,
      provider: 'sales-engine-fallback',
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
