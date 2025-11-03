import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "Working with Michael transformed how we run our business. We've saved 15+ hours every week and can finally focus on growth instead of admin work.",
      name: "Sarah Johnson",
      business: "Owner, The Coffee House",
      location: "Portland, OR",
      metric: "Saved 15 hours/week",
    },
    {
      quote:
        "I was skeptical about AI, but Michael built something that actually works for my restaurant. Our order accuracy is up and customer complaints are down.",
      name: "David Martinez",
      business: "Owner, Martinez Family Restaurant",
      location: "Austin, TX",
      metric: "40% fewer errors",
    },
    {
      quote:
        "Michael doesn't just build software—he understands small business. The AI system he created pays for itself every month in time and money saved.",
      name: "Jennifer Lee",
      business: "Owner, Bloom Boutique",
      location: "Seattle, WA",
      metric: "ROI in 2 months",
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 section-gradient-subtle">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            What <span className="gradient-text-gold">Business Owners</span> Say
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="premium-card">
              <CardContent className="pt-8 pb-8 px-6">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-muted-foreground leading-relaxed mb-6 italic">&quot;{testimonial.quote}&quot;</p>

                {/* Author */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
                    <img
                      src={`/business-owner-portrait-.jpg?height=48&width=48&query=business owner portrait ${index + 1}`}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-card-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.business}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.location}</div>
                  </div>
                </div>

                {/* Metric Badge */}
                <div className="inline-block px-3 py-1 rounded-full bg-gold/10 text-gold text-sm font-medium">
                  {testimonial.metric}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
