"use client";
import ArticleCard from "./ArticleCard";

interface Article { title: string; source: string; url: string; summary: string; publishedAt: string; }

export default function ArticleGrid({ articles, onArticleRead }: { articles: Article[]; onArticleRead: () => void }) {
  return (
    <section>
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#4b5563]">Today&apos;s Briefing</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, i) => <ArticleCard key={i} article={article} onRead={onArticleRead} />)}
      </div>
    </section>
  );
}
