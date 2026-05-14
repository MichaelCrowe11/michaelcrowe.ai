"use client"

import { motion } from "framer-motion"
import { Quote, TrendingUp, Clock, DollarSign } from "lucide-react"

const testimonials = [
  {
    quote: "Michael compressed what would've taken our team 18 months into 12 weeks. The AI systems he built now handle 90% of our customer inquiries. ROI in 8 weeks.",
    author: "Sarah Chen",
    role: "CEO",
    company: "HVAC Pro Services",
    industry: "Home Services",
    metric: { label: "Additional revenue", value: "$80K", subtext: "from previously missed calls" },
    image: "SC",
  },
  {
    quote: "We were drowning in quote requests. Michael built a system that processes them in 3 minutes instead of 3 days. Our win rate went up 40% in the first quarter.",
    author: "David Martinez",
    role: "Founder",
    company: "Premier Manufacturing",
    industry: "Manufacturing",
    metric: { label: "Win rate increase", value: "+40%", subtext: "in 90 days" },
    image: "DM",
  },
  {
    quote: "I've worked with three AI consultants before Michael. None of them shipped production systems. Michael shipped in 4 weeks and it's been running flawlessly for 6 months.",
    author: "Jennifer Park",
    role: "COO",
    company: "Bistro Group",
    industry: "Hospitality",
    metric: { label: "Booking increase", value: "+35%", subtext: "month-over-month" },
    image: "JP",
  },
]

const credentials = [
  { label: "Built", value: "Crowe Logic", subtext: "$40M valuation platform" },
  { label: "Compressed", value: "15 → 12 weeks", subtext: "drug discovery pipeline" },
  { label: "Deployed", value: "150+ agents", subtext: "across 7 continents" },
  { label: "Scaled", value: "$470K ARR", subtext: "Southwest Mushrooms" },
]

export function SocialProofPolished() {
  return (
    <section id="proof" className="section-spacing relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gold/10 rounded-full blur-3xl" />
      </div>

      <div className="container-wide relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6">
            <div className="w-2 h-2 rounded-full bg-gold" />
            <span className="text-sm font-semibold text-gold tracking-wider uppercase">
              Proof, Not Promises
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-[1.05]">
            Results that{" "}
            <span className="bg-gradient-to-r from-gold to-accent bg-clip-text text-transparent">
              compound
            </span>
          </h2>

          <p className="text-xl text-muted-foreground leading-relaxed">
            Every engagement is structured to deliver measurable ROI within 90 days.
            Here's what that actually looks like.
          </p>
        </motion.div>

        {/* Credentials Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 py-10 border-y border-border/40"
        >
          {credentials.map((cred, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <p className="text-xs text-muted-foreground mb-2 tracking-wider uppercase">
                {cred.label}
              </p>
              <p className="text-2xl font-bold text-foreground mb-1">{cred.value}</p>
              <p className="text-xs text-muted-foreground">{cred.subtext}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-20">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.15 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <div className="relative h-full rounded-3xl p-8 bg-card/40 border border-border/50 hover:border-gold/30 backdrop-blur-xl transition-all duration-300">
                {/* Quote icon */}
                <Quote className="w-10 h-10 text-gold/20 mb-6" />

                {/* Quote */}
                <p className="text-foreground/90 leading-relaxed mb-8 font-light text-lg">
                  "{testimonial.quote}"
                </p>

                {/* Metric Highlight */}
                <div className="mb-8 p-4 rounded-xl bg-gradient-to-br from-gold/10 to-accent/5 border border-gold/20">
                  <div className="flex items-baseline gap-2">
                    <TrendingUp className="w-4 h-4 text-gold" />
                    <p className="text-3xl font-bold bg-gradient-to-r from-gold to-accent bg-clip-text text-transparent">
                      {testimonial.metric.value}
                    </p>
                  </div>
                  <p className="text-xs font-semibold text-foreground mt-2">{testimonial.metric.label}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.metric.subtext}</p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-6 border-t border-border/40">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-accent flex items-center justify-center text-black font-bold text-sm">
                    {testimonial.image}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>

                {/* Industry tag */}
                <div className="absolute top-8 right-8 px-3 py-1 rounded-full bg-muted/30 text-xs text-muted-foreground">
                  {testimonial.industry}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Press / Trust Logos Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-xs text-muted-foreground mb-6 tracking-wider uppercase">
            Methodologies & Technologies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            {["Claude (Anthropic)", "GPT-4 (OpenAI)", "Crowe Logic", "Three.js", "Next.js 16", "Stripe", "Vercel"].map((tech) => (
              <span key={tech} className="text-sm font-mono text-muted-foreground hover:text-gold transition-colors">
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
