import { Link, useRouterState } from "@tanstack/react-router";
import { LogOut, UserCog } from "lucide-react";
import { navSections } from "./nav-config";
import { cn } from "@/lib/utils";

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <Link
        to="/"
        onClick={onNavigate}
        className="flex h-16 shrink-0 items-center gap-2 px-5 text-xl font-semibold tracking-tight"
      >
        <span className="text-2xl" aria-hidden>
          🦉
        </span>
        <span>
          Cod<span className="text-primary">olio</span>
        </span>
      </Link>

      <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 pb-4">
        {navSections.map((section, i) => (
          <div key={section.heading ?? i} className="mb-3">
            {section.heading ? (
              <p className="px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {section.heading}
              </p>
            ) : null}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = pathname === item.to;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-sidebar-accent font-medium text-primary"
                          : "text-sidebar-foreground/85 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                      )}
                    >
                      <item.icon className="size-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            {section.heading ? <div className="mt-3 h-px bg-sidebar-border" /> : null}
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-sidebar-border px-3 py-3">
        <Link
          to="/settings"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/85 transition-colors hover:bg-sidebar-accent/60"
        >
          <UserCog className="size-4" />
          Edit Profile
        </Link>
        {/* BACKEND PLACEHOLDER: wire sign-out to the auth provider */}
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="size-4" />
          Log Out
        </button>
      </div>
    </div>
  );
}
