"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DiamondButton } from "@/components/ui/diamond-button"
import { Code, MessageSquare, BarChart, Bot, Database, Workflow } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SkillDemo {
  id: string
  title: string
  category: string
  icon: React.ElementType
  description: string
  demoType: "code" | "chat" | "analytics" | "workflow"
  content: {
    preview: string
    details: string[]
    codeSnippet?: string
    chatExample?: { role: "user" | "ai"; message: string }[]
    metrics?: { label: string; value: string; change: string }[]
  }
}

export function InteractiveSkillsShowcase() {
  const [selectedDemo, setSelectedDemo] = useState<SkillDemo | null>(null)

  const skillDemos: SkillDemo[] = [
    {
      id: "ai-chatbot",
      title: "Custom AI Chatbot Development",
      category: "AI/ML",
      icon: MessageSquare,
      description: "Build intelligent chatbots that understand context and deliver accurate responses",
      demoType: "chat",
      content: {
        preview: "Customer service chatbot for a restaurant handling reservations and menu inquiries",
        details: [
          "Natural language understanding with GPT-4 and Claude",
          "Real-time availability checking and booking",
          "Menu knowledge and dietary restrictions",
          "Multi-platform integration (web, Facebook, Instagram)",
          "95%+ accuracy in customer intent recognition"
        ],
        chatExample: [
          { role: "user", message: "Do you have any vegan options for dinner tonight?" },
          { role: "ai", message: "Yes! We have several delicious vegan options available tonight. Our most popular dishes include:\n\n🥗 Mediterranean Quinoa Bowl - roasted vegetables, chickpeas, tahini dressing\n🍝 Vegan Carbonara - cashew cream sauce, mushroom bacon, fresh herbs\n🌮 Jackfruit Tacos - spiced jackfruit, avocado, cilantro lime slaw\n\nWould you like to make a reservation? I can check availability for you." },
          { role: "user", message: "The quinoa bowl sounds great! Table for 2 at 7pm?" },
          { role: "ai", message: "Perfect! I have availability for 2 guests tonight at 7:00 PM. May I have your name and phone number to confirm the reservation?" }
        ]
      }
    },
    {
      id: "automation-workflow",
      title: "Business Process Automation",
      category: "Automation",
      icon: Workflow,
      description: "Streamline repetitive tasks and integrate systems for maximum efficiency",
      demoType: "workflow",
      content: {
        preview: "Automated quote generation system for manufacturing business",
        details: [
          "Instant quote generation from customer specifications",
          "Real-time material cost calculation from supplier databases",
          "Historical data analysis for accurate labor estimates",
          "Automated pricing based on order size and margins",
          "CRM and ERP system integration",
          "Reduced quote time from 3 days to 3 minutes"
        ],
        metrics: [
          { label: "Quote Time", value: "3 min", change: "-98% from 3 days" },
          { label: "Win Rate", value: "+40%", change: "Faster response" },
          { label: "Capacity", value: "3x", change: "More quotes handled" },
          { label: "Accuracy", value: "99.8%", change: "+12% vs manual" }
        ]
      }
    },
    {
      id: "analytics-dashboard",
      title: "Real-Time Business Analytics",
      category: "Data Science",
      icon: BarChart,
      description: "Data-driven insights and dashboards for informed decision making",
      demoType: "analytics",
      content: {
        preview: "Executive dashboard showing real-time business performance metrics",
        details: [
          "Live revenue tracking across all channels",
          "Customer acquisition cost and lifetime value",
          "Product performance and inventory insights",
          "Predictive analytics for demand forecasting",
          "Automated reporting and alerts",
          "Mobile-responsive design for on-the-go access"
        ],
        metrics: [
          { label: "Monthly Revenue", value: "$487K", change: "+23% MoM" },
          { label: "Active Customers", value: "2,847", change: "+156 this week" },
          { label: "Avg Order Value", value: "$342", change: "+$67 vs last month" },
          { label: "Customer LTV", value: "$4,234", change: "+18% this quarter" }
        ]
      }
    },
    {
      id: "voice-ai",
      title: "Voice AI Phone Systems",
      category: "AI/ML",
      icon: Bot,
      description: "Natural-sounding AI phone systems that handle calls 24/7",
      demoType: "chat",
      content: {
        preview: "HVAC company voice AI handling emergency calls and scheduling",
        details: [
          "Natural voice interaction using advanced TTS and STT",
          "24/7 availability for emergency and routine calls",
          "Intelligent call routing based on urgency",
          "Direct appointment booking and confirmation",
          "Integration with technician schedules",
          "90% of calls handled without human intervention"
        ],
        chatExample: [
          { role: "user", message: "My AC stopped working and it's 95 degrees in here!" },
          { role: "ai", message: "I understand this is urgent - let me help you right away. I'm checking our emergency technician availability now... Good news! We can have a technician at your location within 2 hours. May I have your address to confirm service area and give you an exact arrival time?" },
          { role: "user", message: "Yes, I'm at 123 Oak Street" },
          { role: "ai", message: "Thank you! You're in our service area. I can schedule emergency technician Mike Johnson to arrive between 2:30-3:00 PM today. The emergency service call fee is $150, and any repairs will be quoted before work begins. Can I get your name and phone number to confirm this appointment?" }
        ]
      }
    },
    {
      id: "api-integration",
      title: "System Integration & APIs",
      category: "Backend",
      icon: Database,
      description: "Connect your business systems and eliminate manual data entry",
      demoType: "code",
      content: {
        preview: "Multi-system integration connecting CRM, accounting, and e-commerce platforms",
        details: [
          "Bi-directional sync between Shopify, QuickBooks, and Salesforce",
          "Real-time inventory updates across platforms",
          "Automated customer data sync and deduplication",
          "Order fulfillment workflow automation",
          "Error handling and conflict resolution",
          "Eliminated 15+ hours weekly of manual data entry"
        ],
        codeSnippet: `// Automated Order Sync Example
async function syncNewOrder(shopifyOrder) {
  // Create customer in CRM if new
  const customer = await salesforce.upsertCustomer({
    email: shopifyOrder.customer.email,
    name: shopifyOrder.customer.name,
    source: 'E-commerce'
  })

  // Create invoice in QuickBooks
  const invoice = await quickbooks.createInvoice({
    customer: customer.id,
    items: shopifyOrder.line_items.map(item => ({
      product: item.sku,
      quantity: item.quantity,
      price: item.price
    })),
    date: shopifyOrder.created_at
  })

  // Update inventory across all systems
  await Promise.all([
    shopify.updateInventory(orderItems),
    quickbooks.updateInventory(orderItems),
    salesforce.logOrderActivity(customer.id, invoice.id)
  ])

  // Send confirmation
  await sendOrderConfirmation(customer.email, invoice)
}`
      }
    },
    {
      id: "ml-model",
      title: "Custom Machine Learning Models",
      category: "AI/ML",
      icon: Code,
      description: "Purpose-built ML models trained on your specific business data",
      demoType: "code",
      content: {
        preview: "Product recommendation engine for e-commerce with 35% conversion lift",
        details: [
          "Collaborative filtering based on purchase history",
          "Content-based recommendations using product attributes",
          "Real-time personalization based on browsing behavior",
          "A/B testing framework for continuous optimization",
          "Edge deployment for sub-50ms response times",
          "35% increase in average order value"
        ],
        codeSnippet: `// Recommendation Engine Core Logic
class ProductRecommender {
  constructor(userHistory, catalog) {
    this.userHistory = userHistory
    this.catalog = catalog
    this.model = this.loadPretrainedModel()
  }

  async getRecommendations(userId, context = {}) {
    // Get user's purchase and browse history
    const userVector = await this.getUserEmbedding(userId)

    // Consider current context (cart, browsing)
    const contextVector = this.getContextEmbedding(context)

    // Combine signals with learned weights
    const combinedVector = this.combineVectors(
      userVector,
      contextVector
    )

    // Score all products
    const scored = this.catalog.map(product => ({
      product,
      score: this.similarityScore(
        combinedVector,
        product.embedding
      )
    }))

    // Return top 10 with business rules applied
    return this.applyBusinessRules(
      scored.sort((a, b) => b.score - a.score)
        .slice(0, 20)
    ).slice(0, 10)
  }
}`
      }
    }
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance text-glow-gold">
            Interactive <span className="text-prismatic">Skills Showcase</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore real-world examples of AI automation in action. Click any card to see detailed demonstrations and actual implementation examples.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {skillDemos.map((demo) => {
            const Icon = demo.icon
            return (
              <motion.div
                key={demo.id}
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className="premium-card cursor-pointer h-full hover:shadow-2xl transition-shadow duration-300"
                  onClick={() => setSelectedDemo(demo)}
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold/20 to-accent/20 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-gold" />
                      </div>
                      <div className="flex-1">
                        <Badge variant="secondary" className="mb-2 bg-gold/10 text-gold border-gold/20">
                          {demo.category}
                        </Badge>
                        <h3 className="font-bold text-lg mb-2 text-glow-gold">{demo.title}</h3>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {demo.description}
                    </p>
                    <div className="mt-4">
                      <DiamondButton size="sm" variant="outline" className="w-full">
                        View Demo →
                      </DiamondButton>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Demo Modal */}
        <AnimatePresence>
          {selectedDemo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedDemo(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-card border-2 diamond-border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold/20 to-accent/20 flex items-center justify-center">
                        <selectedDemo.icon className="w-8 h-8 text-gold" />
                      </div>
                      <div>
                        <Badge variant="secondary" className="mb-2 bg-gold/10 text-gold border-gold/20">
                          {selectedDemo.category}
                        </Badge>
                        <h3 className="text-2xl font-bold text-glow-gold mb-2">{selectedDemo.title}</h3>
                        <p className="text-muted-foreground">{selectedDemo.content.preview}</p>
                      </div>
                    </div>
                    <DiamondButton
                      variant="outline"
                      size="icon"
                      onClick={() => setSelectedDemo(null)}
                      className="shrink-0"
                    >
                      ✕
                    </DiamondButton>
                  </div>

                  {/* Details */}
                  <div className="mb-6">
                    <h4 className="font-bold text-lg mb-3 text-prismatic">Key Features</h4>
                    <ul className="grid md:grid-cols-2 gap-3">
                      {selectedDemo.content.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-gold mt-1">◆</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Demo Content */}
                  {selectedDemo.content.chatExample && (
                    <div className="mb-6">
                      <h4 className="font-bold text-lg mb-3 text-prismatic">Live Demo Example</h4>
                      <div className="bg-black/40 rounded-lg p-4 space-y-3">
                        {selectedDemo.content.chatExample.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg p-3 ${
                                msg.role === "user"
                                  ? "bg-accent/20 text-accent-foreground"
                                  : "bg-gold/10 text-foreground border border-gold/20"
                              }`}
                            >
                              <div className="text-xs font-semibold mb-1 opacity-60">
                                {msg.role === "user" ? "Customer" : "AI Assistant"}
                              </div>
                              <div className="text-sm whitespace-pre-line">{msg.message}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedDemo.content.metrics && (
                    <div className="mb-6">
                      <h4 className="font-bold text-lg mb-3 text-prismatic">Performance Metrics</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {selectedDemo.content.metrics.map((metric, idx) => (
                          <div key={idx} className="bg-gradient-to-br from-gold/5 to-accent/5 rounded-lg p-4 border border-gold/10">
                            <div className="text-xs text-muted-foreground mb-1">{metric.label}</div>
                            <div className="text-2xl font-bold text-glow-gold mb-1">{metric.value}</div>
                            <div className="text-xs text-green-400">{metric.change}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedDemo.content.codeSnippet && (
                    <div>
                      <h4 className="font-bold text-lg mb-3 text-prismatic">Code Example</h4>
                      <div className="bg-black rounded-lg p-4 overflow-x-auto">
                        <pre className="text-sm text-green-400 font-mono">
                          <code>{selectedDemo.content.codeSnippet}</code>
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
