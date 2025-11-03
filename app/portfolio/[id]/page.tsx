import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { projects } from "@/lib/portfolio-data"
import Image from "next/image"

export function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }))
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const project = projects.find((p) => p.id === params.id)
  if (!project) return {}

  return {
    title: `${project.title} - ${project.client} | Michael Crowe`,
    description: project.description,
  }
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const project = projects.find((p) => p.id === params.id)

  if (!project) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      {/* Back Button */}
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <Link
            href="/portfolio"
            className="inline-flex items-center text-muted-foreground hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portfolio
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="bg-gold/10 text-gold border-gold/20 mb-4">
                {project.industry}
              </Badge>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">{project.title}</h1>
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">{project.client}</p>
              <p className="text-lg leading-relaxed">{project.description}</p>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Results Stats */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {project.results.map((result, index) => (
              <div key={index}>
                <div className="text-4xl sm:text-5xl font-bold text-gold mb-2">{result.value}</div>
                <div className="text-primary-foreground/80">{result.metric}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenge & Solution */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border-border bg-card">
              <CardContent className="pt-8 pb-8 px-8">
                <h2 className="text-2xl font-bold mb-4 text-gold">The Challenge</h2>
                <p className="text-muted-foreground leading-relaxed">{project.challenge}</p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="pt-8 pb-8 px-8">
                <h2 className="text-2xl font-bold mb-4 text-gold">The Solution</h2>
                <p className="text-muted-foreground leading-relaxed">{project.solution}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Technologies & Approach</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {project.technologies.map((tech, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-1">{tech}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-balance">Want Similar Results for Your Business?</h2>
          <p className="text-lg text-primary-foreground/80 mb-8 leading-relaxed text-pretty">
            Let's talk about how AI automation can solve your specific challenges. Free consultation, no commitment.
          </p>
          <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
            <Link href="/contact">Schedule Free Consultation</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
