# Sadhana — Telangana Police Smart PYQ Learning

A working, mobile-first vertical slice for Telangana Movement & State Formation. The existing handbook, PDFs, manuscripts and research files remain unchanged.

## Run locally

Requires Node.js 24 or later (uses `node:sqlite`).

```powershell
cd 'C:\Telangana Moment and State formation\smart-pyq'
npm install
npm run dev
```

Open http://127.0.0.1:3000. For a production build: `npm run build`, then `npm start`.

## What works

- Home recommendation → comparison → question → confidence → answer → immediate personal-teacher explanation → optional source / all-option analysis → follow-up → performance → scheduled recall.
- A labelled demo learner starts with five evidence records (40% accuracy), including two repeated Mulki/Six-Point confusions and a slow correct response. “Start fresh” creates an independent empty profile.
- Ten generated practice questions across six models. Stable question, topic, concept and model IDs; source/page notes and per-option rationales.
- Three recognition questions, five application questions and one changed-wording question; the tenth question is a separate recall.
- Correctness and hint use change the next recall interval. Wrong answers reorder remaining questions toward the same model. Independent improvement requires varied models and changed wording. It changes the next recommendation to spaced retrieval.
- Topic map, mistake book, bookmarks, history, evidence-based mentor, source library, SI paper inspection, confidence and model analytics, local data export.
- Server-side scoring, validated requests, transactional writes, duplicate-answer protection, session conflict detection and cookie-isolated local profiles.
- SQLite persistence survives refreshes and server restarts. No API key or external model service is required.
- Versioned database corpus, source registry, reordered-option deduplication, staged JSON imports and explicit publication review. Attempts retain scoring versions; questions include immutable all-option teacher notes.
- Bounded server question search/bookmarks and exposure-aware session candidates. The full starter bank is no longer in the client JavaScript.

## Content integrity

Every scored question is labelled **Generated practice**, never “verified PYQ”. Source verification supports the underlying facts, not a claim that the authored wording appeared in an exam. The local SI 2016 paper can be inspected, but official provenance and final-key authentication remain outstanding. Constable papers are not fabricated. Full-paper scoring is deliberately unavailable until verified papers exist.

The movement taxonomy uses the official 2022 SI syllabus as a reproducible baseline; the existing local 2026 SI extract supports the same three phases, but its retrieval chain and the current Constable notification still need release verification. The detailed subtopics are editorial taxonomy. No claim of complete scored syllabus coverage is made.

## Validation

```powershell
npm test
npm run test:api # requires the local server on port 3000
npm run typecheck
npm run build
```

See [QA.md](docs/QA.md) for browser checks and limitations. See [ARCHITECTURE.md](docs/ARCHITECTURE.md), [CONTENT.md](docs/CONTENT.md), and [schema.sql](db/schema.sql).

Current work and test evidence live in [PROJECT_STATE.md](docs/PROJECT_STATE.md) and [VALIDATION_REPORT.md](docs/VALIDATION_REPORT.md). The recommended product learning plan is [LEARNING_STRATEGY.md](docs/LEARNING_STRATEGY.md). Start future sessions with [PROJECT_CONSTITUTION.md](docs/PROJECT_CONSTITUTION.md).

For corpus maintenance, run `npx tsx scripts/corpus.ts help`. Import stages content; publication requires a separate review. Do not publish synthetic test fixtures into the real database.

## Scope and production boundary

This is the requested first complete learning slice, not the entire 35-screen platform. The deployed data adapter is SQLite; `db/schema.sql` defines the intended normalized PostgreSQL schema and is not a connected cloud database. Authentication, account recovery, cross-device sync, editor workflows, a fully reviewed question corpus, Telugu translations, full-paper exam simulation, additional confusion families, current-affairs ingestion and optional grounded AI responses are subsequent work.

Bind locally by default. Before public hosting, connect authenticated accounts, authorization policies, bounded rate limits, HTTPS, backups, a production database and editorial approval. Anonymous profile cookies are bearer access to local learning history, not a production account system. Clearing the cookie starts a new profile. Old profiles are preserved, not automatically restored.

## Local storage

`data/learning.sqlite` and its SQLite WAL files hold local data. Keep the directory persistent. `PYQ_DATA_DIR` selects a different directory. It is excluded from version control. The client never receives database access. `PYQ_HTTPS=true` enables Secure cookies for an HTTPS host.

This release keeps an aggregate learner snapshot and normalized operational projections in one transaction. It is intentionally simple for a single-process local application. Node currently marks `node:sqlite` experimental; the pinned engine range and tests make this explicit.
