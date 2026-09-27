import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, LifeBuoy } from "lucide-react";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { faqs } from "@/lib/mock-data";

export const Route = createFileRoute("/help-center")({
  head: () => ({
    meta: [
      { title: "Help Center — Codolio" },
      {
        name: "description",
        content: "Answers about C Score, connecting coding platforms, profile visibility and how stats refresh.",
      },
      { property: "og:title", content: "Help Center — Codolio" },
      {
        property: "og:description",
        content: "Frequently asked questions about tracking your coding journey on Codolio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HelpCenterPage,
});

function HelpCenterPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <AppShell>
      <PageHeader title="Help Center" subtitle="Quick answers to the questions we get most often." />

      <div className="card-surface flex items-center gap-4 p-5">
        <span className="grid size-11 place-items-center rounded-lg bg-primary/15 text-primary">
          <LifeBuoy className="size-5" />
        </span>
        <p className="text-sm text-muted-foreground">
          Can't find what you need? Send us a note from the Feedback page and we'll get back to you.
        </p>
      </div>

      <ul className="mt-5 space-y-3">
        {faqs.map((f, i) => (
          <li key={f.q} className="card-surface overflow-hidden">
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-medium transition-colors hover:bg-surface-hover"
            >
              {f.q}
              <ChevronDown
                className={`size-4 shrink-0 text-primary transition-transform ${open === i ? "rotate-180" : ""}`}
              />
            </button>
            {open === i ? <p className="px-5 pb-4 text-sm text-muted-foreground">{f.a}</p> : null}
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
