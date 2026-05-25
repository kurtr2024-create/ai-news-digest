"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function SubscribeModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;
    setStatus("loading"); setErrorMsg("");
    try {
      const res = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.trim() }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to subscribe");
      try {
        const raw = localStorage.getItem("ai-digest-gamification");
        if (raw) { const s = JSON.parse(raw); s.email = email.trim(); localStorage.setItem("ai-digest-gamification", JSON.stringify(s)); }
      } catch {}
      setStatus("success");
    } catch (err) { setErrorMsg(err instanceof Error ? err.message : "Something went wrong"); setStatus("error"); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="relative w-full max-w-md rounded-2xl border border-[#1f1f1f] bg-[#111111] p-8">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-lg p-1.5 text-[#4b5563] transition-colors hover:text-[#9ca3af]"><X size={16} /></button>
        <h2 className="mb-2 text-xl font-bold text-[#f9fafb]">Get unlimited access</h2>
        <p className="mb-6 text-sm leading-relaxed text-[#6b7280]">Free to start. Join readers staying ahead of AI.</p>
        {status === "success"
          ? <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-400">✓ You&apos;re in! We&apos;ll be in touch.</div>
          : <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required autoFocus className="rounded-xl border border-[#1f1f1f] bg-[#0a0a0a] px-4 py-3 text-sm text-[#f9fafb] placeholder-[#4b5563] outline-none transition-colors focus:border-blue-500/50" />
              {status === "error" && <p className="text-xs text-red-400">{errorMsg}</p>}
              <button type="submit" disabled={status === "loading"} className="rounded-xl bg-blue-500 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-50">{status === "loading" ? "Subscribing…" : "Subscribe →"}</button>
            </form>}
      </div>
    </div>
  );
}
