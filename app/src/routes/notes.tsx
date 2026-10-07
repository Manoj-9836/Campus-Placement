import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { notes, generalNotes } from "@/lib/mock-data";
import { addNote, deleteNote, useAppState, type UserNote } from "@/lib/app-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Notes — Lendi" },
      {
        name: "description",
        content:
          "Keep question notes and general revision notes together so every pattern you learn stays handy.",
      },
      { property: "og:title", content: "Notes — Lendi" },
      {
        property: "og:description",
        content: "Question-linked notes and general revision notes in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NotesPage,
});

const tabs = ["Question Notes", "General Notes"] as const;

type NoteItem = { id: string; title: string; body: string; updated: string; question?: string };
const field =
  "mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary";

function NotesPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Question Notes");
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(notes[0]?.id ?? null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { userNotes } = useAppState();

  // BACKEND PLACEHOLDER: fetch notes for the current user
  const list = useMemo<NoteItem[]>(() => {
    const staticNotes: NoteItem[] = tab === "Question Notes" ? notes : generalNotes;
    const kind: UserNote["kind"] = tab === "Question Notes" ? "question" : "general";
    const savedNotes = userNotes.filter((note) => note.kind === kind);
    const source = [...savedNotes, ...staticNotes];
    const normalizedQuery = query.trim().toLowerCase();
    return source.filter((n) =>
      [n.title, n.body, n.question ?? ""].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [tab, query, userNotes]);

  const active = list.find((n) => n.id === activeId) ?? list[0] ?? null;

  return (
    <AppShell>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">My Notes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Organize your learning and notes in one place
          </p>
        </div>
        {/* BACKEND PLACEHOLDER: create note */}
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" /> New note
        </button>
      </div>

      <div className="flex gap-1 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setTab(t);
              setActiveId(null);
            }}
            className={`-mb-px rounded-t-lg border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === t
                ? "border-primary bg-card text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="card-surface mt-4 overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                tab === "Question Notes" ? "Search a question note" : "Search a general note"
              }
              aria-label="Search notes"
              className="w-full rounded-lg border border-border bg-surface py-2 pl-3 pr-9 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-[minmax(0,18rem)_1fr]">
          <ul className="max-h-[28rem] overflow-y-auto border-b border-border md:border-b-0 md:border-r scrollbar-thin">
            {list.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(n.id)}
                  className={`w-full border-b border-border px-4 py-3 text-left transition-colors hover:bg-surface-hover ${
                    active?.id === n.id ? "bg-surface-hover" : ""
                  }`}
                >
                  <p className="truncate text-sm font-medium">{n.title}</p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {n.question ?? n.updated}
                  </p>
                </button>
              </li>
            ))}
            {list.length === 0 ? (
              <li className="px-4 py-10 text-center text-sm text-muted-foreground">
                No notes found
              </li>
            ) : null}
          </ul>

          <div className="min-h-[16rem] p-5">
            {active ? (
              <>
                <h2 className="text-lg font-semibold">{active.title}</h2>
                {userNotes.some((note) => note.id === active.id) ? (
                  <button
                    type="button"
                    onClick={() => {
                      deleteNote(active.id);
                      setActiveId(null);
                      toast.message("Note deleted");
                    }}
                    className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-destructive hover:underline"
                  >
                    <Trash2 className="size-3.5" /> Delete note
                  </button>
                ) : null}
                {active.question ? (
                  <p className="mt-1 text-xs text-primary">{active.question}</p>
                ) : null}
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{active.body}</p>
                <p className="mt-6 text-xs text-muted-foreground">Updated {active.updated}</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Select a note to read it here.</p>
            )}
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New note</DialogTitle>
            <DialogDescription>
              Save a quick revision note to your {tab.toLowerCase()} collection.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const title = String(form.get("title") ?? "").trim();
              const body = String(form.get("body") ?? "").trim();
              const question = String(form.get("question") ?? "").trim();
              if (!title || !body) return;
              const kind: UserNote["kind"] = tab === "Question Notes" ? "question" : "general";
              addNote({
                title,
                body,
                kind,
                ...(question ? { question } : {}),
              });
              setDialogOpen(false);
              toast.success("Note created");
            }}
          >
            <div>
              <label className="text-sm font-medium" htmlFor="note-title">
                Title
              </label>
              <input id="note-title" name="title" required className={field} />
            </div>
            {tab === "Question Notes" ? (
              <div>
                <label className="text-sm font-medium" htmlFor="note-question">
                  Question or topic
                </label>
                <input id="note-question" name="question" className={field} />
              </div>
            ) : null}
            <div>
              <label className="text-sm font-medium" htmlFor="note-body">
                Note
              </label>
              <textarea id="note-body" name="body" required rows={5} className={field} />
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Create note
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
