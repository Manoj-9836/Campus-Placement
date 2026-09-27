import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, Flame, Moon, PanelLeft, Sun, ChevronRight } from "lucide-react";
import { AppSidebar } from "./AppSidebar";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { currentUser } from "@/lib/mock-data";

function useThemeToggle() {
  const [dark, setDark] = useState(true);
  const toggle = () => {
    setDark((d) => {
      const next = !d;
      document.documentElement.classList.toggle("light", !next);
      return next;
    });
  };
  return { dark, toggle };
}

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { dark, toggle } = useThemeToggle();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      {!collapsed && (
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border lg:block">
          <AppSidebar />
        </aside>
      )}

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 border-sidebar-border bg-sidebar p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <AppSidebar onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className={`flex min-w-0 flex-1 flex-col ${collapsed ? "" : "lg:pl-64"}`}>
        <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-border bg-card/95 px-3 backdrop-blur sm:px-5">
          <button
            type="button"
            aria-label="Toggle navigation"
            onClick={() => (window.innerWidth < 1024 ? setMobileOpen(true) : setCollapsed((c) => !c))}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <PanelLeft className="size-5" />
          </button>

          <span className="text-base font-semibold lg:hidden">
            Cod<span className="text-primary">olio</span>
          </span>

          <div className="ml-auto flex items-center gap-1 sm:gap-3">
            <Link
              to="/company-wise-kit"
              className="hidden items-center gap-2 rounded-lg border border-primary bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-primary/10 sm:flex"
            >
              Company Wise Kit <span aria-hidden>✳</span>
              <ChevronRight className="size-4 text-primary" />
            </Link>

            <span className="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-muted-foreground">
              <Flame className="size-4 text-primary" />
              {currentUser.streak}
            </span>

            {/* BACKEND PLACEHOLDER: notifications feed */}
            <button
              type="button"
              aria-label="Notifications"
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Bell className="size-5" />
            </button>

            <button
              type="button"
              aria-label="Toggle theme"
              onClick={toggle}
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {dark ? <Moon className="size-5" /> : <Sun className="size-5" />}
            </button>

            <Link
              to="/settings"
              aria-label="Profile settings"
              className="size-9 shrink-0 rounded-full bg-gradient-to-br from-primary to-primary-glow"
            />
          </div>
        </header>

        <main className="min-w-0 flex-1 px-3 py-5 sm:px-5 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
