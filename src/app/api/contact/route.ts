import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!email || !message || typeof email !== "string" || typeof message !== "string") {
      return NextResponse.json(
        { error: "Email and message are required" },
        { status: 400 }
      );
    }

    // TODO: Send email via Resend / AWS SES / Supabase Edge Function
    // TODO: Store in Supabase "contact_requests" table
    console.log("[Contact Form]", { name, email, message: message.slice(0, 200) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
