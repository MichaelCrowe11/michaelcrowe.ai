import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabaseAdmin } from '@/lib/supabase'
import {
  AI_PERSONALITY,
  SERVICES_INFO,
  CASE_STUDIES,
  CONVERSATION_FLOWS,
  DEV_MODE_RESPONSES
} from '@/lib/ai-config'

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'placeholder'
})

const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true'

// Rate limiting map (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(identifier: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(identifier)

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + 60000 }) // 1 minute
    return true
  }

  if (limit.count >= 20) { // 20 messages per minute
    return false
  }

  limit.count++
  return true
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message, conversationId, sessionId, metadata } = body

    // Rate limiting
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { status: 429 }
      )
    }

    // Validation
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Development mode - return mock responses
    if (DEV_MODE) {
      const mockResponse = DEV_MODE_RESPONSES.responses[
        Math.floor(Math.random() * DEV_MODE_RESPONSES.responses.length)
      ]

      return NextResponse.json({
        response: mockResponse,
        conversationId: conversationId || 'dev-mode-conversation',
        metadata: {
          devMode: true,
          suggestion: 'Add your ANTHROPIC_API_KEY to .env.local to enable real AI'
        }
      })
    }

    // Get or create conversation
    let conversation
    if (conversationId) {
      const { data } = await supabaseAdmin
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single()
      conversation = data
    }

    if (!conversation) {
      const { data, error } = await supabaseAdmin
        .from('conversations')
        .insert({
          session_id: sessionId || crypto.randomUUID(),
          status: 'active',
          metadata: metadata || {}
        })
        .select()
        .single()

      if (error) throw error
      conversation = data
    }

    // Save user message
    await supabaseAdmin.from('messages').insert({
      conversation_id: conversation.id,
      role: 'user',
      content: message
    })

    // Get conversation history
    const { data: messageHistory } = await supabaseAdmin
      .from('messages')
      .select('*')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true })
      .limit(20)

    // Build context from conversation
    const conversationContext = messageHistory
      ?.map(msg => `${msg.role}: ${msg.content}`)
      .join('\n') || ''

    // Search knowledge base (simplified for now - full RAG in next iteration)
    const relevantKnowledge = await searchKnowledge(message)

    // Build system prompt
    const systemPrompt = `${AI_PERSONALITY}

RELEVANT CASE STUDIES:
${relevantKnowledge}

SERVICES AVAILABLE:
${Object.entries(SERVICES_INFO).map(([name, info]) =>
  `${name}: ${info.price} (${info.duration}) - ${info.ideal_for}`
).join('\n')}

CONVERSATION SO FAR:
${conversationContext}

INSTRUCTIONS:
- Ask questions to understand their needs
- Reference relevant case studies when appropriate
- Qualify budget, timeline, and authority
- Recommend the right service based on their situation
- Offer to book a discovery call when appropriate
- Be helpful and consultative, not pushy
- Keep responses concise (2-3 sentences max)`

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: message
      }]
    })

    const assistantMessage = response.content[0].type === 'text'
      ? response.content[0].text
      : 'I apologize, but I encountered an error. Could you rephrase that?'

    // Save assistant response
    await supabaseAdmin.from('messages').insert({
      conversation_id: conversation.id,
      role: 'assistant',
      content: assistantMessage
    })

    // Analyze message for lead qualification
    const qualificationData = await analyzeForLeadQualification(
      message,
      conversationContext,
      assistantMessage
    )

    // Update conversation with qualification data
    if (qualificationData) {
      await supabaseAdmin
        .from('conversations')
        .update({
          lead_score: qualificationData.score,
          budget_range: qualificationData.budget,
          timeline: qualificationData.timeline,
          pain_points: qualificationData.painPoints,
          recommended_service: qualificationData.recommendedService,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversation.id)

      // Create lead if score is high enough
      if (qualificationData.score >= 60 && metadata?.email) {
        await createLead(conversation, metadata, qualificationData)
      }
    }

    // Track analytics
    await supabaseAdmin.from('analytics_events').insert({
      conversation_id: conversation.id,
      event_type: 'message_sent',
      event_data: {
        message_length: message.length,
        lead_score: qualificationData?.score || 0
      }
    })

    return NextResponse.json({
      response: assistantMessage,
      conversationId: conversation.id,
      metadata: {
        leadScore: qualificationData?.score || 0,
        recommendedService: qualificationData?.recommendedService
      }
    })

  } catch (error) {
    console.error('AI Chat Error:', error)
    return NextResponse.json(
      {
        error: 'Failed to process message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Helper: Search knowledge base for relevant context
async function searchKnowledge(query: string): Promise<string> {
  // For now, simple keyword matching
  // In production, this would use vector embeddings
  const queryLower = query.toLowerCase()

  let relevantCases: string[] = []

  if (queryLower.includes('restaurant') || queryLower.includes('food')) {
    relevantCases.push('Restaurant: 35% increase in bookings with AI chatbot')
  }
  if (queryLower.includes('hvac') || queryLower.includes('home service')) {
    relevantCases.push('HVAC: $80K revenue with voice AI call handling')
  }
  if (queryLower.includes('manufact') || queryLower.includes('quote')) {
    relevantCases.push('Manufacturing: 40% win rate increase with quote automation')
  }
  if (queryLower.includes('health') || queryLower.includes('medical') || queryLower.includes('doctor')) {
    relevantCases.push('Healthcare: 17% no-show reduction with automated scheduling')
  }
  if (queryLower.includes('ecommerce') || queryLower.includes('e-commerce') || queryLower.includes('online store')) {
    relevantCases.push('E-commerce: 45% increase in repeat purchases with automation')
  }

  return relevantCases.length > 0
    ? relevantCases.join('\n')
    : 'Multiple successful projects across industries'
}

// Helper: Analyze conversation for lead qualification
async function analyzeForLeadQualification(
  message: string,
  context: string,
  response: string
): Promise<any> {
  const messageLower = message.toLowerCase()
  const contextLower = context.toLowerCase()

  let score = 0
  let budget = undefined
  let timeline = undefined
  let painPoints: string[] = []
  let recommendedService = undefined

  // Budget signals
  if (messageLower.match(/\$?\d+k|\$\d+,\d+|budget|invest|spend/)) {
    if (messageLower.match(/50k|100k|six figures/)) {
      score += 40
      budget = '50k_plus'
    } else if (messageLower.match(/15k|20k|25k|30k|40k/)) {
      score += 30
      budget = '15k_to_50k'
    } else if (messageLower.match(/5k|10k/)) {
      score += 20
      budget = '5k_to_15k'
    }
  }

  // Timeline signals
  if (messageLower.match(/asap|urgent|immediately|this week|this month/)) {
    score += 30
    timeline = 'urgent'
  } else if (messageLower.match(/next month|soon|ready/)) {
    score += 20
    timeline = 'next_month'
  } else if (messageLower.match(/next quarter|Q\d|planning/)) {
    score += 10
    timeline = 'next_quarter'
  }

  // Authority signals
  if (messageLower.match(/owner|ceo|founder|president|director/)) {
    score += 25
  } else if (messageLower.match(/manager|vp|head of/)) {
    score += 15
  }

  // Pain level signals
  if (messageLower.match(/losing|costing|critical|major problem|desperate/)) {
    score += 20
    painPoints.push('high_urgency')
  }

  // Engagement signals
  if (message.length > 100) score += 5
  if (message.includes('?')) score += 5

  // Service recommendation based on context
  if (budget === '50k_plus' || timeline === 'urgent') {
    recommendedService = 'AI Implementation'
  } else if (budget === '15k_to_50k') {
    recommendedService = 'AI Strategy & Roadmap'
  } else if (contextLower.includes('explore') || contextLower.includes('learn')) {
    recommendedService = 'AI Audit'
  }

  return {
    score: Math.min(score, 100),
    budget,
    timeline,
    painPoints,
    recommendedService
  }
}

// Helper: Create qualified lead
async function createLead(conversation: any, metadata: any, qualificationData: any) {
  try {
    await supabaseAdmin.from('leads').insert({
      conversation_id: conversation.id,
      name: metadata.name || 'Unknown',
      email: metadata.email,
      company: metadata.company,
      phone: metadata.phone,
      service_interest: qualificationData.recommendedService,
      budget_range: qualificationData.budget,
      timeline: qualificationData.timeline,
      pain_points: qualificationData.painPoints,
      lead_score: qualificationData.score,
      status: 'new'
    })

    // Send notification email (if Resend is configured)
    if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes('placeholder')) {
      // Email logic will be added in next step
      console.log('Would send lead notification email here')
    }
  } catch (error) {
    console.error('Failed to create lead:', error)
  }
}
