export interface Project {
  id: string
  title: string
  client: string
  industry: string
  description: string
  challenge: string
  solution: string
  results: {
    metric: string
    value: string
  }[]
  technologies: string[]
  image: string
  featured: boolean
}

export const projects: Project[] = [
  {
    id: "restaurant-ai-chatbot",
    title: "24/7 AI Customer Service",
    client: "3-Location Restaurant Chain",
    industry: "Food & Beverage",
    description:
      "AI-powered chatbot handling reservations, menu inquiries, and customer service across multiple channels.",
    challenge: "Missing 40% of online inquiries due to slow response times, leading to lost bookings and revenue.",
    solution:
      "Custom AI chatbot integrated with reservation system, trained on menu and policies, handling inquiries 24/7 across website, social media, and messaging platforms.",
    results: [
      { metric: "Booking Increase", value: "35%" },
      { metric: "Response Time", value: "< 60 sec" },
      { metric: "Time Saved", value: "15 hrs/week" },
      { metric: "Additional Revenue", value: "$15K/month" },
    ],
    technologies: ["AI Chatbot", "Natural Language Processing", "CRM Integration", "Multi-channel Messaging"],
    image: "/restaurant-interior-modern.jpg",
    featured: true,
  },
  {
    id: "hvac-voice-ai",
    title: "Voice AI Phone System",
    client: "HVAC Service Company",
    industry: "Home Services",
    description: "AI receptionist handling calls, booking appointments, and routing emergencies 24/7.",
    challenge: "Missing 30% of calls during peak season and after hours, losing $5K-$10K weekly in opportunities.",
    solution:
      "Voice AI system that answers calls naturally, books appointments, handles FAQs, and routes urgent matters to on-call technicians with intelligent triage.",
    results: [
      { metric: "Calls Handled by AI", value: "90%" },
      { metric: "Missed Calls", value: "0%" },
      { metric: "Additional Revenue", value: "$80K/90 days" },
      { metric: "Availability", value: "24/7" },
    ],
    technologies: ["Voice AI", "Natural Language Understanding", "Call Routing", "Scheduling Integration"],
    image: "/hvac-technician-working.jpg",
    featured: true,
  },
  {
    id: "manufacturing-quote-automation",
    title: "Automated Quote Generation",
    client: "Custom Manufacturing Business",
    industry: "Manufacturing",
    description: "AI system generating complex manufacturing quotes in minutes instead of days.",
    challenge: "Quote process taking 2-3 days, losing deals to faster competitors, limiting sales capacity.",
    solution:
      "Custom AI analyzing specifications, calculating costs from supplier databases, estimating labor and machine time, and generating professional quotes with detailed breakdowns.",
    results: [
      { metric: "Quote Time", value: "3 minutes" },
      { metric: "Win Rate Increase", value: "40%" },
      { metric: "Capacity Increase", value: "3x" },
      { metric: "Annual Revenue", value: "+$500K" },
    ],
    technologies: ["Machine Learning", "ERP Integration", "Cost Optimization", "Document Generation"],
    image: "/modern-manufacturing-facility.png",
    featured: true,
  },
  {
    id: "medical-scheduling-system",
    title: "Smart Appointment System",
    client: "Medical Practice",
    industry: "Healthcare",
    description: "Automated booking system with AI-powered reminders and waitlist management.",
    challenge:
      "Staff spending 10+ hours weekly on phone scheduling, 25% no-show rate impacting revenue and efficiency.",
    solution:
      "Online booking system with smart conflict resolution, automated reminders sent at optimal times, and intelligent waitlist management that fills cancellations automatically.",
    results: [
      { metric: "No-Show Reduction", value: "17%" },
      { metric: "Time Saved", value: "10 hrs/week" },
      { metric: "Double Bookings", value: "0" },
      { metric: "Patient Satisfaction", value: "+25%" },
    ],
    technologies: ["Scheduling Automation", "SMS/Email Integration", "Calendar Sync", "Waitlist Management"],
    image: "/modern-medical-office.png",
    featured: false,
  },
  {
    id: "ecommerce-marketing-automation",
    title: "Marketing Automation Suite",
    client: "E-commerce Store",
    industry: "Retail",
    description: "Automated email campaigns, abandoned cart recovery, and personalized product recommendations.",
    challenge: "Inconsistent marketing efforts, low repeat purchase rate, no time for campaign management.",
    solution:
      "Automated email sequences triggered by customer behavior, abandoned cart recovery system, and AI-powered product recommendations based on browsing and purchase history.",
    results: [
      { metric: "Repeat Purchases", value: "+45%" },
      { metric: "Email Open Rate", value: "4x" },
      { metric: "Cart Recovery", value: "$15K/month" },
      { metric: "Time Saved", value: "12 hrs/week" },
    ],
    technologies: ["Email Automation", "Customer Segmentation", "Recommendation Engine", "Analytics Dashboard"],
    image: "/ecommerce-online-shopping.png",
    featured: false,
  },
  {
    id: "construction-financial-dashboard",
    title: "Real-Time Financial Intelligence",
    client: "Construction Company",
    industry: "Construction",
    description: "Live profit dashboards by project with automated expense tracking and forecasting.",
    challenge:
      "No visibility into project profitability, manual expense tracking taking hours, decisions based on outdated data.",
    solution:
      "Real-time dashboard showing profit by project, automated expense categorization, cash flow forecasting, and alerts for budget overruns or unusual spending patterns.",
    results: [
      { metric: "Savings Identified", value: "$50K" },
      { metric: "Margin Increase", value: "18%" },
      { metric: "Time Saved", value: "8 hrs/week" },
      { metric: "Data Accuracy", value: "100%" },
    ],
    technologies: ["Financial Analytics", "Data Integration", "Real-time Dashboards", "Automated Reporting"],
    image: "/construction-site-management.png",
    featured: false,
  },
]

export function getFeaturedProjects(): Project[] {
  return projects.filter((project) => project.featured)
}

export function getProjectsByIndustry(industry: string): Project[] {
  return projects.filter((project) => project.industry === industry)
}
