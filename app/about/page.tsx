import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Code, Zap, Users, TrendingUp, Globe, Package } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const metadata = {
  title: "About Michael Crowe | AI Systems Architect",
  description:
    "From growing mushrooms in a garage to serving millions globally. Now I help small businesses automate and scale with AI.",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full border border-gold text-gold text-sm font-medium">
                  My Story
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance">
                From Garage Hobby to Global Business
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed text-pretty mb-8">
                I'm Michael Crowe. I scaled a mushroom business from my garage to $470K annually serving customers
                across 7 continents. Now I help small businesses do the same—but faster, with AI.
              </p>
              <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
                <Link href="/contact">Let's Talk About Your Business</Link>
              </Button>
            </div>
            <div className="flex justify-center">
              <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden shadow-2xl shadow-gold/20">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/crowe-logic-logo-87FZNrbBWYjPIm7AaAVgQ2TQIx435b.png"
                  alt="Michael Crowe"
                  width={320}
                  height={320}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-16 text-center">
            How I Used AI to Scale From Hobby to Global Business
          </h2>

          <div className="space-y-12">
            {/* Stage 1 */}
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gold text-gold-foreground flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div className="w-0.5 h-full bg-gold/30 mt-4"></div>
              </div>
              <div className="pb-12">
                <h3 className="text-2xl font-bold mb-3">At 15, I Started Growing Mushrooms</h3>
                <p className="text-primary-foreground/80 leading-relaxed">
                  No business plan. Just curiosity and experimentation. I began growing mushrooms as a hobby, learning
                  the science behind cultivation.
                </p>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gold text-gold-foreground flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div className="w-0.5 h-full bg-gold/30 mt-4"></div>
              </div>
              <div className="pb-12">
                <h3 className="text-2xl font-bold mb-3">At 26, I Founded Southwest Mushrooms</h3>
                <p className="text-primary-foreground/80 leading-relaxed">
                  Turned my passion into a real business. But working 80+ hour weeks, I realized I needed automation or
                  I'd burn out. So I taught myself to code.
                </p>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gold text-gold-foreground flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div className="w-0.5 h-full bg-gold/30 mt-4"></div>
              </div>
              <div className="pb-12">
                <h3 className="text-2xl font-bold mb-3">Automated Everything</h3>
                <p className="text-primary-foreground/80 leading-relaxed mb-6">
                  Climate control. Customer orders. Inventory management. Production scheduling. Email follow-ups. If it
                  was repetitive, I automated it.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4 text-gold" />
                    <span>Climate Control</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="w-4 h-4 text-gold" />
                    <span>Order Processing</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-gold" />
                    <span>Inventory</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-gold" />
                    <span>Customer Service</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Code className="w-4 h-4 text-gold" />
                    <span>Scheduling</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4 text-gold" />
                    <span>Marketing</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage 4 - Stats */}
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gold text-gold-foreground flex items-center justify-center font-bold flex-shrink-0">
                  4
                </div>
                <div className="w-0.5 h-full bg-gold/30 mt-4"></div>
              </div>
              <div className="pb-12 flex-1">
                <h3 className="text-2xl font-bold mb-6">The Results</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gold mb-2">1,200-1,500</div>
                    <div className="text-sm text-primary-foreground/80">lbs/week production</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gold mb-2">7</div>
                    <div className="text-sm text-primary-foreground/80">continents served</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gold mb-2">$470K</div>
                    <div className="text-sm text-primary-foreground/80">annual revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gold mb-2">300K+</div>
                    <div className="text-sm text-primary-foreground/80">followers</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage 5 */}
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gold text-gold-foreground flex items-center justify-center font-bold flex-shrink-0">
                  5
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Now I Build These Systems For You</h3>
                <p className="text-primary-foreground/80 leading-relaxed">
                  What took me years to figure out, I can build for your business in weeks. You don't need to learn to
                  code. You just need to know what's wasting your time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why I'm Different */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">Why I'm Different</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border bg-card">
              <CardContent className="pt-8 pb-8 px-6">
                <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-gold" />
                </div>
                <h3 className="text-xl font-bold mb-3">I've Been There</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Started growing mushrooms at 15. Founded Southwest Mushrooms at 26 with zero capital. Grew it to $470K
                  annually serving millions globally. I know what it's like to work 80-hour weeks doing everything
                  manually.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="pt-8 pb-8 px-6">
                <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mb-6">
                  <Code className="w-7 h-7 text-gold" />
                </div>
                <h3 className="text-xl font-bold mb-3">Self-Taught Developer</h3>
                <p className="text-muted-foreground leading-relaxed">
                  No computer science degree. No bootcamp. I learned to code because I had to—my business depended on
                  it. I build practical systems that solve real problems, not academic exercises.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="pt-8 pb-8 px-6">
                <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mb-6">
                  <TrendingUp className="w-7 h-7 text-gold" />
                </div>
                <h3 className="text-xl font-bold mb-3">Results-Focused</h3>
                <p className="text-muted-foreground leading-relaxed">
                  I don't care about fancy tech for tech's sake. I care about saving you time and making you money.
                  Every system I build has clear ROI and measurable results.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">How I Work</h2>
          <div className="space-y-6">
            <Card className="border-border bg-card">
              <CardContent className="pt-6 pb-6 px-6">
                <h3 className="font-bold mb-2 text-gold">No BS, Just Results</h3>
                <p className="text-muted-foreground leading-relaxed">
                  I won't sell you something you don't need. If AI isn't the right solution for your problem, I'll tell
                  you. My reputation is built on delivering results, not making sales.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="pt-6 pb-6 px-6">
                <h3 className="font-bold mb-2 text-gold">Built for Your Business</h3>
                <p className="text-muted-foreground leading-relaxed">
                  No cookie-cutter templates. Every system is custom-built for your specific workflow, challenges, and
                  goals. What works for a restaurant won't work for a construction company.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="pt-6 pb-6 px-6">
                <h3 className="font-bold mb-2 text-gold">I Don't Disappear After Launch</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Building the system is just the start. I stick around to optimize, troubleshoot, and add features as
                  your business grows. You're not just getting software—you're getting a partner.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-balance">Let's Talk About Your Business</h2>
          <p className="text-lg text-primary-foreground/80 mb-8 leading-relaxed text-pretty">
            I've been where you are. Working too hard, wishing there were more hours in the day. Let me show you how AI
            can give you your time back.
          </p>
          <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
            <Link href="/contact">Schedule Free Consultation</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
