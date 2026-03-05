# plan.md

## 1) Objectives
- Deliver a child-first **AI + Computer Unplugged** training platform (ages 5–16) with:
  - A **ready-made library (15–20+)** of unplugged activities across Algorithms, AI/ML concepts, Data & Logic.
  - **Teacher-created activities** (images + instructions) alongside curated content.
  - **Mixed modality**: digital interactives (drag/drop, quizzes) + offline instructions with “mark complete”.
  - **Roles**: Student, Parent, Teacher, Admin with parent-child linking.
  - **Progress + gamification** (badges, points, streaks) and **PDF certificates**.
  - **Payments/subscriptions** (Stripe + optional PayPal/QR workflow) to unlock premium content.
- **Production readiness** (now that deployment is live):
  - Stable Dockerized deployment on DigitalOcean.
  - Clear operational runbook (logs, rebuild, backups).
  - Secure secrets management + production payment configuration.
  - Domain + HTTPS.

## 2) Implementation Steps

### Phase 1 — Core POC (Isolation): Stripe + Certificates + Activity Completion ✅ COMPLETED
**Goal:** Prove the failure-prone integrations and core learning loop before building full UX.

**STATUS:** ✅ ALL TESTS PASSED (5/5)
- ✅ Stripe checkout session creation
- ✅ Webhook handling and subscription activation
- ✅ Activity completion and progress tracking
- ✅ PDF certificate generation (feature implemented; deployment may keep it disabled if weasyprint not installed)
- ✅ Database seeding of curated activities

---

### Phase 2 — V1 App Development (MVP, core UX + curated library) ✅ COMPLETED
**Scope:** Build a cohesive app around the proven core; keep it MVP but production-quality.

**User stories**
1. As a student, I can browse activities by age group/topic/difficulty and start one quickly.
2. As a student, I can do a digital interactive or follow unplugged instructions and mark complete.
3. As a parent, I can link a child and see their progress, streak, and recent activity.
4. As a teacher, I can create a new unplugged activity with images and assign it to a class.
5. As an admin, I can manage activities (publish/unpublish) and view platform analytics.

**Backend (FastAPI + MongoDB)**
- Data models: Users (roles), ParentChildLink, Activities (curated + custom), Completions, Progress, Badges, Certificates, Subscriptions.
- APIs (MVP):
  - Auth (JWT) + role guards.
  - Activities: list/search/filter, detail, create (teacher), publish/unpublish (admin), image upload.
  - Completion: mark-complete, progress aggregation.
  - Gamification: points/badges updates.
  - Certificates: generate/download PDF (implemented; runtime support depends on server deps).
  - Subscriptions: plans, checkout, webhook, access gating (free vs premium).
- Seeded curated unplugged activities.

**Frontend (React + Nginx)**
- Child-first UI system: big buttons, friendly illustrations, clear icons.
- Pages (MVP):
  - Landing + pricing, auth, role-based dashboards.
  - Student: Activity Library, Activity view/player, Progress + badges.
  - Parent: Linked child selector, progress overview.
  - Teacher: Activity builder.
  - Admin: content moderation + analytics.
- Implemented interactive templates (at least 2 types):
  - Drag/drop sorting (algorithm concept)
  - Pattern recognition / classification quiz

**Checkpoint & Testing (end of Phase 2)** ✅ COMPLETED
- ✅ Backend complete with all models and APIs
- ✅ Frontend complete with child-first design
- ✅ 18 curated activities seeded (11 free, 7 premium)
  - Algorithms: 7 activities
  - AI/ML Concepts: 6 activities
  - Data & Logic: 5 activities
- ✅ Testing complete: all core flows working
  - ✅ Registration & authentication (all roles)
  - ✅ Activity browsing and completion
  - ✅ Progress tracking and badges
  - ✅ Subscription system integration
  - ⚠️ Certificate PDF generation code exists; production enablement depends on server libraries (see Phase 2.5)

---

### Phase 2.5 — Deployment & Go-Live Hardening ✅ COMPLETED (Major Milestone)
**Goal:** Get the app running reliably on the DigitalOcean server with Docker, and ensure core runtime stability.

**STATUS:** ✅ LIVE
- ✅ Deployment stabilized (backend no longer crash-loops)
  - Fixed crash source: `weasyprint/jinja2` imports and dependency mismatch.
  - Kept certificate generation gracefully disabled when `weasyprint` isn’t installed.
- ✅ Live environment running on DigitalOcean
  - App accessible at **http://139.59.254.77**
  - Containers up: `frontend`, `backend`, `mongodb`
- ✅ Database seeded in production (18 activities)
  - Seed script added into backend container scope (`backend/seed_activities.py`) and executed successfully.

---

### Phase 3 — Expansion + Hardening (Next)
**User stories**
1. As a student, I can earn themed certificates per level (Foundation/Development/Mastery).
2. As a teacher, I can reuse activity templates and duplicate/edit activities quickly.
3. As a parent, I receive a weekly progress report view (in-app) per child.
4. As an admin, I can manage refunds/cancellations and see payment events.
5. As a student, I can rate an activity and leave simple feedback.

**Steps**
- Product/content
  - Add more curated activities (target: 30–60 total; keep balance across age/topic).
  - Add 1–2 interactive templates (decision-tree builder, binary card game).
  - Add activity rating/feedback + moderation.
- Platform hardening
  - Improve analytics: funnels, time-spent estimates, top activities.
  - Tighten authorization + validation; improve error handling and audit logs.
  - Second E2E testing pass and performance checks.

---

### Phase 4 — Polish, Accessibility, Content Growth
**User stories**
1. As a young child, I can use the app comfortably on a tablet with large-touch UI.
2. As a student, I can follow audio-friendly instructions (optional) for unplugged activities.
3. As a teacher, I can export class progress as CSV.
4. As an admin, I can version activities and roll back changes.
5. As the platform, I can support new content packs without redeploying.

**Steps**
- Accessibility pass (contrast, font sizes, keyboard support).
- Content pack structure + import/export.
- UI polish + animations; refine onboarding flows.
- Final E2E testing + regression suite.

## 3) Next Actions (Immediate)
1. **Security/Secrets (P0)**
   - Rotate and set a strong `SECRET_KEY` in production.
   - Ensure production env vars are set via server `.env` (not default fallbacks).
   - Lock down MongoDB port exposure if not needed publicly.
2. **Payments Go-Live (P0/P1)**
   - Decide Stripe mode (**test vs live**) and set production keys.
   - Configure and verify Stripe webhook signing secret (recommended) and endpoint.
   - Confirm PayPal/QR flow requirements (optional).
3. **Domain + HTTPS (P1)**
   - Point domain to the DigitalOcean droplet.
   - Add SSL via Let’s Encrypt (Nginx) and redirect HTTP→HTTPS.
4. **Certificates in Production (P1)**
   - Decide whether to enable PDF generation on the server.
   - If yes: add `weasyprint` + OS deps to Docker image (or switch to a lighter PDF generator), then re-enable.
5. **Operational Runbook (P1)**
   - Document: deploy steps, rollback, logs (`docker compose logs`), backups for MongoDB, and monitoring.

## 4) Success Criteria
- ✅ App is reachable publicly and stable: **http://139.59.254.77**
- ✅ All roles can register/login and see correct role-based experiences.
- ✅ Curated unplugged activities exist, searchable/filterable, and completable.
- ✅ Teachers can create/publish activities with image upload.
- ✅ Student progress updates correctly; badges/points work.
- ✅ Subscriptions unlock premium content; webhook processing is reliable.
- ⚠️ Certificates generate as valid PDFs in production (enablement decision + server deps required).
- ✅ Responsive, kid-friendly UI works well on tablet/mobile.
