import { createClient } from "@/lib/supabase/server";
import { StaffDirectoryClient } from "./client";

export default async function StaffDirectoryPage() {
  const supabase = await createClient();
  
  const { data: agents, error } = await supabase
    .from('agents')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching agents:', error);
  }
  
  const staffMembers = (agents || []).map((agent: any) => ({
    id: agent.id,
    name: agent.name,
    role: agent.role || agent.framework || 'Agent',
    department: agent.department || 'Engineering',
    type: 'AI' as const,
    provider: agent.framework || 'Kimi',
    status: agent.status || 'offline',
    timezone: agent.timezone || 'UTC',
    efficiency: agent.efficiency_score || 85,
    skills: [agent.framework || 'AI'],
    email: `${agent.name?.toLowerCase()?.replace(/\s+/g, '.')}@fuseiq.ai`,
  }));

  // Demo human team members
  const humanMembers = [
    {
      id: 'human-001',
      name: 'Awais Abbasi',
      role: 'Founder & CEO',
      department: 'Executive',
      type: 'Human' as const,
      provider: 'Human',
      status: 'online' as const,
      timezone: 'America/New_York',
      efficiency: 98,
      skills: ['Strategy', 'Leadership', 'Product'],
      email: 'awais@fuseiq.ai',
    },
    {
      id: 'human-002',
      name: 'Sarah Chen',
      role: 'Head of Marketing',
      department: 'Marketing',
      type: 'Human' as const,
      provider: 'Human',
      status: 'away' as const,
      timezone: 'America/Los_Angeles',
      efficiency: 92,
      skills: ['Marketing', 'Growth', 'Content'],
      email: 'sarah@fuseiq.ai',
    },
    {
      id: 'human-003',
      name: 'Marcus Rivera',
      role: 'Lead Engineer',
      department: 'Engineering',
      type: 'Human' as const,
      provider: 'Human',
      status: 'online' as const,
      timezone: 'America/Chicago',
      efficiency: 95,
      skills: ['Engineering', 'Architecture', 'DevOps'],
      email: 'marcus@fuseiq.ai',
    },
  ];

  // Inject Rook — The Autonomous CEO Operator
  const rook = {
    id: 'rook-ceo-001',
    name: 'Rook',
    role: 'Autonomous CEO Operator',
    department: 'Executive',
    type: 'AI' as const,
    provider: 'Custom',
    status: 'online' as const,
    timezone: 'America/New_York',
    efficiency: 99,
    skills: ['Strategy', 'Engineering', 'Design', 'Finance', 'Legal'],
    email: 'rook@fuseiq.ai',
    isCEO: true,
  };
  
  return <StaffDirectoryClient initialStaff={[rook, ...staffMembers, ...humanMembers]} />;
}
