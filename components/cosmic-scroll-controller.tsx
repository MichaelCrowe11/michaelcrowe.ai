"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function CosmicScrollController() {
  const cameraRef = useRef({ rotation: 0, zoom: 50 })

  useEffect(() => {
    // Prevent running on server
    if (typeof window === "undefined") return

    // Create smooth scroll experience
    const sections = gsap.utils.toArray(".cosmic-section")

    // Animate each section with a cinematic entrance
    sections.forEach((section: any, i) => {
      gsap.fromTo(
        section,
        {
          opacity: 0,
          y: 100,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 20%",
            toggleActions: "play none none reverse",
          },
        }
      )
    })

    // Parallax effect for cards
    const cards = gsap.utils.toArray(".cosmic-card")
    cards.forEach((card: any, i) => {
      const depth = (i % 3) + 1 // Varying depths
      gsap.to(card, {
        y: -50 * depth,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      })
    })

    // Hero entrance animation
    gsap.fromTo(
      ".hero-content",
      {
        opacity: 0,
        scale: 0.8,
        y: 50,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.5,
        ease: "power4.out",
        delay: 0.3,
      }
    )

    // Animate hero stats
    gsap.fromTo(
      ".hero-stat",
      {
        opacity: 0,
        scale: 0,
        rotateY: 180,
      },
      {
        opacity: 1,
        scale: 1,
        rotateY: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        stagger: 0.15,
        delay: 1,
      }
    )

    // Camera zoom effect on scroll
    gsap.to(cameraRef.current, {
      zoom: 25,
      rotation: 0.5,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 2,
        onUpdate: (self) => {
          // Could update starfield camera here if we expose it
          const event = new CustomEvent("cosmic-scroll", {
            detail: {
              progress: self.progress,
              zoom: cameraRef.current.zoom,
              rotation: cameraRef.current.rotation,
            },
          })
          window.dispatchEvent(event)
        },
      },
    })

    // Floating animation for glass panels
    const panels = gsap.utils.toArray(".glass-panel")
    panels.forEach((panel: any) => {
      gsap.to(panel, {
        y: "random(-10, 10)",
        x: "random(-5, 5)",
        rotation: "random(-1, 1)",
        duration: "random(3, 5)",
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      })
    })

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return null // This component just manages animations
}
