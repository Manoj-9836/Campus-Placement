import { Bookmark, BookmarkCheck, ListChecks, Users } from "lucide-react";
import { toast } from "sonner";
import { toggleFollow, useAppState } from "@/lib/app-store";
import type { sheets } from "@/lib/mock-data";

type Sheet = (typeof sheets)[number];

type SheetCardProps = {
  sheet: Sheet;
};

export function SheetCard({ sheet }: SheetCardProps) {
  const { followed } = useAppState();
  const isFollowing = followed.includes(sheet.id);

  return (
    <article className="card-surface flex flex-col overflow-hidden transition-colors hover:border-primary/50">
      <div className="flex items-center gap-2 px-3 pt-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface">
          <div className="h-full rounded-full bg-primary" style={{ width: `${sheet.progress}%` }} />
        </div>
        <span className="text-xs text-muted-foreground">{sheet.progress}%</span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate font-semibold">{sheet.title}</h3>
          <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
            <Users className="size-3.5" />{" "}
            {(sheet.followers + (isFollowing ? 1 : 0)).toLocaleString()}
          </span>
        </div>
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{sheet.description}</p>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ListChecks className="size-3.5" /> {sheet.questions} questions
          </span>
          {/* BACKEND PLACEHOLDER: follow / unfollow sheet */}
          <button
            type="button"
            onClick={() => {
              toggleFollow(sheet.id);
              toast[isFollowing ? "message" : "success"](
                isFollowing ? `Unfollowed ${sheet.title}` : `Following ${sheet.title}`,
              );
            }}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              isFollowing
                ? "border border-primary text-primary hover:bg-primary/10"
                : "bg-primary text-primary-foreground hover:opacity-90"
            }`}
          >
            {isFollowing ? (
              <BookmarkCheck className="size-3.5" />
            ) : (
              <Bookmark className="size-3.5" />
            )}
            {isFollowing ? "Following" : "Follow"}
          </button>
        </div>
      </div>
    </article>
  );
}
