import { SignIn, SignUp, useAuth } from "@clerk/react";
import { X } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

type Mode = "sign-in" | "sign-up";

type AuthModalProps = {
  open: boolean;
  initialMode?: Mode;
  onClose: () => void;
};

const MODES: { id: Mode; label: string }[] = [
  { id: "sign-in", label: "Sign in" },
  { id: "sign-up", label: "Create account" },
];

/* -------------------------------------------------------------------------- */
/*  Theme palettes                                                            */
/* -------------------------------------------------------------------------- */

type Palette = {
  primary: string;
  primaryHover: string;
  onPrimary: string;
  card: string;
  text: string;
  textSoft: string;
  muted: string;
  placeholder: string;
  border: string;
  borderHover: string;
  surface: string;
  surfaceHover: string;
  field: string;
  ring: string;
  danger: string;
  warning: string;
  success: string;
  badgeText: string;
  badgeBg: string;
  badgeBorder: string;
  neutral: string;
};

const DARK: Palette = {
  primary: "#f9901f",
  primaryHover: "#fa9f3d",
  onPrimary: "#1c1208",
  card: "#17171c",
  text: "#fafafa",
  textSoft: "#d4d4d8",
  muted: "#a1a1aa",
  placeholder: "#71717a",
  border: "rgba(255,255,255,0.1)",
  borderHover: "rgba(255,255,255,0.22)",
  surface: "rgba(255,255,255,0.03)",
  surfaceHover: "rgba(255,255,255,0.07)",
  field: "#1b1b21",
  ring: "rgba(249,144,31,0.22)",
  danger: "#f87171",
  warning: "#fbbf24",
  success: "#4ade80",
  badgeText: "#f9901f",
  badgeBg: "rgba(249,144,31,0.14)",
  badgeBorder: "rgba(249,144,31,0.35)",
  neutral: "#ffffff", // tells Clerk this is a dark surface
};

const LIGHT: Palette = {
  primary: "#f9901f",
  primaryHover: "#ec8412",
  onPrimary: "#1c1208",
  card: "#ffffff",
  text: "#18181b",
  textSoft: "#3f3f46",
  muted: "#71717a",
  placeholder: "#a1a1aa",
  border: "rgba(0,0,0,0.12)",
  borderHover: "rgba(0,0,0,0.26)",
  surface: "rgba(0,0,0,0.015)",
  surfaceHover: "rgba(0,0,0,0.05)",
  field: "#ffffff",
  ring: "rgba(249,144,31,0.28)",
  danger: "#dc2626",
  warning: "#b45309",
  success: "#15803d",
  badgeText: "#b45309",
  badgeBg: "rgba(249,144,31,0.12)",
  badgeBorder: "rgba(249,144,31,0.5)",
  neutral: "#000000",
};

/* -------------------------------------------------------------------------- */
/*  Theme detection                                                           */
/*  Reads the real background colour of the modal panel, so it follows        */
/*  whatever theme system the app uses (class, data-attribute or OS).         */
/* -------------------------------------------------------------------------- */

function readThemeHint(): boolean {
  if (typeof document === "undefined") return true;
  const root = document.documentElement;
  if (root.classList.contains("dark")) return true;
  if (root.classList.contains("light")) return false;
  const attr = root.getAttribute("data-theme");
  if (attr) return attr === "dark";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? true;
}

// Converts any CSS colour (rgb, hsl, oklch, ...) to perceived brightness 0..1
function brightnessOf(color: string): number | null {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const [r = 0, g = 0, b = 0, a = 0] = ctx.getImageData(0, 0, 1, 1).data;
    if (a === 0) return null;
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  } catch {
    return null;
  }
}

function detectDark(el: Element | null): boolean {
  if (el) {
    const brightness = brightnessOf(getComputedStyle(el).backgroundColor);
    if (brightness !== null) return brightness < 0.5;
  }
  return readThemeHint();
}

/* -------------------------------------------------------------------------- */
/*  Clerk appearance                                                          */
/*  Clerk injects its CSS after Tailwind, so Tailwind classes passed through  */
/*  `elements` lose. Style objects are applied by Clerk itself and win.       */
/* -------------------------------------------------------------------------- */

function buildAppearance(p: Palette, isDark: boolean) {
  const iconFilter = isDark ? "invert(1)" : "none";

  return {
    variables: {
      colorPrimary: p.primary,
      colorBackground: p.card,
      colorInputBackground: p.field,
      colorInputText: p.text,
      colorText: p.text,
      colorTextSecondary: p.muted,
      colorTextOnPrimaryBackground: p.onPrimary,
      colorNeutral: p.neutral,
      colorDanger: p.danger,
      colorWarning: p.warning,
      colorSuccess: p.success,
      borderRadius: "0.75rem",
      fontSize: "0.9375rem",
    },
    elements: {
      rootBox: { width: "100%", overflow: "visible" },
      // Clerk clips its card with overflow:hidden, which shaves off 1px
      // borders, focus rings and badges. Pad the card and pull the wrapper
      // back out so nothing touches the clip edge.
      cardBox: {
        width: "calc(100% + 1rem)",
        maxWidth: "none",
        margin: "-0.5rem",
        overflow: "visible",
        background: "transparent",
        border: "none",
        boxShadow: "none",
      },
      card: {
        width: "100%",
        overflow: "visible",
        background: "transparent",
        border: "none",
        boxShadow: "none",
        padding: "0.5rem",
        gap: "1.5rem",
      },
      main: { gap: "1.25rem", overflow: "visible" },
      form: { overflow: "visible" },

      header: {
        textAlign: "left",
        gap: "0.5rem",
        marginBottom: "0.25rem",
        overflow: "visible",
      },
      headerTitle: {
        overflow: "visible",
        paddingLeft: "0.0625rem",
        fontSize: "clamp(1.25rem, 5.5vw, 1.5rem)",
        fontWeight: 600,
        letterSpacing: "-0.02em",
        lineHeight: 1.2,
        color: p.text,
      },
      headerSubtitle: { fontSize: "0.9rem", color: p.muted, overflowWrap: "anywhere" },
      formHeaderTitle: { color: p.text },
      formHeaderSubtitle: { color: p.muted },

      socialButtons: { gap: "0.625rem", overflow: "visible" },
      socialButtonsBlockButton: {
        height: "2.75rem",
        borderRadius: "0.75rem",
        border: `1px solid ${p.border}`,
        background: p.surface,
        boxShadow: "none",
        color: p.text,
        transition: "background 150ms, border-color 150ms",
        "&:hover": { background: p.surfaceHover, borderColor: p.borderHover },
      },
      socialButtonsBlockButtonText: { fontWeight: 500, color: p.text },
      // Brand logos that are black by default vanish on dark surfaces
      providerIcon__github: { filter: iconFilter },
      providerIcon__apple: { filter: iconFilter },
      providerIcon__x: { filter: iconFilter },
      lastAuthenticationStrategyBadge: {
        background: p.badgeBg,
        color: p.badgeText,
        border: `1px solid ${p.badgeBorder}`,
        borderRadius: "999px",
        fontSize: "0.6875rem",
        fontWeight: 500,
        padding: "1px 8px",
        zIndex: 2,
      },
      dividerLine: { background: p.border },
      dividerText: { color: p.muted, fontSize: "0.8rem" },

      formFieldLabel: { color: p.textSoft, fontSize: "0.8125rem", fontWeight: 500 },
      formFieldInput: {
        height: "2.75rem",
        fontSize: "1rem", // 16px stops iOS from zooming on focus
        borderRadius: "0.75rem",
        border: `1px solid ${p.border}`,
        background: p.field,
        color: p.text,
        boxShadow: "none",
        padding: "0 0.875rem",
        "&::placeholder": { color: p.placeholder },
        "&:hover": { borderColor: p.borderHover },
        "&:focus": {
          borderColor: p.primary,
          boxShadow: `0 0 0 3px ${p.ring}`,
        },
      },
      formFieldAction: { color: p.badgeText, fontSize: "0.8125rem", fontWeight: 500 },
      formFieldInputShowPasswordButton: { color: p.muted },
      formResendCodeLink: { color: p.badgeText },
      backLink: { color: p.muted },

      // Messages shown under fields (hints, errors, warnings, successes)
      formFieldHintText: { color: p.muted, fontSize: "0.8125rem" },
      formFieldInfoText: { color: p.muted, fontSize: "0.8125rem" },
      formFieldWarningText: { color: p.warning, fontSize: "0.8125rem" },
      formFieldErrorText: { color: p.danger, fontSize: "0.8125rem" },
      formFieldSuccessText: { color: p.success, fontSize: "0.8125rem" },
      alertText: { color: p.text },
      alert: { borderRadius: "0.75rem" },

      formButtonPrimary: {
        height: "2.75rem",
        borderRadius: "0.75rem",
        background: p.primary,
        backgroundImage: "none",
        color: p.onPrimary,
        fontWeight: 600,
        boxShadow: "0 8px 24px -8px rgba(249,144,31,0.55)",
        transition: "transform 120ms, background 150ms, box-shadow 150ms",
        "&:hover": {
          background: p.primaryHover,
          boxShadow: "0 10px 28px -8px rgba(249,144,31,0.7)",
        },
        "&:active": { transform: "scale(0.985)" },
        // Clerk paints a glossy gradient on a pseudo-element; remove it
        "&::before, &::after": { display: "none" },
      },
      otpCodeFieldInput: {
        height: "3rem",
        fontSize: "1.125rem",
        borderRadius: "0.75rem",
        border: `1px solid ${p.border}`,
        background: p.field,
        color: p.text,
      },
      identityPreview: {
        borderRadius: "0.75rem",
        border: `1px solid ${p.border}`,
        background: p.surface,
      },
      identityPreviewText: { color: p.text },
      identityPreviewEditButton: { color: p.badgeText },

      // Switching modes is handled by the toggle above the form,
      // so Clerk's "Don't have an account?" row is hidden.
      footerAction: { display: "none" },
      footer: { background: "transparent", color: p.muted, opacity: 0.9 },
      footerPages: { background: "transparent" },
    },
  } as const;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function AuthModal({ open, initialMode = "sign-in", onClose }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [isDark, setIsDark] = useState<boolean>(readThemeHint);
  const panelRef = useRef<HTMLDivElement>(null);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (open) setMode(initialMode);
  }, [initialMode, open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  useEffect(() => {
    if (isSignedIn) onClose();
  }, [isSignedIn, onClose]);

  // Follow the app's theme live (toggle clicks, OS changes)
  useLayoutEffect(() => {
    if (!open) return;
    const update = () => setIsDark(detectDark(panelRef.current));
    update();

    const observer = new MutationObserver(update);
    const options = {
      attributes: true,
      attributeFilter: ["class", "data-theme", "style"],
    };
    observer.observe(document.documentElement, options);
    observer.observe(document.body, options);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", update);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
    };
  }, [open]);

  const appearance = useMemo(() => buildAppearance(isDark ? DARK : LIGHT, isDark), [isDark]);

  if (!open) return null;

  const activeIndex = MODES.findIndex((m) => m.id === mode);

  return (
    <div
      className="fixed inset-0 z-50 flex h-[100dvh] items-start justify-center overflow-y-auto overscroll-contain bg-black/75 px-2.5 py-[max(0.625rem,env(safe-area-inset-top))] pb-[max(0.625rem,env(safe-area-inset-bottom))] backdrop-blur-sm animate-in fade-in duration-200 motion-reduce:animate-none sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={mode === "sign-in" ? "Sign in" : "Create account"}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative my-auto w-full min-w-0 max-w-[440px] animate-in zoom-in-95 slide-in-from-bottom-2 duration-300 motion-reduce:animate-none">
        {/* Soft glow behind the panel */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 left-1/2 h-40 w-[80%] -translate-x-1/2 rounded-full bg-primary/25 blur-3xl"
        />

        <div
          ref={panelRef}
          className="relative overflow-hidden rounded-[1.5rem] border border-border bg-card text-foreground shadow-[0_30px_100px_-20px_rgba(0,0,0,0.55)] sm:rounded-3xl"
        >
          {/* Accent hairline along the top edge */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent"
          />

          {/* Top bar: mode switch + close */}
          <div className="flex items-center justify-between gap-2 px-4 pt-4 sm:gap-3 sm:px-8 sm:pt-7">
            <div
              role="tablist"
              aria-label="Authentication mode"
              className="relative grid min-w-0 max-w-[17rem] flex-1 grid-cols-2 rounded-full border border-border bg-foreground/[0.04] p-1 sm:max-w-none sm:flex-none"
            >
              <span
                aria-hidden
                className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-foreground/10 shadow-sm transition-transform duration-300 ease-out motion-reduce:transition-none"
                style={{ transform: `translateX(${activeIndex * 100}%)` }}
              />
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  role="tab"
                  aria-selected={mode === m.id}
                  onClick={() => setMode(m.id)}
                  className={`relative z-10 min-w-0 truncate whitespace-nowrap rounded-full px-2.5 py-2 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/40 sm:px-4 sm:py-1.5 ${
                    mode === m.id
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close authentication form"
              className="shrink-0 rounded-full p-2.5 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 sm:p-2"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Form */}
          <div className="px-4 pb-5 pt-5 sm:px-8 sm:pb-8 sm:pt-7">
            {mode === "sign-in" ? (
              <SignIn routing="hash" appearance={appearance} />
            ) : (
              <SignUp routing="hash" appearance={appearance} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
