import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

// Generate a secure API key with prefix
function generateAPIKey() {
  const prefix = "fk_live_";
  const randomPart = Array.from({ length: 64 }, () =>
    "0123456789abcdef"[Math.floor(Math.random() * 16)]
  ).join("");
  return prefix + randomPart;
}

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Server configuration missing");
  }
  return createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await request.json();
    const { workspace_id, name, permissions = ["heartbeat", "read"] } = body;

    if (!workspace_id || !name) {
      return NextResponse.json(
        { error: "Missing workspace_id or name" },
        { status: 400 }
      );
    }

    const key = generateAPIKey();
    const keyId = randomUUID();

    const { error } = await supabase.from("api_keys").insert({
      id: keyId,
      workspace_id,
      name,
      key_prefix: key.slice(0, 16),
      full_key_hash: key,
      permissions,
      revoked: false,
      created_at: new Date().toISOString(),
      last_used_at: null,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      id: keyId,
      name,
      prefix: key.slice(0, 16),
      key, // Return full key ONCE
      permissions,
      created_at: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const workspaceId = request.nextUrl.searchParams.get("workspace_id");
    if (!workspaceId) {
      return NextResponse.json(
        { error: "Missing workspace_id" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("api_keys")
      .select("*")
      .eq("workspace_id", workspaceId)
      .eq("revoked", false)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ keys: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
