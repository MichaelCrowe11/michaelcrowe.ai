import { NextRequest, NextResponse } from "next/server"

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

    // Send email notification (integrate with Resend, SendGrid, etc.)
    await sendLeadNotification(leadData)

    // TODO: Add CRM integration here
    // Example with HubSpot:
    // const hubspotContact = await createHubSpotContact(leadData)
    // const hubspotDeal = await createHubSpotDeal(leadData, hubspotContact.id)

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
  // Email notification implementation
  // Integrate with your email service

  const emailBody = `
    New Lead from MichaelCrowe.ai

    Name: ${lead.name || "Not provided"}
    Email: ${lead.email}
    Company: ${lead.company || "Not provided"}
    Interest: ${lead.interest || "Not specified"}
    Budget: ${lead.budget || "Not specified"}
    Timeline: ${lead.timeline || "Not specified"}
    Source: ${lead.source}
    Timestamp: ${lead.timestamp}
  `

  console.log("Lead notification:", emailBody)

  // TODO: Send actual email
  // Example with Resend:
  // await resend.emails.send({
  //   from: 'leads@michaelcrowe.ai',
  //   to: 'michael@crowelogic.com',
  //   subject: `🚀 New Lead: ${lead.company || lead.name}`,
  //   text: emailBody
  // })

  return { success: true }
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
