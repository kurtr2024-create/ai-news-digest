import PageLayout from "@/components/PageLayout";

async function fetchDigest() {
  const webhookUrl = process.env.N8N_DIGEST_WEBHOOK_URL;
  if (!webhookUrl) return null;
  try {
    const res = await fetch(webhookUrl, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function Page() {
  const digest = await fetchDigest();
  return <PageLayout digest={digest} />;
}
