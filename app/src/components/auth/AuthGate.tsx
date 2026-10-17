import { useAuth, useUser } from "@clerk/react";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { resetAppState } from "@/lib/app-store";
import { saveProfile, setVisibility } from "@/lib/app-store";
import { useProfileApi } from "@/lib/profile-api";
import { appConfig } from "@/config/app";

const API_URL = import.meta.env["VITE_API_URL"] ?? "http://localhost:5000/api/v1";

export function AuthGate({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const profileApi = useProfileApi();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const router = useRouter();
  const syncedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn && pathname !== "/") {
      void router.navigate({ to: "/" }).then(() => {
        window.dispatchEvent(new CustomEvent("lendi:open-auth", { detail: "sign-in" }));
      });
    }
  }, [isLoaded, isSignedIn, pathname, router]);

  // Clear profile data when user logs out
  useEffect(() => {
    if (!isLoaded || isSignedIn) return;

    resetAppState();
    localStorage.removeItem(appConfig.storageKey);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    syncedUserId.current = null;
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    if (!isSignedIn) {
      syncedUserId.current = null;
      return;
    }
    if (!isLoaded || !isSignedIn || !user || syncedUserId.current === user.id) return;

    let cancelled = false;
    void (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("Clerk did not provide a session token");

        const response = await fetch(`${API_URL}/auth/clerk-sync`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            name: user.fullName ?? user.firstName ?? "Student",
            imageUrl: user.imageUrl,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Unable to sync account (${response.status}): ${errorText}`);
        }

        const data = await response.json();

        if (data.tokens?.accessToken && data.tokens?.refreshToken) {
          localStorage.setItem("accessToken", data.tokens.accessToken);
          localStorage.setItem("refreshToken", data.tokens.refreshToken);
        }

        const profile = await profileApi.getProfile();
        saveProfile({
          avatar: profile.avatar || "",
          name: profile.fullName || "",
          handle: profile.handle || "",
          rollNumber: profile.rollNumber || "",
          location: profile.location || "",
          institution: profile.institution || "",
          about: profile.about || "",
          email: profile.email || user.primaryEmailAddress?.emailAddress || "",
          phone: profile.phone || "",
          department: profile.department || "",
          degree: profile.degree || "",
          currentYear: profile.currentYear || "",
          currentSemester: profile.currentSemester || "",
          graduationYear: profile.graduationYear || "",
          gender: profile.gender || "",
          country: profile.country || "",
          cgpa: profile.cgpa || "",
          tenth: profile.tenth || "",
          twelfth: profile.twelfth || "",
          backlogs: profile.backlogs || "",
          gap: profile.gap || "",
          preferredLanguage: profile.preferredLanguage || "",
          dsaProficiency: profile.dsaProficiency || "",
          preferredDomains: profile.preferredDomains || "",
          preferredLocations: profile.preferredLocations || "",
          workMode: profile.workMode || "",
          programmingLanguages: profile.programmingLanguages || [],
          technicalSkills: profile.technicalSkills || [],
          targetRoles: profile.targetRoles || [],
          jobSeeking: profile.jobSeeking || "",
          resumeUrl: profile.resumeUrl || "",
          portfolioUrl: profile.portfolioUrl || "",
          githubUrl: profile.githubUrl || "",
          linkedinUrl: profile.linkedinUrl || "",
          projects: profile.projects || [],
          visibilityConfigured: profile.visibilityConfigured !== false,
        });
        setVisibility(profile.visibility || "public");

        if (!cancelled) syncedUserId.current = user.id;
      } catch (error) {
        console.error("Account sync failed:", error);
      }
    })();

    return () => {
      cancelled = true;
    };
    // The API hook returns a new client object on each render; this sync is keyed
    // by the authenticated user instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getToken, isLoaded, isSignedIn, user]);

  if (!isLoaded || (pathname !== "/" && !isSignedIn)) {
    return <div className="min-h-screen bg-background" />;
  }
  return <>{children}</>;
}
