import { NextResponse } from "next/server";
import { callDeepSeek, buildGuardedMessages, deepseekErrorResponse } from "@/lib/deepseek";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages, context } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Build conversation with guardrails
    const systemContent = `You are FuseIQ Co-Pilot — the platform's executive AI assistant. You help users manage their AI workforce, deploy agents, run workflows, analyze costs, and make operational decisions.

## YOUR DOMAIN:
- Agent deployment & configuration (Agent Forge)
- Workflow orchestration (Swarm Canvas)
- Performance analytics & cost tracking
- Team management (Staff Directory)
- Approval workflows & risk assessment
- Simulator testing & prompt engineering
- Billing, budgets, and BYOK setup
- Troubleshooting platform issues

## RESPONSE STYLE:
- Be decisive and action-oriented. Offer next steps.
- Use platform terminology consistently.
- Keep responses concise (2-3 paragraphs max).
- When uncertain about account-specific data, say so and suggest checking the relevant dashboard page.
- If asked something outside FuseIQ operations, redirect politely: "I'm specialized for FuseIQ platform management. For general questions, try a different AI assistant."`;

    const deepseekMessages: { role: "system" | "user" | "assistant"; content: string }[] = [
      { role: "system", content: systemContent },
      ...messages.map((m: any) => ({
        role: m.role as "user" | "assistant",
        content: m.content as string,
      })),
    ];

    // Add context hint if provided
    if (context) {
      deepseekMessages.push({
        role: "system",
        content: `Current user context: ${JSON.stringify(context)}`,
      });
    }

    const result = await callDeepSeek({
      messages: deepseekMessages,
      temperature: 0.7,
      maxTokens: 800,
    });

    if (!result.success) {
      return deepseekErrorResponse(result);
    }

    return NextResponse.json({
      message: {
        role: "assistant",
        content: result.content,
      },
      tokensUsed: result.tokensUsed,
    });
  } catch (error) {
    console.error("Co-Pilot API error:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred. Please try again.",
        suggestion: "If the issue persists, contact support or check your API key in Settings → Integrations.",
      },
      { status: 200 }
    );
  }
}
