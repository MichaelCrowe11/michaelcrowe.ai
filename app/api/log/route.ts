import { NextRequest, NextResponse } from 'next/server'

// Simple server-side logging endpoint. Intended for low-volume observability.
// Guarded by environment settings; logs to server console.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const enabled = process.env.ENABLE_OBSERVABILITY?.toLowerCase() === 'true'

    // Minimal shape validation
    const { type = 'event', name, message, stack, data, level = 'info' } = body || {}

    if (!enabled) {
      // If disabled, acknowledge without logging to avoid noise in prod
      return NextResponse.json({ ok: true, disabled: true })
    }

    const entry = {
      ts: new Date().toISOString(),
      type,
      level,
      name,
      message,
      stack,
      data,
      ip: req.headers.get('x-forwarded-for')?.split(',')[0] || undefined,
      ua: req.headers.get('user-agent') || undefined,
      path: req.nextUrl.pathname
    }

    // eslint-disable-next-line no-console
    console[type === 'error' ? 'error' : 'log']('[observability]', entry)

    return NextResponse.json({ ok: true })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[observability] failed to log', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
