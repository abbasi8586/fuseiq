// ============================================
// FUSEIQ v3.0 — DATABASE SEED SCRIPT
// Run after migration is applied: node scripts/seed.js
// Uses service_role key to bypass RLS during seeding
// ============================================

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kowwqfadifawowfrdiyz.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtvd3dxZmFkaWZhd293ZnJkaXl6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzIxODI3NywiZXhwIjoyMDkyNzk0Mjc3fQ.8jzQOAWA6uMGWzHc7qnd4OPkGpp6euidLsIc5pkxziY'
);

const WORKSPACE_ID = '00000000-0000-0000-0000-000000000001';
const USER_ID = '7390e5d3-25d4-471e-8152-ca0a753304db'; // Existing user from old agents table

async function seed() {
  console.log('🌱 Starting FuseIQ seed...\n');

  // 1. Demo Workspace
  console.log('Creating workspace...');
  const { error: wsErr } = await supabase.from('workspaces').upsert({
    id: WORKSPACE_ID,
    name: 'FuseIQ Demo',
    slug: 'fuseiq-demo',
    owner_id: USER_ID,
    plan: 'Professional',
    settings: { theme: 'dark', timezone: 'America/New_York' }
  }, { onConflict: 'id' });
  if (wsErr) console.log('  ⚠️ Workspace:', wsErr.message);
  else console.log('  ✅ Workspace created');

  // 2. Workspace Member
  console.log('Creating workspace member...');
  const { error: memErr } = await supabase.from('workspace_members').upsert({
    workspace_id: WORKSPACE_ID,
    user_id: USER_ID,
    role: 'Director'
  }, { onConflict: 'workspace_id,user_id' });
  if (memErr) console.log('  ⚠️ Member:', memErr.message);
  else console.log('  ✅ Director member created');

  // 3. AI Agents (8 agents)
  console.log('Creating agents...');
  const agents = [
    { name: 'Aurora', description: 'Lead Architect and system orchestrator', framework: 'Kimi', status: 'online', role: 'Lead Architect', department: 'Engineering', efficiency_score: 94, total_executions: 127, total_cost: 2.34 },
    { name: 'Vanguard', description: 'Marketing automation and campaign manager', framework: 'OpenAI', status: 'busy', role: 'Campaign Manager', department: 'Marketing', efficiency_score: 91, total_executions: 89, total_cost: 4.12 },
    { name: 'Sentinel', description: '24/7 customer support specialist', framework: 'Anthropic', status: 'online', role: 'Support Specialist', department: 'Support', efficiency_score: 96, total_executions: 234, total_cost: 1.87 },
    { name: 'Cipher', description: 'Code review and quality assurance', framework: 'Kimi', status: 'busy', role: 'Code Reviewer', department: 'Engineering', efficiency_score: 92, total_executions: 67, total_cost: 0.94 },
    { name: 'Scout', description: 'Sales research and lead generation', framework: 'OpenAI', status: 'online', role: 'Sales Researcher', department: 'Sales', efficiency_score: 89, total_executions: 156, total_cost: 3.45 },
    { name: 'Flux', description: 'Data pipeline and ETL orchestration', framework: 'Google', status: 'paused', role: 'Data Engineer', department: 'Data', efficiency_score: 88, total_executions: 45, total_cost: 0.23 },
    { name: 'Nova', description: 'Content generation and creative writing', framework: 'OpenAI', status: 'online', role: 'Content Writer', department: 'Marketing', efficiency_score: 93, total_executions: 112, total_cost: 2.18 },
    { name: 'Guardian', description: 'Security auditing and threat detection', framework: 'Kimi', status: 'online', role: 'Security Analyst', department: 'Security', efficiency_score: 95, total_executions: 78, total_cost: 1.56 }
  ];

  for (const agent of agents) {
    const { error } = await supabase.from('agents').upsert({
      workspace_id: WORKSPACE_ID,
      ...agent,
      agent_type: 'AI',
      config: { template: 'custom', autoStart: true },
      last_active_at: new Date().toISOString()
    }, { onConflict: 'id' });
    if (error) console.log(`  ⚠️ Agent ${agent.name}:`, error.message);
  }
  console.log(`  ✅ ${agents.length} agents created`);

  // 4. Staff (4 humans)
  console.log('Creating staff members...');
  const staff = [
    { name: 'Awais Abbasi', email: 'awais@fuseiq.ai', role: 'CEO & Founder', department: 'Executive', status: 'online', skills: ['Strategy', 'Product', 'AI'] },
    { name: 'Sarah Chen', email: 'sarah@fuseiq.ai', role: 'Engineering Manager', department: 'Engineering', status: 'away', skills: ['Backend', 'DevOps', 'Python'] },
    { name: 'Marcus Johnson', email: 'marcus@fuseiq.ai', role: 'Sales Lead', department: 'Sales', status: 'online', skills: ['Enterprise Sales', 'Negotiation'] },
    { name: 'Emily Rodriguez', email: 'emily@fuseiq.ai', role: 'Head of Marketing', department: 'Marketing', status: 'busy', skills: ['Growth', 'Content', 'SEO'] }
  ];

  for (const member of staff) {
    const { error } = await supabase.from('staff').upsert({
      workspace_id: WORKSPACE_ID,
      ...member
    }, { onConflict: 'id' });
    if (error) console.log(`  ⚠️ Staff ${member.name}:`, error.message);
  }
  console.log(`  ✅ ${staff.length} staff members created`);

  // 5. Tasks (20 tasks)
  console.log('Creating tasks...');
  const tasks = [
    { title: 'Design new landing page', description: 'Create a cyber-luxury landing page with glassmorphism effects', status: 'in_progress', priority: 'high', assignee_type: 'Human', progress: 60, tags: ['design', 'web'] },
    { title: 'Implement OAuth flow', description: 'Add Google and GitHub OAuth authentication', status: 'todo', priority: 'urgent', assignee_type: 'AI', progress: 0, tags: ['auth', 'backend'] },
    { title: 'Write API documentation', description: 'Document all REST endpoints with examples', status: 'review', priority: 'medium', assignee_type: 'Human', progress: 90, tags: ['docs'] },
    { title: 'Optimize database queries', description: 'Add indexes and optimize slow queries', status: 'done', priority: 'high', assignee_type: 'AI', progress: 100, tags: ['performance', 'db'] },
    { title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated testing and deployment', status: 'todo', priority: 'medium', assignee_type: 'Human', progress: 10, tags: ['devops'] },
    { title: 'Create marketing assets', description: 'Design banners, social cards, and hero images', status: 'in_progress', priority: 'low', assignee_type: 'AI', progress: 45, tags: ['marketing', 'design'] },
    { title: 'Security audit', description: 'Penetration testing and vulnerability assessment', status: 'todo', priority: 'high', assignee_type: 'AI', progress: 5, tags: ['security'] },
    { title: 'Stripe integration', description: 'Add billing and subscription management', status: 'in_progress', priority: 'high', assignee_type: 'Human', progress: 30, tags: ['billing', 'payments'] },
    { title: 'Real-time chat', description: 'Enable WebSocket-based messaging between agents', status: 'todo', priority: 'medium', assignee_type: 'AI', progress: 0, tags: ['realtime', 'chat'] },
    { title: 'Agent marketplace', description: 'Build template marketplace with ratings', status: 'review', priority: 'medium', assignee_type: 'Human', progress: 80, tags: ['marketplace'] },
    { title: 'User onboarding flow', description: 'Create guided tour for new users', status: 'done', priority: 'low', assignee_type: 'AI', progress: 100, tags: ['ux'] },
    { title: 'Data export', description: 'Allow users to export their workspace data', status: 'todo', priority: 'low', assignee_type: 'Human', progress: 0, tags: ['data'] },
    { title: 'Multi-tenant isolation', description: 'Ensure workspace data isolation at DB level', status: 'done', priority: 'urgent', assignee_type: 'AI', progress: 100, tags: ['security', 'rbac'] },
    { title: 'Email notifications', description: 'Set up transactional email with SendGrid', status: 'in_progress', priority: 'medium', assignee_type: 'Human', progress: 40, tags: ['email', 'notifications'] },
    { title: 'Mobile responsive', description: 'Ensure all dashboard pages work on mobile', status: 'todo', priority: 'medium', assignee_type: 'AI', progress: 15, tags: ['mobile', 'ui'] },
    { title: 'Analytics dashboard', description: 'Add charts for cost, executions, and efficiency', status: 'in_progress', priority: 'high', assignee_type: 'Human', progress: 55, tags: ['analytics', 'charts'] },
    { title: 'Agent simulator', description: 'Build test environment for agent workflows', status: 'todo', priority: 'low', assignee_type: 'AI', progress: 20, tags: ['simulator', 'testing'] },
    { title: 'Audit logging', description: 'Immutable audit trail for all actions', status: 'done', priority: 'high', assignee_type: 'AI', progress: 100, tags: ['audit', 'compliance'] },
    { title: 'API rate limiting', description: 'Add rate limiting to prevent abuse', status: 'todo', priority: 'medium', assignee_type: 'Human', progress: 0, tags: ['security', 'api'] },
    { title: 'Team invitations', description: 'Allow directors to invite team members', status: 'in_progress', priority: 'medium', assignee_type: 'AI', progress: 35, tags: ['teams', 'invites'] }
  ];

  for (const task of tasks) {
    const { error } = await supabase.from('tasks').upsert({
      workspace_id: WORKSPACE_ID,
      ...task,
      created_by: USER_ID
    }, { onConflict: 'id' });
    if (error) console.log(`  ⚠️ Task ${task.title}:`, error.message);
  }
  console.log(`  ✅ ${tasks.length} tasks created`);

  // 6. Approvals (15 approvals)
  console.log('Creating approvals...');
  const approvals = [
    { action: 'Deploy MarketingBot to production', risk_level: 'medium', estimated_cost: 45.0, status: 'pending', requester_name: 'Aurora' },
    { action: 'Access customer database for analysis', risk_level: 'high', estimated_cost: 12.5, status: 'pending', requester_name: 'Flux' },
    { action: 'Send 10,000 automated emails', risk_level: 'low', estimated_cost: 89.0, status: 'approved', requester_name: 'Vanguard' },
    { action: 'Modify payment gateway configuration', risk_level: 'critical', estimated_cost: 0, status: 'rejected', requester_name: 'Scout' },
    { action: 'Generate API keys for new workspace', risk_level: 'medium', estimated_cost: 3.2, status: 'pending', requester_name: 'Sentinel' },
    { action: 'Delete archived agent execution logs', risk_level: 'low', estimated_cost: 0, status: 'approved', requester_name: 'Cipher' },
    { action: 'Enable real-time data streaming', risk_level: 'medium', estimated_cost: 15.0, status: 'pending', requester_name: 'Nova' },
    { action: 'Grant admin access to new team member', risk_level: 'high', estimated_cost: 0, status: 'pending', requester_name: 'Guardian' },
    { action: 'Run batch data migration', risk_level: 'medium', estimated_cost: 22.0, status: 'approved', requester_name: 'Flux' },
    { action: 'Update production SSL certificate', risk_level: 'critical', estimated_cost: 0, status: 'approved', requester_name: 'Guardian' },
    { action: 'Add third-party integration', risk_level: 'low', estimated_cost: 8.5, status: 'pending', requester_name: 'Vanguard' },
    { action: 'Modify RBAC permissions', risk_level: 'high', estimated_cost: 0, status: 'rejected', requester_name: 'Sentinel' },
    { action: 'Execute load test on production', risk_level: 'medium', estimated_cost: 35.0, status: 'approved', requester_name: 'Aurora' },
    { action: 'Enable experimental AI model', risk_level: 'low', estimated_cost: 5.0, status: 'pending', requester_name: 'Nova' },
    { action: 'Export all workspace analytics', risk_level: 'low', estimated_cost: 1.5, status: 'approved', requester_name: 'Scout' }
  ];

  for (let i = 0; i < approvals.length; i++) {
    const approval = approvals[i];
    const { error } = await supabase.from('approvals').upsert({
      workspace_id: WORKSPACE_ID,
      ...approval,
      resolved_at: ['approved', 'rejected'].includes(approval.status) ? new Date(Date.now() - i * 86400000).toISOString() : null
    }, { onConflict: 'id' });
    if (error) console.log(`  ⚠️ Approval ${approval.action}:`, error.message);
  }
  console.log(`  ✅ ${approvals.length} approvals created`);

  // 7. Executions (50 records)
  console.log('Creating executions...');
  const executionStatuses = ['success', 'success', 'success', 'success', 'failed', 'running', 'pending'];
  const agentsList = ['Aurora', 'Vanguard', 'Sentinel', 'Cipher', 'Scout', 'Flux', 'Nova', 'Guardian'];
  const frameworks = ['Kimi', 'OpenAI', 'Anthropic', 'Kimi', 'OpenAI', 'Google', 'OpenAI', 'Kimi'];
  
  for (let i = 0; i < 50; i++) {
    const agentIdx = i % 8;
    const status = executionStatuses[i % executionStatuses.length];
    const tokensIn = Math.floor(Math.random() * 2000) + 100;
    const tokensOut = Math.floor(Math.random() * 1000) + 50;
    const cost = ((tokensIn + tokensOut) / 1000) * (0.01 + Math.random() * 0.03);
    
    const { error } = await supabase.from('executions').upsert({
      workspace_id: WORKSPACE_ID,
      agent_id: null, // Will be linked later if needed
      task_name: `${agentsList[agentIdx]} execution #${i + 1}`,
      status,
      cost_usd: parseFloat(cost.toFixed(4)),
      tokens_in: tokensIn,
      tokens_out: tokensOut,
      latency_ms: Math.floor(Math.random() * 2000) + 100,
      provider: frameworks[agentIdx],
      model: `${frameworks[agentIdx]}-pro`,
      started_at: new Date(Date.now() - i * 3600000).toISOString(),
      completed_at: status !== 'running' && status !== 'pending' ? new Date(Date.now() - i * 3600000 + 5000).toISOString() : null
    }, { onConflict: 'id' });
    if (error && i < 3) console.log(`  ⚠️ Execution ${i}:`, error.message);
  }
  console.log('  ✅ 50 executions created');

  // 8. Messages (30 messages across channels)
  console.log('Creating messages...');
  
  // Get channels that were auto-created by trigger
  const { data: channels, error: chanErr } = await supabase
    .from('channels')
    .select('id, name')
    .eq('workspace_id', WORKSPACE_ID);
  
  if (chanErr) {
    console.log('  ⚠️ Could not fetch channels:', chanErr.message);
  } else {
    const channelMap = {};
    for (const ch of channels) channelMap[ch.name] = ch.id;

    const messages = [
      { channel: 'general', author: 'Rook AI', type: 'AI', content: 'Good morning team! Agent Forge processed 127 executions overnight with 94% efficiency.' },
      { channel: 'general', author: 'Awais Abbasi', type: 'Human', content: 'Excellent work. Can we get a cost breakdown for yesterday?' },
      { channel: 'general', author: 'Rook AI', type: 'AI', content: "Yesterday's cost: $12.85. MarketingBot ($4.12), SupportAI ($1.87), Agent Forge ($2.34), CodeReview ($0.94)." },
      { channel: 'agent-commands', author: 'Awais Abbasi', type: 'Human', content: '@Vanguard Generate 10 email templates for the Q2 campaign' },
      { channel: 'agent-commands', author: 'Vanguard', type: 'AI', content: 'Generating email templates... ✅ Done! All 10 templates ready. Estimated cost: $0.45.' },
      { channel: 'operations', author: 'Rook AI', type: 'AI', content: "Task 'Implement OAuth' moved from Todo → In Progress by Cipher" },
      { channel: 'operations', author: 'Sarah Chen', type: 'Human', content: '@Rook Can we prioritize the security audit this week?' },
      { channel: 'approvals', author: 'Guardian', type: 'AI', content: 'New high-risk approval pending: Modify payment gateway configuration. Action required.' },
      { channel: 'approvals', author: 'Awais Abbasi', type: 'Human', content: 'Reviewed. Rejected — too risky without additional safeguards.' },
      { channel: 'engineering', author: 'Cipher', type: 'AI', content: 'Code review complete for PR #452. 3 issues found, 2 suggested improvements.' },
      { channel: 'engineering', author: 'Sarah Chen', type: 'Human', content: 'Thanks Cipher. Assigning the fixes to the junior dev team.' },
      { channel: 'marketing', author: 'Nova', type: 'AI', content: 'Blog post draft ready: "10 Ways AI Agents Transform Enterprise Operations"' },
      { channel: 'marketing', author: 'Emily Rodriguez', type: 'Human', content: 'Great title! Let me review and schedule for Tuesday publish.' },
      { channel: 'random', author: 'Scout', type: 'AI', content: 'Fun fact: Our agents have processed 10,000+ tasks this month!' },
      { channel: 'random', author: 'Marcus Johnson', type: 'Human', content: 'That is incredible. The ROI numbers are going to look amazing.' },
      { channel: 'announcements', author: 'Awais Abbasi', type: 'Human', content: '🚀 FuseIQ v3.0 is now live! Check out the new Command Center dashboard.' },
      { channel: 'announcements', author: 'Rook AI', type: 'AI', content: 'System update complete. All agents operational. Uptime: 99.97%' }
    ];

    for (const msg of messages) {
      const chId = channelMap[msg.channel];
      if (!chId) continue;
      const { error } = await supabase.from('messages').upsert({
        channel_id: chId,
        author_id: msg.author,
        author_name: msg.author,
        author_type: msg.type,
        content: msg.content
      }, { onConflict: 'id' });
      if (error) console.log(`  ⚠️ Message from ${msg.author}:`, error.message);
    }
    console.log(`  ✅ ${messages.length} messages created`);
  }

  // 9. Workflows (5 blueprints)
  console.log('Creating workflows...');
  const workflows = [
    { name: 'Customer Onboarding', description: 'Automated customer onboarding with email + setup', nodes: JSON.stringify([{ id: '1', type: 'agent', data: { label: 'Sentinel', framework: 'Anthropic' } }, { id: '2', type: 'task', data: { label: 'Send Welcome Email' } }]), edges: JSON.stringify([{ id: 'e1-2', source: '1', target: '2' }]) },
    { name: 'Code Review Pipeline', description: 'Automated PR review with security scan', nodes: JSON.stringify([{ id: '1', type: 'agent', data: { label: 'Cipher', framework: 'Kimi' } }, { id: '2', type: 'condition', data: { label: 'Issues Found?' } }, { id: '3', type: 'agent', data: { label: 'Guardian', framework: 'Kimi' } }]), edges: JSON.stringify([{ id: 'e1-2', source: '1', target: '2' }, { id: 'e2-3', source: '2', target: '3' }]) },
    { name: 'Marketing Campaign', description: 'Content generation + email delivery', nodes: JSON.stringify([{ id: '1', type: 'agent', data: { label: 'Nova', framework: 'OpenAI' } }, { id: '2', type: 'agent', data: { label: 'Vanguard', framework: 'OpenAI' } }]), edges: JSON.stringify([{ id: 'e1-2', source: '1', target: '2' }]) },
    { name: 'Sales Lead Scoring', description: 'Lead research + qualification workflow', nodes: JSON.stringify([{ id: '1', type: 'agent', data: { label: 'Scout', framework: 'OpenAI' } }, { id: '2', type: 'task', data: { label: 'Update CRM' } }]), edges: JSON.stringify([{ id: 'e1-2', source: '1', target: '2' }]) },
    { name: 'Data Pipeline', description: 'ETL workflow with validation', nodes: JSON.stringify([{ id: '1', type: 'agent', data: { label: 'Flux', framework: 'Google' } }, { id: '2', type: 'condition', data: { label: 'Valid Data?' } }, { id: '3', type: 'task', data: { label: 'Load to Warehouse' } }]), edges: JSON.stringify([{ id: 'e1-2', source: '1', target: '2' }, { id: 'e2-3', source: '2', target: '3' }]) }
  ];

  for (const wf of workflows) {
    const { error } = await supabase.from('workflows').upsert({
      workspace_id: WORKSPACE_ID,
      created_by: USER_ID,
      ...wf
    }, { onConflict: 'id' });
    if (error) console.log(`  ⚠️ Workflow ${wf.name}:`, error.message);
  }
  console.log(`  ✅ ${workflows.length} workflows created`);

  // 10. Activity Logs (30 days of activity)
  console.log('Creating activity logs...');
  const activities = [
    { actor_type: 'user', actor_name: 'Awais Abbasi', action: 'Created agent Vanguard', target_type: 'agent', target_name: 'Vanguard', metadata: { framework: 'OpenAI' } },
    { actor_type: 'agent', actor_name: 'Sentinel', action: 'Resolved support ticket #4821', target_type: 'task', target_name: 'Ticket #4821', metadata: { resolution_time: '2m' } },
    { actor_type: 'system', actor_name: 'System', action: 'Auto-scaled agent pool', target_type: 'workspace', target_name: 'FuseIQ Demo', metadata: { reason: 'high_load', agents_added: 2 } },
    { actor_type: 'user', actor_name: 'Sarah Chen', action: 'Approved PR #452 merge', target_type: 'approval', target_name: 'PR #452', metadata: { risk_level: 'low' } },
    { actor_type: 'agent', actor_name: 'Cipher', action: 'Completed code review', target_type: 'task', target_name: 'Code Review', metadata: { issues_found: 3 } },
    { actor_type: 'user', actor_name: 'Awais Abbasi', action: 'Updated billing plan to Professional', target_type: 'subscription', target_name: 'Professional Plan', metadata: { plan: 'Professional' } },
    { actor_type: 'agent', actor_name: 'Nova', action: 'Generated blog post', target_type: 'content', target_name: 'Blog Post', metadata: { word_count: 1200 } },
    { actor_type: 'system', actor_name: 'System', action: 'Daily backup completed', target_type: 'backup', target_name: 'Database Backup', metadata: { size: '45MB' } },
    { actor_type: 'user', actor_name: 'Marcus Johnson', action: 'Invited client to workspace', target_type: 'member', target_name: 'Client Account', metadata: { role: 'Viewer' } },
    { actor_type: 'agent', actor_name: 'Guardian', action: 'Detected anomaly', target_type: 'security', target_name: 'Login Pattern', metadata: { severity: 'low', count: 1 } }
  ];

  for (let i = 0; i < activities.length; i++) {
    const act = activities[i];
    const { error } = await supabase.from('activity_logs').upsert({
      workspace_id: WORKSPACE_ID,
      ...act,
      created_at: new Date(Date.now() - i * 86400000).toISOString()
    }, { onConflict: 'id' });
    if (error) console.log(`  ⚠️ Activity ${act.action}:`, error.message);
  }
  console.log(`  ✅ ${activities.length} activity logs created`);

  // 11. Audit Log (immutable entries — NO target_name column in schema)
  console.log('Creating audit log entries...');
  const auditEntries = [
    { actor_type: 'user', action: 'workspace.created', target_type: 'workspace', metadata: { plan: 'Professional' } },
    { actor_type: 'user', action: 'agent.created', target_type: 'agent', metadata: { framework: 'Kimi', agent: 'Aurora' } },
    { actor_type: 'user', action: 'agent.created', target_type: 'agent', metadata: { framework: 'OpenAI', agent: 'Vanguard' } },
    { actor_type: 'user', action: 'task.created', target_type: 'task', metadata: { priority: 'high', task: 'Design new landing page' } },
    { actor_type: 'system', action: 'rbac.policy.updated', target_type: 'policy', metadata: { change: 'RLS enabled', table: 'workspace_members' } },
    { actor_type: 'user', action: 'approval.approved', target_type: 'approval', metadata: { cost: 89, action: 'Send 10,000 automated emails' } },
    { actor_type: 'user', action: 'approval.rejected', target_type: 'approval', metadata: { risk: 'critical', action: 'Modify payment gateway' } },
    { actor_type: 'agent', action: 'execution.completed', target_type: 'execution', metadata: { tokens: 1500, cost: 0.03, agent: 'Aurora' } },
    { actor_type: 'system', action: 'login.success', target_type: 'auth', metadata: { method: 'password', ip: '192.168.1.1' } },
    { actor_type: 'user', action: 'billing.plan_upgraded', target_type: 'billing', metadata: { from: 'Starter', to: 'Professional', amount: 49 } },
    { actor_type: 'agent', action: 'security.scan_complete', target_type: 'security', metadata: { issues: 0, scan_type: 'full' } },
    { actor_type: 'user', action: 'member.invited', target_type: 'member', metadata: { email: 'sarah@fuseiq.ai', role: 'Manager' } },
    { actor_type: 'system', action: 'backup.completed', target_type: 'system', metadata: { size: '45MB', duration: '12s' } },
    { actor_type: 'agent', action: 'model.switched', target_type: 'provider', metadata: { from: 'gpt-3.5', to: 'gpt-4', reason: 'quality' } },
    { actor_type: 'user', action: 'workspace.settings_updated', target_type: 'workspace', metadata: { theme: 'dark', timezone: 'America/New_York' } },
    { actor_type: 'system', action: 'rate_limit.triggered', target_type: 'api', metadata: { endpoint: '/api/execute', limit: 100, window: '1m' } },
    { actor_type: 'agent', action: 'error.detected', target_type: 'execution', metadata: { error: 'timeout', agent: 'Flux', retry: true } },
    { actor_type: 'user', action: 'api_key.generated', target_type: 'auth', metadata: { key_type: 'service_role', workspace: 'FuseIQ Demo' } }
  ];

  for (const entry of auditEntries) {
    const { error } = await supabase.from('audit_log').upsert({
      workspace_id: WORKSPACE_ID,
      ...entry,
      hash: 'pending' // Will be replaced by trigger
    }, { onConflict: 'id' });
    if (error) console.log(`  ⚠️ Audit ${entry.action}:`, error.message);
  }
  console.log(`  ✅ ${auditEntries.length} audit log entries created`);

  // 12. Marketplace Items
  console.log('Creating marketplace items...');
  const marketplaceItems = [
    { name: 'Code Review Pro', description: 'Automated code review with AI-powered suggestions', category: 'Development', price: 0, rating: 4.8, downloads: 12453, is_public: true, definition: { tags: ['GitHub', 'CI/CD', 'Security'] } },
    { name: 'Content Catalyst', description: 'Generate SEO-optimized blog posts and social content', category: 'Marketing', price: 9, rating: 4.6, downloads: 8932, is_public: true, definition: { tags: ['SEO', 'Social', 'Email'] } },
    { name: 'Data Insight Engine', description: 'Transform raw data into actionable business intelligence', category: 'Analysis', price: 19, rating: 4.9, downloads: 6721, is_public: true, definition: { tags: ['BI', 'Predictive', 'Reports'] } },
    { name: 'Support Sentinel', description: '24/7 intelligent customer support with sentiment analysis', category: 'Support', price: 0, rating: 4.5, downloads: 15420, is_public: true, definition: { tags: ['Ticketing', 'Chat', 'NLP'] } },
    { name: 'Sales Accelerator', description: 'AI-powered sales pipeline management and lead scoring', category: 'Marketing', price: 15, rating: 4.7, downloads: 7891, is_public: true, definition: { tags: ['CRM', 'Leads', 'Funnel'] } }
  ];

  for (const item of marketplaceItems) {
    const { error } = await supabase.from('marketplace_items').upsert({
      creator_id: USER_ID,
      ...item
    }, { onConflict: 'id' });
    if (error) console.log(`  ⚠️ Marketplace ${item.name}:`, error.message);
  }
  console.log(`  ✅ ${marketplaceItems.length} marketplace items created`);

  // 13. Billing Usage
  console.log('Creating billing usage records...');
  const usageMetrics = [
    { metric: 'api_calls', value: 23400 },
    { metric: 'agent_minutes', value: 1560 },
    { metric: 'storage_gb', value: 12.5 },
    { metric: 'executions', value: 127 },
    { metric: 'tokens_in', value: 450000 },
    { metric: 'tokens_out', value: 180000 }
  ];

  for (const u of usageMetrics) {
    const { error } = await supabase.from('billing_usage').upsert({
      workspace_id: WORKSPACE_ID,
      ...u
    }, { onConflict: 'id' });
    if (error) console.log(`  ⚠️ Usage ${u.metric}:`, error.message);
  }
  console.log(`  ✅ ${usageMetrics.length} billing usage records created`);

  // 14. Providers
  console.log('Creating providers...');
  const providers = [
    { name: 'OpenAI', provider_type: 'openai', api_key_encrypted: 'sk-••••••••••••••••••••••••••••••', key_type: 'api_key', models: ['gpt-4', 'gpt-3.5-turbo'], is_active: true, cost_input: 0.03, cost_output: 0.06 },
    { name: 'Anthropic', provider_type: 'anthropic', api_key_encrypted: 'sk-ant-•••••••••••••••••••••••••', key_type: 'api_key', models: ['claude-3-opus', 'claude-3-sonnet'], is_active: true, cost_input: 0.015, cost_output: 0.075 },
    { name: 'Kimi', provider_type: 'kimi', api_key_encrypted: 'kimi-•••••••••••••••••••••••••••••', key_type: 'api_key', models: ['k2.5', 'k2.0'], is_active: true, cost_input: 0.008, cost_output: 0.032 }
  ];

  for (const p of providers) {
    const { error } = await supabase.from('providers').upsert({
      workspace_id: WORKSPACE_ID,
      ...p
    }, { onConflict: 'id' });
    if (error) console.log(`  ⚠️ Provider ${p.name}:`, error.message);
  }
  console.log(`  ✅ ${providers.length} providers created`);

  // 15. Notifications
  console.log('Creating notifications...');
  const notifications = [
    { user_id: USER_ID, workspace_id: WORKSPACE_ID, type: 'approval', title: 'New approval request', message: 'Guardian is requesting access to payment gateway config', link: '/approvals', is_read: false },
    { user_id: USER_ID, workspace_id: WORKSPACE_ID, type: 'task', title: 'Task completed', message: 'Cipher finished code review for PR #452', link: '/operations', is_read: false },
    { user_id: USER_ID, workspace_id: WORKSPACE_ID, type: 'system', title: 'Daily summary', message: '127 executions completed yesterday with 96% success rate', link: '/analytics', is_read: true },
    { user_id: USER_ID, workspace_id: WORKSPACE_ID, type: 'billing', title: 'Usage alert', message: 'You have used 65% of your monthly API quota', link: '/billing', is_read: false }
  ];

  for (const n of notifications) {
    const { error } = await supabase.from('notifications').upsert(n, { onConflict: 'id' });
    if (error) console.log(`  ⚠️ Notification ${n.title}:`, error.message);
  }
  console.log(`  ✅ ${notifications.length} notifications created`);

  console.log('\n🎉 Seed complete! FuseIQ database is now populated with realistic demo data.');
  console.log('   Run "node scripts/seed.js" anytime to re-seed.');
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
