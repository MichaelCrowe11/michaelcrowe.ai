import { Button } from "@/components/ui/button"
import { Code, Zap, TrendingUp } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left Column - 60% */}
          <div className="lg:col-span-3 space-y-8">
            <div className="inline-block">
              <span className="inline-flex items-center px-4 py-2 rounded-full border border-gold text-gold text-sm font-medium">
                AI Systems Architect
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance leading-tight">
              I Build AI That Actually Works for Small Business
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed text-pretty max-w-2xl">
              Self-taught developer who scaled a business from my garage to serving millions of customers across 7
              continents. Now I help small businesses do what I did—but faster, with AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
                <Link href="/contact">Let&apos;s Talk About Your Business</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-gold text-gold hover:bg-gold/10 bg-transparent"
              >
                <Link href="/about">My Story</Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">Trusted by restaurants, retail shops, and local services</p>
          </div>

          {/* Right Column - 40% */}
          <div className="lg:col-span-2 flex justify-center items-center">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80">
              {/* Main Logo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden bg-background shadow-2xl shadow-gold/20 animate-float">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/crowe-logic-logo-87FZNrbBWYjPIm7AaAVgQ2TQIx435b.png"
                    alt="Michael Crowe - AI Systems Architect"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Floating Icons */}
              <div className="absolute inset-0">
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 animate-orbit"
                  style={{ animationDelay: "0s" }}
                >
                  <div className="w-12 h-12 rounded-full bg-accent/20 backdrop-blur-sm flex items-center justify-center border border-accent/30">
                    <Code className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 animate-orbit"
                  style={{ animationDelay: "-6.67s" }}
                >
                  <div className="w-12 h-12 rounded-full bg-gold/20 backdrop-blur-sm flex items-center justify-center border border-gold/30">
                    <Zap className="w-6 h-6 text-gold" />
                  </div>
                </div>
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 animate-orbit"
                  style={{ animationDelay: "-13.33s" }}
                >
                  <div className="w-12 h-12 rounded-full bg-accent/20 backdrop-blur-sm flex items-center justify-center border border-accent/30">
                    <TrendingUp className="w-6 h-6 text-accent" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
