import { useAuth } from "@clerk/react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export interface Profile {
  clerkId: string;
  email: string;
  fullName?: string;
  rollNumber?: string;
  avatar?: string;
  phone?: string;
  location?: string;
  institution?: string;
  department?: string;
  degree?: string;
  currentYear?: string;
  currentSemester?: string;
  graduationYear?: string;
  country?: string;
  about?: string;
  cgpa?: string;
  programmingLanguages?: string[];
  technicalSkills?: string[];
  targetRoles?: string[];
  jobSeeking?: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  projects?: Array<{
    id: string;
    title: string;
    description: string;
    technologies: string;
  }>;
  visibility?: "public" | "private";
  visibilityConfigured?: boolean;
}

class ProfileApiClient {
  private baseUrl = API_BASE_URL;

  async getProfile(token: string): Promise<Profile> {
    const response = await fetch(`${this.baseUrl}/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to fetch profile");
    }

    const data = await response.json();
    return data.profile;
  }

  async saveProfile(token: string, profile: Partial<Profile>): Promise<Profile> {
    const response = await fetch(`${this.baseUrl}/profile`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to save profile");
    }

    const data = await response.json();
    return data.profile;
  }

  async deleteAvatar(token: string): Promise<Profile> {
    const response = await fetch(`${this.baseUrl}/profile/avatar`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to delete avatar");
    }

    const data = await response.json();
    return data.profile;
  }
}

const profileApi = new ProfileApiClient();

// Hook to use profile API with Clerk auth
export function useProfileApi() {
  const { getToken } = useAuth();

  return {
    async getProfile(): Promise<Profile> {
      const token = await getToken();
      if (!token) throw new Error("No authentication token available");
      return profileApi.getProfile(token);
    },

    async saveProfile(profile: Partial<Profile>): Promise<Profile> {
      const token = await getToken();
      if (!token) throw new Error("No authentication token available");
      return profileApi.saveProfile(token, profile);
    },

    async deleteAvatar(): Promise<Profile> {
      const token = await getToken();
      if (!token) throw new Error("No authentication token available");
      return profileApi.deleteAvatar(token);
    },
  };
}
