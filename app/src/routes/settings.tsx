import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Link2, Trash2 } from "lucide-react";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { currentUser, platformStats, developmentStats } from "@/lib/mock-data";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Edit Profile & Settings — Codolio" },
      {
        name: "description",
        content:
          "Update your basic info, profile details, connected coding platforms, profile visibility and account settings.",
      },
      { property: "og:title", content: "Edit Profile & Settings — Codolio" },
      {
        property: "og:description",
        content: "Manage your Codolio profile, platform handles and visibility.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

const tabs = ["Basic Info", "Profile Details", "Platform", "Visibility", "Accounts"] as const;

const field =
  "mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary";

function SettingsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Basic Info");
  const [visibility, setVisibility] = useState(currentUser.visibility);

  return (
    <AppShell>
      <PageHeader title="Edit Profile" subtitle="Your details, handles and privacy — all in one place." />

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              tab === t
                ? "border-primary bg-primary/15 text-primary"
                : "border-border text-muted-foreground hover:bg-accent"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* BACKEND PLACEHOLDER: load and persist profile settings */}
      <div className="card-surface mt-5 p-5 sm:p-6">
        {tab === "Basic Info" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium" htmlFor="name">
                Full name
              </label>
              <input id="name" defaultValue={currentUser.name} className={field} />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="username">
                Username
              </label>
              <input id="username" defaultValue={currentUser.handle} className={field} />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="location">
                Location
              </label>
              <input id="location" defaultValue={currentUser.location} className={field} />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="institution">
                Institution
              </label>
              <input id="institution" defaultValue={currentUser.institution} className={field} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium" htmlFor="about">
                About
              </label>
              <textarea id="about" rows={4} defaultValue={currentUser.about} className={field} />
            </div>
          </div>
        ) : null}

        {tab === "Profile Details" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {["Portfolio website", "LinkedIn", "GitHub", "Twitter / X", "Resume link", "Preferred role"].map((l) => (
              <div key={l}>
                <label className="text-sm font-medium" htmlFor={l}>
                  {l}
                </label>
                <input id={l} placeholder={`Add your ${l.toLowerCase()}`} className={field} />
              </div>
            ))}
          </div>
        ) : null}

        {tab === "Platform" ? (
          <ul className="space-y-3">
            {[...platformStats, ...developmentStats].map((p) => (
              <li
                key={p.name}
                className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4"
              >
                <span className="grid size-10 place-items-center rounded-lg bg-primary/15 text-primary">
                  <Link2 className="size-4" />
                </span>
                <div className="min-w-[140px] flex-1">
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.handle || "Not connected"}</p>
                </div>
                {/* BACKEND PLACEHOLDER: connect / disconnect platform account */}
                {p.connected ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
                    <Check className="size-3.5" /> Connected
                  </span>
                ) : (
                  <button
                    type="button"
                    className="rounded-lg border border-primary px-4 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
                  >
                    Connect
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : null}

        {tab === "Visibility" ? (
          <div className="space-y-3">
            {(["public", "private"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVisibility(v)}
                className={`flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors ${
                  visibility === v ? "border-primary bg-primary/10" : "border-border hover:bg-accent"
                }`}
              >
                <span
                  className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border ${
                    visibility === v ? "border-primary bg-primary" : "border-border"
                  }`}
                />
                <span>
                  <span className="block text-sm font-medium capitalize">{v} profile</span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {v === "public"
                      ? "Anyone with your link can view your portfolio and stats."
                      : "Only you can see your portfolio. It stays out of the leaderboard."}
                  </span>
                </span>
              </button>
            ))}
          </div>
        ) : null}

        {tab === "Accounts" ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <input id="email" type="email" defaultValue="manoj@example.com" className={field} />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="password">
                New password
              </label>
              <input id="password" type="password" placeholder="••••••••" className={field} />
            </div>
            {/* BACKEND PLACEHOLDER: account deletion flow */}
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-destructive px-4 py-2 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
            >
              <Trash2 className="size-4" /> Delete account
            </button>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-5">
          {/* BACKEND PLACEHOLDER: save settings mutation */}
          <button
            type="button"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Save changes
          </button>
          <button
            type="button"
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
          >
            Cancel
          </button>
        </div>
      </div>
    </AppShell>
  );
}
