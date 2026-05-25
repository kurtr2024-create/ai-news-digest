"use client";
import { ExternalLink } from "lucide-react";
import { timeAgo } from "@/lib/utils";

interface TopArticle {
  title: string; source: string; url: string; summary: string; publishedAt: string; imageDescription?: string;
}

export default function HeroCard({ topArticle }: { topArticle: TopArticle }) {
  const handleShare = () => {
    const text = `${topArticle.title} — via AI News Daily Digest`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(topArticle.url)}`, "_blank", "noopener,noreferrer");
  };
  return (
    <div className="rounded-xl border border-[#1f1f1f] bg-[#111111] p-8" style={{ borderLeft: "2px solid #3b82f6" }}>
      <div className="mb-4"><span className="text-xs font-semibold uppercase tracking-widest text-blue-500">Top Story</span></div>
      <h2 className="mb-3 text-2xl font-bold leading-tight text-[#f9fafb] lg:text-3xl">{topArticle.title}</h2>
      <div className="mb-5 flex items-center gap-2 text-sm text-[#6b7280]">
        <span>{topArticle.source}</span><span>·</span><span>{timeAgo(topArticle.publishedAt)}</span>
      </div>
      <p className="mb-7 text-base leading-relaxed text-[#9ca3af]">{topArticle.summary}</p>
      <div className="flex items-center gap-4">
        <a href={topArticle.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-medium text-blue-500 transition-colors hover:text-blue-400">Read article<ExternalLink size={13} /></a>
        <button onClick={handleShare} className="flex items-center gap-1.5 rounded-lg border border-[#1f1f1f] px-3 py-1.5 text-xs text-[#6b7280] transition-colors hover:border-[#374151] hover:text-[#9ca3af]">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          Share
        </button>
      </div>
    </div>
  );
}
