import { ContactForm } from "@/components/contact-form"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, Linkedin, Clock, MapPin } from "lucide-react"

export const metadata = {
  title: "Contact | Michael Crowe",
  description:
    "Get in touch to discuss how AI automation can transform your business. Free consultation, no commitment.",
}

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-block mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full border border-gold text-gold text-sm font-medium">
              Let's Talk
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            Ready to Transform Your Business?
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed text-pretty">
            Schedule a free 30-minute consultation. No sales pitch—just an honest conversation about what AI can do for
            your business.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Form - 60% */}
            <div className="lg:col-span-3">
              <Card className="border-border bg-card">
                <CardContent className="pt-8 pb-8 px-8">
                  <h2 className="text-2xl font-bold mb-6">Send Me a Message</h2>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>

            {/* Contact Info - 40% */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-border bg-card">
                <CardContent className="pt-6 pb-6 px-6">
                  <h3 className="font-bold mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <a
                      href="mailto:hello@michaelcrowe.ai"
                      className="flex items-start gap-3 text-muted-foreground hover:text-gold transition-colors group"
                    >
                      <Mail className="w-5 h-5 flex-shrink-0 mt-0.5 group-hover:text-gold" />
                      <div>
                        <div className="font-medium text-foreground">Email</div>
                        <div className="text-sm">hello@michaelcrowe.ai</div>
                      </div>
                    </a>

                    <a
                      href="tel:+1234567890"
                      className="flex items-start gap-3 text-muted-foreground hover:text-gold transition-colors group"
                    >
                      <Phone className="w-5 h-5 flex-shrink-0 mt-0.5 group-hover:text-gold" />
                      <div>
                        <div className="font-medium text-foreground">Phone</div>
                        <div className="text-sm">+1 (234) 567-8900</div>
                      </div>
                    </a>

                    <a
                      href="https://linkedin.com/in/michaelcrowe"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 text-muted-foreground hover:text-gold transition-colors group"
                    >
                      <Linkedin className="w-5 h-5 flex-shrink-0 mt-0.5 group-hover:text-gold" />
                      <div>
                        <div className="font-medium text-foreground">LinkedIn</div>
                        <div className="text-sm">linkedin.com/in/michaelcrowe</div>
                      </div>
                    </a>

                    <div className="flex items-start gap-3 text-muted-foreground">
                      <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-foreground">Location</div>
                        <div className="text-sm">Phoenix, Arizona</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardContent className="pt-6 pb-6 px-6">
                  <h3 className="font-bold mb-4">Office Hours</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 flex-shrink-0 mt-0.5 text-gold" />
                      <div>
                        <div className="font-medium">Monday - Friday</div>
                        <div className="text-sm text-muted-foreground">9:00 AM - 6:00 PM MST</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground pt-3 border-t border-border">
                      I typically respond within 24 hours. For urgent matters, please call directly.
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gold/20 bg-gold/5">
                <CardContent className="pt-6 pb-6 px-6">
                  <h3 className="font-bold mb-3 text-gold">What to Expect</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-1">✓</span>
                      <span>Free 30-minute consultation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-1">✓</span>
                      <span>Honest assessment of what AI can do for you</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-1">✓</span>
                      <span>No pressure, no sales pitch</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-1">✓</span>
                      <span>Clear next steps if we're a good fit</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Common Questions</h2>
          <div className="space-y-6">
            <Card className="border-border bg-card">
              <CardContent className="pt-6 pb-6 px-6">
                <h3 className="font-bold mb-2">How much does it cost?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every project is different. After our consultation, I'll provide a clear proposal with pricing based
                  on your specific needs. Most projects range from $5,000-$30,000 depending on complexity.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="pt-6 pb-6 px-6">
                <h3 className="font-bold mb-2">How long does implementation take?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Most projects take 4-8 weeks from start to launch. Simple automations can be done in 2-3 weeks, while
                  complex custom systems may take 10-12 weeks.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="pt-6 pb-6 px-6">
                <h3 className="font-bold mb-2">Do you offer ongoing support?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Yes. All projects include 30 days of post-launch support. After that, I offer monthly support packages
                  for ongoing optimization, updates, and new features.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="pt-6 pb-6 px-6">
                <h3 className="font-bold mb-2">What if I'm not sure what I need?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  That's exactly what the consultation is for. I'll ask about your biggest challenges and help you
                  identify where AI can have the most impact. No technical knowledge required.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}
