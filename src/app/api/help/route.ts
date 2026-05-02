import { NextResponse } from "next/server";
import { callDeepSeek, buildGuardedMessages, deepseekErrorResponse } from "@/lib/deepseek";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const messages = buildGuardedMessages(question, `You are FuseIQ Help — a quick, friendly support assistant. Keep responses under 2 paragraphs. If the user asks something outside the platform domain, politely redirect them.`);

    const result = await callDeepSeek({
      messages,
      temperature: 0.6,
      maxTokens: 600,
    });

    if (!result.success) {
      return deepseekErrorResponse(result);
    }

    return NextResponse.json({ answer: result.content });
  } catch (error) {
    console.error("Help API error:", error);
    return NextResponse.json(
      {
        answer: null,
        error: "An unexpected error occurred. Please try again.",
        suggestion: "Contact support directly if the issue persists.",
      },
      { status: 200 }
    );
  }
}
