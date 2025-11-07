import Link from "next/link"
import Image from "next/image"
import { Linkedin, Mail, Phone } from "lucide-react"
import { config } from "@/lib/config"

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src={config.branding.logoUrl}
                  alt="Michael Crowe - Crowe Logic"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              AI Implementation Consultant | Founder of Crowe Logic AI & CriOS Nova
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              <strong>Office Hours:</strong> Monday-Friday, 9am-5pm MST<br />
              <strong>Location:</strong> Phoenix, Arizona (Serving Worldwide)
            </p>
            <div className="flex gap-4">
              <a
                href={config.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-gold transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${config.contact.email}`}
                className="text-muted-foreground hover:text-gold transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href={`tel:${config.contact.phone}`}
                className="text-muted-foreground hover:text-gold transition-colors"
                aria-label="Phone"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  Portfolio
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/services/customer-communication"
                  className="text-sm text-muted-foreground hover:text-gold transition-colors"
                >
                  Customer Communication
                </Link>
              </li>
              <li>
                <Link
                  href="/services/scheduling-operations"
                  className="text-sm text-muted-foreground hover:text-gold transition-colors"
                >
                  Scheduling & Operations
                </Link>
              </li>
              <li>
                <Link
                  href="/services/marketing-automation"
                  className="text-sm text-muted-foreground hover:text-gold transition-colors"
                >
                  Marketing Automation
                </Link>
              </li>
              <li>
                <Link
                  href="/services/custom-solutions"
                  className="text-sm text-muted-foreground hover:text-gold transition-colors"
                >
                  Custom Solutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  Blog & Case Studies
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Michael Crowe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
