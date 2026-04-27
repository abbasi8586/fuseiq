export interface Agent {
  id: string;
  name: string;
  framework: 'Kimi' | 'CrewAI' | 'LangGraph' | 'AutoGen' | 'OpenAI' | 'Anthropic' | 'Google' | 'Custom' | 'Human';
  provider: string;
  status: 'online' | 'offline' | 'busy' | 'paused';
  type: 'AI' | 'Human';
  role?: string;
  department?: string;
  efficiency?: number;
  executions?: number;
  costToday?: number;
  avatar?: string;
  timezone?: string;
  lastActive?: string;
  config?: Record<string, any>;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  type: 'AI' | 'Human';
  provider?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  timezone: string;
  avatar?: string;
  efficiency: number;
  skills?: string[];
  email?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: string;
  assigneeName?: string;
  dueDate?: string;
  progress: number;
  tags?: string[];
  comments?: number;
}

export interface Approval {
  id: string;
  agentId: string;
  agentName: string;
  action: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  estimatedCost?: number;
  status: 'pending' | 'approved' | 'rejected';
  requester: string;
  createdAt: string;
  resolvedAt?: string;
  resolver?: string;
}

export interface Provider {
  id: string;
  name: string;
  keyType: string;
  models: string[];
  isActive: boolean;
  encrypted: boolean;
  costInput?: number;
  costOutput?: number;
}

export interface KPIData {
  activeAgents: number;
  executionsToday: number;
  successRate: number;
  avgCostPerRun: number;
  trends: {
    activeAgents: number;
    executionsToday: number;
    successRate: number;
    avgCostPerRun: number;
  };
}

export interface CostData {
  dailyTotal: number;
  providerBreakdown: { provider: string; cost: number; percentage: number }[];
  frameworkBreakdown: { framework: string; cost: number }[];
  history: { date: string; cost: number }[];
}

export interface ActivityEvent {
  id: string;
  type: 'agent_start' | 'agent_complete' | 'agent_fail' | 'approval_request' | 'approval_resolve' | 'task_created' | 'task_completed' | 'message';
  actor: string;
  target?: string;
  message: string;
  timestamp: string;
  severity?: 'info' | 'success' | 'warning' | 'error';
}

export interface Workflow {
  id: string;
  name: string;
  definition: any;
  version: number;
  isActive: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  authorType: 'AI' | 'Human';
  content: string;
  createdAt: string;
  reactions?: { emoji: string; count: number }[];
}

export interface Channel {
  id: string;
  name: string;
  type: 'team' | 'agent' | 'department';
  unreadCount?: number;
  lastMessage?: string;
  lastMessageAt?: string;
}

export type Mode = 'AI' | 'Human' | 'Hybrid';

export type Role = 'Director' | 'Manager' | 'Member' | 'Viewer';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: 'Starter' | 'Professional' | 'Enterprise';
  ownerId: string;
  settings?: Record<string, any>;
  createdAt: string;
}