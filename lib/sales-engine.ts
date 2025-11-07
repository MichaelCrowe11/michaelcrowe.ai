/**
 * High-Performance Sales Conversion Engine
 * 
 * Based on proven frameworks:
 * - AIDA (Attention, Interest, Desire, Action)
 * - PAS (Problem, Agitate, Solution)
 * - Cialdini's 6 Principles of Persuasion
 * - Neuromarketing triggers
 * - Conversational commitment escalation
 */

export type ConversationStage = 
  | 'initial-rapport'      // Build trust, mirror energy
  | 'pain-discovery'       // Uncover challenges
  | 'pain-amplification'   // Make problem feel urgent
  | 'solution-framing'     // Position as the answer
  | 'value-demonstration'  // Show ROI and proof
  | 'objection-handling'   // Address concerns
  | 'commitment-micro'     // Small yes (email, calendar view)
  | 'commitment-major'     // Schedule call/consultation
  | 'post-commitment'      // Reinforce decision

export type UserProfile = {
  stage: ConversationStage
  painPoints: string[]
  interests: string[]
  objections: string[]
  engagementScore: number // 0-100
  readyToBuy: number // 0-100
  lastInteraction: Date
  microCommitments: string[] // Email given, calendar viewed, etc.
}

export type PsychologicalTrigger = 
  | 'social-proof'    // Others have succeeded
  | 'scarcity'        // Limited availability
  | 'authority'       // Credentials and expertise
  | 'reciprocity'     // Give value first
  | 'commitment'      // Small yes leads to big yes
  | 'liking'          // Build rapport
  | 'urgency'         // Time-sensitive

export class SalesEngine {
  private userProfile: UserProfile

  constructor() {
    this.userProfile = {
      stage: 'initial-rapport',
      painPoints: [],
      interests: [],
      objections: [],
      engagementScore: 0,
      readyToBuy: 0,
      lastInteraction: new Date(),
      microCommitments: [],
    }
  }

  /**
   * Analyze user input and determine optimal response strategy
   */
  analyzeInput(input: string): {
    detectedIntent: string
    triggers: PsychologicalTrigger[]
    nextStage?: ConversationStage
    responseStrategy: string
  } {
    const lower = input.toLowerCase()

    // Detect pain points
    const painKeywords = ['problem', 'challenge', 'struggle', 'difficult', 'frustrated', 'stuck', 'help', 'issue']
    const hasPain = painKeywords.some(k => lower.includes(k))

    // Detect buying signals
    const buyingSignals = ['price', 'cost', 'how much', 'pricing', 'invest', 'budget', 'afford']
    const showsBuyingIntent = buyingSignals.some(k => lower.includes(k))

    // Detect objections
    const objectionKeywords = ['too expensive', 'can\'t afford', 'not sure', 'maybe later', 'think about', 'need time']
    const hasObjection = objectionKeywords.some(k => lower.includes(k))

    // Detect information seeking
    const infoKeywords = ['how', 'what', 'why', 'when', 'tell me', 'explain', 'show']
    const seekingInfo = infoKeywords.some(k => lower.includes(k))

    // Update engagement score
    this.userProfile.engagementScore = Math.min(100, this.userProfile.engagementScore + 5)
    this.userProfile.lastInteraction = new Date()

    // Determine strategy
    if (showsBuyingIntent) {
      this.userProfile.readyToBuy = Math.min(100, this.userProfile.readyToBuy + 25)
      return {
        detectedIntent: 'pricing-inquiry',
        triggers: ['scarcity', 'social-proof', 'authority'],
        nextStage: 'solution-framing',
        responseStrategy: 'position-value-before-price',
      }
    }

    if (hasPain) {
      this.userProfile.painPoints.push(input)
      return {
        detectedIntent: 'pain-expression',
        triggers: ['reciprocity', 'authority'],
        nextStage: 'pain-amplification',
        responseStrategy: 'empathize-and-amplify',
      }
    }

    if (hasObjection) {
      this.userProfile.objections.push(input)
      return {
        detectedIntent: 'objection',
        triggers: ['social-proof', 'scarcity'],
        nextStage: 'objection-handling',
        responseStrategy: 'reframe-objection',
      }
    }

    if (seekingInfo) {
      return {
        detectedIntent: 'information-seeking',
        triggers: ['authority', 'social-proof'],
        nextStage: 'value-demonstration',
        responseStrategy: 'educate-with-proof',
      }
    }

    // Default: build rapport
    return {
      detectedIntent: 'general-conversation',
      triggers: ['liking', 'reciprocity'],
      nextStage: 'pain-discovery',
      responseStrategy: 'build-rapport-discover-pain',
    }
  }

  /**
   * Generate high-converting response based on analysis
   */
  generateResponse(input: string, context?: string): string {
    const analysis = this.analyzeInput(input)
    const lower = input.toLowerCase()

    // PRICING INQUIRY - Position value before revealing price
    if (analysis.detectedIntent === 'pricing-inquiry') {
      return this.getPricingResponse(lower)
    }

    // PAIN EXPRESSION - Empathize and amplify urgency
    if (analysis.detectedIntent === 'pain-expression') {
      return this.getPainAmplificationResponse(lower)
    }

    // OBJECTION HANDLING - Reframe and provide social proof
    if (analysis.detectedIntent === 'objection') {
      return this.getObjectionResponse(lower)
    }

    // PORTFOLIO/WORK - Show authority and social proof
    if (lower.includes('portfolio') || lower.includes('work') || lower.includes('project') || lower.includes('example')) {
      return this.getPortfolioResponse()
    }

    // SERVICES - Frame solutions around outcomes
    if (lower.includes('service') || lower.includes('help') || lower.includes('do') || lower.includes('offer')) {
      return this.getServicesResponse()
    }

    // CONTACT/SCHEDULE - Micro-commitment ladder
    if (lower.includes('contact') || lower.includes('schedule') || lower.includes('call') || lower.includes('meeting') || lower.includes('book')) {
      return this.getCommitmentResponse()
    }

    // ABOUT/WHO - Establish authority and relatability
    if (lower.includes('who') || lower.includes('about') || lower.includes('you') || lower.includes('background')) {
      return this.getAboutResponse()
    }

    // GREETING - Warm welcome with pattern interrupt
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      return this.getGreetingResponse()
    }

    // DEFAULT - Discovery question
    return this.getDiscoveryResponse()
  }

  private getPricingResponse(input: string): string {
    // Value-first pricing strategy
    const responses = [
      "Great question! Before we dive into pricing, let me ask: what's the biggest bottleneck in your business right now? I want to make sure I show you the exact solution that'll move the needle. Here's the reality—my clients typically see 3-10x ROI within the first 6 months. I offer three tiers: **AI Consulting** ($2,500-5,000 for strategy), **Custom AI Development** ($10,000-50,000+ for production systems), and **Managed AI Services** ($3,000-10,000/month for ongoing optimization). Which challenge would make the biggest impact if we solved it together?",
      
      "I love that you're thinking about investment! Here's what I've learned: businesses that hesitate lose $10,000-100,000+ per year to inefficiency. My pricing reflects the value I deliver—not hourly rates. **Recent client**: a restaurant owner invested $15,000 in an AI chatbot, now saves 30 hours/week and captures $8,000/month in additional orders. That's a 6-week payback. For your situation, I'd need to understand your current pain points to recommend the right tier. What's costing you the most right now—time, money, or missed opportunities?",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  private getPainAmplificationResponse(input: string): string {
    return "I hear you—and I've seen this exact challenge crush businesses before they realize how much it's actually costing them. Here's the thing: every day you wait, the gap widens. Your competitors who implement AI now will have a 2-3 year advantage that'll be nearly impossible to close. I've helped businesses in your exact position turn frustration into their biggest competitive advantage. What would it mean for you if we could solve this in the next 30 days instead of letting it drag on another year?"
  }

  private getObjectionResponse(input: string): string {
    if (input.includes('expensive') || input.includes('afford') || input.includes('budget')) {
      return "I totally get it—nobody wants to overspend. But here's what I've learned: the real cost isn't my fee, it's what staying stuck costs you. One of my clients hesitated for 6 months because of budget concerns. When we finally worked together, she calculated she'd lost $47,000 in opportunity cost by waiting. The question isn't 'can I afford this?'—it's 'can I afford NOT to fix this?' What if I could show you exactly how this pays for itself in 90 days?"
    }

    if (input.includes('time') || input.includes('later') || input.includes('think about')) {
      return "I respect that you want to think it through—that shows you're strategic. But let me challenge you: how long have you been dealing with this challenge? Most people who say 'I need time' are still in the same spot 6 months later. Meanwhile, the bold ones who act fast are already seeing results. I have limited availability in the next 30 days. What if we just hopped on a quick 15-minute call to see if this is even the right fit? No pressure—just clarity. Worth 15 minutes?"
    }

    return "I hear your hesitation, and that's actually a good sign—it means you're thinking critically. Here's what I know: every successful business owner I work with had the same concerns before we started. Then they saw results. What's the real concern here? Let's address it head-on."
  }

  private getPortfolioResponse(): string {
    return "I've built AI systems across multiple industries—and every one delivers measurable ROI. **Restaurant chatbot**: 24/7 customer service, 40% increase in online orders, 30 hours/week saved. **Pharmaceutical AI**: Compressed 15-year drug discovery to 12 weeks using 150+ PhD-level agents. **E-commerce automation**: Cut manual work by 80%, boosted revenue 35%. **Manufacturing**: Automated quotes and scheduling, saving $100K+/year. The common thread? Every project focuses on *actual business results*, not just cool tech. What kind of outcome would transform your business?"
  }

  private getServicesResponse(): string {
    return "I offer three core services, each designed to drive real ROI: **1) AI Strategy & Consulting** ($2,500-5,000)—I'll audit your business, identify your biggest AI opportunities, and hand you a roadmap. Most clients find 5-10 areas to improve. **2) Custom AI Development** ($10,000-50,000+)—I build production-ready systems that actually work: chatbots, automation, analytics, recommendation engines. **3) Managed AI Services** ($3,000-10,000/month)—Ongoing optimization and support so your systems keep improving. Here's the key: I don't sell technology. I sell outcomes. What's the #1 problem you'd pay to solve?"
  }

  private getCommitmentResponse(): string {
    // Commitment ladder: email → calendar view → call booked
    return "I love your energy! Here's how we'll do this: I offer a **free 30-minute discovery call** where we'll dig into your biggest challenges and I'll show you exactly how AI can solve them. No pitch, no pressure—just value. Most people walk away with at least 3 actionable ideas even if we don't work together. Sound fair? **[Book a call now →](/contact)** or drop your email below and I'll send you my calendar link + a free AI readiness checklist worth $500."
  }

  private getAboutResponse(): string {
    return "I'm Michael Crowe—and I'm not your typical consultant. I'm a self-taught developer who built a business from scratch in a garage and scaled it to millions. I've coded AI systems that power real businesses: **CriOS Nova** (150+ PhD-level AI agents for drug discovery), **Southwest Mushrooms** ($470K/year with automation I built), and dozens of custom AI solutions. I don't theorize—I build, ship, and measure results. My philosophy: AI should make you money, not cost you money. If it doesn't deliver ROI in 6 months, I didn't do my job. What challenge are you facing that nobody else has been able to solve?"
  }

  private getGreetingResponse(): string {
    return "Hey! Michael Crowe here—great to meet you. I help small businesses implement AI that actually drives results, not just buzzwords. Most people come to me frustrated because they've tried tools that don't work or consultants who overcharge and underdeliver. I'm different: I build real systems that make you money. Quick question to get started: what's the biggest bottleneck in your business right now?"
  }

  private getDiscoveryResponse(): string {
    return "That's a great question! I specialize in building practical AI solutions for small businesses—things like 24/7 chatbots, automation systems, and analytics dashboards that actually increase revenue. Every solution is custom-built around your needs, not a cookie-cutter template. The businesses that succeed with me usually have one thing in common: they're tired of manual work eating their time and profits. Does that sound familiar? What's your biggest challenge right now?"
  }

  /**
   * Track micro-commitments (small yes → big yes)
   */
  recordMicroCommitment(commitment: string) {
    this.userProfile.microCommitments.push(commitment)
    this.userProfile.readyToBuy = Math.min(100, this.userProfile.readyToBuy + 10)
  }

  /**
   * Get current user profile for analytics
   */
  getProfile(): UserProfile {
    return { ...this.userProfile }
  }

  /**
   * Update conversation stage
   */
  advanceStage(stage: ConversationStage) {
    this.userProfile.stage = stage
  }
}

// Export singleton instance
export const salesEngine = new SalesEngine()
