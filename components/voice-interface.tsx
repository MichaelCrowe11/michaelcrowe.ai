"use client"

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react"

interface VoiceInterfaceProps {
  onTranscript?: (text: string) => void
  onSpeechEnd?: () => void
  autoSpeak?: boolean
}

export interface VoiceInterfaceHandle {
  speak: (text: string) => Promise<void>
  stopSpeaking: () => void
  startListening: () => void
  stopListening: () => void
}

export const VoiceInterface = forwardRef<VoiceInterfaceHandle, VoiceInterfaceProps>(
  ({ onTranscript, onSpeechEnd, autoSpeak = true }, ref) => {
    const [isListening, setIsListening] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [transcript, setTranscript] = useState("")
    const [isSupported, setIsSupported] = useState(false)
    const recognitionRef = useRef<any>(null)
    const synthRef = useRef<SpeechSynthesis | null>(null)

    useEffect(() => {
      // Check for Web Speech API support
      const speechRecognitionSupported =
        "webkitSpeechRecognition" in window || "SpeechRecognition" in window
      const speechSynthesisSupported = "speechSynthesis" in window

      setIsSupported(speechRecognitionSupported && speechSynthesisSupported)

      if (speechRecognitionSupported) {
        // @ts-ignore
        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
        const recognition = new SpeechRecognition()

        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = "en-US"
        recognition.maxAlternatives = 1

        recognition.onresult = (event: any) => {
          const current = event.resultIndex
          const transcriptText = event.results[current][0].transcript
          setTranscript(transcriptText)

          if (event.results[current].isFinal) {
            onTranscript?.(transcriptText)
            setTranscript("")
          }
        }

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          if (event.error === "no-speech") {
            // User didn't speak, keep listening
            return
          }
          setIsListening(false)
        }

        recognition.onend = () => {
          // Auto-restart if still in listening mode
          if (isListening) {
            try {
              recognition.start()
            } catch (e) {
              console.error("Failed to restart recognition:", e)
            }
          }
        }

        recognitionRef.current = recognition
      }

      if (speechSynthesisSupported) {
        synthRef.current = window.speechSynthesis
      }

      return () => {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop()
          } catch (e) {
            // Ignore errors on cleanup
          }
        }
        if (synthRef.current) {
          synthRef.current.cancel()
        }
      }
    }, [])

    const startListening = () => {
      if (!recognitionRef.current || isListening) return

      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch (error) {
        console.error("Failed to start recognition:", error)
      }
    }

    const stopListening = () => {
      if (!recognitionRef.current || !isListening) return

      try {
        recognitionRef.current.stop()
        setIsListening(false)
        setTranscript("")
      } catch (error) {
        console.error("Failed to stop recognition:", error)
      }
    }

    const toggleListening = () => {
      if (isListening) {
        stopListening()
      } else {
        startListening()
      }
    }

    const speak = async (text: string): Promise<void> => {
      if (!synthRef.current || !autoSpeak) return

      return new Promise((resolve, reject) => {
        // Cancel any ongoing speech
        synthRef.current!.cancel()

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 1.0
        utterance.pitch = 1.0
        utterance.volume = 1.0
        utterance.lang = "en-US"

        utterance.onstart = () => {
          setIsSpeaking(true)
        }

        utterance.onend = () => {
          setIsSpeaking(false)
          onSpeechEnd?.()
          resolve()
        }

        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event)
          setIsSpeaking(false)
          reject(event)
        }

        synthRef.current!.speak(utterance)
      })
    }

    const stopSpeaking = () => {
      if (synthRef.current) {
        synthRef.current.cancel()
        setIsSpeaking(false)
      }
    }

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      speak,
      stopSpeaking,
      startListening,
      stopListening
    }))

    if (!isSupported) {
      return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg px-4 py-2 text-yellow-200 text-sm">
            Voice features not supported in this browser
          </div>
        </div>
      )
    }

    return (
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex flex-col items-center gap-4">
          {/* Microphone Button */}
          <motion.button
            onClick={toggleListening}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative w-20 h-20 rounded-full transition-all duration-300 ${
              isListening
                ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/50"
                : "bg-gradient-to-br from-gold to-gold-secondary shadow-lg shadow-gold/40"
            }`}
            aria-label={isListening ? "Stop listening" : "Start listening"}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {isListening ? (
                <Mic className="w-8 h-8 text-white" />
              ) : (
                <MicOff className="w-8 h-8 text-white" />
              )}
            </div>

            {/* Listening Pulse Animation */}
            {isListening && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-green-400"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-green-400"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-green-400"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 1 }}
                />
              </>
            )}
          </motion.button>

          {/* Status Text */}
          <div className="text-center">
            {isListening && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-400 font-medium text-sm"
              >
                Listening...
              </motion.p>
            )}
            {isSpeaking && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2"
              >
                <Volume2 className="w-4 h-4 text-gold" />
                <p className="text-gold font-medium text-sm">Speaking...</p>
              </motion.div>
            )}
            {!isListening && !isSpeaking && (
              <p className="text-muted-foreground text-sm">Click to speak</p>
            )}
          </div>

          {/* Transcript Display */}
          <AnimatePresence>
            {transcript && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-md px-6 py-3 bg-card/80 backdrop-blur-lg border border-border rounded-xl"
              >
                <p className="text-sm text-muted-foreground italic text-center">{transcript}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }
)

VoiceInterface.displayName = "VoiceInterface"
