"use client"

interface ExamplePromptsProps {
  onPromptClick: (prompt: string) => void
  className?: string
}

const prompts = [
  {
    icon: "→",
    text: "What can you help me automate?",
    category: "automation"
  },
  {
    icon: "$",
    text: "How much does consulting cost?",
    category: "pricing"
  },
  {
    icon: "AI",
    text: "Tell me about CroweLM AI",
    category: "product"
  },
  {
    icon: "CAL",
    text: "Book a discovery call",
    category: "booking"
  },
]

export function ExamplePrompts({ onPromptClick, className = "" }: ExamplePromptsProps) {
  return (
    <div className={`mb-4 ${className}`}>
      <p className="text-sm text-white/60 mb-3 text-center font-medium">
        Quick start questions:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onPromptClick(prompt.text)}
            className="group relative overflow-hidden bg-gradient-to-br from-gold/10 to-gold/5 hover:from-gold/20 hover:to-gold/10 border border-gold/30 hover:border-gold/50 rounded-2xl p-3 text-left transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 active:scale-100 active:translate-y-0"
            style={{
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                style={{
                  animation: 'shimmer 2s infinite',
                }}
              />
            </div>

            {/* Content */}
            <div className="relative z-10 flex items-start gap-2">
              <span className="text-lg font-bold text-gold flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                {prompt.icon}
              </span>
              <span className="text-sm text-white/90 brightness-140 leading-snug font-medium">
                {prompt.text}
              </span>
            </div>

            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gold/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10" />
          </button>
        ))}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  )
}
