/**
 * Application Configuration
 * Centralizes all environment variables and configuration values
 */

export const config = {
  // Contact Information
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@michaelcrowe.ai',
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '480-322-5761',
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com/in/michaelcrowe',
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
    emailServiceKey: process.env.EMAIL_SERVICE_API_KEY,
    emailFrom: process.env.EMAIL_FROM || 'noreply@michaelcrowe.ai',
    emailTo: process.env.EMAIL_TO || 'hello@michaelcrowe.ai',
  },
} as const

export type Config = typeof config
