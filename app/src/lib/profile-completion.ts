export type ProfileSectionId =
  "basic" | "academic" | "skills" | "preferences" | "projects" | "visibility";

export type ProfileCompletionData = {
  name: string;
  handle: string;
  institution: string;
  department: string;
  degree: string;
  currentYear: string;
  graduationYear: string;
  cgpa: string;
  programmingLanguages: string[];
  technicalSkills: string[];
  targetRoles: string[];
  jobSeeking: string;
  resumeUrl: string;
  projects: { title: string }[];
  visibility: "public" | "private";
  visibilityConfigured: boolean;
};

export type ProfileSectionStatus = "completed" | "in-progress" | "not-started";

export type ProfileCompletion = {
  sections: Record<ProfileSectionId, ProfileSectionStatus>;
  completedSections: number;
  totalSections: number;
  percentage: number;
};

const SECTION_IDS: ProfileSectionId[] = [
  "basic",
  "academic",
  "skills",
  "preferences",
  "projects",
  "visibility",
];

const hasText = (value: string) => value.trim().length > 0;

export function getProfileCompletion(data: ProfileCompletionData): ProfileCompletion {
  const validBasic = [
    data.name,
    data.handle,
    data.institution,
    data.department,
    data.degree,
    data.currentYear,
    data.graduationYear,
  ].every(hasText);
  const validAcademic = hasText(data.cgpa) && Number(data.cgpa) >= 0 && Number(data.cgpa) <= 10;
  const validSkills =
    data.programmingLanguages.some(hasText) && data.technicalSkills.filter(hasText).length >= 3;
  const validPreferences = data.targetRoles.some(hasText) && hasText(data.jobSeeking);
  const validProjects =
    data.projects.some((project) => hasText(project.title)) || hasText(data.resumeUrl);
  const validVisibility = data.visibilityConfigured;
  const validBySection: Record<ProfileSectionId, boolean> = {
    basic: validBasic,
    academic: validAcademic,
    skills: validSkills,
    preferences: validPreferences,
    projects: validProjects,
    visibility: validVisibility,
  };

  const sections = Object.fromEntries(
    SECTION_IDS.map((id) => [id, validBySection[id] ? "completed" : "not-started"]),
  ) as Record<ProfileSectionId, ProfileSectionStatus>;
  const completedSections = SECTION_IDS.filter((id) => validBySection[id]).length;

  return {
    sections,
    completedSections,
    totalSections: SECTION_IDS.length,
    percentage: Math.round((completedSections / SECTION_IDS.length) * 100),
  };
}
