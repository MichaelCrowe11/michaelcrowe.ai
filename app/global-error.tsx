"use client"

import Link from 'next/link'
import { useEffect } from 'react'
import { logError, logEvent } from '@/lib/observability'

// Global error boundary UI (App Router)
// Renders when an uncaught error occurs anywhere in the app tree.
export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    logError(error, 'global-error')
  }, [error])

  useEffect(() => {
    logEvent('global-error-shown')
  }, [])

  return (
    <html>
      <body className="min-h-dvh bg-black text-white">
        <div className="fixed inset-0 -z-10" />
        <div className="flex min-h-dvh items-center justify-center p-6">
          <div className="max-w-lg w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-[0_0_40px_rgba(218,165,32,0.08)]">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" />
              <h1 className="text-lg font-semibold text-gold">Unexpected hiccup</h1>
            </div>
            <p className="mt-3 text-sm text-white/70">
              Something went off-orbit. You can try again or continue to the homepage while we keep an eye on telemetry.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => reset()}
                className="inline-flex items-center gap-2 rounded-md border border-gold/40 px-3 py-1.5 text-sm text-gold hover:bg-gold/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
              >
                Try again
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-md bg-gold/90 px-3 py-1.5 text-sm text-black hover:bg-gold"
              >
                Go home
              </Link>
            </div>
            <div className="mt-4 text-xs text-white/40 font-mono break-all">
              {error?.message}
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
