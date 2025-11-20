/**
 * AI Sales Assistant Configuration
 * Defines personality, conversation flows, and lead qualification logic
 */

export const AI_PERSONALITY = `You are Michael Crowe's AI sales assistant. You help qualify leads and book discovery calls for his AI consulting business.

PERSONALITY TRAITS:
- Professional but conversational
- Genuinely curious about their business challenges
- Confident in showcasing expertise without being pushy
- Focus on value and ROI, not just features
- Use specific numbers and results from case studies

YOUR ROLE:
1. Engage visitors in natural conversation
2. Understand their business and pain points
3. Match them with the right service
4. Qualify leads (budget, timeline, authority)
5. Book discovery calls when appropriate
6. Always be helpful, even if they're not a fit

CONVERSATION GUIDELINES:
- Ask one question at a time
- Listen more than you talk
- Use their industry language
- Reference relevant case studies
- Be honest about fit
- Create urgency without being salesy`

export const SERVICES_INFO = {
  "AI Audit": {
    price: "$5,000",
    duration: "1 week",
    ideal_for: "Exploring AI opportunities",
    deliverables: ["Top 3 automation opportunities", "ROI projections", "Implementation roadmap"],
    qualifying_questions: [
      "What's your biggest operational bottleneck right now?",
      "Have you explored AI solutions before?",
      "What would a successful outcome look like for you?"
    ]
  },
  "Discovery Intensive": {
    price: "$7,500",
    duration: "3 days",
    ideal_for: "Deep-dive assessment",
    deliverables: ["Process documentation", "AI strategy", "Vendor recommendations"],
    qualifying_questions: [
      "Which specific process are you looking to automate?",
      "What's this inefficiency costing you monthly?",
      "Do you have internal buy-in for AI initiatives?"
    ]
  },
  "AI Strategy & Roadmap": {
    price: "$15,000",
    duration: "2 weeks",
    ideal_for: "Companies ready to implement",
    deliverables: ["6-month AI roadmap", "Tech stack recommendations", "Team training plan"],
    qualifying_questions: [
      "What's your budget for AI implementation this year?",
      "Do you have technical resources in-house?",
      "What's your timeline for getting started?"
    ]
  },
  "AI Implementation": {
    price: "$45,000+",
    duration: "6 weeks",
    ideal_for: "Ready to build",
    deliverables: ["Custom AI system", "Integration", "Training", "Support"],
    qualifying_questions: [
      "What's the specific use case you want to build?",
      "What's your annual revenue? (ensures fit)",
      "Do you have stakeholder approval for this investment?"
    ]
  },
  "Executive Advisory": {
    price: "$15,000/month",
    duration: "6-month minimum",
    ideal_for: "Ongoing strategic support",
    deliverables: ["Monthly strategy sessions", "On-demand consulting", "Team enablement"],
    qualifying_questions: [
      "Are you looking for ongoing strategic guidance?",
      "What's your company's growth trajectory?",
      "Do you need help beyond just implementation?"
    ]
  }
}

export const CASE_STUDIES = {
  restaurant: {
    industry: "Restaurant/Hospitality",
    result: "35% increase in bookings",
    solution: "AI-powered reservation chatbot",
    budget_range: "$15K-45K",
    relevant_for: ["AI Implementation", "AI Strategy & Roadmap"]
  },
  hvac: {
    industry: "HVAC/Home Services",
    result: "$80,000 in new revenue",
    solution: "Voice AI for customer calls",
    budget_range: "$45K+",
    relevant_for: ["AI Implementation", "Executive Advisory"]
  },
  manufacturing: {
    industry: "Manufacturing",
    result: "40% increase in quote win rate",
    solution: "Automated quoting system",
    budget_range: "$45K+",
    relevant_for: ["AI Implementation", "Executive Advisory"]
  },
  healthcare: {
    industry: "Healthcare/Medical",
    result: "17% reduction in no-shows",
    solution: "Automated scheduling and reminders",
    budget_range: "$45K+",
    relevant_for: ["AI Implementation", "AI Strategy & Roadmap"]
  },
  ecommerce: {
    industry: "E-commerce",
    result: "45% increase in repeat purchases",
    solution: "Marketing automation and personalization",
    budget_range: "$15K-45K",
    relevant_for: ["AI Strategy & Roadmap", "AI Implementation"]
  },
  construction: {
    industry: "Construction",
    result: "$50,000 in cost savings",
    solution: "Financial dashboard and reporting",
    budget_range: "$45K+",
    relevant_for: ["Executive Advisory", "AI Implementation"]
  }
}

export const LEAD_SCORING_RULES = {
  budget: {
    "under_5k": 10,
    "5k_to_15k": 40,
    "15k_to_50k": 70,
    "50k_plus": 100
  },
  timeline: {
    "exploring": 20,
    "next_quarter": 50,
    "next_month": 80,
    "urgent": 100
  },
  authority: {
    "individual_contributor": 20,
    "manager": 50,
    "director": 70,
    "c_level_or_owner": 100
  },
  pain_level: {
    "minor_annoyance": 20,
    "significant_issue": 60,
    "critical_problem": 100
  }
}

export const CONVERSATION_FLOWS = {
  greeting: [
    "Hi! I'm Michael's AI assistant. I help businesses discover how AI can solve their operational challenges. What brings you here today?",
    "Hello! I work with Michael to help companies implement AI automation. What's your biggest business challenge right now?",
    "Hey there! I'm here to help you explore AI solutions for your business. What industry are you in?"
  ],
  industry_questions: {
    restaurant: "Restaurants often struggle with reservations, customer service, or marketing. Which is your biggest headache?",
    healthcare: "Medical practices typically need help with scheduling, no-shows, or administrative tasks. What's costing you the most time?",
    manufacturing: "Manufacturers often need better quoting, inventory management, or quality control. Where's your bottleneck?",
    ecommerce: "E-commerce businesses usually want to improve conversion, customer retention, or operations. What's your focus?",
    "default": "Every business has unique challenges. What process takes up too much of your team's time?"
  },
  budget_qualification: [
    "To recommend the right solution, it helps to know your budget range. Are you thinking under $10K, $10-50K, or $50K+?",
    "AI projects can range from $5K audits to $100K+ implementations. What budget are you working with?",
    "What's your expected investment for solving this problem? Just ballpark is fine."
  ],
  timeline_qualification: [
    "When are you looking to get started? Next week, next month, or next quarter?",
    "What's driving your timeline? Is this urgent or more exploratory?",
    "How soon do you need this solved?"
  ],
  booking_cta: [
    "Based on what you've shared, I think a 30-minute discovery call with Michael would be valuable. He can show you exactly how we'd solve this. Want to book a time?",
    "You sound like a great fit for [SERVICE_NAME]. Michael can walk through a specific solution in a free 30-min call. Should I book you in?",
    "I'd love to get Michael's input on this - he's helped [SIMILAR_COMPANY] with the exact same challenge. Can I grab you a spot on his calendar?"
  ],
  objection_handling: {
    price: "I totally understand budget is a consideration. The average ROI on our projects is 5-10x within the first year. For example, [CASE_STUDY_RESULT]. Want to explore if the numbers work for you?",
    timing: "No pressure at all! Would it be helpful to book a call for when your timeline is clearer? That way Michael can answer questions before you're ready to pull the trigger.",
    authority: "Makes sense - big decisions need stakeholder buy-in. Michael is great at creating business cases that help get internal approval. Want to schedule a call to build that case together?",
    fit: "I appreciate you being upfront. Even if we're not the right fit, I'd be happy to point you toward resources that might help. What would be most valuable?"
  }
}

export const QUALIFYING_QUESTIONS = {
  business_info: [
    "What industry are you in?",
    "What's your role at the company?",
    "How many employees do you have?"
  ],
  pain_discovery: [
    "What's your biggest operational challenge right now?",
    "What's this problem costing you in terms of time or money?",
    "Have you tried other solutions? What didn't work?"
  ],
  budget_authority: [
    "What's your budget range for this project?",
    "Are you the decision-maker, or do others need to be involved?",
    "What would make this a no-brainer investment?"
  ],
  timeline_urgency: [
    "When do you need this solved by?",
    "What happens if this doesn't get fixed?",
    "Is there a specific event or deadline driving this?"
  ]
}

export const KNOWLEDGE_BASE_SOURCES = {
  portfolio: [
    "Southwest Mushrooms: Scaled e-commerce from garage to $470K annually serving 7 continents with automation",
    "CriOS Nova: 150+ PhD-level AI agents compressing drug discovery from 10 years to 90 days",
    "Crowe Logic AI: Framework powering multiple production systems with enterprise-grade reasoning",
    "Restaurant AI Chatbot: Increased bookings by 35% with automated reservation system",
    "HVAC Voice AI: Generated $80K in new revenue with intelligent call handling",
    "Manufacturing Quote Automation: 40% increase in win rate with automated quoting system",
    "Medical Scheduling: 17% reduction in no-shows with AI-powered scheduling and reminders",
    "E-commerce Marketing: 45% increase in repeat purchases with personalization and automation",
    "Construction Financial Dashboard: $50K in annual savings with automated reporting and insights"
  ],
  expertise: [
    "AI Strategy and Roadmapping for small to medium businesses",
    "Custom AI agent development with Claude, GPT-4, and other LLMs",
    "Retrieval Augmented Generation (RAG) systems for knowledge management",
    "Voice AI and conversational interfaces for customer service",
    "Marketing automation and lead generation systems",
    "Process automation and operational efficiency improvements",
    "Healthcare AI with HIPAA compliance expertise",
    "E-commerce optimization and personalization",
    "Manufacturing and supply chain automation",
    "Financial dashboards and business intelligence"
  ],
  methodology: [
    "Discovery-first approach: Understanding before building",
    "ROI-focused solutions: Every project must have clear business value",
    "Rapid prototyping: Get to working solution in weeks, not months",
    "Training and enablement: Your team owns the solution",
    "Ethical AI: Transparent, explainable, and responsible systems",
    "Iterative improvement: Launch fast, improve continuously"
  ]
}

// Development mode mock responses (when API keys aren't configured)
export const DEV_MODE_RESPONSES = {
  enabled: process.env.NEXT_PUBLIC_DEV_MODE === 'true',
  responses: [
    "That's a great question! In development mode, I'd search Michael's case studies to find relevant examples. For instance, if you're in restaurants, I'd share how we increased bookings by 35%.",
    "I'm running in demo mode right now, but in production I use AI to understand your needs and match you with the perfect service. What industry are you in?",
    "Thanks for sharing! In the real version, I'd now qualify your budget and timeline to recommend whether the $5K AI Audit or the $45K Implementation makes more sense for you.",
    "[DEV MODE] This is where I'd book a discovery call using Cal.com integration. Want to see the admin dashboard instead?"
  ]
}
