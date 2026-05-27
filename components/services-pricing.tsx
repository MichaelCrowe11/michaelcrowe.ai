"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight, Sparkles, Zap, Rocket, Crown, Search, Lightbulb, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { coreTiers, entryPoints, MINIMUM_ENGAGEMENT, type OfferIcon } from "@/lib/offer-data"

const iconMap: Record<OfferIcon, LucideIcon> = {
  Sparkles,
  Zap,
  Rocket,
  Crown,
  Search,
  Lightbulb,
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
}

export function ServicesPricing() {
  const mainServices = coreTiers

  return (
    <section id="services-pricing" className="section-spacing relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-gold rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container-wide relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-headline gradient-text-simple mb-4">
            Services & Investment
          </h2>
          <p className="text-body-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            I don't build demos. I build AI systems that run real businesses generating real revenue.
          </p>
          <div className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-gold/10 to-accent/10 border border-gold/20">
            <p className="text-lg font-semibold text-foreground">
              Minimum engagement: <span className="text-gold">{MINIMUM_ENGAGEMENT}</span>
            </p>
          </div>
        </motion.div>

        {/* Main Services Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
        >
          {mainServices.map((service) => {
            const Icon = iconMap[service.icon]
            return (
            <motion.div
              key={service.id}
              variants={item}
              className={`relative ${service.highlighted ? "lg:col-span-2" : ""}`}
            >
              <div
                className={`glass-card rounded-2xl p-8 h-full border-2 ${service.borderColor} bg-gradient-to-br ${service.bgGradient} relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 ${service.highlighted ? "shadow-glow-gold lg:flex lg:gap-10" : "flex flex-col"}`}
              >
                {service.highlighted && (
                  <div className="absolute top-4 right-4 px-4 py-1.5 rounded-full bg-gold/20 border border-gold/40 z-10">
                    <span className="text-sm font-bold text-gold">MOST POPULAR</span>
                  </div>
                )}

                <div className={service.highlighted ? "lg:flex-1" : ""}>
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold/30 to-accent/20 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-gold" />
                    </div>
                  </div>

                  {/* Header */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold glow-text mb-2">{service.name}</h3>
                    <p className="text-muted-foreground mb-4">{service.tagline}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-gold">{service.price}</span>
                      <span className="text-muted-foreground">| {service.duration}</span>
                    </div>
                  </div>
                </div>

                <div className={service.highlighted ? "lg:flex-1 lg:flex lg:flex-col" : "flex flex-col flex-1"}>
                  {/* Features */}
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-foreground mb-4">What You Get:</p>
                    <ul className="space-y-3">
                      {service.features.map((feature, featureIdx) => (
                        <li key={featureIdx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Outcome */}
                  <div className="pt-6 border-t border-border/50 mt-auto">
                    <p className="text-sm font-semibold text-gold mb-2">Outcome:</p>
                    <p className="text-sm text-muted-foreground italic mb-6">{service.outcome}</p>
                    <Button asChild className="glass-button w-full h-11 font-semibold group/btn">
                      <Link href="/contact" className="flex items-center justify-center gap-2">
                        <span>Get Started</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
            )
          })}
        </motion.div>

        {/* Alternative Entry Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-center mb-8 glow-text">
            Alternative Entry Points
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {entryPoints.map((entry, idx) => {
              const Icon = iconMap[entry.icon]
              return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * idx }}
              >
                <div className="glass-card rounded-2xl p-8 h-full border border-gold/20 hover:border-gold/40 transition-all duration-300 hover:scale-[1.02] flex flex-col">
                  {/* Icon */}
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-gold" />
                    </div>
                  </div>

                  {/* Header */}
                  <div className="mb-4">
                    <h4 className="text-xl font-bold glow-text mb-2">{entry.name}</h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gold">{entry.price}</span>
                      <span className="text-sm text-muted-foreground">| {entry.duration}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {entry.features.map((feature, featureIdx) => (
                      <li key={featureIdx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button asChild variant="outline" className="mt-auto w-full h-11 border-gold/40 text-gold hover:bg-gold/10 hover:text-gold font-semibold group/btn">
                    <Link href="/contact" className="flex items-center justify-center gap-2">
                      <span>Book This</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Positioning Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="glass-card rounded-2xl p-12 border-2 border-gold/30">
            <h3 className="text-3xl font-bold mb-6 gradient-text-simple">
              "I Don't Build Demos."
            </h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                I've built AI systems that run real businesses generating real revenue.
              </p>
              <p>
                <span className="text-gold font-semibold">Crowe Logic</span> powers production systems processing millions in transactions.{" "}
                <span className="text-accent font-semibold">CriOS Nova</span> compresses years of pharmaceutical research into weeks.
                My automation infrastructure scaled Southwest Mushrooms to serve customers on 7 continents.
              </p>
              <p className="text-foreground font-semibold text-lg">
                When you work with me, you're getting frameworks battle-tested in production - not theoretical consulting.
              </p>
              <p className="text-sm italic pt-4 border-t border-border/50 mt-6">
                If you want cheap AI experiments, there are plenty of options. If you want systems that actually work - let's talk.
              </p>
            </div>

            <div className="mt-8">
              <Button asChild size="lg" className="glass-button h-12 px-8 text-base font-semibold group">
                <Link href="/contact" className="flex items-center gap-2">
                  <span>Let's Talk</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
