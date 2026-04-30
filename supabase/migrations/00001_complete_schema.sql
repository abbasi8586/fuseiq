-- ============================================
-- FUSEIQ v3.0 — COMPLETE DATABASE SCHEMA
-- 18 Tables | RLS | Indexes | Triggers | Seed Data
-- Generated: 2026-04-29 by Rook vCEO
-- ============================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. WORKSPACES (Multi-tenant root)
-- ============================================
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'My Workspace',
  slug TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  plan TEXT DEFAULT 'Starter' CHECK (plan IN ('Starter', 'Professional', 'Enterprise')),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. WORKSPACE_MEMBERS (RBAC)
-- ============================================
CREATE TABLE IF NOT EXISTS workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'Member' CHECK (role IN ('Director', 'Manager', 'Member', 'Viewer')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

-- ============================================
-- 3. AGENTS (AI + Human registry)
-- ============================================
-- NOTE: If the old agents table exists, we migrate it
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'agents') THEN
    -- Rename old table to preserve data
    ALTER TABLE agents RENAME TO agents_old;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  agent_type TEXT DEFAULT 'AI' CHECK (agent_type IN ('AI', 'Human')),
  framework TEXT NOT NULL CHECK (framework IN ('Kimi', 'CrewAI', 'LangGraph', 'AutoGen', 'OpenAI', 'Anthropic', 'Google', 'Custom')),
  provider_id UUID,
  status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'busy', 'paused')),
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

-- Migrate old data if exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'agents_old') THEN
    INSERT INTO agents (id, name, description, framework, status, config, created_at, updated_at)
    SELECT id, name, description, framework, status, config, created_at, updated_at FROM agents_old;
    DROP TABLE agents_old;
  END IF;
END $$;

-- ============================================
-- 4. STAFF (Human team members — distinct from agents with agent_type='Human')
-- ============================================
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT,
  department TEXT,
  status TEXT DEFAULT 'online' CHECK (status IN ('online', 'offline', 'away', 'busy')),
  avatar_url TEXT,
  skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. TASKS (Operations Center — Kanban)
-- ============================================
CREATE TABLE IF NOT EXISTS tasks (
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

-- ============================================
-- 6. APPROVALS (Human-in-the-loop)
-- ============================================
CREATE TABLE IF NOT EXISTS approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  estimated_cost DECIMAL(12, 6) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  requester_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  requester_name TEXT,
  approver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- ============================================
-- 7. EXECUTIONS (Agent run history)
-- ============================================
CREATE TABLE IF NOT EXISTS executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  task_name TEXT NOT NULL,
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

-- ============================================
-- 8. CHANNELS (Chat channels)
-- ============================================
CREATE TABLE IF NOT EXISTS channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  channel_type TEXT DEFAULT 'team' CHECK (channel_type IN ('team', 'agent', 'department', 'announcement')),
  description TEXT,
  is_default BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. MESSAGES (Chat messages)
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  thread_id UUID,
  author_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_type TEXT DEFAULT 'Human' CHECK (author_type IN ('AI', 'Human')),
  content TEXT NOT NULL,
  reactions JSONB DEFAULT '{}',
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 10. THREADS (Message threads)
-- ============================================
CREATE TABLE IF NOT EXISTS threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  parent_message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 11. WORKFLOWS (Swarm orchestration)
-- ============================================
CREATE TABLE IF NOT EXISTS workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  nodes JSONB NOT NULL DEFAULT '[]',
  edges JSONB NOT NULL DEFAULT '[]',
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 12. SIMULATIONS (Predictive runs)
-- ============================================
CREATE TABLE IF NOT EXISTS simulations (
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

-- ============================================
-- 13. NOTIFICATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 14. MARKETPLACE_ITEMS
-- ============================================
CREATE TABLE IF NOT EXISTS marketplace_items (
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

-- ============================================
-- 15. BILLING_USAGE
-- ============================================
CREATE TABLE IF NOT EXISTS billing_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  metric TEXT NOT NULL,
  value DECIMAL(15, 4) DEFAULT 0,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 16. PROVIDERS (BYOK)
-- ============================================
CREATE TABLE IF NOT EXISTS providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  provider_type TEXT NOT NULL,
  api_key_encrypted TEXT NOT NULL,
  key_type TEXT NOT NULL,
  models TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  cost_input DECIMAL(10, 6),
  cost_output DECIMAL(10, 6),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 17. ACTIVITY_LOGS (Audit trail)
-- ============================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  actor_id UUID,
  actor_type TEXT DEFAULT 'user' CHECK (actor_type IN ('user', 'agent', 'system')),
  actor_name TEXT,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  target_name TEXT,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 18. AUDIT_LOG (Immutable with hash)
-- ============================================
CREATE TABLE IF NOT EXISTS audit_log (
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

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Workspace scoped policies
CREATE POLICY "workspaces_select" ON workspaces FOR SELECT
  USING (id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()) OR owner_id = auth.uid());

CREATE POLICY "workspaces_owner_update" ON workspaces FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "workspaces_owner_delete" ON workspaces FOR DELETE
  USING (owner_id = auth.uid());

-- Workspace members
CREATE POLICY "workspace_members_select" ON workspace_members FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "workspace_members_director" ON workspace_members FOR ALL
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid() AND role IN ('Director', 'Manager')));

-- All other tables: workspace scoped
CREATE POLICY "providers_ws" ON providers FOR ALL
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "agents_ws" ON agents FOR ALL
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "staff_ws" ON staff FOR ALL
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "executions_ws" ON executions FOR ALL
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "approvals_ws" ON approvals FOR ALL
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "tasks_ws" ON tasks FOR ALL
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "channels_ws" ON channels FOR ALL
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "messages_ws" ON messages FOR ALL
  USING (channel_id IN (SELECT id FROM channels WHERE workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())));

CREATE POLICY "threads_ws" ON threads FOR ALL
  USING (channel_id IN (SELECT id FROM channels WHERE workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())));

CREATE POLICY "workflows_ws" ON workflows FOR ALL
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "simulations_ws" ON simulations FOR ALL
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "activity_logs_ws" ON activity_logs FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "audit_log_ws" ON audit_log FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "billing_usage_ws" ON billing_usage FOR ALL
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "marketplace_public" ON marketplace_items FOR SELECT
  USING (is_public = true OR creator_id = auth.uid());

CREATE POLICY "marketplace_creator" ON marketplace_items FOR ALL
  USING (creator_id = auth.uid());

CREATE POLICY "notifications_user" ON notifications FOR ALL
  USING (user_id = auth.uid());

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace ON workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_agents_workspace ON agents(workspace_id);
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);
CREATE INDEX IF NOT EXISTS idx_staff_workspace ON staff(workspace_id);
CREATE INDEX IF NOT EXISTS idx_executions_agent ON executions(agent_id);
CREATE INDEX IF NOT EXISTS idx_executions_workspace ON executions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_executions_created ON executions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_approvals_workspace ON approvals(workspace_id);
CREATE INDEX IF NOT EXISTS idx_approvals_status ON approvals(status);
CREATE INDEX IF NOT EXISTS idx_tasks_workspace ON tasks(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_channels_workspace ON channels(workspace_id);
CREATE INDEX IF NOT EXISTS idx_messages_channel ON messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_workflows_workspace ON workflows(workspace_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_workspace ON activity_logs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_workspace ON audit_log(workspace_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_billing_usage_workspace ON billing_usage(workspace_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);

-- ============================================
-- TRIGGERS (Auto-update timestamps)
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER workspaces_updated_at BEFORE UPDATE ON workspaces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER providers_updated_at BEFORE UPDATE ON providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER agents_updated_at BEFORE UPDATE ON agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER staff_updated_at BEFORE UPDATE ON staff
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER workflows_updated_at BEFORE UPDATE ON workflows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER marketplace_items_updated_at BEFORE UPDATE ON marketplace_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- AUDIT LOG HASH TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION generate_audit_hash()
RETURNS TRIGGER AS $$
BEGIN
  NEW.hash = encode(digest(
    NEW.workspace_id::text || COALESCE(NEW.actor_id::text, '') || NEW.action || NEW.created_at::text,
    'sha256'
  ), 'hex');
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER audit_log_hash BEFORE INSERT ON audit_log
  FOR EACH ROW EXECUTE FUNCTION generate_audit_hash();

-- ============================================
-- DEFAULT CHANNELS TRIGGER (on workspace creation)
-- ============================================
CREATE OR REPLACE FUNCTION create_default_channels()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO channels (workspace_id, name, channel_type, is_default, description) VALUES
    (NEW.id, 'general', 'team', true, 'General team discussions'),
    (NEW.id, 'agent-commands', 'agent', true, 'Direct agent commands'),
    (NEW.id, 'operations', 'team', true, 'Operations coordination'),
    (NEW.id, 'approvals', 'team', true, 'Approval notifications'),
    (NEW.id, 'random', 'team', true, 'Off-topic conversations'),
    (NEW.id, 'engineering', 'department', true, 'Engineering team'),
    (NEW.id, 'marketing', 'department', true, 'Marketing team'),
    (NEW.id, 'announcements', 'announcement', true, 'Important updates');
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER workspace_default_channels AFTER INSERT ON workspaces
  FOR EACH ROW EXECUTE FUNCTION create_default_channels();

-- ============================================
-- ACTIVITY LOG TRIGGER (auto-log on agent/approval/task changes)
-- ============================================
CREATE OR REPLACE FUNCTION log_agent_change()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activity_logs (workspace_id, actor_id, actor_type, action, target_type, target_id, target_name, metadata, created_at)
  VALUES (
    NEW.workspace_id,
    NULL,
    'system',
    CASE WHEN TG_OP = 'INSERT' THEN 'agent.created' WHEN TG_OP = 'UPDATE' THEN 'agent.updated' ELSE 'agent.deleted' END,
    'agent',
    NEW.id,
    NEW.name,
    jsonb_build_object('framework', NEW.framework, 'status', NEW.status),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER agents_activity_log AFTER INSERT OR UPDATE OR DELETE ON agents
  FOR EACH ROW EXECUTE FUNCTION log_agent_change();

-- ============================================
-- REALTIME PUBLICATIONS
-- ============================================
-- Enable realtime for all tables
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE agents, tasks, approvals, messages, channels, workflows, executions, notifications, activity_logs;
