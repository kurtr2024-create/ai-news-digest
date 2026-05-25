import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic();

interface Article {
  title: string;
  source: string;
  url: string;
  summary: string;
  publishedAt: string;
}

interface DigestContext {
  articles: Article[];
  topArticle?: Article;
  generatedAt?: string;
}

export async function POST(req: NextRequest) {
  const { message, digest } = (await req.json()) as {
    message: string;
    digest: DigestContext;
  };

  if (!message?.trim()) {
    return new Response(JSON.stringify({ error: "Message required" }), { status: 400 });
  }

  const articlesContext = digest?.articles
    ?.map((a, i) => `[${i + 1}] "${a.title}" - ${a.source}\n${a.summary}`)
    .join("\n\n") ?? "No articles available.";

  const systemPrompt = `You are an AI assistant for the AI News Daily Digest. You have deep knowledge of today's top AI news stories and help users understand and explore them.

Today's digest (${digest?.generatedAt ? new Date(digest.generatedAt).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) : "today"}):

${articlesContext}

Guidelines:
- Answer questions about today's articles concisely and insightfully
- If asked about something not in today's digest, say so and offer to discuss what is covered
- Keep responses focused and under 3 paragraphs unless a detailed breakdown is requested
- Never make up article content - only reference what's in the digest above`;

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
    system: systemPrompt,
    messages: [{ role: "user", content: message }],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
