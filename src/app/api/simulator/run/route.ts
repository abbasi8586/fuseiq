import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const PROVIDER_ENDPOINTS: Record<string, { url: string; keyEnv: string; modelMap: Record<string, string> }> = {
  kimi: {
    url: "https://api.moonshot.cn/v1/chat/completions",
    keyEnv: "KIMI_API_KEY",
    modelMap: { kimi: "kimi-k2.5" },
  },
  openai: {
    url: "https://api.openai.com/v1/chat/completions",
    keyEnv: "OPENAI_API_KEY",
    modelMap: { openai: "gpt-4o" },
  },
  anthropic: {
    url: "https://api.anthropic.com/v1/messages",
    keyEnv: "ANTHROPIC_API_KEY",
    modelMap: { anthropic: "claude-3-5-sonnet-20241022" },
  },
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { model, prompt } = body;

  const provider = PROVIDER_ENDPOINTS[model];
  if (!provider) {
    return NextResponse.json({ error: "Unsupported model" }, { status: 400 });
  }

  const apiKey = process.env[provider.keyEnv];
  if (!apiKey) {
    return NextResponse.json(
      { error: `No API key configured for ${model}. Add ${provider.keyEnv} to environment variables.` },
      { status: 503 }
    );
  }

  try {
    const response = await fetch(provider.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: provider.modelMap[model],
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json(
        { error: `Provider error: ${response.status} — ${err.slice(0, 200)}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: `Proxy failed: ${err.message}` },
      { status: 502 }
    );
  }
}
