-- Marketplace Agents Table
CREATE TABLE IF NOT EXISTS marketplace_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  category TEXT NOT NULL DEFAULT 'Custom',
  framework TEXT NOT NULL DEFAULT 'FuseIQ',
  rating NUMERIC(2,1) NOT NULL DEFAULT 4.5,
  installs INTEGER NOT NULL DEFAULT 0,
  author TEXT NOT NULL DEFAULT 'FuseIQ Team',
  author_avatar TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[] NOT NULL DEFAULT '{}',
  price TEXT NOT NULL DEFAULT 'Free',
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User Installations Table (tracks who installed what)
CREATE TABLE IF NOT EXISTS user_installations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES marketplace_agents(id) ON DELETE CASCADE,
  installed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, agent_id)
);

-- Enable RLS
ALTER TABLE marketplace_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_installations ENABLE ROW LEVEL SECURITY;

-- Policies: marketplace_agents (readable by all authenticated users)
CREATE POLICY "marketplace_agents_select" ON marketplace_agents
  FOR SELECT TO authenticated USING (true);

-- Policies: user_installations
CREATE POLICY "user_installations_select_own" ON user_installations
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "user_installations_insert_own" ON user_installations
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "user_installations_delete_own" ON user_installations
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Seed data (12 pre-built agents)
INSERT INTO marketplace_agents (id, name, description, image, category, framework, rating, installs, author, author_avatar, featured, tags, price, config) VALUES
  (gen_random_uuid(), 'Code Review Pro', 'Automated code review with AI-powered suggestions, security scans, and performance analysis for every pull request.', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop', 'Development', 'GPT-4', 4.8, 12453, 'DevOps Labs', 'DL', true, ARRAY['GitHub','CI/CD','Security'], 'Free', '{"role": "code_reviewer", "skills": ["security", "performance", "best_practices"]}'::jsonb),
  (gen_random_uuid(), 'Content Catalyst', 'Generate SEO-optimized blog posts, social media content, and email campaigns with brand voice consistency.', 'https://images.unsplash.com/photo-1499750310107-5fef28a6667a?w=400&h=250&fit=crop', 'Marketing', 'Claude', 4.6, 8932, 'GrowthStack', 'GS', true, ARRAY['SEO','Social','Email'], '$9/mo', '{"role": "content_writer", "skills": ["seo", "copywriting", "social_media"]}'::jsonb),
  (gen_random_uuid(), 'Data Insight Engine', 'Transform raw data into actionable business intelligence with automated reports and predictive analytics.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop', 'Analysis', 'Kimi', 4.9, 6721, 'Analytics Pro', 'AP', true, ARRAY['BI','Predictive','Reports'], '$19/mo', '{"role": "data_analyst", "skills": ["sql", "visualization", "forecasting"]}'::jsonb),
  (gen_random_uuid(), 'Support Sentinel', '24/7 intelligent customer support with sentiment analysis, escalation routing, and multilingual responses.', 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=250&fit=crop', 'Support', 'GPT-4', 4.5, 15420, 'HelpDesk AI', 'HA', false, ARRAY['Ticketing','Chat','NLP'], 'Free', '{"role": "support_agent", "skills": ["sentiment_analysis", "escalation", "multilingual"]}'::jsonb),
  (gen_random_uuid(), 'Task Master', 'Project management automation with smart task assignment, deadline tracking, and team productivity insights.', 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=250&fit=crop', 'Productivity', 'CrewAI', 4.3, 5432, 'Productive AI', 'PA', false, ARRAY['PM','Kanban','Teams'], '$5/mo', '{"role": "project_manager", "skills": ["task_assignment", "deadline_tracking", "productivity"]}'::jsonb),
  (gen_random_uuid(), 'Sales Accelerator', 'AI-powered sales pipeline management, lead scoring, and automated follow-ups to close deals faster.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop', 'Marketing', 'Claude', 4.7, 7891, 'Revenue AI', 'RA', false, ARRAY['CRM','Leads','Funnel'], '$15/mo', '{"role": "sales_rep", "skills": ["lead_scoring", "pipeline", "follow_up"]}'::jsonb),
  (gen_random_uuid(), 'DevOps Guardian', 'Infrastructure monitoring, anomaly detection, and automated incident response for cloud-native systems.', 'https://images.unsplash.com/photo-1667372393119-3d4c48d07cc9?w=400&h=250&fit=crop', 'Development', 'Custom', 4.4, 3210, 'CloudOps', 'CO', false, ARRAY['DevOps','SRE','Cloud'], '$25/mo', '{"role": "sre_engineer", "skills": ["monitoring", "incident_response", "cloud"]}'::jsonb),
  (gen_random_uuid(), 'Meeting Scribe', 'Real-time meeting transcription, action item extraction, and smart summarization for every conversation.', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=250&fit=crop', 'Productivity', 'GPT-4', 4.6, 9876, 'NoteTaker AI', 'NT', false, ARRAY['Transcription','Notes','Zoom'], '$7/mo', '{"role": "meeting_assistant", "skills": ["transcription", "summarization", "action_items"]}'::jsonb),
  (gen_random_uuid(), 'Security Auditor', 'Continuous security posture assessment, vulnerability scanning, and compliance report generation.', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=250&fit=crop', 'Analysis', 'Kimi', 4.2, 2156, 'SecureAI', 'SA', false, ARRAY['Security','Compliance','Audit'], '$29/mo', '{"role": "security_analyst", "skills": ["vulnerability_scanning", "compliance", "reporting"]}'::jsonb),
  (gen_random_uuid(), 'Email Composer', 'Smart email drafting with tone adjustment, follow-up scheduling, and inbox prioritization.', 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=250&fit=crop', 'Productivity', 'Claude', 4.1, 4567, 'Inbox AI', 'IA', false, ARRAY['Email','Gmail','Outlook'], '$3/mo', '{"role": "email_assistant", "skills": ["drafting", "tone_adjustment", "scheduling"]}'::jsonb),
  (gen_random_uuid(), 'Custom Workflow Builder', 'Build your own multi-step AI workflows with visual drag-and-drop interface and 50+ integrations.', 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=400&h=250&fit=crop', 'Custom', 'CrewAI', 4.5, 3456, 'FlowBuilder', 'FB', false, ARRAY['No-Code','Workflow','Integration'], '$49/mo', '{"role": "workflow_builder", "skills": ["no_code", "integration", "automation"]}'::jsonb),
  (gen_random_uuid(), 'Social Media Pilot', 'Automated social media scheduling, content curation, and engagement analytics across all platforms.', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=250&fit=crop', 'Marketing', 'GPT-4', 4.3, 6789, 'SocialFly', 'SF', false, ARRAY['Social','Analytics','Scheduler'], '$12/mo', '{"role": "social_media_manager", "skills": ["scheduling", "curation", "analytics"]}'::jsonb);
