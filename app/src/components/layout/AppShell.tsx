import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, Flame, Moon, PanelLeft, Sun, ChevronRight } from "lucide-react";
import { useUser } from "@clerk/react";
import { toast } from "sonner";
import { AppSidebar } from "./AppSidebar";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { currentUser } from "@/lib/mock-data";
import { appConfig } from "@/config/app";
import { cn } from "@/lib/utils";
import { isClerkConfigured } from "@/components/auth/auth-config";
import { useAppState } from "@/lib/app-store";

function ProfileAvatar() {
  const { user } = useUser();
  const { profile } = useAppState();

  // Force re-render when user changes to refresh avatar
  const avatarKey = user?.id || "no-user";

  if (profile.avatar) {
    return (
      <img
        key={`avatar-${avatarKey}`}
        src={profile.avatar}
        alt="Profile"
        className="size-full object-cover"
      />
    );
  }
  return user?.imageUrl ? (
    <img
      key={`avatar-${avatarKey}`}
      src={user.imageUrl}
      alt={user.fullName ?? "Profile"}
      className="size-full object-cover"
    />
  ) : null;
}

function useThemeToggle() {
  const [dark, setDark] = useState(true);
  const [themeReady, setThemeReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("lendi.theme");
    setDark(saved ? saved !== "light" : true);
    setThemeReady(true);
  }, []);

  useEffect(() => {
    if (!themeReady) return;
    document.documentElement.classList.toggle("light", !dark);
    window.localStorage.setItem("lendi.theme", dark ? "dark" : "light");
  }, [dark, themeReady]);

  const toggle = () => setDark((current) => !current);
  return { dark, toggle };
}

export function AppShell({
  children,
  hideHeader = false,
  fullWidth = false,
  wideSidebar = false,
}: {
  children: ReactNode;
  hideHeader?: boolean;
  fullWidth?: boolean;
  wideSidebar?: boolean;
}) {
  const { user } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { dark, toggle } = useThemeToggle();
  const { profile } = useAppState();
  const email = profile.email || user?.primaryEmailAddress?.emailAddress || "Account email";

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden border-r border-sidebar-border lg:block",
          collapsed ? "w-16" : wideSidebar ? "w-80" : "w-64",
        )}
      >
        <AppSidebar collapsed={collapsed} />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 border-sidebar-border bg-sidebar p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <AppSidebar onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col",
          collapsed ? "lg:pl-16" : wideSidebar ? "lg:pl-80" : "lg:pl-64",
        )}
      >
        <header
          className={cn(
            "sticky top-0 z-20 flex min-w-0 h-16 items-center gap-1.5 border-b border-border bg-card/95 px-2.5 backdrop-blur sm:gap-2 sm:px-5",
            hideHeader && "lg:hidden",
          )}
        >
          <button
            type="button"
            aria-label="Toggle navigation"
            onClick={() =>
              window.innerWidth < 1024 ? setMobileOpen(true) : setCollapsed((c) => !c)
            }
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <PanelLeft className="size-5" />
          </button>

          <span className="min-w-0 truncate text-base font-semibold lg:hidden">
            {appConfig.name}
          </span>

          <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-3">
            <Link
              to="/company-wise-kit"
              className="hidden items-center gap-2 rounded-lg border border-primary bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-primary/10 sm:flex"
            >
              Company Wise Kit <span aria-hidden>✳</span>
              <ChevronRight className="size-4 text-primary" />
            </Link>

            <span className="hidden items-center gap-1 rounded-md px-2 py-1 text-sm text-muted-foreground sm:flex">
              <Flame className="size-4 text-primary" />
              {currentUser.streak}
            </span>

            <button
              type="button"
              aria-label="Notifications"
              onClick={() => toast.message("Notifications will appear here when enabled.")}
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:p-2"
            >
              <Bell className="size-5" />
            </button>

            <button
              type="button"
              aria-label="Toggle theme"
              onClick={toggle}
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:p-2"
            >
              {dark ? <Moon className="size-5" /> : <Sun className="size-5" />}
            </button>

            <Link
              to="/settings"
              aria-label="Profile settings"
              title={email}
              className="size-8 shrink-0 overflow-hidden rounded-full bg-linear-to-br from-primary to-primary-glow sm:size-9"
            >
              {isClerkConfigured ? <ProfileAvatar /> : null}
            </Link>
          </div>
        </header>

        <main
          className={cn("min-w-0 flex-1 px-2.5 py-4 sm:px-5 sm:py-5 lg:px-8", fullWidth && "p-0!")}
        >
          {children}
        </main>
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
    <div className="mb-6 flex min-w-0 flex-wrap items-start justify-between gap-3 sm:items-end">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
