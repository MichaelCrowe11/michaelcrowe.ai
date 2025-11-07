/**
 * Application Configuration
 * Centralizes all environment variables and configuration values
 */

export const config = {
  // Contact Information
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'Michael@crowelogic.com',
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '(480) 322-5761',
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/in/michael-crowe-b4b567256/',
  },

  // Branding
  branding: {
    logoUrl: process.env.NEXT_PUBLIC_LOGO_URL || 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/crowe-logic-logo-87FZNrbBWYjPIm7AaAVgQ2TQIx435b.png',
    companyName: process.env.NEXT_PUBLIC_COMPANY_NAME || 'Crowe Logic',
  },

  // Site Configuration
  site: {
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://michaelcrowe.ai',
    starDataUrl: process.env.NEXT_PUBLIC_STAR_DATA_URL || '/data.json',
  },

  // API Configuration (server-side only)
  api: {
    // Email Services
    emailFrom: process.env.EMAIL_FROM || 'noreply@michaelcrowe.ai',
    emailTo: process.env.EMAIL_TO || 'Michael@crowelogic.com',
    resendKey: process.env.RESEND_API_KEY,
    sendgridKey: process.env.SENDGRID_API_KEY,
    mailgunKey: process.env.MAILGUN_API_KEY,
    mailgunDomain: process.env.MAILGUN_DOMAIN,
    
    // AI Services
    openaiKey: process.env.OPENAI_API_KEY,
    anthropicKey: process.env.ANTHROPIC_API_KEY,
    elevenLabsKey: process.env.ELEVENLABS_API_KEY,
    elevenLabsVoiceId: process.env.ELEVENLABS_VOICE_ID,
    
    // Analytics & Tracking
    gaId: process.env.NEXT_PUBLIC_GA_ID,
    hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID,
    posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    
    // Calendar Integration
    calComApiKey: process.env.CAL_COM_API_KEY,
    calendlyToken: process.env.CALENDLY_TOKEN,
  },
} as const

export type Config = typeof config
