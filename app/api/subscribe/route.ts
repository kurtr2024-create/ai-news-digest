import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const webhookUrl = process.env.N8N_SUBSCRIBE_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: "Subscribe webhook not configured" }, { status: 500 });
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "website" }),
    });
    if (!res.ok) throw new Error(`n8n returned ${res.status}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe failed:", err);
    return NextResponse.json({ error: "Subscription failed, please try again" }, { status: 502 });
  }
}
