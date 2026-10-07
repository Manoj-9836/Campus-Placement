import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bell,
  BellRing,
  CalendarDays,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  Clock,
  Search,
  SlidersHorizontal,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
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
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/contests")({
  head: () => ({
    meta: [
      { title: "Contest Calendar — Lendi" },
      {
        name: "description",
        content:
          "Explore coding contests across LeetCode, CodeChef, Codeforces, AtCoder and Unstop.",
      },
      { property: "og:title", content: "Contest Calendar — Lendi" },
      {
        property: "og:description",
        content: "One calendar for every coding contest, with reminders and custom events.",
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
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const accentClasses: Record<string, string> = {
  success: "border-success/60 bg-success/10 text-success",
  destructive: "border-destructive/60 bg-destructive/10 text-destructive",
  info: "border-info/60 bg-info/10 text-info",
  warning: "border-warning/60 bg-warning/10 text-warning",
  primary: "border-primary/60 bg-primary/10 text-primary",
};

const accentDots: Record<string, string> = {
  success: "bg-success",
  destructive: "bg-destructive",
  info: "bg-info",
  warning: "bg-warning",
  primary: "bg-primary",
};

const toKey = (year: number, month: number, day: number) =>
  String(year) + "-" + String(month + 1).padStart(2, "0") + "-" + String(day).padStart(2, "0");

type CalendarItem = {
  id: string;
  name: string;
  platform: string;
  start: string;
  end: string;
  day: string;
  date: string;
  accent: string;
  subscribers?: number;
  custom?: boolean;
  note?: string;
};

const field =
  "mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary";

function formatDate(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

function EventCard({
  item,
  reminded,
  onRemind,
  onDelete,
}: {
  item: CalendarItem;
  reminded: boolean;
  onRemind: () => void;
  onDelete?: (() => void) | undefined;
}) {
  return (
    <article className="rounded-xl border border-border bg-card/70 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium text-muted-foreground">
          {item.start}
          {!item.custom && item.end ? " – " + item.end : ""}
        </p>
        {onDelete ? (
          <button
            type="button"
            aria-label={"Delete " + item.name}
            onClick={onDelete}
            className="rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="size-3.5" />
          </button>
        ) : null}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span
          className={cn("grid size-7 place-items-center rounded-md", accentClasses[item.accent])}
        >
          <CalendarDays className="size-3.5" />
        </span>
        <h3 className="min-w-0 truncate text-sm font-semibold">{item.name}</h3>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="flex min-w-0 items-center gap-1.5 truncate">
          <Users className="size-3.5 shrink-0" />
          {item.subscribers ? item.subscribers + " users subscribed" : item.platform}
        </span>
        <button
          type="button"
          onClick={onRemind}
          className="shrink-0 font-medium text-primary hover:underline"
        >
          {reminded ? "Subscribed" : "Subscribe"}
        </button>
      </div>
    </article>
  );
}

function ContestsPage() {
  const [platform, setPlatform] = useState("All");
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [cursor, setCursor] = useState({ year: 2026, month: 8 });
  const [selected, setSelected] = useState("2026-09-05");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { events, reminders } = useAppState();

  const all = useMemo<CalendarItem[]>(
    () => [
      ...contests,
      ...events.map((event) => ({
        id: event.id,
        name: event.title,
        platform: "My Events",
        start: event.start,
        end: "",
        day: formatDate(event.date),
        date: event.date,
        accent: "primary",
        custom: true,
        note: event.note,
      })),
    ],
    [events],
  );

  const list = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return all.filter((item) => {
      const matchesPlatform = platform === "All" || item.platform === platform;
      const matchesQuery =
        !normalizedQuery ||
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.platform.toLowerCase().includes(normalizedQuery);
      return matchesPlatform && matchesQuery;
    });
  }, [all, platform, query]);

  const byDate = useMemo(() => {
    const map = new Map<string, CalendarItem[]>();
    for (const item of list) {
      const items = map.get(item.date) ?? [];
      items.push(item);
      map.set(item.date, items);
    }
    return map;
  }, [list]);

  const { year, month } = cursor;
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<number | null> = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const shift = (delta: number) => {
    const date = new Date(year, month + delta, 1);
    setCursor({ year: date.getFullYear(), month: date.getMonth() });
  };

  const monthPrefix = String(year) + "-" + String(month + 1).padStart(2, "0");
  const monthCount = list.filter((item) => item.date.startsWith(monthPrefix)).length;
  const selectedItems = byDate.get(selected) ?? [];
  const upcoming = useMemo(
    () => [...list].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 7),
    [list],
  );
  const todayItems = upcoming.slice(0, 1);
  const upcomingGroups = upcoming.slice(1).reduce<Map<string, CalendarItem[]>>((groups, item) => {
    const group = groups.get(item.date) ?? [];
    group.push(item);
    groups.set(item.date, group);
    return groups;
  }, new Map());

  const handleReminder = (item: CalendarItem) => {
    const enabled = reminders.includes(item.id);
    toggleReminder(item.id);
    toast[enabled ? "message" : "success"](
      enabled ? "Subscription removed for " + item.name : "Subscribed to " + item.name,
    );
  };

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    const date = String(form.get("date") ?? "");
    const start = String(form.get("start") ?? "");
    if (!title || !date) return;
    addEvent({
      title,
      date,
      start: start || "All day",
      note: String(form.get("note") ?? "").trim(),
    });
    const createdDate = new Date(date + "T00:00:00");
    setCursor({ year: createdDate.getFullYear(), month: createdDate.getMonth() });
    setSelected(date);
    setDialogOpen(false);
    toast.success(title + " added to your calendar");
  };

  return (
    <AppShell hideHeader fullWidth wideSidebar>
      <div className="min-h-screen bg-background">
        <div className="grid min-h-screen xl:grid-cols-[31rem_minmax(0,1fr)]">
          <section className="border-b border-border px-5 py-7 sm:px-8 xl:border-b-0 xl:border-r">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  Event tracker
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                  Contest Calendar
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Explore coding contests and never miss it.
                </p>
              </div>
              <button
                type="button"
                aria-label="Add custom event"
                onClick={() => setDialogOpen(true)}
                className="mt-1 rounded-lg border border-border p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <CalendarPlus className="size-4" />
              </button>
            </div>

            <div className="mt-8 flex gap-3">
              <label className="relative min-w-0 flex-1">
                <span className="sr-only">Search contest</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search contest"
                  className="h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
                />
              </label>
              <button
                type="button"
                onClick={() => setFiltersOpen((open) => !open)}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-medium",
                  filtersOpen
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <SlidersHorizontal className="size-4" /> Filters
              </button>
            </div>

            {filtersOpen ? (
              <div className="mt-3 flex flex-wrap gap-2 border-b border-border pb-4">
                {platforms.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setPlatform(name)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium",
                      platform === name
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-accent",
                    )}
                  >
                    {name}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="mt-8 space-y-8">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Today</h2>
                  <span className="text-xs text-muted-foreground">{todayItems.length} event</span>
                </div>
                <div className="space-y-3">
                  {todayItems.length ? (
                    todayItems.map((item) => (
                      <EventCard
                        key={item.id}
                        item={item}
                        reminded={reminders.includes(item.id)}
                        onRemind={() => handleReminder(item)}
                        onDelete={
                          item.custom
                            ? () => {
                                deleteEvent(item.id);
                                toast.message(item.name + " removed");
                              }
                            : undefined
                        }
                      />
                    ))
                  ) : (
                    <p className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">
                      No contests match your search.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-lg font-semibold">Upcoming</h2>
                <div className="space-y-6">
                  {[...upcomingGroups.entries()].map(([date, items]) => (
                    <div key={date}>
                      <p className="mb-3 text-sm font-semibold">{formatDate(date)}</p>
                      <div className="space-y-3">
                        {items.map((item) => (
                          <EventCard
                            key={item.id}
                            item={item}
                            reminded={reminders.includes(item.id)}
                            onRemind={() => handleReminder(item)}
                            onDelete={
                              item.custom
                                ? () => {
                                    deleteEvent(item.id);
                                    toast.message(item.name + " removed");
                                  }
                                : undefined
                            }
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="min-w-0 px-4 py-5 sm:px-7 sm:py-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold sm:text-3xl">
                  {monthNames[month]} {year}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {monthCount} contests this month
                </p>
              </div>
              <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
                <button
                  type="button"
                  onClick={() => setCursor({ year: 2026, month: 8 })}
                  className="rounded-md px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  Today
                </button>
                <button
                  type="button"
                  aria-label="Previous month"
                  onClick={() => shift(-1)}
                  className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next month"
                  onClick={() => shift(1)}
                  className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <ChevronRight className="size-4" />
                </button>
                <span className="ml-1 hidden rounded-md bg-primary/10 px-3 py-2 text-xs font-semibold text-primary sm:block">
                  Month
                </span>
                <span className="hidden px-2 text-xs text-muted-foreground sm:block">Week</span>
                <span className="hidden px-2 text-xs text-muted-foreground sm:block">Day</span>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card/40">
              <div className="grid grid-cols-7 border-b border-border">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="border-r border-border px-2 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground last:border-r-0 sm:text-xs"
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {cells.map((day, index) => {
                  if (day === null) {
                    return (
                      <div
                        key={"empty-" + index}
                        className="min-h-28 border-b border-r border-border bg-background/30 sm:min-h-36"
                      />
                    );
                  }

                  const key = toKey(year, month, day);
                  const dayItems = byDate.get(key) ?? [];
                  const isSelected = selected === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelected(key)}
                      className={cn(
                        "group min-h-28 min-w-0 border-b border-r border-border p-2 text-left align-top transition-colors last:border-r-0 hover:bg-accent/50 sm:min-h-36 sm:p-3",
                        isSelected && "bg-primary/5 ring-1 ring-inset ring-primary/70",
                      )}
                    >
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          isSelected ? "text-primary" : "text-muted-foreground",
                        )}
                      >
                        {day}
                      </span>
                      <span className="mt-2 flex flex-col gap-1">
                        {dayItems.slice(0, 3).map((item) => (
                          <span
                            key={item.id}
                            className={cn(
                              "block truncate rounded-md border px-1.5 py-1 text-[10px] font-semibold sm:text-[11px]",
                              accentClasses[item.accent] ?? accentClasses["primary"],
                            )}
                            title={item.name}
                          >
                            <span className="hidden sm:inline">{item.name}</span>
                            <span className="sm:hidden">{item.name.slice(0, 8)}</span>
                          </span>
                        ))}
                        {dayItems.length > 3 ? (
                          <span className="px-1 text-[10px] text-muted-foreground">
                            +{dayItems.length - 3} more
                          </span>
                        ) : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-border bg-card/40 p-4 sm:hidden">
              <p className="text-sm font-semibold">{formatDate(selected)}</p>
              <div className="mt-3 space-y-2">
                {selectedItems.length ? (
                  selectedItems.map((item) => (
                    <p
                      key={item.id}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <span
                        className={cn(
                          "size-2 rounded-full",
                          accentDots[item.accent] ?? "bg-primary",
                        )}
                      />
                      {item.name}
                    </p>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">No contests selected.</p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add a custom event</DialogTitle>
            <DialogDescription>
              Add interviews, revision blocks or application deadlines to your calendar.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="text-sm font-medium" htmlFor="ev-title">
                Event title
              </label>
              <input id="ev-title" name="title" required className={field} />
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
                  defaultValue={selected}
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
              <textarea id="ev-note" name="note" rows={3} className={field} />
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
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
