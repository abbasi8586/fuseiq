import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Mock agents for fallback
const MOCK_AGENTS: Record<string, any> = {
  "1": { name: "Code Review Pro", description: "Automated code review with AI-powered suggestions, security scans, and performance analysis.", framework: "GPT-4", category: "Development", config: {role: "code_reviewer", skills: ["security", "performance"]} },
  "2": { name: "Content Catalyst", description: "Generate SEO-optimized blog posts, social media content, and email campaigns.", framework: "Claude", category: "Marketing", config: {role: "content_writer", skills: ["seo", "copywriting"]} },
  "3": { name: "Data Insight Engine", description: "Transform raw data into actionable business intelligence with automated reports.", framework: "Kimi", category: "Analysis", config: {role: "data_analyst", skills: ["sql", "visualization"]} },
  "4": { name: "Support Sentinel", description: "24/7 intelligent customer support with sentiment analysis and escalation routing.", framework: "GPT-4", category: "Support", config: {role: "support_agent", skills: ["sentiment", "escalation"]} },
  "5": { name: "Task Master", description: "Project management automation with smart task assignment and deadline tracking.", framework: "CrewAI", category: "Productivity", config: {role: "project_manager", skills: ["tasks", "deadlines"]} },
  "6": { name: "Sales Accelerator", description: "AI-powered sales pipeline management, lead scoring, and automated follow-ups.", framework: "Claude", category: "Marketing", config: {role: "sales_rep", skills: ["leads", "pipeline"]} },
  "7": { name: "DevOps Guardian", description: "Infrastructure monitoring, anomaly detection, and automated incident response.", framework: "Custom", category: "Development", config: {role: "sre_engineer", skills: ["monitoring", "cloud"]} },
  "8": { name: "Meeting Scribe", description: "Real-time meeting transcription, action item extraction, and smart summarization.", framework: "GPT-4", category: "Productivity", config: {role: "meeting_assistant", skills: ["transcription", "notes"]} },
  "9": { name: "Security Auditor", description: "Continuous security posture assessment and vulnerability scanning.", framework: "Kimi", category: "Analysis", config: {role: "security_analyst", skills: ["scanning", "compliance"]} },
  "10": { name: "Email Composer", description: "Smart email drafting with tone adjustment and follow-up scheduling.", framework: "Claude", category: "Productivity", config: {role: "email_assistant", skills: ["drafting", "scheduling"]} },
  "11": { name: "Custom Workflow Builder", description: "Build your own multi-step AI workflows with visual drag-and-drop.", framework: "CrewAI", category: "Custom", config: {role: "workflow_builder", skills: ["automation", "integration"]} },
  "12": { name: "Social Media Pilot", description: "Automated social media scheduling, content curation, and analytics.", framework: "GPT-4", category: "Marketing", config: {role: "social_media_manager", skills: ["scheduling", "analytics"]} },
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { agent_id } = await req.json();
  if (!agent_id) {
    return NextResponse.json({ error: "agent_id is required" }, { status: 400 });
  }

  // Check if already installed (via marketplace_source in agents table)
  const { data: existing } = await supabase
    .from("agents")
    .select("id, marketplace_source")
    .eq("user_id", user.id)
    .eq("marketplace_source", agent_id)
    .single();

  if (existing) {
    return NextResponse.json({ error: "Agent already installed" }, { status: 409 });
  }

  // Try to get agent from DB first, fallback to mock
  let agentData = MOCK_AGENTS[agent_id];
  
  try {
    const { data: dbAgent } = await supabase
      .from("marketplace_agents")
      .select("name, description, framework, category, config, installs")
      .eq("id", agent_id)
      .single();
    
    if (dbAgent) {
      agentData = dbAgent;
      // Increment install count
      await supabase
        .from("marketplace_agents")
        .update({ installs: (dbAgent.installs || 0) + 1 })
        .eq("id", agent_id);
    }
  } catch {
    // Use mock data fallback
  }

  if (!agentData) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  // Create the agent in the agents table
  const { error: agentError } = await supabase.from("agents").insert({
    name: agentData.name,
    role: agentData.config?.role || "assistant",
    framework: agentData.framework || "FuseIQ",
    department: agentData.category || "General",
    status: "offline",
    skills: agentData.config?.skills || [],
    description: agentData.description,
    config: agentData.config,
    user_id: user.id,
    marketplace_source: agent_id,
  });

  if (agentError) {
    return NextResponse.json({ error: agentError.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: `${agentData.name} installed successfully`,
    agent_id,
  });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const agent_id = searchParams.get("agent_id");
  if (!agent_id) {
    return NextResponse.json({ error: "agent_id is required" }, { status: 400 });
  }

  // Delete the agent from agents table (uninstall)
  const { error } = await supabase
    .from("agents")
    .delete()
    .eq("user_id", user.id)
    .eq("marketplace_source", agent_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: "Agent uninstalled" });
}
