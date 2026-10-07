# Backend Schemas

These files contain the backend domain schema definitions grouped by feature.
The public API routes and request/response references are documented in
[`../../openapi.yaml`](../../openapi.yaml).

| File | Schemas |
| --- | --- |
| `auth.yaml` | RegisterRequest, LoginRequest, TokenPair, AuthResponse |
| `profile.yaml` | User, ProfileUpdateRequest, PlatformConnectionRequest, PlatformConnection, Portfolio, Dashboard |
| `learning.yaml` | Difficulty, QuestionStatus, Question, TrackedQuestion, Sheet, CreateSheetRequest, NoteRequest, Note |
| `events.yaml` | Contest, CalendarEventRequest, CalendarEvent, LeaderboardEntry |
| `placement.yaml` | Eligibility, JobDescription, DriveRequest, PlacementDrive, DriveDocument, ApplicationRequest, DriveApplication |
| `roadmap.yaml` | RoadmapGenerationRequest, RoadmapGenerationJob, RoadmapSummary, Roadmap, RoadmapSection, Milestone, RoadmapResource |
| `support.yaml` | Faq, FeedbackRequest, Feedback |
| `common.yaml` | Pagination and paginated response schemas |