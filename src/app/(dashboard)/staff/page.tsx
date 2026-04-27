import { createServerClient } from "@/lib/supabase/client";
import { StaffDirectoryClient } from "./client";

export default async function StaffDirectoryPage() {
  const supabase = createServerClient();
  
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
  
  return <StaffDirectoryClient initialStaff={staffMembers} />;
}
