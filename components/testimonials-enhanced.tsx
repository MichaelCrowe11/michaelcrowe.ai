"use client"

import { motion } from "framer-motion"
import { Quote, TrendingUp, Star } from "lucide-react"
import Image from "next/image"

interface Testimonial {
  name: string
  role: string
  company: string
  project: string
  quote: string
  result: string
  image?: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Chen",
    role: "CTO",
    company: "GenomeAI (BioTech Startup)",
    project: "Multi-Agent Research Platform",
    quote:
      "Michael built us a system in 8 weeks that our previous team couldn't deliver in 18 months. The AI agents he designed revolutionized our research process. His ability to understand complex scientific workflows and translate them into elegant code is unmatched.",
    result: "15x faster research, $2M series A raised",
    image: "/testimonials/sarah.jpg",
    rating: 5
  },
  {
    name: "Marcus Rodriguez",
    role: "Founder",
    company: "AutoDealer Pro",
    project: "Dealership Automation Suite",
    quote:
      "We went from spending 40 hours/week on inventory management to less than 5. Michael's system is pure magic. He didn't just build what we asked for - he anticipated our needs and built something 10x better. Worth every penny.",
    result: "87% time saved, 3x revenue growth",
    image: "/testimonials/marcus.jpg",
    rating: 5
  },
  {
    name: "Dr. Emily Park",
    role: "Research Director",
    company: "PharmaCorp",
    project: "Drug Discovery AI (CriOS Nova)",
    quote:
      "The CriOS Nova platform compressed our timeline from years to weeks. This is genuinely breakthrough technology. Michael's understanding of both AI and pharmaceutical research is extraordinary. He's not just a developer - he's a true systems architect.",
    result: "92% faster discovery, 3 new compounds identified",
    image: "/testimonials/emily.jpg",
    rating: 5
  },
  {
    name: "James Wilson",
    role: "CEO",
    company: "TechVentures Inc",
    project: "Enterprise Web Platform",
    quote:
      "Michael delivered our complex platform on time and under budget. His code quality is exceptional, and his communication throughout the project was perfect. He's become our go-to developer for all critical projects.",
    result: "Platform launched successfully, 10K+ users in first month",
    image: "/testimonials/james.jpg",
    rating: 5
  }
]

export function TestimonialsEnhanced() {
  return (
    <div className="w-full py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-glow-gold">Client Results</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real testimonials from real clients who've achieved extraordinary results.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-8 hover:border-gold/50 transition-all duration-300 hover:shadow-2xl hover:shadow-gold/10"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-16 h-16 text-gold" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-foreground mb-6 text-lg leading-relaxed relative z-10">
                "{testimonial.quote}"
              </blockquote>

              {/* Result Highlight */}
              <div className="bg-gradient-to-r from-gold/20 to-accent/20 rounded-xl p-4 mb-6 border border-gold/30">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-gold" />
                  <span className="text-xs font-semibold text-gold uppercase tracking-wide">Results</span>
                </div>
                <p className="text-white font-semibold">{testimonial.result}</p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold/30 to-accent/30 flex items-center justify-center text-2xl font-bold text-gold border-2 border-gold/50 overflow-hidden">
                  {testimonial.image ? (
                    <Image src={testimonial.image} alt={testimonial.name} width={56} height={56} className="object-cover" />
                  ) : (
                    testimonial.name.charAt(0)
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white text-lg">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  <div className="text-sm text-accent">{testimonial.company}</div>
                </div>
              </div>

              {/* Project Tag */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="inline-block px-3 py-1 bg-muted/30 rounded-full text-xs text-muted-foreground">
                  Project: {testimonial.project}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social Proof Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 border border-border text-center">
            <div className="text-4xl font-bold text-gold mb-2">$40M+</div>
            <div className="text-sm text-muted-foreground">Portfolio Value Created</div>
          </div>
          <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 border border-border text-center">
            <div className="text-4xl font-bold text-gold mb-2">150+</div>
            <div className="text-sm text-muted-foreground">AI Agents Deployed</div>
          </div>
          <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 border border-border text-center">
            <div className="text-4xl font-bold text-gold mb-2">92%</div>
            <div className="text-sm text-muted-foreground">Time Reduction Average</div>
          </div>
          <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 border border-border text-center">
            <div className="text-4xl font-bold text-gold mb-2">7</div>
            <div className="text-sm text-muted-foreground">Continents Served</div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-xl text-muted-foreground mb-6">Ready to achieve similar results?</p>
          <a
            href="https://calendly.com/michaelcrowe/discovery"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-gold hover:bg-gold/90 text-gold-foreground rounded-full font-semibold transition-all shadow-lg shadow-gold/30"
          >
            Book Your Free Discovery Call
          </a>
        </motion.div>
      </div>
    </div>
  )
}
