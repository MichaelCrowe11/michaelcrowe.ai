import type React from "react"
import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { StarfieldBackground } from "@/components/starfield-background"
import { FireworkStars } from "@/components/firework-stars"
import { StructuredData } from "@/components/structured-data"
import { AIChatAssistant } from "@/components/ai-chat-assistant"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://michaelcrowe.ai"),
  title: {
    default: "Michael Crowe | AI Systems Architect & Automation Expert",
    template: "%s | Michael Crowe"
  },
  description:
    "Award-winning AI Systems Architect who scaled Southwest Mushrooms from garage to $470K annually. Built 150+ AI agents for pharmaceutical research. I build AI systems that actually work for small businesses.",
  keywords: [
    "AI Systems Architect",
    "AI Automation",
    "Small Business AI",
    "Machine Learning Consultant",
    "AI Agent Development",
    "Business Automation",
    "Crowe Logic",
    "CriOS Nova",
    "AI Strategy",
    "Custom AI Solutions"
  ],
  authors: [{ name: "Michael Crowe", url: "https://michaelcrowe.ai" }],
  creator: "Michael Crowe",
  publisher: "Michael Crowe",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://michaelcrowe.ai",
    siteName: "Michael Crowe - AI Systems Architect",
    title: "Michael Crowe | AI Systems That Actually Work",
    description:
      "Self-taught developer who scaled a business to $470K annually. Built 150+ AI agents. I build AI systems that actually work for small businesses.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Michael Crowe - AI Systems Architect"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Michael Crowe | AI Systems Architect",
    description: "Building AI systems that actually work for small businesses",
    images: ["/og-image.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  verification: {
    google: "your-google-verification-code", // Add your actual verification code
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-black`}>
        {/* 10,088 Interactive Stars Background - Always visible */}
        <StarfieldBackground />

        {/* Main Content - Floating in cosmos */}
        <div className="relative z-10">
          <Header />
          {children}
          <Footer />
        </div>

        {/* AI Sales Assistant - Always available */}
        <AIChatAssistant />

        <Analytics />
      </body>
    </html>
  )
}
