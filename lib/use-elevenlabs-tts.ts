"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export type ElevenLabsVoice = {
  voice_id: string
  name: string
  category?: string
}

export type ElevenLabsTTSOptions = {
  voiceId?: string
  stability?: number // 0-1, higher = more consistent
  similarityBoost?: number // 0-1, higher = more like original voice
  style?: number // 0-1, exaggeration
  useSpeakerBoost?: boolean
  onStart?: () => void
  onEnd?: () => void
  onError?: (err: any) => void
}

const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1"

export function useElevenLabsTTS(defaults?: Omit<ElevenLabsTTSOptions, 'onStart' | 'onEnd' | 'onError'>) {
  const [speaking, setSpeaking] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    // Check if ElevenLabs is available via API route
    fetch('/api/elevenlabs/check')
      .then(res => res.json())
      .then(data => {
        if (data.available) {
          setApiKey('server-proxy') // Signal that we'll use server-side proxy
        }
      })
      .catch(() => {
        // Fallback: try client-side key (for dev environments)
        const key = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY
        if (key) setApiKey(key)
      })

    // Initialize audio context for better control
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      audioContextRef.current = new AudioContext()
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const cancel = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    setSpeaking(false)
    setLoading(false)
  }, [])

  const speak = useCallback(
    async (text: string, opts?: ElevenLabsTTSOptions) => {
      if (!apiKey) {
        console.error('ElevenLabs API key not configured')
        opts?.onError?.(new Error('API key not configured'))
        return
      }

      if (!text) return

      // Cancel any existing playback
      cancel()

      setLoading(true)

      try {
        const voiceId = opts?.voiceId ?? defaults?.voiceId ?? '21m00Tcm4TlvDq8ikWAM' // Default: Rachel
        const stability = opts?.stability ?? defaults?.stability ?? 0.5
        const similarityBoost = opts?.similarityBoost ?? defaults?.similarityBoost ?? 0.75
        const style = opts?.style ?? defaults?.style ?? 0
        const useSpeakerBoost = opts?.useSpeakerBoost ?? defaults?.useSpeakerBoost ?? true

        // Use server-side proxy route to keep API key secure
        const response = await fetch('/api/elevenlabs/tts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            voiceId,
            stability,
            similarityBoost,
            style,
            useSpeakerBoost,
          }),
        })

        if (!response.ok) {
          throw new Error(`ElevenLabs API error: ${response.status}`)
        }

        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)

        const audio = new Audio(audioUrl)
        audioRef.current = audio

        audio.onloadeddata = () => {
          setLoading(false)
        }

        audio.onplay = () => {
          setSpeaking(true)
          opts?.onStart?.()
        }

        audio.onended = () => {
          setSpeaking(false)
          opts?.onEnd?.()
          URL.revokeObjectURL(audioUrl)
        }

        audio.onerror = (e) => {
          setLoading(false)
          setSpeaking(false)
          opts?.onError?.(e)
          URL.revokeObjectURL(audioUrl)
        }

        await audio.play()
      } catch (error) {
        console.error('ElevenLabs TTS error:', error)
        setLoading(false)
        setSpeaking(false)
        opts?.onError?.(error)
      }
    },
    [apiKey, defaults, cancel]
  )

  return {
    speaking,
    loading,
    speak,
    cancel,
    hasApiKey: !!apiKey,
  }
}
