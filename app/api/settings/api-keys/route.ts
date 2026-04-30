import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * API Key Management for External Agents
 * 
 * POST /api/settings/api-keys
 * - Generate new API key (returns key once, not stored in plain text)
 * 
 * GET /api/settings/api-keys
 * - List all API keys for workspace (returns metadata only, not keys)
 * 
 * DELETE /api/settings/api-keys/:id
 * - Revoke an API key
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workspace_id, name = 'External Agent Key', scopes = ['heartbeat', 'execute'], expires_days = 365 } = body;

    if (!workspace_id) {
      return NextResponse.json({ error: 'workspace_id required' }, { status: 400 });
    }

    // Generate key: fk_live_<random>
    const randomBytes = crypto.randomBytes(32).toString('hex');
    const apiKey = `fk_live_${randomBytes}`;
    const keyPrefix = apiKey.substring(0, 12);
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

    // Calculate expiration
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expires_days);

    // Store in database (only hash, never plain key)
    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        workspace_id,
        name,
        key_hash: keyHash,
        key_prefix: keyPrefix,
        scopes,
        is_active: true,
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return the plain key ONCE (user must save it)
    return NextResponse.json({
      success: true,
      key: apiKey,
      id: data.id,
      name: data.name,
      prefix: keyPrefix,
      scopes: data.scopes,
      expires_at: data.expires_at,
      warning: 'Save this key now. It will never be shown again.'
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspace_id');

    if (!workspaceId) {
      return NextResponse.json({ error: 'workspace_id required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('api_keys')
      .select('id, name, key_prefix, scopes, is_active, last_used_at, expires_at, created_at')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ keys: data });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
