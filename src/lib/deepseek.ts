import { NextResponse } from "next/server";

// ─── DeepSeek Free Tier Configuration ─────────────────────────────
const DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1";
const DEFAULT_MODEL = "deepseek-chat"; // Free tier model

// ─── Platform Guardrails System Prompt ──────────────────────────
export const PLATFORM_GUARDAILS = `You are FuseIQ's AI assistant — a platform-specific expert focused exclusively on the FuseIQ AI Agent Orchestration Platform.

## YOUR DOMAIN (DO answer these):
- Agent management: creating, deploying, configuring, monitoring AI agents
- Workflow orchestration: building multi-agent pipelines, Swarm Canvas, node connections
- Cost tracking & budgets: usage analytics, spending alerts, BYOK setup
- Simulator: testing agents, sandbox environments, prompt engineering
- Approvals: human-in-the-loop workflows, risk thresholds, approval chains
- Communications: agent messaging, channel management, notification rules
- Staff Directory: team roles, agent assignments, performance metrics
- Billing: subscription plans, usage-based pricing, invoice history
- Security: API key management, access controls, audit logs
- Troubleshooting: platform errors, connection issues, agent failures

## OUT OF BOUNDS (DO NOT answer these):
- General knowledge questions (history, science, pop culture, weather)
- Personal advice (career, relationships, health, legal)
- Code generation for external projects (only platform-specific config/scripts)
- Math problems or homework help
- Current events or news (unless directly affecting platform operations)
- Off-topic creative writing or storytelling
- Anything requiring real-time web search outside the platform

## RESPONSE RULES:
1. If asked something outside your domain, politely redirect: "I'm specialized for FuseIQ platform operations. For that question, try a general AI assistant."
2. Always keep responses concise (2-3 paragraphs max).
3. When uncertain about specific account data, suggest contacting support.
4. Use platform terminology consistently (Agent Forge, Swarm Canvas, Command Center, etc.).
5. Offer actionable next steps when possible.`;

// ─── DeepSeek API Client ────────────────────────────────────────
export interface DeepSeekMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface DeepSeekOptions {
  messages: DeepSeekMessage[];
  temperature?: number;
  maxTokens?: number;
  model?: string;
  apiKey?: string; // BYOK override
}

export interface DeepSeekResult {
  success: boolean;
  content: string;
  error?: string;
  isRateLimited?: boolean;
  isOutOfDomain?: boolean;
  tokensUsed?: number;
}

export async function callDeepSeek(options: DeepSeekOptions): Promise<DeepSeekResult> {
  const {
    messages,
    temperature = 0.7,
    maxTokens = 800,
    model = DEFAULT_MODEL,
    apiKey,
  } = options;

  // Determine API key: BYOK override → env → null
  const key = apiKey || process.env.DEEPSEEK_API_KEY;

  if (!key) {
    return {
      success: false,
      content: "",
      error: "No DeepSeek API key configured. Add DEEPSEEK_API_KEY to your environment, or provide your own key in Settings → Integrations (BYOK).",
      isRateLimited: false,
    };
  }

  // Use AbortController for timeout (compatible with all Node versions)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    // Rate limit detection
    if (response.status === 429) {
      const retryAfter = response.headers.get("retry-after") || "60";
      return {
        success: false,
        content: "",
        error: `DeepSeek Free Tier rate limit reached. Retry after ${retryAfter}s, or switch to BYOK (Bring Your Own Key) in Settings → Integrations for unlimited access.`,
        isRateLimited: true,
      };
    }

    if (!response.ok) {
      const errText = await response.text().catch(() => "Unknown error");
      // Check for free tier exhaustion patterns
      if (errText.includes("insufficient_quota") || errText.includes("billing") || errText.includes("exceeded")) {
        return {
          success: false,
          content: "",
          error: "DeepSeek Free Tier quota exhausted. Upgrade to BYOK (Bring Your Own Key) in Settings → Integrations to continue.",
          isRateLimited: true,
        };
      }
      return {
        success: false,
        content: "",
        error: `DeepSeek API error (${response.status}): ${errText.slice(0, 200)}`,
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    const tokensUsed = data.usage?.total_tokens;

    if (!content) {
      return {
        success: false,
        content: "",
        error: "Empty response from DeepSeek. Please try again.",
      };
    }

    return {
      success: true,
      content,
      tokensUsed,
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      return {
        success: false,
        content: "",
        error: "Request timed out. DeepSeek Free Tier may be experiencing high load. Try again shortly, or switch to BYOK for faster responses.",
        isRateLimited: true,
      };
    }
    return {
      success: false,
      content: "",
      error: `Connection error: ${err.message}. Check your API key or network connection.`,
    };
  }
}

// ─── Helper: Build guarded messages ─────────────────────────────
export function buildGuardedMessages(userMessage: string, extraSystemPrompt?: string): DeepSeekMessage[] {
  const systemContent = extraSystemPrompt
    ? `${PLATFORM_GUARDAILS}\n\n${extraSystemPrompt}`
    : PLATFORM_GUARDAILS;

  return [
    { role: "system", content: systemContent },
    { role: "user", content: userMessage },
  ];
}

// ─── NextResponse helpers ──────────────────────────────────────
export function deepseekErrorResponse(result: DeepSeekResult): NextResponse {
  if (result.isRateLimited) {
    return NextResponse.json(
      {
        answer: null,
        error: result.error,
        rateLimited: true,
        suggestion: "Switch to BYOK (Bring Your Own Key) in Settings → Integrations for uninterrupted access.",
      },
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      answer: null,
      error: result.error,
      suggestion: "Check your API key configuration in Settings → Integrations, or try again shortly.",
    },
    { status: 200 }
  );
}
