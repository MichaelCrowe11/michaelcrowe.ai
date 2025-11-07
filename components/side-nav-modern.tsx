"use client"

import { useEffect, useState } from "react"
import { Home, Briefcase, Code, Mail, User, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface NavItem {
  id: string
  label: string
  icon: React.ElementType
  section: string
}

export function SideNavModern() {
  const [activeSection, setActiveSection] = useState("hero")
  const [isHovered, setIsHovered] = useState(false)

  const navItems: NavItem[] = [
    { id: "hero", label: "Home", icon: Home, section: "hero" },
    { id: "services", label: "Services", icon: Briefcase, section: "services" },
    { id: "portfolio", label: "Portfolio", icon: Code, section: "portfolio" },
    { id: "skills", label: "Skills", icon: Sparkles, section: "skills" },
    { id: "about", label: "About", icon: User, section: "about" },
    { id: "contact", label: "Contact", icon: Mail, section: "contact" },
  ]

  // Intersection Observer for active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute("id")
            if (sectionId) {
              setActiveSection(sectionId)
            }
          }
        })
      },
      { threshold: 0.3 }
    )

    navItems.forEach((item) => {
      const element = document.getElementById(item.section)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [navItems])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <nav className="relative">
        {/* Background pill */}
        <div className="absolute -inset-2 rounded-full bg-background/80 backdrop-blur-xl border border-border/50 shadow-2xl" />

        {/* Navigation items */}
        <div className="relative flex flex-col gap-1 p-2">
          {navItems.map((item) => {
            const IconComponent = item.icon as React.ComponentType<{ className?: string }>
            const isActive = activeSection === item.section

            return (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.section)}
                className="relative group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 rounded-full bg-gold/20"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Icon */}
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <IconComponent
                    className={`w-5 h-5 transition-colors ${
                      isActive ? "text-gold" : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  />
                </div>

                {/* Label tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-full ml-4 top-1/2 -translate-y-1/2 pointer-events-none"
                    >
                      <div className="px-3 py-1.5 rounded-lg bg-background/90 backdrop-blur-sm border border-border/50 shadow-lg whitespace-nowrap">
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </div>

        {/* Decorative dots */}
        <div className="absolute -right-3 top-4">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-1.5 h-1.5 rounded-full bg-gold"
          />
        </div>
        <div className="absolute -right-3 bottom-4">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="w-1.5 h-1.5 rounded-full bg-accent"
          />
        </div>
      </nav>
    </motion.div>
  )
}
