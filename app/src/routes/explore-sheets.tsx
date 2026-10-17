import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { SheetCard } from "@/components/sheets/SheetCard";
import { sheets, sheetFilters } from "@/lib/mock-data";
import { useAppState } from "@/lib/app-store";

export const Route = createFileRoute("/explore-sheets")({
  head: () => ({
    meta: [
      { title: "Explore DSA Sheets — Lendi" },
      {
        name: "description",
        content:
          "Browse curated DSA sheets from top creators — Striver A2Z, SDE Sheet, Blind 75, Neetcode 150 and more.",
      },
      { property: "og:title", content: "Explore DSA Sheets — Lendi" },
      {
        property: "og:description",
        content:
          "Follow curated DSA sheets from the best creators and track progress automatically.",
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
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Track Coding Sheets in One Place
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose from 30+ structured coding paths
          </p>
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

      <h2 className="mt-6 text-lg font-semibold">
        {filter === "All" ? "All Sheets" : `${filter} Sheets`}
      </h2>

      <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {list.map((s) => {
          return <SheetCard key={s.id} sheet={s} />;
        })}
        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground">No sheets in this category yet.</p>
        ) : null}
      </div>
    </AppShell>
  );
}
