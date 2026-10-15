import { Link, useRouterState } from "@tanstack/react-router";
import { useClerk } from "@clerk/react";
import { LogOut, UserCog } from "lucide-react";
import { navSections } from "./nav-config";
import { cn } from "@/lib/utils";
import { isClerkConfigured } from "@/components/auth/auth-config";

function ClerkLogoutButton({
  onNavigate,
  collapsed = false,
}: {
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
  const { signOut } = useClerk();
  return (
    <button
      type="button"
      onClick={() => {
        void signOut();
        onNavigate?.();
      }}
      className={cn(
        "flex w-full items-center rounded-lg py-2.5 text-[15px] text-destructive transition-colors hover:bg-destructive/10",
        collapsed ? "justify-center px-2" : "gap-3 px-3",
      )}
    >
      <LogOut className="size-[18px]" />
      {!collapsed ? "Log Out" : null}
    </button>
  );
}

export function AppSidebar({
  onNavigate,
  collapsed = false,
}: {
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <nav
        className={cn(
          "scrollbar-thin flex-1 overflow-x-hidden overflow-y-auto py-4",
          collapsed ? "px-1.5" : "px-2",
        )}
      >
        {navSections.map((section, i) => (
          <div key={section.heading ?? i} className="mb-2">
            {section.heading ? (
              <div className={cn("flex items-center gap-3 pb-1 pt-3", collapsed ? "px-1" : "px-2")}>
                {collapsed ? (
                  <span className="h-px w-full bg-sidebar-border" aria-hidden />
                ) : (
                  <>
                    <p className="shrink-0 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      {section.heading}
                    </p>
                    <span className="h-px flex-1 bg-sidebar-border" />
                  </>
                )}
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
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "flex items-center rounded-lg py-2.5 text-[15px] transition-colors",
                        collapsed ? "justify-center px-2" : "gap-3 px-3",
                        active
                          ? "bg-sidebar-accent font-medium text-primary"
                          : "text-sidebar-foreground/90 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                      )}
                    >
                      <item.icon className="size-[18px] shrink-0" />
                      {!collapsed ? <span className="truncate">{item.label}</span> : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div
        className={cn(
          "shrink-0 border-t border-sidebar-border py-3",
          collapsed ? "px-1.5" : "px-2",
        )}
      >
        <Link
          to="/settings"
          onClick={onNavigate}
          title={collapsed ? "Edit Profile" : undefined}
          className={cn(
            "flex items-center rounded-lg py-2.5 text-[15px] text-sidebar-foreground/90 transition-colors hover:bg-sidebar-accent/60",
            collapsed ? "justify-center px-2" : "gap-3 px-3",
          )}
        >
          <UserCog className="size-[18px]" />
          {!collapsed ? "Edit Profile" : null}
        </Link>
        {isClerkConfigured ? (
          collapsed ? (
            <div title="Log Out">
              <ClerkLogoutButton onNavigate={onNavigate} collapsed />
            </div>
          ) : (
            <ClerkLogoutButton onNavigate={onNavigate} />
          )
        ) : null}
      </div>
    </div>
  );
}
