const { z } = require("zod");

const saveProfileSchema = z.object({
  fullName: z.string().trim().max(100).optional(),
  rollNumber: z.string().trim().min(3, "Roll number must be at least 3 characters").optional(),
  phone: z.string().trim().optional(),
  location: z.string().trim().optional(),
  institution: z.string().trim().optional(),
  department: z.string().trim().optional(),
  degree: z.string().trim().optional(),
  currentYear: z.string().trim().optional(),
  currentSemester: z.string().trim().optional(),
  graduationYear: z.string().trim().optional(),
  country: z.string().trim().optional(),
  about: z.string().trim().max(500).optional(),
  cgpa: z.string().trim().optional(),
  tenth: z.string().trim().optional(),
  twelfth: z.string().trim().optional(),
  backlogs: z.string().trim().optional(),
  gap: z.string().trim().optional(),
  handle: z.string().trim().optional(),
  preferredLanguage: z.string().trim().optional(),
  dsaProficiency: z.string().trim().optional(),
  preferredDomains: z.string().trim().optional(),
  preferredLocations: z.string().trim().optional(),
  workMode: z.string().trim().optional(),
  programmingLanguages: z.array(z.string()).optional(),
  technicalSkills: z.array(z.string()).optional(),
  targetRoles: z.array(z.string()).optional(),
  jobSeeking: z.string().trim().optional(),
  resumeUrl: z.string().trim().optional(),
  portfolioUrl: z.string().trim().optional(),
  githubUrl: z.string().trim().optional(),
  linkedinUrl: z.string().trim().optional(),
  projects: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        technologies: z.string(),
      })
    )
    .optional(),
  visibility: z.enum(["public", "private"]).optional(),
  visibilityConfigured: z.boolean().optional(),
  avatar: z.string().optional(), // Base64 string
});

function validate(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const error = new Error("Validation failed");
    error.statusCode = 400;
    error.code = "VALIDATION_ERROR";
    error.details = result.error.flatten().fieldErrors;
    throw error;
  }
  return result.data;
}

module.exports = { saveProfileSchema, validate };
