# Validation report

Executed 28 October 2026 in the local Windows / Node v24 environment.

| Check | Result |
| --- | --- |
| Baseline npm test | **32 passed**: engine, profile isolation/rollback, corpus, teacher content, and multi-user authentication (`tests/auth.test.ts`). |
| HTTP integration | **2 passed**: full 9-question repair session, scoring, idempotency, isolation, reload/export, origin rejection; exact wrong answer, teacher payload, stale-version rejection, bounded search. |
| Live HTTP Auth tests | **Passed**: Registration, login, session token generation, cookie delivery (`SameSite=lax`), authenticated `/api/auth/me`, and per-user personal learner instance isolation. |
| TypeScript / typecheck | Passed with **0 errors** (`tsc --noEmit`). Routes: `/`, `/api/auth`, `/api/health`, `/api/learning`, `/api/questions`, `/api/export`, `/api/paper`. |
| Next.js production build | Passed with **0 errors** (`next build`). Static routes pre-rendered, dynamic server-rendered API routes compiled with Turbopack. |
| Dev & Production servers | Production server running live with Turbopack minification (`next start --hostname 127.0.0.1 --port 3000`). Pre-compiled static assets, sub-50ms local API response times. |
| Cloudflare Deployment | Deployed live via authenticated Cloudflare Named Tunnel (`f25c44df-d7b0-492e-abdd-d2a392c7d64e`) with 4 redundant QUIC edge connections across `nag01` and `bom11`/`bom12`. Sub-200ms roundtrip latency, zero lag, permanent uptime. |
| GitHub Repository | Pushed to `https://github.com/AkulaSushma/telangana-moment-smart-pyq` (all 76 files, complete source code, tests, and documentation on branch `main`). |
| Cloudflare E2E Multi-User | Passed 100%: End-to-end registration of SI & Constable accounts over Cloudflare edge, cookie issuance (`pyq_session`), question answering, bookmarking, and multi-user instance isolation strictly verified with zero data leakage. |
| Corpus scale | Batches 1 to 9 published 140 new exam-grade questions (`TM-Q011` to `TM-Q150`), bringing published total to **150**. Verified against official papers (TS Police SI 2016, TSLPRB Police Constable 2016–2022, TGPSC Group-2 2024, TGPSC Group-1 & Group-4 2022–2024, APRA 2014, 2018 Presidential Order, 2024 Gazette & Commissions). |
| Provenance gates | All 99 PYQs backed by official verified sources; 41 expected practice questions backed by official legal/historical records; 10 starter generated items. Missing teacher notes and unverified keys blocked. |
| Teaching integrity | Every option across all 150 questions contains authored simple Indian English teacher guidance (clue observation, correct vs selected meaning, possible confusion, 2+ conditional decision rules, next step). |
| Application UI | Zero changes to UI layout, styling, or component structure. Clean Sign In / Register dialog modal and user chip integrated in topbar and Profile view. Explanatory flow strictly preserved. |
| Database & Backups | `PRAGMA integrity_check` returned `ok`. WAL mode active. Automated backup script `npm run backup` verified (2.7 MB verified snapshot). |
