import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getBlogPost, blogPosts } from "@/lib/blog-data"
import Image from "next/image"
import ReactMarkdown from "react-markdown"

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug)
  if (!post) return {}

  return {
    title: `${post.title} | Michael Crowe`,
    description: post.excerpt,
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      {/* Back Button */}
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <Link
            href="/blog"
            className="inline-flex items-center text-muted-foreground hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <article className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <Badge variant="secondary" className="bg-gold/10 text-gold border-gold/20 mb-4">
              {post.category}
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">{post.title}</h1>
            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>
            <div className="flex items-center gap-4 pb-8 border-b border-border">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/crowe-logic-logo-87FZNrbBWYjPIm7AaAVgQ2TQIx435b.png"
                  alt={post.author.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-medium">{post.author.name}</div>
                <div className="text-sm text-muted-foreground">{post.author.role}</div>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative h-96 mb-12 rounded-lg overflow-hidden">
            <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-6 prose-strong:text-foreground prose-strong:font-bold prose-ul:my-6 prose-li:text-foreground prose-li:mb-2">
            {post.content.map((paragraph, index) => (
              <ReactMarkdown key={index}>{paragraph}</ReactMarkdown>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 bg-muted/30 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-4">Want Similar Results for Your Business?</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Let's talk about how AI automation can solve your specific challenges. Free consultation, no commitment.
            </p>
            <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
              <Link href="/contact">Schedule Free Consultation</Link>
            </Button>
          </div>
        </div>
      </article>
    </main>
  )
}
