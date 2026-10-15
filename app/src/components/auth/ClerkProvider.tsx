import { ClerkProvider as Provider } from "@clerk/react";
import type { ReactNode } from "react";
import { AuthGate } from "./AuthGate";
import { isClerkConfigured } from "./auth-config";

const publishableKey = import.meta.env["VITE_CLERK_PUBLISHABLE_KEY"];

export function ClerkProvider({ children }: { children: ReactNode }) {
  if (!isClerkConfigured || !publishableKey) {
    return <>{children}</>;
  }

  return (
    <Provider publishableKey={publishableKey}>
      <AuthGate>{children}</AuthGate>
    </Provider>
  );
}
