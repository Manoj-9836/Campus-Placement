import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Camera,
  Check,
  ChevronDown,
  Code2,
  Eye,
  FileText,
  FolderGit2,
  GraduationCap,
  Link2,
  Lock,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { saveProfile, setVisibility, useAppState, type AppState } from "@/lib/app-store";
import {
  getProfileCompletion,
  type ProfileCompletionData,
  type ProfileSectionId,
} from "@/lib/profile-completion";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Edit Profile — Lendi" },
      { name: "description", content: "Complete your student placement profile step by step." },
    ],
  }),
  component: SettingsPage,
});

type Section = {
  id: ProfileSectionId;
  title: string;
  description: string;
  icon: typeof UserRound;
};

const sections: Section[] = [
  {
    id: "basic",
    title: "Basic Information",
    description: "Personal and institutional details.",
    icon: UserRound,
  },
  {
    id: "academic",
    title: "Academic Details",
    description: "CGPA, education and eligibility.",
    icon: GraduationCap,
  },
  {
    id: "skills",
    title: "Skills & Technical",
    description: "Your technical skills and expertise.",
    icon: Code2,
  },
  {
    id: "preferences",
    title: "Placement Preferences",
    description: "Target roles and job preferences.",
    icon: BriefcaseBusiness,
  },
  {
    id: "projects",
    title: "Projects & Links",
    description: "Portfolio, GitHub and achievements.",
    icon: FolderGit2,
  },
  {
    id: "visibility",
    title: "Visibility & Accounts",
    description: "Privacy settings and connected accounts.",
    icon: ShieldCheck,
  },
];

const inputClass =
  "mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20";
const selectClass = `${inputClass} appearance-none`;

function SettingsPage() {
  const { profile, visibility } = useAppState();
  const [active, setActive] = useState<ProfileSectionId>("basic");
  const [draft, setDraft] = useState<AppState["profile"]>(profile);
  const [draftVisibility, setDraftVisibility] = useState(visibility);
  const [saving, setSaving] = useState(false);
  const completion = useMemo(
    () =>
      getProfileCompletion({
        ...draft,
        visibility: draftVisibility,
      } satisfies ProfileCompletionData),
    [draft, draftVisibility],
  );
  const activeIndex = sections.findIndex((section) => section.id === active);

  const update = <K extends keyof AppState["profile"]>(key: K, value: AppState["profile"][K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const save = () => {
    setSaving(true);
    saveProfile(draft);
    setVisibility(draftVisibility);
    window.setTimeout(() => {
      setSaving(false);
      toast.success("Profile changes saved");
    }, 250);
  };

  const cancel = () => {
    setDraft(profile);
    setDraftVisibility(visibility);
    toast.message("Unsaved changes discarded");
  };

  const goTo = (index: number) => {
    const next = sections[index];
    if (next) setActive(next.id);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Edit Profile</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Complete your profile to get better job recommendations and opportunities.
            </p>
          </div>
          <CompletionCard
            percentage={completion.percentage}
            completed={completion.completedSections}
          />
        </div>

        <div className="mt-7 overflow-x-auto pb-2">
          <div className="flex min-w-[720px] items-start">
            {sections.map((section, index) => {
              const status = completion.sections[section.id];
              const done = status === "completed";
              const current = section.id === active;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActive(section.id)}
                  className="group flex min-w-[120px] flex-1 items-start text-center"
                  aria-current={current ? "step" : undefined}
                >
                  <span className="flex flex-1 flex-col items-center">
                    <span
                      className={`grid size-7 place-items-center rounded-full border text-xs font-semibold transition-colors ${
                        done
                          ? "border-success bg-success text-success-foreground"
                          : current
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-surface text-muted-foreground"
                      }`}
                    >
                      {done ? <Check className="size-4" /> : index + 1}
                    </span>
                    <span className="mt-2 text-xs font-medium">{section.title}</span>
                    <span
                      className={`mt-1 text-[11px] ${done ? "text-success" : current ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {done ? "Completed" : current ? "In Progress" : "Not Started"}
                    </span>
                  </span>
                  {index < sections.length - 1 ? (
                    <span className={`mt-3 h-px flex-1 ${done ? "bg-success" : "bg-border"}`} />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 grid overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="border-b border-border bg-surface/50 p-3 lg:border-b-0 lg:border-r lg:p-4">
            <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Profile sections
            </div>
            <nav className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1" aria-label="Profile sections">
              {sections.map((section) => {
                const Icon = section.icon;
                const selected = section.id === active;
                const done = completion.sections[section.id] === "completed";
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActive(section.id)}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors ${
                      selected
                        ? "border-primary bg-primary/10"
                        : "border-transparent hover:bg-accent"
                    }`}
                  >
                    <span
                      className={`grid size-8 shrink-0 place-items-center rounded-full ${selected ? "bg-primary/15 text-primary" : "bg-surface text-muted-foreground"}`}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{section.title}</span>
                      <span className="mt-0.5 block text-[11px] text-muted-foreground">
                        {section.description}
                      </span>
                    </span>
                    {done ? (
                      <Check className="size-4 shrink-0 text-success" />
                    ) : (
                      <span className="size-3 shrink-0 rounded-full border border-muted-foreground/60" />
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          <section className="min-w-0 p-5 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-5">
              <div>
                <h2 className="text-xl font-semibold">{sections[activeIndex]?.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {sections[activeIndex]?.description}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${completion.sections[active] === "completed" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}`}
              >
                {completion.sections[active] === "completed" ? (
                  <Check className="size-3.5" />
                ) : (
                  <span className="size-2 rounded-full bg-primary" />
                )}
                {completion.sections[active] === "completed" ? "Completed" : "In progress"}
              </span>
            </div>

            <div className="pt-6">
              {active === "basic" ? <BasicForm draft={draft} update={update} /> : null}
              {active === "academic" ? <AcademicForm draft={draft} update={update} /> : null}
              {active === "skills" ? <SkillsForm draft={draft} update={update} /> : null}
              {active === "preferences" ? <PreferencesForm draft={draft} update={update} /> : null}
              {active === "projects" ? <ProjectsForm draft={draft} update={update} /> : null}
              {active === "visibility" ? (
                <VisibilityForm
                  visibility={draftVisibility}
                  setVisibility={setDraftVisibility}
                  draft={draft}
                  update={update}
                />
              ) : null}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={activeIndex === 0}
                  onClick={() => goTo(activeIndex - 1)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40 hover:bg-accent"
                >
                  <ArrowLeft className="size-4" /> Previous
                </button>
                <button
                  type="button"
                  disabled={activeIndex === sections.length - 1}
                  onClick={() => goTo(activeIndex + 1)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40 hover:bg-accent"
                >
                  Next <ArrowRight className="size-4" />
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={cancel}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={save}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                >
                  <Save className="size-4" /> {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

function CompletionCard({ percentage, completed }: { percentage: number; completed: number }) {
  return (
    <div className="flex min-w-[270px] items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
      <div
        className="relative grid size-14 place-items-center rounded-full"
        style={{
          background: `conic-gradient(var(--color-success) ${percentage}%, var(--color-border) 0)`,
        }}
      >
        <span className="grid size-10 place-items-center rounded-full bg-card text-xs font-semibold">
          {percentage}%
        </span>
      </div>
      <div>
        <p className="text-sm font-semibold">Profile Completion</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{completed} of 6 sections completed</p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Complete all sections to unlock personalized opportunities.
        </p>
      </div>
    </div>
  );
}

type FormProps = {
  draft: AppState["profile"];
  update: <K extends keyof AppState["profile"]>(key: K, value: AppState["profile"][K]) => void;
};

function Field({
  label,
  id,
  children,
  optional = false,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label} {optional ? <span className="font-normal">(optional)</span> : null}
      </label>
      {children}
    </div>
  );
}

function BasicForm({ draft, update }: FormProps) {
  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Profile photos must be smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") update("avatar", reader.result);
    };
    reader.onerror = () => toast.error("The profile photo could not be read.");
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex items-center gap-4 sm:col-span-2">
        <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-surface text-muted-foreground">
          {draft.avatar ? (
            <img src={draft.avatar} alt="Selected profile" className="size-full object-cover" />
          ) : (
            <UserRound className="size-8" />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold">Profile photo</p>
          <p className="mt-1 text-xs text-muted-foreground">JPG, PNG or WEBP. Maximum 2 MB.</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-primary px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/10">
              <Camera className="size-3.5" />
              {draft.avatar ? "Change photo" : "Upload photo"}
              <input
                className="sr-only"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
              />
            </label>
            {draft.avatar ? (
              <button
                type="button"
                onClick={() => update("avatar", "")}
                className="rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-accent"
              >
                Remove
              </button>
            ) : null}
          </div>
        </div>
      </div>
      <Field label="Full name" id="name">
        <input
          id="name"
          className={inputClass}
          value={draft.name}
          onChange={(e) => update("name", e.target.value)}
        />
      </Field>
      <Field label="Username" id="handle">
        <input
          id="handle"
          className={inputClass}
          value={draft.handle}
          onChange={(e) => update("handle", e.target.value)}
        />
      </Field>
      <Field label="Email address" id="email">
        <input
          id="email"
          type="email"
          className={inputClass}
          value={draft.email}
          onChange={(e) => update("email", e.target.value)}
        />
      </Field>
      <Field label="Phone number" id="phone" optional>
        <input
          id="phone"
          type="tel"
          className={inputClass}
          value={draft.phone}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="+91 ..."
        />
      </Field>
      <Field label="Location" id="location">
        <input
          id="location"
          className={inputClass}
          value={draft.location}
          onChange={(e) => update("location", e.target.value)}
        />
      </Field>
      <Field label="Country" id="country" optional>
        <input
          id="country"
          className={inputClass}
          value={draft.country}
          onChange={(e) => update("country", e.target.value)}
        />
      </Field>
      <Field label="Institution / College" id="institution">
        <input
          id="institution"
          className={inputClass}
          value={draft.institution}
          onChange={(e) => update("institution", e.target.value)}
        />
      </Field>
      <Field label="Department / Branch" id="department">
        <input
          id="department"
          className={inputClass}
          value={draft.department}
          onChange={(e) => update("department", e.target.value)}
        />
      </Field>
      <Field label="Degree" id="degree">
        <select
          id="degree"
          className={selectClass}
          value={draft.degree}
          onChange={(e) => update("degree", e.target.value)}
        >
          <option>B.Tech</option>
          <option>B.E.</option>
          <option>M.Tech</option>
          <option>MCA</option>
          <option>Other</option>
        </select>
      </Field>
      <Field label="Current year" id="currentYear">
        <select
          id="currentYear"
          className={selectClass}
          value={draft.currentYear}
          onChange={(e) => update("currentYear", e.target.value)}
        >
          <option value="">Select year</option>
          <option>1st Year</option>
          <option>2nd Year</option>
          <option>3rd Year</option>
          <option>4th Year</option>
        </select>
      </Field>
      <Field label="Current semester" id="currentSemester" optional>
        <input
          id="currentSemester"
          className={inputClass}
          value={draft.currentSemester}
          onChange={(e) => update("currentSemester", e.target.value)}
        />
      </Field>
      <Field label="Expected graduation year" id="graduationYear">
        <input
          id="graduationYear"
          type="number"
          className={inputClass}
          value={draft.graduationYear}
          onChange={(e) => update("graduationYear", e.target.value)}
        />
      </Field>
      <Field label="About yourself" id="about" optional>
        <textarea
          id="about"
          maxLength={500}
          rows={4}
          className={`${inputClass} resize-y sm:col-span-2`}
          value={draft.about}
          onChange={(e) => update("about", e.target.value)}
        />
        <span className="mt-1 block text-right text-[11px] text-muted-foreground">
          {draft.about.length}/500
        </span>
      </Field>
    </div>
  );
}

function AcademicForm({ draft, update }: FormProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Current degree CGPA" id="cgpa">
        <input
          id="cgpa"
          type="number"
          min="0"
          max="10"
          step="0.01"
          className={inputClass}
          value={draft.cgpa}
          onChange={(e) => update("cgpa", e.target.value)}
          placeholder="0 - 10"
        />
      </Field>
      <Field label="CGPA scale" id="scale">
        <input id="scale" className={inputClass} defaultValue="10" />
      </Field>
      <Field label="10th percentage / CGPA" id="tenth" optional>
        <input id="tenth" className={inputClass} placeholder="e.g. 92%" />
      </Field>
      <Field label="12th / Diploma percentage" id="twelfth" optional>
        <input id="twelfth" className={inputClass} placeholder="e.g. 88%" />
      </Field>
      <Field label="Active backlogs" id="backlogs" optional>
        <input id="backlogs" type="number" min="0" className={inputClass} placeholder="0" />
      </Field>
      <Field label="Academic gap" id="gap" optional>
        <input id="gap" className={inputClass} placeholder="None" />
      </Field>
      <div className="sm:col-span-2 rounded-lg border border-border bg-surface p-3 text-xs text-muted-foreground">
        Enter valid academic values to mark this section complete. Optional fields do not block
        completion.
      </div>
    </div>
  );
}

function TagInput({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
}) {
  const [value, setValue] = useState("");
  const add = () => {
    const next = value.trim();
    if (next && !values.some((item) => item.toLowerCase() === next.toLowerCase()))
      onChange([...values, next]);
    setValue("");
  };
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <div className="mt-1.5 flex min-h-11 flex-wrap gap-2 rounded-lg border border-border bg-surface p-2">
        {values.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary"
          >
            {item}
            <button
              type="button"
              onClick={() => onChange(values.filter((current) => current !== item))}
              aria-label={`Remove ${item}`}
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          className="min-w-28 flex-1 bg-transparent px-1 text-sm outline-none"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          onBlur={add}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

function SkillsForm({ draft, update }: FormProps) {
  return (
    <div className="space-y-4">
      <TagInput
        label="Programming languages"
        values={draft.programmingLanguages}
        onChange={(value) => update("programmingLanguages", value)}
        placeholder="Add a language and press Enter"
      />
      <TagInput
        label="Technical skills"
        values={draft.technicalSkills}
        onChange={(value) => update("technicalSkills", value)}
        placeholder="React, Node.js, SQL..."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Preferred programming language" id="preferred">
          <input id="preferred" className={inputClass} placeholder="JavaScript" />
        </Field>
        <Field label="DSA proficiency" id="dsa">
          <select id="dsa" className={selectClass}>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </Field>
      </div>
    </div>
  );
}

function PreferencesForm({ draft, update }: FormProps) {
  return (
    <div className="space-y-4">
      <TagInput
        label="Target job roles"
        values={draft.targetRoles}
        onChange={(value) => update("targetRoles", value)}
        placeholder="Software Engineer..."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Preferred domains" id="domains">
          <input id="domains" className={inputClass} placeholder="FinTech, SaaS..." />
        </Field>
        <Field label="Preferred locations" id="locations">
          <input id="locations" className={inputClass} placeholder="Bengaluru, Hyderabad..." />
        </Field>
        <Field label="Work mode" id="workMode">
          <select id="workMode" className={selectClass}>
            <option>Hybrid</option>
            <option>Onsite</option>
            <option>Remote</option>
          </select>
        </Field>
        <Field label="Job-seeking preference" id="jobSeeking">
          <select
            id="jobSeeking"
            className={selectClass}
            value={draft.jobSeeking}
            onChange={(e) => update("jobSeeking", e.target.value)}
          >
            <option value="">Select preference</option>
            <option>Actively seeking</option>
            <option>Open to opportunities</option>
            <option>Not looking right now</option>
          </select>
        </Field>
      </div>
    </div>
  );
}

function ProjectsForm({ draft, update }: FormProps) {
  const addProject = () =>
    update("projects", [
      ...draft.projects,
      { id: `project-${Date.now()}`, title: "", description: "", technologies: "" },
    ]);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Resume URL" id="resumeUrl">
          <input
            id="resumeUrl"
            type="url"
            className={inputClass}
            value={draft.resumeUrl}
            onChange={(e) => update("resumeUrl", e.target.value)}
            placeholder="https://..."
          />
        </Field>
        <Field label="Portfolio website" id="portfolioUrl" optional>
          <input
            id="portfolioUrl"
            type="url"
            className={inputClass}
            value={draft.portfolioUrl}
            onChange={(e) => update("portfolioUrl", e.target.value)}
            placeholder="https://..."
          />
        </Field>
        <Field label="GitHub" id="githubUrl" optional>
          <input
            id="githubUrl"
            type="url"
            className={inputClass}
            value={draft.githubUrl}
            onChange={(e) => update("githubUrl", e.target.value)}
            placeholder="https://github.com/..."
          />
        </Field>
        <Field label="LinkedIn" id="linkedinUrl" optional>
          <input
            id="linkedinUrl"
            type="url"
            className={inputClass}
            value={draft.linkedinUrl}
            onChange={(e) => update("linkedinUrl", e.target.value)}
            placeholder="https://linkedin.com/in/..."
          />
        </Field>
      </div>
      <div className="flex items-center justify-between border-t border-border pt-4">
        <div>
          <h3 className="text-sm font-semibold">Projects</h3>
          <p className="text-xs text-muted-foreground">Show recruiters what you have built.</p>
        </div>
        <button
          type="button"
          onClick={addProject}
          className="inline-flex items-center gap-1.5 rounded-lg border border-primary px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/10"
        >
          <Plus className="size-3.5" /> Add project
        </button>
      </div>
      {draft.projects.map((project, index) => (
        <div key={project.id} className="rounded-xl border border-border bg-surface p-4">
          <div className="flex gap-3">
            <FolderGit2 className="mt-2 size-4 text-primary" />
            <div className="min-w-0 flex-1 space-y-3">
              <input
                className={inputClass.replace("mt-1.5 ", "")}
                aria-label="Project title"
                value={project.title}
                onChange={(e) =>
                  update(
                    "projects",
                    draft.projects.map((item, i) =>
                      i === index ? { ...item, title: e.target.value } : item,
                    ),
                  )
                }
                placeholder="Project title"
              />
              <textarea
                className={`${inputClass.replace("mt-1.5 ", "")} resize-y`}
                aria-label="Project description"
                value={project.description}
                onChange={(e) =>
                  update(
                    "projects",
                    draft.projects.map((item, i) =>
                      i === index ? { ...item, description: e.target.value } : item,
                    ),
                  )
                }
                placeholder="Short description"
                rows={2}
              />
              <input
                className={inputClass.replace("mt-1.5 ", "")}
                aria-label="Technologies used"
                value={project.technologies}
                onChange={(e) =>
                  update(
                    "projects",
                    draft.projects.map((item, i) =>
                      i === index ? { ...item, technologies: e.target.value } : item,
                    ),
                  )
                }
                placeholder="Technologies used"
              />
            </div>
            <button
              type="button"
              onClick={() =>
                update(
                  "projects",
                  draft.projects.filter((_, i) => i !== index),
                )
              }
              className="self-start rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              aria-label="Delete project"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      ))}
      {!draft.projects.length ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No projects added yet.
        </div>
      ) : null}
    </div>
  );
}

function VisibilityForm({
  visibility,
  setVisibility: updateVisibility,
  draft,
  update,
}: {
  visibility: AppState["visibility"];
  setVisibility: (value: AppState["visibility"]) => void;
  draft: AppState["profile"];
  update: FormProps["update"];
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {(["public", "private"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              updateVisibility(value);
              update("visibilityConfigured", true);
            }}
            className={`rounded-xl border p-4 text-left ${visibility === value ? "border-primary bg-primary/10" : "border-border hover:bg-accent"}`}
          >
            <div className="flex items-center gap-2">
              {value === "public" ? (
                <Eye className="size-4 text-primary" />
              ) : (
                <Lock className="size-4 text-primary" />
              )}
              <span className="text-sm font-semibold capitalize">{value} profile</span>
              {visibility === value ? <Check className="ml-auto size-4 text-success" /> : null}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {value === "public"
                ? "Anyone with your link can view your portfolio and stats."
                : "Only authorized users can view your profile details."}
            </p>
          </button>
        ))}
      </div>
      <div className="space-y-2 rounded-xl border border-border p-4 text-sm">
        <p className="font-medium">Visibility controls</p>
        {[
          "Public portfolio visibility",
          "Show academic information",
          "Show coding profiles",
          "Show placement preferences",
        ].map((label) => (
          <label key={label} className="flex items-center gap-3 text-muted-foreground">
            <input type="checkbox" defaultChecked className="accent-primary" />
            {label}
          </label>
        ))}
      </div>
      <div className="rounded-lg bg-surface p-3 text-xs text-muted-foreground">
        Private fields are visible only to authorized users according to the application's
        access-control rules. Passwords and access tokens are never stored in your profile.
      </div>
    </div>
  );
}
