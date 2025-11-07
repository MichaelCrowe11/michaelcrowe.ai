// Client-side observability helpers.
// Controlled by NEXT_PUBLIC_ENABLE_OBSERVABILITY (boolean string).

const OBS_ENABLED = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_ENABLE_OBSERVABILITY === 'true'

interface BasePayload {
  type?: 'event' | 'error' | 'perf'
  name?: string
  message?: string
  data?: any
  stack?: string
  level?: 'info' | 'warn' | 'error'
}

async function send(payload: BasePayload) {
  if (!OBS_ENABLED) {
    // Fallback to console only
    const { type = 'event', name, message, data } = payload
    const prefix = `[obs:${type}]`
    // eslint-disable-next-line no-console
    console.log(prefix, name || message, data || '')
    return
  }
  try {
    await fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[observability] send failed', err)
  }
}

export function logEvent(name: string, data?: any) {
  return send({ type: 'event', name, data })
}

export function logError(error: unknown, context?: string, extra?: any) {
  let message = 'Unknown error'
  let stack: string | undefined
  if (error instanceof Error) {
    message = error.message
    stack = error.stack
  } else if (typeof error === 'string') {
    message = error
  } else if (error && typeof error === 'object') {
    message = JSON.stringify(error)
  }
  return send({ type: 'error', level: 'error', name: context, message, stack, data: extra })
}

export function logPerf(name: string, durationMs: number, data?: any) {
  return send({ type: 'perf', name, data: { durationMs, ...(data || {}) } })
}

// Simple timing helper
export function timeBlock<T>(name: string, fn: () => T): T {
  const start = performance.now()
  try {
    return fn()
  } finally {
    const end = performance.now()
    logPerf(name, end - start)
  }
}
