export function StorySection() {
  const stages = [
    {
      title: "At 15, I Started Growing Mushrooms",
      description:
        "No business plan. Just curiosity and experimentation. I began growing mushrooms as a hobby, learning the science behind cultivation.",
    },
    {
      title: "At 26, I Founded Southwest Mushrooms",
      description:
        "Turned my passion into a real business. But working 80+ hour weeks, I realized I needed automation or I'd burn out. So I taught myself to code.",
    },
    {
      title: "Automated Everything",
      description:
        "Climate control. Customer orders. Inventory management. Production scheduling. Email follow-ups. If it was repetitive, I automated it.",
    },
  ]

  const stats = [
    { value: "1,200-1,500", label: "lbs/week" },
    { value: "7", label: "continents served" },
    { value: "$470,000", label: "annual revenue" },
    { value: "300,000+", label: "followers" },
  ]

  return (
    <section id="story" className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            How I Used AI to Scale From Hobby to Global Business
          </h2>
        </div>

        {/* Timeline */}
        <div className="space-y-12 mb-16">
          {stages.map((stage, index) => (
            <div key={index} className="relative pl-8 border-l-2 border-gold/30">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-gold"></div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3">{stage.title}</h3>
              <p className="text-primary-foreground/80 leading-relaxed">{stage.description}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16 py-12 border-y border-gold/30">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-gold mb-2">{stat.value}</div>
              <div className="text-sm text-primary-foreground/70">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Final Stage */}
        <div className="relative pl-8 border-l-2 border-gold/30">
          <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-gold"></div>
          <h3 className="text-xl sm:text-2xl font-bold mb-3">Now I Build These Systems For You</h3>
          <p className="text-primary-foreground/80 leading-relaxed">
            What took me years to figure out, I can build for your business in weeks. You don&apos;t need to learn to
            code. You just need to know what&apos;s wasting your time.
          </p>
        </div>
      </div>
    </section>
  )
}
