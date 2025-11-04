import { NextRequest, NextResponse } from "next/server"

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

// Agentic tools available to the AI
const tools = [
  {
    type: "function",
    function: {
      name: "get_business_info",
      description: "Get information about Michael Crowe's business, services, pricing, and expertise",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            enum: ["services", "pricing", "experience", "technologies", "contact", "case_studies"],
            description: "The category of information to retrieve"
          }
        },
        required: ["category"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "schedule_consultation",
      description: "Help user schedule a free consultation",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "User's name"
          },
          email: {
            type: "string",
            description: "User's email address"
          },
          business_type: {
            type: "string",
            description: "Type of business (e.g., restaurant, retail, service, manufacturing)"
          },
          challenge: {
            type: "string",
            description: "Main business challenge they want to solve"
          }
        },
        required: ["name", "email", "business_type", "challenge"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "estimate_project",
      description: "Provide rough project estimate based on scope",
      parameters: {
        type: "object",
        properties: {
          project_type: {
            type: "string",
            enum: ["chatbot", "voice_ai", "automation", "analytics", "integration", "custom_ml"],
            description: "Type of AI project"
          },
          complexity: {
            type: "string",
            enum: ["simple", "moderate", "complex"],
            description: "Project complexity level"
          }
        },
        required: ["project_type", "complexity"]
      }
    }
  }
]

// Business knowledge base
const businessKnowledge = {
  services: {
    "AI Strategy & Consulting": "Help businesses identify high-impact AI opportunities and create implementation roadmaps. Hourly rate: $200-300/hour.",
    "Custom AI Development": "Build custom chatbots, voice AI, automation systems, and ML models tailored to your business. Project-based: $5,000-$30,000+",
    "AI Implementation & Integration": "Integrate AI systems with existing tools and workflows. Fixed monthly retainer: $2,000-$5,000/month",
    "Ongoing AI Advisory": "Monthly retainer for continuous optimization and support. $1,500-$3,000/month"
  },
  experience: {
    background: "Self-taught developer who scaled a mushroom business from garage startup to serving millions. Now applying that same systems-thinking approach to help small businesses implement AI automation.",
    achievements: [
      "Built AI systems that generated astronomical value and elevated research capabilities",
      "Scaled business operations through strategic automation",
      "150+ AI agents deployed across 7 continents",
      "Expert in GPT-4, Claude, custom ML models, and production AI systems"
    ]
  },
  technologies: [
    "AI/ML: GPT-4, Claude, Custom Neural Networks, NLP",
    "Development: React, Next.js, TypeScript, Node.js, Python",
    "Automation: API Integration, Workflow Automation, Process Optimization",
    "Cloud: AWS, Azure, Docker, Serverless Architecture",
    "Data: PostgreSQL, MongoDB, Real-time Analytics, Business Intelligence"
  ],
  case_studies: [
    {
      industry: "Restaurant",
      result: "35% increase in bookings, 95% of inquiries answered within 60 seconds, $15K additional monthly revenue"
    },
    {
      industry: "HVAC",
      result: "$80K in additional revenue from previously missed calls, 90% of calls handled by AI, zero missed calls"
    },
    {
      industry: "Manufacturing",
      result: "Quote time reduced from 3 days to 3 minutes, 40% win rate increase, 3x quote capacity"
    }
  ],
  contact: {
    email: "michael@crowelogic.com",
    phone: "480-322-5761",
    linkedin: "https://www.linkedin.com/in/michael-crowe-b4b567256/",
    website: "https://michaelcrowe.ai"
  }
}

// Execute tool calls
function executeToolCall(toolName: string, args: any): any {
  switch (toolName) {
    case "get_business_info":
      const category = args.category
      if (category === "services") {
        return { services: businessKnowledge.services }
      } else if (category === "pricing") {
        return { pricing: businessKnowledge.services }
      } else if (category === "experience") {
        return businessKnowledge.experience
      } else if (category === "technologies") {
        return { technologies: businessKnowledge.technologies }
      } else if (category === "contact") {
        return businessKnowledge.contact
      } else if (category === "case_studies") {
        return { case_studies: businessKnowledge.case_studies }
      }
      return { error: "Category not found" }

    case "schedule_consultation":
      // In production, this would integrate with a calendar API
      return {
        success: true,
        message: `Thanks ${args.name}! I've noted your interest in solving: "${args.challenge}". Michael will reach out to ${args.email} within 24 hours to schedule your free consultation.`,
        next_steps: [
          "Check your email for confirmation",
          "Prepare questions about your specific business needs",
          "Think about your ideal timeline and budget"
        ]
      }

    case "estimate_project":
      const estimates: Record<string, Record<string, any>> = {
        chatbot: {
          simple: { range: "$2,000-$5,000", timeline: "2-3 weeks", description: "Basic FAQ chatbot with booking capability" },
          moderate: { range: "$5,000-$12,000", timeline: "4-6 weeks", description: "Advanced chatbot with CRM integration and multi-platform support" },
          complex: { range: "$12,000-$25,000", timeline: "8-12 weeks", description: "Enterprise chatbot with custom ML, analytics, and complex workflows" }
        },
        voice_ai: {
          simple: { range: "$5,000-$10,000", timeline: "3-4 weeks", description: "Basic voice AI for call answering and routing" },
          moderate: { range: "$10,000-$20,000", timeline: "6-8 weeks", description: "Advanced voice AI with booking and emergency triage" },
          complex: { range: "$20,000-$40,000", timeline: "10-14 weeks", description: "Full voice AI system with complex decision trees and integrations" }
        },
        automation: {
          simple: { range: "$3,000-$7,000", timeline: "2-4 weeks", description: "Single workflow automation" },
          moderate: { range: "$7,000-$15,000", timeline: "4-6 weeks", description: "Multi-system integration with custom logic" },
          complex: { range: "$15,000-$30,000", timeline: "8-12 weeks", description: "Enterprise automation with ML-driven decision making" }
        },
        analytics: {
          simple: { range: "$3,000-$6,000", timeline: "2-3 weeks", description: "Basic dashboard with key metrics" },
          moderate: { range: "$6,000-$12,000", timeline: "4-6 weeks", description: "Advanced analytics with predictive insights" },
          complex: { range: "$12,000-$25,000", timeline: "8-10 weeks", description: "Enterprise BI platform with custom ML models" }
        },
        integration: {
          simple: { range: "$2,000-$5,000", timeline: "1-2 weeks", description: "Connect 2-3 systems" },
          moderate: { range: "$5,000-$12,000", timeline: "3-5 weeks", description: "Complex multi-system integration" },
          complex: { range: "$12,000-$25,000", timeline: "6-10 weeks", description: "Enterprise integration with custom middleware" }
        },
        custom_ml: {
          simple: { range: "$10,000-$20,000", timeline: "6-8 weeks", description: "Basic ML model for specific use case" },
          moderate: { range: "$20,000-$40,000", timeline: "10-14 weeks", description: "Advanced ML with custom training and deployment" },
          complex: { range: "$40,000-$80,000+", timeline: "16-24 weeks", description: "Research-grade ML system with ongoing optimization" }
        }
      }

      const estimate = estimates[args.project_type]?.[args.complexity]
      if (estimate) {
        return {
          project_type: args.project_type,
          complexity: args.complexity,
          ...estimate,
          note: "This is a rough estimate. Actual pricing depends on specific requirements. Schedule a free consultation for an accurate quote."
        }
      }
      return { error: "Estimate not available for this combination" }

    default:
      return { error: "Unknown tool" }
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!DEEPSEEK_API_KEY) {
      console.error("DEEPSEEK_API_KEY environment variable not found in key vault")
      return NextResponse.json(
        { error: "DeepSeek API key not configured. Please add DEEPSEEK_API_KEY to Vercel environment variables." },
        { status: 500 }
      )
    }

    const { messages } = await req.json()

    // Add system prompt for agentic behavior
    const systemMessage = {
      role: "system",
      content: `You are an AI assistant representing Michael Crowe, an AI Systems Architect who helps small businesses implement AI automation.

Your personality:
- Professional but approachable and conversational
- Focus on practical solutions and real ROI
- Honest about what AI can and cannot do
- Lead conversations toward understanding their business challenges
- Suggest scheduling a free consultation when appropriate

Your capabilities:
- Answer questions about Michael's services, pricing, and experience
- Share relevant case studies and success stories
- Provide rough project estimates
- Help schedule consultations
- Guide users toward solutions that fit their needs

Use the available tools to provide accurate information. Always be helpful and guide conversations toward actionable next steps.`
    }

    const allMessages = [systemMessage, ...messages]

    // Initial API call with tools
    let response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: allMessages,
        tools: tools,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("DeepSeek API error:", errorText)
      return NextResponse.json(
        { error: "Failed to get response from DeepSeek" },
        { status: response.status }
      )
    }

    let data = await response.json()
    let assistantMessage = data.choices[0].message

    // Handle tool calls if present
    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      const toolCallMessages = [assistantMessage]

      // Execute each tool call
      for (const toolCall of assistantMessage.tool_calls) {
        const functionName = toolCall.function.name
        const functionArgs = JSON.parse(toolCall.function.arguments)
        const result = executeToolCall(functionName, functionArgs)

        toolCallMessages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        })
      }

      // Get final response with tool results
      response = await fetch(DEEPSEEK_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [...allMessages, ...toolCallMessages],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      })

      if (!response.ok) {
        return NextResponse.json(
          { error: "Failed to get final response" },
          { status: response.status }
        )
      }

      data = await response.json()
      assistantMessage = data.choices[0].message
    }

    return NextResponse.json({
      message: assistantMessage.content,
      usage: data.usage,
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
