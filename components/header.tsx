"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { config } from "@/lib/config"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 cosmic-glass border-b border-gold/20 animate-cosmic-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-gold/20 group-hover:ring-gold/40 transition-all">
              <Image
                src={config.branding.logoUrl}
                alt="Michael Crowe"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold tracking-tight">
                MichaelCrowe<span className="text-gold">.ai</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="nav-link text-sm font-medium text-foreground hover:text-gold">
              Home
            </Link>
            <Link href="/about" className="nav-link text-sm font-medium text-foreground hover:text-gold">
              About
            </Link>
            <Link href="/services" className="nav-link text-sm font-medium text-foreground hover:text-gold">
              Services
            </Link>
            <Link href="/portfolio" className="nav-link text-sm font-medium text-foreground hover:text-gold">
              Portfolio
            </Link>
            <Link href="/blog" className="nav-link text-sm font-medium text-foreground hover:text-gold">
              Blog
            </Link>
            <Link href="/contact" className="nav-link text-sm font-medium text-foreground hover:text-gold">
              Contact
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button asChild className="btn-gradient-gold text-gold-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all">
              <Link href="/contact">Let&apos;s Talk</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/services"
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/portfolio"
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Portfolio
              </Link>
              <Link
                href="/blog"
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Button asChild className="bg-gold text-gold-foreground hover:bg-gold/90 w-full">
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  Let&apos;s Talk
                </Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
