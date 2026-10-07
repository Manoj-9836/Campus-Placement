import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ExternalLink, NotebookPen, Search } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { questions } from "@/lib/mock-data";
import { setQuestionStatus, useAppState, type QuestionStatus } from "@/lib/app-store";

export const Route = createFileRoute("/workspace")({
  head: () => ({
    meta: [
      { title: "My Workspace — Question Tracker | Lendi" },
      {
        name: "description",
        content:
          "Track every question you solve with status, difficulty, topics and notes in one searchable workspace.",
      },
      { property: "og:title", content: "My Workspace — Question Tracker" },
      {
        property: "og:description",
        content: "Your personal DSA question tracker with status, topics and notes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkspacePage,
});

const statuses = ["All", "Solved", "Attempted", "Todo"] as const;
const statusOptions: QuestionStatus[] = ["Solved", "Attempted", "Todo"];

const diffClass: Record<string, string> = {
  Easy: "text-success",
  Medium: "text-warning",
  Hard: "text-destructive",
};

function WorkspacePage() {
  const [status, setStatus] = useState<(typeof statuses)[number]>("All");
  const [query, setQuery] = useState("");
  const { questionStatus } = useAppState();

  // BACKEND PLACEHOLDER: fetch the user's tracked questions
  const tracked = useMemo(
    () => questions.map((q) => ({ ...q, status: questionStatus[q.id] ?? q.status })),
    [questionStatus],
  );

  const rows = useMemo(
    () =>
      tracked.filter(
        (q) =>
          (status === "All" || q.status === status) &&
          q.title.toLowerCase().includes(query.toLowerCase()),
      ),
    [tracked, status, query],
  );

  const counts = {
    Solved: tracked.filter((q) => q.status === "Solved").length,
    Attempted: tracked.filter((q) => q.status === "Attempted").length,
    Todo: tracked.filter((q) => q.status === "Todo").length,
  };

  const update = (id: string, title: string, next: QuestionStatus) => {
    // BACKEND PLACEHOLDER: persist question status
    setQuestionStatus(id, next);
    toast.success(`${title} marked as ${next}`);
  };

  const selectClass =
    "rounded-md border border-border bg-surface px-2 py-1 text-xs font-medium outline-none focus:border-primary";

  return (
    <AppShell>
      <PageHeader
        title="My Workspace"
        subtitle="Everything you have solved, attempted or saved for later."
      />

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total tracked", value: tracked.length },
          { label: "Solved", value: counts.Solved },
          { label: "Attempted", value: counts.Attempted },
          { label: "Todo", value: counts.Todo },
        ].map((s) => (
          <div key={s.label} className="card-surface p-4">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</dt>
            <dd className="mt-1 text-xl font-semibold">{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="card-surface mt-5 flex flex-wrap items-center gap-3 p-4">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions"
            aria-label="Search questions"
            className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                status === s
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:bg-accent"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop table */}
      <div className="card-surface mt-5 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3">Question</th>
              <th className="px-4 py-3">Difficulty</th>
              <th className="px-4 py-3">Platform</th>
              <th className="px-4 py-3">Topics</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Solved</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((q) => (
              <tr
                key={q.id}
                className="border-b border-border/60 last:border-0 hover:bg-surface-hover"
              >
                <td className="px-4 py-3 font-medium">
                  <span className="flex items-center gap-2">
                    {q.title}
                    {q.notes ? (
                      <NotebookPen className="size-3.5 text-primary" aria-label="Has notes" />
                    ) : null}
                    {/* BACKEND PLACEHOLDER: deep-link to the question on its platform */}
                    <button
                      type="button"
                      aria-label={`Open ${q.title}`}
                      onClick={() => toast.message(`Opening ${q.title} on ${q.platform}…`)}
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      <ExternalLink className="size-3.5" />
                    </button>
                  </span>
                </td>
                <td className={`px-4 py-3 font-medium ${diffClass[q.difficulty]}`}>
                  {q.difficulty}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{q.platform}</td>
                <td className="px-4 py-3 text-muted-foreground">{q.topics.join(", ")}</td>
                <td className="px-4 py-3">
                  <select
                    aria-label={`Status for ${q.title}`}
                    value={q.status}
                    onChange={(e) => update(q.id, q.title, e.target.value as QuestionStatus)}
                    className={selectClass}
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{q.solvedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="mt-5 space-y-3 md:hidden">
        {rows.map((q) => (
          <li key={q.id} className="card-surface p-4">
            <p className="font-medium">{q.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {q.platform} · {q.topics.join(", ")}
            </p>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className={`font-medium ${diffClass[q.difficulty]}`}>{q.difficulty}</span>
              <select
                aria-label={`Status for ${q.title}`}
                value={q.status}
                onChange={(e) => update(q.id, q.title, e.target.value as QuestionStatus)}
                className={selectClass}
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </li>
        ))}
      </ul>

      {rows.length === 0 ? (
        <p className="mt-5 text-sm text-muted-foreground">No questions found.</p>
      ) : null}
    </AppShell>
  );
}
