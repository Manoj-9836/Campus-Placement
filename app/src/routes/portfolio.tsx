import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, CheckCircle2, ExternalLink, MapPin, Plus, RefreshCw, School, Trophy } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import {
  awards,
  contestRatings,
  currentUser,
  developmentStats,
  heatmap,
  platformStats,
  questionSplit,
  topicStats,
} from "@/lib/mock-data";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "My Coding Portfolio | Codolio" },
      {
        name: "description",
        content:
          "A single portfolio that aggregates LeetCode, CodeChef, Codeforces and GitHub stats with topic analysis, streaks and awards.",
      },
      { property: "og:title", content: "My Coding Portfolio | Codolio" },
      { property: "og:description", content: "Aggregated coding profile stats, topic analysis, streaks and awards." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PortfolioPage,
});

const maxTopic = Math.max(...topicStats.map((t) => t.count));
const totalQuestions = questionSplit.reduce((a, b) => a + b.value, 0);

function PortfolioPage() {
  return (
    <AppShell>
      <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        {/* Profile column */}
        <aside className="space-y-4">
          <div className="card-surface p-5 text-center">
            <div className="mx-auto size-20 rounded-full bg-gradient-to-br from-primary to-primary-glow" />
            <h1 className="mt-3 text-lg font-semibold">{currentUser.name}</h1>
            <p className="text-sm text-muted-foreground">{currentUser.handle}</p>
            <div className="mt-4 space-y-2 text-left text-sm">
              <p className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4 text-primary" /> {currentUser.location}
              </p>
              <p className="flex items-start gap-2 text-muted-foreground">
                <School className="mt-0.5 size-4 shrink-0 text-primary" /> {currentUser.institution}
              </p>
            </div>
            <div className="mt-4 border-t border-border pt-4 text-left">
              <h2 className="text-sm font-semibold">About</h2>
              <p className="mt-1 text-sm text-muted-foreground">{currentUser.about}</p>
            </div>
          </div>

          {/* BACKEND PLACEHOLDER: platform connections + stat sync */}
          <div className="card-surface p-5">
            <h2 className="text-sm font-semibold">Problem Solving Stats</h2>
            <ul className="mt-3 space-y-2">
              {platformStats.map((p) => (
                <li key={p.name} className="flex items-center gap-2 rounded-lg border border-border bg-surface p-3">
                  <span className="flex-1 truncate text-sm font-medium">{p.name}</span>
                  {p.connected ? (
                    <CheckCircle2 className="size-4 text-success" />
                  ) : (
                    <span className="text-xs text-muted-foreground">Not linked</span>
                  )}
                  <ExternalLink className="size-4 text-muted-foreground" />
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-primary/60 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
            >
              <Plus className="size-4" /> Add Platform
            </button>

            <h2 className="mt-5 text-sm font-semibold">Development Stats</h2>
            <ul className="mt-3 space-y-2">
              {developmentStats.map((d) => (
                <li key={d.name} className="flex items-center gap-2 rounded-lg border border-border bg-surface p-3">
                  <span className="flex-1 text-sm font-medium">{d.name}</span>
                  <CheckCircle2 className="size-4 text-success" />
                  <ExternalLink className="size-4 text-muted-foreground" />
                </li>
              ))}
            </ul>
          </div>

          <div className="card-surface p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Leaderboard</h2>
              <span className="text-xs text-info">How it works ?</span>
            </div>
            <div className="mt-3 rounded-lg border border-border bg-surface p-4">
              <p className="text-sm font-semibold">Global Rank</p>
              <p className="text-xs text-muted-foreground">Based on C Score</p>
              <p className="mt-2 flex items-center gap-2 text-2xl font-semibold">
                <BarChart3 className="size-5 text-primary" /> {currentUser.globalRank}
              </p>
            </div>
            <button
              type="button"
              className="mt-3 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              View Leaderboard
            </button>
          </div>

          <div className="card-surface space-y-2 p-5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Profile Views:</span>
              <span>{currentUser.profileViews}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Refresh:</span>
              <span className="flex items-center gap-1">
                <RefreshCw className="size-3.5 text-primary" /> 1 second ago
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Profile Visibility:</span>
              <span className="capitalize">{currentUser.visibility}</span>
            </div>
          </div>
        </aside>

        {/* Stats column */}
        <div className="min-w-0 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Total Questions", value: totalQuestions },
              { label: "Total Active Days", value: 128 },
              { label: "Max Streak", value: 41 },
              { label: "Contests Attended", value: 27 },
            ].map((s) => (
              <div key={s.label} className="card-surface p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
                <p className="mt-1 text-2xl font-semibold">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="card-surface p-5">
              <h2 className="text-sm font-semibold">Problems Solved</h2>
              <div className="mt-4 space-y-3">
                {questionSplit.map((q) => (
                  <div key={q.label}>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{q.label}</span>
                      <span>{q.value}</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${(q.value / totalQuestions) * 100}%`, backgroundColor: q.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-center text-3xl font-semibold">{totalQuestions}</p>
              <p className="text-center text-xs text-muted-foreground">Total solved</p>
            </div>

            <div className="card-surface p-5">
              <h2 className="text-sm font-semibold">Contest Rating</h2>
              <div className="mt-6 flex h-40 items-end gap-2">
                {contestRatings.map((c) => (
                  <div key={c.month} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t bg-gradient-to-t from-primary/40 to-primary"
                      style={{ height: `${((c.rating - 1350) / 400) * 100}%` }}
                    />
                    <span className="text-[10px] text-muted-foreground">{c.month}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Current rating <span className="font-semibold text-foreground">1687</span>
              </p>
            </div>
          </div>

          <div className="card-surface p-5">
            <h2 className="text-sm font-semibold">Submission Heatmap</h2>
            <div className="scrollbar-thin mt-4 overflow-x-auto pb-2">
              <div className="grid w-max grid-flow-col grid-rows-7 gap-1">
                {heatmap.map((h) => (
                  <div
                    key={h.day}
                    title={`${h.count} submissions`}
                    className="size-3 rounded-[3px]"
                    style={{
                      backgroundColor: h.count === 0 ? "var(--color-muted)" : "var(--color-primary)",
                      opacity: h.count === 0 ? 1 : Math.min(1, 0.35 + h.count * 0.2),
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="card-surface p-5">
            <h2 className="text-sm font-semibold">Topic Analysis</h2>
            <ul className="mt-4 space-y-2">
              {topicStats.map((t) => (
                <li key={t.topic} className="flex items-center gap-3">
                  <span className="w-32 shrink-0 truncate text-right text-xs text-muted-foreground sm:w-44">
                    {t.topic}
                  </span>
                  <div className="h-5 flex-1 rounded bg-muted">
                    <div
                      className="flex h-full items-center justify-end rounded bg-info px-2 text-[10px] font-semibold text-info-foreground"
                      style={{ width: `${(t.count / maxTopic) * 100}%` }}
                    >
                      {t.count}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-surface p-5">
            <h2 className="text-sm font-semibold">Awards</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {awards.map((a) => (
                <div key={a.title} className="rounded-lg border border-border bg-surface p-4 text-center">
                  <Trophy className="mx-auto size-6 text-primary" />
                  <p className="mt-2 text-sm font-semibold">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
