import { NextResponse } from "next/server";

export const maxDuration = 60;
export const revalidate = 86400; // 24 hours — ISR re-fetches in background after expiry

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
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
      },
    });
  } catch (err) {
    console.error("Digest fetch failed:", err);
    return NextResponse.json({ error: "Failed to fetch digest" }, { status: 502 });
  }
}
