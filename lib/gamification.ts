const STORAGE_KEY = "ai-digest-gamification";

export interface GamificationState {
  streak: number;
  lastVisitDate: string;
  visitHistory: string[];
  chatCount: number;
  articlesReadToday: number;
  lastArticleDate: string;
  email: string | null;
  badges: string[];
}

const DEFAULT_STATE: GamificationState = { streak: 0, lastVisitDate: "", visitHistory: [], chatCount: 0, articlesReadToday: 0, lastArticleDate: "", email: null, badges: [] };

function todayISO() { return new Date().toISOString().split("T")[0]; }
function yesterdayISO() { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().split("T")[0]; }

export function loadState(): GamificationState {
  if (typeof window === "undefined") return { ...DEFAULT_STATE };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch { return { ...DEFAULT_STATE }; }
}

export function saveState(state: GamificationState): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

export function recordVisit(state: GamificationState): GamificationState {
  const today = todayISO();
  const yesterday = yesterdayISO();
  let newStreak = state.streak;
  if (state.lastVisitDate === today) {
  } else if (state.lastVisitDate === yesterday) {
    newStreak = state.streak + 1;
  } else {
    newStreak = 1;
  }
  const history = state.visitHistory.filter((d) => d !== today);
  history.push(today);
  const articlesReadToday = state.lastArticleDate === today ? state.articlesReadToday : 0;
  return checkBadges({ ...state, streak: newStreak, lastVisitDate: today, visitHistory: history.slice(-30), articlesReadToday });
}

export function recordArticleRead(state: GamificationState): GamificationState {
  const today = todayISO();
  const articlesReadToday = state.lastArticleDate === today ? state.articlesReadToday + 1 : 1;
  return checkBadges({ ...state, articlesReadToday, lastArticleDate: today });
}

export function recordChatMessage(state: GamificationState): GamificationState {
  return checkBadges({ ...state, chatCount: state.chatCount + 1 });
}

export function getDailyGoalProgress(state: GamificationState): { complete: number; total: 3 } {
  const today = todayISO();
  let complete = 0;
  if (state.lastVisitDate === today) complete++;
  if (state.lastArticleDate === today && state.articlesReadToday > 0) complete++;
  if (state.chatCount > 0) complete++;
  return { complete, total: 3 };
}

export function checkBadges(state: GamificationState): GamificationState {
  const badges = new Set(state.badges);
  badges.add("first-visit");
  if (state.streak >= 7) badges.add("7-day-streak");
  if (state.streak >= 30) badges.add("30-day-streak");
  if (state.chatCount >= 10) badges.add("ai-curious");
  return { ...state, badges: Array.from(badges) };
}

export function getLast7Days(state: GamificationState): { date: string; visited: boolean }[] {
  const visitSet = new Set(state.visitHistory);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const iso = d.toISOString().split("T")[0];
    return { date: iso, visited: visitSet.has(iso) };
  });
}
