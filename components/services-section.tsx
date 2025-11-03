import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Calendar, Mail, BarChart3, Phone, Sparkles } from "lucide-react"
import Link from "next/link"

export function ServicesSection() {
  const services = [
    {
      icon: MessageSquare,
      title: "Customer Communication",
      bullets: ["Automated follow-ups", "AI chatbots", "Review management"],
      slug: "customer-communication",
    },
    {
      icon: Calendar,
      title: "Scheduling & Operations",
      bullets: ["Smart booking", "Staff scheduling", "Inventory automation"],
      slug: "scheduling-operations",
    },
    {
      icon: Mail,
      title: "Marketing Automation",
      bullets: ["Email campaigns", "Social content", "Customer segmentation"],
      slug: "marketing-automation",
    },
    {
      icon: BarChart3,
      title: "Financial Intelligence",
      bullets: ["Real-time dashboards", "Profit analysis", "Automated bookkeeping"],
      slug: "financial-intelligence",
    },
    {
      icon: Phone,
      title: "Voice & Phone AI",
      bullets: ["AI receptionists", "24/7 service", "Phone booking"],
      slug: "voice-phone-ai",
    },
    {
      icon: Sparkles,
      title: "Custom Solutions",
      bullets: ["Built for your workflow", "Your specific needs", "Integrated with your tools"],
      slug: "custom-solutions",
    },
  ]

  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 section-gradient-subtle ml-0 lg:ml-24">
      <div className="container mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            AI Systems That <span className="gradient-text-gold">Save You 20+ Hours</span> Per Week
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Here&apos;s what I build for small businesses like yours
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Link key={index} href={`/services/${service.slug}`}>
              <Card className="premium-card h-full cursor-pointer">
                <CardContent className="pt-8 pb-8 px-6">
                  <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mb-6">
                    <service.icon className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="text-lg font-bold mb-4 text-card-foreground">{service.title}</h3>
                  <ul className="space-y-2">
                    {service.bullets.map((bullet, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start">
                        <span className="text-gold mr-2">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 text-sm font-medium text-gold hover:text-gold/80 transition-colors">
                    Learn More →
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
