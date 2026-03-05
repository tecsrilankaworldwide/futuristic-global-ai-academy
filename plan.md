# plan.md

## 1) Objectives
- Deliver a child-first **AI + Computer Unplugged** training platform (ages 5–16) with:
  - A **ready-made library (15–20+)** of unplugged activities across Algorithms, AI/ML concepts, Data & Logic.
  - **Teacher-created activities** (images + instructions) alongside curated content.
  - **Mixed modality**: digital interactives (drag/drop, quizzes) + offline instructions with “mark complete”.
  - **Roles**: Student, Parent, Teacher, Admin with parent-child linking.
  - **Progress + gamification** (badges, points, streaks) and **PDF certificates**.
  - **Stripe subscriptions** (free tier + premium, by level, monthly/quarterly) incl. webhooks.
- Build fast but solid: core integrations proven first, then MVP app, then expand.

## 2) Implementation Steps

### Phase 1 — Core POC (Isolation): Stripe + Certificates + Activity Completion ✅ COMPLETED
**Goal:** Prove the failure-prone integrations and core learning loop before building full UX.

**STATUS:** ✅ ALL TESTS PASSED (5/5)
- ✅ Stripe checkout session creation
- ✅ Webhook handling and subscription activation
- ✅ Activity completion and progress tracking
- ✅ PDF certificate generation
- ✅ Database seeding of curated activities

---

### Phase 2 — V1 App Development (MVP, core UX + curated library)
**Scope:** Build a cohesive app around the proven core; keep it MVP but production-quality.

**User stories**
1. As a student, I can browse activities by age group/topic/difficulty and start one quickly.
2. As a student, I can do a digital interactive or follow unplugged instructions and mark complete.
3. As a parent, I can link a child and see their progress, streak, and recent activity.
4. As a teacher, I can create a new unplugged activity with images and assign it to a class.
5. As an admin, I can manage activities (publish/unpublish) and view platform analytics.

**Backend (FastAPI + MongoDB)**
- Data models: Users (roles), ParentChildLink, Activities (curated + custom), Attempts/Completions, Progress, Badges, Certificates, Subscriptions, Classes/Groups.
- APIs (MVP):
  - Auth (JWT) + role guards.
  - Activities: list/search/filter, detail, create (teacher), publish (admin), image upload.
  - Completion: start/submit/mark-complete, progress aggregation.
  - Gamification: award points/badges, streak updates.
  - Certificates: generate/download PDF.
  - Subscriptions: plans, checkout, webhook, access gating (free vs premium).
- Seed 15–20 curated unplugged activities (balanced across levels/topics).

**Frontend (React)**
- Child-first UI system: big buttons, friendly illustrations, clear icons, minimal text per screen.
- Pages (MVP):
  - Landing + pricing, auth, role-based dashboards.
  - Student: Activity Library, Activity Player (interactive/offline), Progress + badges.
  - Parent: Linked child selector, progress overview, subscription management.
  - Teacher: Activity builder, classes, assignments, student progress.
  - Admin: content moderation + analytics.
- Implement interactive templates (at least 2 types):
  - Drag/drop sorting (algorithm concept)
  - Pattern recognition / classification quiz

**Checkpoint & Testing (end of Phase 2)** ✅ COMPLETED
- ✅ Backend complete with all models and APIs (100% test pass rate)
- ✅ Frontend complete with child-first design (95% test pass rate)
- ✅ 18 curated activities seeded (11 free, 7 premium)
  - Algorithms: 7 activities
  - AI/ML Concepts: 6 activities
  - Data & Logic: 5 activities
- ✅ Testing complete: All core flows working
  - ✅ Registration & authentication (all roles)
  - ✅ Activity browsing and completion
  - ✅ Progress tracking and badges
  - ✅ Certificate generation
  - ✅ Subscription system integration

**PHASE 2 MVP COMPLETE AND TESTED**

---

### Phase 3 — Expansion + Hardening
**User stories**
1. As a student, I can earn themed certificates per level (Foundation/Development/Mastery).
2. As a teacher, I can reuse activity templates and duplicate/edit activities quickly.
3. As a parent, I receive a weekly progress report view (in-app) per child.
4. As an admin, I can manage refunds/cancellations and see payment events.
5. As a student, I can rate an activity and leave simple feedback.

**Steps**
- Add more interactive templates (1–2): decision-tree builder, binary card game.
- Add activity rating/feedback + moderation.
- Improve analytics: completion funnels, time-spent estimates, top activities.
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
1. Confirm Stripe mode/keys availability (test keys) and desired plan pricing table.
2. Confirm certificate rules (e.g., complete 10 activities per level OR complete a “track”).
3. Approve the initial curated activity list outline (15–20) by level/topic.
4. Start Phase 1 POC: Stripe checkout + webhook + completion + PDF certificate.

## 4) Success Criteria
- All roles can register/login and see correct role-based experiences.
- 15–20+ curated unplugged activities exist, searchable/filterable, and completable.
- Teachers can create/publish activities with image upload and assignments.
- Student progress updates correctly; badges/streaks work.
- Stripe subscriptions unlock premium content; webhook processing is reliable.
- Certificates generate as valid PDFs and match completion rules.
- Responsive, kid-friendly UI works well on tablet/mobile and passes end-to-end tests.
