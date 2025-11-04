"use client"

import { motion } from "framer-motion"
import { Check, Package, TrendingUp, BarChart3 } from "lucide-react"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export function WhyWorkSection() {
  const achievements = [
    {
      icon: Package,
      title: "I Don't Just Consult - I Ship",
      items: [
        "Created Crowe Logic: AI reasoning framework powering multiple production systems",
        "Built CriOS Nova: 150+ PhD-level AI agents that compress drug discovery from 15 years to 12 weeks",
        "Scaled Southwest Mushrooms to global operation using automation I built myself",
        "Self-taught programmer who learned by solving real problems, not reading whitepapers",
      ],
    },
    {
      icon: TrendingUp,
      title: "I've Done This Across Industries",
      items: [
        "Mycology & agriculture (Southwest Mushrooms - $470k/year)",
        "Automotive (Dealer Logic Inc)",
        "Pharmaceutical research (CriOS Nova)",
        "E-commerce automation",
        "Enterprise SaaS",
      ],
    },
    {
      icon: BarChart3,
      title: "Real Revenue, Not Just Demos",
      items: [
        "Built AI systems that generated astronomical value and took my research to new levels.",
        "I know what works because I've bet my own businesses on it.",
      ],
    },
  ]

  return (
    <section id="why-work" className="section-spacing bg-gradient-to-b from-background/80 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-headline gradient-text-simple mb-4">
            Why Work With Me?
          </h2>
          <p className="text-body-lg text-muted-foreground max-w-3xl mx-auto">
            I've built real AI systems that generate real revenue. Here's what makes me different.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {achievements.map((achievement, idx) => (
            <motion.div key={achievement.title} variants={item}>
              <div className="glass-card rounded-2xl p-8 h-full hover:scale-[1.02] transition-transform duration-300">
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/20 to-accent/20 flex items-center justify-center">
                    <achievement.icon className="w-7 h-7 text-gold" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-6 glow-text">
                  {achievement.title}
                </h3>

                {/* Items */}
                <ul className="space-y-3">
                  {achievement.items.map((item, itemIdx) => (
                    <motion.li
                      key={itemIdx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * itemIdx }}
                      className="flex items-start gap-3"
                    >
                      <Check className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground leading-relaxed">
                        {item}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
