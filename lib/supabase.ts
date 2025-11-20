import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client for browser/public access
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side operations (full access)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Type definitions for our database
export type Database = {
  conversations: {
    id: string
    session_id: string
    visitor_id?: string
    email?: string
    name?: string
    company?: string
    phone?: string
    created_at: string
    updated_at: string
    status: 'active' | 'qualified' | 'booked' | 'closed'
    lead_score: number
    budget_range?: string
    timeline?: string
    pain_points?: string[]
    recommended_service?: string
    metadata: Record<string, any>
  }
  messages: {
    id: string
    conversation_id: string
    role: 'user' | 'assistant' | 'system'
    content: string
    created_at: string
    metadata: Record<string, any>
  }
  leads: {
    id: string
    conversation_id?: string
    name: string
    email: string
    company?: string
    phone?: string
    service_interest?: string
    budget_range?: string
    timeline?: string
    pain_points?: string[]
    lead_score: number
    status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'won' | 'lost'
    assigned_to?: string
    notes?: string
    booking_url?: string
    calendar_event_id?: string
    created_at: string
    updated_at: string
    metadata: Record<string, any>
  }
  knowledge_base: {
    id: string
    content: string
    embedding: number[]
    metadata: Record<string, any>
    source_type: 'portfolio' | 'blog' | 'service' | 'faq'
    source_id?: string
    created_at: string
  }
  analytics_events: {
    id: string
    conversation_id?: string
    event_type: string
    event_data: Record<string, any>
    created_at: string
  }
}
