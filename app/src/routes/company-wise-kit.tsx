import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Building2, Search } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { companies } from "@/lib/mock-data";

export const Route = createFileRoute("/company-wise-kit")({
  head: () => ({
    meta: [
      { title: "Company Wise Interview Kit — Codolio" },
      {
        name: "description",
        content:
          "Most asked coding interview questions grouped by company, with role and difficulty filters for focused preparation.",
      },
      { property: "og:title", content: "Company Wise Interview Kit — Codolio" },
      {
        property: "og:description",
        content: "Prepare company-wise with the most frequently asked DSA questions per company.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CompanyWiseKitPage,
});

const difficulties = ["All", "Easy", "Medium", "Hard"];

function CompanyWiseKitPage() {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("All");

  // BACKEND PLACEHOLDER: replace with a paginated companies query
  const list = useMemo(
    () =>
      companies.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) &&
          (difficulty === "All" || c.difficulty === difficulty),
      ),
    [query, difficulty],
  );

  return (
    <AppShell>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Company Wise Kit</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Most asked interview questions per company, grouped by role and difficulty.
        </p>
      </div>


      <div className="card-surface flex flex-wrap items-center gap-3 p-4">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search companies"
            aria-label="Search companies"
            className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {difficulties.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDifficulty(d)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                difficulty === d
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:bg-accent"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((c) => (
          <article key={c.name} className="card-surface p-5 transition-colors hover:border-primary/50">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-lg bg-primary/15 text-primary">
                <Building2 className="size-5" />
              </span>
              <div className="min-w-0">
                <h2 className="truncate font-semibold">{c.name}</h2>
                <p className="text-xs text-muted-foreground">{c.questions} questions</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {c.roles.map((r) => (
                <span key={r} className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground">
                  {r}
                </span>
              ))}
              <span className="rounded-md border border-primary/40 px-2 py-1 text-xs text-primary">
                {c.difficulty}
              </span>
            </div>
            {/* BACKEND PLACEHOLDER: open the company question set */}
            <button
              type="button"
              className="mt-4 w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Start practising
            </button>
          </article>
        ))}
        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground">No companies match your filters.</p>
        ) : null}
      </div>
    </AppShell>
  );
}