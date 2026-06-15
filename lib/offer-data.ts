/**
 * Single source of truth for the consulting offer.
 *
 * Every pricing surface (the Services page, the chat sales engine, and the
 * contact FAQ) reads from here so numbers never drift apart again.
 */

export const MINIMUM_ENGAGEMENT = "$5,000"

export type OfferIcon =
  | "Sparkles"
  | "Zap"
  | "Rocket"
  | "Crown"
  | "Search"
  | "Lightbulb"

export interface OfferTier {
  id: string
  icon: OfferIcon
  name: string
  price: string
  duration: string
  tagline: string
  features: string[]
  outcome: string
  highlighted?: boolean
  borderColor: string
  bgGradient: string
}

export interface EntryPoint {
  id: string
  icon: OfferIcon
  name: string
  price: string
  duration: string
  features: string[]
}

export const coreTiers: OfferTier[] = [
  {
    id: "ai-strategy",
    icon: "Sparkles",
    name: "AI Strategy & Roadmap",
    price: "$15,000",
    duration: "2 Weeks",
    tagline: "Know exactly where AI fits in your business",
    features: [
      "Full business & technical audit (2-3 day deep dive)",
      "Custom AI strategy aligned with your business goals",
      "Detailed 25-page implementation roadmap with ROI projections",
      "Technology stack recommendations",
      "Build vs. buy analysis",
      "2-hour executive presentation",
      "90 days of strategic support",
    ],
    outcome: "Know exactly where AI fits, what to build first, and what ROI to expect.",
    borderColor: "border-gold/30",
    bgGradient: "from-gold/5 to-gold/10",
  },
  {
    id: "ai-implementation",
    icon: "Zap",
    name: "AI Implementation Intensive",
    price: "$45,000",
    duration: "6 Weeks",
    tagline: "Get 5-7 automations built and deployed",
    features: [
      "Everything in Strategy & Roadmap, PLUS:",
      "Custom AI solution architecture leveraging Crowe Logic methodology",
      "5-7 high-impact automations built and deployed",
      "Integration with your existing enterprise systems",
      "Team training and documentation",
      "60 days of post-launch optimization",
      "Direct access to me throughout",
    ],
    outcome: "50-100+ hours/week saved across your organization. Systems that actually work.",
    highlighted: true,
    borderColor: "border-gold",
    bgGradient: "from-gold/10 to-accent/10",
  },
  {
    id: "executive-advisory",
    icon: "Rocket",
    name: "Executive AI Advisory",
    price: "$15,000/mo",
    duration: "6-month minimum",
    tagline: "Your interim Chief AI Officer",
    features: [
      "15 hours/month of direct strategic guidance",
      "Unlimited async access (Slack/email, 12hr response time)",
      "Weekly 1-hour strategy calls",
      "Quarterly roadmap reviews",
      "Introductions to my network (vendors, partners, investors)",
      "Priority access for implementation projects",
      "I act as your interim Chief AI Officer",
    ],
    outcome: "Limited to 3 clients at a time.",
    borderColor: "border-accent/30",
    bgGradient: "from-accent/5 to-accent/10",
  },
  {
    id: "custom-platform",
    icon: "Crown",
    name: "Custom Platform Development",
    price: "$100,000+",
    duration: "3-6 months",
    tagline: "Enterprise-grade AI infrastructure",
    features: [
      "Industry-specific AI agent frameworks",
      "Custom Crowe Logic implementations",
      "Proprietary automation platforms",
      "Enterprise-grade AI infrastructure",
    ],
    outcome: "This is what I've built for my own companies. Now available for select clients.",
    borderColor: "border-purple-500/30",
    bgGradient: "from-purple-500/5 to-purple-500/10",
  },
]

export const entryPoints: EntryPoint[] = [
  {
    id: "discovery-intensive",
    icon: "Search",
    name: "Discovery Intensive",
    price: "$7,500",
    duration: "3 Days",
    features: [
      "3 full days of deep-dive consultation",
      "Immediate AI opportunity identification",
      "Quick-win implementation plan",
      "Proof-of-concept for one automation",
      "Fully credited toward Implementation Intensive if you upgrade within 30 days",
    ],
  },
  {
    id: "ai-audit",
    icon: "Lightbulb",
    name: "AI Audit",
    price: "$5,000",
    duration: "1 Week",
    features: [
      "Async audit of your current operations",
      "Video walkthrough of 3-5 AI opportunities specific to your business",
      "Prioritization matrix (effort vs. impact)",
      "60-minute live Q&A",
    ],
  },
]
