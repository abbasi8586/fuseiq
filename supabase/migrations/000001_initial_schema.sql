-- FuseIQ v3.0 Database Schema
-- Multi-tenant AI Agent Orchestration Platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- CORE TABLES
-- ============================================

-- Workspaces (Tenants)
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  plan TEXT DEFAULT 'Starter' CHECK (plan IN ('Starter', 'Professional', 'Enterprise')),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workspace Members with RBAC
CREATE TABLE workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'Member' CHECK (role IN ('Director', 'Manager', 'Member', 'Viewer')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

-- BYOK Provider Configurations
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  provider_type TEXT NOT NULL,
  encrypted_key TEXT NOT NULL,
  key_type TEXT NOT NULL,
  models TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  cost_input DECIMAL(10, 6),
  cost_output DECIMAL(10, 6),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Agents Registry
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  framework TEXT NOT NULL CHECK (framework IN ('Kimi', 'CrewAI', 'LangGraph', 'AutoGen', 'OpenAI', 'Custom')),
  provider_id UUID REFERENCES providers(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'busy', 'paused')),
  agent_type TEXT DEFAULT 'AI' CHECK (agent_type IN ('AI', 'Human')),
  role TEXT,
  department TEXT,
  config JSONB DEFAULT '{}',
  efficiency_score INTEGER DEFAULT 0 CHECK (efficiency_score >= 0 AND efficiency_score <= 100),
  total_executions INTEGER DEFAULT 0,
  total_cost DECIMAL(12, 6) DEFAULT 0,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'UTC',
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent Executions Log
CREATE TABLE agent_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  task TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'success', 'failed', 'cancelled')),
  cost_usd DECIMAL(12, 6) DEFAULT 0,
  tokens_in INTEGER DEFAULT 0,
  tokens_out INTEGER DEFAULT 0,
  latency_ms INTEGER,
  provider TEXT,
  model TEXT,
  result JSONB,
  error_message TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Approval Queue
CREATE TABLE approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  estimated_cost DECIMAL(12, 6),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  requester TEXT NOT NULL,
  approver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Operations Tasks (Kanban)
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assignee_id UUID,
  assignee_type TEXT DEFAULT 'Human' CHECK (assignee_type IN ('AI', 'Human')),
  due_date TIMESTAMPTZ,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  tags TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Communications Channels
CREATE TABLE channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  channel_type TEXT DEFAULT 'team' CHECK (channel_type IN ('team', 'agent', 'department', 'announcement')),
  description TEXT,
  is_default BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  thread_id UUID,
  author_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_type TEXT DEFAULT 'Human' CHECK (author_type IN ('AI', 'Human')),
  content TEXT NOT NULL,
  reactions JSONB DEFAULT '{}',
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflows (Swarm Canvas)
CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  definition JSONB NOT NULL,
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Simulations
CREATE TABLE simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  results JSONB,
  confidence_score DECIMAL(5, 2),
  projected_cost DECIMAL(12, 6),
  projected_duration_ms INTEGER,
  status TEXT DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Audit Log (Immutable)
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  actor_id UUID,
  actor_type TEXT DEFAULT 'user' CHECK (actor_type IN ('user', 'agent', 'system')),
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage Tracking (Cost Analytics)
CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  date DATE NOT NULL,
  cost_usd DECIMAL(12, 6) DEFAULT 0,
  tokens_in INTEGER DEFAULT 0,
  tokens_out INTEGER DEFAULT 0,
  executions INTEGER DEFAULT 0,
  UNIQUE(workspace_id, provider, date)
);

-- Marketplace Templates
CREATE TABLE marketplace_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price DECIMAL(10, 2) DEFAULT 0,
  definition JSONB,
  rating DECIMAL(3, 2) DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Integrations
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  service TEXT NOT NULL,
  config JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'error', 'disconnected')),
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Workspace access: members can view
CREATE POLICY "Members can view workspace"
  ON workspaces FOR SELECT
  USING (id IN (
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  ) OR owner_id = auth.uid());

-- Workspace access: only owner can update/delete
CREATE POLICY "Owner can update workspace"
  ON workspaces FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Owner can delete workspace"
  ON workspaces FOR DELETE
  USING (owner_id = auth.uid());

-- Workspace members: view
CREATE POLICY "Members can view workspace members"
  ON workspace_members FOR SELECT
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  ));

-- Directors/Managers can manage members
CREATE POLICY "Directors can manage members"
  ON workspace_members FOR ALL
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid() AND role IN ('Director', 'Manager')
  ));

-- Providers: workspace scoped
CREATE POLICY "Providers workspace scoped"
  ON providers FOR ALL
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  ));

-- Agents: workspace scoped
CREATE POLICY "Agents workspace scoped"
  ON agents FOR ALL
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  ));

-- Agent executions: workspace scoped
CREATE POLICY "Executions workspace scoped"
  ON agent_executions FOR ALL
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  ));

-- Approvals: workspace scoped
CREATE POLICY "Approvals workspace scoped"
  ON approvals FOR ALL
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  ));

-- Tasks: workspace scoped
CREATE POLICY "Tasks workspace scoped"
  ON tasks FOR ALL
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  ));

-- Channels: workspace scoped
CREATE POLICY "Channels workspace scoped"
  ON channels FOR ALL
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  ));

-- Messages: channel scoped (via workspace)
CREATE POLICY "Messages workspace scoped"
  ON messages FOR ALL
  USING (channel_id IN (
    SELECT id FROM channels WHERE workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  ));

-- Workflows: workspace scoped
CREATE POLICY "Workflows workspace scoped"
  ON workflows FOR ALL
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  ));

-- Simulations: workspace scoped
CREATE POLICY "Simulations workspace scoped"
  ON simulations FOR ALL
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  ));

-- Audit log: workspace scoped (read only for most)
CREATE POLICY "Audit log read workspace scoped"
  ON audit_log FOR SELECT
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  ));

-- Usage tracking: workspace scoped
CREATE POLICY "Usage tracking workspace scoped"
  ON usage_tracking FOR ALL
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  ));

-- Marketplace: public items visible to all
CREATE POLICY "Marketplace public items visible"
  ON marketplace_items FOR SELECT
  USING (is_public = true OR creator_id = auth.uid());

-- Integrations: workspace scoped
CREATE POLICY "Integrations workspace scoped"
  ON integrations FOR ALL
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  ));

-- Notifications: user scoped
CREATE POLICY "Notifications user scoped"
  ON notifications FOR ALL
  USING (user_id = auth.uid());

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER workspaces_updated_at BEFORE UPDATE ON workspaces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER providers_updated_at BEFORE UPDATE ON providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER agents_updated_at BEFORE UPDATE ON agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER workflows_updated_at BEFORE UPDATE ON workflows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER marketplace_items_updated_at BEFORE UPDATE ON marketplace_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER integrations_updated_at BEFORE UPDATE ON integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit log hash generation
CREATE OR REPLACE FUNCTION generate_audit_hash()
RETURNS TRIGGER AS $$
BEGIN
  NEW.hash = encode(digest(
    NEW.workspace_id::text || NEW.actor_id::text || NEW.action || NEW.created_at::text,
    'sha256'
  ), 'hex');
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER audit_log_hash BEFORE INSERT ON audit_log
  FOR EACH ROW EXECUTE FUNCTION generate_audit_hash();

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_workspace_members_user ON workspace_members(user_id);
CREATE INDEX idx_workspace_members_workspace ON workspace_members(workspace_id);
CREATE INDEX idx_providers_workspace ON providers(workspace_id);
CREATE INDEX idx_agents_workspace ON agents(workspace_id);
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_executions_agent ON agent_executions(agent_id);
CREATE INDEX idx_executions_workspace ON agent_executions(workspace_id);
CREATE INDEX idx_executions_created ON agent_executions(created_at DESC);
CREATE INDEX idx_approvals_workspace ON approvals(workspace_id);
CREATE INDEX idx_approvals_status ON approvals(status);
CREATE INDEX idx_tasks_workspace ON tasks(workspace_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_messages_channel ON messages(channel_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_workflows_workspace ON workflows(workspace_id);
CREATE INDEX idx_audit_workspace ON audit_log(workspace_id);
CREATE INDEX idx_audit_created ON audit_log(created_at DESC);
CREATE INDEX idx_usage_workspace_date ON usage_tracking(workspace_id, date DESC);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- ============================================
-- DEMO DATA
-- ============================================

-- Insert default channels for new workspaces (via trigger)
CREATE OR REPLACE FUNCTION create_default_channels()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO channels (workspace_id, name, channel_type, is_default) VALUES
    (NEW.id, 'All Team', 'team', true),
    (NEW.id, 'All Agents', 'agent', true),
    (NEW.id, 'Engineering', 'department', true),
    (NEW.id, 'Marketing', 'department', true),
    (NEW.id, 'Operations', 'department', true),
    (NEW.id, 'Executive', 'team', true),
    (NEW.id, 'Announcements', 'announcement', true),
    (NEW.id, 'Agent Commands', 'agent', true);
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER workspace_default_channels AFTER INSERT ON workspaces
  FOR EACH ROW EXECUTE FUNCTION create_default_channels();
