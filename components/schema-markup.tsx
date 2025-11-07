export function SchemaMarkup() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Michael Crowe - AI Consultant",
    "alternateName": "Crowe Logic AI",
    "description": "AI implementation consultant specializing in enterprise AI systems, custom AI agents, and automation frameworks. Creator of Crowe Logic and CriOS Nova.",
    "url": "https://michaelcrowe.ai",
    "founder": {
      "@type": "Person",
      "name": "Michael Crowe",
      "jobTitle": "AI Systems Architect",
      "description": "Founder of Crowe Logic AI and CriOS Nova. Built 150+ AI agents for pharmaceutical research and scaled businesses to $470k+ annually.",
    },
    "areaServed": "Worldwide",
    "priceRange": "$$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Phoenix",
      "addressRegion": "AZ",
      "addressCountry": "US"
    },
    "serviceType": [
      "AI Consulting",
      "AI Implementation",
      "Fractional AI Advisory",
      "Custom AI Development",
      "Enterprise AI Strategy",
      "AI Agent Development"
    ],
    "knowsAbout": [
      "Artificial Intelligence",
      "Machine Learning",
      "AI Automation",
      "Drug Discovery AI",
      "Enterprise AI Systems",
      "AI Agent Development",
      "Business Automation"
    ],
    "offers": [
      {
        "@type": "Offer",
        "name": "AI Strategy & Roadmap",
        "price": "15000",
        "priceCurrency": "USD",
        "description": "2-week comprehensive AI strategy and implementation roadmap"
      },
      {
        "@type": "Offer",
        "name": "AI Implementation Intensive",
        "price": "45000",
        "priceCurrency": "USD",
        "description": "6-week intensive with 5-7 high-impact automations built and deployed"
      },
      {
        "@type": "Offer",
        "name": "Executive AI Advisory",
        "price": "15000",
        "priceCurrency": "USD",
        "description": "Monthly fractional AI advisory services"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "47"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
