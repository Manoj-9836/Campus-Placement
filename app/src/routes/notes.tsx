import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@clerk/react";
import { FileText, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import type { UserNote } from "@/lib/app-store";
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
const API_URL = import.meta.env["VITE_API_URL"] ?? "http://localhost:5000/api/v1";
const field =
  "mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary";

function formatUpdated(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatUpdatedLong(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function NotesPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Question Notes");
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [remoteNotes, setRemoteNotes] = useState<UserNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { getToken } = useAuth();

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("Authentication token is unavailable");
        const response = await fetch(`${API_URL}/notes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(`Unable to load notes (${response.status})`);
        const payload = (await response.json()) as { notes: UserNote[] };
        if (!cancelled) setRemoteNotes(payload.notes);
      } catch (error) {
        if (!cancelled) {
          toast.error(error instanceof Error ? error.message : "Unable to load notes");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [getToken]);

  const list = useMemo(() => {
    const kind: UserNote["kind"] = tab === "Question Notes" ? "question" : "general";
    const normalizedQuery = query.trim().toLowerCase();
    return remoteNotes
      .filter((note) => note.kind === kind)
      .filter((note) =>
        [note.title, note.body, note.question ?? ""].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        ),
      );
  }, [remoteNotes, tab, query]);

  const active = list.find((note) => note.id === activeId) ?? list[0] ?? null;

  const handleDelete = async () => {
    if (!active || deleting) return;
    setDeleting(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication token is unavailable");
      const response = await fetch(`${API_URL}/notes/${active.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Unable to delete note");
      setRemoteNotes((current) => current.filter((note) => note.id !== active.id));
      setActiveId(null);
      toast.success("Note deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete note");
    } finally {
      setDeleting(false);
    }
  };

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    const body = String(form.get("body") ?? "").trim();
    const question = String(form.get("question") ?? "").trim();
    if (!title || !body) return;

    setSaving(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication token is unavailable");
      const kind: UserNote["kind"] = tab === "Question Notes" ? "question" : "general";
      const response = await fetch(`${API_URL}/notes`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, kind, ...(question ? { question } : {}) }),
      });
      if (!response.ok) throw new Error("Unable to create note");
      const payload = (await response.json()) as { note: UserNote };
      setRemoteNotes((current) => [payload.note, ...current]);
      setActiveId(payload.note.id);
      setDialogOpen(false);
      event.currentTarget.reset();
      toast.success("Note created");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create note");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">My Notes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Organize your learning and notes in one place
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" /> New note
        </button>
      </div>

      <div className="mb-1 flex gap-1 overflow-x-auto border-b border-border scrollbar-thin">
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setTab(item);
              setActiveId(null);
              setQuery("");
            }}
            className={`shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              tab === item
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border p-3 sm:p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={
                tab === "Question Notes" ? "Search a question note..." : "Search a general note..."
              }
              aria-label="Search notes"
              className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
            />
          </div>
        </div>

        <div className="grid min-h-112 md:grid-cols-[35%_65%]">
          <section className="min-w-0 border-b border-border md:border-b-0 md:border-r">
            <div className="max-h-128 overflow-y-auto p-2 scrollbar-thin sm:p-3">
              {loading ? (
                <div className="px-3 py-12 text-center text-sm text-muted-foreground">
                  Loading notes...
                </div>
              ) : list.length === 0 ? (
                <div className="px-4 py-14 text-center">
                  <FileText className="mx-auto size-8 text-muted-foreground/50" />
                  <p className="mt-3 text-sm font-medium">No notes found</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {query ? "Try a different search." : "Create your first note to get started."}
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {list.map((note) => {
                    const selected = active?.id === note.id;
                    return (
                      <button
                        key={note.id}
                        type="button"
                        onClick={() => setActiveId(note.id)}
                        className={`flex w-full min-w-0 items-start gap-3 rounded-lg border-l-2 p-3 text-left transition-colors ${
                          selected
                            ? "border-primary bg-primary/10"
                            : "border-transparent hover:bg-surface-hover"
                        }`}
                      >
                        <span
                          className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg ${
                            selected
                              ? "bg-primary/15 text-primary"
                              : "bg-surface text-muted-foreground"
                          }`}
                        >
                          <FileText className="size-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold">{note.title}</span>
                          <span className="mt-1 block truncate text-xs text-muted-foreground">
                            {note.question || "General note"}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <section className="min-w-0">
            {active ? (
              <div className="flex max-h-128 min-h-112 flex-col overflow-y-auto p-5 scrollbar-thin sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="wrap-break-word text-xl font-semibold tracking-tight sm:text-2xl">
                      {active.title}
                    </h2>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full bg-primary/15 px-3 py-1 font-medium capitalize text-primary">
                        {active.question || active.kind}
                      </span>
                      <span aria-hidden>•</span>
                      <span>Updated {formatUpdatedLong(active.updated)}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleDelete()}
                    disabled={deleting}
                    className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-destructive/70 px-3 py-2 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 className="size-3.5" />
                    {deleting ? "Deleting..." : "Delete note"}
                  </button>
                </div>
                <div className="my-5 h-px shrink-0 bg-border" />
                <p className="whitespace-pre-wrap wrap-break-word text-sm leading-8 text-foreground/90">
                  {active.body}
                </p>
              </div>
            ) : (
              <div className="grid min-h-112 place-items-center p-8 text-center">
                <div>
                  <FileText className="mx-auto size-10 text-muted-foreground/40" />
                  <p className="mt-3 text-sm font-medium">Select a note to view it</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Your note details will appear here.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New note</DialogTitle>
            <DialogDescription>
              Save a quick revision note to your {tab.toLowerCase()} collection.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleCreate}>
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
            <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                {saving ? "Creating..." : "Create note"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
