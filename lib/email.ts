import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder')

export async function sendLeadNotification(lead: {
  name: string
  email: string
  company?: string
  phone?: string
  service_interest?: string
  budget_range?: string
  timeline?: string
  lead_score: number
  conversation_id?: string
}) {
  // Skip if in dev mode or no API key
  if (process.env.NEXT_PUBLIC_DEV_MODE === 'true' || process.env.RESEND_API_KEY?.includes('placeholder')) {
    console.log('[DEV MODE] Would send email notification:', lead)
    return { success: true, devMode: true }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'AI Assistant <noreply@michaelcrowe.ai>',
      to: process.env.EMAIL_TO || 'hello@michaelcrowe.ai',
      subject: `🔥 Hot Lead: ${lead.name} (Score: ${lead.lead_score}/100)`,
      html: generateLeadEmailHTML(lead)
    })

    if (error) {
      console.error('Failed to send email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email service error:', error)
    return { success: false, error }
  }
}

function generateLeadEmailHTML(lead: any): string {
  const budgetLabels: Record<string, string> = {
    'under_5k': 'Under $5K',
    '5k_to_15k': '$5K - $15K',
    '15k_to_50k': '$15K - $50K',
    '50k_plus': '$50K+'
  }

  const timelineLabels: Record<string, string> = {
    'exploring': 'Exploring',
    'next_quarter': 'Next Quarter',
    'next_month': 'Next Month',
    'urgent': 'Urgent (This Week)'
  }

  const scoreColor = lead.lead_score >= 80 ? '#22c55e' : lead.lead_score >= 60 ? '#eab308' : '#ef4444'

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Lead Notification</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <div style="background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0; color: #000; font-size: 28px;">🔥 New Qualified Lead!</h1>
  </div>

  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #ddd;">

    <!-- Lead Score -->
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="display: inline-block; padding: 15px 30px; background: ${scoreColor}; color: white; border-radius: 50px; font-size: 24px; font-weight: bold;">
        Lead Score: ${lead.lead_score}/100
      </div>
    </div>

    <!-- Contact Info -->
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h2 style="margin-top: 0; color: #d4af37; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">
        Contact Information
      </h2>
      <table style="width: 100%;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; width: 120px;">Name:</td>
          <td style="padding: 8px 0;">${lead.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Email:</td>
          <td style="padding: 8px 0;"><a href="mailto:${lead.email}" style="color: #d4af37; text-decoration: none;">${lead.email}</a></td>
        </tr>
        ${lead.company ? `
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Company:</td>
          <td style="padding: 8px 0;">${lead.company}</td>
        </tr>
        ` : ''}
        ${lead.phone ? `
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
          <td style="padding: 8px 0;"><a href="tel:${lead.phone}" style="color: #d4af37; text-decoration: none;">${lead.phone}</a></td>
        </tr>
        ` : ''}
      </table>
    </div>

    <!-- Qualification Details -->
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h2 style="margin-top: 0; color: #d4af37; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">
        Qualification Details
      </h2>
      <table style="width: 100%;">
        ${lead.service_interest ? `
        <tr>
          <td style="padding: 8px 0; font-weight: bold; width: 150px;">Service Interest:</td>
          <td style="padding: 8px 0;"><span style="background: #d4af37; color: white; padding: 4px 12px; border-radius: 20px; font-size: 14px;">${lead.service_interest}</span></td>
        </tr>
        ` : ''}
        ${lead.budget_range ? `
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Budget Range:</td>
          <td style="padding: 8px 0;">${budgetLabels[lead.budget_range] || lead.budget_range}</td>
        </tr>
        ` : ''}
        ${lead.timeline ? `
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Timeline:</td>
          <td style="padding: 8px 0;">${timelineLabels[lead.timeline] || lead.timeline}</td>
        </tr>
        ` : ''}
      </table>
    </div>

    <!-- Action Buttons -->
    <div style="text-align: center; margin-top: 30px;">
      <a href="mailto:${lead.email}?subject=Re: AI Consultation Inquiry"
         style="display: inline-block; background: #d4af37; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 0 10px 10px 0;">
        📧 Reply to Lead
      </a>
      ${lead.conversation_id ? `
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/dashboard?conversation=${lead.conversation_id}"
         style="display: inline-block; background: #333; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 0 10px 10px 0;">
        💬 View Conversation
      </a>
      ` : ''}
    </div>

    <!-- Footer -->
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 14px;">
      <p>This lead was automatically qualified by your AI Sales Assistant</p>
      <p style="margin: 5px 0;">Powered by Claude AI • Built by Michael Crowe</p>
    </div>

  </div>

</body>
</html>
`
}

export async function sendWelcomeEmail(lead: { name: string; email: string }) {
  // Skip if in dev mode
  if (process.env.NEXT_PUBLIC_DEV_MODE === 'true' || process.env.RESEND_API_KEY?.includes('placeholder')) {
    console.log('[DEV MODE] Would send welcome email to:', lead.email)
    return { success: true, devMode: true }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Michael Crowe <hello@michaelcrowe.ai>',
      to: lead.email,
      subject: 'Thanks for reaching out!',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <div style="background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0; color: #000; font-size: 28px;">Thanks for Reaching Out, ${lead.name}!</h1>
  </div>

  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #ddd;">

    <p style="font-size: 16px; margin-bottom: 20px;">
      I appreciate you taking the time to explore how AI can transform your business. I've received your inquiry and will personally review it.
    </p>

    <p style="font-size: 16px; margin-bottom: 20px;">
      I typically respond within 24 hours (often much sooner). In the meantime, here are some resources you might find helpful:
    </p>

    <ul style="font-size: 16px; margin-bottom: 20px;">
      <li style="margin-bottom: 10px;"><strong>Case Studies:</strong> See real results from businesses like yours at <a href="${process.env.NEXT_PUBLIC_SITE_URL}/portfolio" style="color: #d4af37;">michaelcrowe.ai/portfolio</a></li>
      <li style="margin-bottom: 10px;"><strong>Blog:</strong> Learn about AI implementation at <a href="${process.env.NEXT_PUBLIC_SITE_URL}/blog" style="color: #d4af37;">michaelcrowe.ai/blog</a></li>
      <li style="margin-bottom: 10px;"><strong>Services:</strong> Explore service options at <a href="${process.env.NEXT_PUBLIC_SITE_URL}/services" style="color: #d4af37;">michaelcrowe.ai/services</a></li>
    </ul>

    <p style="font-size: 16px; margin-bottom: 30px;">
      Looking forward to speaking with you soon!
    </p>

    <p style="font-size: 16px; margin-bottom: 10px;">
      Best,<br>
      <strong>Michael Crowe</strong><br>
      AI Systems Architect<br>
      <a href="mailto:hello@michaelcrowe.ai" style="color: #d4af37;">hello@michaelcrowe.ai</a>
    </p>

  </div>

</body>
</html>
`
    })

    if (error) {
      console.error('Failed to send welcome email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email service error:', error)
    return { success: false, error }
  }
}
