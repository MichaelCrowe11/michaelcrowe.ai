import type React from "react"
import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CosmicBackground } from "@/components/cosmic-background"
import { ShootingStars } from "@/components/shooting-stars"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" })

export const metadata: Metadata = {
  title: "Michael Crowe | AI Systems Architect",
  description:
    "Self-taught developer who scaled a business from hobby to $470K annually. Now I help small businesses automate with AI.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased cosmic-nebula`}>
        {/* Cosmic Background Effects */}
        <CosmicBackground />
        <ShootingStars />

        {/* Main Content with relative positioning */}
        <div className="relative z-10">
          <Header />
          {children}
          <Footer />
        </div>

        <Analytics />
      </body>
    </html>
  )
}
