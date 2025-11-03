import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { blogPosts } from "@/lib/blog-data"
import Image from "next/image"

export const metadata = {
  title: "Blog & Case Studies | Michael Crowe",
  description: "Real-world AI automation case studies, tutorials, and insights for small business owners.",
}

export default function BlogPage() {
  const categories = ["All", "Case Study", "Tutorial", "Insights", "Industry Trends"] as const

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-block mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full border border-gold text-gold text-sm font-medium">
              Blog & Case Studies
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            Real Results, Real Businesses
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed text-pretty">
            Case studies, tutorials, and insights on AI automation for small businesses. No fluff, just practical advice
            and proven results.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card className="border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-card h-full group">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="pt-6 pb-6 px-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge variant="secondary" className="bg-gold/10 text-gold border-gold/20">
                        {post.category}
                      </Badge>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold mb-3 text-card-foreground group-hover:text-gold transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{post.excerpt}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-balance">Want Results Like These?</h2>
          <p className="text-lg text-primary-foreground/80 mb-8 leading-relaxed text-pretty">
            Let's talk about how AI automation can transform your business. Free consultation, no commitment.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-gold text-gold-foreground hover:bg-gold/90 rounded-md font-medium transition-colors"
          >
            Schedule Free Consultation
          </Link>
        </div>
      </section>
    </main>
  )
}
