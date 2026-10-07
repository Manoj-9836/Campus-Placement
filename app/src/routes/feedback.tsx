import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/layout/AppShell";

export const Route = createFileRoute("/feedback")({
  head: () => ({
    meta: [
      { title: "Send Feedback — Lendi" },
      {
        name: "description",
        content: "Share bugs, feature requests and ideas to help shape the Lendi coding tracker.",
      },
      { property: "og:title", content: "Send Feedback — Lendi" },
      {
        property: "og:description",
        content: "Tell us what to build next — report bugs or request features.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FeedbackPage,
});

const types = ["Bug", "Feature request", "General"];

function FeedbackPage() {
  const [type, setType] = useState("Feature request");
  const [sent, setSent] = useState(false);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  return (
    <AppShell>
      <PageHeader
        title="Feedback"
        subtitle="Tell us what's broken, missing or worth building next."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <form
          className="card-surface p-5 lg:col-span-2"
          onSubmit={(e) => {
            e.preventDefault();
            // BACKEND PLACEHOLDER: submit feedback to the backend
            setSent(true);
            toast.success("Feedback saved locally");
          }}
        >
          <fieldset className="flex flex-wrap gap-2">
            <legend className="mb-2 text-sm font-medium">Type</legend>
            {types.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  type === t
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border text-muted-foreground hover:bg-accent"
                }`}
              >
                {t}
              </button>
            ))}
          </fieldset>

          <label className="mt-5 block text-sm font-medium" htmlFor="fb-title">
            Title
          </label>
          <input
            id="fb-title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short summary"
            className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
          />

          <label className="mt-4 block text-sm font-medium" htmlFor="fb-body">
            Details
          </label>
          <textarea
            id="fb-body"
            required
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={6}
            placeholder="What happened, what you expected, and steps to reproduce."
            className="mt-2 w-full resize-y rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
          />

          <button
            type="submit"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Send className="size-4" /> Send feedback
          </button>

          {sent ? (
            <p className="mt-3 text-sm text-success">
              Thanks! Your feedback is queued (frontend only for now).
            </p>
          ) : null}
        </form>

        <aside className="card-surface p-5">
          <span className="grid size-11 place-items-center rounded-lg bg-primary/15 text-primary">
            <MessageSquare className="size-5" />
          </span>
          <h2 className="mt-4 font-semibold">What helps most</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>• Screenshots or a short screen recording</li>
            <li>• The platform and question involved</li>
            <li>• Your device and browser</li>
          </ul>
        </aside>
      </div>
    </AppShell>
  );
}
