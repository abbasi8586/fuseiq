import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { type, message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Feedback message is required" },
        { status: 400 }
      );
    }

    // TODO: Store in Supabase "feedback" table
    // TODO: Notify team via Slack / Discord webhook
    console.log("[Feedback Form]", { type: type || "general", message: message.slice(0, 200) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback API error:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
