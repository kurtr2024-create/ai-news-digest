"use client";

import { useState, useEffect } from "react";
import Header from "./Header";
import HeroCard from "./HeroCard";
import ArticleGrid from "./ArticleGrid";
import ChatPanel from "./ChatPanel";
import GamificationSidebar from "./GamificationSidebar";
import SubscribeModal from "./SubscribeModal";
import {
  loadState,
  saveState,
  recordVisit,
  recordArticleRead,
  recordChatMessage,
  type GamificationState,
} from "@/lib/gamification";

interface Article {
  title: string;
  source: string;
  url: string;
  summary: string;
  publishedAt: string;
}

interface DigestData {
  articles: Article[];
  topArticle?: {
    title: string;
    source: string;
    url: string;
    summary: string;
    publishedAt: string;
    imageDescription?: string;
  };
  generatedAt?: string;
  articleCount?: number;
}

export default function PageLayout({ digest: initialDigest }: { digest: DigestData | null }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gameState, setGameState] = useState<GamificationState | null>(null);
  const [digest, setDigest] = useState<DigestData | null>(initialDigest);
  const [isLoadingDigest, setIsLoadingDigest] = useState(true);

  useEffect(() => {
    const loaded = loadState();
    const updated = recordVisit(loaded);
    saveState(updated);
    setGameState(updated);
  }, []);

  useEffect(() => {
    setIsLoadingDigest(true);
    fetch("/api/digest")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data && !data.error) setDigest(data); })
      .catch(() => {})
      .finally(() => setIsLoadingDigest(false));
  }, []);

  const handleArticleRead = () => {
    if (!gameState) return;
    const updated = recordArticleRead(gameState);
    saveState(updated);
    setGameState(updated);
  };

  const handleChatMessage = () => {
    if (!gameState) return;
    const updated = recordChatMessage(gameState);
    saveState(updated);
    setGameState(updated);
  };

  const articles = digest?.articles ?? [];
  const gridArticles = digest?.topArticle
    ? articles.filter((a) => a.url !== digest.topArticle!.url)
    : articles;

  return (
    <>
      <div className="min-h-screen">
        <Header onSubscribeClick={() => setIsModalOpen(true)} />

        <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
          {/* Loading / empty state */}
          {!digest && (
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="text-center">
                {isLoadingDigest ? (
                  <>
                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#1f1f1f] border-t-blue-500" />
                    <p className="text-sm text-[#6b7280]">Fetching today&apos;s AI news digest…</p>
                    <p className="mt-1 text-xs text-[#4b5563]">This takes about 30 seconds</p>
                  </>
                ) : (
                  <>
                    <p className="mb-2 text-2xl">📡</p>
                    <p className="text-sm text-[#6b7280]">Digest unavailable. Check back shortly.</p>
                  </>
                )}
              </div>
            </div>
          )}

          {digest && (
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
              <div className="flex min-w-0 flex-1 flex-col gap-6">
                {digest.topArticle && <HeroCard topArticle={digest.topArticle} />}
                {gridArticles.length > 0 && (
                  <ArticleGrid articles={gridArticles} onArticleRead={handleArticleRead} />
                )}
                <ChatPanel
                  digest={digest}
                  onChatMessage={handleChatMessage}
                  onSubscribeClick={() => setIsModalOpen(true)}
                />
              </div>

              <div className="w-full lg:w-80 lg:flex-shrink-0">
                <div className="lg:sticky lg:top-20">
                  {gameState ? (
                    <GamificationSidebar
                      state={gameState}
                      onSubscribeClick={() => setIsModalOpen(true)}
                    />
                  ) : (
                    <div className="flex flex-col gap-4">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="h-32 animate-pulse rounded-xl border border-[#1f1f1f] bg-[#111111]"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {isModalOpen && <SubscribeModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
