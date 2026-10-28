# Product and implementation architecture

## Audit and checkpoints

1. Inspected the root workspace: manuscript/PDF production tools, original sources, local extracted corpus and evidence audit; no web app or package manifest. Preserved those assets.
2. Created an isolated `smart-pyq` application. No unrelated project was replaced and no public deployment was made.
3. Defined learner events, question provenance, stable taxonomy and auditable rules before connecting the UI.
4. Implemented the complete local flow, then added persistence, analytics and mobile navigation.
5. Tested rule transitions, transaction rollback, repeat submissions and API isolation; inspected the live browser flow.

## Product structure

### 1 October teaching and corpus update

Practice now displays `TeacherExplanation` immediately after submission. The same component appears in saved mistakes and study previews. Every starter option has authored simple-English observation, meanings, possible confusion, conditional question/answer rules and a recall step. The main teaching is always open; extra source/all-option details remain optional.

Runtime question retrieval now uses immutable `corpus_question_versions` and published pointers in SQLite. `lib/content.ts` retains the one-time migration seed and pure test defaults; the client imports no question array. `GET /api/questions` supports bounded search/bookmark pages (maximum50). Learning responses carry only current/recent referenced versions (maximum50), latest100attempts/events and server-derived metrics. Full export preserves complete profile history.

`practiceCandidates` orders up to50published candidates by answered exposure and recency in SQLite. The engine builds at most9questions with stage scaffolding and model-error priorities. It supports growing content without endlessly selecting the first IDs, but full multi-family adaptive mastery is still a gap. Existing profiles and attempts remain intact. Attempt rows gain `question_version` default1; sessions pin versions; new attempt evidence pins model/stage/concept/selected-confusion metadata.

Corpus tables contain source metadata, version/source links, canonical fingerprints, immutable question content, publication reviews and import/source audits. Imports require registered sources and remain staged. Reordered options deduplicate by normalized stem/options/answer text. Publication requires all-option teacher notes and an explicit human review record; unverified answer keys stay outside scored practice. This is a local maintenance workflow, not authenticated editorial administration. Existing generated items are migration-preserved without claiming independent human approval.

Teacher lessons are stored inside question versions and returned from that stored content. Changing a question or its teaching requires a new imported version. No runtime external AI call or automatic generation/publication is connected.

Home presents one recommendation, then learning evidence and the topic journey. Practice contains comparison, MCQ, progressive explanation, option analysis and session completion. Papers separates SI and Constable and distinguishes inspected source files from authenticated PYQs. Mentor explains the same rules visible in Performance. Profile contains settings and secondary destinations on mobile.

The three syllabus phases are the top-level topics. Subtopics have IDs such as `TM-02.01`; microconcepts `TM-02.01-M01`; question models `TM-QM-CHRON-01`. Only the employment-safeguard subtopic has scored content in this slice. Pending topics show neither fabricated mastery nor fake question counts.

## Design system

- Background `#f8f9f6`; surface `#ffffff`; ink `#202e32`; teal `#17695b`; mint `#eaf2ec`; amber `#97652b`.
- Manrope headings and DM Sans body text, with local system fallbacks if Google Fonts cannot load.
- An anchored desktop sidebar and quiet content rail. On mobile, the same hierarchy collapses into one column with five bottom destinations.
- The home comparison illustration consists of real HTML notes, showing the old-rule/new-framework relationship; no image-only UI.
- Structure: `navigation | [one next action + session plan] / [four evidence measures] / [chronological topic journey + recall]`.
- The palette follows the user's soft-neutral brief. We avoid an oversized dashboard statistic as the hero; the distinction the learner needs to resolve is the hero.
- Semantic radios, native disclosure elements, labelled confidence buttons, focus outlines, text plus symbols for results, reduced motion, and mobile controls.

## Runtime boundary

React client → `POST /api/learning` → Zod validation → same-origin check → cookie profile → SQLite `BEGIN IMMEDIATE` → pure learning engine → normalized writes + aggregate snapshot → derived metrics/recommendation → client.

The server computes the answer key comparison. The browser reports confidence, hints, answer changes and measured active-page time; these are educational signals, not tamper-resistant exam proctoring. Browser-visible content contains study answer keys, so this is not a secure examination system.

`GET /api/learning` restores or creates a local demo profile. `POST profile` creates an additional profile without deleting another. `GET /api/export` returns only the cookie's profile. `/api/paper` serves one fixed, known source path and takes no arbitrary filesystem input.

Database writes serialize and roll back as a unit. Answer request IDs are idempotent. Session ID + current question matching rejects stale tabs. No client-provided learner ID determines access. Session snapshots survive reload; an unsubmitted option selection is not persisted. A submitted answer advances the stored queue, so a resumed session opens its next question.

## Evidence and learner state

Attempts retain selected option, correctness, confidence, active response time, first-selection time (a **proxy**, not measured cognitive recognition), change count, hint flag, timestamp, session and demo attribution. Exposure labels in this slice count scored attempts plus the currently open question; viewed-but-abandoned exposures remain events and do not falsely become mastery evidence.

Metrics include first attempt/retry/overall/recent accuracy, hint-independent accuracy, per-model accuracy and speed, median/mean time, confidence gap and high-confidence errors. The UI separates actual recall accuracy from “not tested”. There is no scientifically asserted single mastery score. Unseen models stay unassessed.

States currently produced are UNSEEN, PRACTISING, REPAIRING, RECALL_READY and MASTERED_STABLE. The PostgreSQL enum reserves the full requested lifecycle, but unused transitions are not claimed as implemented.

### Auditable rules (version 1.1.0; prior coaching thresholds retained)

| Evidence                                                                                                                    | Intervention                                                                 |
| --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Two incorrect selections explicitly mapped to the other concept                                                             | Comparison + repair plan                                                     |
| Wrong answer                                                                                                                | Prioritize an unused matching-model question; recall in 15 minutes           |
| Correct after hint                                                                                                          | Keep independence unresolved; recall in 15 minutes                           |
| Correct independent response                                                                                                | Schedule recall in one day                                                   |
| At least six independent recent attempts, >=75% correct, last three correct, >=3 models, and a correct changed-wording item | RECALL_READY; reduce immediate repetition and recommend the scheduled recall |
| Successful recall at/after its due time                                                                                     | Double the interval, capped at 14 days                                       |
| Recall failure                                                                                                              | Reset to a 15-minute repair retrieval                                        |
| Two successful recalls on separate dates, each after a day of spacing, plus current improvement                             | Eligible for stable mastery                                                  |

Thresholds are coaching heuristics, configurable in `lib/engine.ts`, not empirical guarantees. Correctness does not establish reading care, concentration or a specific misconception. Wrong-option mappings supply possible confusion evidence. Timing alone does not establish a diagnosis.

### Event taxonomy

Implemented: session_started, session_ended, question_viewed, answer_selected, answer_changed, answer_submitted, confidence_selected, hint_requested, explanation_opened, explanation_section_opened, comparison_opened, bookmark_changed, topic_opened, mentor_recommendation_opened, app_backgrounded, app_returned.

Reserved for future interventions: topic_abandoned, revision_started/completed, mentor_recommendation_completed and paper-mode events. Activity is stored locally. No camera, microphone, cross-site monitoring or freeform keystroke logging. Visibility events pause the active timer; a backgrounded page is not called “loss of concentration”. The aggregate retains the latest 1,000 events; normalized event records are retained in SQLite.

## Production roadmap

1. Verify current SI/Constable notification scope and authenticate paper/key pairs, retaining file hashes, question numbers, page ranges and editorial sign-off.
2. Implement authenticated PostgreSQL persistence from the supplied relational design; add row authorization, consent/deletion/recovery, backups, metrics and migrations.
3. Expand the reviewed content graph, prerequisites and multi-family selection. The current engine handles one family; it does not claim full prerequisite repair or interleaving across the syllabus.
4. Add assessment-grade timing and paper sessions only after an authenticated corpus exists. Current “timed practice” is an elapsed timer, not a full-paper simulation.
5. Add bilingual editorial content and accessibility audit with representative Android devices and screen readers.
6. If an AI tutor is connected, constrain it to retrieved reviewed passages, require question-level citations, decline unsupported historical claims, and log intervention reasons. The current mentor is deterministic and requires no AI credentials.
