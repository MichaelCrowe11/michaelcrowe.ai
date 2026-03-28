import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
})

// Product catalog with pricing
const PRODUCTS = {
  "ai-audit": {
    name: "AI Audit",
    price: 500000, // $5,000 in cents
    description: "1-week async audit of your operations with AI opportunity identification",
    features: [
      "Async audit of current operations",
      "Video walkthrough of 3-5 AI opportunities",
      "Prioritization matrix (effort vs. impact)",
      "60-minute live Q&A"
    ]
  },
  "discovery-intensive": {
    name: "Discovery Intensive",
    price: 750000, // $7,500 in cents
    description: "3 full days of deep-dive consultation with proof-of-concept",
    features: [
      "3 full days of deep-dive consultation",
      "Immediate AI opportunity identification",
      "Quick-win implementation plan",
      "Proof-of-concept for one automation",
      "Fully credited toward Implementation Intensive if upgraded within 30 days"
    ]
  },
  "strategy-roadmap": {
    name: "AI Strategy & Roadmap",
    price: 1500000, // $15,000 in cents
    description: "2-week comprehensive AI strategy and implementation roadmap",
    features: [
      "Full business & technical audit (2-3 days deep dive)",
      "Custom AI strategy aligned with your business goals",
      "Detailed 25-page implementation roadmap with ROI projections",
      "Technology stack recommendations",
      "Build vs. buy analysis",
      "2-hour executive presentation",
      "90 days of strategic support"
    ]
  },
  "implementation-intensive": {
    name: "AI Implementation Intensive",
    price: 4500000, // $45,000 in cents
    description: "6-week intensive: 5-7 automations built and deployed",
    features: [
      "Everything in Strategy & Roadmap, PLUS:",
      "Custom AI solution architecture leveraging Crowe Logic methodology",
      "5-7 high-impact automations built and deployed",
      "Integration with existing enterprise systems",
      "Team training and documentation",
      "60 days post-launch optimization",
      "Direct access to Michael throughout"
    ]
  },
  "strategy-session": {
    name: "Strategy Session",
    price: 50000, // $500 in cents (per hour, minimum 2 hours)
    description: "Architecture planning and technical consultation",
    features: [
      "$500/hour strategy consultation",
      "2 hour minimum",
      "Architecture planning",
      "Technical guidance",
      "Can be applied toward larger engagements"
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

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: product.description,
              metadata: {
                features: product.features.join(", ")
              }
            },
            unit_amount: product.price,
          },
          quantity,
        },
      ],
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
          message: "You'll receive a confirmation email with next steps after payment."
        }
      }
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
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

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
