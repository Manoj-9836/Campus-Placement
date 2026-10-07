import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trophy } from "lucide-react";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { leaderboard, currentUser } from "@/lib/mock-data";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Global Coding Leaderboard — Lendi" },
      {
        name: "description",
        content:
          "See where you rank globally with the balanced C Score built from DSA solving, contest ratings and development activity.",
      },
      { property: "og:title", content: "Global Coding Leaderboard — Lendi" },
      {
        property: "og:description",
        content:
          "Compare your C Score, questions solved and contest ratings with coders worldwide.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LeaderboardPage,
});

const scopes = ["Global", "Institution", "Friends"];

function LeaderboardPage() {
  const [scope, setScope] = useState("Global");

  return (
    <AppShell>
      <PageHeader
        title="Leaderboard"
        subtitle="Ranked by C Score — a balanced measure out of 900."
      />

      <div className="flex flex-wrap gap-2">
        {scopes.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setScope(s)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              scope === s
                ? "border-primary bg-primary/15 text-primary"
                : "border-border text-muted-foreground hover:bg-accent"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Top 3 podium */}
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {(
          [leaderboard[1], leaderboard[0], leaderboard[2]].filter(
            Boolean,
          ) as (typeof leaderboard)[number][]
        ).map((u) => (
          <article
            key={u.rank}
            className={`card-surface flex flex-col items-center p-5 text-center ${
              u.rank === 1 ? "border-primary sm:-mt-3 sm:pb-8" : ""
            }`}
          >
            <span
              className={`grid size-14 place-items-center rounded-full text-lg font-bold ${
                u.rank === 1
                  ? "bg-gradient-to-br from-primary to-primary-glow text-primary-foreground"
                  : "bg-surface text-primary"
              }`}
            >
              {u.rank}
            </span>
            <p className="mt-3 truncate text-sm font-semibold">{u.name}</p>
            <p className="truncate text-xs text-muted-foreground">{u.handle}</p>
            <p className="mt-3 text-xl font-bold text-primary">{u.cScore}</p>
            <p className="text-xs text-muted-foreground">C Score · {u.questions} questions</p>
          </article>
        ))}
      </div>

      <div className="card-surface mt-5 flex flex-wrap items-center gap-4 border-primary/60 p-4">
        <span className="grid size-11 place-items-center rounded-lg bg-primary/15 text-primary">
          <Trophy className="size-5" />
        </span>
        <div>
          <p className="text-sm font-medium">Your position</p>
          <p className="text-xs text-muted-foreground">
            Rank #{currentUser.globalRank} · C Score {currentUser.cScore}
          </p>
        </div>
        {/* BACKEND PLACEHOLDER: share rank card */}
        <button
          type="button"
          className="ml-auto rounded-lg border border-primary px-4 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
        >
          Share
        </button>
      </div>

      {/* BACKEND PLACEHOLDER: paginated leaderboard query by scope */}
      <div className="card-surface mt-5 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Coder</th>
              <th className="px-4 py-3">Institution</th>
              <th className="px-4 py-3">Questions</th>
              <th className="px-4 py-3">LeetCode</th>
              <th className="px-4 py-3">Codeforces</th>
              <th className="px-4 py-3">C Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((u) => (
              <tr
                key={u.rank}
                className="border-b border-border/60 last:border-0 hover:bg-surface-hover"
              >
                <td className="px-4 py-3 font-semibold text-primary">#{u.rank}</td>
                <td className="px-4 py-3">
                  <p className="font-medium">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.handle}</p>
                </td>
                <td className="max-w-[240px] truncate px-4 py-3 text-muted-foreground">
                  {u.institution}
                </td>
                <td className="px-4 py-3">{u.questions}</td>
                <td className="px-4 py-3">{u.leetcode}</td>
                <td className="px-4 py-3">{u.codeforces}</td>
                <td className="px-4 py-3 font-semibold">{u.cScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="mt-5 space-y-3 md:hidden">
        {leaderboard.map((u) => (
          <li key={u.rank} className="card-surface flex items-center gap-3 p-4">
            <span className="w-8 font-semibold text-primary">#{u.rank}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{u.name}</p>
              <p className="truncate text-xs text-muted-foreground">{u.institution}</p>
            </div>
            <span className="font-semibold">{u.cScore}</span>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
