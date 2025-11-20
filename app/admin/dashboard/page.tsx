"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MessageCircle,
  Users,
  TrendingUp,
  DollarSign,
  Clock,
  Mail,
  Phone,
  Building2,
  Calendar,
  Sparkles,
  AlertCircle
} from "lucide-react"

interface Conversation {
  id: string
  session_id: string
  email?: string
  name?: string
  company?: string
  phone?: string
  created_at: string
  updated_at: string
  status: string
  lead_score: number
  budget_range?: string
  timeline?: string
  recommended_service?: string
  message_count?: number
}

interface Lead {
  id: string
  name: string
  email: string
  company?: string
  phone?: string
  service_interest?: string
  budget_range?: string
  timeline?: string
  lead_score: number
  status: string
  created_at: string
}

interface Stats {
  total_conversations: number
  active_conversations: number
  qualified_leads: number
  avg_lead_score: number
  total_messages: number
}

export default function AdminDashboard() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
    // Refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  async function loadDashboardData() {
    try {
      setIsLoading(true)
      // In production, these would be real API calls
      // For now, showing the structure

      // Mock data for demonstration
      const mockStats: Stats = {
        total_conversations: 24,
        active_conversations: 8,
        qualified_leads: 12,
        avg_lead_score: 67,
        total_messages: 186
      }

      const mockConversations: Conversation[] = [
        {
          id: "conv-1",
          session_id: "session-1",
          name: "John Smith",
          email: "john@example.com",
          company: "Smith Restaurant Group",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: "qualified",
          lead_score: 85,
          budget_range: "50k_plus",
          timeline: "next_month",
          recommended_service: "AI Implementation",
          message_count: 12
        }
      ]

      const mockLeads: Lead[] = [
        {
          id: "lead-1",
          name: "John Smith",
          email: "john@example.com",
          company: "Smith Restaurant Group",
          service_interest: "AI Implementation",
          budget_range: "50k_plus",
          timeline: "next_month",
          lead_score: 85,
          status: "new",
          created_at: new Date().toISOString()
        }
      ]

      setStats(mockStats)
      setConversations(mockConversations)
      setLeads(mockLeads)

    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  function getLeadScoreColor(score: number) {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    if (score >= 40) return "text-orange-500"
    return "text-red-500"
  }

  function getStatusBadge(status: string) {
    const variants: Record<string, { label: string; color: string }> = {
      active: { label: "Active", color: "bg-blue-500/10 text-blue-500" },
      qualified: { label: "Qualified", color: "bg-green-500/10 text-green-500" },
      booked: { label: "Booked", color: "bg-purple-500/10 text-purple-500" },
      closed: { label: "Closed", color: "bg-gray-500/10 text-gray-500" },
      new: { label: "New", color: "bg-yellow-500/10 text-yellow-500" },
      contacted: { label: "Contacted", color: "bg-blue-500/10 text-blue-500" },
      won: { label: "Won", color: "bg-green-500/10 text-green-500" },
      lost: { label: "Lost", color: "bg-red-500/10 text-red-500" }
    }

    const variant = variants[status] || variants.active
    return <Badge className={variant.color}>{variant.label}</Badge>
  }

  if (isLoading && !stats) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-gold animate-pulse mx-auto mb-4" />
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gold via-yellow-400 to-gold bg-clip-text text-transparent">
              AI Sales Assistant Dashboard
            </h1>
            <p className="text-gray-400 mt-1">Monitor conversations and manage leads</p>
          </div>
          <Button
            onClick={loadDashboardData}
            className="bg-gradient-to-r from-gold to-yellow-600 text-black font-bold"
          >
            Refresh Data
          </Button>
        </div>

        {/* Development Mode Warning */}
        {process.env.NEXT_PUBLIC_DEV_MODE === 'true' && (
          <Card className="bg-yellow-500/10 border-yellow-500/20">
            <CardContent className="flex items-center gap-3 py-4">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <p className="text-sm text-yellow-200">
                <strong>Development Mode:</strong> Connect your Supabase database to see real data.
                This dashboard shows mock data for demonstration.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Total Conversations
              </CardTitle>
              <MessageCircle className="w-4 h-4 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.total_conversations || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Active Now
              </CardTitle>
              <Clock className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.active_conversations || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Qualified Leads
              </CardTitle>
              <Users className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.qualified_leads || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Avg Lead Score
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.avg_lead_score || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Total Messages
              </CardTitle>
              <Sparkles className="w-4 h-4 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.total_messages || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="conversations" className="space-y-4">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="leads">Qualified Leads</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Conversations Tab */}
          <TabsContent value="conversations" className="space-y-4">
            {conversations.length === 0 ? (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="py-12 text-center">
                  <MessageCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No conversations yet</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Conversations will appear here when visitors interact with the AI assistant
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {conversations.map((conversation) => (
                  <Card key={conversation.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => setSelectedConversation(conversation.id)}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-white text-lg">
                              {conversation.name || 'Anonymous Visitor'}
                            </h3>
                            {getStatusBadge(conversation.status)}
                            <Badge className={`${getLeadScoreColor(conversation.lead_score)} bg-white/5`}>
                              Score: {conversation.lead_score}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-sm">
                            {conversation.email && (
                              <div className="flex items-center gap-2 text-gray-400">
                                <Mail className="w-4 h-4" />
                                {conversation.email}
                              </div>
                            )}
                            {conversation.company && (
                              <div className="flex items-center gap-2 text-gray-400">
                                <Building2 className="w-4 h-4" />
                                {conversation.company}
                              </div>
                            )}
                            {conversation.budget_range && (
                              <div className="flex items-center gap-2 text-gray-400">
                                <DollarSign className="w-4 h-4" />
                                Budget: {conversation.budget_range.replace('_', ' ')}
                              </div>
                            )}
                            {conversation.timeline && (
                              <div className="flex items-center gap-2 text-gray-400">
                                <Calendar className="w-4 h-4" />
                                Timeline: {conversation.timeline.replace('_', ' ')}
                              </div>
                            )}
                          </div>

                          {conversation.recommended_service && (
                            <div className="mt-3">
                              <Badge className="bg-gold/10 text-gold border-gold/20">
                                Recommended: {conversation.recommended_service}
                              </Badge>
                            </div>
                          )}
                        </div>

                        <div className="text-right text-sm text-gray-500">
                          <p>{new Date(conversation.created_at).toLocaleDateString()}</p>
                          <p className="mt-1">{conversation.message_count || 0} messages</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads" className="space-y-4">
            {leads.length === 0 ? (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="py-12 text-center">
                  <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No qualified leads yet</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Leads with score ≥60 will automatically appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {leads.map((lead) => (
                  <Card key={lead.id} className="bg-white/5 border-white/10">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="font-bold text-white text-lg">{lead.name}</h3>
                            {getStatusBadge(lead.status)}
                            <Badge className={`${getLeadScoreColor(lead.lead_score)} bg-white/5`}>
                              {lead.lead_score}/100
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                            <div className="flex items-center gap-2 text-gray-400">
                              <Mail className="w-4 h-4" />
                              {lead.email}
                            </div>
                            {lead.company && (
                              <div className="flex items-center gap-2 text-gray-400">
                                <Building2 className="w-4 h-4" />
                                {lead.company}
                              </div>
                            )}
                            {lead.phone && (
                              <div className="flex items-center gap-2 text-gray-400">
                                <Phone className="w-4 h-4" />
                                {lead.phone}
                              </div>
                            )}
                          </div>

                          {lead.service_interest && (
                            <Badge className="bg-purple-500/10 text-purple-400">
                              {lead.service_interest}
                            </Badge>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" className="bg-gold/10 text-gold hover:bg-gold/20">
                            View Details
                          </Button>
                          <Button size="sm" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                            Contact
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Analytics Coming Soon</CardTitle>
                <CardDescription>
                  Track conversion rates, popular services, and revenue metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="py-12 text-center text-gray-400">
                <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                <p>Advanced analytics and reporting will be available here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
