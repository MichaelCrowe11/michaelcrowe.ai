import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Substrate to Harvest · Southwest Mushrooms Game",
  description: "A commercial mushroom cultivation tycoon game by Southwest Mushrooms and Crowe Logic, Inc. Real cultivation science, real business, real fun. Play free in your browser.",
  openGraph: {
    title: "Substrate to Harvest — Southwest Mushrooms Game",
    description: "Grow real mushrooms in a real business simulator. Start in a Phoenix garage, scale to a global brand.",
    type: "website",
  },
}

export default function GamePage() {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#0f0a07" }}>
      <iframe
        src="/games/substrate-to-harvest/index.html"
        title="Substrate to Harvest — Southwest Mushrooms cultivation game"
        style={{
          width: "100%",
          height: "100%",
          border: 0,
          display: "block",
        }}
        allow="fullscreen"
      />
    </div>
  )
}
