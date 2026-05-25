"use client";

interface HeaderProps {
  onSubscribeClick: () => void;
}

export default function Header({ onSubscribeClick }: HeaderProps) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });
  return (
    <header className="sticky top-0 z-50 border-b border-[#1f1f1f] bg-[#0a0a0a]/90 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500 text-xs font-bold tracking-tight text-white">AI</div>
          <span className="text-sm font-semibold text-[#f9fafb]">AI News Daily Digest</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-xs text-[#6b7280] sm:block">{today}</span>
          <button onClick={onSubscribeClick} className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-600 active:bg-blue-700">Subscribe</button>
        </div>
      </div>
    </header>
  );
}
