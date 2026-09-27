import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bell, BellRing, CalendarDays, CalendarPlus, ChevronLeft, ChevronRight, Clock, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { contests } from "@/lib/mock-data";
import { addEvent, deleteEvent, toggleReminder, useAppState } from "@/lib/app-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/contests")({
  head: () => ({
    meta: [
      { title: "Contest Calendar — Codolio" },
      {
        name: "description",
        content:
          "Upcoming coding contests across LeetCode, CodeChef, Codeforces, AtCoder and Unstop with reminders and your own custom events in one calendar.",
      },
      { property: "og:title", content: "Contest Calendar — Codolio" },
      {
        property: "og:description",
        content: "Never miss a coding contest — one calendar for every platform, plus your own events.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContestsPage,
});

const platforms = ["All", "My Events", "LeetCode", "CodeChef", "Codeforces", "AtCoder", "Unstop"];
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const accentDot: Record<string, string> = {
  success: "bg-success",
  destructive: "bg-destructive",
  info: "bg-info",
  warning: "bg-warning",
  primary: "bg-primary",
};
const accentChip: Record<string, string> = {
  success: "bg-success/15 text-success",
  destructive: "bg-destructive/15 text-destructive",
  info: "bg-info/15 text-info",
  warning: "bg-warning/15 text-warning",
  primary: "bg-primary/15 text-primary",
};

const toKey = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

type CalendarItem = {
  id: string;
  name: string;
  platform: string;
  start: string;
  end: string;
  day: string;
  date: string;
  accent: string;
  custom?: boolean;
  note?: string;
};

const field =
  "mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary";

function ContestsPage() {
  const [platform, setPlatform] = useState("All");
  // BACKEND PLACEHOLDER: fetch contests for the visible month from the aggregator API
  const [cursor, setCursor] = useState({ year: 2026, month: 7 }); // Aug 2026
  const [selected, setSelected] = useState<string | null>("2026-08-29");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { events, reminders } = useAppState();

  const all = useMemo<CalendarItem[]>(
    () => [
      ...contests,
      ...events.map((e) => ({
        id: e.id,
        name: e.title,
        platform: "My Events",
        start: e.start,
        end: e.start,
        day: e.date,
        date: e.date,
        accent: "primary",
        custom: true,
        note: e.note,
      })),
    ],
    [events],
  );

  const list = useMemo(
    () => (platform === "All" ? all : all.filter((c) => c.platform === platform)),
    [platform, all],
  );

  const byDate = useMemo(() => {
    const map = new Map<string, CalendarItem[]>();
    for (const c of list) {
      const arr = map.get(c.date) ?? [];
      arr.push(c);
      map.set(c.date, arr);
    }
    return map;
  }, [list]);

  const { year, month } = cursor;
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const shift = (delta: number) => {
    const d = new Date(year, month + delta, 1);
    setCursor({ year: d.getFullYear(), month: d.getMonth() });
  };

  const monthCount = list.filter((c) => c.date.startsWith(toKey(year, month, 1).slice(0, 7))).length;
  const selectedContests = selected ? (byDate.get(selected) ?? []) : [];

  const upcoming = useMemo(
    () => [...list].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 6),
    [list],
  );

  const handleRemind = (item: CalendarItem) => {
    // BACKEND PLACEHOLDER: subscribe to contest reminders
    toggleReminder(item.id);
    toast[reminders.includes(item.id) ? "message" : "success"](
      reminders.includes(item.id) ? `Reminder removed for ${item.name}` : `We'll remind you before ${item.name}`,
    );
  };

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    const date = String(form.get("date") ?? "");
    const start = String(form.get("start") ?? "");
    if (!title || !date) return;
    // BACKEND PLACEHOLDER: persist the custom calendar event
    addEvent({
      title,
      date,
      start: start || "All day",
      note: String(form.get("note") ?? "").trim(),
    });
    const d = new Date(`${date}T00:00:00`);
    setCursor({ year: d.getFullYear(), month: d.getMonth() });
    setSelected(date);
    setDialogOpen(false);
    toast.success(`"${title}" added to your calendar`);
  };

  return (
    <AppShell>
      <PageHeader
        title="Contests"
        subtitle="Every upcoming contest, one calendar, one reminder system."
        action={
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <CalendarPlus className="size-4" /> Add event
          </button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        {platforms.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPlatform(p)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              platform === p
                ? "border-primary bg-primary/15 text-primary"
                : "border-border text-muted-foreground hover:bg-accent"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_22rem]">
        {/* Calendar */}
        <section className="card-surface p-3 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous month"
                onClick={() => shift(-1)}
                className="rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <ChevronLeft className="size-4" />
              </button>
              <p className="min-w-[9.5rem] text-center text-sm font-semibold sm:text-base">
                {monthNames[month]} {year}
              </p>
              <button
                type="button"
                aria-label="Next month"
                onClick={() => shift(1)}
                className="rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden text-xs text-muted-foreground sm:inline">{monthCount} events</span>
              <button
                type="button"
                onClick={() => setCursor({ year: 2026, month: 7 })}
                className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                Today
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {weekDays.map((d) => (
              <span key={d} className="py-1">
                <span className="sm:hidden">{d[0]}</span>
                <span className="hidden sm:inline">{d}</span>
              </span>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (day === null) return <div key={`e-${i}`} className="min-h-14 rounded-lg sm:min-h-24" />;
              const key = toKey(year, month, day);
              const dayContests = byDate.get(key) ?? [];
              const isSelected = selected === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelected(key)}
                  onDoubleClick={() => {
                    setSelected(key);
                    setDialogOpen(true);
                  }}
                  className={`flex min-h-14 flex-col gap-1 rounded-lg border p-1.5 text-left transition-colors sm:min-h-24 sm:p-2 ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border/60 bg-background/40 hover:border-primary/40 hover:bg-accent"
                  }`}
                >
                  <span
                    className={`text-xs font-semibold ${
                      dayContests.length ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {day}
                  </span>
                  <span className="flex flex-wrap gap-1 sm:hidden">
                    {dayContests.slice(0, 3).map((c) => (
                      <span key={c.id} className={`size-1.5 rounded-full ${accentDot[c.accent] ?? "bg-primary"}`} />
                    ))}
                  </span>
                  <span className="hidden flex-col gap-1 sm:flex">
                    {dayContests.slice(0, 2).map((c) => (
                      <span
                        key={c.id}
                        className={`truncate rounded px-1.5 py-0.5 text-[10px] font-medium ${
                          accentChip[c.accent] ?? "bg-primary/15 text-primary"
                        }`}
                      >
                        {c.name}
                      </span>
                    ))}
                    {dayContests.length > 2 ? (
                      <span className="px-1 text-[10px] text-muted-foreground">+{dayContests.length - 2} more</span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Day detail + upcoming rail */}
        <aside className="space-y-4">
          <div className="card-surface p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">
                {selected
                  ? new Date(`${selected}T00:00:00`).toLocaleDateString("en-GB", {
                      weekday: "long",
                      day: "numeric",
                      month: "short",
                    })
                  : "Select a day"}
              </p>
              <button
                type="button"
                onClick={() => setDialogOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-md border border-primary px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
              >
                <CalendarPlus className="size-3.5" /> Add
              </button>
            </div>
            <ul className="mt-3 space-y-3">
              {selectedContests.length === 0 ? (
                <li className="text-sm text-muted-foreground">Nothing on this day yet — add your own event.</li>
              ) : (
                selectedContests.map((c) => {
                  const reminded = reminders.includes(c.id);
                  return (
                    <li key={c.id} className="rounded-lg border border-border p-3">
                      <div className="flex items-start gap-2">
                        <span className="grid size-8 shrink-0 place-items-center rounded-md bg-primary/15 text-primary">
                          <CalendarDays className="size-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{c.name}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{c.platform}</p>
                        </div>
                        {c.custom ? (
                          <button
                            type="button"
                            aria-label={`Delete ${c.name}`}
                            onClick={() => {
                              deleteEvent(c.id);
                              toast.message(`"${c.name}" removed`);
                            }}
                            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        ) : null}
                      </div>
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="size-3.5" />
                        {c.custom ? c.start : `${c.start} – ${c.end}`}
                      </p>
                      {c.note ? <p className="mt-2 text-xs text-muted-foreground">{c.note}</p> : null}
                      <button
                        type="button"
                        onClick={() => handleRemind(c)}
                        className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                          reminded
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-primary text-primary hover:bg-primary/10"
                        }`}
                      >
                        {reminded ? <BellRing className="size-3.5" /> : <Bell className="size-3.5" />}
                        {reminded ? "Reminder on" : "Remind me"}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>

          <div className="card-surface p-4">
            <p className="text-sm font-semibold">Upcoming</p>
            <ul className="mt-3 space-y-3">
              {upcoming.map((c) => (
                <li key={c.id} className="flex items-start gap-2">
                  <span className={`mt-1.5 size-2 shrink-0 rounded-full ${accentDot[c.accent] ?? "bg-primary"}`} />
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date(`${c.date}T00:00:00`);
                      setCursor({ year: d.getFullYear(), month: d.getMonth() });
                      setSelected(c.date);
                    }}
                    className="min-w-0 flex-1 text-left"
                  >
                    <p className="truncate text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.platform} · {c.day} · {c.start}
                    </p>
                  </button>
                  {reminders.includes(c.id) ? <BellRing className="mt-1 size-3.5 shrink-0 text-primary" /> : null}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add a custom event</DialogTitle>
            <DialogDescription>
              Mock interviews, revision blocks, application deadlines — anything you want on your calendar.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="text-sm font-medium" htmlFor="ev-title">
                Event title
              </label>
              <input id="ev-title" name="title" required placeholder="Mock interview with Arjun" className={field} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium" htmlFor="ev-date">
                  Date
                </label>
                <input
                  id="ev-date"
                  name="date"
                  type="date"
                  required
                  defaultValue={selected ?? toKey(year, month, 1)}
                  className={field}
                />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="ev-start">
                  Time
                </label>
                <input id="ev-start" name="start" type="time" className={field} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="ev-note">
                Note
              </label>
              <textarea id="ev-note" name="note" rows={3} placeholder="Optional details" className={field} />
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Add event
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
