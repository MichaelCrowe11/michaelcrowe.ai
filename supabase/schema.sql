-- Enterprise AI Sales Assistant Database Schema
-- Run this in your Supabase SQL Editor after creating your project

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Conversations table - stores all chat sessions
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT UNIQUE NOT NULL,
  visitor_id TEXT,
  email TEXT,
  name TEXT,
  company TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'active', -- active, qualified, booked, closed
  lead_score INTEGER DEFAULT 0, -- 0-100 scoring
  budget_range TEXT,
  timeline TEXT,
  pain_points TEXT[],
  recommended_service TEXT,
  metadata JSONB DEFAULT '{}'::JSONB
);

-- Messages table - stores individual chat messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'user', 'assistant', 'system'
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::JSONB
);

-- Leads table - qualified leads ready for follow-up
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  service_interest TEXT,
  budget_range TEXT,
  timeline TEXT,
  pain_points TEXT[],
  lead_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'new', -- new, contacted, qualified, proposal_sent, won, lost
  assigned_to TEXT,
  notes TEXT,
  booking_url TEXT,
  calendar_event_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::JSONB
);

-- Knowledge base table - RAG vector embeddings
CREATE TABLE knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  embedding VECTOR(1536), -- OpenAI embeddings dimension
  metadata JSONB DEFAULT '{}'::JSONB,
  source_type TEXT, -- 'portfolio', 'blog', 'service', 'faq'
  source_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table - track conversation metrics
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'page_view', 'chat_start', 'lead_qualified', 'booking_created', etc.
  event_data JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_conversations_session_id ON conversations(session_id);
CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_conversations_lead_score ON conversations(lead_score DESC);
CREATE INDEX idx_conversations_created_at ON conversations(created_at DESC);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_lead_score ON leads(lead_score DESC);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

CREATE INDEX idx_knowledge_base_source_type ON knowledge_base(source_type);

CREATE INDEX idx_analytics_conversation_id ON analytics_events(conversation_id);
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at DESC);

-- Create vector similarity search function
CREATE OR REPLACE FUNCTION match_knowledge(
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    knowledge_base.id,
    knowledge_base.content,
    knowledge_base.metadata,
    1 - (knowledge_base.embedding <=> query_embedding) AS similarity
  FROM knowledge_base
  WHERE 1 - (knowledge_base.embedding <=> query_embedding) > match_threshold
  ORDER BY knowledge_base.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Row Level Security (RLS) policies
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Public read access for knowledge base (used by AI)
CREATE POLICY "Public read access to knowledge base"
  ON knowledge_base FOR SELECT
  USING (true);

-- Admin full access (you'll need to set up auth for this)
CREATE POLICY "Admin full access to conversations"
  ON conversations FOR ALL
  USING (true);

CREATE POLICY "Admin full access to messages"
  ON messages FOR ALL
  USING (true);

CREATE POLICY "Admin full access to leads"
  ON leads FOR ALL
  USING (true);

CREATE POLICY "Admin full access to analytics"
  ON analytics_events FOR ALL
  USING (true);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
