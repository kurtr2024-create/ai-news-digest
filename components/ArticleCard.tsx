"use client";

import { ExternalLink } from "lucide-react";
import { timeAgo } from "@/lib/utils";

interface Article { title: string; source: string; url: string; summary: string; publishedAt: string; }

export default function ArticleCard({ article, onRead }: { article: Article; onRead: () => void }) {
  const handleClick = () => { onRead(); window.open(article.url, "_blank", "noopener,noreferrer"); };
  return (
    <div role="button" tabIndex={0} onClick={handleClick} onKeyDown={(e) => e.key === "Enter" && handleClick()}
      className="group flex cursor-pointer flex-col rounded-xl border border-[#1f1f1f] bg-[#111111] p-4 transition-colors hover:border-[#374151]">
      <div className="mb-2 text-xs font-medium text-[#6b7280]">{article.source}</div>
      <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-snug text-[#f9fafb]">{article.title}</h3>
      <p className="mb-4 line-clamp-3 flex-1 text-xs leading-relaxed text-[#6b7280]">{article.summary}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#4b5563]">{timeAgo(article.publishedAt)}</span>
        <ExternalLink size={12} className="text-[#374151] transition-colors group-hover:text-[#6b7280]" />
      </div>
    </div>
  );
}
