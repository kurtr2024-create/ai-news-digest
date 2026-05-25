import { NextResponse } from "next/server";

export const maxDuration = 60;
export const revalidate = 86400;

export async function GET() {
  const webhookUrl = process.env.N8N_DIGEST_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: "Webhook URL not configured" }, { status: 500 });
  }

  try {
    const res = await fetch(webhookUrl, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      throw new Error(`n8n webhook returned ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Digest fetch failed:", err);
    return NextResponse.json({ error: "Failed to fetch digest" }, { status: 502 });
  }
}
