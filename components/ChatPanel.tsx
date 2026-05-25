"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send } from "lucide-react";

interface Message { role: "user" | "assistant"; content: string; }
interface Article { title: string; source: string; url: string; summary: string; publishedAt: string; }
interface DigestData { articles: Article[]; topArticle?: { title: string; source: string; url: string; summary: string; }; generatedAt?: string; }

const FREE_DAILY_LIMIT = 5;
const COUNT_KEY = "ai-digest-daily-chats";

function getDailyCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(COUNT_KEY);
    if (!raw) return 0;
    const { count, date } = JSON.parse(raw);
    if (date !== new Date().toISOString().split("T")[0]) return 0;
    return count;
  } catch { return 0; }
}

function bumpDailyCount(current: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(COUNT_KEY, JSON.stringify({ count: current + 1, date: new Date().toISOString().split("T")[0] }));
}

export default function ChatPanel({ digest, onChatMessage, onSubscribeClick }: { digest: DigestData | null; onChatMessage: () => void; onSubscribeClick: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dailyCount, setDailyCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setDailyCount(getDailyCount()); }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const atLimit = dailyCount >= FREE_DAILY_LIMIT;

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading || atLimit) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setIsLoading(true);
    const newCount = dailyCount + 1;
    bumpDailyCount(dailyCount);
    setDailyCount(newCount);
    onChatMessage();
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, digest }),
      });
      if (!res.ok || !res.body) throw new Error("Chat failed");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) => { const u = [...prev]; u[u.length - 1] = { role: "assistant", content: accumulated }; return u; });
      }
    } catch {
      setMessages((prev) => { const u = [...prev]; u[u.length - 1] = { role: "assistant", content: "Something went wrong. Please try again." }; return u; });
    } finally { setIsLoading(false); }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  return (
    <section className="rounded-xl border border-[#1f1f1f] bg-[#111111]">
      <div className="flex items-center gap-2.5 border-b border-[#1f1f1f] px-6 py-4">
        <Sparkles size={15} className="text-blue-500" />
        <h2 className="text-sm font-semibold text-[#f9fafb]">Ask the Digest</h2>
        <span className="ml-auto text-xs text-[#4b5563]">{dailyCount}/{FREE_DAILY_LIMIT} today</span>
      </div>
      <div className="flex max-h-96 min-h-[8rem] flex-col gap-4 overflow-y-auto p-6">
        {messages.length === 0 && <p className="text-sm text-[#4b5563]">Ask me anything about today&apos;s AI news stories...</p>}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "user" ? (
              <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-blue-500 px-4 py-2.5 text-sm text-white">{msg.content}</div>
            ) : (
              <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-[#1f1f1f] bg-[#0a0a0a] px-4 py-2.5 text-sm leading-relaxed text-[#9ca3af]">
                {msg.content === "" && isLoading ? (
                  <div className="flex items-center gap-1.5 py-0.5">
                    {[0, 150, 300].map((delay) => <div key={delay} className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#4b5563]" style={{ animationDelay: `${delay}ms` }} />)}
                  </div>
                ) : msg.content}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {atLimit && (
        <div className="border-t border-[#1f1f1f] px-6 py-3 text-xs text-[#6b7280]">
          You&apos;ve used your {FREE_DAILY_LIMIT} free questions today.{" "}
          <button onClick={onSubscribeClick} className="text-blue-500 transition-colors hover:text-blue-400">Subscribe for unlimited access</button>
        </div>
      )}
      <div className="border-t border-[#1f1f1f] p-4">
        <div className="flex items-center gap-2">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} disabled={isLoading || atLimit}
            placeholder={atLimit ? "Upgrade to continue chatting..." : "Ask about today's AI news..."}
            className="flex-1 rounded-xl border border-[#1f1f1f] bg-[#0a0a0a] px-4 py-2.5 text-sm text-[#f9fafb] placeholder-[#4b5563] outline-none transition-colors focus:border-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50" />
          <button onClick={sendMessage} disabled={isLoading || !input.trim() || atLimit}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40">
            <Send size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}
