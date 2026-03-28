import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { config } from '@/lib/config'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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

    // Send email notification using Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #C9A961 0%, #8B7355 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                .field { margin-bottom: 20px; }
                .label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
                .value { font-size: 16px; color: #333; }
                .message-box { background: white; padding: 15px; border-left: 4px solid #C9A961; margin-top: 10px; }
                .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0;">🚀 New Contact Form Submission</h1>
                  <p style="margin: 10px 0 0 0; opacity: 0.9;">michaelcrowe.ai</p>
                </div>
                <div class="content">
                  <div class="field">
                    <div class="label">Name</div>
                    <div class="value">${validatedData.name}</div>
                  </div>

                  <div class="field">
                    <div class="label">Email</div>
                    <div class="value"><a href="mailto:${validatedData.email}">${validatedData.email}</a></div>
                  </div>

                  ${validatedData.company ? `
                  <div class="field">
                    <div class="label">Company</div>
                    <div class="value">${validatedData.company}</div>
                  </div>
                  ` : ''}

                  ${validatedData.phone ? `
                  <div class="field">
                    <div class="label">Phone</div>
                    <div class="value"><a href="tel:${validatedData.phone}">${validatedData.phone}</a></div>
                  </div>
                  ` : ''}

                  ${validatedData.service ? `
                  <div class="field">
                    <div class="label">Service Interest</div>
                    <div class="value">${validatedData.service}</div>
                  </div>
                  ` : ''}

                  <div class="field">
                    <div class="label">Message</div>
                    <div class="message-box">${validatedData.message.replace(/\n/g, '<br>')}</div>
                  </div>

                  <div class="footer">
                    <p><strong>Next Steps:</strong></p>
                    <ol>
                      <li>Reply within 24 hours</li>
                      <li>Qualify the lead (budget, timeline, decision maker)</li>
                      <li>Send calendar link for discovery call</li>
                      <li>Add to HubSpot CRM</li>
                    </ol>
                    <p style="margin-top: 20px;">Received at: ${new Date().toLocaleString('en-US', { timeZone: 'America/Phoenix' })} (Arizona Time)</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `

        await resend.emails.send({
          from: 'Michael Crowe AI <noreply@michaelcrowe.ai>',
          to: 'michael@crowelogic.com',
          replyTo: validatedData.email,
          subject: `💼 New Lead: ${validatedData.name}${validatedData.company ? ` from ${validatedData.company}` : ''}`,
          html: emailHtml,
        })

        // Send auto-reply to customer
        const customerEmailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #C9A961 0%, #8B7355 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                .highlight { background: linear-gradient(135deg, rgba(201, 169, 97, 0.1) 0%, rgba(139, 115, 85, 0.1) 100%); padding: 20px; border-radius: 8px; border-left: 4px solid #C9A961; margin: 20px 0; }
                .button { display: inline-block; background: linear-gradient(135deg, #C9A961 0%, #8B7355 100%); color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; margin: 10px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0;">Thanks for Reaching Out! 🚀</h1>
                </div>
                <div class="content">
                  <p>Hi ${validatedData.name},</p>

                  <p>Thank you for your interest in AI automation for your business. I've received your message and will personally review it within the next 24 hours.</p>

                  <div class="highlight">
                    <p><strong>What happens next:</strong></p>
                    <ol>
                      <li>I'll review your specific needs and challenges</li>
                      <li>Prepare relevant case studies and examples</li>
                      <li>Send you a calendar link to schedule our call</li>
                      <li>Come prepared with actionable insights for your business</li>
                    </ol>
                  </div>

                  <p>In the meantime, feel free to:</p>
                  <ul>
                    <li><strong>Explore my portfolio:</strong> <a href="https://michaelcrowe.ai">michaelcrowe.ai</a></li>
                    <li><strong>Connect on LinkedIn:</strong> <a href="https://www.linkedin.com/in/michael-crowe-b4b567256/">Michael Crowe</a></li>
                    <li><strong>Call directly:</strong> <a href="tel:+14803225761">480-322-5761</a></li>
                  </ul>

                  <p>Looking forward to our conversation!</p>

                  <p style="margin-top: 30px;">
                    <strong>Michael Crowe</strong><br>
                    AI Systems Architect<br>
                    <a href="mailto:michael@crowelogic.com">michael@crowelogic.com</a><br>
                    <a href="tel:+14803225761">480-322-5761</a>
                  </p>
                </div>
              </div>
            </body>
          </html>
        `

        await resend.emails.send({
          from: 'Michael Crowe <michael@michaelcrowe.ai>',
          to: validatedData.email,
          subject: 'Thanks for reaching out! I\'ll be in touch within 24 hours',
          html: customerEmailHtml,
        })

      } catch (emailError) {
        console.error('Failed to send email:', emailError)
        // Continue even if email fails - still return success to user
      }
    } else {
      // Development mode - just log
      console.log('Contact form submission (RESEND_API_KEY not configured):', {
        name: validatedData.name,
        email: validatedData.email,
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
