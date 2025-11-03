import { MessageCircle, FileText, Code2, Rocket } from "lucide-react"

export function ProcessSection() {
  const steps = [
    {
      icon: MessageCircle,
      title: "Discovery Call",
      duration: "30 min",
      description:
        "We talk about your business, your pain points, where you're losing time. No sales pitch—just understanding what you need.",
    },
    {
      icon: FileText,
      title: "Custom Blueprint",
      duration: "1 week",
      description:
        "I design an AI system specifically for YOUR workflow. You see exactly what gets automated and how it works.",
    },
    {
      icon: Code2,
      title: "Build & Integrate",
      duration: "2-4 weeks",
      description:
        "I build your custom AI systems and integrate them with your existing tools. You're involved every step.",
    },
    {
      icon: Rocket,
      title: "Launch & Support",
      duration: "Ongoing",
      description: "Your AI goes live. I provide training and ongoing support. You get your time back.",
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            Simple Process, Powerful Results
          </h2>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connection Line - Hidden on mobile */}
            <div
              className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-border"
              style={{ width: "calc(100% - 8rem)", left: "4rem" }}
            ></div>

            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center mb-4 relative z-10 shadow-lg">
                    <step.icon className="w-8 h-8 text-gold-foreground" />
                  </div>
                  <div className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-3">
                    {step.duration}
                  </div>
                  <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
