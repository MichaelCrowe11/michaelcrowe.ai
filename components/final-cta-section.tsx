import { Button } from "@/components/ui/button"
import Link from "next/link"

export function FinalCTASection() {
  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground ml-0 lg:ml-24">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-balance">Ready to Get Your Time Back?</h2>
        <p className="text-lg sm:text-xl text-primary-foreground/80 mb-8 leading-relaxed text-pretty">
          Let&apos;s talk about what&apos;s wasting your time and how AI can fix it. No sales pitch. Just a conversation
          about your business.
        </p>
        <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90 text-lg px-8 py-6">
          <Link href="/contact">Schedule Your Free Discovery Call</Link>
        </Button>
        <p className="text-sm text-primary-foreground/60 mt-6">30-minute call • No commitment • Just honest advice</p>
      </div>
    </section>
  )
}
