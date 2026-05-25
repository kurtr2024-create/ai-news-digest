"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { getLast7Days, getDailyGoalProgress, type GamificationState } from "@/lib/gamification";

const BADGES = [
  { id: "first-visit", label: "First Visit", emoji: "🎯", description: "Welcome aboard!" },
  { id: "7-day-streak", label: "7-Day Streak", emoji: "🔥", description: "7 days in a row" },
  { id: "30-day-streak", label: "30-Day Streak", emoji: "⚡", description: "30 days in a row" },
  { id: "ai-curious", label: "AI Curious", emoji: "💬", description: "Ask 10 questions" },
];

export default function GamificationSidebar({ state, onSubscribeClick }: { state: GamificationState; onSubscribeClick: () => void }) {
  const [goalComplete, setGoalComplete] = useState(false);
  const last7 = getLast7Days(state);
  const goal = getDailyGoalProgress(state);
  const goalItems = [
    { label: "View today's digest", done: goal.complete >= 1 },
    { label: "Read an article", done: goal.complete >= 2 },
    { label: "Ask the AI", done: goal.complete >= 3 },
  ];

  useEffect(() => {
    if (goal.complete === 3 && !goalComplete) {
      setGoalComplete(true);
      import("canvas-confetti").then(({ default: confetti }) => {
        confetti({ particleCount: 70, spread: 55, origin: { y: 0.5 }, colors: ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"] });
      });
    }
  }, [goal.complete, goalComplete]);

  return (
    <aside className="flex flex-col gap-4">
      <div className="rounded-xl border border-[#1f1f1f] bg-[#111111] p-5">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-xl">🔥</span>
          <span className="text-base font-bold text-[#f9fafb]">{state.streak} day{state.streak !== 1 ? "s" : ""} streak</span>
        </div>
        <p className="mb-4 text-xs text-[#6b7280]">{state.streak >= 7 ? "You're on a roll! 🚀" : state.streak > 0 ? "Keep it up! Come back tomorrow." : "Start your streak today."}</p>
        <div className="flex items-center gap-1.5">
          {last7.map(({ date, visited }) => <div key={date} title={date} className={`h-5 w-5 rounded-full transition-colors ${visited ? "bg-blue-500" : "bg-[#1f1f1f]"}`} />)}
        </div>
      </div>
      <div className="rounded-xl border border-[#1f1f1f] bg-[#111111] p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#f9fafb]">Today&apos;s Goal</h3>
          <span className="text-xs tabular-nums text-[#6b7280]">{goal.complete}/3</span>
        </div>
        <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-[#1f1f1f]">
          <div className="h-full rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${(goal.complete / 3) * 100}%` }} />
        </div>
        <div className="flex flex-col gap-2.5">
          {goalItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border transition-colors ${item.done ? "border-blue-500 bg-blue-500" : "border-[#374151]"}`}>
                {item.done && <svg viewBox="0 0 10 10" fill="none" className="h-2.5 w-2.5"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </div>
              <span className={`text-xs transition-colors ${item.done ? "text-[#4b5563] line-through" : "text-[#9ca3af]"}`}>{item.label}</span>
            </div>
          ))}
        </div>
        {goalComplete && <div className="mt-4 rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-2 text-xs text-green-400">Goal complete! See you tomorrow.</div>}
      </div>
      <div className="rounded-xl border border-[#1f1f1f] bg-[#111111] p-5">
        <h3 className="mb-3 text-sm font-semibold text-[#f9fafb]">Achievements</h3>
        <div className="grid grid-cols-2 gap-2">
          {BADGES.map((badge) => {
            const unlocked = state.badges.includes(badge.id);
            return (
              <div key={badge.id} title={badge.description} className={`relative flex flex-col items-center rounded-lg border px-2 py-3 text-center transition-colors ${unlocked ? "border-blue-500/25 bg-blue-500/5" : "border-[#1f1f1f] bg-[#0a0a0a] opacity-40 grayscale"}`}>
                <span className="text-lg">{badge.emoji}</span>
                <span className="mt-1 text-[10px] leading-tight text-[#9ca3af]">{badge.label}</span>
                {!unlocked && <div className="absolute right-1.5 top-1.5"><Lock size={8} className="text-[#4b5563]" /></div>}
              </div>
            );
          })}
        </div>
      </div>
      <div className="rounded-xl border border-[#1f1f1f] bg-[#161616] p-5">
        <h3 className="mb-1 text-sm font-semibold text-[#f9fafb]">Get the full digest</h3>
        <p className="mb-4 text-xs leading-relaxed text-[#6b7280]">Unlimited AI chat, streak history across devices, and more.</p>
        <button onClick={onSubscribeClick} className="w-full rounded-lg bg-blue-500 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-600">Subscribe Free</button>
      </div>
    </aside>
  );
}
