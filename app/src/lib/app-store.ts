/**
 * FRONTEND-ONLY APP STORE
 * -----------------------
 * A tiny global store persisted to localStorage so every button in the UI does
 * something real without a backend.
 *
 * BACKEND PLACEHOLDER: replace each slice below with real API calls / server
 * functions (follow sheet, update question status, create note, create calendar
 * event, save profile, contest reminders, …).
 */
import { useSyncExternalStore } from "react";
import { currentUser, questions, sheets, platformStats, developmentStats } from "./mock-data";

export type QuestionStatus = "Solved" | "Attempted" | "Todo";

export type UserNote = {
  id: string;
  title: string;
  body: string;
  updated: string;
  question?: string;
  kind: "question" | "general";
};

export type CustomEvent = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  start: string;
  note: string;
};

export type CustomSheet = {
  id: string;
  title: string;
  questions: number;
  progress: number;
  author: string;
};

export type AppState = {
  followed: string[];
  customSheets: CustomSheet[];
  questionStatus: Record<string, QuestionStatus>;
  userNotes: UserNote[];
  reminders: string[];
  events: CustomEvent[];
  connected: string[];
  visibility: "public" | "private";
  profile: {
    name: string;
    handle: string;
    location: string;
    institution: string;
    about: string;
    email: string;
  };
};

const defaults: AppState = {
  followed: sheets.slice(0, 3).map((s) => s.id),
  customSheets: [],
  questionStatus: Object.fromEntries(questions.map((q) => [q.id, q.status])) as Record<
    string,
    QuestionStatus
  >,
  userNotes: [],
  reminders: [],
  events: [],
  connected: [...platformStats, ...developmentStats].filter((p) => p.connected).map((p) => p.name),
  visibility: currentUser.visibility,
  profile: {
    name: currentUser.name,
    handle: currentUser.handle,
    location: currentUser.location,
    institution: currentUser.institution,
    about: currentUser.about,
    email: "manoj@example.com",
  },
};

const KEY = "codolio.state.v1";

let state: AppState = defaults;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable — keep state in memory only */
  }
}

export function setAppState(patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) {
  const next = typeof patch === "function" ? patch(state) : patch;
  state = { ...state, ...next };
  persist();
  emit();
}

/** Called once from the client after hydration so SSR markup stays stable. */
export function hydrateAppState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    state = { ...defaults, ...parsed, profile: { ...defaults.profile, ...parsed.profile } };
    emit();
  } catch {
    /* ignore corrupt storage */
  }
}

export function resetAppState() {
  state = defaults;
  persist();
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useAppState(): AppState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => defaults,
  );
}

/* ---------------- actions ---------------- */

export const toggleFollow = (id: string) =>
  setAppState((s) => ({
    followed: s.followed.includes(id) ? s.followed.filter((x) => x !== id) : [...s.followed, id],
  }));

export const setQuestionStatus = (id: string, status: QuestionStatus) =>
  setAppState((s) => ({ questionStatus: { ...s.questionStatus, [id]: status } }));

export const addNote = (note: Omit<UserNote, "id" | "updated">) =>
  setAppState((s) => ({
    userNotes: [{ ...note, id: `un-${Date.now()}`, updated: "Just now" }, ...s.userNotes],
  }));

export const deleteNote = (id: string) =>
  setAppState((s) => ({ userNotes: s.userNotes.filter((n) => n.id !== id) }));

export const toggleReminder = (id: string) =>
  setAppState((s) => ({
    reminders: s.reminders.includes(id) ? s.reminders.filter((x) => x !== id) : [...s.reminders, id],
  }));

export const addEvent = (event: Omit<CustomEvent, "id">) =>
  setAppState((s) => ({ events: [...s.events, { ...event, id: `ev-${Date.now()}` }] }));

export const deleteEvent = (id: string) =>
  setAppState((s) => ({
    events: s.events.filter((e) => e.id !== id),
    reminders: s.reminders.filter((r) => r !== id),
  }));

export const togglePlatform = (name: string) =>
  setAppState((s) => ({
    connected: s.connected.includes(name)
      ? s.connected.filter((x) => x !== name)
      : [...s.connected, name],
  }));

export const setVisibility = (visibility: AppState["visibility"]) => setAppState({ visibility });

export const saveProfile = (profile: AppState["profile"]) => setAppState({ profile });

export const addCustomSheet = (title: string, count: number) =>
  setAppState((s) => ({
    customSheets: [
      ...s.customSheets,
      { id: `cs-${Date.now()}`, title, questions: count, progress: 0, author: "You" },
    ],
  }));

export const deleteCustomSheet = (id: string) =>
  setAppState((s) => ({ customSheets: s.customSheets.filter((c) => c.id !== id) }));
