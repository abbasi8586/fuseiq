import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const channelId = searchParams.get("channelId");

  let query = supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: true });

  if (channelId) {
    query = query.eq("channel_id", channelId);
  }

  const { data: messages, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(messages || []);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const { data: message, error } = await supabase
    .from("messages")
    .insert({
      channel_id: body.channel_id,
      author_id: user.id,
      author_name: body.author_name || "User",
      author_type: body.author_type || "Human",
      content: body.content,
      thread_id: body.thread_id || null,
      reactions: body.reactions || {},
      is_pinned: body.is_pinned || false,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(message, { status: 201 });
}
