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
  preferredLanguage?: string;
  dsaProficiency?: string;
  preferredDomains?: string;
  preferredLocations?: string;
  workMode?: string;
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

const hasText = (value: string | undefined) => Boolean(value?.trim());

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

  // Skills: require every visible skills field to be completed.
  const validSkills =
    data.programmingLanguages.filter(hasText).length > 0 &&
    data.technicalSkills.filter(hasText).length > 0 &&
    hasText(data.preferredLanguage) &&
    hasText(data.dsaProficiency);

  // Preferences: must have target roles, job seeking, and all preference fields filled
  const validPreferences =
    data.targetRoles.filter(hasText).length > 0 &&
    hasText(data.jobSeeking) &&
    hasText(data.preferredLanguage) &&
    hasText(data.dsaProficiency) &&
    hasText(data.preferredDomains) &&
    hasText(data.preferredLocations) &&
    hasText(data.workMode);

  const validProjects =
    data.projects.some((project) => hasText(project.title)) || hasText(data.resumeUrl);

  // Public visibility is the default; private visibility can be selected later.
  const validVisibility = true;

  const validBySection: Record<ProfileSectionId, boolean> = {
    basic: validBasic,
    academic: validAcademic,
    skills: validSkills,
    preferences: validPreferences,
    projects: validProjects,
    visibility: validVisibility,
  };

  const sections = Object.fromEntries(
    SECTION_IDS.map((id) => [id, validBySection[id] ? "completed" : "in-progress"]),
  ) as Record<ProfileSectionId, ProfileSectionStatus>;
  const completedSections = SECTION_IDS.filter((id) => validBySection[id]).length;

  return {
    sections,
    completedSections,
    totalSections: SECTION_IDS.length,
    percentage: Math.round((completedSections / SECTION_IDS.length) * 100),
  };
}
