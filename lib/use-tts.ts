"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

export type SpeakOptions = {
  rate?: number
  pitch?: number
  volume?: number
  voice?: SpeechSynthesisVoice | null
  onStart?: () => void
  onEnd?: () => void
  onError?: (err: any) => void
}

export function useTTS(defaults?: Omit<SpeakOptions, 'onStart' | 'onEnd' | 'onError'>) {
  const isSupported = useMemo(
    () => typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window,
    []
  )

  const [speaking, setSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Load available voices (async on some browsers)
  useEffect(() => {
    if (!isSupported) return
    const synth = window.speechSynthesis
    const loadVoices = () => setVoices(synth.getVoices())
    loadVoices()
    synth.onvoiceschanged = loadVoices
    return () => {
      if (synth.onvoiceschanged === loadVoices) synth.onvoiceschanged = null
    }
  }, [isSupported])

  const cancel = useCallback(() => {
    if (!isSupported) return
    try {
      window.speechSynthesis.cancel()
      currentUtteranceRef.current = null
      setSpeaking(false)
    } catch {}
  }, [isSupported])

  const speak = useCallback(
    (text: string, opts?: SpeakOptions) => {
      if (!isSupported || !text) return Promise.resolve()
      // Cancel any in-flight utterances to avoid overlap
      try { window.speechSynthesis.cancel() } catch {}

      return new Promise<void>((resolve) => {
        try {
          const utter = new SpeechSynthesisUtterance(text)
          currentUtteranceRef.current = utter

          // Apply options
          const rate = opts?.rate ?? defaults?.rate ?? 0.95
          const pitch = opts?.pitch ?? defaults?.pitch ?? 1
          const volume = opts?.volume ?? defaults?.volume ?? 1
          utter.rate = rate
          utter.pitch = pitch
          utter.volume = volume

          // Voice selection (optional)
          const voice = (opts?.voice ?? defaults?.voice) || null
          if (voice) utter.voice = voice

          utter.onstart = () => {
            setSpeaking(true)
            opts?.onStart?.()
          }
          const finish = () => {
            setSpeaking(false)
            opts?.onEnd?.()
            resolve()
          }
          utter.onend = finish
          utter.onerror = (e) => {
            setSpeaking(false)
            opts?.onError?.(e)
            resolve()
          }

          window.speechSynthesis.speak(utter)
        } catch (e) {
          setSpeaking(false)
          opts?.onError?.(e)
          resolve()
        }
      })
    },
    [isSupported, defaults]
  )

  return { isSupported, speaking, voices, speak, cancel }
}
