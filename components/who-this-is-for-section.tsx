import { Check, X } from "lucide-react"

export function WhoThisIsForSection() {
  const forYou = [
    "You're spending 10+ hours/week on repetitive tasks",
    "You're turning away customers because you're maxed out",
    "You know AI could help but don't know where to start",
    "You want custom solutions, not cookie-cutter software",
    "You're ready to invest in growing your business",
  ]

  const notForYou = [
    "You're looking for cheap DIY solutions",
    "You want it done yesterday",
    "You're not ready to change how you work",
    "You expect AI to replace good business fundamentals",
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            I Work With Businesses That Are Ready to Scale
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* This IS For You */}
          <div className="bg-card rounded-lg p-8 border border-border">
            <h3 className="text-2xl font-bold mb-6 text-card-foreground">This IS For You If:</h3>
            <ul className="space-y-4">
              {forYou.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-muted-foreground leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* This ISN'T For You */}
          <div className="bg-card rounded-lg p-8 border border-border">
            <h3 className="text-2xl font-bold mb-6 text-card-foreground">This ISN&apos;T For You If:</h3>
            <ul className="space-y-4">
              {notForYou.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-muted-foreground leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
