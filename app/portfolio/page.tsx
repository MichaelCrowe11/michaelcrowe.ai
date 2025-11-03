import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp } from "lucide-react"
import Link from "next/link"
import { projects } from "@/lib/portfolio-data"
import Image from "next/image"

export const metadata = {
  title: "Portfolio & Projects | Michael Crowe",
  description: "Real AI automation projects delivering measurable results for small businesses across industries.",
}

export default function PortfolioPage() {
  const industries = [...new Set(projects.map((p) => p.industry))]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-block mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full border border-gold text-gold text-sm font-medium">
              Portfolio & Projects
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance">Real Projects, Real Results</h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed text-pretty">
            See how I've helped businesses like yours save time, increase revenue, and scale with AI automation.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-gold mb-2">50+</div>
              <div className="text-primary-foreground/80">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-gold mb-2">$2M+</div>
              <div className="text-primary-foreground/80">Revenue Generated</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-gold mb-2">1000+</div>
              <div className="text-primary-foreground/80">Hours Saved Weekly</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-gold mb-2">98%</div>
              <div className="text-primary-foreground/80">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-gold mb-4">
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">Featured Work</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold">Highlighted Projects</h2>
          </div>

          <div className="space-y-12">
            {projects
              .filter((p) => p.featured)
              .map((project, index) => (
                <Card key={project.id} className="border-border overflow-hidden">
                  <div className={`grid lg:grid-cols-2 gap-0 ${index % 2 === 1 ? "lg:grid-flow-dense" : ""}`}>
                    <div className={`relative h-64 lg:h-auto ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="pt-8 pb-8 px-8 flex flex-col justify-center">
                      <Badge variant="secondary" className="bg-gold/10 text-gold border-gold/20 w-fit mb-4">
                        {project.industry}
                      </Badge>
                      <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                      <p className="text-muted-foreground mb-4 leading-relaxed">{project.description}</p>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {project.results.map((result, idx) => (
                          <div key={idx}>
                            <div className="text-2xl font-bold text-gold">{result.value}</div>
                            <div className="text-sm text-muted-foreground">{result.metric}</div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies.slice(0, 3).map((tech, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>

                      <Button
                        asChild
                        variant="outline"
                        className="border-gold text-gold hover:bg-gold/10 w-fit bg-transparent"
                      >
                        <Link href={`/portfolio/${project.id}`}>
                          View Case Study
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </section>

      {/* All Projects Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">More Projects</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects
              .filter((p) => !p.featured)
              .map((project) => (
                <Card
                  key={project.id}
                  className="border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-card group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="pt-6 pb-6 px-6">
                    <Badge variant="secondary" className="bg-gold/10 text-gold border-gold/20 mb-4">
                      {project.industry}
                    </Badge>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-gold transition-colors">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                      {project.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {project.results.slice(0, 2).map((result, idx) => (
                        <div key={idx}>
                          <div className="text-lg font-bold text-gold">{result.value}</div>
                          <div className="text-xs text-muted-foreground">{result.metric}</div>
                        </div>
                      ))}
                    </div>

                    <Link
                      href={`/portfolio/${project.id}`}
                      className="inline-flex items-center text-gold hover:text-gold/80 font-medium transition-colors text-sm group"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Industries I Serve</h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            I've built AI solutions for businesses across diverse industries
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {industries.map((industry) => (
              <Badge key={industry} variant="outline" className="text-base px-4 py-2">
                {industry}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-balance">Ready to See Similar Results?</h2>
          <p className="text-lg text-primary-foreground/80 mb-8 leading-relaxed text-pretty">
            Let's discuss how AI automation can transform your business. Free consultation, no commitment.
          </p>
          <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
            <Link href="/contact">Schedule Free Consultation</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
