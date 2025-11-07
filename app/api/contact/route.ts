import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { config } from '@/lib/config'

// Contact form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  company: z.string().max(100, 'Company name is too long').optional(),
  phone: z.string().max(20, 'Phone number is too long').optional(),
  service: z.string().max(50, 'Service selection is invalid').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message is too long'),
})

// Rate limiting map (in-memory for demo - use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Simple rate limiting function
function checkRateLimit(identifier: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const windowMs = 60 * 60 * 1000 // 1 hour
  const maxRequests = 5

  const record = rateLimitMap.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1 }
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  record.count++
  return { allowed: true, remaining: maxRequests - record.count }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'

    // Check rate limit
    const rateLimit = checkRateLimit(ip)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(Date.now() + 60 * 60 * 1000).toISOString(),
          }
        }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = contactFormSchema.parse(body)

    // Try to send email using available service
    let emailSent = false
    let emailError = null

    // Try Resend first (recommended)
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey && !emailSent) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: config.api.emailFrom,
            to: config.api.emailTo,
            subject: `New Contact: ${validatedData.name} - ${validatedData.service || 'General Inquiry'}`,
            html: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${validatedData.name}</p>
              <p><strong>Email:</strong> ${validatedData.email}</p>
              ${validatedData.company ? `<p><strong>Company:</strong> ${validatedData.company}</p>` : ''}
              ${validatedData.phone ? `<p><strong>Phone:</strong> ${validatedData.phone}</p>` : ''}
              ${validatedData.service ? `<p><strong>Service Interest:</strong> ${validatedData.service}</p>` : ''}
              <p><strong>Message:</strong></p>
              <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
              <hr>
              <p><small>Submitted: ${new Date().toISOString()}</small></p>
            `,
          }),
        })

        if (response.ok) {
          emailSent = true
          console.log('Email sent via Resend')
        }
      } catch (error) {
        console.error('Resend error:', error)
        emailError = error
      }
    }

    // Try SendGrid as fallback
    const sendgridKey = process.env.SENDGRID_API_KEY
    if (sendgridKey && !emailSent) {
      try {
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sendgridKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            personalizations: [{
              to: [{ email: config.api.emailTo }],
              subject: `New Contact: ${validatedData.name}`,
            }],
            from: { email: config.api.emailFrom },
            content: [{
              type: 'text/html',
              value: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${validatedData.name}</p>
                <p><strong>Email:</strong> ${validatedData.email}</p>
                ${validatedData.company ? `<p><strong>Company:</strong> ${validatedData.company}</p>` : ''}
                ${validatedData.phone ? `<p><strong>Phone:</strong> ${validatedData.phone}</p>` : ''}
                ${validatedData.service ? `<p><strong>Service:</strong> ${validatedData.service}</p>` : ''}
                <p><strong>Message:</strong></p>
                <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
              `,
            }],
          }),
        })

        if (response.ok) {
          emailSent = true
          console.log('Email sent via SendGrid')
        }
      } catch (error) {
        console.error('SendGrid error:', error)
        emailError = error
      }
    }

    // Try Mailgun as fallback
    const mailgunKey = process.env.MAILGUN_API_KEY
    const mailgunDomain = process.env.MAILGUN_DOMAIN
    if (mailgunKey && mailgunDomain && !emailSent) {
      try {
        const formData = new URLSearchParams()
        formData.append('from', config.api.emailFrom)
        formData.append('to', config.api.emailTo)
        formData.append('subject', `New Contact: ${validatedData.name}`)
        formData.append('html', `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${validatedData.name}</p>
          <p><strong>Email:</strong> ${validatedData.email}</p>
          ${validatedData.company ? `<p><strong>Company:</strong> ${validatedData.company}</p>` : ''}
          ${validatedData.phone ? `<p><strong>Phone:</strong> ${validatedData.phone}</p>` : ''}
          ${validatedData.service ? `<p><strong>Service:</strong> ${validatedData.service}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
        `)

        const response = await fetch(`https://api.mailgun.net/v3/${mailgunDomain}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${Buffer.from(`api:${mailgunKey}`).toString('base64')}`,
          },
          body: formData,
        })

        if (response.ok) {
          emailSent = true
          console.log('Email sent via Mailgun')
        }
      } catch (error) {
        console.error('Mailgun error:', error)
        emailError = error
      }
    }

    // Log to observability endpoint
    try {
      await fetch(`${config.site.url}/api/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: emailSent ? 'info' : 'error',
          message: emailSent ? 'Contact form submitted' : 'Contact form submitted but email failed',
          context: {
            name: validatedData.name,
            email: validatedData.email,
            service: validatedData.service,
            emailSent,
            timestamp: new Date().toISOString(),
          },
        }),
      })
    } catch (logError) {
      console.error('Failed to log submission:', logError)
    }

    // For development, log the submission
    if (process.env.NODE_ENV === 'development') {
      console.log('Contact form submission:', {
        ...validatedData,
        emailSent,
        timestamp: new Date().toISOString(),
      })
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your message! I\'ll get back to you within 24 hours.',
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        }
      }
    )

  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      )
    }

    // Handle other errors
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again or email directly.' },
      { status: 500 }
    )
  }
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
