import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agent_name, framework, status = "online", capabilities = [], metadata = {} } = body;

    // Get workspace from the request (in production, look up from API key)
    const workspaceId = "00000000-0000-0000-0000-000000000001";

    // 1. Upsert agent
    const { data: agent, error: agentError } = await supabase
      .from("agents")
      .upsert({
        id: metadata.agent_id || randomUUID(),
        workspace_id: workspaceId,
        name: agent_name,
        framework: framework || "Custom",
        agent_type: "AI",
        status: status === "healthy" ? "online" : status,
        capabilities,
        metadata,
        updated_at: new Date().toISOString(),
      }, { onConflict: "id" })
      .select()
      .single();

    if (agentError) {
      return NextResponse.json({ error: agentError.message }, { status: 500 });
    }

    // 2. Log execution
    const executionId = randomUUID();
    await supabase.from("executions").insert({
      id: executionId,
      workspace_id: workspaceId,
      agent_id: agent.id,
      status: "running",
      input: { heartbeat: true, metadata },
      metadata: { framework, capabilities },
      started_at: new Date().toISOString(),
    });

    // 3. Log activity
    await supabase.from("activity_logs").insert({
      id: randomUUID(),
      workspace_id: workspaceId,
      actor_type: "agent",
      actor_id: agent.id,
      actor_name: agent_name,
      action: "heartbeat",
      target_type: "agent",
      target_id: agent.id,
      target_name: agent_name,
      metadata: { framework, status, capabilities, execution_id: executionId },
      severity: "info",
    });

    return NextResponse.json({
      success: true,
      agent_id: agent.id,
      execution_id: executionId,
      received_at: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
