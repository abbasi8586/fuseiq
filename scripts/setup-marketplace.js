const { Client } = require('pg');

// Try Supabase connection pooler (session mode) with service_role key as password
const client = new Client({
  host: 'db.kowwqfadifawowfrdiyz.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtvd3dxZmFkaWZhd293ZnJkaXl6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzIxODI3NywiZXhwIjoyMDkyNzk0Mjc3fQ.8jzQOAWA6uMGWzHc7qnd4OPkGpp6euidLsIc5pkxziY',
  ssl: { rejectUnauthorized: false, mode: 'require' }
});

async function run() {
  try {
    await client.connect();
    console.log('Connected via session pooler!');
    
    // Create tables
    await client.query(`
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
    `);
    console.log('marketplace_agents table created');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_installations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        agent_id UUID NOT NULL REFERENCES marketplace_agents(id) ON DELETE CASCADE,
        installed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        UNIQUE(user_id, agent_id)
      );
    `);
    console.log('user_installations table created');
    
    // Enable RLS
    await client.query('ALTER TABLE marketplace_agents ENABLE ROW LEVEL SECURITY;');
    await client.query('ALTER TABLE user_installations ENABLE ROW LEVEL SECURITY;');
    
    // Create policies
    await client.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT FROM pg_policies WHERE schemaname = 'public' AND tablename = 'marketplace_agents' AND policyname = 'marketplace_agents_select') THEN
          CREATE POLICY "marketplace_agents_select" ON marketplace_agents FOR SELECT TO authenticated USING (true);
        END IF;
      END $$;
    `);
    
    await client.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_installations' AND policyname = 'user_installations_select_own') THEN
          CREATE POLICY "user_installations_select_own" ON user_installations FOR SELECT TO authenticated USING (user_id = auth.uid());
          CREATE POLICY "user_installations_insert_own" ON user_installations FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
          CREATE POLICY "user_installations_delete_own" ON user_installations FOR DELETE TO authenticated USING (user_id = auth.uid());
        END IF;
      END $$;
    `);
    console.log('Policies created');
    
    // Seed data
    const seedData = [
      { name: 'Code Review Pro', description: 'Automated code review with AI-powered suggestions, security scans, and performance analysis for every pull request.', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop', category: 'Development', framework: 'GPT-4', rating: 4.8, installs: 12453, author: 'DevOps Labs', author_avatar: 'DL', featured: true, tags: ['GitHub','CI/CD','Security'], price: 'Free', config: {role: 'code_reviewer', skills: ['security', 'performance', 'best_practices']} },
      { name: 'Content Catalyst', description: 'Generate SEO-optimized blog posts, social media content, and email campaigns with brand voice consistency.', image: 'https://images.unsplash.com/photo-1499750310107-5fef28a6667a?w=400&h=250&fit=crop', category: 'Marketing', framework: 'Claude', rating: 4.6, installs: 8932, author: 'GrowthStack', author_avatar: 'GS', featured: true, tags: ['SEO','Social','Email'], price: '$9/mo', config: {role: 'content_writer', skills: ['seo', 'copywriting', 'social_media']} },
      { name: 'Data Insight Engine', description: 'Transform raw data into actionable business intelligence with automated reports and predictive analytics.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop', category: 'Analysis', framework: 'Kimi', rating: 4.9, installs: 6721, author: 'Analytics Pro', author_avatar: 'AP', featured: true, tags: ['BI','Predictive','Reports'], price: '$19/mo', config: {role: 'data_analyst', skills: ['sql', 'visualization', 'forecasting']} },
      { name: 'Support Sentinel', description: '24/7 intelligent customer support with sentiment analysis, escalation routing, and multilingual responses.', image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=250&fit=crop', category: 'Support', framework: 'GPT-4', rating: 4.5, installs: 15420, author: 'HelpDesk AI', author_avatar: 'HA', featured: false, tags: ['Ticketing','Chat','NLP'], price: 'Free', config: {role: 'support_agent', skills: ['sentiment_analysis', 'escalation', 'multilingual']} },
      { name: 'Task Master', description: 'Project management automation with smart task assignment, deadline tracking, and team productivity insights.', image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=250&fit=crop', category: 'Productivity', framework: 'CrewAI', rating: 4.3, installs: 5432, author: 'Productive AI', author_avatar: 'PA', featured: false, tags: ['PM','Kanban','Teams'], price: '$5/mo', config: {role: 'project_manager', skills: ['task_assignment', 'deadline_tracking', 'productivity']} },
      { name: 'Sales Accelerator', description: 'AI-powered sales pipeline management, lead scoring, and automated follow-ups to close deals faster.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop', category: 'Marketing', framework: 'Claude', rating: 4.7, installs: 7891, author: 'Revenue AI', author_avatar: 'RA', featured: false, tags: ['CRM','Leads','Funnel'], price: '$15/mo', config: {role: 'sales_rep', skills: ['lead_scoring', 'pipeline', 'follow_up']} },
      { name: 'DevOps Guardian', description: 'Infrastructure monitoring, anomaly detection, and automated incident response for cloud-native systems.', image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07cc9?w=400&h=250&fit=crop', category: 'Development', framework: 'Custom', rating: 4.4, installs: 3210, author: 'CloudOps', author_avatar: 'CO', featured: false, tags: ['DevOps','SRE','Cloud'], price: '$25/mo', config: {role: 'sre_engineer', skills: ['monitoring', 'incident_response', 'cloud']} },
      { name: 'Meeting Scribe', description: 'Real-time meeting transcription, action item extraction, and smart summarization for every conversation.', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=250&fit=crop', category: 'Productivity', framework: 'GPT-4', rating: 4.6, installs: 9876, author: 'NoteTaker AI', author_avatar: 'NT', featured: false, tags: ['Transcription','Notes','Zoom'], price: '$7/mo', config: {role: 'meeting_assistant', skills: ['transcription', 'summarization', 'action_items']} },
      { name: 'Security Auditor', description: 'Continuous security posture assessment, vulnerability scanning, and compliance report generation.', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=250&fit=crop', category: 'Analysis', framework: 'Kimi', rating: 4.2, installs: 2156, author: 'SecureAI', author_avatar: 'SA', featured: false, tags: ['Security','Compliance','Audit'], price: '$29/mo', config: {role: 'security_analyst', skills: ['vulnerability_scanning', 'compliance', 'reporting']} },
      { name: 'Email Composer', description: 'Smart email drafting with tone adjustment, follow-up scheduling, and inbox prioritization.', image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=250&fit=crop', category: 'Productivity', framework: 'Claude', rating: 4.1, installs: 4567, author: 'Inbox AI', author_avatar: 'IA', featured: false, tags: ['Email','Gmail','Outlook'], price: '$3/mo', config: {role: 'email_assistant', skills: ['drafting', 'tone_adjustment', 'scheduling']} },
      { name: 'Custom Workflow Builder', description: 'Build your own multi-step AI workflows with visual drag-and-drop interface and 50+ integrations.', image: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=400&h=250&fit=crop', category: 'Custom', framework: 'CrewAI', rating: 4.5, installs: 3456, author: 'FlowBuilder', author_avatar: 'FB', featured: false, tags: ['No-Code','Workflow','Integration'], price: '$49/mo', config: {role: 'workflow_builder', skills: ['no_code', 'integration', 'automation']} },
      { name: 'Social Media Pilot', description: 'Automated social media scheduling, content curation, and engagement analytics across all platforms.', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=250&fit=crop', category: 'Marketing', framework: 'GPT-4', rating: 4.3, installs: 6789, author: 'SocialFly', author_avatar: 'SF', featured: false, tags: ['Social','Analytics','Scheduler'], price: '$12/mo', config: {role: 'social_media_manager', skills: ['scheduling', 'curation', 'analytics']} }
    ];
    
    // Clear existing data and re-seed
    await client.query('DELETE FROM marketplace_agents;');
    
    for (const agent of seedData) {
      await client.query(`
        INSERT INTO marketplace_agents (name, description, image, category, framework, rating, installs, author, author_avatar, featured, tags, price, config)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `, [
        agent.name, agent.description, agent.image, agent.category, agent.framework,
        agent.rating, agent.installs, agent.author, agent.author_avatar, agent.featured,
        agent.tags, agent.price, JSON.stringify(agent.config)
      ]);
    }
    console.log('Seed data inserted');
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

run();
