import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { sheets } from "@/lib/mock-data";
import { addCustomSheet, deleteCustomSheet, toggleFollow, useAppState } from "@/lib/app-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/my-sheets")({
  head: () => ({
    meta: [
      { title: "My Sheets — Lendi" },
      {
        name: "description",
        content:
          "Sheets you follow and custom sheets you created, with live progress on every question set.",
      },
      { property: "og:title", content: "My Sheets — Lendi" },
      {
        property: "og:description",
        content: "Manage the sheets you follow and build your own custom question sets.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MySheetsPage,
});

const field =
  "mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary";

function MySheetsPage() {
  const { followed, customSheets } = useAppState();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // BACKEND PLACEHOLDER: fetch sheets followed / created by the current user
  const followedSheets = sheets.filter((s) => followed.includes(s.id));

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    const count = Number(form.get("count") ?? 0);
    if (!title) return;
    // BACKEND PLACEHOLDER: create custom sheet
    addCustomSheet(title, Number.isFinite(count) ? count : 0);
    setOpen(false);
    toast.success(`Sheet "${title}" created`);
  };

  return (
    <AppShell>
      <PageHeader
        title="My Sheets"
        subtitle="Sheets you follow and the ones you built yourself."
        action={
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" /> New sheet
          </button>
        }
      />

      <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        Following
      </h2>
      {followedSheets.length === 0 ? (
        <div className="card-surface mt-3 grid place-items-center p-10 text-center">
          <p className="text-sm text-muted-foreground">You aren't following any sheet yet.</p>
          <Link
            to="/explore-sheets"
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Explore sheets
          </Link>
        </div>
      ) : (
        <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {followedSheets.map((s) => (
            <article key={s.id} className="card-surface p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-primary">{s.title}</h3>
                <button
                  type="button"
                  aria-label={`Unfollow ${s.title}`}
                  onClick={() => {
                    toggleFollow(s.id);
                    toast.message(`Unfollowed ${s.title}`);
                  }}
                  className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {s.questions} questions · by {s.author}
              </p>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-surface">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${s.progress}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{s.progress}% complete</p>
              <button
                type="button"
                onClick={() => navigate({ to: "/workspace" })}
                className="mt-4 w-full rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
              >
                Continue
              </button>
            </article>
          ))}
        </div>
      )}

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        Created by me
      </h2>
      {customSheets.length === 0 ? (
        <div className="card-surface mt-3 grid place-items-center p-10 text-center">
          <p className="text-sm text-muted-foreground">
            You haven't created a sheet yet. Group your favourite questions into a custom sheet and
            share it.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            <Plus className="size-4" /> Create your first sheet
          </button>
        </div>
      ) : (
        <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {customSheets.map((s) => (
            <article key={s.id} className="card-surface p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-primary">{s.title}</h3>
                <button
                  type="button"
                  aria-label={`Delete ${s.title}`}
                  onClick={() => {
                    deleteCustomSheet(s.id);
                    toast.message(`"${s.title}" deleted`);
                  }}
                  className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{s.questions} questions · by you</p>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-surface">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${s.progress}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{s.progress}% complete</p>
              <button
                type="button"
                onClick={() => navigate({ to: "/workspace" })}
                className="mt-4 w-full rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
              >
                Open
              </button>
            </article>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create a sheet</DialogTitle>
            <DialogDescription>
              Group your favourite questions into your own custom sheet.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="text-sm font-medium" htmlFor="sheet-title">
                Sheet name
              </label>
              <input
                id="sheet-title"
                name="title"
                required
                placeholder="My revision 50"
                className={field}
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="sheet-count">
                Number of questions
              </label>
              <input
                id="sheet-count"
                name="count"
                type="number"
                min={0}
                defaultValue={0}
                className={field}
              />
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Create sheet
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
