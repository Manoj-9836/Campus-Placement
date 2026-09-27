import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Users, ListChecks, Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { sheets, sheetFilters } from "@/lib/mock-data";
import { toggleFollow, useAppState } from "@/lib/app-store";

export const Route = createFileRoute("/explore-sheets")({
  head: () => ({
    meta: [
      { title: "Explore DSA Sheets — Codolio" },
      {
        name: "description",
        content:
          "Browse curated DSA sheets from top creators — Striver A2Z, SDE Sheet, Blind 75, Neetcode 150 and more.",
      },
      { property: "og:title", content: "Explore DSA Sheets — Codolio" },
      {
        property: "og:description",
        content: "Follow curated DSA sheets from the best creators and track progress automatically.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExploreSheetsPage,
});

function ExploreSheetsPage() {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const { followed } = useAppState();

  // BACKEND PLACEHOLDER: fetch public sheets with tag filters + search
  const list = useMemo(
    () =>
      sheets.filter(
        (s) =>
          (filter === "All" || s.tags.includes(filter)) &&
          s.title.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [filter, query],
  );

  return (
    <AppShell>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Track Coding Sheets in One Place</h1>
          <p className="mt-1 text-sm text-muted-foreground">Choose from 30+ structured coding paths</p>
        </div>
        <Link
          to="/my-sheets"
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          My sheets ({followed.length})
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search any coding sheet"
          aria-label="Search any coding sheet"
          className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {sheetFilters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-surface-hover"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <h2 className="mt-6 text-lg font-semibold">{filter === "All" ? "All Sheets" : `${filter} Sheets`}</h2>

      <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {list.map((s) => {
          const isFollowing = followed.includes(s.id);
          return (
            <article key={s.id} className="card-surface flex flex-col overflow-hidden transition-colors hover:border-primary/50">
              <div className="flex items-center gap-2 px-3 pt-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${s.progress}%` }} />
                </div>
                <span className="text-xs text-muted-foreground">{s.progress}%</span>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="truncate font-semibold">{s.title}</h3>
                  <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                    <Users className="size-3.5" /> {(s.followers + (isFollowing ? 1 : 0)).toLocaleString()}
                  </span>
                </div>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{s.description}</p>

                <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <ListChecks className="size-3.5" /> {s.questions} questions
                  </span>
                  {/* BACKEND PLACEHOLDER: follow / unfollow sheet */}
                  <button
                    type="button"
                    onClick={() => {
                      toggleFollow(s.id);
                      toast[isFollowing ? "message" : "success"](
                        isFollowing ? `Unfollowed ${s.title}` : `Following ${s.title}`,
                      );
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                      isFollowing
                        ? "border border-primary text-primary hover:bg-primary/10"
                        : "bg-primary text-primary-foreground hover:opacity-90"
                    }`}
                  >
                    {isFollowing ? <BookmarkCheck className="size-3.5" /> : <Bookmark className="size-3.5" />}
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
        {list.length === 0 ? <p className="text-sm text-muted-foreground">No sheets in this category yet.</p> : null}
      </div>
    </AppShell>
  );
}
