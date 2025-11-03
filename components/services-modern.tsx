"use client"

import { MessageSquare, Calendar, Mail, BarChart3, Phone, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/scroll-reveal"

export function ServicesModern() {
  const services = [
    {
      icon: MessageSquare,
      title: "Customer Communication",
      description: "24/7 AI-powered customer service that never sleeps",
      bullets: ["Automated follow-ups", "Intelligent chatbots", "Review management"],
      slug: "customer-communication",
      gradient: "from-blue-500/10 to-cyan-500/10",
      iconColor: "text-blue-500",
      borderColor: "hover:border-blue-500/50",
    },
    {
      icon: Calendar,
      title: "Scheduling & Operations",
      description: "Smart automation for seamless daily operations",
      bullets: ["Smart booking systems", "Staff scheduling", "Inventory automation"],
      slug: "scheduling-operations",
      gradient: "from-purple-500/10 to-pink-500/10",
      iconColor: "text-purple-500",
      borderColor: "hover:border-purple-500/50",
    },
    {
      icon: Mail,
      title: "Marketing Automation",
      description: "Engage customers with intelligent, personalized campaigns",
      bullets: ["Email campaigns", "Social content", "Customer segmentation"],
      slug: "marketing-automation",
      gradient: "from-orange-500/10 to-red-500/10",
      iconColor: "text-orange-500",
      borderColor: "hover:border-orange-500/50",
    },
    {
      icon: BarChart3,
      title: "Financial Intelligence",
      description: "Transform data into actionable business insights",
      bullets: ["Real-time dashboards", "Profit analysis", "Automated bookkeeping"],
      slug: "financial-intelligence",
      gradient: "from-green-500/10 to-emerald-500/10",
      iconColor: "text-green-500",
      borderColor: "hover:border-green-500/50",
    },
    {
      icon: Phone,
      title: "Voice & Phone AI",
      description: "Never miss a call with AI receptionists",
      bullets: ["AI receptionists", "24/7 service", "Phone booking"],
      slug: "voice-phone-ai",
      gradient: "from-indigo-500/10 to-blue-500/10",
      iconColor: "text-indigo-500",
      borderColor: "hover:border-indigo-500/50",
    },
    {
      icon: Sparkles,
      title: "Custom Solutions",
      description: "Bespoke AI systems tailored to your unique needs",
      bullets: ["Built for your workflow", "Your specific needs", "Integrated with your tools"],
      slug: "custom-solutions",
      gradient: "from-gold/10 to-yellow-500/10",
      iconColor: "text-gold",
      borderColor: "hover:border-gold/50",
    },
  ]

  return (
    <section id="services" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-background/50 backdrop-blur-sm mb-6"
            >
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium">Services</span>
            </motion.div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              Save 20+ Hours Per Week
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              AI systems that handle the repetitive work, so you can focus on growing your business
            </p>
          </div>
        </ScrollReveal>

        {/* Services Grid */}
        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <StaggerItem key={service.slug}>
              <Link href={`/services/${service.slug}`}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={`group relative h-full rounded-2xl border border-border/50 bg-gradient-to-br ${service.gradient} p-8 backdrop-blur-sm transition-all duration-300 ${service.borderColor} hover:shadow-xl hover:shadow-${service.iconColor}/5`}
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-background/50 backdrop-blur-sm flex items-center justify-center mb-6 border border-border/30 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className={`w-6 h-6 ${service.iconColor}`} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3 group-hover:text-gold transition-colors">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Bullets */}
                  <ul className="space-y-2 mb-6">
                    {service.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <svg
                          className={`w-5 h-5 ${service.iconColor} flex-shrink-0 mt-0.5`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Learn More */}
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground group-hover:text-gold transition-colors">
                    <span>Learn more</span>
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>

                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </motion.div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
