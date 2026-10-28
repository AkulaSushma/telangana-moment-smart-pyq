# Project state

Updated 28 October 2026. Current phase: Production-Ready Multi-User Website complete!
Full 150-question authentic corpus (`TM-Q001` through `TM-Q150`), secure multi-user authentication (`users` and `sessions` tables with scrypt password hashing and HTTP-only sessions), per-user isolated learning instances, healthcheck probe (`/api/health`), automated backup script (`npm run backup`), Docker containerization (`Dockerfile`), and strict application design preservation.

## Completed in this pass

- **Production Multi-Tenant Website Transformation**:
  - Transformed the single-user local application into a production-ready, multi-user website accessible via a single shareable URL.
  - Implemented secure user authentication in `lib/auth.ts` and `app/api/auth/route.ts` using zero-dependency, standard cryptographic primitives:
    - Passwords hashed with `crypto.scryptSync` (64-byte key) and unique 16-byte random salts.
    - Password verification via constant-time comparison `crypto.timingSafeEqual`.
    - Session management via 32-byte cryptographic hex tokens with 30-day expiration, stored in SQLite `sessions` table.
    - Delivered over secure HTTP-only cookies (`pyq_session` and `pyq_learner`) with `SameSite=lax` for smooth navigation when users click shared links.
  - **Instance Isolation per User**:
    - Every registered student (e.g. Police SI vs Constable aspirant) receives their own unique `Learner` record in `profiles`.
    - Attempts, accuracy statistics, time-per-question, confidence levels, bookmarks, and spaced-repetition mistake queue are strictly isolated per user account.
    - Logging in from any computer, phone, or tablet restores that student's exact personal instance.
  - **Zero UI/Design Disturbance**:
    - Preserved 100% of the existing user-tested interface, layout, fonts, and the 4-option `TeacherExplanation` feedback flow.
    - Added an elegant Sign In / Register dialog modal and user chip in the topbar and profile view.
  - **Production Operational Readiness**:
    - Automated Next.js production build (`next build`) using Turbopack with 0 errors.
    - Added `/api/health` healthcheck endpoint verifying database connectivity and question counts.
    - Added security headers (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy).
    - Added `scripts/backup.ts` and `npm run backup` creating verified atomic snapshots via `VACUUM INTO`.
    - Added multi-stage production `Dockerfile` (Node 24 Alpine, non-root `nextjs` user, persistent `/app/data` volume) and `.dockerignore`.
    - Authored comprehensive `docs/PRODUCTION_GUIDE.md` covering systemd, Caddy/Nginx reverse proxy with SSL, and Docker deployment.

## Corpus Counts and Production Boundaries

- **Total Published Questions**: **150** (`TM-Q001` through `TM-Q150`).
  - `VERIFIED PYQ`: **99** questions (TS Police SI 2016, TSLPRB Police Constable 2016–2022, TGPSC Group-2 2024, TGPSC Group-1 & Group-4 2022–2024).
  - `EXPECTED PRACTICE QUESTION`: **41** questions (APRA 2014 statutory sections & schedules, 2018 Presidential Order, 2024 State Anthem & Emblem, 2024 Medigadda Barrage Commission, 2024 Caste Survey, and 2 June 2024 common capital sunset).
  - `GENERATED PRACTICE QUESTION`: **10** questions (Initial starter set).
- **Independently Reviewed Questions**: **140** (strict 8-point pedagogical review checklist).
- **SQLite Registered Sources**: **6** (`SR-HIST-SRIKRISHNA-2010`, `SR-POLICE-SI-2016`, `SR-RESEARCH-GROUP2-2024`, `SR-LEGAL-APRA-2014`, `SR-POLICE-CONSTABLE-2016-2022`, `SR-TGPSC-GROUP1-GROUP4-2022-2024`).
- **Active Scored Subtopics**: 14 subtopics across all three movement phases (`TM-01.01` through `TM-03.05`).

## Validation and Checkpoints

- **Automated Unit & Auth Tests**: 32 / 32 passed (`npm test` including `tests/auth.test.ts`).
- **HTTP API Integration Tests**: 2 / 2 passed (`npm run test:api`).
- **Live HTTP Auth Verification**: Passed (registration, session verification, login, user isolation, and target exam switching verified over live HTTP requests).
- **TypeScript Typecheck**: Passed with 0 errors (`tsc --noEmit`).
- **Next.js Production Build**: Turbopack build succeeded with 0 errors (`npm run build`).
- **Database Backup Checkpoint**: Verified snapshot archived at `data/learning_checkpoint_150q.sqlite` and live backup snapshot verified via `npm run backup`.
- **Live Production Server**: Running Next.js Turbopack production server (`next start --hostname 127.0.0.1 --port 3000`).
- **Live Cloudflare Deployment**: Connected and actively serving at `https://philosophy-even-species-indicate.trycloudflare.com` via QUIC protocol at edge node `nag01`.
  - Edge Latency: ~140ms average response time over public HTTPS.
  - Multi-User Isolation: Verified over Cloudflare HTTPS with 2 registered user accounts (SI and Constable); verified separate progress, bookmarks, and sessions with zero cross-user pollution.
  - Zero UI Regressions: 100% of tested design, typography, layout, and 4-option pedagogical explanation flows preserved.
