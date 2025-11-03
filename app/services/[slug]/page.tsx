import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Check, TrendingUp } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { servicesData, type ServiceSlug } from "@/lib/services-data"

export function generateStaticParams() {
  return Object.keys(servicesData).map((slug) => ({
    slug,
  }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const service = servicesData[params.slug as ServiceSlug]
  if (!service) return {}

  return {
    title: `${service.title} | Michael Crowe`,
    description: service.description,
  }
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = servicesData[params.slug as ServiceSlug]

  if (!service) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      {/* Back Button */}
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <Link
            href="/services"
            className="inline-flex items-center text-muted-foreground hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance">{service.title}</h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed text-pretty mb-8">
            {service.description}
          </p>
          <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
            <Link href="/contact">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Results Stats */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-gold mb-2">{service.results.stat1}</div>
              <div className="text-primary-foreground/80">{service.results.label1}</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-gold mb-2">{service.results.stat2}</div>
              <div className="text-primary-foreground/80">{service.results.label2}</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-gold mb-2">{service.results.stat3}</div>
              <div className="text-primary-foreground/80">{service.results.label3}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">What You Get</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {service.benefits.map((benefit, index) => (
              <Card key={index} className="border-border bg-card">
                <CardContent className="pt-6 pb-6 px-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">How It Works</h2>
          <div className="space-y-6">
            {service.howItWorks.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold text-gold-foreground flex items-center justify-center flex-shrink-0 font-bold">
                  {index + 1}
                </div>
                <p className="text-lg pt-1.5 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-gold mb-4">
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">Real Results</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold">Case Study</h2>
          </div>
          <Card className="border-border bg-card">
            <CardContent className="pt-8 pb-8 px-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-gold mb-2">Business</h3>
                  <p className="text-lg">{service.caseStudy.business}</p>
                </div>
                <div>
                  <h3 className="font-bold text-gold mb-2">Challenge</h3>
                  <p className="text-muted-foreground leading-relaxed">{service.caseStudy.challenge}</p>
                </div>
                <div>
                  <h3 className="font-bold text-gold mb-2">Solution</h3>
                  <p className="text-muted-foreground leading-relaxed">{service.caseStudy.solution}</p>
                </div>
                <div>
                  <h3 className="font-bold text-gold mb-2">Result</h3>
                  <p className="text-foreground font-medium leading-relaxed">{service.caseStudy.result}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-balance">Ready to Get Started?</h2>
          <p className="text-lg text-primary-foreground/80 mb-8 leading-relaxed text-pretty">
            Let's talk about how this can work for your business. Free consultation, no commitment.
          </p>
          <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
            <Link href="/contact">Schedule Free Consultation</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
