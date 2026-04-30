import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * External Agent Heartbeat API
 * 
 * POST /api/external/heartbeat
 * Headers: Authorization: Bearer fk_live_<key>
 * Body: { agent_id?, status?, task?, tokens_used?, cost?, latency_ms?, model?, provider?, result?, error? }
 * 
 * This endpoint allows external agents (running on developer machines, 
 * AWS, or anywhere) to report their status and execution results to FuseIQ.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate API key
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing Authorization header. Expected: Bearer fk_live_...' },
        { status: 401 }
      );
    }

    const apiKey = authHeader.replace('Bearer ', '').trim();
    const prefix = apiKey.substring(0, 12); // fk_live_xxxx

    // Hash the key for lookup
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

    // Find the API key in database
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('*, workspaces!inner(id, name)')
      .eq('key_hash', keyHash)
      .eq('is_active', true)
      .single();

    if (keyError || !keyData) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Check expiration
    if (keyData.expires_at && new Date(keyData.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'API key expired' },
        { status: 401 }
      );
    }

    // Check scope
    const scopes = keyData.scopes || [];
    if (!scopes.includes('heartbeat')) {
      return NextResponse.json(
        { error: 'API key missing heartbeat scope' },
        { status: 403 }
      );
    }

    // 2. Parse heartbeat payload
    const body = await request.json();
    const {
      agent_id,
      agent_name,
      status = 'online',
      task,
      task_name,
      tokens_used = 0,
      tokens_in,
      tokens_out,
      cost = 0,
      cost_usd,
      latency_ms,
      model,
      provider,
      framework,
      result,
      error: errorMessage,
      metadata
    } = body;

    const workspaceId = keyData.workspace_id;

    // 3. Update or create the agent record
    if (agent_name) {
      const { error: agentError } = await supabase
        .from('agents')
        .upsert({
          workspace_id: workspaceId,
          name: agent_name,
          status: status === 'running' ? 'busy' : status === 'error' ? 'offline' : status,
          framework: framework || provider || 'Custom',
          agent_type: 'AI',
          last_active_at: new Date().toISOString(),
          config: metadata || {}
        }, {
          onConflict: 'workspace_id,name',
          ignoreDuplicates: false
        });

      if (agentError) {
        console.error('Agent upsert error:', agentError);
      }
    }

    // 4. Log execution if task data provided
    if (task || task_name) {
      const { error: execError } = await supabase
        .from('executions')
        .insert({
          workspace_id: workspaceId,
          agent_id: agent_id || null,
          task_name: task_name || task || 'External execution',
          status: errorMessage ? 'failed' : 'success',
          cost_usd: cost_usd || cost || 0,
          tokens_in: tokens_in || tokens_used || 0,
          tokens_out: tokens_out || 0,
          latency_ms: latency_ms || 0,
          provider: provider || framework || 'external',
          model: model || 'unknown',
          result: result ? JSON.stringify(result) : null,
          error_message: errorMessage || null,
          started_at: new Date().toISOString(),
          completed_at: new Date().toISOString()
        });

      if (execError) {
        console.error('Execution insert error:', execError);
      }
    }

    // 5. Update API key last_used
    await supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', keyData.id);

    // 6. Log activity
    await supabase
      .from('activity_logs')
      .insert({
        workspace_id: workspaceId,
        actor_type: 'agent',
        actor_name: agent_name || 'External Agent',
        action: `heartbeat.${status}`,
        target_type: 'agent',
        target_name: agent_name || 'External Agent',
        metadata: {
          task: task || task_name,
          cost: cost || cost_usd,
          tokens: tokens_used || tokens_in,
          model,
          provider: provider || framework
        }
      });

    // 7. Broadcast realtime event
    const channel = supabase.channel('external_agents');
    channel.send({
      type: 'broadcast',
      event: 'agent_heartbeat',
      payload: {
        workspace_id: workspaceId,
        agent_name: agent_name || 'External Agent',
        status,
        task: task || task_name,
        timestamp: new Date().toISOString()
      }
    });

    return NextResponse.json({
      success: true,
      workspace: keyData.workspaces?.name || 'Unknown',
      agent: agent_name || 'External Agent',
      status,
      received_at: new Date().toISOString()
    });

  } catch (err: any) {
    console.error('Heartbeat API error:', err);
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/external/heartbeat
 * Health check for the heartbeat endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/external/heartbeat',
    method: 'POST',
    description: 'Send agent heartbeats to FuseIQ',
    authentication: 'Bearer fk_live_...',
    documentation: 'https://fuseiq.ai/docs/external-agents'
  });
}
