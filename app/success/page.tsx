"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle2, Calendar, Mail, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [loading, setLoading] = useState(true)
  const [sessionData, setSessionData] = useState<any>(null)

  useEffect(() => {
    if (sessionId) {
      // In production, fetch session details from Stripe
      // For now, show success message
      setLoading(false)
    }
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
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
        {/* Success Card */}
        <div className="glass-card rounded-2xl p-8 md:p-12 text-center border-2 border-gold/30">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-full mb-6"
          >
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </motion.div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-bold gradient-text-simple mb-4">
            Payment Successful!
          </h1>

          <p className="text-xl text-muted-foreground mb-8">
            Thank you for your investment. You're one step closer to transforming your business with AI.
          </p>

          {/* Next Steps */}
          <div className="bg-muted/30 rounded-xl p-6 mb-8 text-left">
            <h2 className="text-xl font-bold glow-text mb-4 flex items-center gap-2">
              <span className="text-2xl">🎯</span> What Happens Next
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Confirmation Email</p>
                  <p className="text-sm text-muted-foreground">
                    You'll receive a detailed confirmation email within 5 minutes with your invoice and next steps.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Schedule Kickoff</p>
                  <p className="text-sm text-muted-foreground">
                    Michael will reach out within 24 hours to schedule your kickoff call. Check your email for a calendar link.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Preparation Materials</p>
                  <p className="text-sm text-muted-foreground">
                    You'll receive a pre-engagement questionnaire to help maximize the value of your session.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          {sessionId && (
            <div className="text-sm text-muted-foreground mb-6 p-4 bg-muted/20 rounded-lg">
              <p>Transaction ID: <span className="font-mono text-xs">{sessionId}</span></p>
              <p className="mt-1">Keep this for your records</p>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="glass-button group">
              <Link href="/" className="flex items-center gap-2">
                <span>Return Home</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline" className="border-gold/30 hover:border-gold">
              <Link href="/contact">
                Contact Support
              </Link>
            </Button>
          </div>

          {/* Support Note */}
          <p className="text-sm text-muted-foreground mt-8 pt-8 border-t border-border/50">
            Questions? Email <a href="mailto:michael@crowelogic.com" className="text-gold hover:underline">michael@crowelogic.com</a> or call <a href="tel:+14803225761" className="text-gold hover:underline">480-322-5761</a>
          </p>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span>Secure payment processed by Stripe</span>
          </div>
        </motion.div>
      </motion.div>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
