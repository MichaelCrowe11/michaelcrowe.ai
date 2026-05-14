"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, Video, CheckCircle2, ArrowRight, MessageCircle, Mail, Phone } from "lucide-react"
import { CalendlyInline, CalendlyBooking } from "./calendly-booking"
import Link from "next/link"

const callTypes = [
  {
    name: "30-Min Discovery Call",
    description: "Free intro call to assess fit. Best for understanding your situation and exploring options.",
    duration: "30 min",
    price: "Free",
    badge: "Most popular",
    icon: MessageCircle,
    url: "https://calendly.com/michaelcrowe/discovery-call",
    qualifier: "Best if you're not sure where to start",
  },
  {
    name: "60-Min Strategy Deep-Dive",
    description: "Working session to map your AI opportunities. Walk away with actionable next steps.",
    duration: "60 min",
    price: "$497",
    badge: null,
    icon: Calendar,
    url: "https://calendly.com/michaelcrowe/strategy-deep-dive",
    qualifier: "Best if you know AI fits — need a plan",
  },
  {
    name: "90-Min Roadmap Intensive",
    description: "Full strategy session + 25-page custom roadmap delivered in 7 days. Credit toward implementation.",
    duration: "90 min + 7-day deliverable",
    price: "$2,500",
    badge: "Highest value",
    icon: Video,
    url: "https://calendly.com/michaelcrowe/roadmap-intensive",
    qualifier: "Best if you're ready to invest in clarity",
  },
]

export function BookingSection() {
  return (
    <section id="book" className="section-spacing relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="container-wide relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-semibold text-emerald-300 tracking-wider uppercase">
              Schedule a Call
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-[1.05]">
            Let's talk{" "}
            <span className="bg-gradient-to-r from-gold via-yellow-300 to-accent bg-clip-text text-transparent">
              specifics
            </span>
          </h2>

          <p className="text-xl text-muted-foreground leading-relaxed">
            Three ways to connect, depending on where you are in your journey.
            Pick the one that matches your situation.
          </p>
        </motion.div>

        {/* Call Type Options */}
        <div className="grid lg:grid-cols-3 gap-6 mb-20">
          {callTypes.map((call, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="group relative"
            >
              <div className="relative h-full rounded-3xl p-8 bg-card/40 border border-border/50 hover:border-gold/40 backdrop-blur-xl transition-all duration-300">
                {call.badge && (
                  <div className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-gradient-to-r from-gold to-accent text-black text-xs font-bold tracking-wider uppercase">
                    {call.badge}
                  </div>
                )}

                <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mb-6">
                  <call.icon className="w-7 h-7 text-gold" />
                </div>

                <h3 className="text-2xl font-bold mb-2">{call.name}</h3>
                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                  {call.description}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6 py-4 border-y border-border/40">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                      Duration
                    </p>
                    <p className="text-sm font-semibold">{call.duration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                      Investment
                    </p>
                    <p className="text-sm font-semibold text-gold">{call.price}</p>
                  </div>
                </div>

                <div className="mb-6 p-3 rounded-lg bg-muted/20 text-xs text-muted-foreground">
                  <span className="text-gold font-semibold">→ </span>
                  {call.qualifier}
                </div>

                <CalendlyBooking
                  url={call.url}
                  eventName={call.name}
                  duration={call.duration}
                  buttonLabel="Book This Call"
                  variant={idx === 0 ? "primary" : "secondary"}
                  size="md"
                  className="w-full justify-center"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Alternative Contact Methods */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="rounded-3xl p-10 bg-gradient-to-br from-card/60 to-card/40 border border-border/50 backdrop-blur-xl">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center md:text-left">
                <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center mb-4 mx-auto md:mx-0">
                  <Mail className="w-6 h-6 text-gold" />
                </div>
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                  Email
                </p>
                <a
                  href="mailto:michael@crowelogic.com"
                  className="text-base font-semibold hover:text-gold transition-colors"
                >
                  michael@crowelogic.com
                </a>
                <p className="text-xs text-muted-foreground mt-1">Replies within 24 hours</p>
              </div>

              <div className="text-center md:text-left">
                <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center mb-4 mx-auto md:mx-0">
                  <Phone className="w-6 h-6 text-gold" />
                </div>
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                  Phone
                </p>
                <a
                  href="tel:+14803225761"
                  className="text-base font-semibold hover:text-gold transition-colors"
                >
                  480-322-5761
                </a>
                <p className="text-xs text-muted-foreground mt-1">Mon-Fri, 9-5 AZ Time</p>
              </div>

              <div className="text-center md:text-left">
                <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center mb-4 mx-auto md:mx-0">
                  <MessageCircle className="w-6 h-6 text-gold" />
                </div>
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                  AI Assistant
                </p>
                <p className="text-base font-semibold">Chat in bottom corner</p>
                <p className="text-xs text-muted-foreground mt-1">Instant answers 24/7</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* What to Expect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto mt-20 text-center"
        >
          <h3 className="text-2xl font-bold mb-6">What to Expect</h3>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { num: "01", title: "Honest assessment", desc: "I'll tell you if AI is the right move (or not)." },
              { num: "02", title: "Specific ideas", desc: "Walk away with concrete AI opportunities for your business." },
              { num: "03", title: "Zero pressure", desc: "I work with 5 clients/quarter. There's no need for sales tactics." },
            ].map((item) => (
              <div key={item.num} className="text-left">
                <div className="text-3xl font-bold text-gold/50 mb-2">{item.num}</div>
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
