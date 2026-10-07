import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CalendarDays,
  ClipboardList,
  FileText,
  Flame,
  Globe,
  RefreshCw,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { currentUser, contests, sheets, leaderboard, questions, companies } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lendi — One place to track your coding journey" },
      {
        name: "description",
        content:
          "Track DSA progress, coding profiles, contests, sheets and notes in one dashboard. Compare on the global leaderboard and prepare company-wise.",
      },
      {
        property: "og:title",
        content: "Lendi — Track your coding journey",
      },
      {
        property: "og:description",
        content:
          "DSA tracker, contest calendar, company-wise interview kit and coding portfolio in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const modules = [
  {
    title: "Portfolio",
    to: "/portfolio",
    icon: Globe,
    text: "One profile that aggregates every coding platform you use.",
  },
  {
    title: "Company Wise Kit",
    to: "/company-wise-kit",
    icon: ClipboardList,
    text: "Most asked questions per company, filtered by recency.",
  },
  {
    title: "My Workspace",
    to: "/workspace",
    icon: BarChart3,
    text: "Track every question you solve with status, notes and topics.",
  },
  {
    title: "Explore Sheets",
    to: "/explore-sheets",
    icon: FileText,
    text: "Follow curated sheets from the best creators in the community.",
  },
  {
    title: "Contests",
    to: "/contests",
    icon: CalendarDays,
    text: "Never miss a contest across LeetCode, CodeChef, Codeforces and more.",
  },
  {
    title: "Leaderboard",
    to: "/leaderboard",
    icon: Trophy,
    text: "See where you stand globally with the balanced C Score.",
  },
];

function HomePage() {
  return (
    <AppShell>
      <section className="card-surface relative overflow-hidden p-6 sm:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-primary/20 blur-3xl" />

        <p className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Flame className="size-3.5" />
          {currentUser.streak} day streak — keep it going
        </p>

        <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Welcome back, {currentUser.name.split(" ")[0]}. Your{" "}
          <span className="gradient-text">coding journey</span> in one place.
        </h1>

        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Profile tracker, question tracker, contest calendar and community leaderboard — all
          connected to a single portfolio you can share with recruiters.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            View my portfolio
            <ArrowRight className="size-4" />
          </Link>

          <Link
            to="/explore-sheets"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-accent"
          >
            Explore sheets
          </Link>
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "C Score", value: currentUser.cScore },
            { label: "Global Rank", value: `#${currentUser.globalRank}` },
            { label: "Questions", value: 651 },
            { label: "Active Days", value: 128 },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-border bg-surface p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                {stat.label}
              </dt>
              <dd className="mt-1 text-xl font-semibold sm:text-2xl">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <section>
            <h2 className="text-lg font-semibold">All modules</h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
              {modules.map((module) => (
                <Link
                  key={module.to}
                  to={module.to}
                  className="card-surface group p-5 transition-colors hover:border-primary/50 hover:bg-surface-hover"
                >
                  <module.icon className="size-6 text-primary" />

                  <h3 className="mt-3 font-semibold">{module.title}</h3>

                  <p className="mt-1 text-sm text-muted-foreground">{module.text}</p>

                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Open
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-8 grid gap-4 lg:grid-cols-3">
            <div className="card-surface p-5 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Upcoming contests</h2>

                <Link to="/contests" className="text-sm text-primary hover:underline">
                  View calendar
                </Link>
              </div>

              <ul className="mt-4 space-y-3">
                {contests.slice(0, 4).map((contest) => (
                  <li
                    key={contest.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{contest.name}</p>

                      <p className="text-xs text-muted-foreground">
                        {contest.platform} · {contest.day} · {contest.start}
                      </p>
                    </div>

                    {/* BACKEND PLACEHOLDER: contest subscription */}
                    <span className="rounded-md border border-primary/40 px-3 py-1 text-xs font-medium text-primary">
                      Subscribe
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-surface p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Top coders</h2>

                <Link to="/leaderboard" className="text-sm text-primary hover:underline">
                  All
                </Link>
              </div>

              <ul className="mt-4 space-y-3">
                {leaderboard.slice(0, 5).map((user) => (
                  <li key={user.rank} className="flex items-center gap-3">
                    <span className="w-6 text-sm font-semibold text-primary">#{user.rank}</span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.handle}</p>
                    </div>

                    <span className="text-sm font-semibold">{user.cScore}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Popular sheets</h2>

              <Link to="/explore-sheets" className="text-sm text-primary hover:underline">
                Explore all
              </Link>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
              {sheets.slice(0, 4).map((sheet) => (
                <div key={sheet.id} className="card-surface p-4">
                  <p className="truncate font-semibold text-primary">{sheet.title}</p>

                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                    {sheet.description}
                  </p>

                  <p className="mt-3 text-xs text-muted-foreground">{sheet.questions} questions</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <RightRail />
      </div>
    </AppShell>
  );
}

const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
const weekActivity = [3, 0, 5, 2, 0, 1, 4];

function RightRail() {
  return (
    <aside className="space-y-4">
      {/* BACKEND PLACEHOLDER: daily revision queue */}
      <div className="card-surface p-5">
        <div className="flex items-center gap-2">
          <RefreshCw className="size-4 text-primary" />
          <h2 className="font-semibold">Daily Revision</h2>
        </div>

        <p className="mt-1 text-xs text-muted-foreground">Questions due for revision today</p>

        <ul className="mt-3 space-y-2">
          {questions.slice(0, 3).map((question) => (
            <li key={question.id} className="rounded-lg border border-border bg-surface p-3">
              <p className="truncate text-sm font-medium">{question.title}</p>

              <p className="text-xs text-muted-foreground">
                {question.platform} · {question.difficulty}
              </p>
            </li>
          ))}
        </ul>

        <Link
          to="/workspace"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Open workspace
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="card-surface p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">This week</h2>

          <span className="text-xs text-muted-foreground">
            {weekActivity.reduce((total, value) => total + value, 0)} solved
          </span>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-2">
          {weekDays.map((day, index) => {
            const value = weekActivity[index] ?? 0;

            return (
              <div key={`${day}-${index}`} className="text-center">
                <div
                  className={`mx-auto flex size-8 items-center justify-center rounded-md text-xs font-semibold ${
                    value === 0
                      ? "border border-border bg-surface text-muted-foreground"
                      : value < 3
                        ? "bg-primary/30 text-foreground"
                        : "bg-primary text-primary-foreground"
                  }`}
                >
                  {value}
                </div>

                <span className="mt-1 block text-[10px] text-muted-foreground">{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card-surface p-5">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-primary" />
          <h2 className="font-semibold">Trending sheets</h2>
        </div>

        <ul className="mt-3 space-y-2">
          {sheets.slice(0, 4).map((sheet) => (
            <li key={sheet.id} className="flex items-center justify-between gap-2">
              <Link to="/explore-sheets" className="min-w-0 truncate text-sm hover:text-primary">
                {sheet.title}
              </Link>

              <span className="shrink-0 text-xs text-muted-foreground">
                {sheet.followers.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card-surface p-5">
        <div className="flex items-center gap-2">
          <Building2 className="size-4 text-primary" />
          <h2 className="font-semibold">Trending companies</h2>
        </div>

        <ul className="mt-3 space-y-2">
          {companies.slice(0, 5).map((company) => (
            <li key={company.name} className="flex items-center justify-between gap-2">
              <Link to="/company-wise-kit" className="truncate text-sm hover:text-primary">
                {company.name}
              </Link>

              <span className="shrink-0 text-xs text-muted-foreground">{company.questions} Qs</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
