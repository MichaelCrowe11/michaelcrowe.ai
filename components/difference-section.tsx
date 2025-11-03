import { Card, CardContent } from "@/components/ui/card"
import { Store, Code, TrendingUp } from "lucide-react"

export function DifferenceSection() {
  const cards = [
    {
      icon: Store,
      title: "I've Been There",
      description:
        "Started growing mushrooms at 15. Founded Southwest Mushrooms at 26 with zero capital. Grew it to $470K annually serving millions globally. I know what it's like to work 80-hour weeks doing everything manually.",
    },
    {
      icon: Code,
      title: "I Build, Not Just Consult",
      description:
        "Completely self-taught developer who writes actual code. I don't outsource or use templates. Your AI systems are custom-built for YOUR business.",
    },
    {
      icon: TrendingUp,
      title: "Real Results, Not Buzzwords",
      description:
        "I automated everything in my own business—from climate control to customer orders to inventory management. If it saved me time, it can save you time.",
    },
  ]

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            Why Work With an Architect Who&apos;s Actually Built Businesses?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <Card key={index} className="border-border hover:shadow-lg transition-shadow bg-card">
              <CardContent className="pt-8 pb-8 px-6">
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-6">
                  <card.icon className="w-8 h-8 text-gold" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-card-foreground">{card.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
