import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Calendar, Mail, BarChart3, Phone, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "AI Automation Services | Michael Crowe",
  description: "Custom AI solutions for small businesses. Save 20+ hours per week with intelligent automation.",
}

export default function ServicesPage() {
  const services = [
    {
      icon: MessageSquare,
      title: "Customer Communication",
      description:
        "Never miss a customer inquiry again. AI-powered chatbots and automated follow-ups that feel personal.",
      bullets: [
        "24/7 AI chatbot support",
        "Automated follow-up sequences",
        "Review request automation",
        "Multi-channel messaging",
      ],
      slug: "customer-communication",
    },
    {
      icon: Calendar,
      title: "Scheduling & Operations",
      description:
        "Stop playing phone tag. Smart booking systems that handle appointments, staff scheduling, and inventory.",
      bullets: [
        "Intelligent appointment booking",
        "Staff schedule optimization",
        "Inventory tracking automation",
        "Automated reminders",
      ],
      slug: "scheduling-operations",
    },
    {
      icon: Mail,
      title: "Marketing Automation",
      description:
        "Marketing that runs itself. From email campaigns to social media, keep customers engaged automatically.",
      bullets: [
        "Personalized email campaigns",
        "Social media content automation",
        "Customer segmentation",
        "Campaign analytics",
      ],
      slug: "marketing-automation",
    },
    {
      icon: BarChart3,
      title: "Financial Intelligence",
      description:
        "Know your numbers in real-time. Automated dashboards and insights that help you make better decisions.",
      bullets: [
        "Real-time profit dashboards",
        "Automated expense tracking",
        "Revenue forecasting",
        "Financial reporting",
      ],
      slug: "financial-intelligence",
    },
    {
      icon: Phone,
      title: "Voice & Phone AI",
      description: "Your AI receptionist that never sleeps. Handle calls, take bookings, and answer questions 24/7.",
      bullets: [
        "AI phone answering",
        "Appointment booking by voice",
        "Call routing automation",
        "Voicemail transcription",
      ],
      slug: "voice-phone-ai",
    },
    {
      icon: Sparkles,
      title: "Custom Solutions",
      description: "Your business is unique. Get AI systems built specifically for your workflow and challenges.",
      bullets: ["Tailored to your needs", "Integrates with existing tools", "Scalable architecture", "Ongoing support"],
      slug: "custom-solutions",
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-block mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full border border-gold text-gold text-sm font-medium">
              AI Automation Services
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            Save 20+ Hours Per Week With AI That Actually Works
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed text-pretty mb-8">
            Custom AI solutions built specifically for small businesses. No cookie-cutter templates. Just systems that
            solve your actual problems.
          </p>
          <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
            <Link href="/contact">Schedule Free Consultation</Link>
          </Button>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-card group"
              >
                <CardContent className="pt-8 pb-8 px-6">
                  <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors">
                    <service.icon className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-card-foreground">{service.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
                  <ul className="space-y-2 mb-6">
                    {service.bullets.map((bullet, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start">
                        <span className="text-gold mr-2">✓</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center text-gold hover:text-gold/80 font-medium transition-colors group"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-balance">Not Sure Which Service You Need?</h2>
          <p className="text-lg text-primary-foreground/80 mb-8 leading-relaxed text-pretty">
            Let's talk about your business challenges. I'll help you figure out exactly what AI can do for you.
          </p>
          <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
            <Link href="/contact">Schedule Free Discovery Call</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
