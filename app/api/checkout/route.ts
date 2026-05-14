import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

// Lazy initialization - only create Stripe instance when needed
let stripeInstance: Stripe | null = null
function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY not configured")
    }
    stripeInstance = new Stripe(key, {
      apiVersion: "2024-12-18.acacia",
    })
  }
  return stripeInstance
}

// Product catalog with high-converting pricing & psychology
const PRODUCTS = {
  "ai-roadmap-call": {
    name: "AI Roadmap Intensive",
    price: 250000, // $2,500 in cents
    description: "90-min strategy call + 25-page custom AI roadmap delivered in 7 days",
    mode: "payment" as const,
    features: [
      "90-minute deep-dive strategy call with Michael",
      "Custom 25-page AI implementation roadmap (7-day delivery)",
      "Prioritized list of 5-7 high-ROI AI opportunities",
      "Technology stack recommendations + build vs. buy analysis",
      "ROI projections with conservative and aggressive scenarios",
      "30-day Slack access for follow-up questions",
      "100% credited toward AI System Sprint if upgraded within 30 days"
    ]
  },
  "ai-system-sprint": {
    name: "AI System Sprint",
    price: 2500000, // $25,000 in cents
    description: "One production-ready AI system built and deployed in 4 weeks",
    mode: "payment" as const,
    features: [
      "Discovery sprint: Define system, KPIs, integration points (Week 1)",
      "Custom AI architecture using Crowe Logic methodology",
      "Production-grade build with monitoring & error handling",
      "Full integration with existing tools (CRM, ERP, comms)",
      "Team training: 2 sessions for adoption",
      "60 days post-launch optimization included",
      "Direct Slack access to Michael throughout",
      "Lifetime access to source code"
    ]
  },
  "crowe-logic-implementation": {
    name: "Crowe Logic Implementation",
    price: 7500000, // $75,000 in cents
    description: "Complete AI transformation: 5-7 connected systems in 12 weeks",
    mode: "payment" as const,
    features: [
      "Full enterprise AI architecture design",
      "5-7 production AI systems built and integrated",
      "Crowe Logic agent orchestration framework",
      "Enterprise integrations (Salesforce, HubSpot, custom APIs)",
      "Team training: 6 sessions with leadership and operators",
      "Quarterly optimization included for 12 months",
      "Priority access (12hr response) for 6 months",
      "Co-development of internal AI playbook"
    ]
  },
  "executive-ai-partnership": {
    name: "Executive AI Partnership",
    price: 1500000, // $15,000/month in cents
    description: "Fractional Chief AI Officer - monthly partnership (6-month minimum)",
    mode: "subscription" as const,
    recurring: { interval: "month" as const },
    features: [
      "20 hours/month of strategic guidance",
      "Weekly 60-min executive sessions",
      "Unlimited async access (Slack, 12hr SLA)",
      "Board-level AI presentations and reporting",
      "Vendor evaluation and contract negotiation support",
      "Network introductions",
      "Quarterly AI strategy reviews",
      "First-call rights on new implementation projects"
    ]
  },
  "ai-audit": {
    name: "AI Opportunity Audit",
    price: 500000, // $5,000 in cents
    description: "1-week async audit identifying 3-5 highest-ROI AI opportunities",
    mode: "payment" as const,
    features: [
      "Async audit of current operations",
      "Video walkthrough of 3-5 AI opportunities specific to your business",
      "Prioritization matrix (effort vs. impact)",
      "Implementation cost & ROI estimates",
      "60-minute live Q&A session",
      "30-day email support for clarifications"
    ]
  },
  "ai-playbook": {
    name: "The Crowe Logic Playbook",
    price: 199700, // $1,997 in cents
    description: "Self-paced course: The exact framework I use with $25K+ clients",
    mode: "payment" as const,
    features: [
      "12-hour video course (10 modules)",
      "All templates, prompts, and frameworks",
      "Lifetime access + updates",
      "Private community access",
      "Monthly office hours with Michael",
      "Certificate of completion",
      "30-day money-back guarantee"
    ]
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables." },
        { status: 500 }
      )
    }

    const { productId, quantity = 1, customerInfo } = await req.json()

    if (!productId || !PRODUCTS[productId as keyof typeof PRODUCTS]) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      )
    }

    const product = PRODUCTS[productId as keyof typeof PRODUCTS]
    const origin = req.headers.get("origin") || "https://michaelcrowe.ai"
    const isSubscription = product.mode === "subscription"

    // Build line items - subscriptions need recurring config
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description,
            metadata: {
              features: product.features.join(" | ")
            }
          },
          unit_amount: product.price,
          ...(isSubscription && "recurring" in product
            ? { recurring: { interval: product.recurring!.interval } }
            : {}),
        },
        quantity,
      },
    ]

    // Create Stripe Checkout Session
    const session = await getStripe().checkout.sessions.create({
      mode: isSubscription ? "subscription" : "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      customer_email: customerInfo?.email,
      metadata: {
        productId,
        customerName: customerInfo?.name || "",
        customerCompany: customerInfo?.company || "",
        customerPhone: customerInfo?.phone || "",
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}?canceled=true`,
      allow_promotion_codes: true,
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
      custom_text: {
        submit: {
          message: isSubscription
            ? "You'll receive a welcome email with onboarding details after subscription is created."
            : "You'll receive a confirmation email with next steps after payment."
        }
      },
      ...(isSubscription
        ? {
            subscription_data: {
              metadata: { productId },
            },
          }
        : {}),
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}

// Webhook handler for Stripe events
export async function WEBHOOK(req: NextRequest) {
  const signature = req.headers.get("stripe-signature")
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 }
    )
  }

  try {
    const body = await req.text()
    const event = getStripe().webhooks.constructEvent(body, signature, webhookSecret)

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        // TODO: Save to database/CRM
        console.log("Payment successful:", {
          sessionId: session.id,
          customerEmail: session.customer_email,
          amount: session.amount_total,
          productId: session.metadata?.productId,
        })

        // TODO: Send confirmation email via Resend
        // TODO: Create HubSpot deal
        // TODO: Add to calendar if consultation

        break
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log("Payment intent succeeded:", paymentIntent.id)
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log("Payment failed:", paymentIntent.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 }
    )
  }
}
