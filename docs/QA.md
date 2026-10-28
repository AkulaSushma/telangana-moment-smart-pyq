# Validation record

## Automated checks

- Engine tests: fresh learner, evidence-triggered repair, exact 3+5+1 session composition, delayed recall exclusion, wrong-answer scheduling, duplicate request idempotency, independent improvement, hint dependence, early/due recall timing, per-model accuracy, remaining-queue adaptation, content completeness and bounded event window.
- Database test: profile isolation, independent demo IDs, durable reads and transaction rollback.
- HTTP integration: request validation, real answer scoring, duplicate POST replay, complete repair session, changed recommendation, GET persistence, separate cookie profiles, JSON export, cross-origin rejection.
- TypeScript type checking and optimized Next.js production build.

## Live browser checks

- Home displays labelled seeded history with 40% accuracy and a recommendation based on two specific wrong-option selections.
- Start drill → comparison → question, with 3rd exposure visible.
- High-confidence wrong Mulki answer → corrective response, accurate key, saved response timing and short revision schedule.
- Explanation → examiner trap → each option's attraction/rationale → concept comparison → source notes.
- Bookmark writes successfully; the button changes to Remove bookmark.
- Next question is a different recognition item with deterministically rotated presentation order; canonical option IDs remain unchanged for persistence.
- Responsive Android-width layout includes readable question text, single-column options and five-item bottom navigation.
- Checked 360, 390, 430 and 1440-pixel viewport settings: rendered document width did not exceed available content width. Native scrollbar space accounts for some smaller reported content widths.
- Reload preserved 2 of 9 completed questions and the bookmark. Stopped the development server, built production, started `npm start`, and confirmed the same saved session and next question survived the process restart.
- Completed all nine questions through visible browser controls. The session ended at 8/9 correct with the last eight correct (100% recent accuracy). Changed-wording success triggered RECALL_READY, reduced immediate repetition and scheduled retrieval for the following day.
- The final automated run passed 15 engine/database tests and the HTTP integration test; the optimized production build and TypeScript validation passed. HTTP integration also passed against the restarted production server.

## Findings resolved during implementation

- Corrected SQLite INSERT placeholder count.
- Added a non-destructive migration for the early event ID type.
- Corrected local same-origin validation to compare the request Host rather than Next's internal reconstructed hostname.
- Corrected the Mulki source locator to chapter 5 §5.2.01–5.2.03.
- Required changed-wording and model coverage before reducing immediate practice.
- Preserved canonical option indices while varying learner-facing answer positions.
- Added secondary learning destinations under Profile for mobile access.
- Strengthened secondary-text contrast and minimum action control height.

## Limits of verification

The browser checks exercise a local Chromium surface, not physical Android hardware. No screen-reader audit, PostgreSQL execution, public deployment, real account authentication, external AI provider, complete syllabus corpus, or full-paper scoring is claimed. SQLite and the target PostgreSQL schema are distinct adapters; only SQLite is connected and exercised here. Automated response-time inputs are test fixtures; live browser inputs come from active-page timing. No anti-cheating guarantee is claimed.
