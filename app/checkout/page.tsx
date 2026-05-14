"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { motion } from "framer-motion"
import { CreditCard, Shield, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

function CheckoutContent() {
  const searchParams = useSearchParams()
  const productId = searchParams.get("product")
  const email = searchParams.get("email")
  const name = searchParams.get("name")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const products: Record<string, { name: string; price: string; description: string }> = {
    "ai-audit": {
      name: "AI Audit",
      price: "$5,000",
      description: "1-week async audit with AI opportunity identification"
    },
    "discovery-intensive": {
      name: "Discovery Intensive",
      price: "$7,500",
      description: "3 days of deep-dive consultation with proof-of-concept"
    },
    "strategy-roadmap": {
      name: "AI Strategy & Roadmap",
      price: "$15,000",
      description: "2-week comprehensive strategy and implementation plan"
    },
    "implementation-intensive": {
      name: "AI Implementation Intensive",
      price: "$45,000",
      description: "6-week intensive: 5-7 automations built and deployed"
    },
    "strategy-session": {
      name: "Strategy Session",
      price: "$1,000",
      description: "2-hour strategy consultation with Michael Crowe"
    }
  }

  const product = productId && products[productId] ? products[productId] : null

  const handleCheckout = async () => {
    if (!productId || !product) {
      setError("Invalid product selection")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          customerInfo: {
            email: email || undefined,
            name: name || undefined,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session")
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error("Checkout error:", err)
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-card rounded-2xl p-8 text-center border-2 border-destructive/30">
          <h1 className="text-2xl font-bold text-destructive mb-4">Invalid Product</h1>
          <p className="text-muted-foreground mb-6">
            The product you're trying to purchase could not be found.
          </p>
          <Button asChild>
            <a href="/">Return Home</a>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        {/* Checkout Card */}
        <div className="glass-card rounded-2xl p-8 md:p-12 border-2 border-gold/30">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold gradient-text-simple mb-3">
              Complete Your Purchase
            </h1>
            <p className="text-muted-foreground">
              You're one step away from transforming your business with AI
            </p>
          </div>

          {/* Product Details */}
          <div className="bg-muted/30 rounded-xl p-6 mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold glow-text mb-2">{product.name}</h2>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gold">{product.price}</div>
                <div className="text-sm text-muted-foreground">One-time payment</div>
              </div>
            </div>

            {/* Customer Info */}
            {(name || email) && (
              <div className="pt-4 border-t border-border/50 space-y-2">
                {name && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Name:</span>{" "}
                    <span className="text-foreground font-medium">{decodeURIComponent(name)}</span>
                  </div>
                )}
                {email && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Email:</span>{" "}
                    <span className="text-foreground font-medium">{decodeURIComponent(email)}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-3 p-4 bg-muted/20 rounded-lg">
              <Shield className="w-5 h-5 text-gold flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold text-foreground">Secure Payment</div>
                <div className="text-xs text-muted-foreground">Powered by Stripe</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted/20 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold text-foreground">Instant Confirmation</div>
                <div className="text-xs text-muted-foreground">Email receipt</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted/20 rounded-lg">
              <CreditCard className="w-5 h-5 text-gold flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold text-foreground">Flexible Billing</div>
                <div className="text-xs text-muted-foreground">All major cards</div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Checkout Button */}
          <Button
            onClick={handleCheckout}
            disabled={loading}
            size="lg"
            className="w-full bg-gradient-to-r from-gold to-gold-secondary hover:from-gold/90 hover:to-gold-secondary/90 text-gold-foreground font-semibold h-14 text-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Redirecting to Stripe...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                Proceed to Secure Checkout
              </>
            )}
          </Button>

          {/* Fine Print */}
          <p className="text-xs text-center text-muted-foreground mt-6">
            You will be redirected to Stripe's secure checkout page. By completing this purchase,
            you agree to our terms of service.
          </p>

          {/* Support */}
          <div className="mt-8 pt-8 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground mb-2">Questions before purchasing?</p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <a href="mailto:michael@crowelogic.com" className="text-gold hover:underline">
                Email Support
              </a>
              <span className="text-muted-foreground">•</span>
              <a href="tel:+14803225761" className="text-gold hover:underline">
                480-322-5761
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  )
}
