import type React from "react"
import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { StarfieldBackground } from "@/components/starfield-background"
import { FireworkStars } from "@/components/firework-stars"
import { SchemaMarkup } from "@/components/schema-markup"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" })

export const metadata: Metadata = {
  title: "Michael Crowe - AI Implementation Consultant | Crowe Logic & CriOS Nova",
  description:
    "AI consultant who's built production systems generating $470k+/year. Crowe Logic framework, 150+ AI agents for drug discovery. Implementation in weeks, not years. $15k-500k engagements.",
  keywords: [
    "AI consultant",
    "AI implementation consultant",
    "fractional AI advisor",
    "custom AI automation",
    "enterprise AI strategy",
    "AI consultant Phoenix",
    "drug discovery AI",
    "AI agent development",
    "pharmaceutical AI consultant",
    "automotive AI consultant",
    "Crowe Logic",
    "CriOS Nova",
  ],
  authors: [{ name: "Michael Crowe" }],
  creator: "Michael Crowe",
  openGraph: {
    title: "Michael Crowe - AI Implementation Consultant",
    description: "Production AI systems that actually work. Crowe Logic framework powering real businesses.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Michael Crowe - AI Implementation Consultant",
    description: "Built 150+ AI agents for drug discovery. $470k+ revenue from AI systems.",
    creator: "@michaelcrowe",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <SchemaMarkup />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        {/* Main Content */}
        {children}

        <Analytics />
      </body>
    </html>
  )
}
