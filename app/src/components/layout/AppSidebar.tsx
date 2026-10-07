import { Link, useRouterState } from "@tanstack/react-router";
import { LogOut, UserCog } from "lucide-react";
import { navSections } from "./nav-config";
import { cn } from "@/lib/utils";

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <nav className="scrollbar-thin flex-1 overflow-y-auto px-2 py-4">
        {navSections.map((section, i) => (
          <div key={section.heading ?? i} className="mb-2">
            {section.heading ? (
              <div className="flex items-center gap-3 px-2 pb-1 pt-3">
                <p className="shrink-0 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {section.heading}
                </p>
                <span className="h-px flex-1 bg-sidebar-border" />
              </div>
            ) : null}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const active = pathname === item.to;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] transition-colors",
                        active
                          ? "bg-sidebar-accent font-medium text-primary"
                          : "text-sidebar-foreground/90 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                      )}
                    >
                      <item.icon className="size-[18px] shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-sidebar-border px-2 py-3">
        <Link
          to="/settings"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] text-sidebar-foreground/90 transition-colors hover:bg-sidebar-accent/60"
        >
          <UserCog className="size-[18px]" />
          Edit Profile
        </Link>
        {/* BACKEND PLACEHOLDER: wire sign-out to the auth provider */}
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="size-[18px]" />
          Log Out
        </button>
      </div>
    </div>
  );
}
