import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

let resendInstance: Resend | null = null
function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null
  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY)
  }
  return resendInstance
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, company, interest, budget, timeline, source } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // In production, integrate with HubSpot, Pipedrive, or your CRM
    // For now, we'll log the lead and send email notification

    const leadData = {
      name,
      email,
      company,
      interest,
      budget,
      timeline,
      source: source || "michaelcrowe.ai",
      timestamp: new Date().toISOString()
    }

    console.log("New lead captured:", leadData)

    // Send email notification
    await sendLeadNotification(leadData)

    // Add to HubSpot CRM
    if (process.env.HUBSPOT_API_KEY) {
      try {
        const hubspotContact = await createHubSpotContact(leadData)
        console.log("HubSpot contact created:", hubspotContact?.id)
      } catch (error) {
        console.error("HubSpot integration error:", error)
        // Continue even if HubSpot fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "Lead captured successfully",
      leadId: `lead_${Date.now()}`
    })
  } catch (error) {
    console.error("Lead capture error:", error)
    return NextResponse.json({ error: "Failed to capture lead" }, { status: 500 })
  }
}

async function sendLeadNotification(lead: any) {
  const resend = getResend()
  if (!resend) {
    console.log("Lead notification (RESEND_API_KEY not configured):", lead)
    return { success: false, reason: "No API key" }
  }

  try {
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #C9A961 0%, #8B7355 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; }
            .value { font-size: 16px; color: #333; margin-top: 3px; }
            .priority { display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; }
            .high-priority { background: #ef4444; color: white; }
            .medium-priority { background: #f59e0b; color: white; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🎯 New Lead Captured</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">From AI Chat Assistant</p>
            </div>
            <div class="content">
              <div style="margin-bottom: 20px;">
                ${lead.budget && parseInt(lead.budget.replace(/\D/g, '')) >= 10000 ? '<span class="priority high-priority">HIGH VALUE LEAD</span>' : '<span class="priority medium-priority">QUALIFIED LEAD</span>'}
              </div>

              <div class="field">
                <div class="label">Name</div>
                <div class="value">${lead.name || "Not provided"}</div>
              </div>

              <div class="field">
                <div class="label">Email</div>
                <div class="value"><a href="mailto:${lead.email}">${lead.email}</a></div>
              </div>

              ${lead.company ? `
              <div class="field">
                <div class="label">Company</div>
                <div class="value">${lead.company}</div>
              </div>
              ` : ''}

              <div class="field">
                <div class="label">Interest</div>
                <div class="value">${lead.interest || "Not specified"}</div>
              </div>

              <div class="field">
                <div class="label">Budget</div>
                <div class="value">${lead.budget || "Not specified"}</div>
              </div>

              <div class="field">
                <div class="label">Timeline</div>
                <div class="value">${lead.timeline || "Not specified"}</div>
              </div>

              <div class="field">
                <div class="label">Source</div>
                <div class="value">${lead.source}</div>
              </div>

              <div class="field">
                <div class="label">Captured At</div>
                <div class="value">${new Date(lead.timestamp).toLocaleString('en-US', { timeZone: 'America/Phoenix' })} (Arizona Time)</div>
              </div>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p><strong>🚀 Action Items:</strong></p>
                <ol>
                  <li>Respond within 1 hour (while they're hot!)</li>
                  <li>Send calendar link for discovery call</li>
                  <li>Add to HubSpot with proper tags</li>
                  <li>Prepare relevant case studies</li>
                </ol>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    await resend.emails.send({
      from: 'AI Assistant <leads@michaelcrowe.ai>',
      to: 'michael@crowelogic.com',
      subject: `🎯 New ${lead.budget && parseInt(lead.budget.replace(/\D/g, '')) >= 10000 ? 'HIGH-VALUE' : 'Qualified'} Lead: ${lead.name}${lead.company ? ` from ${lead.company}` : ''}`,
      html: emailHtml,
    })

    return { success: true }
  } catch (error) {
    console.error("Failed to send lead notification:", error)
    return { success: false, error }
  }
}

// Helper function for HubSpot integration (example)
async function createHubSpotContact(leadData: any) {
  // Requires HUBSPOT_API_KEY environment variable
  const hubspotApiKey = process.env.HUBSPOT_API_KEY

  if (!hubspotApiKey) {
    console.warn("HubSpot API key not configured")
    return null
  }

  try {
    const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${hubspotApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        properties: {
          email: leadData.email,
          firstname: leadData.name?.split(" ")[0],
          lastname: leadData.name?.split(" ").slice(1).join(" "),
          company: leadData.company,
          website_interest: leadData.interest,
          budget_range: leadData.budget,
          project_timeline: leadData.timeline,
          lead_source: leadData.source
        }
      })
    })

    return await response.json()
  } catch (error) {
    console.error("HubSpot contact creation error:", error)
    return null
  }
}

// Helper function to calculate close date based on timeline
function calculateCloseDate(timeline: string): string {
  const daysMap: Record<string, number> = {
    asap: 30,
    "1-2-months": 60,
    "2-3-months": 90,
    "3-6-months": 180,
    flexible: 90
  }

  const days = daysMap[timeline] || 90
  const closeDate = new Date()
  closeDate.setDate(closeDate.getDate() + days)

  return closeDate.toISOString().split("T")[0]
}
