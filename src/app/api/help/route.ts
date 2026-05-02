import { NextResponse } from "next/server";

export const runtime = "edge";

const SYSTEM_PROMPT = `You are FuseIQ Help — a knowledgeable, friendly support assistant for the FuseIQ AI Agent Orchestration Platform.

FuseIQ helps users build, deploy, and manage AI agent teams. Key features include:
- Agent Forge: Create custom AI agents with specific roles, skills, and model preferences
- Swarm Canvas: Visual workflow builder for multi-agent orchestration (drag-and-drop nodes, conditions, connections)
- Command Center: Central dashboard for monitoring all agents, tasks, and operations
- Staff Directory: Manage your AI workforce — assign roles, track performance, set budgets
- Simulator: Test agents in a sandbox before production deployment
- Approvals: Human-in-the-loop approval system for high-risk agent actions
- Co-Pilot: AI assistant that helps deploy agents, run workflows, and answer questions
- Billing: Usage-based cost tracking with BYOK (Bring Your Own Key) architecture
- Communications Hub: Unified messaging across all agent channels
- Analytics: Performance metrics, cost breakdowns, and operational insights

Provide clear, concise answers. If you don't know something specific about the user's account, suggest they contact support directly. Keep responses under 3 paragraphs when possible.`;

export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      // Graceful fallback if no key configured
      return NextResponse.json({
        answer:
          "I'm currently in offline mode. For immediate help, please check our documentation or contact support through the Contact Us form. Common topics: Agent Forge for creating agents, Swarm Canvas for building workflows, and Command Center for monitoring.",
      });
    }

    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: question },
          ],
          temperature: 0.7,
          max_tokens: 600,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("DeepSeek API error:", err);
      return NextResponse.json(
        {
          answer:
            "I'm having trouble connecting to my knowledge base right now. Please try again in a moment, or contact support directly.",
        },
        { status: 200 }
      );
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content;

    if (!answer) {
      return NextResponse.json({
        answer:
          "I couldn't generate a response. Please try rephrasing your question.",
      });
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Help API error:", error);
    return NextResponse.json(
      {
        answer:
          "An error occurred. Please try again later or contact support.",
      },
      { status: 200 }
    );
  }
}
