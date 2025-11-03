export function StructuredData() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Michael Crowe",
    jobTitle: "AI Systems Architect",
    url: "https://michaelcrowe.ai",
    sameAs: [
      "https://www.linkedin.com/in/michaelcrowe",
      "https://github.com/michaelcrowe"
    ],
    description: "AI Systems Architect who scaled Southwest Mushrooms from garage to $470K annually. Built 150+ AI agents for pharmaceutical research.",
    knowsAbout: [
      "Artificial Intelligence",
      "Machine Learning",
      "Business Automation",
      "AI Agent Development",
      "Small Business Consulting"
    ]
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Michael Crowe - AI Systems Architect",
    founder: {
      "@type": "Person",
      name: "Michael Crowe"
    },
    url: "https://michaelcrowe.ai",
    description: "Professional AI systems architecture and automation services for small businesses",
    priceRange: "$$$",
    areaServed: "Worldwide",
    serviceType: [
      "AI Strategy & Consulting",
      "AI Implementation",
      "Business Automation",
      "Custom AI Solutions"
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  )
}
