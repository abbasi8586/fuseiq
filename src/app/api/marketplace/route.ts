import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Fallback mock agents when DB tables don't exist yet
const MOCK_AGENTS = [
  { id: "1", name: "Code Review Pro", description: "Automated code review with AI-powered suggestions, security scans, and performance analysis for every pull request.", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop", category: "Development", framework: "GPT-4", rating: 4.8, installs: 12453, author: "DevOps Labs", author_avatar: "DL", featured: true, tags: ["GitHub","CI/CD","Security"], price: "Free", config: {role: "code_reviewer", skills: ["security", "performance", "best_practices"]} },
  { id: "2", name: "Content Catalyst", description: "Generate SEO-optimized blog posts, social media content, and email campaigns with brand voice consistency.", image: "https://images.unsplash.com/photo-1499750310107-5fef28a6667a?w=400&h=250&fit=crop", category: "Marketing", framework: "Claude", rating: 4.6, installs: 8932, author: "GrowthStack", author_avatar: "GS", featured: true, tags: ["SEO","Social","Email"], price: "$9/mo", config: {role: "content_writer", skills: ["seo", "copywriting", "social_media"]} },
  { id: "3", name: "Data Insight Engine", description: "Transform raw data into actionable business intelligence with automated reports and predictive analytics.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop", category: "Analysis", framework: "Kimi", rating: 4.9, installs: 6721, author: "Analytics Pro", author_avatar: "AP", featured: true, tags: ["BI","Predictive","Reports"], price: "$19/mo", config: {role: "data_analyst", skills: ["sql", "visualization", "forecasting"]} },
  { id: "4", name: "Support Sentinel", description: "24/7 intelligent customer support with sentiment analysis, escalation routing, and multilingual responses.", image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=250&fit=crop", category: "Support", framework: "GPT-4", rating: 4.5, installs: 15420, author: "HelpDesk AI", author_avatar: "HA", featured: false, tags: ["Ticketing","Chat","NLP"], price: "Free", config: {role: "support_agent", skills: ["sentiment_analysis", "escalation", "multilingual"]} },
  { id: "5", name: "Task Master", description: "Project management automation with smart task assignment, deadline tracking, and team productivity insights.", image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=250&fit=crop", category: "Productivity", framework: "CrewAI", rating: 4.3, installs: 5432, author: "Productive AI", author_avatar: "PA", featured: false, tags: ["PM","Kanban","Teams"], price: "$5/mo", config: {role: "project_manager", skills: ["task_assignment", "deadline_tracking", "productivity"]} },
  { id: "6", name: "Sales Accelerator", description: "AI-powered sales pipeline management, lead scoring, and automated follow-ups to close deals faster.", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop", category: "Marketing", framework: "Claude", rating: 4.7, installs: 7891, author: "Revenue AI", author_avatar: "RA", featured: false, tags: ["CRM","Leads","Funnel"], price: "$15/mo", config: {role: "sales_rep", skills: ["lead_scoring", "pipeline", "follow_up"]} },
  { id: "7", name: "DevOps Guardian", description: "Infrastructure monitoring, anomaly detection, and automated incident response for cloud-native systems.", image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07cc9?w=400&h=250&fit=crop", category: "Development", framework: "Custom", rating: 4.4, installs: 3210, author: "CloudOps", author_avatar: "CO", featured: false, tags: ["DevOps","SRE","Cloud"], price: "$25/mo", config: {role: "sre_engineer", skills: ["monitoring", "incident_response", "cloud"]} },
  { id: "8", name: "Meeting Scribe", description: "Real-time meeting transcription, action item extraction, and smart summarization for every conversation.", image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=250&fit=crop", category: "Productivity", framework: "GPT-4", rating: 4.6, installs: 9876, author: "NoteTaker AI", author_avatar: "NT", featured: false, tags: ["Transcription","Notes","Zoom"], price: "$7/mo", config: {role: "meeting_assistant", skills: ["transcription", "summarization", "action_items"]} },
  { id: "9", name: "Security Auditor", description: "Continuous security posture assessment, vulnerability scanning, and compliance report generation.", image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=250&fit=crop", category: "Analysis", framework: "Kimi", rating: 4.2, installs: 2156, author: "SecureAI", author_avatar: "SA", featured: false, tags: ["Security","Compliance","Audit"], price: "$29/mo", config: {role: "security_analyst", skills: ["vulnerability_scanning", "compliance", "reporting"]} },
  { id: "10", name: "Email Composer", description: "Smart email drafting with tone adjustment, follow-up scheduling, and inbox prioritization.", image: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=250&fit=crop", category: "Productivity", framework: "Claude", rating: 4.1, installs: 4567, author: "Inbox AI", author_avatar: "IA", featured: false, tags: ["Email","Gmail","Outlook"], price: "$3/mo", config: {role: "email_assistant", skills: ["drafting", "tone_adjustment", "scheduling"]} },
  { id: "11", name: "Custom Workflow Builder", description: "Build your own multi-step AI workflows with visual drag-and-drop interface and 50+ integrations.", image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=400&h=250&fit=crop", category: "Custom", framework: "CrewAI", rating: 4.5, installs: 3456, author: "FlowBuilder", author_avatar: "FB", featured: false, tags: ["No-Code","Workflow","Integration"], price: "$49/mo", config: {role: "workflow_builder", skills: ["no_code", "integration", "automation"]} },
  { id: "12", name: "Social Media Pilot", description: "Automated social media scheduling, content curation, and engagement analytics across all platforms.", image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=250&fit=crop", category: "Marketing", framework: "GPT-4", rating: 4.3, installs: 6789, author: "SocialFly", author_avatar: "SF", featured: false, tags: ["Social","Analytics","Scheduler"], price: "$12/mo", config: {role: "social_media_manager", skills: ["scheduling", "curation", "analytics"]} },
];

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const category = searchParams.get("category");
  const framework = searchParams.get("framework");
  const search = searchParams.get("search");

  // Try database first, fallback to mock data
  let agents: any[] = [];
  let useMock = false;

  try {
    let query = supabase.from("marketplace_agents").select("*");

    if (category && category !== "All") {
      query = query.eq("category", category);
    }
    if (framework && framework !== "All") {
      query = query.eq("framework", framework);
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query.order("featured", { ascending: false }).order("installs", { ascending: false });

    if (error || !data || data.length === 0) {
      useMock = true;
      agents = MOCK_AGENTS;
    } else {
      agents = data;
    }
  } catch {
    useMock = true;
    agents = MOCK_AGENTS;
  }

  // Get user's installed agents from the agents table (marketplace_source field)
  const { data: myAgents } = await supabase
    .from("agents")
    .select("marketplace_source")
    .eq("user_id", user.id)
    .not("marketplace_source", "is", null);

  const installedIds = new Set(myAgents?.map((a) => a.marketplace_source) || []);

  // Filter mock data if needed
  if (useMock) {
    if (category && category !== "All") {
      agents = agents.filter((a) => a.category === category);
    }
    if (framework && framework !== "All") {
      agents = agents.filter((a) => a.framework === framework);
    }
    if (search) {
      const s = search.toLowerCase();
      agents = agents.filter((a) =>
        a.name.toLowerCase().includes(s) ||
        a.description.toLowerCase().includes(s) ||
        a.tags.some((t: string) => t.toLowerCase().includes(s))
      );
    }
  }

  const result = agents.map((agent) => ({
    ...agent,
    is_installed: installedIds.has(agent.id),
  }));

  return NextResponse.json({ agents: result, source: useMock ? "mock" : "db" });
}
